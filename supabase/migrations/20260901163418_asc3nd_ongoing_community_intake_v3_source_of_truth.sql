-- Canonical post-event ASC3ND community email intake.
-- Idempotent source-of-truth migration for the public website signup path.

create table if not exists asc3nd_private.community_intake_rate_limits (
  email_hash text not null,
  request_at timestamptz not null default now()
);

create index if not exists community_intake_rate_limits_email_time_idx
  on asc3nd_private.community_intake_rate_limits (email_hash, request_at desc);

revoke all on asc3nd_private.community_intake_rate_limits from public, anon, authenticated;

-- The function body was introduced and verified in the immediately preceding
-- production migrations asc3nd_ongoing_community_intake_v1/v2. This migration
-- locks the intended API boundary and documents the canonical public contract.
revoke all on function public.asc3nd_join_community(jsonb) from public;
revoke all on function public.asc3nd_join_community(jsonb) from authenticated;
grant execute on function public.asc3nd_join_community(jsonb) to anon;
grant execute on function public.asc3nd_join_community(jsonb) to service_role;

comment on function public.asc3nd_join_community(jsonb) is
  'Public ASC3ND post-event community signup. Validates explicit email consent, resolves exact identity only, routes to C/participation/updates, and records ICM context/memory/touchpoint.';
