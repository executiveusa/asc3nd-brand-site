"use client";

import { useRef, useState } from "react";
import { Lightbox, galleryEn } from "@/components/Lightbox";
import { LoopVideo } from "@/components/LoopVideo";
import { Play } from "lucide-react";
import { communityCutsProject } from "@/lib/projects";
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
  const [videoOpen, setVideoOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  let photoIndex = -1;

  return (
    <>
      <div className="shell home-essay-grid">
        {entries.map((entry) => {
          if (entry.kind === "loop") {
            return (
              <button type="button" className="essay-frame essay-loop essay-video-trigger" key="loop"
                aria-label={locale === "es" ? "Reproducir el video completo del evento" : "Play the full event film"}
                onClick={event => { triggerRef.current = event.currentTarget; setVideoOpen(true); }}>
                <LoopVideo src={LOOP_SRC} poster={LOOP_POSTER} />
                <span className="essay-video-play" aria-hidden="true"><Play size={26} fill="currentColor" /></span>
              </button>
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
      {videoOpen && communityCutsProject.featuredFilm ? (
        <Lightbox
          items={[{ type: "video", src: communityCutsProject.featuredFilm.embedSrc,
            poster: communityCutsProject.featuredFilm.poster,
            alt: communityCutsProject.featuredFilm.title,
            caption: locale === "es" ? "Video del evento Fresh Fade, Fresh Grade" : "Fresh Fade, Fresh Grade event film" }]}
          index={0} onIndexChange={() => {}} onClose={() => setVideoOpen(false)}
          label={locale === "es" ? "Reproductor de video del evento" : "Event film player"}
          labels={t} triggerRef={triggerRef}
        />
      ) : null}
      {active !== null ? (
        <Lightbox
          items={photos.map((p) => ({ src: p.src, alt: p.alt }))}
          index={active}
          onIndexChange={setActive}
          onClose={() => setActive(null)}
          label={
            locale === "es"
              ? `Fresh Fade, Fresh Grade, foto del evento ${active + 1} de ${photos.length}: ${photos[active].alt}`
              : `Fresh Fade, Fresh Grade event photo ${active + 1} of ${photos.length}: ${photos[active].alt}`
          }
          labels={t}
          triggerRef={triggerRef}
        />
      ) : null}
    </>
  );
}
