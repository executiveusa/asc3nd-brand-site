import { EventCredits } from "@/components/EventCredits";
import { ProjectFilm } from "@/components/ProjectFilm";
import { ProjectProofGallery } from "@/components/ProjectProofGallery";
import { communityCutsProject, getApprovedProjectMedia } from "@/lib/projects";
import { communityCutsEs as t, esDateLabel, esLocation } from "@/lib/site-content.es";
import "../../../projects/community-cuts/project.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es/proyectos/community-cuts",
});

export default function CommunityCutsEsPage() {
  const project = communityCutsProject;
  const media = getApprovedProjectMedia(project);
  const film = project.featuredFilm ? { ...project.featuredFilm, title: t.film.filmTitle, caption: t.film.caption } : undefined;
  const photos = project.media.map((item) => ({
    ...item,
    caption: item.caption ? t.photos.caption : undefined,
  }));

  return (
    <main id="main-content" tabIndex={-1} className="project-page">
      <SiteHeader current="events" />

      <section className="project-hero shell">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{project.title}</h1>
        <div className="project-meta">
          <p>{esLocation}</p>
          <p>{esDateLabel}</p>
        </div>
        <p className="project-summary">{t.summary}</p>
      </section>

      {film ? (
        <section className="project-film-section shell" aria-labelledby="project-film-title">
          <div className="project-film-copy">
            <p className="eyebrow">{t.film.eyebrow}</p>
            <h2 id="project-film-title">{t.film.title}</h2>
            <p>{t.film.lead}</p>
          </div>
          <ProjectFilm film={film} />
        </section>
      ) : null}

      <section className="project-proof shell" aria-labelledby="project-proof-title">
        <div className="project-proof-heading">
          <p className="eyebrow">{t.photos.eyebrow}</p>
          <h2 id="project-proof-title">{t.photos.title}</h2>
          <p>{t.photos.count(media.length)}</p>
        </div>
        <ProjectProofGallery items={photos} initialVisible={12} emptyLabel={t.photos.empty} locale="es" />
      </section>

      <section className="project-evidence shell">
        <div><p className="eyebrow">{t.outcomes.eyebrow}</p><h2>{t.outcomes.title}</h2></div>
        <div className="project-evidence-body">
          {project.outcomes.length ? (
            <ul>{project.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          ) : (
            <p>{t.outcomes.pending}</p>
          )}
        </div>
      </section>

      <section className="project-next shell">
        <p className="eyebrow">{t.thanks.eyebrow}</p>
        <h2>{t.thanks.title}</h2>
        {project.credits ? (
          <>
            <p className="project-thanks">{t.thanks.intro}</p>
            <div className="project-next-actions">
              <EventCredits
                locale="es"
                eventLabel={`${project.title} · ${esLocation} · ${esDateLabel}`}
                groups={t.creditGroups}
              />
            </div>
          </>
        ) : null}
      </section>
      <SiteFooter />
    </main>
  );
}
