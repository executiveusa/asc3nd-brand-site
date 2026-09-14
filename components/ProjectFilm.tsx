import type { ProjectFilm as ProjectFilmModel } from "@/lib/projects";

type Props = {
  film: ProjectFilmModel;
};

export function ProjectFilm({ film }: Props) {
  return (
    <figure className={`project-film project-film--${film.aspectRatio.replace(":", "x")}`}>
      <div className="project-film-frame">
        <iframe
          src={film.embedSrc}
          title={film.title}
          allow="autoplay; fullscreen"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {film.caption ? <figcaption>{film.caption}</figcaption> : null}
    </figure>
  );
}
