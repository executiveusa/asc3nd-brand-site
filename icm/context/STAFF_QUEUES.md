# ASC3ND staff queue operating contract

The staff interface is a projection of ICM. It does not create a parallel CRM taxonomy.

## Source of truth

- Identity: `asc3nd.people`
- Context routing: `asc3nd.person_routes`
- Memory/work owed: `asc3nd.followup_tasks`, `asc3nd.touchpoints`, `asc3nd.communication_consents`

Public RPC: `public.asc3nd_staff_queue(route, limit, offset)`.

The function is `SECURITY INVOKER`. RLS remains authoritative.

## Queues

- `family`
- `updates`
- `volunteer`
- `mentor`
- `supplies`
- `sponsor`
- `partner`

One person may appear in several queues because Context can have several valid routes. Identity remains one record.

## Access model

- owner/admin/editor/program manager: broad operational scope
- communications manager: consent-aware outreach scope
- volunteer coordinator: volunteer / mentor / supplies
- event staff: family / updates
- volunteer: explicitly assigned route/task records only

A route being present in the interface never overrides RLS. If a role cannot see that route, the RPC returns no records for it.

## UI

`/staff` uses Supabase Auth magic-link sign-in and then calls the queue RPC with the authenticated session. There is no service-role credential in the browser.

The initial queue surface intentionally shows only the minimum useful relationship fields: name, direct contact, consent state, open task, priority, and last touchpoint. Richer person memory should be added only when a staff workflow proves it is needed.

## Verification gate

Before production staff onboarding:

1. assign real staff accounts to `asc3nd.organization_members`;
2. verify every role against allowed and denied queues;
3. verify direct-table access remains narrower than queue access;
4. keep volunteers restricted to assigned work;
5. review consent display behavior before enabling outbound actions.
