# ASC3ND R0 → R1 Brownfield Audit — 2026-10-30

Status: verified audit baseline  
Production baseline: `50f6c0dfea63b9233e0d797408f368767de9ec10`  
Canonical public repo: `executiveusa/asc3nd-brand-site`

## Executive finding

ASC3ND is no longer a broken or empty site. It is a credible, safety-conscious nonprofit website with real founder identity, working participation intake, a documented event proof system, conservative transparency language, and a verified production release.

It is **not yet a finished brand/product system**.

The largest remaining gaps are:

1. the visual identity is not yet canonical outside the site implementation;
2. the homepage still gives too much visual authority to Community Cuts;
3. the public story still contains provisional language;
4. the event architecture is only partially generalized;
5. there is no first-class EN/ES architecture;
6. merch is absent from the canonical site;
7. Printify is not connected to the canonical site;
8. Community Cuts credits/outcomes remain unresolved;
9. the site lacks a final brand behavior / typography / motion system;
10. the historical 4.04 GB source archive could not be inspected through the connector and must be extracted/split before it can influence canonical truth.

The correct next move is **completion through reduction and systemization**, not a rewrite.

## R0 — Frozen source

Current production release:

- repository: `executiveusa/asc3nd-brand-site`
- main SHA: `50f6c0dfea63b9233e0d797408f368767de9ec10`
- production state verified READY before this audit
- Vercel alias used for verification: `https://asc3nd-brand-site.vercel.app/`

This SHA is the rollback baseline for second-wave work.

Protected behavior that must not regress:

- community signup;
- participation intake;
- consent capture;
- draft recovery;
- idempotent submission behavior;
- Supabase routing;
- privacy;
- youth-safety copy;
- transparency truth handling;
- approved/consent-confirmed project-media filtering;
- gallery keyboard behavior;
- focus trap / focus return;
- swipe navigation;
- staff/admin authorization model;
- release-lock / Extractor / mobile QA gates.

## Evidence reviewed

Live public surfaces:
- `/`
- `/story`
- `/events`
- `/projects/community-cuts`
- `/take-part`
- `/transparency`
- `/privacy`
- `/youth-safety`

Code reviewed directly:
- homepage
- story
- events
- Community Cuts
- take-part routes
- participation form
- signup form
- transparency
- privacy
- youth safety
- project/media model
- sitemap
- robots
- metadata
- staff/admin inventory
- community/participation/sheet-sync APIs
- release/security documentation

## Historical archive

Drive folder contains:
- `ASC3ND 2026 REBUILD.zip`
- 4,038,853,551 bytes (~4.04 GB)

The Drive connector refused raw download because it exceeds the 256 MB connector limit.

Therefore:

**Archive contents were NOT inspected and must not be treated as reviewed.**

Required later recovery:
- extract the ZIP into a Drive folder; or
- split it into parts under 256 MB; or
- place extracted content in an accessible owner-controlled store/repository.

Until then, material inside the ZIP is historical/unverified source only.

# Human jobs

## Homepage
Visitor should understand:
1. what ASC3ND is;
2. who leads it;
3. what it wants to do for young people;
4. whether it has done real work;
5. whether it is trustworthy;
6. how to participate.

Primary action: choose a participation path.  
Secondary action: inspect real work.

## Story
Visitor should understand:
- why ASC3ND exists;
- the founders;
- the three developing areas;
- how the organization is growing beyond one project.

## Events
Visitor should understand:
- what ASC3ND has actually done;
- when and where;
- what evidence exists;
- what outcomes are verified versus pending.

## Event record
Visitor should be able to:
- understand the event;
- watch available film;
- inspect approved photographs;
- distinguish evidence from pending claims;
- see credits when confirmed;
- return to ASC3ND as a whole.

## Take part
A family, mentor/volunteer, or community partner should know:
- which path fits them;
- what is being requested;
- why;
- what happens next;
- what consent they are giving.

## Merch
Visitor should know:
- what is actually for sale;
- actual price;
- variants;
- who fulfills it;
- where checkout occurs;
- that merchandise is optional support, not a donation claim unless separately verified.

# Page-by-page Extractor verdict

## Homepage

KEEP / PROTECTED:
- ASC3ND name
- `EMPOWER YOUTH. ELEVATE FUTURES. BUILD COMMUNITY.`
- founder identities
- approved founder quotes
- real founder photography
- primary take-part action
- real event proof
- signup
- trust/footer links

