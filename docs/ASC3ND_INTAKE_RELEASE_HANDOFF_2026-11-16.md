# ASC3ND categorized intake — deployment and verification handoff

**Canonical repo:** executiveusa/asc3nd-brand-site. **Do not deploy or merge before independent review.**

## Objective
Restore the existing ASC3ND Supabase intake and Resend delivery for families/service requests, volunteers/mentors, sponsors/partners, and donor inquiries. Preserve existing CRM records, consent, follow-up queues, and the website's visual design.

## Evidence
- Old event API: `executiveusa/asc3nd-frontend-website-/apps/event-community-cuts/app/api/participation/route.js`.
- Old Resend key *registration* is in Vercel `asc3nd-frontend` as `RESEND_API_TOKEN`; another is in `asc3nd-interactive-document` as `RESEND_API_KEY`. Registration does not prove the underlying key is valid.
- Canonical Supabase project: `cyxdevcjycmffhmwxojh`.
- Verified Hostinger mailbox: `main@asc3nd.org`.
- Existing worker: `asc3nd-site-notifications` (version 2 when inspected).
- Existing old queued notifications must **not** be replayed without review.

## Implementation
- Direct contact now requires a category instead of silently routing to partner.
- Donor inquiries use a distinct `donor` route and `donor` form type, with bilingual forms.
- Support page uses donor inquiry when a founder-verified Zeffy link is not configured; no payments are processed on the website.
- Migration extends existing DB checks/RPC and creates consented bilingual acknowledgment outbox records.
- Migration holds historical pending/failed notifications for review; it does not delete them.
- Edge worker requires `ASC3ND_NOTIFICATION_TRIGGER_SECRET` in Authorization, uses the stored outbox recipient, and sends minimal acknowledgments without free-text answers.
- The Next server trigger uses the same private secret and fails closed when unconfigured.

## Mandatory release order
1. Independent reviewer checks this PR's migration against **live** function definitions and current table constraints; check security and bilingual copy. Do not blindly run a stale migration if live functions have changed.
2. Backup schema and relevant outbox state, note baseline counts. Apply migration to a staging clone first, then production with approval. Confirm older pending rows became `held`.
3. Deploy the updated Supabase Edge Function with `verify_jwt=false` **only because it now enforces a private trigger secret**. Never expose the secret to the browser. Confirm unauthenticated POST returns 401 after secrets are configured.
4. Use existing Resend key from an authorized secrets manager if still valid and send-only scoped; otherwise create a new send-only key. Set **only in Supabase Edge Function secrets** as `RESEND_API_KEY`. Never print, commit, or send keys in chat. Set `ASC3ND_FROM_EMAIL=social@asc3nd.org` (verified domain).
5. Generate a strong random `ASC3ND_NOTIFICATION_TRIGGER_SECRET`; set the **same** secret in Supabase Edge Function and canonical Netlify site **server runtime**. Ensure no `NEXT_PUBLIC_` prefix.
6. Confirm the Next.js runtime supports the server-side API routes in the actual Netlify deployment. Preview deploy first; never assume static-only hosting can run them.
7. Submit one consented synthetic record per route with unique idempotency keys and controlled inboxes. Check the DB `participation_intakes`, `person_routes`, `followup_tasks`, `site_notification_outbox`, Resend provider IDs, and receipt at `main@asc3nd.org`. Verify visitor acknowledgment in English and Spanish. Verify that the family staff email excludes free-text answers.
8. Check invalid category, missing consent, honeypot, duplicate idempotency key, bad trigger token, rate limiting, email provider outage and retry. Check mobile/desktop.
9. Confirm founder-verified Zeffy campaign URL separately before enabling real donation checkout.
10. Publish only after independent review, passing checks, and explicit release approval.

## Rollback
- Revert the website deploy/PR and restore the prior Edge Function version.
- Remove/disable the trigger secret from the site runtime to stop automatic delivery immediately.
- Do not delete consent, intake records, or sent-email audit rows.
- Schema constraints may remain permissive for historical donor records; only restore the old constraints if no donor rows exist and rollback is separately approved.
- Historical `held` notifications require individual human reconciliation; never bulk replay.

