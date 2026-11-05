/**
 * The Collective logo switch. One value decides whether the founders' raster logo appears on the site.
 *
 *   on   (default) a single black plate on the Our story pages (EN and ES).
 *   off  the plate is gone everywhere. Nothing else on the site changes.
 *
 * Read at build time: set NEXT_PUBLIC_COLLECTIVE_LOGO=off and redeploy to hide it.
 * Removing it for good is one revert of the commit that added it. See docs/COLLECTIVE_LOGO.md.
 */
export const showCollectiveLogo = (process.env.NEXT_PUBLIC_COLLECTIVE_LOGO ?? "on").trim().toLowerCase() !== "off";
