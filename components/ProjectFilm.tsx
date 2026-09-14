import type { ProjectFilm as ProjectFilmModel } from "@/lib/projects";
import styles from "./ProjectFilm.module.css";

type Props = {
  film: ProjectFilmModel;
};

export function ProjectFilm({ film }: Props) {
  const aspectClass = film.aspectRatio === "9:16" ? styles.portrait : styles.landscape;

  return (
    <figure className={`${styles.film} ${aspectClass}`}>
      <div className={styles.frame}>
        <iframe
          className={styles.player}
          src={film.embedSrc}
          title={film.title}
          allow="accelerometer; autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {film.caption ? <figcaption className={styles.caption}>{film.caption}</figcaption> : null}
    </figure>
  );
}
