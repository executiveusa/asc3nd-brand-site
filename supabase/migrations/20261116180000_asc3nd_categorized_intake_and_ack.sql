-- ASC3ND: categorized donor intake and consented bilingual acknowledgment.
-- Apply before enabling the new notification worker or provisioning its secrets.
-- Existing pending/failed notifications are held for manual reconciliation, not replayed.
begin;
alter table asc3nd.participation_intakes drop constraint if exists participation_intakes_route_key_check;
alter table asc3nd.participation_intakes add constraint participation_intakes_route_key_check
  check (route_key in ('family','volunteer','mentor','supplies','sponsor','partner','donor'));
alter table asc3nd.participation_intakes drop constraint if exists participation_intakes_form_type_check;
alter table asc3nd.participation_intakes add constraint participation_intakes_form_type_check
  check (form_type in ('family','mentor-volunteer','partner','donor'));
alter table asc3nd.site_notification_outbox drop constraint if exists site_notification_outbox_kind_check;
alter table asc3nd.site_notification_outbox add constraint site_notification_outbox_kind_check
  check (kind in ('community_signup','participation','participation_ack'));
alter table asc3nd.site_notification_outbox drop constraint if exists site_notification_outbox_status_check;
alter table asc3nd.site_notification_outbox add constraint site_notification_outbox_status_check
  check (status in ('pending','processing','sent','failed','held'));
