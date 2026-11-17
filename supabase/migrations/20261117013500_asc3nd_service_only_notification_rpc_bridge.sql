-- Expose narrow service-role-only PostgREST bridges for the existing private outbox RPCs.
-- The worker authenticates with its own trigger secret and uses a server-only Supabase service role key.
-- Never grant these functions to anon or authenticated.
begin;

create or replace function public.asc3nd_claim_site_notifications(p_limit integer default 10)
returns jsonb
language sql volatile security definer
set search_path = pg_catalog
as $fn$
  select coalesce(jsonb_agg(to_jsonb(rows)), '[]'::jsonb)
  from asc3nd_private.claim_site_notifications(p_limit) as rows;
$fn$;

create or replace function public.asc3nd_mark_site_notification_sent(p_id uuid)
returns boolean
language plpgsql volatile security definer
set search_path = pg_catalog
as $fn$
begin
  perform asc3nd_private.mark_site_notification_sent(p_id);
  return true;
end
$fn$;

create or replace function public.asc3nd_mark_site_notification_failed(p_id uuid, p_error text)
returns boolean
language plpgsql volatile security definer
set search_path = pg_catalog
as $fn$
begin
  perform asc3nd_private.mark_site_notification_failed(p_id, p_error);
  return true;
end
$fn$;

revoke all on function public.asc3nd_claim_site_notifications(integer) from public, anon, authenticated;
revoke all on function public.asc3nd_mark_site_notification_sent(uuid) from public, anon, authenticated;
revoke all on function public.asc3nd_mark_site_notification_failed(uuid,text) from public, anon, authenticated;
grant execute on function public.asc3nd_claim_site_notifications(integer) to service_role;
grant execute on function public.asc3nd_mark_site_notification_sent(uuid) to service_role;
grant execute on function public.asc3nd_mark_site_notification_failed(uuid,text) to service_role;
commit;
