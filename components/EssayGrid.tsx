"use client";

import { useRef, useState } from "react";
import { Lightbox, galleryEn } from "@/components/Lightbox";
import { LoopVideo } from "@/components/LoopVideo";
import { galleryEs } from "@/lib/site-content.es";
import { revealRef } from "@/lib/reveal";
import type { Locale } from "@/lib/i18n";

export type EssayEntry = { kind: "photo"; src: string; alt: string } | { kind: "loop" };

const LOOP_SRC = "/media/community-cuts/community-cuts-loop.mp4";
const LOOP_POSTER = "/media/community-cuts/community-cuts-poster-720.webp";

/** Homepage Community Cuts essay: photos open the shared lightbox; one slot holds the decorative loop. */
export function EssayGrid({ entries, locale = "en" }: { entries: EssayEntry[]; locale?: Locale }) {
  const t = locale === "es" ? galleryEs : galleryEn;
  const photos = entries.filter((e): e is Extract<EssayEntry, { kind: "photo" }> => e.kind === "photo");
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  let photoIndex = -1;

  return (
    <>
      <div className="shell home-essay-grid">
        {entries.map((entry) => {
          if (entry.kind === "loop") {
            return (
              <div className="essay-frame essay-loop" key="loop">
                <LoopVideo src={LOOP_SRC} poster={LOOP_POSTER} />
              </div>
            );
          }
          photoIndex += 1;
          const index = photoIndex;
          return (
            <button
              key={entry.src}
              type="button"
              className="essay-frame zoom-frame"
              aria-label={t.open(entry.alt, index + 1, photos.length)}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActive(index);
              }}
            >
              <img ref={revealRef} data-reveal="" src={entry.src} alt={entry.alt} loading="lazy" decoding="async" />
            </button>
          );
        })}
      </div>
      {active !== null ? (
        <Lightbox
          items={photos.map((p) => ({ src: p.src, alt: p.alt }))}
          index={active}
          onIndexChange={setActive}
          onClose={() => setActive(null)}
          label={`Community Cuts for Kids event photo ${active + 1} of ${photos.length}: ${photos[active].alt}`}
          labels={t}
          triggerRef={triggerRef}
        />
      ) : null}
    </>
  );
}