REDUCE:
- Community Cuts homepage gallery → **one editorial proof card**

Reason:
Event 001 currently has too much visual mass relative to the organization.

Target:
- one excellent image;
- title;
- location/date;
- 1–2 sentences;
- one event link.

All 86 photographs remain inside the event record.

REMOVE / REPLACE WITH EVIDENCE:
- `The next confirmed ASC3ND program will be shared here.`

Replace with the already-supported developing areas:
- Trusted guidance
- Life skills
- Community opportunity

Keep truthful status language.

HUMANIZE / REDUCE:
- slogan repetition after brand-system lock.

## Story

KEEP:
- origin story
- founder photography
- founder quotes
- three developing areas

RECOMPOSE:
- do not let `ASC3ND began with Community Cuts` make Event 001 the organization's core identity.
- lead with why ASC3ND exists; Community Cuts becomes the first public proof chapter.

MISSING:
- fuller Elisha narrative/quote treatment;
- stronger founder-intent → organization transition;
- bilingual copy.

## Events

KEEP:
- one-record-per-event model
- evidence-first language
- verified/pending distinction

REMOVE:
- `The next confirmed ASC3ND event will be added here.`
- omit until Event 002 exists or replace with a real CTA.

MISSING:
- generic event route/data contract.

## Community Cuts

KEEP:
- event identity
- film
- 86 approved photographs
- outcome uncertainty
- gratitude
- credit architecture

PROTECTED:
- keyboard arrows
- Escape
- focus trap
- focus return
- swipe
- consent/approval gating

RECOMPOSE:
- first 12–18 images;
- progressive View all;
- masonry/shared-element treatment;
- preserve source order/aspect ratio;
- avoid eager full archive decode.

REPLACE WITH EVIDENCE:
- all `Names to be confirmed` credit placeholders.
- founder review must confirm names or intentionally remove empty groups.

MISSING:
- verified outcomes or explicit decision to remain pending;
- final credits;
- reusable event route.

## Take Part

KEEP:
- Families
- Mentors + volunteers
- Community partners
- route-specific fields
- preferred-language capture
- draft recovery
- idempotency
- explicit contact consent
- separate updates opt-in
- honeypot
- failure recovery
- queue routing

MISSING:
- actual Spanish UI;
- translated validation/status copy;
- locale-aware source values;
- Spanish privacy/consent parity.

## Transparency

KEEP VERBATIM UNTIL NEW EVIDENCE:
- Washington nonprofit corporation status;
- EIN publication status;
- federal tax-exempt status;
- charitable-registration status;
- deductibility caution.

MISSING:
- bilingual version;
- update workflow when verified legal facts change.

## Privacy

KEEP:
- plain-language explanation;
- form-data categories;
- local draft explanation;
- retention uncertainty.

MISSING:
- formal retention policy if adopted;
- bilingual version.

## Youth Safety

KEEP:
- no youth/adult private messaging;
- public forms are not emergency services;
- sensitive-data warning;
- media approval/consent rule;
- website guidance is not an operational safeguarding policy.

MISSING:
- organizational safeguarding policy outside the website;
- bilingual version.

# Technical findings

## Routes

Public route inventory includes:
- home
- story
- impact
- events
- Community Cuts
- take part
- family
- mentor/volunteer
- partner
- transparency
- privacy
- youth safety
- unsubscribe

Internal:
- staff
- admin

## SEO clarification

Canonical sitemap code contains the main public routes.

Noncanonical Vercel hosts intentionally return crawler-blocking robots behavior. This is correct preview hygiene.

Do not open preview hosts to indexing.

## Event architecture

`lib/projects.ts` is a good reusable model.

Remaining hard-coded route:
`app/projects/community-cuts/page.tsx`

Target:
`/events/[slug]` under locale-aware routing, with redirects preserving existing URLs.

Event 002 must not require another page component.

## Brand authority

The current wordmark remains a site component, not a portable canonical master.

Brand authority should move to:
`executiveusa/brand-kit-builder-`

Website later consumes:
- approved SVG;
- crown;
- tokens;
- typography;
- spacing/layout rules;
- motion behavior;
- imagery rules.

# Store / Printify audit

## Current canonical site
- no merch route
- no Printify client
- no checkout

Verdict:
**MISSING**

## Reusable owner code

### `executiveusa/goatalliance/lib/printify.ts`
Reusable:
- API wrapper
- shop discovery
- products
- orders
- create/update/delete
- print providers
- blueprint catalog
- connection test

