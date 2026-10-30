import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { asc3ndProjects, getApprovedProjectMedia } from "@/lib/projects";
import { communityCutsEs } from "@/lib/site-content.es";
import "../../events/events.css";

export const metadata = {
  title: "Eventos | ASC3ND",
  description: "Archivo de eventos de ASC3ND con películas, fotografías aprobadas, créditos y resultados verificados.",
  alternates: { canonical: "https://asc3nd.org/es/eventos", languages: { "en-US": "https://asc3nd.org/events", "es": "https://asc3nd.org/es/eventos" } },
};

export default function EventosPage() {
  return (
    <main id="main-content" tabIndex={-1} lang="es">
      <header className="masthead shell">
        <Link className="wordmark" href="/es" aria-label="Inicio de ASC3ND"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Navegación principal">
          <Link href="/es">Historia</Link>
          <Link href="/es/eventos" aria-current="page">Eventos</Link>
          <Link href="/es/participar">Participar</Link>
          <Link href="/es/merch">Merch</Link>
          <LocaleSwitch locale="es" enHref="/events" esHref="/es/eventos" />
        </nav>
      </header>

      <section className="events-hero shell">
        <p className="eyebrow">ARCHIVO DE EVENTOS</p>
        <h1>Un registro para cada evento de ASC3ND.</h1>
        <p>Cada evento conserva aquí su película, fotografías aprobadas, créditos y resultados verificados. La página principal se mantiene enfocada en ASC3ND como organización.</p>
      </section>

      <section className="events-list shell" aria-label="Archivo de eventos de ASC3ND">
        {asc3ndProjects.map((project, index) => {
          const media = getApprovedProjectMedia(project);
          const cover = media[0];
          const summary = project.slug === "community-cuts" ? communityCutsEs.summary : project.summary;
          return (
            <article className="event-record" key={project.slug}>
              <div className="event-record-index"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <Link className="event-record-cover" href={`/es/eventos/${project.slug}`} aria-label={`Abrir registro de ${project.title}`}>
                {cover?.src ? <img src={cover.src} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" /> : <span className="event-record-empty">Material aprobado del evento</span>}
              </Link>
              <div className="event-record-copy">
                <p className="eyebrow">PROYECTO {String(index + 1).padStart(3, "0")}</p>
                <h2>{project.title}</h2>
                <p>{project.location} · {project.dateLabel}</p>
                <p className="event-record-summary">{summary}</p>
                <div className="event-record-proof">
                  {project.featuredFilm ? <span>Película</span> : null}
                  <span>{media.length} fotos aprobadas</span>
                  <span>{project.outcomes.length ? `${project.outcomes.length} resultados verificados` : "Resultados pendientes de verificación"}</span>
                </div>
                <Link className="event-record-link" href={`/es/eventos/${project.slug}`}>Abrir galería completa <span aria-hidden="true">↗</span></Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
