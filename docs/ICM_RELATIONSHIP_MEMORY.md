# ASC3ND ICM relationship memory

## Goal

ASC3ND should remember people because it kept good records, not because it built a surveillance system.

The relationship system uses ICM as three explicit layers:

### I — Identity

Who is this person and how did ASC3ND meet them?

Stored in:

- `asc3nd.people`
- `asc3nd.person_sources`

Identity may include a name, preferred name, contact details, preferred language, lifecycle stage, and the source that introduced the person to ASC3ND.

### C — Context

What verified context helps ASC3ND serve this person better?

Stored in:

- `asc3nd.person_context`

Every context record carries a truth state:

- `fact`
- `assumption`
- `derived`

It may also carry provenance, confidence, human verification, and an expiry date. AI-generated interpretation must never silently become a fact.

### M — Memory

What should ASC3ND remember from prior interactions so it can follow through?

Stored in:

- `asc3nd.person_memory`
- `asc3nd.touchpoints`

Examples:

- a thank-you already sent;
- a volunteer commitment;
- a requested follow-up;
- a preferred language;
- a prior event interaction;
- a staff note that should not be lost.

Memory entries have provenance, human-verification state, sensitivity, and optional expiration.

## Consent is separate from memory

Knowing someone's email does not mean ASC3ND has permission to market to them.

Communication permissions are stored in:

- `asc3nd.communication_consents`

Permissions are tracked by channel and purpose. A consent for event coordination is not automatically a consent for newsletters, fundraising, or general marketing.

The Community Cuts consent currently stored in Supabase says:

> I agree that ASC3ND Collective may contact me about this event and the participation option I selected.

That supports event and selected-interest follow-up. It does not by itself establish broad marketing permission. The correct next step is a useful thank-you/follow-up tied to the event, with a clear opt-in for ongoing updates.

## Content drops

Reusable content lives in:

- `asc3nd.content_drops`
- `asc3nd.content_deliveries`

A content drop can be an update, event invitation, thank-you, volunteer note, or campaign item. Delivery records let ASC3ND know what each person has already received so AI does not repeat itself or forget prior contact.

Personalization should use only relevant, consented context. Do not infer sensitive traits. Do not create manipulative vulnerability scores.

## Faces and photos

ASC3ND may store approved photos or references to approved media when consent allows it. The system must not create biometric embeddings, face-recognition templates, or automated identity matching from faces.

A staff member may deliberately link an approved photo to a known person when that relationship is useful and permitted. That is relationship memory. Automated facial identification is outside scope.

## RSVP import

The canonical Supabase schema already contains `asc3nd.event_rsvps`, but it currently contains zero live RSVP rows. The actual RSVP export/file therefore still needs to be located before a backfill can be proven.

When the real source file is located:

1. preserve the raw source as an immutable import artifact;
2. create an import receipt with source/date/hash;
3. normalize each adult contact into `asc3nd.people`;
4. link the source record in `asc3nd.person_sources`;
5. import event/interest facts into `asc3nd.person_context`;
6. preserve the original consent version and purpose;
7. suppress broad marketing unless a separate ongoing-marketing consent exists;
8. log the first thank-you/follow-up as a `touchpoint`;
9. never silently merge ambiguous people.

## Operating rule

AI can prepare context, segment audiences, draft messages, and remind staff about follow-up. Humans approve sensitive notes, consent changes, identity merges, and outbound campaigns.
