# Project Joy 2026 — client-asset and release handoff

## Source of truth
- Client email: Otha & Elisha, Nov 18, 2026, "Website Asc3nd Updates and Comments"
- Client-supplied Amazon wish list: https://www.amazon.com/hz/wishlist/ls/24DFHCXA6J5RC?ref_=wl_share
- Financial contributions: https://www.zeffy.com/en-US/donation-form/project-joy-asc3nd-the-joy
- Supplied artwork: "Project Joy Logo - Final.png", Zeffy-branded QR, and Amazon QR (separate destinations)
- Community recognition: 13 original images extracted in order from "Logos.docx"
- This change does NOT infer donation totals, delivery sites, event dates, sponsor tiers, or individual logos for Dawson Place and Friends of Youth.

## Changed
- EN/ES Project Joy wish-list CTAs and 4 item categories, client-authored inventory
- First-party QR generated from exact Amazon URL (verified independently against the source QR)
- Three mission partnerships, with descriptions
- 13 founder-confirmed community organizations named on EN/ES Events, in a restrained mobile-friendly grid

## Asset integration — complete in PR #102
- 13 original client logo images were extracted from Otha and Elisha's attached `Logos.docx` in the exact embedded order.
- 13 WebP derivatives were optimized and committed under `public/images/partners/*.webp`, all mapped to explicit organization names in `components/CommunityPartnersSummary.tsx`.
- The unmodified original logos remain available in the client's DOCX and the archival ZIP `ASC3ND_Project_Joy_Assets_Ready_For_Repo.zip`. This PR contains web-optimized faithful derivatives, not the unmodified source files.
- The Project Joy campaign logo remains sourced from ASC3ND's official Cloudinary-hosted Zeffy campaign media.
- Amazon QR is rendered first-party from the supplied wishlist URL. Do not confuse it with the client's separate Zeffy QR.

## Required before merging / production
1. Run the existing production build, Verify, release verification and Mobile Polish QA at the exact final head. Resolve failures; avoid changing approved design to satisfy stale tests.
2. Independently review EN/ES at 320, 375, 390, 430, 768 and desktop; confirm logo loading, optical balance, no horizontal overflow, focus contrast, menu, donation links and QR scan.
3. Obtain independent exact-head review; document the merge SHA. Verify Netlify published SHA and live paths after merge.
4. Follow `docs/ASC3ND_ORG_DOMAIN_CUTOVER_2026-11-19.md` only after completing the explicit approval and legacy-signup preservation gates.
5. Rollback: revert this PR from main and restore the previous verified Netlify deploy if the website regresses.

## Brand boundary
Do not modify the approved site hero, navigation, founders' quotes, gallery, video, event operations, RSVP, or general Zeffy donation URL.
