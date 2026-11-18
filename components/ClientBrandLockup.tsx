/**
 * The client's unchanged ASC3ND artwork is stored locally as an opaque WebP.
 * Use the image's red channel to derive a real per-pixel alpha mask at render time.
 * White and orange both have strong red values; black backdrop has nearly none.
 * This avoids a dark rectangle without modifying the original or loading an external URL.
 *
 * The previous raster rendering is retained in git history and the logo feature
 * flag still restores the original site identity when disabled.
 */
export const clientLogoEnabled = process.env.NEXT_PUBLIC_ASC3ND_CLIENT_LOGO !== "off";

type Props = {
  className?: string;
  priority?: boolean;
  placement?: "hero" | "footer" | "header";
};

export function ClientBrandLockup({ className = "", placement = "footer" }: Props) {
  const filterId = `asc3nd-logo-alpha-${placement}`;
  const titleId = `asc3nd-logo-title-${placement}`;

  return (
    <svg
      className={["client-brand-lockup", className].filter(Boolean).join(" ")}
      viewBox="0 0 1380 735"
      role="img"
      aria-labelledby={titleId}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>ASC3ND Collective</title>
      <defs>
        <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {/* Transfer red brightness to alpha; white/orange stay solid, black becomes clear. */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 0 0 0 0"
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="1.12" intercept="-0.08" />
          </feComponentTransfer>
        </filter>
      </defs>
      <image
        href="/brand/asc3nd-collective-logo.webp"
        width="1380"
        height="735"
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}
