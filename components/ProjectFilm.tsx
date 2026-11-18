"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { ProjectFilm as ProjectFilmModel } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";
import { Lightbox, galleryEn } from "@/components/Lightbox";
import { galleryEs } from "@/lib/site-content.es";
import styles from "./ProjectFilm.module.css";

type Props = { film: ProjectFilmModel; locale?: Locale };

/** Phones use the hosted 720p file. A verified HD file may be used on wide screens. */
const WIDE = "(min-width: 900px)";

export function ProjectFilm({ film, locale = "en" }: Props) {
  const aspectClass = film.aspectRatio === "9:16" ? styles.portrait : styles.landscape;
  const [src, setSrc] = useState(film.embedSrc);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const labels = locale === "es" ? galleryEs : galleryEn;

  useEffect(() => {
    if (film.provider !== "direct-video" || !film.hdSrc) return;
    if (window.matchMedia(WIDE).matches) setSrc(film.hdSrc);
  }, [film.provider, film.hdSrc]);

  return (
    <>
      <figure className={`${styles.film} ${aspectClass}`}>
        <div className={styles.frame}>
          {film.provider === "direct-video" ? (
            <button type="button" className={styles.open} onClick={event => {
              trigger.current = event.currentTarget; setOpen(true);
            }} aria-label={locale === "es" ? "Reproducir el video completo del evento" : "Play the full event film"}>
              <img src={film.poster} alt="" loading="lazy" decoding="async" />
              <span className={styles.play} aria-hidden="true"><Play size={27} fill="currentColor" /></span>
            </button>
          ) : (
            <iframe className={styles.player} src={film.embedSrc} title={film.title}
              allow="accelerometer; autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          )}
        </div>
        {film.caption ? <figcaption className={styles.caption}>{film.caption}</figcaption> : null}
      </figure>
      {open && film.provider === "direct-video" ? (
        <Lightbox items={[{ type: "video", src, poster: film.poster, alt: film.title, caption: film.caption }]}
          index={0} onIndexChange={() => {}} onClose={() => setOpen(false)}
          label={locale === "es" ? "Reproductor del video de Fresh Fade, Fresh Grade" : "Fresh Fade, Fresh Grade film player"}
          labels={labels} triggerRef={trigger} />
      ) : null}
    </>
  );
}
