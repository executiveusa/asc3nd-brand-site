begin;

create or replace function asc3nd_private.sync_promoted_recovery_routes()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, asc3nd, asc3nd_private
as $$
declare
  v_route text;
  v_item text;
begin
  if new.review_status <> 'promoted' or new.promoted_person_id is null then
    return new;
  end if;

  if new.source_type = 'family_rsvp' then
    insert into asc3nd.person_routes(organization_id, person_id, route_key, source_type, source_ref, status)
    select new.organization_id, new.promoted_person_id, 'family', 'community_cuts_recovery', 'import_staging:' || new.id::text, 'active'
    where not exists (
      select 1 from asc3nd.person_routes pr
      where pr.organization_id=new.organization_id
        and pr.person_id=new.promoted_person_id
        and pr.route_key='family'
        and pr.status in ('new','active')
    );
  end if;

  foreach v_item in array string_to_array(lower(coalesce(new.relationship_interest,'')), ';')
  loop
    v_route := case trim(v_item)
      when 'general' then 'updates'
      when 'event-updates' then 'updates'
      when 'updates' then 'updates'
      when 'volunteer' then 'volunteer'
      when 'mentor' then 'mentor'
      when 'supplies' then 'supplies'
      when 'sponsor' then 'sponsor'
      when 'partner' then 'partner'
      else null end;

    if v_route is not null then
      insert into asc3nd.person_routes(organization_id, person_id, route_key, source_type, source_ref, status)
      select new.organization_id, new.promoted_person_id, v_route, 'community_cuts_recovery', 'import_staging:' || new.id::text, 'active'
      where not exists (
        select 1 from asc3nd.person_routes pr
        where pr.organization_id=new.organization_id
          and pr.person_id=new.promoted_person_id
          and pr.route_key=v_route
          and pr.status in ('new','active')
      );
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists asc3nd_sync_promoted_recovery_routes on asc3nd.import_contacts_staging;
create trigger asc3nd_sync_promoted_recovery_routes
after insert or update of review_status, promoted_person_id, relationship_interest
on asc3nd.import_contacts_staging
for each row
execute function asc3nd_private.sync_promoted_recovery_routes();

commit;
