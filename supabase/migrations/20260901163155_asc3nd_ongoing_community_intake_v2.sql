-- ASC3ND ongoing community intake v2
-- Portable replay of the verified post-event website signup path.

create table if not exists asc3nd_private.community_intake_rate_limits (
  email_hash text not null,
  request_at timestamptz not null default now()
);
create index if not exists community_intake_rate_limits_email_time_idx
  on asc3nd_private.community_intake_rate_limits (email_hash, request_at desc);
revoke all on asc3nd_private.community_intake_rate_limits from public, anon, authenticated;

create or replace function public.asc3nd_join_community(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_org_id uuid;
  v_person_id uuid;
  v_match_count integer;
  v_name text := nullif(btrim(coalesce(p_payload->>'name','')), '');
  v_email text := lower(nullif(btrim(coalesce(p_payload->>'email','')), ''));
  v_language text := coalesce(nullif(p_payload->>'preferred_language',''), 'en');
  v_source text := coalesce(nullif(btrim(p_payload->>'source_page'), ''), 'asc3nd.org/community-signup');
  v_consent boolean := coalesce((p_payload->>'consent_accepted')::boolean, false);
  v_email_hash text;
  v_recent_count integer;
  v_source_record_id text := gen_random_uuid()::text;
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'Invalid request body' using errcode = '22023';
  end if;
  if v_name is null or char_length(v_name) not between 2 and 100 then
    raise exception 'Please provide your name.' using errcode = '22023';
  end if;
  if v_email is null or v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please provide a valid email address.' using errcode = '22023';
  end if;
  if v_language not in ('en','es') then
    raise exception 'Unsupported language.' using errcode = '22023';
  end if;
  if not v_consent then
    raise exception 'Consent is required to receive ASC3ND updates.' using errcode = '22023';
  end if;

  select id into v_org_id
  from asc3nd.organizations
  where slug='asc3nd' and status='active'
  limit 1;
  if v_org_id is null then
    raise exception 'ASC3ND organization is not configured.';
  end if;

  v_email_hash := md5(v_email);
  delete from asc3nd_private.community_intake_rate_limits
  where request_at < now() - interval '2 hours';
  select count(*) into v_recent_count
  from asc3nd_private.community_intake_rate_limits
  where email_hash=v_email_hash and request_at >= now() - interval '1 hour';
  if v_recent_count >= 5 then
    raise exception 'Too many signup attempts. Please try again later.' using errcode = '22023';
  end if;
  insert into asc3nd_private.community_intake_rate_limits(email_hash) values (v_email_hash);

  select count(*) into v_match_count
  from asc3nd.people
  where organization_id=v_org_id
    and primary_email is not null
    and lower(btrim(primary_email))=v_email;

  if v_match_count = 1 then
    select id into v_person_id
    from asc3nd.people
    where organization_id=v_org_id
      and primary_email is not null
      and lower(btrim(primary_email))=v_email
    limit 1;
  elsif v_match_count > 1 then
    insert into asc3nd.identity_resolution_cases(
      organization_id, source_type, source_ref, candidate_name, candidate_email, reason, metadata
    ) values (
      v_org_id, 'website', v_source, v_name, v_email, 'multiple_exact_email_matches',
      jsonb_build_object('intake','ongoing-community','source_record_id',v_source_record_id)
    );
    return jsonb_build_object(
      'ok',true,'status','review_required',
      'message',case when v_language='es'
        then 'Gracias. Recibimos tu solicitud y la revisaremos antes de enviarte actualizaciones.'
        else 'Thank you. We received your request and will review it before sending updates.' end
    );
  end if;

  if v_match_count = 0 then
    insert into asc3nd.people(
      organization_id, display_name, primary_email, preferred_language,
      lifecycle_stage, do_not_contact, source_kind
    ) values (
      v_org_id,v_name,v_email,v_language,'community',false,'website'
    ) returning id into v_person_id;
  else
    update asc3nd.people
    set display_name=case when display_name is null or btrim(display_name)='' then v_name else display_name end,
        preferred_language=v_language,
        do_not_contact=false,
        updated_at=now()
    where id=v_person_id;
  end if;

  insert into asc3nd.person_sources(
    organization_id, person_id, source_type, source_ref, source_record_id, metadata
  ) values (
    v_org_id,v_person_id,'website',v_source,v_source_record_id,
    jsonb_build_object('intake','ongoing-community')
  ) on conflict do nothing;

  insert into asc3nd.person_context(
    organization_id, person_id, context_key, context_value, truth_state,
    source_ref, confidence, human_verified, occurred_at
  ) values (
    v_org_id,v_person_id,'community_updates_opt_in',
    jsonb_build_object('channel','email','language',v_language),
    'fact',v_source,1,true,now()
  );

  insert into asc3nd.person_routes(
    organization_id, person_id, route_key, source_type, source_ref, status, metadata
  ) values (
    v_org_id,v_person_id,'updates','website',v_source,'active',
    jsonb_build_object('intake','ongoing-community')
  ) on conflict (organization_id, person_id, route_key, source_type, source_ref)
  do update set status='active',updated_at=now();

  insert into asc3nd.communication_consents(
    organization_id, person_id, channel, purpose, status, consent_version,
    source_ref, proof, captured_at
  ) values (
    v_org_id,v_person_id,'email','ongoing_asc3nd_updates','granted',
    'asc3nd-community-updates-v1',v_source,
    jsonb_build_object(
      'explicit_checkbox',true,
      'copy','I agree to receive ASC3ND community updates by email. I can unsubscribe at any time.',
      'source_record_id',v_source_record_id
    ),
    now()
  );

  insert into asc3nd.touchpoints(
    organization_id, person_id, channel, direction, touchpoint_type, subject, context, occurred_at
  ) values (
    v_org_id,v_person_id,'website','inbound','community_signup',
    'ASC3ND community updates signup',jsonb_build_object('source',v_source),now()
  );

  insert into asc3nd.person_memory(
    organization_id, person_id, memory_type, summary, details,
    source_ref, human_verified, sensitivity, occurred_at
  ) values (
    v_org_id,v_person_id,'consent','Opted in to ongoing ASC3ND email updates.',
    jsonb_build_object('channel','email','purpose','ongoing_asc3nd_updates'),
    v_source,true,'normal',now()
  );

  if not exists (
    select 1 from asc3nd.followup_tasks
    where organization_id=v_org_id
      and person_id=v_person_id
      and route_key='updates'
      and task_type='welcome'
      and status in ('open','working')
  ) then
    insert into asc3nd.followup_tasks(
      organization_id, person_id, route_key, task_type, priority, source_ref, metadata
    ) values (
      v_org_id,v_person_id,'updates','welcome','normal',v_source,
      jsonb_build_object('intake','ongoing-community')
    );
  end if;

  return jsonb_build_object(
    'ok',true,'status','subscribed',
    'message',case when v_language='es'
      then 'Gracias. Ya estás en la lista de actualizaciones de ASC3ND.'
      else 'Thank you. You are on the ASC3ND community updates list.' end
  );
end;
$$;

revoke all on function public.asc3nd_join_community(jsonb) from public;
revoke all on function public.asc3nd_join_community(jsonb) from authenticated;
grant execute on function public.asc3nd_join_community(jsonb) to anon;
grant execute on function public.asc3nd_join_community(jsonb) to service_role;
