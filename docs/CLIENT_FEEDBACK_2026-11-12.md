# ASC3ND client review implementation — November 12, 2026

## Source and scope
Client-supplied 13-page attachment: `Asc3nd Website Updates 11.12.26.docx`, received in the `Website Asc3nd Updates and Comments` email November 13. This review branch implements its requested copy, founder-media, navigation, Events, participation, and contact changes. The approved brand colors and header/footer wordmark are explicitly **out of scope until the last design pass**.

## Implemented requests
- Story headline and narrative, three revised pillars, one development statement, "Our Mission in Action".
- Make Otha's portrait smaller and the founding quotations more prominent; remove Elisha's portrait while **retaining her exact recorded quote** and using existing published event photographs instead. Existing original image files are preserved.
- Rename the existing Community Cuts public event presentation to **Fresh Fade, Fresh Grade** while preserving the `/projects/community-cuts` and `/es/proyectos/community-cuts` routes, film and 86-photo catalog.
- Change Events from "Event archive / One record..." to "Our Impact in Action / Where Purpose Meets Action"; distinguish active initiatives and completed events; use links for Watch Highlights / View Gallery / Community Partners.
- Include **Project Joy: Asc3nd the Joy**, described in the client attachment as the active 2026 holiday initiative. No fabricated amount, date, recipient, campaign photo, or outcome.
- Update Get Involved copy and routes, including Families & Youth, Volunteers & Mentors, Community Partners & Sponsors, and Support Our Mission. Retain existing working intake forms.
- Email address change is ON HOLD pending client confirmation. Preserve the existing `main@asc3nd.org` in UI, contact forms, and notification function.
- Add visible donation/support routes. Eliminate generic `https://www.zeffy.com/` as a fake donation destination; `NEXT_PUBLIC_ASC3ND_ZEFFY_URL` must point to a campaign-specific https Zeffy fundraising URL or the UI shows safe support/contact options.
- Keep Spanish pages and navigation aligned.

## Distinguish client direction from unverified facts
1. **Project Joy:** Client describes it as active; verify exact operating dates, campaign owner, public description, beneficiaries, approved photos and participation/donation method before production release. The branch intentionally provides a direct inquiry path, not an invented fundraising checkout.
2. **Donations:** Confirm a real ASC3ND-controlled Zeffy campaign URL and the entity that receives funds before enabling live Donate links. No generic homepage link.
3. **Legal status:** Existing Washington UBI is repository content; reconfirm legal name, UBI, nonprofit and tax-deductibility representations with the organization before launch. No new legal status claim has been added.
4. **Contact delivery:** The email change is on hold. Do not modify or deploy the notification worker's recipient until the client confirms the address; then separately authorize a delivery test and rollback.
5. **Translation:** The Spanish presentation mirrors the client's English direction; have a bilingual editor independently review public copy.

## AI-slop watchlist — not authorship claims
The client document includes duplicate Events and Take Part reviews; three separate "Hi!" starts; repeated interchangeable headlines; and broad slogans such as "endless possibilities", "meaningful experiences", and "lasting impact". Those are patterns consistent with AI assistance, not proof of AI authorship. All requested words are treated as **client-supplied marketing language**. Avoid presenting aspirational language as verified program outcomes.

## Acceptance and release gates
- No production merge without independent review; inspect this PR and Vercel preview.
- Run project build and available mobile QA at 320, 375, 390, 430, 768, 1024, and 1440; check WCAG focus, motion preferences, links, readable quotations and no overflow.
- Inspect all English and Spanish pages and 86-photo gallery, film, contact intake, and donation fallback.
- Verify that `/projects/community-cuts` old path still works and no production redirects were changed.
- Full independent anti-slop and accessibility review; confirm client claims and delivery address before deployment.
- **Rollback:** revert this PR; prior production baseline `6c6f348cfa97baf9b5c3f891c3b40463e41882e0`. No direct main modifications were made.
- Final separate task: approved color check and desktop/mobile `ASC3ND COLLECTIVE` wordmark; do not change these in this PR.
