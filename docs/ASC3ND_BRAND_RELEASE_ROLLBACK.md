# ASC3ND brand-and-copy release — verification and rollback

## Scope
The single review branch adds the client-supplied complete logo lockup to the home heroes and footer, removes the redundant home-header wordmark, and carries the approved content changes from PR #77.

## Asset strategy and limitation
Source is the unchanged, owner-controlled `public/brand/asc3nd-collective-logo.webp`. The later logo-alpha fix renders it inside an inline SVG with a per-pixel alpha filter derived from its red channel (bright orange/white becomes opaque; black becomes transparent). `mix-blend-mode` is disabled. The original WebP stays untouched for rollback. The filter makes displayed pixels transparent without introducing a new remote asset, but a dedicated transparency PNG remains preferable as a future asset replacement. Validate across browsers and on the hero/footer before merge.

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
