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

## Required before merging / production
1. Upload the **original 13 partner logos** and optimized derivatives from the conversation attachment package "ASC3ND_Project_Joy_Assets_Ready_For_Repo.zip" to an owned repository location, e.g. `public/images/partners/`.
2. Replace temporary text-only community recognition entries with original-image logos, keeping accessible names and preserving the English/Spanish design. Do not scrape or approximate logos.
3. Confirm the Project Joy final artwork and distinguish the **Amazon QR** from the **Zeffy QR**. Do not link the QR to the wrong destination.
4. Run the existing production build and review EN/ES at 320, 375, 390, 430, 768, and desktop; check no horizontal overflow, focus contrast, menu, donation links and QR scan.
5. Obtain an independent exact-head review, document merge SHA, verify Netlify deployed SHA and the live paths. Do not assume Vercel is the active deployment target.
6. Rollback: revert this single PR from main and restore the prior Netlify deploy if the campaign or existing website regresses.

## Brand boundary
Do not modify the approved site hero, navigation, founders' quotes, gallery, video, event operations, RSVP, or general Zeffy donation URL.
