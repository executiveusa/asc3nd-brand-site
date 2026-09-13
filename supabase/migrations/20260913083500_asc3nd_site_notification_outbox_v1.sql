-- ASC3ND website intake notifications -> main@asc3nd.org

create table if not exists asc3nd.site_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('community_signup','participation')),
  payload jsonb not null,
  recipient_email text not null default 'main@asc3nd.org',
  status text not null default 'pending',
  attempt_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table asc3nd.site_notification_outbox drop constraint if exists site_notification_outbox_status_check;
alter table asc3nd.site_notification_outbox
  add constraint site_notification_outbox_status_check
  check (status in ('pending','processing','sent','failed'));

alter table asc3nd.site_notification_outbox enable row level security;
revoke all on asc3nd.site_notification_outbox from public, anon, authenticated;
grant all on asc3nd.site_notification_outbox to service_role;

create or replace function asc3nd_private.queue_site_notification()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, asc3nd
as $$
begin
  insert into asc3nd.site_notification_outbox(kind, payload, recipient_email)
  values (
    'participation',
    jsonb_build_object(
      'id', new.id,
      'name', new.name,
      'email', new.email,
      'phone', new.phone,
      'organization_name', new.organization_name,
      'route_key', new.route_key,
      'form_type', new.form_type,
      'preferred_language', new.preferred_language,
      'answers', new.answers,
      'contact_consent', new.contact_consent,
      'updates_opt_in', new.updates_opt_in,
      'source_page', new.source_page,
      'created_at', new.created_at
    ),
    'main@asc3nd.org'
  );
  return new;
end;
$$;

create or replace function asc3nd_private.queue_community_signup_notification()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, asc3nd
as $$
declare
  v_person asc3nd.people%rowtype;
begin
  if new.channel = 'website' and new.direction = 'inbound' and new.touchpoint_type = 'community_signup' then
    select * into v_person from asc3nd.people where id = new.person_id;
    insert into asc3nd.site_notification_outbox(kind, payload, recipient_email)
    values (
      'community_signup',
      jsonb_build_object(
        'person_id', new.person_id,
        'name', v_person.display_name,
        'email', v_person.primary_email,
        'preferred_language', v_person.preferred_language,
        'source', new.context->>'source',
        'occurred_at', new.occurred_at
      ),
      'main@asc3nd.org'
    );
  end if;
  return new;
end;
$$;

DROP TRIGGER IF EXISTS trg_queue_participation_notification ON asc3nd.participation_intakes;
CREATE TRIGGER trg_queue_participation_notification
AFTER INSERT ON asc3nd.participation_intakes
FOR EACH ROW EXECUTE FUNCTION asc3nd_private.queue_site_notification();

DROP TRIGGER IF EXISTS trg_queue_community_signup_notification ON asc3nd.touchpoints;
CREATE TRIGGER trg_queue_community_signup_notification
AFTER INSERT ON asc3nd.touchpoints
FOR EACH ROW EXECUTE FUNCTION asc3nd_private.queue_community_signup_notification();

create or replace function asc3nd_private.claim_site_notifications(p_limit integer default 10)
returns setof asc3nd.site_notification_outbox
language plpgsql
security definer
set search_path = pg_catalog, asc3nd
as $$
begin
  return query
  with picked as (
    select id
    from asc3nd.site_notification_outbox
    where status in ('pending','failed') and attempt_count < 5
    order by created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit,10),25))
  )
  update asc3nd.site_notification_outbox o
  set status='processing', attempt_count=o.attempt_count+1, last_error=null
  from picked
  where o.id=picked.id
  returning o.*;
end;
$$;

create or replace function asc3nd_private.mark_site_notification_sent(p_id uuid)
returns void
language sql
security definer
set search_path = pg_catalog, asc3nd
as $$
  update asc3nd.site_notification_outbox
  set status='sent', sent_at=now(), last_error=null
  where id=p_id;
$$;

create or replace function asc3nd_private.mark_site_notification_failed(p_id uuid, p_error text)
returns void
language sql
security definer
set search_path = pg_catalog, asc3nd
as $$
  update asc3nd.site_notification_outbox
  set status='failed', last_error=left(coalesce(p_error,'unknown error'),1000)
  where id=p_id;
$$;

revoke all on function asc3nd_private.claim_site_notifications(integer) from public, anon, authenticated;
revoke all on function asc3nd_private.mark_site_notification_sent(uuid) from public, anon, authenticated;
revoke all on function asc3nd_private.mark_site_notification_failed(uuid,text) from public, anon, authenticated;
grant execute on function asc3nd_private.claim_site_notifications(integer) to service_role;
grant execute on function asc3nd_private.mark_site_notification_sent(uuid) to service_role;
grant execute on function asc3nd_private.mark_site_notification_failed(uuid,text) to service_role;
