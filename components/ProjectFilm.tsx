"use client";

import { useEffect, useState } from "react";
import type { ProjectFilm as ProjectFilmModel } from "@/lib/projects";
import styles from "./ProjectFilm.module.css";

type Props = {
  film: ProjectFilmModel;
};

/** Phones and narrow windows always get the 720p file. The 1080p file is chosen only on wide screens, only if one is hosted. */
const WIDE = "(min-width: 900px)";

export function ProjectFilm({ film }: Props) {
  const aspectClass = film.aspectRatio === "9:16" ? styles.portrait : styles.landscape;
  const [src, setSrc] = useState(film.embedSrc);

  useEffect(() => {
    if (film.provider !== "direct-video" || !film.hdSrc) return;
    if (window.matchMedia(WIDE).matches) setSrc(film.hdSrc);
  }, [film.provider, film.hdSrc]);

  return (
    <figure className={`${styles.film} ${aspectClass}`}>
      <div className={styles.frame}>
        {film.provider === "direct-video" ? (
          <video
            className={styles.player}
            src={src}
            poster={film.poster}
            title={film.title}
            controls
            playsInline
            preload="none"
          />
        ) : (
          <iframe
            className={styles.player}
            src={film.embedSrc}
            title={film.title}
            allow="accelerometer; autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      {film.caption ? <figcaption className={styles.caption}>{film.caption}</figcaption> : null}
    </figure>
  );
}
