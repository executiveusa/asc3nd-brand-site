begin;

alter table asc3nd.content_drops
  add column if not exists route_key text,
  add column if not exists required_consent_purpose text,
  add column if not exists audience_rules jsonb not null default '{}'::jsonb,
  add column if not exists approved_by uuid references auth.users(id) on delete set null,
  add column if not exists approved_at timestamptz;

alter table asc3nd.content_drops drop constraint if exists content_drops_status_check;
alter table asc3nd.content_drops add constraint content_drops_status_check
  check (status = any(array['draft','review','approved','sent','archived']::text[]));

alter table asc3nd.content_deliveries
  add column if not exists eligibility_reason text,
  add column if not exists consent_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists approved_by uuid references auth.users(id) on delete set null,
  add column if not exists approved_at timestamptz,
  add column if not exists provider_message_id text;

alter table asc3nd.content_deliveries drop constraint if exists content_deliveries_status_check;
alter table asc3nd.content_deliveries add constraint content_deliveries_status_check
  check (status = any(array['proposed','approved','queued','sent','delivered','failed','opened','replied','suppressed']::text[]));

create unique index if not exists content_deliveries_drop_person_uidx
  on asc3nd.content_deliveries(content_drop_id, person_id);

drop policy if exists "asc3nd communications read content" on asc3nd.content_drops;
create policy "asc3nd communications read content" on asc3nd.content_drops
  for select to authenticated
  using ((select asc3nd_private.has_org_role(content_drops.organization_id, array['communications_manager','program_manager']::text[])));

drop policy if exists "asc3nd communications write content" on asc3nd.content_drops;
create policy "asc3nd communications write content" on asc3nd.content_drops
  for all to authenticated
  using ((select asc3nd_private.has_org_role(content_drops.organization_id, array['communications_manager']::text[])))
  with check ((select asc3nd_private.has_org_role(content_drops.organization_id, array['communications_manager']::text[])));

drop policy if exists "asc3nd communications read deliveries" on asc3nd.content_deliveries;
create policy "asc3nd communications read deliveries" on asc3nd.content_deliveries
  for select to authenticated
  using ((select asc3nd_private.has_org_role(content_deliveries.organization_id, array['communications_manager','program_manager']::text[])));

drop policy if exists "asc3nd communications write deliveries" on asc3nd.content_deliveries;
create policy "asc3nd communications write deliveries" on asc3nd.content_deliveries
  for all to authenticated
  using ((select asc3nd_private.has_org_role(content_deliveries.organization_id, array['communications_manager']::text[])))
  with check ((select asc3nd_private.has_org_role(content_deliveries.organization_id, array['communications_manager']::text[])));

create or replace function public.asc3nd_prepare_content_audience(p_content_drop_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_drop asc3nd.content_drops%rowtype;
  v_count integer := 0;
begin
  select * into v_drop from asc3nd.content_drops where id = p_content_drop_id;
  if not found then raise exception 'Content drop not found'; end if;
  if v_drop.status <> 'approved' then raise exception 'Content drop must be approved before audience preparation'; end if;
  if v_drop.route_key is null or v_drop.required_consent_purpose is null then
    raise exception 'route_key and required_consent_purpose are required';
  end if;

  insert into asc3nd.content_deliveries(
    organization_id, content_drop_id, person_id, status, personalization,
    eligibility_reason, consent_snapshot
  )
  select
    v_drop.organization_id,
    v_drop.id,
    p.id,
    'proposed',
    jsonb_build_object(
      'preferred_name', coalesce(nullif(p.preferred_name,''), p.display_name),
      'preferred_language', p.preferred_language,
      'route_key', pr.route_key
    ),
    'active route + current explicit consent',
    jsonb_build_object(
      'channel', c.channel,
      'purpose', c.purpose,
      'status', c.status,
      'consent_version', c.consent_version,
      'captured_at', c.captured_at,
      'source_ref', c.source_ref
    )
  from asc3nd.people p
  join asc3nd.person_routes pr
    on pr.organization_id = p.organization_id
   and pr.person_id = p.id
   and pr.route_key = v_drop.route_key
   and pr.status in ('new','active')
  join lateral (
    select cc.*
    from asc3nd.communication_consents cc
    where cc.organization_id = p.organization_id
      and cc.person_id = p.id
      and cc.channel = v_drop.channel
      and cc.purpose = v_drop.required_consent_purpose
    order by coalesce(cc.captured_at, cc.created_at) desc, cc.created_at desc
    limit 1
  ) c on c.status = 'granted'
  where p.organization_id = v_drop.organization_id
    and p.do_not_contact = false
  on conflict (content_drop_id, person_id) do update
    set personalization = excluded.personalization,
        eligibility_reason = excluded.eligibility_reason,
        consent_snapshot = excluded.consent_snapshot
    where asc3nd.content_deliveries.status in ('proposed','suppressed','failed');

  get diagnostics v_count = row_count;
  return jsonb_build_object('ok', true, 'prepared', v_count, 'content_drop_id', p_content_drop_id);
end;
$$;

create or replace function public.asc3nd_approve_content_delivery(p_delivery_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, asc3nd
as $$
declare v_row asc3nd.content_deliveries%rowtype;
begin
  update asc3nd.content_deliveries
     set status='approved', approved_by=auth.uid(), approved_at=now()
   where id=p_delivery_id and status='proposed'
   returning * into v_row;
  if not found then raise exception 'Delivery not found or not in proposed state'; end if;
  return jsonb_build_object('ok',true,'delivery_id',v_row.id,'status',v_row.status);
end;
$$;

create or replace function public.asc3nd_record_content_sent(
  p_delivery_id uuid,
  p_provider_message_id text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_delivery asc3nd.content_deliveries%rowtype;
  v_drop asc3nd.content_drops%rowtype;
begin
  update asc3nd.content_deliveries
     set status='sent', sent_at=now(), provider_message_id=p_provider_message_id
   where id=p_delivery_id and status in ('approved','queued')
   returning * into v_delivery;
  if not found then raise exception 'Delivery not approved/queued'; end if;

  select * into v_drop from asc3nd.content_drops where id=v_delivery.content_drop_id;

  insert into asc3nd.touchpoints(organization_id, person_id, channel, direction, touchpoint_type, subject, content_ref, context)
  values(v_delivery.organization_id, v_delivery.person_id, v_drop.channel, 'outbound', 'content_delivery', v_drop.title, v_drop.slug,
    jsonb_build_object('content_drop_id',v_drop.id,'delivery_id',v_delivery.id,'provider_message_id',p_provider_message_id));

  insert into asc3nd.person_memory(organization_id, person_id, memory_type, summary, details, source_ref, human_verified, occurred_at)
  values(v_delivery.organization_id, v_delivery.person_id, 'content_sent', 'ASC3ND sent: ' || v_drop.title,
    jsonb_build_object('content_drop_id',v_drop.id,'delivery_id',v_delivery.id,'channel',v_drop.channel),
    'content_delivery:' || v_delivery.id::text, true, now());

  return jsonb_build_object('ok',true,'delivery_id',v_delivery.id,'status','sent');
end;
$$;

grant execute on function public.asc3nd_prepare_content_audience(uuid) to authenticated;
grant execute on function public.asc3nd_approve_content_delivery(uuid) to authenticated;
grant execute on function public.asc3nd_record_content_sent(uuid,text) to authenticated;

commit;
