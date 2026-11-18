"use client";

import { useRef, useState } from "react";
import { Lightbox, galleryEn } from "@/components/Lightbox";
import { galleryEs } from "@/lib/site-content.es";
import { revealRef } from "@/lib/reveal";
import type { Locale } from "@/lib/i18n";

type Props = { locale: Locale; src: string; srcSet: string; alt: string; caption: string };

/** Preserve the approved homepage image layout; only add explicit click-to-enlarge behavior. */
export function HomeHeroMedia({ locale, src, srcSet, alt, caption }: Props) {
  const [opened, setOpened] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const labels = locale === "es" ? galleryEs : galleryEn;
  return (
    <>
      <figure className="home-hero-media">
        <button type="button" className="home-hero-photo-trigger"
          aria-label={locale === "es" ? "Ampliar la foto del evento" : "Enlarge event photograph"}
          onClick={event => { trigger.current = event.currentTarget; setOpened(true); }}>
          <img ref={revealRef} data-reveal="" src={src} srcSet={srcSet}
            sizes="100vw" style={{ height: "auto" }} alt={alt}
            width={1600} height={1067} fetchPriority="high" />
        </button>
        <figcaption className="shell home-proof">{caption}</figcaption>
      </figure>
      {opened ? <Lightbox items={[{ src, srcSet, alt, caption, width: 1600, height: 1067 }]}
        index={0} onIndexChange={() => {}} onClose={() => setOpened(false)}
        label={locale === "es" ? "Foto de Fresh Fade, Fresh Grade" : "Fresh Fade, Fresh Grade event photograph"}
        labels={labels} triggerRef={trigger} /> : null}
    </>
  );
}
