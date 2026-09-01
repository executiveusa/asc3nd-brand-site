begin;

alter table asc3nd.import_contacts_staging
  add column if not exists review_status text not null default 'pending'
    check (review_status in ('pending','verified','rejected','promoted')),
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists reviewed_at timestamptz;

create or replace function public.asc3nd_staff_recovery_queue()
returns table(
  id uuid,
  source_type text,
  source_record_key text,
  confirmation_code text,
  name text,
  email text,
  phone text,
  preferred_language text,
  relationship_interest text,
  children_count integer,
  age_range text,
  arrival_window text,
  data_quality text,
  review_required boolean,
  review_status text,
  reviewed_at timestamptz,
  promoted_person_id uuid
)
language sql
stable
security definer
set search_path = pg_catalog, public, asc3nd
as $$
  select
    s.id, s.source_type, s.source_record_key, s.confirmation_code,
    s.name, s.email, s.phone, s.preferred_language, s.relationship_interest,
    s.children_count, s.age_range, s.arrival_window, s.data_quality,
    s.review_required, s.review_status, s.reviewed_at, s.promoted_person_id
  from asc3nd.import_contacts_staging s
  where asc3nd_private.has_org_role(s.organization_id, array['owner','admin','program_manager'])
  order by
    case s.review_status when 'pending' then 0 when 'verified' then 1 when 'promoted' then 2 else 3 end,
    s.created_at;
$$;

revoke all on function public.asc3nd_staff_recovery_queue() from public, anon;
grant execute on function public.asc3nd_staff_recovery_queue() to authenticated;

