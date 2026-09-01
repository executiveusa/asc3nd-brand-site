begin;

-- Route-scoped people visibility for staff queue projections.
drop policy if exists "asc3nd route staff read routed people" on asc3nd.people;
create policy "asc3nd route staff read routed people"
on asc3nd.people
for select
to authenticated
using (
  exists (
    select 1
    from asc3nd.person_routes pr
    where pr.organization_id = people.organization_id
      and pr.person_id = people.id
      and pr.status in ('new','active','paused')
      and asc3nd_private.has_route_access(pr.organization_id, pr.route_key, false)
      and (
        asc3nd_private.has_org_role(pr.organization_id, array['owner','admin','editor','viewer','program_manager','communications_manager','volunteer_coordinator','event_staff'])
        or pr.assigned_to = auth.uid()
      )
  )
);

create or replace function public.asc3nd_staff_queue(
  p_route_key text,
  p_limit integer default 50,
  p_offset integer default 0
)
returns table (
  person_id uuid,
  display_name text,
  preferred_name text,
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
  task_due_at timestamptz,
  consent_email_updates text,
  last_touchpoint_at timestamptz
)
language sql
stable
security invoker
set search_path = pg_catalog, public, asc3nd, asc3nd_private
as $$
  select
    p.id,
    p.display_name,
    p.preferred_name,
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
    ft.due_at,
    coalesce((
      select cc.status
      from asc3nd.communication_consents cc
      where cc.organization_id = p.organization_id
        and cc.person_id = p.id
        and cc.channel = 'email'
        and cc.purpose in ('ongoing_asc3nd_updates','event_followup')
      order by cc.created_at desc
      limit 1
    ), 'unknown') as consent_email_updates,
    (
      select max(t.occurred_at)
      from asc3nd.touchpoints t
      where t.organization_id = p.organization_id
        and t.person_id = p.id
    ) as last_touchpoint_at
  from asc3nd.person_routes pr
  join asc3nd.people p
    on p.organization_id = pr.organization_id
   and p.id = pr.person_id
  left join lateral (
    select f.*
    from asc3nd.followup_tasks f
    where f.organization_id = pr.organization_id
      and f.person_id = pr.person_id
      and f.route_key = pr.route_key
      and f.status not in ('done','cancelled')
    order by
      case f.priority when 'urgent' then 1 when 'high' then 2 when 'normal' then 3 else 4 end,
      f.due_at nulls last,
      f.created_at
    limit 1
  ) ft on true
  where pr.route_key = p_route_key
    and pr.status in ('new','active','paused')
  order by
    case coalesce(ft.priority,'normal') when 'urgent' then 1 when 'high' then 2 when 'normal' then 3 else 4 end,
    ft.due_at nulls last,
    p.display_name
  limit greatest(1, least(coalesce(p_limit,50), 100))
  offset greatest(coalesce(p_offset,0),0);
$$;

revoke all on function public.asc3nd_staff_queue(text, integer, integer) from public, anon;
grant execute on function public.asc3nd_staff_queue(text, integer, integer) to authenticated;

commit;