-- Historical notifications need human review before delivery.
update asc3nd.site_notification_outbox
set status='held', last_error='Held during ASC3ND intake migration; review before manual replay'
where status in ('pending','failed');
CREATE OR REPLACE FUNCTION public.asc3nd_submit_participation(p_payload jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
declare
  v_org_id uuid;
  v_intake_id uuid;
  v_person_id uuid;
  v_match_count integer;
  v_name text := nullif(btrim(coalesce(p_payload->>'name','')), '');
  v_email text := lower(nullif(btrim(coalesce(p_payload->>'email','')), ''));
  v_phone text := nullif(btrim(coalesce(p_payload->>'phone','')), '');
  v_org_name text := nullif(btrim(coalesce(p_payload->>'organization_name','')), '');
  v_route text := nullif(btrim(coalesce(p_payload->>'route_key','')), '');
  v_form_type text := nullif(btrim(coalesce(p_payload->>'form_type','')), '');
  v_language text := coalesce(nullif(p_payload->>'preferred_language',''), 'en');
  v_source text := coalesce(nullif(btrim(p_payload->>'source_page'), ''), 'asc3nd.org/take-part');
  v_contact_consent boolean := coalesce((p_payload->>'contact_consent')::boolean, false);
  v_updates_opt_in boolean := coalesce((p_payload->>'updates_opt_in')::boolean, false);
  v_answers jsonb := coalesce(p_payload->'answers', '{}'::jsonb);
  v_idempotency text := coalesce(nullif(btrim(p_payload->>'idempotency_key'), ''), gen_random_uuid()::text);
  v_email_hash text;
  v_recent_count integer;
begin
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'Invalid request body' using errcode='22023';
  end if;
  if v_name is null or char_length(v_name) not between 2 and 100 then
    raise exception 'Please provide your name.' using errcode='22023';
  end if;
  if v_email is null or v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Please provide a valid email address.' using errcode='22023';
  end if;
  if v_route not in ('family','volunteer','mentor','supplies','sponsor','partner','donor') then
    raise exception 'Please choose a valid way to participate.' using errcode='22023';
  end if;
  if v_form_type not in ('family','mentor-volunteer','partner','donor') then
    raise exception 'Unsupported form type.' using errcode='22023';
  end if;
  if (v_form_type='family' and v_route<>'family')
     or (v_form_type='mentor-volunteer' and v_route not in ('mentor','volunteer'))
     or (v_form_type='partner' and v_route not in ('partner','sponsor','supplies')) or (v_form_type='donor' and v_route<>'donor') then
    raise exception 'The selected route does not match this form.' using errcode='22023';
  end if;
  if v_language not in ('en','es') then
    raise exception 'Unsupported language.' using errcode='22023';
  end if;
  if not v_contact_consent then
    raise exception 'Please allow ASC3ND to contact you about this request.' using errcode='22023';
  end if;
  if jsonb_typeof(v_answers) <> 'object' then
    raise exception 'Invalid form answers.' using errcode='22023';
  end if;

  select id into v_org_id from asc3nd.organizations where slug='asc3nd' and status='active' limit 1;
  if v_org_id is null then raise exception 'ASC3ND organization is not configured.'; end if;

  if exists (select 1 from asc3nd.participation_intakes where organization_id=v_org_id and idempotency_key=v_idempotency) then
    select id, person_id into v_intake_id, v_person_id
    from asc3nd.participation_intakes where organization_id=v_org_id and idempotency_key=v_idempotency limit 1;
    return jsonb_build_object('ok',true,'status','received','id',v_intake_id,'person_id',v_person_id,'duplicate',true,'route',v_route,'message','Thank you. ASC3ND received your information.');
  end if;

  v_email_hash := md5(v_email);
  delete from asc3nd_private.participation_intake_rate_limits where request_at < now() - interval '2 hours';
  select count(*) into v_recent_count from asc3nd_private.participation_intake_rate_limits where email_hash=v_email_hash and request_at >= now() - interval '1 hour';
  if v_recent_count >= 5 then raise exception 'Too many submissions. Please try again later.' using errcode='22023'; end if;
  insert into asc3nd_private.participation_intake_rate_limits(email_hash) values (v_email_hash);

  insert into asc3nd.participation_intakes(
    organization_id, route_key, form_type, name, email, phone, organization_name,
    preferred_language, answers, contact_consent, updates_opt_in, source_page, idempotency_key
  ) values (
    v_org_id, v_route, v_form_type, v_name, v_email, v_phone, v_org_name,
    v_language, v_answers, true, v_updates_opt_in, v_source, v_idempotency
  ) returning id into v_intake_id;

  select count(*) into v_match_count
  from asc3nd.people
  where organization_id=v_org_id and primary_email is not null and lower(btrim(primary_email))=v_email;

  if v_match_count = 1 then
    select id into v_person_id from asc3nd.people
    where organization_id=v_org_id and primary_email is not null and lower(btrim(primary_email))=v_email limit 1;
  elsif v_match_count > 1 then
    insert into asc3nd.identity_resolution_cases(
      organization_id, source_type, source_ref, candidate_name, candidate_email, reason, metadata
    ) values (
      v_org_id, 'website', v_source, v_name, v_email, 'multiple_exact_email_matches',
      jsonb_build_object('intake','participation','participation_intake_id',v_intake_id,'route',v_route)
    );
    update asc3nd.participation_intakes set status='reviewing', updated_at=now() where id=v_intake_id;
    return jsonb_build_object('ok',true,'status','review_required','id',v_intake_id,'route',v_route,'message','Thank you. ASC3ND received your information and will review it before following up.');
  else
    insert into asc3nd.people(
      organization_id, display_name, primary_email, primary_phone, preferred_language, lifecycle_stage, source_kind
    ) values (
      v_org_id, v_name, v_email, v_phone, v_language, 'community', 'website'
    ) returning id into v_person_id;
  end if;

  update asc3nd.participation_intakes set person_id=v_person_id, updated_at=now() where id=v_intake_id;

  update asc3nd.people set
    display_name=case when display_name is null or btrim(display_name)='' then v_name else display_name end,
    primary_phone=case when primary_phone is null or btrim(primary_phone)='' then v_phone else primary_phone end,
    preferred_language=v_language,
    updated_at=now()
  where id=v_person_id;

  insert into asc3nd.person_sources(
    organization_id, person_id, source_type, source_ref, source_record_id, metadata
  ) values (
    v_org_id, v_person_id, 'website', v_source, v_intake_id::text,
    jsonb_build_object('intake','participation','route',v_route,'form_type',v_form_type)
  ) on conflict do nothing;

  insert into asc3nd.person_context(
    organization_id, person_id, context_key, context_value, truth_state, source_ref,
    confidence, human_verified, occurred_at
  ) values (
    v_org_id, v_person_id, 'participation_interest',
    jsonb_build_object('route',v_route,'form_type',v_form_type,'organization_name',v_org_name,'answers',v_answers),
    'fact', v_source, 1, true, now()
  );

  insert into asc3nd.person_routes(
    organization_id, person_id, route_key, source_type, source_ref, status, metadata
  ) values (
    v_org_id, v_person_id, v_route, 'website', v_source, 'active',
    jsonb_build_object('intake','participation','participation_intake_id',v_intake_id)
  ) on conflict (organization_id, person_id, route_key, source_type, source_ref)
  do update set status='active', metadata=excluded.metadata, updated_at=now();

  insert into asc3nd.communication_consents(
    organization_id, person_id, channel, purpose, status, consent_version, source_ref, proof, captured_at
  ) values (
    v_org_id, v_person_id, 'email', 'participation_followup', 'granted',
    'asc3nd-participation-followup-v1', v_source,
    jsonb_build_object('explicit_checkbox',true,'copy','I agree that ASC3ND may contact me about this request.','participation_intake_id',v_intake_id), now()
  );

  if v_updates_opt_in then
    insert into asc3nd.communication_consents(
      organization_id, person_id, channel, purpose, status, consent_version, source_ref, proof, captured_at
    ) values (
      v_org_id, v_person_id, 'email', 'ongoing_asc3nd_updates', 'granted',
      'asc3nd-community-updates-v1', v_source,
      jsonb_build_object('explicit_checkbox',true,'copy','I also want occasional ASC3ND community updates by email.','participation_intake_id',v_intake_id), now()
    );
  end if;

  insert into asc3nd.touchpoints(
    organization_id, person_id, channel, direction, touchpoint_type, subject, context, occurred_at
  ) values (
    v_org_id, v_person_id, 'website', 'inbound', 'participation_intake',
    'ASC3ND participation request', jsonb_build_object('route',v_route,'form_type',v_form_type,'participation_intake_id',v_intake_id), now()
  );

  insert into asc3nd.person_memory(
    organization_id, person_id, memory_type, summary, details, source_ref, human_verified, sensitivity, occurred_at
  ) values (
    v_org_id, v_person_id, 'participation', 'Submitted an ASC3ND participation request.',
    jsonb_build_object('route',v_route,'form_type',v_form_type,'participation_intake_id',v_intake_id),
    v_source, true, 'normal', now()
  );

  if not exists (
    select 1 from asc3nd.followup_tasks
    where organization_id=v_org_id and person_id=v_person_id and route_key=v_route
      and task_type='website_intake' and status in ('open','working')
  ) then
    insert into asc3nd.followup_tasks(
      organization_id, person_id, route_key, task_type, priority, source_ref, metadata
    ) values (
      v_org_id, v_person_id, v_route, 'website_intake', 'normal', v_source,
      jsonb_build_object('participation_intake_id',v_intake_id,'form_type',v_form_type)
    );
  end if;

  return jsonb_build_object('ok',true,'status','received','id',v_intake_id,'person_id',v_person_id,'route',v_route,'message','Thank you. ASC3ND received your information. A team member can now follow up through the appropriate participation queue.');
end;
$function$
CREATE OR REPLACE FUNCTION asc3nd_private.queue_site_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'asc3nd'
AS $function$
begin
  insert into asc3nd.site_notification_outbox(kind, payload, recipient_email)
  values (
    case when tg_table_name = 'participation_intakes' then 'participation' else 'community_signup' end,
    case when tg_table_name = 'participation_intakes' then jsonb_build_object(
      'id', new.id,
      'name', new.name,
      'email', new.email,
      'phone', new.phone,
      'organization_name', new.organization_name,
      'route_key', new.route_key,
      'form_type', new.form_type,
      'preferred_language', new.preferred_language,
      'answers', new.answers,
      'contact_consent', new.contact_consent,
      'updates_opt_in', new.updates_opt_in,
      'source_page', new.source_page,
      'created_at', new.created_at
    ) else to_jsonb(new) end,
    'main@asc3nd.org'
  );
  -- Acknowledgment is its own outbox row, independently retryable and idempotent.
  -- Never include the visitor's free-text answers in an automated acknowledgment.
  if tg_table_name = 'participation_intakes' and new.contact_consent then
    insert into asc3nd.site_notification_outbox(kind, payload, recipient_email)
    values (
      'participation_ack',
      jsonb_build_object(
        'id', new.id, 'name', new.name, 'route_key', new.route_key,
        'preferred_language', new.preferred_language, 'created_at', new.created_at
      ),
      new.email
    );
  end if;
  return new;
end;
$function$
-- Extend the existing communications-manager staff queue to donor inquiries.
CREATE OR REPLACE FUNCTION asc3nd_private.has_route_access(p_organization_id uuid, p_route_key text, p_write boolean DEFAULT false)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
  select exists (
    select 1 from asc3nd.organization_members m
    where m.organization_id = p_organization_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and (
        m.role in ('owner','admin','editor','program_manager')
        or (m.role = 'communications_manager' and p_route_key in ('family','updates','volunteer','mentor','supplies','sponsor','partner','donor'))
        or (m.role = 'volunteer_coordinator' and p_route_key in ('volunteer','mentor','supplies'))
        or (m.role = 'event_staff' and not p_write and p_route_key in ('family','updates'))
        or (m.role = 'viewer' and not p_write)
        or (m.role = 'volunteer' and not p_write)
      )
  );
$function$
commit;
