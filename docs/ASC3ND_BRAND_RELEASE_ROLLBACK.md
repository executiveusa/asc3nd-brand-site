# ASC3ND brand-and-copy release — verification and rollback

## Scope
The single review branch adds the client-supplied complete logo lockup to the home heroes and footer, removes the redundant home-header wordmark, and carries the approved content changes from PR #77.

## Asset strategy and limitation
Source is the existing `public/brand/asc3nd-collective-logo.webp`, a raster with an opaque dark background. `mix-blend-mode: screen` visually hides the dark background **only** where the surrounding element is the site's uniform dark `--ink` color (`#120f0b`). This does not create transparency, and appearance over gradients or photographs is not approved. If edge/contrast review fails, do not merge. A tested true-alpha asset may replace this in a subsequent revision.

## Flagged rollback (build-time)
Set `NEXT_PUBLIC_ASC3ND_CLIENT_LOGO=off` for the production build and redeploy. Home hero, footer and home header will return to the preserved original components. Unset/enable only after a new visual review.

## Git/deployment rollback
1. Before merging, record main SHA and the currently serving production deployment ID.
2. Use a squash merge only after build, visual mobile/desktop, and independent review are green.
3. If regression occurs, immediately restore the previous verified deployment or revert the release squash commit (do not rewrite history).
4. Verify production homepage (/ and /es), header nav/donate, footer, event pages, and contact email after rollback.

## Release acceptance (must be independently checked)
- Source logo geometry/colors preserved: orange crown, orange 3, white brush letters and COLLECTIVE.
- No visible rectangular black plate or duplicated wordmark at 320/375/390/430/768/1024/1440 widths.
- Correct contrast for buttons, focus states, and hero copy; keyboard and reduced-motion behavior intact.
- English/Spanish home heroes and all page footers correct.
- Existing approved copy preserved; Project Joy details not fabricated.
- Next.js build and type checks pass; production route screenshots verified by independent reviewer.
- Owner grants explicit final visual sign-off.
