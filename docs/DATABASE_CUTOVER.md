# ASC3ND database cutover and ongoing email capture

## Decision

Do **not** move the active relationship database into the website.

The website is a client of the canonical Supabase project. This keeps one source of truth while allowing the public site, future event pages, staff tools, and automations to use the same Identity → Context → Memory system.

Canonical production Supabase project:

- project: `botanic-creations`
- project ref: `cyxdevcjycmffhmwxojh`
- canonical ASC3ND schema: `asc3nd`

## New-site runtime path

```text
asc3nd.org
   |
   v
POST /api/community/join
   |
   v
public.asc3nd_join_community(jsonb)
   |
   +--> I / people + person_sources
   +--> C / updates route + person_context
   +--> M / consent + memory + touchpoint + welcome follow-up
```

The public browser never receives a Supabase service-role secret.

Vercel needs only these server environment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

The API route uses the publishable key to call the intentionally public, narrowly scoped signup RPC. Direct anonymous table writes remain blocked.

## Why this survives the event

The event RSVP form and the ongoing community signup are separate entry points.

- Event RSVP → `asc3nd.event_rsvps` → family/volunteer/etc. routes.
- Ongoing website signup → `asc3nd_join_community` → `C/participation/updates`.

Closing Community Cuts therefore does not close email collection. The main site can continue collecting explicit email opt-ins indefinitely without pretending every future subscriber attended an event.

## Consent rule

A prior event contact is not automatically converted into general marketing permission.

The ongoing signup records:

- channel: email
- purpose: `ongoing_asc3nd_updates`
- status: granted
- consent version: `asc3nd-community-updates-v1`
- explicit checkbox proof and source

Every re-consent is appended to the consent ledger rather than rewriting old history.

## Legacy database transfer

The old Community Cuts application targeted a different Supabase project and legacy tables (`public.rsvps` and `public.supporters`). When that project becomes accessible:

1. export the legacy tables from the old project;
2. import them into `asc3nd.import_contacts_staging` with old project/table/row provenance;
3. reconcile against the recovered Google Sheet;
4. human-review ambiguous or conflicting identity rows;
5. promote verified records into canonical `asc3nd.people`, `event_rsvps`, routes, context, consent, and memory;
6. compare source counts and hashes before retiring the old project.

Never point the new site at the old database. The old database is a migration source only.

## Cutover proof

Before production domain cutover:

1. GitHub CI passes at exact SHA.
2. Vercel preview is built from that SHA.
3. `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are present in Preview and Production environments.
4. Submit a synthetic signup through the deployed website.
5. Verify one person, one updates route, one consent record, one touchpoint, and one welcome task.
6. Delete the synthetic record.
7. Run Supabase security advisor.
8. Verify rollback target before changing `asc3nd.org`.
