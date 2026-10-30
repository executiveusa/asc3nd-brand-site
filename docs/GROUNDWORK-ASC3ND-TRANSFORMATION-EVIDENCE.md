# ASC3ND × Groundwork — Transformation Evidence Ledger

Status: live build evidence  
Purpose: preserve the before/problem/action/human-gate/after/proof record while ASC3ND becomes Groundwork Client 01.

## 01 — Homepage hierarchy

**Before**  
Community Cuts occupied a large visual block on the homepage and the page carried a provisional "next confirmed program" section.

**Problem**  
Event 001 visually competed with ASC3ND's identity and made the site feel unfinished.

**Groundwork action**  
Reduced Event 001 to one video-led editorial proof object. Replaced provisional filler with the three already-supported developing focus areas: Trusted guidance, Life skills, and Community opportunity.

**Human gate**  
No new factual claim. Existing verified/approved source material only.

**After**  
Mission → founders → how ASC3ND helps → recent proof → participation → updates.

**Proof**  
PR #67; branch-local mobile/visual QA; production merge only after gates pass.

---

## 02 — Brand identity portability

**Before**  
The approved hero wordmark was generated as live browser text with optical numeral-3 correction.

**Problem**  
A browser implementation is not a portable brand asset and typography changes could mutate the logo.

**Groundwork action**  
Created a dedicated SVG web wordmark and separated logo identity from site typography tokens.

**Human gate**  
The path-outlined print master remains subject to Brand Studio Core visual comparison because substituting a different serif would alter the approved silhouette.

**After**  
Web hero consumes a dedicated SVG; site typography can evolve independently.

**Proof**  
`public/brand/asc3nd-wordmark.svg`; `components/HeroWordmark.tsx`.

---

## 03 — Event operations

**Before**  
Community Cuts had a custom project page.

**Problem**  
Every future event risked becoming another coding project.

**Groundwork action**  
Created a generic data-driven `/events/[slug]` route and canonicalized legacy Community Cuts URLs into the reusable event system.

**Human gate**  
Event facts, credits, consent, and outcomes remain evidence-gated.

**After**  
Future events can be added through the project/event data contract instead of a new page component.

**Proof**  
`app/events/[slug]/page.tsx`; `lib/projects.ts`; route alias tests.

---

## 04 — Documentary evidence gallery

**Before**  
All 86 approved photographs were preserved and accessible, but presentation was a conventional grid.

**Problem**  
The archive needed stronger documentary composition without losing accessibility or consent controls.

**Groundwork action**  
Introduced restrained masonry/progressive reveal and lightbox motion while preserving keyboard navigation, focus trapping, focus restoration, swipe behavior, approval gating, and consent gating.

**Human gate**  
No image is made public solely because it exists in storage.

**After**  
A repeatable event evidence gallery that can scale beyond Community Cuts.

**Proof**  
86-photo preservation CI + `ProjectProofGallery` + branch-local mobile/accessibility tests.

---

## 05 — English / Spanish

**Before**  
Preferred language was collected in forms, but the public experience was English-only.

**Problem**  
Language preference was stored without a complete matching Spanish product surface.

**Groundwork action**  
Added mirrored Spanish routes for homepage, events, event record, participation, merch, privacy, youth safety, and transparency. Forms submit to the same canonical queues with `preferred_language=es`.

**Human gate**  
Founder quotations are explicitly labeled as Spanish translations; translated legal/trust copy does not strengthen the underlying claims.

**After**  
Spanish is an operating surface, not a browser translation overlay.

**Proof**  
`/es/*` route set, hreflang/canonical metadata, Spanish QA smoke coverage.

---

## 06 — Merch revenue option

**Before**  
No canonical merch surface or Printify adapter existed in the current ASC3ND site.

**Problem**  
Old prototype products/prices were not trustworthy enough to republish, and building a second order system would create avoidable operational burden.

**Groundwork action**  
Added a server-side, fail-closed Printify projection and bilingual editorial merch surfaces.

**Human gate**  
Exact Printify shop ownership, credentials, products, pricing, fulfillment, Stripe/payout identity, and any fundraising language must be verified before live commerce.

**After**  
With valid Printify configuration, ASC3ND can project real products/price/images into its own site and send checkout/fulfillment to Printify. Without it, the site shows a truthful finished Coming Soon state.

**Proof**  
`lib/printify.ts`; `/merch`; `/es/merch`. Canonical Vercel project currently has no Printify env variables, so live store connection is correctly not claimed.

---

## 07 — Release quality

**Before**  
Mobile QA on pull requests targeted the stable production alias, so it could pass/fail against the wrong code.

**Problem**  
Deployment evidence was not causally tied to the branch under review.

**Groundwork action**  
Changed Mobile Polish QA to build and run the pull-request branch locally before Playwright tests.

**Human gate**  
Production remains unchanged until branch-local checks and independent review pass.

**After**  
A PR must prove its own mobile/accessibility behavior.

**Proof**  
`.github/workflows/mobile-polish-qa.yml`.

---

## Commercial proof statement

ASC3ND demonstrates the Groundwork promise when the completed system can truthfully show:

> Existing organization → verified truth → reduced complexity → repaired public presence → reusable evidence workflows → bilingual participation → optional earned-revenue surface → owner-controlled handoff.

Groundwork should be sold from this evidence, not from claims about autonomous AI.
