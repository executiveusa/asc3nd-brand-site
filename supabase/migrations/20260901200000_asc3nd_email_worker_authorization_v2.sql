begin;
create or replace function public.asc3nd_email_worker_authorized()
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public, asc3nd
as $$
  select exists (
    select 1
    from asc3nd.organization_members m
    join asc3nd.organizations o on o.id = m.organization_id
    where o.slug = 'asc3nd'
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('owner','admin','communications_manager')
  );
$$;
revoke all on function public.asc3nd_email_worker_authorized() from public, anon;
grant execute on function public.asc3nd_email_worker_authorized() to authenticated;
commit;
