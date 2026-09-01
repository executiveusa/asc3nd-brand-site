begin;
grant select, insert, update on asc3nd.content_drops to authenticated;
grant select, insert, update on asc3nd.content_deliveries to authenticated;
grant select on asc3nd.people to authenticated;
grant select on asc3nd.person_routes to authenticated;
grant select on asc3nd.communication_consents to authenticated;
grant select, insert on asc3nd.touchpoints to authenticated;
grant select, insert on asc3nd.person_memory to authenticated;
commit;
