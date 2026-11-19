# ASC3ND — Hostinger independent standby deployment (not yet provisioned)

## Decision and limits
- Canonical application: `executiveusa/asc3nd-brand-site`, Next.js; deploy the same reviewed Git commit to both providers.
- Existing public `asc3nd.org` remains on Vercel holding/signup until client-approved Netlify cutover.
- The separate Hostinger backup will run on a Hostinger **VPS only if ownership and capacity are verified**. Do not purchase a server automatically; reuse existing approved compute where possible.
- The connected Hostinger **Mail** tool does not manage hosting, VPS or DNS. Deployment needs an authorized hPanel/VPS operator.
- This is a standby web origin, **not automatic failover**. A Cloudflare load balancer or equivalent health-aware routing is a separate opt-in and may have fees.
- The app's signup API uses the canonical external Supabase RPC and notification delivery; secondary hosting alone does not make these external dependencies highly available.

## Inspect before changing
1. Log into the owner's Hostinger hPanel using an authorized session; check VPS inventory, access and ownership. Report hostname, OS, available RAM/disk, running services, firewall and reverse-proxy status **without exposing credentials**.
2. Inspect `docker --version`, `docker compose version`, available ports and whether Coolify/Nginx/Caddy is already running. Reuse existing reverse proxy, avoid adding a competing one.
3. Verify the approved exact Git SHA is merged and builds on Netlify. Freeze image provenance; do not deploy a random branch tip.
4. Capture Vercel existing holding signup behavior and database/notification contract. No synthetic signup without approval; no real data migration without separate authorization.
5. Establish private staging subdomain with valid HTTPS **only if owner controls its DNS zone**; do not alter apex, www or MX.

## Build and stage
On an owner-controlled VPS, using an authorized deploy credential restricted to this repo:

```bash
git clone https://github.com/executiveusa/asc3nd-brand-site.git
cd asc3nd-brand-site
git fetch --all
git checkout --detach <APPROVED_MERGE_SHA>
docker compose -f compose.hostinger.yml build
docker compose -f compose.hostinger.yml up -d --no-deps
docker compose -f compose.hostinger.yml ps
curl -fsSI http://127.0.0.1:3001/standby
curl -fsSI http://127.0.0.1:3001/projects/project-joy
```

For private repos, use a scoped deploy key and keep it outside images/logs. Production secrets belong in a server-owned environment file or secrets manager, never the repository or Docker image. Verify all required environment variables for intake, notifications and checkout behavior before public use.

## Reverse proxy and resiliency
- Port 3001 listens only on loopback; do not expose it publicly.
- Attach a **separate reviewed HTTPS staging hostname** through the existing Hostinger reverse proxy/Coolify. Configure TLS, forwarding and host headers correctly.
- Verify `/standby`, EN/ES, Project Joy, all 13 images, Amazon wishlist and Zeffy links. Test on narrow mobile and desktop.
- Health probe `/standby` every 30 s; also monitor real site routes and intake dependencies independently. Container restart only recovers local process crashes.
- Automate pull/build/deploy on **approved tags or SHAs**, never on unreviewed pushes. Preserve the previous working image tag and tested rollback command.
- If a rollback is required, redeploy the previous known-good image at the same Hostinger staging hostname. Do not change public `asc3nd.org` DNS.

## Failover gate (separate release)
1. Keep Netlify primary and Hostinger standby healthy for at least one monitored verification window.
2. Independently verify shared signup DB, mail and DNS dependencies; document their remaining single points of failure.
3. If approved, configure health-checked routing with separate origin hostnames, low TTL, HTTPS, WAF and anti-loop settings. A copied static site alone does NOT implement failover.
4. Test failover and failback with controlled outages, capture uptime and screenshots, and verify user-facing signup/donation flows.
5. Obtain client approval and confirm commercial costs before making domain/routing changes.

## Do not modify
- Hostinger MX/SPF/DKIM/DMARC/NS.
- Current Vercel holding/signup service or its stored consented contacts.
- The approved ASC3ND visual brand or existing Netlify deployment.
- The release source without an independent review.

## Proof required
Record the exact SHA, container digest, deployed hostname, uptime checks, Playwright snapshots, test submissions only with consent, external dependencies, reviewer and rollback evidence in GitHub issue #86.
