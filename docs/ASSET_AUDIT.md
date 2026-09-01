# ASC3ND Phase 4 Asset Audit

## Decision

Treat existing campaign graphics as brand/social collateral, not documentary proof. The public website should only promote media into documentary slots when the asset, credit, and youth-consent status are verified.

## Existing asset packs reviewed

- ASC3ND Instagram 30-day campaign
- ASC3ND Facebook 30-day campaign
- Community Cuts QR package

These packs contain useful identity graphics, event covers, reel covers, story graphics, end cards, QR assets, campaign manifests, and social copy. They are valuable inputs for brand continuity and campaign operations.

They are **not substitutes for real Community Cuts documentary photography/video** in the homepage evidence sequence.

## Website media classes

1. **Documentary evidence** — real event photography or video tied to a verified moment.
2. **Founder evidence** — approved founder portrait/interview with authored quote.
3. **Brand collateral** — logos, social campaign graphics, QR assets, end cards, event covers.
4. **Operational media** — RSVP/check-in/event-system assets that remain outside the public brand-site migration until separately verified.

## Documentary slots required

| Slot | Purpose | Required proof before publish |
| --- | --- | --- |
| Hero | Establish Community Cuts as real-world evidence | asset approval + credit + consent |
| Arrival | People choosing to show up | asset approval + credit + consent |
| Service | The service/action itself | asset approval + credit + consent |
| Connection | Families, volunteers, youth, community together | asset approval + credit + consent |
| What comes next | Transition from event to longer ASC3ND story | asset approval + credit + consent |
| Founder | Human belief and accountability | founder approval + authored quote + credit |

## Hard rules

- No stock youth photography.
- No generated people.
- No fake metrics, attendance, outcomes, or testimonials.
- No youth image publishes with unknown consent status.
- Do not use a social graphic merely to fill an empty documentary slot.
- Keep placeholders when evidence is not yet approved.
- Every published documentary item must have a source record in `lib/media-registry.ts`.

## Promotion gate

A media item may render publicly only when:

- `status = approved`
- `consent = confirmed` or `not-required`
- a local `src` is present
- alt text is accurate
- credit is recorded when applicable

Until then the site remains deliberately incomplete rather than manufacturing proof.
