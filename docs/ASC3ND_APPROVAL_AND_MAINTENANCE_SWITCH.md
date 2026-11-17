# ASC3ND — prelaunch, client approval, and maintenance modes

## Owner decision
**Public domain stays on the EXISTING Vercel email-collection landing until the client approves the finished new site.** This repo's Netlify deploy remains the new-site staging/production backend. No DNS, Vercel alias, or public homepage change is authorized by this implementation.

### Proven current public experience
- `https://asc3nd.org/`: HTTP 200, holding page with "Empower Youth / Elevate Futures / Build Community," original ASC3ND graphic, name/email/consent sign-up form.
- Current holding-page source: `executiveusa/asc3nd-frontend-website-` / `apps/event-community-cuts/app/page.jsx`, `holding.module.css`, `HoldingSignupForm.jsx`, `public/images/asc3nd-logo-transparent-tight-v2.png`.
- Current public DNS: Hostinger authoritative nameservers, root A `76.76.21.21`, `www` CNAME to root. **Do not change these until written approval.**
- Full site already deployed to existing Netlify project `asc3nd-org`: `https://asc3nd-org.netlify.app`, project ID `3d98c8a1-4024-46df-9f1d-6af7f85a73b5`.
- SMTP/Resend email records are unrelated to website cutover. Preserve them.

## Architecture: one codebase, two presentations, one intake backend
- `config/site-mode.json` controls the Netlify site, currently `{"mode":"full"}`.
- `app/standby/` preserves the original public holding design/assets in the **new** codebase, so the holding page is available again after launch for maintenance.
- The standby form calls the existing `/api/community/join` endpoint (same consent/rate-limit/database backend as the full brand site) and never collects payment information.
- `proxy.ts` rewrites non-asset, non-API website routes to `/standby` *only when the committed mode is standby*.
- No URL parameter, cookie or public endpoint can change mode.
- The original public Vercel holding site is retained intact as a fallback. Do not delete, unpublish or overwrite it.

## Prepare now — **no client-visible cutover**
1. Open a PR from this branch; run `node --test tests/site-mode.test.mjs tests/intake-contract.test.mjs`, TypeScript, and `npm run build`. Verify Netlify deploy preview on desktop and 390 px mobile.
2. Test the new `/standby` preview's rendering. Submit one synthetic, consented signup only if approved for testing, verify a single saved record and notification. Never use a real visitor's identity.
3. Independently compare preview standby layout, logo, and copy against `https://asc3nd.org/`. Correct discrepancies **without touching public Vercel**.
4. Merge the PR only when the preview and review pass. Confirm `config/site-mode.json` still says `full`, and that public `asc3nd.org` still serves the old holding page.
5. Attach `asc3nd.org` and optionally `www.asc3nd.org` to the **existing** Netlify project in Netlify Domain management using external DNS. Completing ownership TXT verification, if required, is allowed once approved; it must not switch the root web A/CNAME. Validate HTTPS provisioning. Netlify may require the final A/CNAME cutover before HTTPS becomes fully active.
6. Back up Hostinger DNS (existing 13-record backup on the authorized tablet), and write the exact current Netlify-assigned A/ALIAS/CNAME targets into the release checklist. Never assume the standard Netlify target overrides a project-specific edge target. Do not update web DNS yet.

## CLIENT APPROVAL GATE — one final instruction, not a surprise cutover
Client must explicitly approve the completed site. Record the approval and the exact GitHub/Netlify deployment being approved. Then the domain administrator/authorized agent can apply the preverified **web-only** Hostinger DNS change:
- root `@` A or ALIAS → Netlify's confirmed target (standard Netlify apex A is `75.2.60.5`, but use the actual Netlify instructions);
- `www` CNAME → the confirmed Netlify target;
- preserve all MX, TXT, SPF, DKIM, DMARC, and other records.
Immediately verify DNS, TLS, `https://asc3nd.org/`, `/take-part`, `/take-part/donor`, Spanish donor page, and a consented synthetic intake → database → staff and acknowledgment email.

**The GitHub mode workflow does NOT perform DNS switching.** The initial Vercel-to-Netlify web-domain cutover is a distinct last step. Until Netlify has the domain attached and DNS credentials are authorized, the first launch cannot be a literal automated one-click operation. The final agent instruction can still execute the preapproved checklist as one bounded run with verification.

## After launch: one-click standby / maintenance / full
The manual workflow `.github/workflows/asc3nd-site-mode.yml` uses `workflow_dispatch`:
- mode `standby`: all public page routes show the preserved holding page, but signup API/assets remain live.
- mode `full`: full brand site returns after normal Netlify Git deployment.
- Enter exact confirmation text `APPROVE_ASC3ND_MODE_SWITCH`. The client must have approved the mode change before this action is run.
- The workflow changes **only** `config/site-mode.json`, tests the change, commits to `main`, and waits for normal Netlify Git CD. A successful workflow alone is **not** proof of a deployed change; verify the new published deployment and real browser.
- If the workflow cannot push due to branch protection, stop and open an ordinary reviewed PR; do not disable branch protection.

## Safeguards and rollback
- No automatic cutover by scheduled job, push to repo, or merge.
- Do not store any secret in config, workflow, or page assets.
- To revert a bad mode switch, run the same approved workflow in the opposite direction, await Netlify ready, and independently verify. If the new deploy fails, Netlify retains the previously published one.
- To revert a bad initial DNS change, restore **only** the prior `@` A `76.76.21.21` and `www` CNAME `asc3nd.org` from the DNS backup, then verify the prior holding page and email collection. Keep mail DNS unchanged.
- Preserve and verify real visitor email signups before and after any switch.
- Deployment receipts, client approval, DNS before/after, and QA evidence belong in [ASC3ND release issue #86](https://github.com/executiveusa/asc3nd-brand-site/issues/86).

## Release success criteria
The client sees only the existing landing page before approval. The new full site and standby page are both separately verifiable by Netlify URLs. Switching the presentation after launch takes one approved workflow action and one normal Netlify deployment; the original Vercel landing remains recoverable. A failed deploy or failed DNS verification must not destroy the functioning signup flow.
