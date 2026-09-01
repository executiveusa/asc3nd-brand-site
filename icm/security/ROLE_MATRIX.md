# ASC3ND role and route security matrix

Authorization is stored in `asc3nd.organization_members`; policies use private helper functions and RLS. Do not use mutable user metadata as the authorization source.

## Roles

| Role | Scope |
|---|---|
| `owner` | full ASC3ND control |
| `admin` | full operational control except ownership semantics |
| `editor` | legacy broad operational role retained for compatibility |
| `program_manager` | program/family/partner/sponsor operational work |
| `communications_manager` | consent-aware relationship/content operations |
| `volunteer_coordinator` | volunteer/mentor/supplies queues |
| `event_staff` | event/family operational queue; no broad relationship database access |
| `volunteer` | only explicitly assigned routing/task rows; no direct unrestricted people access |
| `viewer` | legacy read compatibility; should be replaced with a specific least-privilege role before staff onboarding |

## Route-level access

- owner/admin/editor/program_manager: all routes
- communications_manager: all outreach routes, subject to consent policy
- volunteer_coordinator: volunteer, mentor, supplies
- event_staff: family and updates read paths
- volunteer: assigned rows only

## PII boundary

`asc3nd.people` remains restricted. Volunteers do not get direct table access. Event staff should use a purpose-built staff surface/RPC that returns only the fields required for event operation.

## Anonymous boundary

Anonymous users cannot directly read/write `asc3nd.event_rsvps`, people, routes, or tasks. Public intake must go through the explicitly granted RSVP function/server endpoint.

## Security checks after every migration

1. RLS enabled on every ASC3ND table.
2. Explicit grants only.
3. Security-definer helpers live in `asc3nd_private` whenever possible.
4. Public security-definer functions have intentionally reviewed EXECUTE grants.
5. Run Supabase security and performance advisors.
6. Test each staff role against its expected queue before production.