### `executiveusa/the-smoke/src/lib/printify.ts`
Best storefront projection pattern:
- product normalization
- variants
- size/color
- images/mockups
- active filtering
- purchase URL resolution
- product identifiers

### `executiveusa/the-smoke/scripts/sync-printify.ts`
Reusable:
- Printify → local projection
- inventory
- minimum price
- identifier matching
- dry-run

### `executiveusa/PAULIS-PLACE/backend/services/printify_service.py`
Reusable governance:
- fail closed without credentials
- verify exact shop
- verify blueprints/providers/variants
- upload artwork
- no blind product creation

Decision:
Reuse these patterns; do not clone another store stack.

# Merch law

Merch is an optional support path.

Do not claim:
- tax deductibility;
- donation equivalence;
- a specific percentage supporting programs;
- `100% supports youth`;

unless separately verified and approved.

Safe baseline:
> Purchasing ASC3ND merchandise is one optional way to support the organization and represent the mission.

# Recommended store boundary

```text
ASC3ND /merch
    |
    | server-side projection
    v
Printify canonical product data
    |
    +-- images
    +-- variants
    +-- current price
    +-- availability
    +-- storefront URL
    |
    v
Printify checkout / fulfillment
```

ASC3ND owns:
- presentation
- editorial copy
- EN/ES copy
- collections
- featured order
- campaign story

Printify owns:
- product IDs
- production variants
- operational price
- availability
- fulfillment
- orders
- checkout

# R1 minimum useful second-wave product

## Homepage
- brand identity
- mission
- founders
- How ASC3ND helps
- one Recent Work proof card
- participation
- signup
- trust/footer

## Story
- founder intent
- purpose
- developing areas
- Community Cuts as supporting proof

## Work
- reusable Events index
- generic event record
- Community Cuts as Event 001

## Get involved
- three pathways
- working forms
- bilingual parity

## Merch
- small verified capsule or truthful Coming Soon
- live Printify data only after verification

## Trust
- transparency
- privacy
- youth safety

## Languages
- English
- Spanish

# Build sequence

## W0 — Archive recovery
Blocker: 4.04 GB ZIP exceeds connector limit.
Extract/split before historical contents can be evaluated.

## W1 — Extractor subtraction
Create page-level keep/reduce/remove/missing ledger.

## W2 — Brand Studio Core
Create ASC3ND project in `brand-kit-builder-`.
Protected current identity enters intake.
Run:
`intake → governing idea → territories → distinctiveness → human selection → identity → behavior → stress test → validation → delivery`

## W3 — Homepage R1
- one proof card;
- remove provisional future section;
- improve story hierarchy;
- approved brand tokens only.

## W4 — Reusable event engine
Generic event data/route.
Development Event 002 fixture must render without new page code.

## W5 — Gallery v2
Preserve accessibility/consent.
Add progressive loading, masonry/shared-element polish, better mobile composition.

## W6 — EN/ES
First-class locale routes and translated states.
No partial Spanish launch.

## W7 — Merch / Printify
- server-only Printify adapter;
- verify connection/shop;
- product projection;
- bilingual merch page;
- small capsule;
- truthful support language;
- Printify checkout.

## W8 — Merch brand production
After brand approval:
- print graphics;
- print-ready exports;
- mockups;
- provider/variant selection;
- sample review where practical.

## W9 — Quality gauntlet
- PARÉ / Brand Studio review
- Extractor
- Details MCP
- cognitive-load review
- accessibility
- 390px
- 430px
- 768px
- desktop
- reduced motion
- EN/ES parity
- performance
- links
- forms
- Printify product → checkout proof

## W10 — Handoff
Deliver:
- brand kit
- website
- event workflow
- gallery workflow
- merch workflow
- translation workflow
- account/recovery map
- deployment/rollback
- operating guide

# Definition of done

ASC3ND public product is complete when:

- portable brand master exists outside website implementation;
- homepage is organization-first, not Event-001-first;
- every event uses one reusable system;
- all 86 approved Community Cuts photos remain accessible;
- EN and ES are first-class;
- merch is truthful and either fully connected or intentionally Coming Soon;
- a verified Printify product can move from ASC3ND discovery to real checkout;
- forms work and recover;
- privacy/youth-safety/transparency remain accurate;
- synthetic media is never presented as documentary proof;
- mobile is intentionally composed;
- reduced motion works;
- independent review passes;
- rollback remains available;
- founders receive a portable operating handoff.
