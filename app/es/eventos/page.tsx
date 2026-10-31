import Link from "next/link";
import { asc3ndProjects, getApprovedProjectMedia } from "@/lib/projects";
import { communityCutsEs, eventsEs as t } from "@/lib/site-content.es";
import "../../events/events.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es/eventos",
});

// Spanish copy per project slug. Add an entry when a new project is added to lib/projects.ts.
const projectCopy: Record<string, { title: string; eyebrow: string; place: string; summary: string }> = {
  "community-cuts": {
    title: "Community Cuts for Kids",
    eyebrow: communityCutsEs.eyebrow,
    place: "Everett, Washington, agosto de 2026",
    summary: communityCutsEs.summary,
  },
};

export default function EventosPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="events" />

      <section className="events-hero shell">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>

      <section className="events-list shell" aria-label={t.listLabel}>
        {asc3ndProjects.map((project, index) => {
          const media = getApprovedProjectMedia(project);
          const cover = media[0];
          const copy = projectCopy[project.slug];
          if (!copy) return null;
          const href = `/es/proyectos/${project.slug}`;

          return (
            <article className="event-record" key={project.slug}>
              <div className="event-record-index">

              </div>

              <Link className="event-record-cover" href={href} aria-label={t.openLabel(copy.title)}>
                {cover?.src ? (
                  <img src={cover.src} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                ) : (
                  <span className="event-record-empty">{t.emptyCover}</span>
                )}
              </Link>

              <div className="event-record-copy">
                <p className="eyebrow">{copy.eyebrow}</p>
                <h2>{copy.title}</h2>
                <p>{copy.place}</p>
                <p className="event-record-summary">{copy.summary}</p>
                <div className="event-record-proof">
                  {project.featuredFilm ? <span>{t.film}</span> : null}
                  <span>{t.photos(media.length)}</span>
                  <span>{project.outcomes.length ? t.outcomes(project.outcomes.length) : t.outcomesPending}</span>
                </div>
                <Link className="event-record-link" href={href}>
                  {t.openEvent} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="events-next shell">
        <p className="eyebrow">{t.nextEyebrow}</p>
        <h2>{t.nextTitle}</h2>
      </section>

      <SiteFooter />
    </main>
  );
}