create or replace function public.asc3nd_verify_import_contact(
  p_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_preferred_language text,
  p_relationship_interest text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_row asc3nd.import_contacts_staging%rowtype;
  v_name text := nullif(trim(coalesce(p_name,'')), '');
  v_email text := nullif(lower(trim(coalesce(p_email,''))), '');
  v_phone text := nullif(trim(coalesce(p_phone,'')), '');
  v_lang text := case when p_preferred_language = 'es' then 'es' else 'en' end;
begin
  select * into v_row from asc3nd.import_contacts_staging where id = p_id;
  if not found then raise exception 'Recovery record not found'; end if;

  if not asc3nd_private.has_org_role(v_row.organization_id, array['owner','admin','program_manager']) then
    raise exception 'Not authorized to review recovery records';
  end if;

  if v_row.review_status = 'promoted' then raise exception 'Promoted records cannot be edited'; end if;
  if v_name is null then raise exception 'A verified name is required'; end if;
  if v_email is null and v_phone is null then raise exception 'A verified email or phone is required'; end if;

  update asc3nd.import_contacts_staging
     set name = v_name,
         email = v_email,
         phone = v_phone,
         preferred_language = v_lang,
         relationship_interest = nullif(trim(coalesce(p_relationship_interest,'')), ''),
         data_quality = 'HUMAN VERIFIED',
         review_required = false,
         review_status = 'verified',
         reviewed_by = auth.uid(),
         reviewed_at = now(),
         updated_at = now()
   where id = p_id;

  return jsonb_build_object('ok', true, 'id', p_id, 'status', 'verified');
end;
$$;

revoke all on function public.asc3nd_verify_import_contact(uuid,text,text,text,text,text) from public, anon;
grant execute on function public.asc3nd_verify_import_contact(uuid,text,text,text,text,text) to authenticated;

create or replace function public.asc3nd_reject_import_contact(p_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_row asc3nd.import_contacts_staging%rowtype;
begin
  select * into v_row from asc3nd.import_contacts_staging where id = p_id;
  if not found then raise exception 'Recovery record not found'; end if;
  if not asc3nd_private.has_org_role(v_row.organization_id, array['owner','admin','program_manager']) then
    raise exception 'Not authorized to review recovery records';
  end if;
  if v_row.review_status = 'promoted' then raise exception 'Promoted records cannot be rejected'; end if;

  update asc3nd.import_contacts_staging
     set review_status = 'rejected',
         review_required = false,
         reviewed_by = auth.uid(),
         reviewed_at = now(),
         review_notes = nullif(trim(coalesce(p_reason,'')), ''),
         updated_at = now()
   where id = p_id;

  return jsonb_build_object('ok', true, 'id', p_id, 'status', 'rejected');
end;
$$;

revoke all on function public.asc3nd_reject_import_contact(uuid,text) from public, anon;
grant execute on function public.asc3nd_reject_import_contact(uuid,text) to authenticated;

create or replace function public.asc3nd_promote_import_contact(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_row asc3nd.import_contacts_staging%rowtype;
  v_email text;
  v_phone_digits text;
  v_email_person uuid;
  v_phone_person uuid;
  v_person uuid;
  v_primary_route text := 'updates';
  v_route text;
begin
  select * into v_row from asc3nd.import_contacts_staging where id = p_id for update;
  if not found then raise exception 'Recovery record not found'; end if;

  if not asc3nd_private.has_org_role(v_row.organization_id, array['owner','admin','program_manager']) then
    raise exception 'Not authorized to promote recovery records';
  end if;
  if v_row.review_status <> 'verified' then raise exception 'Record must be human-verified before promotion'; end if;
  if v_row.promoted_person_id is not null then
    return jsonb_build_object('ok', true, 'status', 'already_promoted', 'person_id', v_row.promoted_person_id);
  end if;

  v_email := nullif(lower(trim(coalesce(v_row.email,''))), '');
  v_phone_digits := nullif(regexp_replace(coalesce(v_row.phone,''), '\\D', '', 'g'), '');

  if v_email is not null then
    select p.id into v_email_person
    from asc3nd.people p
    where p.organization_id = v_row.organization_id
      and lower(p.primary_email) = v_email
    limit 1;
  end if;

  if v_phone_digits is not null then
    select p.id into v_phone_person
    from asc3nd.people p
    where p.organization_id = v_row.organization_id
      and regexp_replace(coalesce(p.primary_phone,''), '\\D', '', 'g') = v_phone_digits
    order by p.created_at
    limit 1;
  end if;

  if v_email_person is not null and v_phone_person is not null and v_email_person <> v_phone_person then
    insert into asc3nd.identity_resolution_cases(
      organization_id, source_type, source_ref, candidate_name, candidate_email,
      candidate_phone, reason, status, metadata
    ) values (
      v_row.organization_id, 'recovery_import', 'import_staging:' || v_row.id::text,
      v_row.name, v_row.email, v_row.phone,
      'Exact email and exact phone resolve to different canonical people',
      'open', jsonb_build_object('email_person_id', v_email_person, 'phone_person_id', v_phone_person)
    );
    return jsonb_build_object('ok', false, 'status', 'needs_identity_resolution');
  end if;

  v_person := coalesce(v_email_person, v_phone_person);

  if v_person is null then
    insert into asc3nd.people(
      organization_id, display_name, primary_email, primary_phone,
      preferred_language, lifecycle_stage, source_kind
    ) values (
      v_row.organization_id,
      coalesce(nullif(trim(v_row.name),''), 'Recovered community contact'),
      v_email,
      nullif(trim(coalesce(v_row.phone,'')), ''),
      coalesce(nullif(v_row.preferred_language,''), 'en'),
      'community',
      'community_cuts_recovery'
    ) returning id into v_person;
  else
    update asc3nd.people
       set primary_email = coalesce(primary_email, v_email),
           primary_phone = coalesce(primary_phone, nullif(trim(coalesce(v_row.phone,'')), '')),
           updated_at = now()
     where id = v_person;
  end if;

  insert into asc3nd.person_sources(
    organization_id, person_id, source_type, source_ref, source_record_id, metadata
  )
  select v_row.organization_id, v_person, 'community_cuts_recovery',
    'import_staging:' || v_row.id::text, v_row.source_record_key,
    jsonb_build_object('confirmation_code', v_row.confirmation_code, 'batch_id', v_row.batch_id)
  where not exists (
    select 1 from asc3nd.person_sources ps
    where ps.organization_id = v_row.organization_id
      and ps.person_id = v_person
      and ps.source_ref = 'import_staging:' || v_row.id::text
  );

  insert into asc3nd.person_context(
    organization_id, person_id, context_key, context_value, truth_state,
    source_ref, confidence, human_verified, occurred_at
  ) values (
    v_row.organization_id, v_person, 'community_cuts_recovery',
    jsonb_strip_nulls(jsonb_build_object(
      'source_type', v_row.source_type,
      'confirmation_code', v_row.confirmation_code,
      'relationship_interest', v_row.relationship_interest,
      'children_count', v_row.children_count,
      'age_range', v_row.age_range,
      'arrival_window', v_row.arrival_window,
      'original_status', v_row.original_status,
      'marketing_permission', v_row.marketing_permission,
      'continuing_opt_in', v_row.continuing_opt_in
    )),
    'fact', 'import_staging:' || v_row.id::text, 1, true, coalesce(v_row.reviewed_at, now())
  );

  insert into asc3nd.person_memory(
    organization_id, person_id, memory_type, summary, details, source_ref,
    human_verified, occurred_at
  ) values (
    v_row.organization_id, v_person, 'legacy_event_recovery',
    'Recovered Community Cuts relationship record',
    jsonb_build_object('source_type', v_row.source_type, 'source_record_key', v_row.source_record_key),
    'import_staging:' || v_row.id::text, true, coalesce(v_row.reviewed_at, now())
  );

  if v_row.source_type = 'family_rsvp' then
    v_primary_route := 'family';
    insert into asc3nd.person_routes(organization_id, person_id, route_key, source_type, source_ref, status)
    select v_row.organization_id, v_person, 'family', 'community_cuts_recovery', 'import_staging:' || v_row.id::text, 'active'
    where not exists (
      select 1 from asc3nd.person_routes pr
      where pr.organization_id=v_row.organization_id and pr.person_id=v_person and pr.route_key='family' and pr.status in ('new','active')
    );
  end if;

  for v_route in
    select distinct case trim(x)
      when 'general' then 'updates'
      when 'event-updates' then 'updates'
      when 'updates' then 'updates'
      when 'volunteer' then 'volunteer'
      when 'mentor' then 'mentor'
      when 'supplies' then 'supplies'
      when 'sponsor' then 'sponsor'
      when 'partner' then 'partner'
      else null end
    from regexp_split_to_table(lower(coalesce(v_row.relationship_interest,'')), '\\s*;\\s*') x
  loop
    if v_route is not null then
      if v_primary_route = 'updates' then v_primary_route := v_route; end if;
      insert into asc3nd.person_routes(organization_id, person_id, route_key, source_type, source_ref, status)
      select v_row.organization_id, v_person, v_route, 'community_cuts_recovery', 'import_staging:' || v_row.id::text, 'active'
      where not exists (
        select 1 from asc3nd.person_routes pr
        where pr.organization_id=v_row.organization_id and pr.person_id=v_person and pr.route_key=v_route and pr.status in ('new','active')
      );
    end if;
  end loop;

  insert into asc3nd.communication_consents(
    organization_id, person_id, channel, purpose, status, consent_version,
    source_ref, proof, captured_at
  ) values (
    v_row.organization_id, v_person, 'email', 'community_cuts_event_followup', 'unknown',
    'recovered-source-no-consent-proof', 'import_staging:' || v_row.id::text,
    jsonb_build_object('marketing_permission', v_row.marketing_permission, 'continuing_opt_in', v_row.continuing_opt_in),
    coalesce(v_row.reviewed_at, now())
  );

  insert into asc3nd.followup_tasks(
    organization_id, person_id, route_key, task_type, status, priority, source_ref, metadata
  ) values (
    v_row.organization_id, v_person, v_primary_route, 'review_recovered_consent', 'open', 'normal',
    'import_staging:' || v_row.id::text,
    jsonb_build_object('reason', 'Historical contact promoted without proof of ongoing marketing consent')
  );

  update asc3nd.import_contacts_staging
     set promoted_person_id = v_person,
         promoted_at = now(),
         review_status = 'promoted',
         updated_at = now()
   where id = v_row.id;

  return jsonb_build_object('ok', true, 'status', 'promoted', 'person_id', v_person);
end;
$$;

revoke all on function public.asc3nd_promote_import_contact(uuid) from public, anon;
grant execute on function public.asc3nd_promote_import_contact(uuid) to authenticated;

commit;
