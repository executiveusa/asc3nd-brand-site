# ASC3ND founder launch-completion sprint — 2026-11-16

Canonical repository: `executiveusa/asc3nd-brand-site`. Baseline: `main@b54a781511d664ca5508e26f243c56ed207e5bcb`.

## Scope and release policy

Founder source: Otha and Elisha Minnifield feedback `Asc3nd Website Updates 11.12.26.docx`, 13 pages, received by email 2026-11-13. Preserve current hero, typography, approved photographs, EN/ES copy, footer brand, /shop switch, and existing Printify implementation. Keep dependencies separate (#73 and #51).

### Implemented here

- The header's donation control links directly to a campaign **only** when `NEXT_PUBLIC_ASC3ND_ZEFFY_URL` is set to an ASC3ND-owner-verified Zeffy campaign page. Basic URL-shape validation rejects homepage/login/dashboard destinations. This gate is not proof of ownership; the owner must verify the link before configuring it.
- Before verification, the header reads **Support / Apoyar** and leads to the existing internal Support page. On Support, users see an honest unavailability message and can explore other paths. No false claim that a donation is being collected.
- Add fourth **Support Our Mission / Apoya nuestra misión** route on both Get Involved pages. It links to the existing bilingual Support page instead of a dead checkout.
- Add responsive bilingual browser tests blocking generic Zeffy homepage links.

### Required independent proof before release

- `npm ci`, `npm run build`, GitHub Verify, release verification and 320–1440px Mobile Polish QA.
- Netlify preview on /take-part, /es/participar, /support and /es/apoyo.
- Compare to main: no changes to /shop, Printify, dependency lock files, logo, hero, or approved content.
- Revert the isolated squash commit to roll back.

## Explicit outstanding owner/founder dependencies

1. **Donation**: authenticated ASC3ND-specific Zeffy fundraising URL, confirmed by client. Prefer a direct URL screenshot or signed approval. Do not configure an unverified fundraising destination or claim donations are live.
2. **Mail**: `main@asc3ndcollective.com` must be provisioned with receiving and sending confirmed using an authorized mailbox. Until then, keep `main@asc3nd.org`; do not silently change form notifications.
3. **Forms**: code writes to `asc3nd_submit_participation` and `asc3nd_join_community` RPCs and calls a best-effort notification function, which does not guarantee delivered messages. Server-side agent with database+mail access must send consented synthetic submissions, trace IDs and destination queues, verify notifications, and remove test records safely.
4. **Legal**: Washington SOS record should establish exact legal name, UBI status and charity/tax assertions before modifying footer trust claims.
5. **Project Joy**: campaign narrative, active dates, photographs, partner permissions and participation/donation details require founder approval. Current placeholder must remain non-indexed until factual details are supplied.
6. **Partners**: approval-gated `lib/credits.ts` entries are empty; do not add invented acknowledgments.
7. **Store**: `NEXT_PUBLIC_SHOP_MODE` still defaults to off, intentionally. Code and former merch PR branch remain intact. A verified storefront/checkout and owner approval are required before switching live.
8. **Dependencies**: assess grouped PR #73 and GitHub Actions #51 in independent CI-tested updates, not alongside a public UX release.

## Commercial completion gate

A visitor must be able to discover the organization, see verified projects, join updates, and submit a participation inquiry end-to-end. Monetization/donations are **not completed** until verified Zeffy checkout is configured and a controlled test confirms the correct recipient.

**No background promises**. The launch can truthfully say informational site deployed; do not call it a donation-ready, end-to-end intake-verified product until the external confirmation gates pass.
