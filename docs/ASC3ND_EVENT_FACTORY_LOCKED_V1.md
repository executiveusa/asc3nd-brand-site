# ASC3ND Event Factory — locked public design and repeatable publication process

## Source and design lock
Reviewed previous event template decisions and `events-prototype.html` (approved content-structure reference, not final styling). Reuse the **current** `/events`, `/es/eventos`, `/projects/community-cuts`, `/es/proyectos/community-cuts`, Project Joy EN/ES routes and existing design system. **Do not redesign the header, hero, logo, typography, footer, gallery or film.**

### Locked public information architecture
1. Events hero: `Our Impact in Action`, `Where Purpose Meets Action.`, founder-approved introductory copy.
2. `Current & Upcoming Initiatives`: compact two-column event card (approved cover / title / status / short story / verified participation link); show clearly labeled editorial placeholders when approval is pending. No invented campaigns, media or donation checkouts.
3. `Past Events & Community Impact`: cards from the same event registry with factual location/date, photo, personal impact story, and direct `Watch Highlights`, `View Gallery`, `Community Partners` section links.
4. Event detail: hero/title/story -> optional film/highlights -> approved media gallery -> verified outcomes -> credits/community partners -> relevant safe follow-up. Keep missing sections visibly labeled `Pending` in previews until approved; **no fake CTAs**.
5. Story-page proof carousel is fixed to four editorial images, distributed among published events. Full gallery belongs only on the event detail page, not duplicate long galleries across the home/Story/Events pages.
6. All public routes have EN/ES equivalents and 320px–1440px mobile/desktop acceptance.

### Canonical current records
- **Fresh Fade, Fresh Grade**, slug `community-cuts`, Everett WA, August 2026. Reuse `lib/projects.ts`, `lib/community-cuts-media.generated.ts`, current event cover, consent-approved 86-photo gallery, film path and credits `lib/credits.ts`. **Do not change the slug**, media IDs, consent flags or old links. Visible primary title should be *Fresh Fade, Fresh Grade*; historic "Community Cuts for Kids" internal IDs may stay where renaming would break compatibility. Media links must resolve directly to existing section IDs.
- **Project Joy: Asc3nd the Joy**, slug `project-joy`. It is a founder-described 2026 holiday giving initiative. Existing EN/ES Events cards and project routes preserve the locked layout. Explicit `PENDING` slots identify image (including photographer credit/consent), campaign story (dates/location/beneficiaries/goals), optional video, participation instructions, and the verified project-specific giving link. Do not invent current dates or operational status. Its detail pages are `noindex` until real approved content exists.
- **Partner acknowledgments** currently show `Pending`. Use existing `lib/credits.ts` categories; publish names and contributions only with founders' authorization and individual permission.

### Machine-processable event record contract (draft until connected to canonical registry)
```json
{
  "slug": "unique-stable-slug",
  "title": "Founder-approved public event name",
  "locale": ["en", "es"],
  "state": "draft",
  "lifecycle": "draft | scheduled | active | completed | archived",
  "visibility": "preview",
  "eventDate": null,
  "location": null,
  "story": { "en": null, "es": null },
  "participants": { "targetAudience": null, "participationInstructions": null },
  "media": [{ "id": "approved-asset-id", "src": null, "alt": null, "credit": null, "consentConfirmed": false, "approved": false }],
  "film": null,
  "outcomes": [],
  "partnerCredits": [],
  "donation": { "verifiedCampaignUrl": null, "humanApproved": false },
  "approvals": { "copy": false, "media": false, "partners": false, "legal": false, "publish": false }
}
```
This contract is a **specification**, not a new deployed database or UI control. The existing `lib/projects.ts` registry remains authoritative for published Fresh Fade. Only extend the existing registry and adapters in an isolated future slice once the concrete record meets this contract.

### Event production and approval checklist — repeat for every event
1. **Intake:** obtain initiative purpose, exact public name, owner, intended status, audience, real dates/location if known, campaign owner and contact.
2. **Research/verify:** confirm approved copy, event facts, impact figures, sponsor permissions and any public fundraising recipient. No inferred claims.
3. **Stage:** create a draft registry record and reusable card/detail preview. Fill unavailable sections with clearly labeled pending slots, preserving the locked component hierarchy.
4. **Media:** ingest originals under owner-controlled asset storage, generate mobile-friendly derivatives, carry original IDs, alt text and photographer credits; require subject consent before publication. Prevent duplicate homepage/Story galleries.
5. **CTA:** enable only a verified route to participation/RSVP/approved Zeffy campaign; otherwise show noninteractive `Pending` information, with no misleading "Donate" promise.
6. **Approve:** founder signs off copy, images, individual names, outcomes, project-specific giving link and publishing. Independent reviewer confirms routes, mobile layout and privacy.
7. **Publish:** transition to `scheduled` or `active` in the existing registry; verify live route and content/links, noindex removal only with approval. Do not auto-publish because a date arrives.
8. **Close out:** mark `completed` after the event, attach consented photos/film, edit a factual recap, attach verified outcomes and credits, record approvals, and move into Past Events.
9. **Archive:** retain stable public URLs and redirects, compress media, update indexes. Do not erase historical evidence.
10. **Rollback:** preserve last approved event record/assets and reinstate previous deployment if a bad release occurs. Record checks and approval receipts.

### Current launch boundaries
- The public `asc3nd.org` still serves the original Vercel email collection site until client approval.
- The new Netlify site may be reviewed and tested but must not replace the apex without explicit cutover approval.
- `main@asc3nd.org` is the **confirmed correct email** (do not migrate to `main@asc3ndcollective.com`).
- Until the official ASC3ND donation campaign is supplied, the founder has authorized links to **Zeffy's homepage**. Make clear it is generic platform information, not an ASC3ND donation checkout. The single config field `NEXT_PUBLIC_ASC3ND_ZEFFY_URL` switches all central CTAs to the verified campaign after owner review.
- Federal 501(c)(3), charitable registration and tax-deductibility must not be asserted without official records.
