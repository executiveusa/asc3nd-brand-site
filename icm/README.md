# ASC3ND ICM operating architecture

Everything in ASC3ND follows **ICM: Identity → Context → Memory**.

No parallel CRM taxonomy may bypass this structure.

## Identity (`I/`)
Identity answers **who is this person and how do we know that?**

Canonical tables:
- `asc3nd.people`
- `asc3nd.person_sources`
- `asc3nd.identity_resolution_cases`

Rules:
- exact verified email/phone or human confirmation may resolve identity;
- similar names never auto-merge;
- source provenance stays attached permanently;
- uncertain imports stay in staging.

## Context (`C/`)
Context answers **why are they here and which ASC3ND lane owns the relationship?**

Canonical tables:
- `asc3nd.person_context`
- `asc3nd.icm_routes`
- `asc3nd.person_routes`

Route folders:
- `C/participation/family`
- `C/participation/updates`
- `C/participation/volunteer`
- `C/participation/mentor`
- `C/participation/supplies`
- `C/participation/sponsor`
- `C/participation/partner`

An RSVP may belong to more than one route. Example: a family RSVP that also selects volunteer and supplies is routed to all three lanes without duplicating the person.

## Memory (`M/`)
Memory answers **what actually happened and what must happen next?**

Canonical tables:
- `asc3nd.person_memory`
- `asc3nd.touchpoints`
- `asc3nd.followup_tasks`
- `asc3nd.communication_consents`
- `asc3nd.content_drops`
- `asc3nd.content_deliveries`

Memory is append-oriented. Never rewrite history to make the current state look cleaner.

## Intake invariant

`website form → event_rsvps → Identity → Context routes → Memory/task/consent`

Supabase is canonical. Google Sheets is an operational mirror/review surface, not the source of truth.

## Ported legacy behavior

The legacy Community Cuts app separated `rsvps` and `supporters`. The canonical system keeps one intake table (`asc3nd.event_rsvps`) and routes records by intent. Legacy `general` maps to `updates`; `attend` maps to `family`.

Legacy lifecycle values are preserved in the canonical status vocabulary: `received`, `confirmed`, `waitlisted`, `cancelled`, `attended`, `no_show`, plus `reviewed`, `closed`, and `spam` for the new workflow.

## Security invariant

Authorization lives in `asc3nd.organization_members` + RLS/private helper functions, never editable user metadata. Volunteers never receive direct unrestricted access to the people table.
