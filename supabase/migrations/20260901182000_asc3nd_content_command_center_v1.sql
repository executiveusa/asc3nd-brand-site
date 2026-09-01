begin;

create or replace function public.asc3nd_staff_content_drops()
returns table(
  id uuid,
  title text,
  slug text,
  route_key text,
  required_consent_purpose text,
  channel text,
  status text,
  approved_at timestamptz,
  created_at timestamptz,
  proposed_count bigint,
  approved_count bigint,
  sent_count bigint,
  replied_count bigint,
  suppressed_count bigint
)
language sql
security invoker
set search_path = pg_catalog, public, asc3nd
as $$
  select
    cd.id,
    cd.title,
    cd.slug,
    cd.route_key,
    cd.required_consent_purpose,
    cd.channel,
    cd.status,
    cd.approved_at,
    cd.created_at,
    count(*) filter (where d.status = 'proposed') as proposed_count,
    count(*) filter (where d.status = 'approved') as approved_count,
    count(*) filter (where d.status in ('sent','delivered','opened')) as sent_count,
    count(*) filter (where d.status = 'replied') as replied_count,
    count(*) filter (where d.status = 'suppressed') as suppressed_count
  from asc3nd.content_drops cd
  left join asc3nd.content_deliveries d on d.content_drop_id = cd.id
  group by cd.id
  order by cd.created_at desc;
$$;

create or replace function public.asc3nd_staff_content_deliveries(p_content_drop_id uuid)
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
  replied_at timestamptz
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
    d.replied_at
  from asc3nd.content_deliveries d
  join asc3nd.people p on p.id = d.person_id and p.organization_id = d.organization_id
  where d.content_drop_id = p_content_drop_id
  order by p.display_name asc;
$$;

create or replace function public.asc3nd_create_content_drop(
  p_title text,
  p_route_key text,
  p_required_consent_purpose text,
  p_body text default null,
  p_channel text default 'email'
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_org uuid;
  v_id uuid;
  v_slug text;
begin
  select id into v_org from asc3nd.organizations where slug = 'asc3nd' limit 1;
  if v_org is null then raise exception 'ASC3ND organization not found'; end if;
  if not asc3nd_private.has_org_role(v_org, array['owner','admin','editor','communications_manager']) then
    raise exception 'Not authorized to create content';
  end if;
  if nullif(trim(p_title),'') is null then raise exception 'Title is required'; end if;
  if p_route_key not in ('family','updates','volunteer','mentor','supplies','sponsor','partner') then raise exception 'Invalid route'; end if;
  if p_channel not in ('email','sms','phone','whatsapp','direct_mail','social_dm') then raise exception 'Invalid channel'; end if;
  v_slug := lower(regexp_replace(trim(p_title), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(gen_random_uuid()::text,1,8);
  insert into asc3nd.content_drops(
    organization_id, slug, title, purpose, channel, body, status,
    route_key, required_consent_purpose, audience_rules
  ) values (
    v_org, v_slug, trim(p_title), p_required_consent_purpose, p_channel, p_body, 'draft',
    p_route_key, p_required_consent_purpose,
    jsonb_build_object('route_key',p_route_key,'consent_purpose',p_required_consent_purpose)
  ) returning id into v_id;
  return jsonb_build_object('ok',true,'content_drop_id',v_id,'status','draft');
end;
$$;

create or replace function public.asc3nd_approve_content_drop(p_content_drop_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, asc3nd
as $$
declare
  v_org uuid;
  v_status text;
begin
  select organization_id into v_org from asc3nd.content_drops where id=p_content_drop_id;
  if v_org is null then raise exception 'Content drop not found'; end if;
  if not asc3nd_private.has_org_role(v_org, array['owner','admin','editor','communications_manager']) then
    raise exception 'Not authorized to approve content';
  end if;
  update asc3nd.content_drops
     set status='approved', approved_by=auth.uid(), approved_at=now(), updated_at=now()
   where id=p_content_drop_id and status='draft'
   returning status into v_status;
  if not found then raise exception 'Content drop must be draft'; end if;
  return jsonb_build_object('ok',true,'content_drop_id',p_content_drop_id,'status',v_status);
end;
$$;

revoke all on function public.asc3nd_staff_content_drops() from public, anon;
revoke all on function public.asc3nd_staff_content_deliveries(uuid) from public, anon;
revoke all on function public.asc3nd_create_content_drop(text,text,text,text,text) from public, anon;
revoke all on function public.asc3nd_approve_content_drop(uuid) from public, anon;
grant execute on function public.asc3nd_staff_content_drops() to authenticated;
grant execute on function public.asc3nd_staff_content_deliveries(uuid) to authenticated;
grant execute on function public.asc3nd_create_content_drop(text,text,text,text,text) to authenticated;
grant execute on function public.asc3nd_approve_content_drop(uuid) to authenticated;
grant execute on function public.asc3nd_prepare_content_audience(uuid) to authenticated;
grant execute on function public.asc3nd_approve_content_delivery(uuid) to authenticated;

commit;