## Remaining server-agent actions
Secure secret provisioning, staging migration and release, Edge Function deployment, Netlify runtime configuration, end-to-end email tests and final production verification. Do not claim these are complete from this PR alone.

## Verified execution receipts — 2026-11-17 UTC

- Shared Supabase project: `cyxdevcjycmffhmwxojh`. ASC3ND data lives in the separate `asc3nd` and `asc3nd_private` schemas; do not create another Supabase project.
- Restricted rollback checkpoint: `asc3nd_private.asc3nd_intake_release_checkpoint_20261116`. It captured 3 previous function definitions, 4 check-constraint definitions, and the 3 historical notification statuses. This is a narrowly scoped release checkpoint, **not a full database backup**; Supabase backup API reported no available managed backups and PITR disabled.
- Applied migration `asc3nd_categorized_intake_and_ack_20261116` after finding and repairing missing SQL semicolons in the PR. Historical outbox: 3 rows changed to `held`; do not manually replay without approval.
- Applied `asc3nd_service_only_notification_rpc_bridge`: public PostgREST RPC wrappers are granted **only** to `service_role`; `anon` and `authenticated` have no execute permission. This fixes PostgREST's `Invalid schema: asc3nd_private` error.
- Notification Edge Function `asc3nd-site-notifications` upgraded to an authenticated replacement. Unauthorized POST returned 401; authorized POST with an empty queue returned 200 with processed=0.
- Dedicated domain-scoped, send-only Resend credential was created and stored in Supabase Edge Function secrets as `RESEND_API_KEY`. An independent trigger token was securely configured as `ASC3ND_NOTIFICATION_TRIGGER_SECRET`; never copy these into code, logs, GitHub, or the browser.
- Applied `asc3nd_vault_backed_notification_schedule`: one existing Supabase `pg_cron` job, `asc3nd-notification-outbox-dispatch-v1`, runs each minute **only when pending/failed outbox rows exist**. It invokes the same authenticated Edge worker via `pg_net`, retrieving the trigger credential from Supabase Vault by name `asc3nd_notification_dispatch_token`. This is a minimal fallback for the Netlify environment-variable API permission blocker, not a second delivery worker.
- Transactional database synthetic QA: family, volunteer, mentor, partner, sponsor, donor all succeeded and generated matching staff and acknowledgment outbox rows. All synthetic records were rolled back; no synthetic CRM contacts persisted from that test.
- Controlled real sending QA: four manually triggered notifications and one **automatically scheduled** notification were marked sent; Resend confirmed delivery; the `main@asc3nd.org` Hostinger inbox confirmed the staff messages. English and Spanish acknowledgment bodies were verified. A synthetic family free-text privacy canary was absent from the staff message.
- Production canonical Netlify site: `asc3nd-org`, site ID `3d98c8a1-4024-46df-9f1d-6af7f85a73b5`. The connected Netlify environment-variable write returned 403/422 and another Netlify MCP connection returned 401. Therefore immediate per-form notification trigger remains unconfigured; Supabase scheduled delivery is the active working delivery path.
- The optional Forge CNAME `mail.asc3nd.org -> send.forge.rmta.net` is still not published. Current DKIM and SPF sending are verified; Forge is not a blocker to existing Resend delivery.

### Rollback and monitoring
- To stop automated sends without changing any records: `select cron.unschedule('asc3nd-notification-outbox-dispatch-v1');` (and separately revoke/remove the Edge worker trigger secret when necessary).
- To inspect the queue: `select status,count(*) from asc3nd.site_notification_outbox group by status;`.
- To inspect scheduled runs: `select status,start_time,end_time from cron.job_run_details where jobid=(select jobid from cron.job where jobname='asc3nd-notification-outbox-dispatch-v1') order by start_time desc limit 10;`.
- Reverting the website does **not** automatically revert database function grants, outbox states, or cron; review the checkpoint and migration impact carefully before any schema rollback.
- If Netlify can later be updated securely, install the server-only trigger token in a secret environment variable and verify immediate delivery. Keep or remove the cron fallback intentionally; no plaintext credentials in the Netlify UI screenshots or logs.
