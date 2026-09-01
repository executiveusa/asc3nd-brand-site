# ASC3ND community data pipeline

## Decision

Supabase is the canonical relationship database. Google Sheets is the staff review and campaign-planning surface.

Do not make the website dual-write directly to both systems. New submissions should write once to Supabase, then approved automation can mirror operational fields to Google Sheets.

## Recovery source

The legacy Community Cuts staff dashboard showed:

- 31 family RSVP records
- 67 children expected
- 13 supporter-interest records
- 44 source records total

The legacy CSV/export path could not be recovered reliably, so the 2026-09-01 dashboard screenshot was transcribed into the Google Sheet:

`ASC3ND — Community Cuts Contact & Follow-Up Master`

Google Sheet ID:

`1AINRICsxDODe9lwKKScjjUYZTRoL36B4QPsc05OU09M`

Rows marked `NEEDS REVIEW` are not approved identity data. They must be human-verified before promotion or outbound contact.

## Supabase recovery layer

Additive staging tables:

- `asc3nd.import_batches`
- `asc3nd.import_contacts_staging`

Current recovery batch:

- source: Google Sheet recovered from staff-dashboard screenshot
- status: `reviewing`
- record count: 44
- marketing permission default: `EVENT_FOLLOWUP_ONLY`

Staging exists so uncertain transcription never contaminates canonical people, RSVP, consent, or relationship history.

## Canonical ICM relationship model

### Identity

- `asc3nd.people`
- `asc3nd.person_sources`

Identity merges are allowed only on strong verified evidence such as an exact confirmed email, exact confirmed phone number, or explicit human confirmation. Similar names are not enough.

### Context

- `asc3nd.person_context`

Store event role, selected interests, language, participation context, and other facts with provenance. AI-derived context must remain marked `derived` or `assumption` until a human verifies it.

### Memory

- `asc3nd.person_memory`
- `asc3nd.touchpoints`

Store what actually happened: RSVP, attendance, conversation, thank-you, reply, promise, meeting, volunteer contribution, or future follow-up.

### Consent

- `asc3nd.communication_consents`

Relationship identity is not marketing permission. Community Cuts records default to event/selected-participation follow-up only until continuing consent is captured.

### Content

- `asc3nd.content_drops`
- `asc3nd.content_deliveries`

Every outbound item should record purpose, audience, channel, required consent, personalization, send state, and response state.

## New website intake path

Production target:

```text
ASC3ND website form
      |
      v
server-side intake endpoint
      |
      v
asc3nd.event_rsvps
      |
      +--> person/source resolution
      +--> person_context
      +--> communication_consents
      +--> touchpoint
      |
      v
staff dashboard + optional Google Sheet mirror
```

The browser must never receive a Supabase secret/service key.

## Google Sheet role

The Sheet is for:

- verifying recovered records
- assigning owners
- recording thank-you progress
- reviewing possible duplicates
- planning consent-safe campaigns
- operational export / handoff

The Sheet is not the canonical consent ledger and should not be treated as the source of truth after a contact is promoted into Supabase.

## Promotion gate

A staged record may be promoted only when:

1. name/contact fields used for identity have been verified;
2. ambiguous duplicates have been resolved by a human;
3. original source and consent provenance are preserved;
4. the record has an explicit outreach-purpose classification;
5. no unsupported marketing permission is inferred.

## First campaign

The first safe campaign is not a general marketing blast.

Sequence:

1. personal Community Cuts thank-you;
2. relevant event or selected participation follow-up;
3. invitation to opt into ongoing ASC3ND updates;
4. broader content only after permission is recorded.

## New-site implementation slice

Next code slice:

1. add server-only Supabase client configuration;
2. add new-site RSVP/interest form contract;
3. submit to a server-side route or protected Edge Function;
4. write to `asc3nd.event_rsvps`;
5. create canonical ICM relationship records transactionally;
6. expose a staff-only review surface;
7. add Google Sheet synchronization only after canonical write succeeds;
8. verify RLS, abuse protection, consent copy, and rollback before production cutover.
