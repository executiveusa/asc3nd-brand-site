-- ASC3ND ICM routing + role security v1
-- Applied to production Supabase as migration asc3nd_icm_routing_and_role_security_v1.

begin;

alter table asc3nd.organization_members drop constraint if exists organization_members_role_check;
alter table asc3nd.organization_members add constraint organization_members_role_check check (
  role = any(array['owner','admin','editor','viewer','volunteer','program_manager','communications_manager','volunteer_coordinator','event_staff']::text[])
);

alter table asc3nd.event_rsvps add column if not exists age_range text;
alter table asc3nd.event_rsvps add column if not exists requested_service text default 'haircut';
alter table asc3nd.event_rsvps add column if not exists confirmation_code text;
alter table asc3nd.event_rsvps add column if not exists contact_privately boolean not null default false;
alter table asc3nd.event_rsvps drop constraint if exists event_rsvps_age_range_check;
alter table asc3nd.event_rsvps add constraint event_rsvps_age_range_check check (age_range is null or age_range = any(array['preschool','elementary','middle-school','high-school','mixed-ages']::text[]));
create unique index if not exists event_rsvps_confirmation_code_uidx on asc3nd.event_rsvps(confirmation_code) where confirmation_code is not null;
alter table asc3nd.event_rsvps drop constraint if exists event_rsvps_status_check;
alter table asc3nd.event_rsvps add constraint event_rsvps_status_check check (status = any(array['received','reviewed','confirmed','waitlisted','attended','no_show','cancelled','closed','spam']::text[]));

