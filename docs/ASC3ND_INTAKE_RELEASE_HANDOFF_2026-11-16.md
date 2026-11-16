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
