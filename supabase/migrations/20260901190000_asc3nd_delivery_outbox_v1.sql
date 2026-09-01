begin;

create table if not exists asc3nd.delivery_outbox (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references asc3nd.organizations(id) on delete cascade,
  delivery_id uuid not null unique references asc3nd.content_deliveries(id) on delete cascade,
  provider text not null default 'unconfigured',
  status text not null default 'pending' check (status in ('pending','claimed','sent','failed','cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  provider_message_id text,
  claimed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists delivery_outbox_status_idx on asc3nd.delivery_outbox(status, created_at);

alter table asc3nd.delivery_outbox enable row level security;

drop policy if exists "asc3nd communications read outbox" on asc3nd.delivery_outbox;
create policy "asc3nd communications read outbox"
on asc3nd.delivery_outbox
for select to authenticated
using (asc3nd_private.has_org_role(organization_id, array['owner','admin','editor','communications_manager']));

drop policy if exists "asc3nd communications write outbox" on asc3nd.delivery_outbox;
create policy "asc3nd communications write outbox"
on asc3nd.delivery_outbox
for all to authenticated
using (asc3nd_private.has_org_role(organization_id, array['owner','admin','editor','communications_manager']))
with check (asc3nd_private.has_org_role(organization_id, array['owner','admin','editor','communications_manager']));

grant select, insert, update on asc3nd.delivery_outbox to authenticated;

create or replace function public.asc3nd_queue_approved_delivery(
  p_delivery_id uuid,
  p_provider text default 'unconfigured'
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_delivery asc3nd.content_deliveries%rowtype;
  v_drop asc3nd.content_drops%rowtype;
  v_person asc3nd.people%rowtype;
  v_consent asc3nd.communication_consents%rowtype;
  v_outbox uuid;
begin
  select * into v_delivery from asc3nd.content_deliveries where id = p_delivery_id;
  if not found then raise exception 'Delivery not found'; end if;

  if not asc3nd_private.has_org_role(v_delivery.organization_id, array['owner','admin','editor','communications_manager']) then
    raise exception 'Not authorized to queue delivery';
  end if;
  if v_delivery.status <> 'approved' then raise exception 'Delivery must be approved before queueing'; end if;

  select * into v_drop from asc3nd.content_drops where id = v_delivery.content_drop_id;
  select * into v_person from asc3nd.people where id = v_delivery.person_id and organization_id = v_delivery.organization_id;
  if v_person.do_not_contact then raise exception 'Person is do-not-contact'; end if;

  select * into v_consent
  from asc3nd.communication_consents
  where organization_id = v_delivery.organization_id
    and person_id = v_delivery.person_id
    and channel = v_drop.channel
    and purpose = v_drop.required_consent_purpose
  order by coalesce(captured_at, created_at) desc, created_at desc
  limit 1;

  if v_consent.id is null or v_consent.status <> 'granted' then
    raise exception 'Current consent is not granted';
  end if;

  insert into asc3nd.delivery_outbox(organization_id, delivery_id, provider, status)
  values(v_delivery.organization_id, v_delivery.id, coalesce(nullif(trim(p_provider),''),'unconfigured'), 'pending')
  on conflict (delivery_id) do update
    set provider = excluded.provider,
        status = case when asc3nd.delivery_outbox.status = 'cancelled' then 'pending' else asc3nd.delivery_outbox.status end,
        updated_at = now()
  returning id into v_outbox;

  update asc3nd.content_deliveries
     set status = 'queued'
   where id = v_delivery.id;

  return jsonb_build_object('ok',true,'delivery_id',v_delivery.id,'outbox_id',v_outbox,'status','queued','provider',coalesce(nullif(trim(p_provider),''),'unconfigured'));
end;
$$;

revoke all on function public.asc3nd_queue_approved_delivery(uuid,text) from public, anon;
grant execute on function public.asc3nd_queue_approved_delivery(uuid,text) to authenticated;

commit;