create table if not exists asc3nd.icm_routes (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references asc3nd.organizations(id) on delete cascade,
  route_key text not null, label text not null, folder_path text not null, purpose text not null,
  status text not null default 'active' check (status in ('active','paused','archived')), metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id,route_key)
);
create table if not exists asc3nd.person_routes (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references asc3nd.organizations(id) on delete cascade,
  person_id uuid not null references asc3nd.people(id) on delete cascade, route_key text not null, source_type text not null, source_ref text,
  status text not null default 'active' check (status in ('new','active','paused','completed','closed')), assigned_to uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id,person_id,route_key,source_type,source_ref)
);
create table if not exists asc3nd.followup_tasks (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references asc3nd.organizations(id) on delete cascade,
  person_id uuid not null references asc3nd.people(id) on delete cascade, route_key text not null, task_type text not null,
  status text not null default 'open' check (status in ('open','working','waiting_human','done','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')), assigned_to uuid references auth.users(id) on delete set null,
  due_at timestamptz, source_ref text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists asc3nd.identity_resolution_cases (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references asc3nd.organizations(id) on delete cascade,
  source_type text not null, source_ref text, candidate_name text, candidate_email text, candidate_phone text, reason text not null,
  status text not null default 'open' check (status in ('open','resolved','dismissed')), resolved_person_id uuid references asc3nd.people(id) on delete set null,
  resolved_by uuid references auth.users(id) on delete set null, resolved_at timestamptz, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists person_routes_org_route_idx on asc3nd.person_routes(organization_id,route_key,status);
create index if not exists person_routes_assigned_idx on asc3nd.person_routes(assigned_to) where assigned_to is not null;
create index if not exists followup_tasks_org_route_status_idx on asc3nd.followup_tasks(organization_id,route_key,status);
create index if not exists followup_tasks_assigned_idx on asc3nd.followup_tasks(assigned_to,status) where assigned_to is not null;
create index if not exists identity_resolution_cases_status_idx on asc3nd.identity_resolution_cases(organization_id,status);

create or replace function asc3nd_private.touch_icm_updated_at() returns trigger language plpgsql security definer set search_path=pg_catalog as $$ begin new.updated_at:=now(); return new; end $$;
drop trigger if exists trg_icm_routes_updated_at on asc3nd.icm_routes;
create trigger trg_icm_routes_updated_at before update on asc3nd.icm_routes for each row execute function asc3nd_private.touch_icm_updated_at();
drop trigger if exists trg_person_routes_updated_at on asc3nd.person_routes;
create trigger trg_person_routes_updated_at before update on asc3nd.person_routes for each row execute function asc3nd_private.touch_icm_updated_at();
drop trigger if exists trg_followup_tasks_updated_at on asc3nd.followup_tasks;
create trigger trg_followup_tasks_updated_at before update on asc3nd.followup_tasks for each row execute function asc3nd_private.touch_icm_updated_at();

create or replace function asc3nd_private.has_route_access(p_organization_id uuid,p_route_key text,p_write boolean default false)
returns boolean language sql stable security definer set search_path=pg_catalog as $$
select exists(select 1 from asc3nd.organization_members m where m.organization_id=p_organization_id and m.user_id=(select auth.uid()) and m.status='active' and (
  m.role in ('owner','admin','editor','program_manager') or
  (m.role='communications_manager' and p_route_key in ('family','updates','volunteer','mentor','supplies','sponsor','partner')) or
  (m.role='volunteer_coordinator' and p_route_key in ('volunteer','mentor','supplies')) or
  (m.role='event_staff' and not p_write and p_route_key in ('family','updates')) or
  (m.role='viewer' and not p_write) or (m.role='volunteer' and not p_write)
)); $$;
revoke all on function asc3nd_private.has_route_access(uuid,text,boolean) from public,anon,authenticated;

insert into asc3nd.icm_routes(organization_id,route_key,label,folder_path,purpose)
select o.id,v.route_key,v.label,v.folder_path,v.purpose from asc3nd.organizations o cross join (values
('family','Families','C/participation/family','Family/event attendance follow-up'),
('updates','Updates','C/participation/updates','General event-update interest'),
('volunteer','Volunteers','C/participation/volunteer','Volunteer coordination'),
('mentor','Mentors','C/participation/mentor','Mentor interest and matching'),
('supplies','Supplies','C/participation/supplies','Supply donor/support coordination'),
('sponsor','Sponsors','C/participation/sponsor','Sponsor relationship development'),
('partner','Partners','C/participation/partner','Community partner relationship development')) v(route_key,label,folder_path,purpose)
where o.slug='asc3nd' on conflict(organization_id,route_key) do update set label=excluded.label,folder_path=excluded.folder_path,purpose=excluded.purpose,status='active';

create or replace function asc3nd_private.route_rsvp_into_icm() returns trigger language plpgsql security definer set search_path=pg_catalog as $$
declare v_person_id uuid; v_match_ids uuid[]; v_route text; v_event_slug text; v_source_ref text;
  v_email text:=nullif(lower(btrim(coalesce(new.email,''))),''); v_phone_digits text:=nullif(regexp_replace(coalesce(new.phone,''),'[^0-9]','','g'),''); v_pref text;
begin
 select e.slug into v_event_slug from asc3nd.events e where e.id=new.event_id; v_source_ref:='event_rsvp:'||new.id::text;
 select array_agg(distinct p.id) into v_match_ids from asc3nd.people p where p.organization_id=new.organization_id and ((v_email is not null and lower(coalesce(p.primary_email,''))=v_email) or (v_phone_digits is not null and regexp_replace(coalesce(p.primary_phone,''),'[^0-9]','','g')=v_phone_digits));
 if coalesce(array_length(v_match_ids,1),0)=1 then
   v_person_id:=v_match_ids[1];
   update asc3nd.people set display_name=coalesce(nullif(display_name,''),new.guardian_name),primary_email=coalesce(primary_email,v_email),primary_phone=coalesce(primary_phone,new.phone),preferred_language=coalesce(nullif(new.preferred_language,''),preferred_language),updated_at=now() where id=v_person_id;
 else
   insert into asc3nd.people(organization_id,display_name,primary_email,primary_phone,preferred_language,lifecycle_stage,source_kind) values(new.organization_id,new.guardian_name,v_email,new.phone,new.preferred_language,'community','event_rsvp') returning id into v_person_id;
   if coalesce(array_length(v_match_ids,1),0)>1 then insert into asc3nd.identity_resolution_cases(organization_id,source_type,source_ref,candidate_name,candidate_email,candidate_phone,reason,metadata) values(new.organization_id,'event_rsvp',v_source_ref,new.guardian_name,v_email,new.phone,'Email and phone resolve to more than one existing person; created a separate person pending human review',jsonb_build_object('candidate_person_ids',v_match_ids)); end if;
 end if;
 insert into asc3nd.person_sources(organization_id,person_id,source_type,source_ref,source_record_id,metadata) values(new.organization_id,v_person_id,'event_rsvp',coalesce(v_event_slug,'unknown-event'),new.id::text,jsonb_build_object('confirmation_code',new.confirmation_code)) on conflict do nothing;
 insert into asc3nd.person_context(organization_id,person_id,context_key,context_value,truth_state,source_ref,confidence,human_verified,occurred_at) values
 (new.organization_id,v_person_id,'event_interest',to_jsonb(new.interest),'fact',v_source_ref,1,true,new.submitted_at),
 (new.organization_id,v_person_id,'event_rsvp',jsonb_build_object('event_slug',v_event_slug,'children_count',new.children_count,'age_range',new.age_range,'arrival_window',new.arrival_window,'preferences',new.preferences,'requested_service',new.requested_service),'fact',v_source_ref,1,true,new.submitted_at);
 insert into asc3nd.person_memory(organization_id,person_id,memory_type,summary,details,source_ref,human_verified,sensitivity,occurred_at) values(new.organization_id,v_person_id,'event_rsvp','RSVP or participation interest submitted for '||coalesce(v_event_slug,'ASC3ND event'),jsonb_build_object('interest',new.interest,'status',new.status),v_source_ref,true,'normal',new.submitted_at);
 if new.consent_accepted then
   if v_email is not null then insert into asc3nd.communication_consents(organization_id,person_id,channel,purpose,status,consent_version,source_ref,proof,captured_at) values(new.organization_id,v_person_id,'email','event_and_selected_participation','granted',new.consent_version,v_source_ref,jsonb_build_object('event_slug',v_event_slug,'interest',new.interest,'consent_copy',new.consent_copy),new.consent_accepted_at); end if;
   if v_phone_digits is not null then insert into asc3nd.communication_consents(organization_id,person_id,channel,purpose,status,consent_version,source_ref,proof,captured_at) values(new.organization_id,v_person_id,'phone','event_and_selected_participation','granted',new.consent_version,v_source_ref,jsonb_build_object('event_slug',v_event_slug,'interest',new.interest,'consent_copy',new.consent_copy),new.consent_accepted_at); end if;
 end if;
 v_route:=case new.interest when 'attend' then 'family' else new.interest end;
 insert into asc3nd.person_routes(organization_id,person_id,route_key,source_type,source_ref,status,metadata) values(new.organization_id,v_person_id,v_route,'event_rsvp',v_source_ref,'new',jsonb_build_object('event_slug',v_event_slug,'interest',new.interest)) on conflict do nothing;
 insert into asc3nd.followup_tasks(organization_id,person_id,route_key,task_type,status,priority,source_ref,metadata) values(new.organization_id,v_person_id,v_route,'event_followup','open','normal',v_source_ref,jsonb_build_object('event_slug',v_event_slug));
 foreach v_pref in array coalesce(new.preferences,'{}'::text[]) loop
   if v_pref in ('volunteer','supplies') then insert into asc3nd.person_routes(organization_id,person_id,route_key,source_type,source_ref,status,metadata) values(new.organization_id,v_person_id,v_pref,'event_preference',v_source_ref,'new',jsonb_build_object('event_slug',v_event_slug)) on conflict do nothing;
   elsif v_pref='event-updates' then insert into asc3nd.person_routes(organization_id,person_id,route_key,source_type,source_ref,status,metadata) values(new.organization_id,v_person_id,'updates','event_preference',v_source_ref,'new',jsonb_build_object('event_slug',v_event_slug)) on conflict do nothing; end if;
 end loop; return new;
end $$;
revoke all on function asc3nd_private.route_rsvp_into_icm() from public,anon,authenticated;
drop trigger if exists trg_asc3nd_rsvp_icm_route on asc3nd.event_rsvps;
create trigger trg_asc3nd_rsvp_icm_route after insert on asc3nd.event_rsvps for each row execute function asc3nd_private.route_rsvp_into_icm();

alter table asc3nd.icm_routes enable row level security; alter table asc3nd.person_routes enable row level security; alter table asc3nd.followup_tasks enable row level security; alter table asc3nd.identity_resolution_cases enable row level security;
revoke all on asc3nd.icm_routes,asc3nd.person_routes,asc3nd.followup_tasks,asc3nd.identity_resolution_cases from anon,authenticated;
grant select on asc3nd.icm_routes to authenticated; grant select,insert,update on asc3nd.person_routes,asc3nd.followup_tasks,asc3nd.identity_resolution_cases to authenticated;
create policy "asc3nd staff read icm routes" on asc3nd.icm_routes for select to authenticated using ((select asc3nd_private.has_org_role(organization_id,array['owner','admin','editor','viewer','program_manager','communications_manager','volunteer_coordinator','event_staff','volunteer'])));
create policy "asc3nd route staff read person routes" on asc3nd.person_routes for select to authenticated using ((select asc3nd_private.has_route_access(organization_id,route_key,false)) and ((select asc3nd_private.has_org_role(organization_id,array['owner','admin','editor','viewer','program_manager','communications_manager','volunteer_coordinator','event_staff'])) or assigned_to=(select auth.uid())));
create policy "asc3nd route managers write person routes" on asc3nd.person_routes for all to authenticated using ((select asc3nd_private.has_route_access(organization_id,route_key,true))) with check ((select asc3nd_private.has_route_access(organization_id,route_key,true)));
create policy "asc3nd route staff read followups" on asc3nd.followup_tasks for select to authenticated using ((select asc3nd_private.has_route_access(organization_id,route_key,false)) and ((select asc3nd_private.has_org_role(organization_id,array['owner','admin','editor','viewer','program_manager','communications_manager','volunteer_coordinator','event_staff'])) or assigned_to=(select auth.uid())));
create policy "asc3nd route managers write followups" on asc3nd.followup_tasks for all to authenticated using ((select asc3nd_private.has_route_access(organization_id,route_key,true))) with check ((select asc3nd_private.has_route_access(organization_id,route_key,true)));
create policy "asc3nd managers resolve identity" on asc3nd.identity_resolution_cases for all to authenticated using ((select asc3nd_private.has_org_role(organization_id,array['owner','admin','editor','program_manager']))) with check ((select asc3nd_private.has_org_role(organization_id,array['owner','admin','editor','program_manager'])));
create policy "asc3nd program communications read people" on asc3nd.people for select to authenticated using ((select asc3nd_private.has_org_role(organization_id,array['program_manager','communications_manager'])));
create policy "asc3nd volunteer coordinator read routed people" on asc3nd.people for select to authenticated using ((select asc3nd_private.has_org_role(organization_id,array['volunteer_coordinator'])) and exists(select 1 from asc3nd.person_routes pr where pr.organization_id=people.organization_id and pr.person_id=people.id and pr.route_key in ('volunteer','mentor','supplies') and pr.status in ('new','active')));
revoke all on asc3nd.event_rsvps,asc3nd.people,asc3nd.person_routes,asc3nd.followup_tasks from anon;

commit;
