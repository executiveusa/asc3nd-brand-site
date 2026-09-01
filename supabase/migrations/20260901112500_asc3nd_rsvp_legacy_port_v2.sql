-- ASC3ND RSVP legacy port v2
-- Applied to production Supabase as migration asc3nd_rsvp_legacy_port_v2.

begin;

create or replace function asc3nd_private.generate_confirmation_code(p_prefix text default 'ASC3ND')
returns text language plpgsql volatile security definer set search_path=pg_catalog as $$
declare chars constant text:='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; candidate text; i int; attempt int:=0;
begin
 loop
   attempt:=attempt+1; candidate:=coalesce(nullif(btrim(p_prefix),''),'ASC3ND')||'-';
   for i in 1..6 loop candidate:=candidate||substr(chars,floor(random()*length(chars))::int+1,1); end loop;
   exit when not exists(select 1 from asc3nd.event_rsvps r where r.confirmation_code=candidate);
   if attempt>=20 then raise exception 'Unable to generate confirmation code'; end if;
 end loop; return candidate;
end $$;
revoke all on function asc3nd_private.generate_confirmation_code(text) from public,anon,authenticated;

create or replace function public.asc3nd_submit_rsvp(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path='pg_catalog','public' as $$
declare
  v_org asc3nd.organizations%rowtype; v_event asc3nd.events%rowtype; v_existing asc3nd.event_rsvps%rowtype; v_id uuid;
  v_name text:=nullif(btrim(coalesce(p_payload->>'guardian_name',p_payload->>'name','')),'');
  v_email text:=nullif(lower(btrim(coalesce(p_payload->>'email',''))),''); v_phone text:=nullif(btrim(coalesce(p_payload->>'phone','')),'');
  v_interest text:=coalesce(nullif(p_payload->>'interest',''),nullif(p_payload->>'participation',''),'attend'); v_children integer;
  v_age_range text:=nullif(p_payload->>'age_range',''); v_arrival text:=nullif(p_payload->>'arrival_window','');
  v_language text:=coalesce(nullif(p_payload->>'preferred_language',''),'en'); v_preferences text[]:='{}'::text[];
  v_idempotency text:=nullif(btrim(coalesce(p_payload->>'idempotency_key','')),'');
  v_consent boolean:=coalesce((p_payload->>'consent_accepted')::boolean,(p_payload->>'contact_consent')::boolean,(p_payload->>'consent')::boolean,false);
  v_source text:=nullif(btrim(coalesce(p_payload->>'source_page',p_payload->>'source_path',p_payload->>'source','')),'');
  v_accessibility boolean:=coalesce((p_payload->>'accessibility_contact')::boolean,false); v_private boolean:=coalesce((p_payload->>'contact_privately')::boolean,false);
  v_requested_service text:=coalesce(nullif(p_payload->>'requested_service',''),'haircut'); v_confirmation text:=nullif(upper(btrim(coalesce(p_payload->>'confirmation_code',''))),'');
begin
  if p_payload is null or jsonb_typeof(p_payload)<>'object' then raise exception 'Invalid request body' using errcode='22023'; end if;
  if v_interest='general' then v_interest:='updates'; end if;
  if v_name is null or char_length(v_name) not between 2 and 100 then raise exception 'Please provide the adult contact name.' using errcode='22023'; end if;
  if v_email is null and v_phone is null then raise exception 'Please provide an email address or phone number.' using errcode='22023'; end if;
  if v_email is not null and v_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Please provide a valid email address.' using errcode='22023'; end if;
  if v_interest not in ('attend','updates','volunteer','mentor','supplies','sponsor','partner') then raise exception 'Unsupported interest type.' using errcode='22023'; end if;
  if v_language not in ('en','es') then raise exception 'Unsupported language.' using errcode='22023'; end if;
  if v_arrival is not null and v_arrival not in ('12-1','1-2','2-3','unsure') then raise exception 'Unsupported arrival window.' using errcode='22023'; end if;
  if v_age_range is not null and v_age_range not in ('preschool','elementary','middle-school','high-school','mixed-ages') then raise exception 'Unsupported age range.' using errcode='22023'; end if;
  if not v_consent then raise exception 'Contact consent is required.' using errcode='22023'; end if;
  if p_payload ? 'children_count' and nullif(p_payload->>'children_count','') is not null then v_children:=(p_payload->>'children_count')::integer; end if;
  if v_interest='attend' and (v_children is null or v_children not between 1 and 10) then raise exception 'Number of children must be between 1 and 10.' using errcode='22023'; end if;
  if v_interest<>'attend' then v_children:=null; v_arrival:=null; v_age_range:=null; end if;
  select array_agg(distinct value order by value) into v_preferences from (
    select value from jsonb_array_elements_text(coalesce(p_payload->'preferences','[]'::jsonb)) value
    union all select value from jsonb_array_elements_text(coalesce(p_payload->'updates','[]'::jsonb)) value
  ) s where value in ('accessibility','spanish','volunteer','supplies','event-updates');
  v_preferences:=coalesce(v_preferences,'{}'::text[]); v_accessibility:=v_accessibility or 'accessibility'=any(v_preferences);
  if v_language='es' and not ('spanish'=any(v_preferences)) then v_preferences:=array_append(v_preferences,'spanish'); end if;
  select * into v_org from asc3nd.organizations where slug='asc3nd' and status='active'; if not found then raise exception 'ASC3ND organization is not configured.'; end if;
  select * into v_event from asc3nd.events where organization_id=v_org.id and slug=coalesce(nullif(p_payload->>'event_slug',''),'community-cuts-for-kids-2026') and status in ('published','draft'); if not found then raise exception 'Event is not configured.'; end if;
  v_idempotency:=coalesce(v_idempotency,gen_random_uuid()::text);
  select * into v_existing from asc3nd.event_rsvps where event_id=v_event.id and idempotency_key=v_idempotency;
  if found then return jsonb_build_object('ok',true,'id',v_existing.id,'confirmation_code',v_existing.confirmation_code,'status',v_existing.status,'duplicate',true); end if;
  if v_confirmation is null then v_confirmation:=asc3nd_private.generate_confirmation_code('ASC3ND'); end if;
  insert into asc3nd.event_rsvps(organization_id,event_id,guardian_name,email,phone,interest,children_count,age_range,requested_service,arrival_window,preferred_language,accessibility_contact,contact_privately,preferences,consent_accepted,consent_version,consent_copy,consent_accepted_at,source_page,idempotency_key,confirmation_code,metadata)
  values(v_org.id,v_event.id,v_name,v_email,v_phone,v_interest,v_children,v_age_range,v_requested_service,v_arrival,v_language,v_accessibility,v_private,v_preferences,true,v_event.consent_version,v_event.consent_copy,now(),v_source,v_idempotency,v_confirmation,jsonb_build_object('registration_type',case when v_interest='attend' then 'community-cuts-family-rsvp' else 'community-cuts-supporter-interest' end,'schema_version','asc3nd-rsvp-v2','legacy_compatible',true,'referral_source',nullif(p_payload->>'referral_source',''))) returning id into v_id;
  return jsonb_build_object('ok',true,'id',v_id,'confirmation_code',v_confirmation,'status','received','route',case when v_interest='attend' then 'family' else v_interest end);
end $$;

commit;
