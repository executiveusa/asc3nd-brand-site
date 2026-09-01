begin;

grant usage on schema asc3nd to authenticated;
grant select on asc3nd.people to authenticated;

drop function if exists public.asc3nd_staff_route_queue(text,text,integer,integer);
create function public.asc3nd_staff_route_queue(
  p_route_key text,
  p_status text default null,
  p_limit integer default 100,
  p_offset integer default 0
)
returns table (
  person_id uuid,
  display_name text,
  primary_email text,
  primary_phone text,
  preferred_language text,
  route_key text,
  route_status text,
  route_assigned_to uuid,
  task_id uuid,
  task_type text,
  task_status text,
  task_priority text,
  task_due_at timestamptz
)
language sql
stable
security invoker
set search_path = pg_catalog, public, asc3nd, asc3nd_private
as $$
  select
    p.id,
    p.display_name,
    p.primary_email,
    p.primary_phone,
    p.preferred_language,
    pr.route_key,
    pr.status,
    pr.assigned_to,
    ft.id,
    ft.task_type,
    ft.status,
    ft.priority,
    ft.due_at
  from asc3nd.person_routes pr
  join asc3nd.people p
    on p.organization_id = pr.organization_id and p.id = pr.person_id
  left join lateral (
    select f.* from asc3nd.followup_tasks f
    where f.organization_id = pr.organization_id
      and f.person_id = pr.person_id
      and f.route_key = pr.route_key
      and f.status not in ('done','cancelled')
    order by case f.priority when 'urgent' then 1 when 'high' then 2 when 'normal' then 3 else 4 end,
             f.created_at asc
    limit 1
  ) ft on true
  where pr.route_key = p_route_key
    and (p_status is null or pr.status = p_status)
  order by coalesce(ft.due_at, 'infinity'::timestamptz), pr.created_at desc
  limit greatest(1, least(coalesce(p_limit,100), 200))
  offset greatest(coalesce(p_offset,0),0);
$$;
revoke all on function public.asc3nd_staff_route_queue(text,text,integer,integer) from public, anon;
grant execute on function public.asc3nd_staff_route_queue(text,text,integer,integer) to authenticated;

create or replace function public.asc3nd_staff_update_followup(
  p_task_id uuid,
  p_status text,
  p_assigned_to uuid default null,
  p_due_at timestamptz default null
)
returns jsonb
language plpgsql
security invoker
set search_path = pg_catalog, public, asc3nd, asc3nd_private
as $$
declare
  v_task asc3nd.followup_tasks%rowtype;
begin
  if p_status not in ('open','working','waiting_human','done','cancelled') then
    raise exception 'invalid task status';
  end if;

  update asc3nd.followup_tasks
  set status = p_status,
      assigned_to = coalesce(p_assigned_to, assigned_to),
      due_at = coalesce(p_due_at, due_at),
      updated_at = now()
  where id = p_task_id
  returning * into v_task;

  if v_task.id is null then
    raise exception 'task not found or not authorized';
  end if;

  return jsonb_build_object('ok', true, 'task_id', v_task.id, 'status', v_task.status);
end;
$$;
revoke all on function public.asc3nd_staff_update_followup(uuid,text,uuid,timestamptz) from public, anon;
grant execute on function public.asc3nd_staff_update_followup(uuid,text,uuid,timestamptz) to authenticated;

commit;
