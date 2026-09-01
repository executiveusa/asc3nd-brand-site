# ASC3ND section drop matrix

The public site is designed so approved content can be swapped without redesigning the page.

## Homepage content source

Public copy is centralized in `lib/site-content.ts`.

Edit `siteStory` for the main section copy. Edit `communityRoll`, `pathways`, and `participationRoutes` for repeated content. Pages should not duplicate this copy unless there is a route-specific reason.

## Media source

All public media is registered in `lib/media-registry.ts`.

A media item renders only when:

- `status` is `approved`;
- consent is `confirmed` or explicitly `not-required`;
- a source file or URL exists.

Any slot may hold an image or a video. Video entries support desktop and mobile sources, a poster frame, captions, credits, autoplay, loop, and mute settings.

| Section | Copy source | Media slot | Best content |
| --- | --- | --- | --- |
| Hero | `siteStory.hero` | `hero` | strongest still or 15–25 second ambient brand film |
| Community Roll: Arrival | `communityRoll[0]` | `arrival` | arrivals, families entering, setup |
| Community Roll: Service | `communityRoll[1]` | `service` | haircuts, hands at work, useful action |
| Community Roll: Connection | `communityRoll[2]` | `connection` | conversations, families, volunteers together |
| Community Roll: Next | `communityRoll[3]` | `next` | closing moment, cleanup, group image, reflective clip |
| Founder | `siteStory.story` | `founder` | portrait or direct-to-camera founder clip |
| Story context | route copy | `story-context` | founder interview, community voices, short story film |
| Pathways | `siteStory.pathways` + `pathways` | `pathways` | mentoring, planning, skills, brand film |
| Take part | `siteStory.takePart` + `participationRoutes` | `take-part` | volunteers, families, partners, invitation film |
| Impact closing | impact route | `impact-closing` | recap, final still, closing sequence |

## Social assets

Instagram and LinkedIn are vector marks. No raster social-logo files are used.

- Instagram vector source: Simple Icons.
- LinkedIn vector path is inherited from the prior ASC3ND public site.
- Utility interface icons use Lucide, not emoji or generic raster icon packs.

Current social destinations are inherited from the prior ASC3ND site and should be re-verified before production cutover:

- `https://instagram.com/asc3ndcollective`
- `https://linkedin.com/company/asc3nd-collective`

## Editorial rule

The media carries the emotion. Typography carries the argument. Copy says only what is needed.

Do not add a new component because a new asset arrives. Put the asset into the correct existing slot first. Create a new slot only when the story genuinely needs another beat.
