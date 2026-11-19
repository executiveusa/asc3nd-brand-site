# ASC3ND.ORG — production cutover runbook (NOT YET EXECUTED)
Date: 2026-11-19
Scope: replace the existing public ASC3ND landing experience at `asc3nd.org` and `www.asc3nd.org` with the verified Netlify brand site. Preserve all other services, especially email.

## Verified baseline
- Canonical new site repo: `executiveusa/asc3nd-brand-site`
- Netlify project: `asc3nd-org` (site ID `3d98c8a1-4024-46df-9f1d-6af7f85a73b5`)
- Baseline published Netlify deployment: `6afebb0eeeda09a2ccd67313`, SHA `942aec8f97d3a0740933b13f05838d0911a317ae`, ready, 2026-11-19.
- Website still answering at `https://asc3nd.org` before cutover: old subscription/coming-soon page.
- DNS before cutover: `asc3nd.org A 76.76.21.21` (Vercel); `www.asc3nd.org CNAME asc3nd.org`.
- Authoritative DNS: `solar.dns-parking.com`, `lunar.dns-parking.com` (Hostinger).
- Mail MX: `mx1.hostinger.com` priority 5, `mx2.hostinger.com` priority 10.
- SPF: `v=spf1 include:_spf.mail.hostinger.com include:amazonses.com ~all`.
- Check and preserve DKIM, DMARC, all verification TXT, CAA, MX, SRV, and any other records before editing DNS.
- No nameserver, registrar, mailbox, or Supabase migrations are authorized by this runbook.

## Preconditions — must all pass before cutover
1. Project Joy PR #102 merged to main only after 13 original partner logos uploaded and source mapping approved.
2. Exact-head Next.js build + TypeScript + review checks green, mobile screens at 320/375/390/430/768 + desktop reviewed and signed off independently.
3. Bilingual Project Joy routes, partner gallery, financial donation link and Amazon wish-list link verified, with distinct QR destinations.
4. Netlify production deploy of merged main is READY and its commit matches the approved merge SHA.
5. All critical routes/forms tested. The old root site's newsletter/lead-capture workflow must either be carried into the new site or explicitly retired with owner approval (risk: loss of existing submissions).
6. Establish rollback deploy URL/ID and maintain owner account access to Hostinger and Netlify.
7. Back up all existing DNS RRsets before write. Request explicit owner confirmation of exact DNS changes and cutover window.

## Planned DNS changes (Hostinger DNS; do not execute in this PR)
1. In Netlify Domain Management for `asc3nd-org`, add `asc3nd.org` and `www.asc3nd.org` as production domains; configure single preferred canonical host and redirect other host; check conflict with any other Netlify site.
2. At Hostinger DNS, **website records only**, use Netlify's then-current verified DNS instructions:
   - Apex `@`: replace existing A `76.76.21.21` with `75.2.60.5` when using an A record. Alternatively Netlify supports ALIAS/ANAME to `apex-loadbalancer.netlify.com` when the provider supports it. Do not set both.
   - `www`: change CNAME from `asc3nd.org` to `asc3nd-org.netlify.app`.
   - Do not modify MX, TXT, NS or unrelated records.
3. Allow Netlify domain ownership checks and HTTPS certificate provisioning; confirm HTTPS on apex and www.
4. Verify live DNS at independent resolvers, TLS, all key routes, forms, donation and wish-list links, robots and canonical URLs; preserve real screenshots / timestamps.
5. Monitor error logs and form delivery for a post-cutover window.

## Rollback
- Revert website records from the recorded before-state: `@ A 76.76.21.21`, `www CNAME asc3nd.org` (only if baseline remains healthy), restore prior Netlify published deploy if necessary.
- Check email still delivers; do not touch MX.
- Record issue, exact UTC time, reverted records and validation evidence.

## Source
- Netlify official external DNS instructions: https://docs.netlify.com/manage/domains/get-started-with-domains/
- 2026-11-19 authoritative DNS inspection; read-only
