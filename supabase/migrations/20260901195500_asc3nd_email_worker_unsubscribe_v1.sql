begin;

alter table asc3nd.delivery_outbox
  add column if not exists unsubscribe_token uuid;

update asc3nd.delivery_outbox
set unsubscribe_token = gen_random_uuid()
where unsubscribe_token is null;

alter table asc3nd.delivery_outbox
  alter column unsubscribe_token set default gen_random_uuid(),
  alter column unsubscribe_token set not null;

create unique index if not exists delivery_outbox_unsubscribe_token_uidx
  on asc3nd.delivery_outbox(unsubscribe_token);

create or replace function public.asc3nd_unsubscribe(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_outbox asc3nd.delivery_outbox%rowtype;
  v_delivery asc3nd.content_deliveries%rowtype;
  v_drop asc3nd.content_drops%rowtype;
  v_person asc3nd.people%rowtype;
begin
  select * into v_outbox
  from asc3nd.delivery_outbox
  where unsubscribe_token = p_token;

  if not found then
    return jsonb_build_object('ok', true, 'status', 'processed');
  end if;

  select * into v_delivery from asc3nd.content_deliveries where id = v_outbox.delivery_id;
  select * into v_drop from asc3nd.content_drops where id = v_delivery.content_drop_id;
  select * into v_person
  from asc3nd.people
  where id = v_delivery.person_id and organization_id = v_delivery.organization_id;

  insert into asc3nd.communication_consents(
    organization_id, person_id, channel, purpose, status, consent_version,
    source_ref, proof, captured_at, revoked_at
  ) values (
    v_delivery.organization_id, v_delivery.person_id, v_drop.channel,
    v_drop.required_consent_purpose, 'revoked', 'asc3nd-email-unsubscribe-v1',
    'unsubscribe:' || v_outbox.id::text,
    jsonb_build_object('delivery_id', v_delivery.id, 'content_drop_id', v_drop.id),
    now(), now()
  );

  update asc3nd.content_deliveries d
     set status = 'suppressed'
    from asc3nd.content_drops cd
   where d.person_id = v_delivery.person_id
     and d.organization_id = v_delivery.organization_id
     and d.content_drop_id = cd.id
     and cd.channel = v_drop.channel
     and cd.required_consent_purpose = v_drop.required_consent_purpose
     and d.status in ('proposed','approved','queued','failed');

  update asc3nd.delivery_outbox o
     set status = 'cancelled',
         last_error = 'consent revoked by unsubscribe',
         updated_at = now()
    from asc3nd.content_deliveries d,
         asc3nd.content_drops cd
   where o.delivery_id = d.id
     and d.person_id = v_delivery.person_id
     and d.organization_id = v_delivery.organization_id
     and d.content_drop_id = cd.id
     and cd.channel = v_drop.channel
     and cd.required_consent_purpose = v_drop.required_consent_purpose
     and o.status in ('pending','claimed','failed');

  insert into asc3nd.touchpoints(
    organization_id, person_id, channel, direction, touchpoint_type,
    subject, content_ref, context
  ) values (
    v_delivery.organization_id, v_delivery.person_id, 'web', 'inbound',
    'consent_revoked', 'Email preference updated', 'unsubscribe:' || v_outbox.id::text,
    jsonb_build_object('channel', v_drop.channel, 'purpose', v_drop.required_consent_purpose)
  );

  insert into asc3nd.person_memory(
    organization_id, person_id, memory_type, summary, details,
    source_ref, human_verified, occurred_at
  ) values (
    v_delivery.organization_id, v_delivery.person_id, 'consent_revoked',
    'Email consent revoked for ' || v_drop.required_consent_purpose,
    jsonb_build_object('channel', v_drop.channel, 'purpose', v_drop.required_consent_purpose),
    'unsubscribe:' || v_outbox.id::text, true, now()
  );

  return jsonb_build_object('ok', true, 'status', 'unsubscribed');
end;
$$;

revoke all on function public.asc3nd_unsubscribe(uuid) from public;
grant execute on function public.asc3nd_unsubscribe(uuid) to anon, authenticated;

create or replace function public.asc3nd_worker_claim_outbox(
  p_limit integer default 10,
  p_provider text default 'resend'
)
returns table(
  outbox_id uuid,
  delivery_id uuid,
  person_id uuid,
  to_email text,
  subject text,
  body text,
  unsubscribe_token uuid
)
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 50 then
    raise exception 'p_limit must be between 1 and 50';
  end if;

  update asc3nd.delivery_outbox o
     set status = 'cancelled',
         last_error = 'blocked at send time: consent revoked or do-not-contact',
         updated_at = now()
    from asc3nd.content_deliveries d
    join asc3nd.content_drops cd on cd.id = d.content_drop_id
    join asc3nd.people p on p.id = d.person_id and p.organization_id = d.organization_id
   where o.delivery_id = d.id
     and o.status in ('pending','failed')
     and o.provider = p_provider
     and (
       p.do_not_contact
       or coalesce((
         select cc.status
         from asc3nd.communication_consents cc
         where cc.organization_id = d.organization_id
           and cc.person_id = d.person_id
           and cc.channel = cd.channel
           and cc.purpose = cd.required_consent_purpose
         order by coalesce(cc.captured_at, cc.created_at) desc, cc.created_at desc
         limit 1
       ), 'unknown') <> 'granted'
     );

  update asc3nd.content_deliveries d
     set status = 'suppressed'
    from asc3nd.delivery_outbox o
   where o.delivery_id = d.id
     and o.status = 'cancelled'
     and o.last_error = 'blocked at send time: consent revoked or do-not-contact'
     and d.status = 'queued';

  return query
  with candidates as (
    select o.id
    from asc3nd.delivery_outbox o
    join asc3nd.content_deliveries d on d.id = o.delivery_id
    join asc3nd.content_drops cd on cd.id = d.content_drop_id
    join asc3nd.people p on p.id = d.person_id and p.organization_id = d.organization_id
    where o.status in ('pending','failed')
      and o.provider = p_provider
      and d.status = 'queued'
      and p.do_not_contact = false
      and p.primary_email is not null
      and coalesce((
        select cc.status
        from asc3nd.communication_consents cc
        where cc.organization_id = d.organization_id
          and cc.person_id = d.person_id
          and cc.channel = cd.channel
          and cc.purpose = cd.required_consent_purpose
        order by coalesce(cc.captured_at, cc.created_at) desc, cc.created_at desc
        limit 1
      ), 'unknown') = 'granted'
    order by o.created_at
    for update of o skip locked
    limit p_limit
  ), claimed as (
    update asc3nd.delivery_outbox o
       set status = 'claimed',
           claimed_at = now(),
           attempts = attempts + 1,
           last_error = null,
           updated_at = now()
      from candidates c
     where o.id = c.id
    returning o.*
  )
  select c.id, d.id, p.id, p.primary_email, cd.title, coalesce(cd.body, ''), c.unsubscribe_token
  from claimed c
  join asc3nd.content_deliveries d on d.id = c.delivery_id
  join asc3nd.content_drops cd on cd.id = d.content_drop_id
  join asc3nd.people p on p.id = d.person_id and p.organization_id = d.organization_id;
end;
$$;

revoke all on function public.asc3nd_worker_claim_outbox(integer,text) from public, anon, authenticated;
grant execute on function public.asc3nd_worker_claim_outbox(integer,text) to service_role;

create or replace function public.asc3nd_worker_mark_outbox_sent(
  p_outbox_id uuid,
  p_provider_message_id text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_outbox asc3nd.delivery_outbox%rowtype;
  v_result jsonb;
begin
  select * into v_outbox
  from asc3nd.delivery_outbox
  where id = p_outbox_id and status = 'claimed'
  for update;

  if not found then raise exception 'Claimed outbox row not found'; end if;

  select public.asc3nd_record_content_sent(v_outbox.delivery_id, p_provider_message_id)
    into v_result;

  update asc3nd.delivery_outbox
     set status = 'sent',
         provider_message_id = p_provider_message_id,
         sent_at = now(),
         updated_at = now()
   where id = p_outbox_id;

  return jsonb_build_object('ok', true, 'outbox_id', p_outbox_id, 'delivery', v_result);
end;
$$;

revoke all on function public.asc3nd_worker_mark_outbox_sent(uuid,text) from public, anon, authenticated;
grant execute on function public.asc3nd_worker_mark_outbox_sent(uuid,text) to service_role;

create or replace function public.asc3nd_worker_mark_outbox_failed(
  p_outbox_id uuid,
  p_error text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_attempts integer;
begin
  update asc3nd.delivery_outbox
     set status = case when attempts >= 5 then 'failed' else 'pending' end,
         last_error = left(coalesce(p_error, 'provider error'), 1000),
         updated_at = now()
   where id = p_outbox_id and status = 'claimed'
  returning attempts into v_attempts;

  if v_attempts is null then raise exception 'Claimed outbox row not found'; end if;

  return jsonb_build_object(
    'ok', true,
    'outbox_id', p_outbox_id,
    'attempts', v_attempts,
    'status', case when v_attempts >= 5 then 'failed' else 'pending' end
  );
end;
$$;

revoke all on function public.asc3nd_worker_mark_outbox_failed(uuid,text) from public, anon, authenticated;
grant execute on function public.asc3nd_worker_mark_outbox_failed(uuid,text) to service_role;

commit;
