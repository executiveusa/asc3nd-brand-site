begin;

drop policy if exists "asc3nd communications read touchpoints" on asc3nd.touchpoints;
create policy "asc3nd communications read touchpoints" on asc3nd.touchpoints
  for select to authenticated
  using ((select asc3nd_private.has_org_role(touchpoints.organization_id, array['communications_manager','program_manager']::text[])));

drop policy if exists "asc3nd communications write touchpoints" on asc3nd.touchpoints;
create policy "asc3nd communications write touchpoints" on asc3nd.touchpoints
  for insert to authenticated
  with check ((select asc3nd_private.has_org_role(touchpoints.organization_id, array['communications_manager']::text[])));

drop policy if exists "asc3nd communications read memory" on asc3nd.person_memory;
create policy "asc3nd communications read memory" on asc3nd.person_memory
  for select to authenticated
  using ((select asc3nd_private.has_org_role(person_memory.organization_id, array['communications_manager','program_manager']::text[])));

drop policy if exists "asc3nd communications write memory" on asc3nd.person_memory;
create policy "asc3nd communications write memory" on asc3nd.person_memory
  for insert to authenticated
  with check ((select asc3nd_private.has_org_role(person_memory.organization_id, array['communications_manager']::text[])));

drop policy if exists "asc3nd communications read consents" on asc3nd.communication_consents;
create policy "asc3nd communications read consents" on asc3nd.communication_consents
  for select to authenticated
  using ((select asc3nd_private.has_org_role(communication_consents.organization_id, array['communications_manager','program_manager']::text[])));

commit;
