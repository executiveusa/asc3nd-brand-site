import Link from "next/link";
import { asc3ndProjects, getApprovedProjectMedia } from "@/lib/projects";
import { communityCutsEs, eventsEs as t } from "@/lib/site-content.es";
import "../../events/events.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { projectJoy } from "@/lib/initiative-content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es/eventos",
});

// Spanish copy per project slug. Add an entry when a new project is added to lib/projects.ts.
const projectCopy: Record<string, { title: string; eyebrow: string; place: string; summary: string }> = {
  "community-cuts": {
    title: "Fresh Fade, Fresh Grade",
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

      <section className="events-next shell" aria-labelledby="current-initiatives-title">
        <h2 id="current-initiatives-title" className="events-section-heading">Iniciativas actuales y próximas</h2>
        <article className="event-record event-record--upcoming" aria-labelledby="project-joy-title">
          <Link className="event-record-cover initiative-event-media" href="/es/proyectos/project-joy" aria-label="Conoce Project Joy"><img src={projectJoy.artworkUrl} alt="Logo oficial de Project Joy Toy Drive de ASC3ND" width={800} height={800} loading="lazy" decoding="async" /></Link>
          <div className="event-record-copy">
            <p className="eyebrow">{projectJoy.es.type}</p>
            <h3 id="project-joy-title">{projectJoy.title}</h3>
            <p>{projectJoy.es.awaiting}</p>
            <Link className="event-record-link" href="/es/proyectos/project-joy">{projectJoy.es.linkLabel} <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </article>
      </section>
      <section className="events-past-heading-section shell" aria-labelledby="past-impact-title">
        <h2 id="past-impact-title" className="events-section-heading">Eventos pasados e impacto comunitario</h2>
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
                <h2>{copy.title} — Evento comunitario de regreso a clases</h2>
                <p>{copy.place}</p>
                <p className="event-record-summary">{copy.summary}</p>
                <div className="event-record-proof">
                  {project.featuredFilm ? <Link href={`${href}#project-film-title`}>{t.film}</Link> : null}
                  <Link href={`${href}#project-proof-title`}>{t.photos(media.length)}</Link>
                  <Link href={`${href}#${project.outcomes.length ? "project-evidence-title" : "project-partners-title"}`}>{project.outcomes.length ? t.outcomes(project.outcomes.length) : t.outcomesPending}</Link>
                </div>
                <Link className="event-record-link" href={href}>
                  {t.openEvent} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <SiteFooter />
    </main>
  );
}
