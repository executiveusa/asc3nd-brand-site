# Collective logo switch

The founders' own logo (raster, black background) appears once, as a black plate on the Our story pages (`/story`, `/es/historia`), between the founders and "What comes next".

## Turn it off (no code change)

Set `NEXT_PUBLIC_COLLECTIVE_LOGO=off` in the hosting project's environment variables and redeploy. Any other value, or no value, leaves it on. The value is read at build time.

## Remove it for good

Revert the commit that added it. It touches only `lib/collective-logo.ts`, `components/CollectiveLogo.tsx`, `components/collective-logo.css`, `public/brand/asc3nd-collective-logo.webp`, this file, and one line in each story page.

## Notes

- The site's identity stays the outlined wordmark (`components/BrandLogo.tsx`) in the header and footer. The footer already carries the crown and wordmark, so the raster logo is not repeated there.
- The file is a raster crop of the founders' PNG at 1380 x 735, shown at up to 560px wide, so it stays sharp at 2x. Do not enlarge it. If the founders supply an SVG later, swap the file and keep the plate.
- The circle badge logo is for merch only and is not on the site.
