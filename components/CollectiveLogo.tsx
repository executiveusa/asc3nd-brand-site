import "./collective-logo.css";
import { showCollectiveLogo } from "@/lib/collective-logo";

/**
 * The founders' own logo (raster, black background), shown once as a black plate so the square
 * background never reads as a box on the paper-coloured page. Renders nothing when the switch is off.
 * The site's identity stays the outlined wordmark in the header and footer.
 */
export function CollectiveLogo({ alt }: { alt: string }) {
  if (!showCollectiveLogo) return null;
  return (
    <section className="collective-logo shell">
      <div className="collective-logo-plate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/asc3nd-collective-logo.webp" width={1380} height={735} alt={alt} loading="lazy" decoding="async" />
      </div>
    </section>
  );
}
