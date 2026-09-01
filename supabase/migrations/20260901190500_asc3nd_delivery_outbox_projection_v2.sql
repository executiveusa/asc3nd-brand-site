begin;

drop function if exists public.asc3nd_staff_content_deliveries(uuid);

create function public.asc3nd_staff_content_deliveries(p_content_drop_id uuid)
returns table(
  id uuid,
  person_id uuid,
  display_name text,
  primary_email text,
  status text,
  eligibility_reason text,
  consent_snapshot jsonb,
  personalization jsonb,
  approved_at timestamptz,
  sent_at timestamptz,
  replied_at timestamptz,
  outbox_status text,
  outbox_provider text
)
language sql
security invoker
set search_path = pg_catalog, public, asc3nd
as $$
  select
    d.id,
    d.person_id,
    p.display_name,
    p.primary_email,
    d.status,
    d.eligibility_reason,
    d.consent_snapshot,
    d.personalization,
    d.approved_at,
    d.sent_at,
    d.replied_at,
    o.status as outbox_status,
    o.provider as outbox_provider
  from asc3nd.content_deliveries d
  join asc3nd.people p on p.id = d.person_id and p.organization_id = d.organization_id
  left join asc3nd.delivery_outbox o on o.delivery_id = d.id
  where d.content_drop_id = p_content_drop_id
  order by p.display_name asc;
$$;

revoke all on function public.asc3nd_staff_content_deliveries(uuid) from public, anon;
grant execute on function public.asc3nd_staff_content_deliveries(uuid) to authenticated;

commit;
