-- ASC3ND participation intake v1
-- Public route-specific Take Part forms -> canonical Supabase ICM -> staff queue/export.

create table if not exists asc3nd.participation_intakes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references asc3nd.organizations(id) on delete cascade,
  person_id uuid references asc3nd.people(id) on delete set null,
  route_key text not null check (route_key in ('family','volunteer','mentor','supplies','sponsor','partner')),
  form_type text not null check (form_type in ('family','mentor-volunteer','partner')),
  name text not null,
  email text not null,
  phone text,
  organization_name text,
  preferred_language text not null default 'en' check (preferred_language in ('en','es')),
  answers jsonb not null default '{}'::jsonb,
  contact_consent boolean not null default false,
  updates_opt_in boolean not null default false,
  source_page text not null,
  idempotency_key text not null,
  status text not null default 'new' check (status in ('new','reviewing','contacted','closed','spam')),
  sheet_sync_status text not null default 'pending' check (sheet_sync_status in ('pending','synced','failed','skipped')),
  sheet_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id,idempotency_key)
);
create index if not exists participation_intakes_route_created_idx on asc3nd.participation_intakes (organization_id,route_key,created_at desc);
create index if not exists participation_intakes_sheet_sync_idx on asc3nd.participation_intakes (sheet_sync_status,created_at);
alter table asc3nd.participation_intakes enable row level security;
create policy participation_intakes_staff_read on asc3nd.participation_intakes for select to authenticated using (asc3nd_private.has_route_access(organization_id,route_key,false));
create policy participation_intakes_staff_update on asc3nd.participation_intakes for update to authenticated using (asc3nd_private.has_route_access(organization_id,route_key,true)) with check (asc3nd_private.has_route_access(organization_id,route_key,true));
grant select,update on asc3nd.participation_intakes to authenticated;

create table if not exists asc3nd_private.participation_intake_rate_limits (email_hash text not null, request_at timestamptz not null default now());
create index if not exists participation_intake_rate_limits_email_time_idx on asc3nd_private.participation_intake_rate_limits (email_hash,request_at desc);
revoke all on asc3nd_private.participation_intake_rate_limits from public,anon,authenticated;

