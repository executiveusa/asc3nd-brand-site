# ASC3ND ICM Email Delivery Contract

## Decision

Email is a delivery adapter for ICM Memory. The provider is never the source of truth.

Canonical state remains in Supabase:

`Identity → Context route → consent → content approval → recipient approval → outbox → provider → touchpoint + Memory`

## Provider adapter

The first adapter is Resend because it exposes a small HTTP API that runs cleanly from Supabase Edge Functions and supports idempotency and custom unsubscribe headers.

The deployed `asc3nd-email-worker` is intentionally fail-closed. It will not claim or send any outbox row until both secrets exist in the Edge Function environment:

- `RESEND_API_KEY`
- `ASC3ND_FROM_EMAIL`

Optional:

- `ASC3ND_PUBLIC_SITE_URL` (defaults to `https://asc3nd.org`)

No provider credential belongs in Git, Vercel browser code, Google Sheets, or the public Supabase client.

## Final send-time gates

A delivery can be sent only when all of these remain true at claim time:

1. the delivery is queued;
2. the outbox provider is `resend`;
3. the person has an email address;
4. the person is not `do_not_contact`;
5. the latest consent for the exact content channel + purpose is still `granted`.

If consent changed after recipient approval or queueing, the worker cancels the outbox item and suppresses the delivery instead of sending it.

## Unsubscribe

Every outbox row has a high-entropy UUID unsubscribe token. Email links point to:

`/unsubscribe?token=<token>`

The public page requires a confirmation action before mutating consent so link scanners do not accidentally unsubscribe people.

Confirmation calls `asc3nd_unsubscribe(token)`, which:

- appends a new `revoked` consent record for the exact channel + purpose;
- suppresses unsent matching deliveries;
- cancels matching pending/claimed outbox items;
- records an inbound consent-revocation touchpoint;
- records durable ICM Memory.

It does not erase event history or relationship history.

## Send ledger

Only provider success may call the worker completion function. Provider success then records:

- provider message ID;
- delivery `sent` state;
- outbound touchpoint;
- durable `content_sent` Memory.

Provider failures are retried through the outbox and stop after the configured attempt ceiling.

## Human boundary

AI may draft content and recommend audiences. Human approval remains separate for content and recipients. Running the approved outbox is restricted to ASC3ND owner, admin, or communications-manager accounts.
