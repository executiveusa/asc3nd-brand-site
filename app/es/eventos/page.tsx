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
        <p>Desde iniciativas comunitarias hasta alianzas significativas, cada evento de ASC3ND Collective es una oportunidad para apoyar a jóvenes y familias.</p>
      </section>

      <section className="events-current shell" aria-labelledby="current-initiatives-heading">
        <p className="eyebrow">{t.nextEyebrow}</p><h2 id="current-initiatives-heading">{t.nextTitle}</h2>
        <p>La iniciativa de apoyo navideño de ASC3ND Collective para 2026 está activa, según la organización. Contacta al equipo para conocer las maneras de participar.</p>
        <div className="events-current-actions"><Link href="/es/participar">Participa →</Link><Link href="/es/apoyo">Apoya la misión →</Link></div>
      </section>
      <section className="events-list shell" aria-label={t.listLabel}>
        <h2 className="events-section-heading">Eventos pasados e impacto comunitario</h2>
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
                  {project.featuredFilm ? <Link href={href + "#project-film-title"}>Ver video</Link> : null}
                  <Link href={href + "#project-proof-title"}>Ver galería ({media.length})</Link>
                  <Link href="/es/creditos">Aliados comunitarios</Link>
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
