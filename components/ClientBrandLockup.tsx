/**
 * The client-supplied ASC3ND Collective logo. Do not alter or recreate its artwork.
 * The original raster is kept in /public/brand, and a screen blend is used only
 * against the verified dark background. Replace with a reviewed transparent
 * raster in a later change if higher fidelity is required.
 */
export const clientLogoEnabled = process.env.NEXT_PUBLIC_ASC3ND_CLIENT_LOGO !== "off";

export function ClientBrandLockup({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={["client-brand-lockup", className].filter(Boolean).join(" ")}
      src="/brand/asc3nd-collective-logo.webp"
      width={1380}
      height={735}
      alt="ASC3ND Collective"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
