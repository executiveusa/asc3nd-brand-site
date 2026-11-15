# ASC3ND founder feedback: copy tasks 1–5

Source: founder email `Website Asc3nd Updates and Comments` (2026-11-13), attachment `Asc3nd Website Updates 11.12.26.docx`. This is a bounded subset of the 42-item request audit.

## Delivered in this branch

1. **Elisha / Story:** Owner explicitly clarified that **both** the photograph and quote are to be removed from the Story and Historia pages. The approved source quote and image assets remain in the repository for reversible restoration; the public Story pages render neither. This owner direction supersedes the earlier interpretation of the founder document.
2. **Project Joy / Story:** Paired with Fresh Fade in `Our Mission in Action`, linking to an independent detail page. No unsupported impact claims.
3. **Project Joy / Events:** Uses the same editorial event-card hierarchy as Fresh Fade and has dedicated EN/ES project-detail routes with reserved sections for founder-approved campaign narrative, photos/video and ways to participate.
4. **Fresh Fade partner highlights:** Events includes a `Community Partners` heading driven by the existing public `creditPeople.partners/sponsors/community` registry, not an invented second database. Empty lists clearly await confirmation. Existing Fresh Fade credit registry and event-credits dialog remain intact.
5. **Get Involved supporting statement:** Exact founder English sentence is displayed between the headline and approved introduction. Spanish equivalent is present.

## Awaiting founder-provided material

- Project Joy: final English campaign text, start/end and location (if applicable), beneficiary/use of gifts, participation steps and verified donation URL, consent-cleared media, and whether to characterize its status as active.
- Fresh Fade: approved names, partner organizations, contributions, media, and permission to credit publicly.
- Story design work: separate release to revise Otha's portrait sizing and add approved event imagery. Elisha's portrait and commentary have already been removed from the Story pages per the owner's explicit direction.

## Guardrails

- No invented donations, active-program claims, event outputs, partner endorsements or contact details.
- No new forms or payment integration; preserve current styles and routes.
- `lib/initiative-content.ts` is the one source for Project Joy copy slots. Public credit approval remains in `lib/credits.ts`.
- Rollback: revert this feature PR's eventual squash commit; prior release `69770e67eea322d7541fa6973fea366ce6d9a651`.

## Acceptance

- EN/ES Story pages contain neither Elisha's portrait nor her quote, and still link to both initiative pages.
- EN/ES Events page contains a Project Joy card, a working detail route, and a partner section without unverified names.
- EN/ES Get Involved pages have the supporting statement.
- EN/ES Project Joy routes show reserved narrative, media and involvement slots with no invented data or donation link.
- Mobile reflow, keyboard/accessibility, TypeScript and build checks pass.
- Preview and owner/independent review before merge.