create or replace function public.asc3nd_submit_participation(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare
  v_org_id uuid; v_intake_id uuid; v_person_id uuid; v_match_count integer;
  v_name text:=nullif(btrim(coalesce(p_payload->>'name','')),'');
  v_email text:=lower(nullif(btrim(coalesce(p_payload->>'email','')),''));
  v_phone text:=nullif(btrim(coalesce(p_payload->>'phone','')),'');
  v_org_name text:=nullif(btrim(coalesce(p_payload->>'organization_name','')),'');
  v_route text:=nullif(btrim(coalesce(p_payload->>'route_key','')),'');
  v_form_type text:=nullif(btrim(coalesce(p_payload->>'form_type','')),'');
  v_language text:=coalesce(nullif(p_payload->>'preferred_language',''),'en');
  v_source text:=coalesce(nullif(btrim(p_payload->>'source_page'),''),'asc3nd.org/take-part');
  v_contact_consent boolean:=coalesce((p_payload->>'contact_consent')::boolean,false);
  v_updates_opt_in boolean:=coalesce((p_payload->>'updates_opt_in')::boolean,false);
  v_answers jsonb:=coalesce(p_payload->'answers','{}'::jsonb);
  v_idempotency text:=coalesce(nullif(btrim(p_payload->>'idempotency_key'),''),gen_random_uuid()::text);
  v_email_hash text; v_recent_count integer;
begin
  if p_payload is null or jsonb_typeof(p_payload)<>'object' then raise exception 'Invalid request body' using errcode='22023'; end if;
  if v_name is null or char_length(v_name) not between 2 and 100 then raise exception 'Please provide your name.' using errcode='22023'; end if;
  if v_email is null or v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Please provide a valid email address.' using errcode='22023'; end if;
  if v_route not in ('family','volunteer','mentor','supplies','sponsor','partner') then raise exception 'Please choose a valid way to participate.' using errcode='22023'; end if;
  if v_form_type not in ('family','mentor-volunteer','partner') then raise exception 'Unsupported form type.' using errcode='22023'; end if;
  if (v_form_type='family' and v_route<>'family') or (v_form_type='mentor-volunteer' and v_route not in ('mentor','volunteer')) or (v_form_type='partner' and v_route not in ('partner','sponsor','supplies')) then raise exception 'The selected route does not match this form.' using errcode='22023'; end if;
  if v_language not in ('en','es') then raise exception 'Unsupported language.' using errcode='22023'; end if;
  if not v_contact_consent then raise exception 'Please allow ASC3ND to contact you about this request.' using errcode='22023'; end if;
  if jsonb_typeof(v_answers)<>'object' then raise exception 'Invalid form answers.' using errcode='22023'; end if;

  select id into v_org_id from asc3nd.organizations where slug='asc3nd' and status='active' limit 1;
  if v_org_id is null then raise exception 'ASC3ND organization is not configured.'; end if;
  if exists(select 1 from asc3nd.participation_intakes where organization_id=v_org_id and idempotency_key=v_idempotency) then
    select id,person_id into v_intake_id,v_person_id from asc3nd.participation_intakes where organization_id=v_org_id and idempotency_key=v_idempotency limit 1;
    return jsonb_build_object('ok',true,'status','received','id',v_intake_id,'person_id',v_person_id,'duplicate',true,'route',v_route,'message','Thank you. ASC3ND received your information.');
  end if;

  v_email_hash:=md5(v_email);
  delete from asc3nd_private.participation_intake_rate_limits where request_at<now()-interval '2 hours';
  select count(*) into v_recent_count from asc3nd_private.participation_intake_rate_limits where email_hash=v_email_hash and request_at>=now()-interval '1 hour';
  if v_recent_count>=5 then raise exception 'Too many submissions. Please try again later.' using errcode='22023'; end if;
  insert into asc3nd_private.participation_intake_rate_limits(email_hash) values(v_email_hash);

  insert into asc3nd.participation_intakes(organization_id,route_key,form_type,name,email,phone,organization_name,preferred_language,answers,contact_consent,updates_opt_in,source_page,idempotency_key)
  values(v_org_id,v_route,v_form_type,v_name,v_email,v_phone,v_org_name,v_language,v_answers,true,v_updates_opt_in,v_source,v_idempotency) returning id into v_intake_id;

  select count(*) into v_match_count from asc3nd.people where organization_id=v_org_id and primary_email is not null and lower(btrim(primary_email))=v_email;
  if v_match_count=1 then select id into v_person_id from asc3nd.people where organization_id=v_org_id and primary_email is not null and lower(btrim(primary_email))=v_email limit 1;
  elsif v_match_count>1 then
    insert into asc3nd.identity_resolution_cases(organization_id,source_type,source_ref,candidate_name,candidate_email,reason,metadata)
    values(v_org_id,'website',v_source,v_name,v_email,'multiple_exact_email_matches',jsonb_build_object('intake','participation','participation_intake_id',v_intake_id,'route',v_route));
    update asc3nd.participation_intakes set status='reviewing',updated_at=now() where id=v_intake_id;
    return jsonb_build_object('ok',true,'status','review_required','id',v_intake_id,'route',v_route,'message','Thank you. ASC3ND received your information and will review it before following up.');
  else
    insert into asc3nd.people(organization_id,display_name,primary_email,primary_phone,preferred_language,lifecycle_stage,source_kind)
    values(v_org_id,v_name,v_email,v_phone,v_language,'community','website') returning id into v_person_id;
  end if;

  update asc3nd.participation_intakes set person_id=v_person_id,updated_at=now() where id=v_intake_id;
  update asc3nd.people set display_name=case when display_name is null or btrim(display_name)='' then v_name else display_name end, primary_phone=case when primary_phone is null or btrim(primary_phone)='' then v_phone else primary_phone end, preferred_language=v_language, updated_at=now() where id=v_person_id;
  insert into asc3nd.person_sources(organization_id,person_id,source_type,source_ref,source_record_id,metadata) values(v_org_id,v_person_id,'website',v_source,v_intake_id::text,jsonb_build_object('intake','participation','route',v_route,'form_type',v_form_type)) on conflict do nothing;
  insert into asc3nd.person_context(organization_id,person_id,context_key,context_value,truth_state,source_ref,confidence,human_verified,occurred_at) values(v_org_id,v_person_id,'participation_interest',jsonb_build_object('route',v_route,'form_type',v_form_type,'organization_name',v_org_name,'answers',v_answers),'fact',v_source,1,true,now());
  insert into asc3nd.person_routes(organization_id,person_id,route_key,source_type,source_ref,status,metadata) values(v_org_id,v_person_id,v_route,'website',v_source,'active',jsonb_build_object('intake','participation','participation_intake_id',v_intake_id)) on conflict(organization_id,person_id,route_key,source_type,source_ref) do update set status='active',metadata=excluded.metadata,updated_at=now();
  insert into asc3nd.communication_consents(organization_id,person_id,channel,purpose,status,consent_version,source_ref,proof,captured_at) values(v_org_id,v_person_id,'email','participation_followup','granted','asc3nd-participation-followup-v1',v_source,jsonb_build_object('explicit_checkbox',true,'copy','I agree that ASC3ND may contact me about this request.','participation_intake_id',v_intake_id),now());
  if v_updates_opt_in then insert into asc3nd.communication_consents(organization_id,person_id,channel,purpose,status,consent_version,source_ref,proof,captured_at) values(v_org_id,v_person_id,'email','ongoing_asc3nd_updates','granted','asc3nd-community-updates-v1',v_source,jsonb_build_object('explicit_checkbox',true,'copy','I also want occasional ASC3ND community updates by email.','participation_intake_id',v_intake_id),now()); end if;
  insert into asc3nd.touchpoints(organization_id,person_id,channel,direction,touchpoint_type,subject,context,occurred_at) values(v_org_id,v_person_id,'website','inbound','participation_intake','ASC3ND participation request',jsonb_build_object('route',v_route,'form_type',v_form_type,'participation_intake_id',v_intake_id),now());
  insert into asc3nd.person_memory(organization_id,person_id,memory_type,summary,details,source_ref,human_verified,sensitivity,occurred_at) values(v_org_id,v_person_id,'participation','Submitted an ASC3ND participation request.',jsonb_build_object('route',v_route,'form_type',v_form_type,'participation_intake_id',v_intake_id),v_source,true,'normal',now());
  if not exists(select 1 from asc3nd.followup_tasks where organization_id=v_org_id and person_id=v_person_id and route_key=v_route and task_type='website_intake' and status in ('open','working')) then insert into asc3nd.followup_tasks(organization_id,person_id,route_key,task_type,priority,source_ref,metadata) values(v_org_id,v_person_id,v_route,'website_intake','normal',v_source,jsonb_build_object('participation_intake_id',v_intake_id,'form_type',v_form_type)); end if;
  return jsonb_build_object('ok',true,'status','received','id',v_intake_id,'person_id',v_person_id,'route',v_route,'message','Thank you. ASC3ND received your information. A team member can now follow up through the appropriate participation queue.');
end; $$;
revoke all on function public.asc3nd_submit_participation(jsonb) from public,authenticated;
grant execute on function public.asc3nd_submit_participation(jsonb) to anon,service_role;

create or replace function public.asc3nd_staff_participation_intakes(p_route_key text default null,p_limit integer default 500,p_offset integer default 0)
returns table(id uuid,person_id uuid,route_key text,form_type text,name text,email text,phone text,organization_name text,preferred_language text,answers jsonb,contact_consent boolean,updates_opt_in boolean,status text,sheet_sync_status text,created_at timestamptz)
language sql stable security invoker set search_path=pg_catalog,public,asc3nd,asc3nd_private as $$
  select pi.id,pi.person_id,pi.route_key,pi.form_type,pi.name,pi.email,pi.phone,pi.organization_name,pi.preferred_language,pi.answers,pi.contact_consent,pi.updates_opt_in,pi.status,pi.sheet_sync_status,pi.created_at
  from asc3nd.participation_intakes pi
  where (p_route_key is null or pi.route_key=p_route_key) and asc3nd_private.has_route_access(pi.organization_id,pi.route_key,false)
  order by pi.created_at desc limit greatest(1,least(coalesce(p_limit,500),1000)) offset greatest(coalesce(p_offset,0),0);
$$;
revoke all on function public.asc3nd_staff_participation_intakes(text,integer,integer) from public,anon;
grant execute on function public.asc3nd_staff_participation_intakes(text,integer,integer) to authenticated;
