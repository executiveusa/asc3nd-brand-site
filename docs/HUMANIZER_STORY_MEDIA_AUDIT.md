# ASC3ND humanizer + story-media audit

## Decision

The site should read like a real organization telling one clear story, not like a nonprofit template describing itself in abstract language.

The story is:

1. Community Cuts for Kids happened.
2. Young people, families, volunteers, and local supporters came together.
3. ASC3ND is building from that event instead of treating it as a one-off moment.
4. The next work is organized around trusted guidance, life skills, and community-built opportunity.
5. Families, mentors, volunteers, and partners can start a direct conversation now.

No outcome, attendance number, testimonial, founder quote, or program claim is added unless it is verified.

## Humanizer pass

Applied the guidance from `blader/humanizer` version 2.11.2 as a review standard.

Changes made:

- replaced abstract nonprofit language with concrete subjects and actions;
- reduced phrases such as "activation," "meaningful next step," "meet them with intention," and "what this proves";
- removed unsupported future-facing claims;
- removed chatbot-style and inflated phrasing;
- changed copy so Community Cuts is the narrative starting point, not a proof block dropped into a generic page;
- kept the approved governing headline because it functions as ASC3ND's brand thesis rather than explanatory prose;
- kept the three developing pathways because they are an actual content model, not a forced rhetorical list;
- removed em-dash styling from ordinary public-facing prose;
- preserved placeholders when a founder quote or verified fact is still missing.

## Media system

Every major story section now has an explicit media slot. Any slot can render an approved image or video without restructuring the page.

| Slot | Story job | Good media candidates |
| --- | --- | --- |
| `hero` | establish place and human reality immediately | short ambient brand film, strongest documentary still |
| `arrival` | people showing up | arrivals, families entering, volunteers setting up |
| `service` | show the useful act | haircut/service footage, hands at work |
| `connection` | show people together | conversations, families, volunteers, candid moments |
| `next` | move from event to future | closing moment, cleanup, group image, reflective clip |
| `founder` | make the organization personal | founder portrait, direct-to-camera founder clip |
| `story-context` | deepen the founder/community story | interview excerpt, community voices, short brand film |
| `pathways` | connect the event to future work | mentoring, skill-building, planning, brand film |
| `take-part` | end with people rather than interface | volunteers, families, partners, invitation film |
| `impact-closing` | close the case study with evidence | event recap, final still, short closing sequence |

## Media capabilities

The shared registry supports:

- image or video;
- separate mobile source;
- video poster image;
- captions and credits;
- autoplay, loop, and mute behavior for ambient brand films;
- explicit approval state;
- explicit consent state;
- placeholders whenever approval or consent is incomplete.

For youth media, `status: "approved"` is not enough. Consent must also be `confirmed` or explicitly `not-required` before the asset can render.

## Story test

A visitor should be able to answer these questions after one homepage scroll:

- What happened? Community Cuts for Kids.
- Who was there? Young people, families, volunteers, and local supporters.
- Why does ASC3ND exist? To keep building support after the event ends.
- What is being built? Trusted guidance, life skills, and community-built opportunity, all still labeled in development.
- What can I do? Join as a family, mentor/volunteer, or community partner and start a direct conversation.

## Remaining human inputs

The system is ready for real media, but the final story cannot be completed by code alone. We still need:

- approved Community Cuts images/video;
- consent and credit data for each published asset;
- founder portrait or founder video;
- founder-authored belief/quote;
- verified event totals or outcomes if ASC3ND wants them published;
- final confirmation that the participation email routes are correct.
