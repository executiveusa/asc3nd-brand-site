# ASC3ND relationship content engine

The content engine is a Memory-layer workflow built on verified Identity and Context. It does not create a parallel marketing database.

## Operating flow

`person → verified route/context → current consent → approved content → proposed delivery → human approval → provider send → touchpoint + memory`

## Hard rules

1. `asc3nd.people` remains the canonical person identity.
2. Audience membership comes from active `person_routes`, never copied mailing lists.
3. Current consent is evaluated by channel + purpose. A newer revoked record overrides an older grant.
4. `people.do_not_contact = true` suppresses audience preparation.
5. A content drop must be `approved` before the audience can be prepared.
6. Audience preparation creates `proposed` deliveries only. It does not send anything.
7. Each delivery requires explicit approval before a provider adapter may send it.
8. Sending must call `asc3nd_record_content_sent` so the delivery becomes a touchpoint and durable relationship memory.
9. AI may draft copy and personalization from verified context. AI does not invent personal facts or silently promote derived context to fact.
10. Event-only consent is not general marketing consent.

## Canonical objects

- `asc3nd.content_drops` — one approved communication unit and its route/purpose contract.
- `asc3nd.content_deliveries` — one person-specific proposed/approved/sent record.
- `asc3nd.communication_consents` — append-oriented permission evidence.
- `asc3nd.touchpoints` — the actual outbound/inbound relationship interaction.
- `asc3nd.person_memory` — durable memory that the interaction occurred.

## First approved use cases

- Community Cuts personal thank-you under the original event-follow-up purpose.
- Volunteer or supplies follow-up when that participation option was selected.
- Invitation to opt into ongoing ASC3ND updates.
- Ongoing community updates only after explicit `ongoing_asc3nd_updates` email consent.

## Provider boundary

No email/SMS provider owns audience truth. Provider adapters consume already-approved deliveries and write provider IDs/status back to the canonical delivery. Supabase remains the source of truth.
