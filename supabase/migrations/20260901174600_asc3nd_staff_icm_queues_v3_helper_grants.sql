begin;
grant usage on schema asc3nd_private to authenticated;
grant execute on function asc3nd_private.has_route_access(uuid,text,boolean) to authenticated;
commit;
