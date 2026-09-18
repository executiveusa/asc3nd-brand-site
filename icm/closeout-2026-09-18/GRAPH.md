# Task Graph

## Rule
Only admit work with a clear dependency, acceptance test, rollback, and evidence source.
Maximum three active workstreams.

# WS1 — PUBLIC + RELEASE

A0_BASELINE
  -> A1_PUBLIC_SURFACE_CLEANUP
  -> A2_FORM_AND_ACCESSIBILITY_PROOF
  -> A3_SEARCH_AND_METADATA
  -> A4_CANONICAL_DEPLOYMENT
  -> A5_PRODUCTION_GAUNTLET

### A0_BASELINE
Inspect current main, open PRs/issues, Vercel/Netlify/Cloudflare state, DNS, live routes, Supabase boundaries, forms, current search footprint.
Output: BASELINE.md.
No code changes.

### A1_PUBLIC_SURFACE_CLEANUP
Smallest possible changes only:
- suppress remaining public construction placeholders;
- suppress empty/unconfirmed credit entries;
- keep current design locked;
- retain verified Community Cuts proof.
Acceptance: crawl finds no internal/editorial placeholder language on public routes.

### A2_FORM_AND_ACCESSIBILITY_PROOF
- newsletter;
- family;
- mentor/volunteer;
- partner;
- keyboard;
- focus;
- modal/lightbox;
- 320/360/390/430 reflow;
- 200%/400% zoom;
- screen-reader/accessibility tree.
Acceptance: evidence packet records pass/fail per path; all P0/P1 failures resolved before release.

### A3_SEARCH_AND_METADATA
- sitemap;
- robots;
- canonical metadata;
- OG metadata;
- explicit noindex for staff/private flows;
- structured Organization/NGO data only after legal facts are confirmed;
- legacy/duplicate search surfaces inventoried.
Acceptance: core public pages crawlable; private/admin excluded; no unsupported schema claims.

### A4_CANONICAL_DEPLOYMENT
Human gate.
- choose one production deployment;
- point asc3nd.org + www to exact verified build;
- redirect/suppress superseded public hosts when safely possible;
- preserve rollback.
Acceptance: one public home.

### A5_PRODUCTION_GAUNTLET
Fresh-context critic:
- exact production SHA;
- desktop/mobile;
- forms;
- media;
- accessibility;
- runtime errors;
- broken links;
- search/canonical;
- rollback.
Exit: PRODUCTION VERIFIED or loop back to failed node only.

# WS2 — HANDOFF + FUNDING

B0_TRUTH_LOCK_PACKET
  -> B1_EVIDENCE_FOLDER
  -> B2_GRANT_READY_PACKET
  -> B3_PROGRESS_BOOK
  -> B4_SOCIAL_WORKBOOK
  -> B5_OWNER_TRAINING

### B0_TRUTH_LOCK_PACKET
Prepare founder/client confirmation sheet for:
legal name, EIN/status, service area, board/governance, next active program, Community Cuts numbers/credits, media permissions, safeguarding, account owners.
Do not fill unknowns by inference.

### B1_EVIDENCE_FOLDER
Create canonical folder index:
legal, governance, program, budget, proof, permissions, partner evidence, outcomes, leadership, safety.

### B2_GRANT_READY_PACKET
Create templates/skeletons only until facts arrive:
- one-page organization summary;
- active-program summary;
- budget template;
- standard answers;
- evidence matrix;
- grant tracker.
No automatic submission.

### B3_PROGRESS_BOOK
Update `asc3ndflipbook` with final verified delivery/evidence ledger.

### B4_SOCIAL_WORKBOOK
Verify `asce3nd-interactive-document` is current, client-owned, and usable; fold final canonical links and 90-day plan into handoff.

### B5_OWNER_TRAINING
- account-owner map;
- update site;
- check forms;
- recover accounts;
- approve media;
- approve grants;
- rollback;
- monthly metrics.
Exit: two named owners can run a tabletop drill.

# WS3 — PRODUCTIZATION

C0_REPO_CLASSIFICATION
  -> C1_UJIMA_EXTRACTION
  -> C2_GRANT_AGENT_BOUNDARY
  -> C3_REUSABLE_ASSETS
  -> C4_OFFER
  -> C5_LEARN

### C0_REPO_CLASSIFICATION
Classify every ASC3ND repo:
CANONICAL / DELIVERABLE / REFERENCE / ARCHIVE.
No destructive archive action without approval.

### C1_UJIMA_EXTRACTION
Move only reusable operational patterns into UJIMA interfaces/modules.
ASC3ND remains tenant data; never becomes UJIMA default truth.

### C2_GRANT_AGENT_BOUNDARY
Grant Agent consumes verified nonprofit context/evidence and produces researched/qualified work; external submissions remain approval-gated.

### C3_REUSABLE_ASSETS
Extract:
- Nonprofit Collins Gauntlet
- Truth Lock
- Proof Engine
- Trust Layer
- Participation Engine
- Funding Readiness Engine
- Handoff Pack

### C4_OFFER
Package:
Social Purpose Launch System
Truth -> Brand -> Public Home -> Proof -> Operations -> Funding -> Distribution -> Handoff.

### C5_LEARN
Write:
- what worked;
- what failed;
- reusable patterns;
- anti-patterns;
- measurable proof;
- what cannot yet be claimed.

# CROSS-WORKSTREAM HUMAN DEPENDENCIES
H1 legal/tax identity -> A3 structured data, B2 funding packet
H2 active program -> website program content, grant packet
H3 Community Cuts numbers/credits -> case study, funding proof
H4 media permissions -> public proof
H5 safeguarding -> trust/funding gate
H6 owner map -> handoff
H7 production cutover -> A4
