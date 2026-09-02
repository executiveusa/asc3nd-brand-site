-- ASC3ND Google Sheet sync worker v1
-- Claims pending website intake under service role, retries safely, and records sync outcome.

alter table asc3nd.participation_intakes
  add column if not exists sheet_sync_attempts integer not null default 0,
  add column if not exists sheet_sync_last_error text,
  add column if not exists sheet_sync_claimed_at timestamptz;

alter table asc3nd.participation_intakes drop constraint if exists participation_intakes_sheet_sync_status_check;
alter table asc3nd.participation_intakes
  add constraint participation_intakes_sheet_sync_status_check
  check (sheet_sync_status in ('pending','syncing','synced','failed','skipped'));

create or replace function public.asc3nd_sheet_sync_authorized()
returns boolean
language sql
stable
security definer
set search_path=pg_catalog,public
as $$
  select exists (
    select 1
    from asc3nd.organization_members om
    join asc3nd.organizations o on o.id=om.organization_id
    where om.user_id=auth.uid()
      and o.slug='asc3nd'
      and om.status='active'
      and om.role in ('owner','admin','program_manager')
  );
$$;
revoke all on function public.asc3nd_sheet_sync_authorized() from public,anon;
grant execute on function public.asc3nd_sheet_sync_authorized() to authenticated,service_role;

create or replace function public.asc3nd_worker_claim_sheet_sync(p_limit integer default 100)
returns setof asc3nd.participation_intakes
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  return query
  with picked as (
    select id
    from asc3nd.participation_intakes
    where sheet_sync_status in ('pending','failed')
      and sheet_sync_attempts < 5
      and (sheet_sync_claimed_at is null or sheet_sync_claimed_at < now()-interval '15 minutes')
    order by created_at asc
    for update skip locked
    limit greatest(1,least(coalesce(p_limit,100),250))
  )
  update asc3nd.participation_intakes pi
  set sheet_sync_status='syncing',
      sheet_sync_attempts=pi.sheet_sync_attempts+1,
      sheet_sync_last_error=null,
      sheet_sync_claimed_at=now(),
      updated_at=now()
  from picked
  where pi.id=picked.id
  returning pi.*;
end;
$$;
revoke all on function public.asc3nd_worker_claim_sheet_sync(integer) from public,anon,authenticated;
grant execute on function public.asc3nd_worker_claim_sheet_sync(integer) to service_role;

create or replace function public.asc3nd_worker_mark_sheet_synced(p_ids uuid[])
returns integer
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
declare v_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  update asc3nd.participation_intakes
  set sheet_sync_status='synced',sheet_synced_at=now(),sheet_sync_claimed_at=null,sheet_sync_last_error=null,updated_at=now()
  where id=any(p_ids) and sheet_sync_status='syncing';
  get diagnostics v_count=row_count;
  return v_count;
end;
$$;
revoke all on function public.asc3nd_worker_mark_sheet_synced(uuid[]) from public,anon,authenticated;
grant execute on function public.asc3nd_worker_mark_sheet_synced(uuid[]) to service_role;

create or replace function public.asc3nd_worker_mark_sheet_failed(p_ids uuid[],p_error text)
returns integer
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
declare v_count integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  update asc3nd.participation_intakes
  set sheet_sync_status='failed',sheet_sync_claimed_at=null,sheet_sync_last_error=left(coalesce(p_error,'sync failed'),1000),updated_at=now()
  where id=any(p_ids) and sheet_sync_status='syncing';
  get diagnostics v_count=row_count;
  return v_count;
end;
$$;
revoke all on function public.asc3nd_worker_mark_sheet_failed(uuid[],text) from public,anon,authenticated;
grant execute on function public.asc3nd_worker_mark_sheet_failed(uuid[],text) to service_role;
