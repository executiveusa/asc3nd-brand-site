import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandWordmark } from "@/components/BrandWordmark";
import { EventCredits } from "@/components/EventCredits";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { ProjectFilm } from "@/components/ProjectFilm";
import { ProjectProofGallery } from "@/components/ProjectProofGallery";
import { asc3ndProjects, getApprovedProjectMedia, getProjectBySlug } from "@/lib/projects";
import { communityCutsEs } from "@/lib/site-content.es";
import "../../../projects/community-cuts/project.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return asc3ndProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | ASC3ND`,
    description: `Registro de evento de ASC3ND para ${project.title} en ${project.location}.`,
    alternates: {
      canonical: `https://asc3nd.org/es/eventos/${project.slug}`,
      languages: { "en-US": `https://asc3nd.org/events/${project.slug}`, "es": `https://asc3nd.org/es/eventos/${project.slug}` },
    },
  };
}

const creditLabel: Record<string,string> = {
  "Event partners": "Aliados del evento",
  "Sponsors": "Patrocinadores",
  "Barbers": "Barberos",
  "Volunteers": "Voluntariado",
  "Photography + video": "Fotografía + video",
  "Community partners": "Aliados comunitarios",
  "Organizers": "Organizadores",
  "Special thanks": "Agradecimientos especiales",
};

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const media = getApprovedProjectMedia(project);
  const summary = project.slug === "community-cuts" ? communityCutsEs.summary : project.summary;
  const groups = project.credits?.groups.map((group) => ({
    label: creditLabel[group.label] ?? group.label,
    entries: group.entries.map((entry) => entry === "Names to be confirmed" ? "Nombres por confirmar" : entry),
  })) ?? [];

  return (
    <main id="main-content" tabIndex={-1} className="project-page" lang="es">
      <header className="masthead shell">
        <Link className="wordmark" href="/es" aria-label="Inicio de ASC3ND"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Navegación del evento">
          <Link href="/es">Inicio</Link>
          <Link href="/es/eventos">Eventos</Link>
          <Link href="/es/participar">Participar</Link>
          <LocaleSwitch locale="es" enHref={`/events/${project.slug}`} esHref={`/es/eventos/${project.slug}`} />
        </nav>
      </header>

      <section className="project-hero shell">
        <p className="eyebrow">PROYECTO 001</p>
        <h1>{project.title}</h1>
        <div className="project-meta"><p>{project.location}</p><p>{project.dateLabel}</p></div>
        <p className="project-summary">{summary}</p>
      </section>

      {project.featuredFilm ? <section className="project-film-section shell" aria-labelledby="film-es-title">
        <div className="project-film-copy"><p className="eyebrow">LA PELÍCULA</p><h2 id="film-es-title">{project.title}.</h2><p>Mira la película completa del evento.</p></div>
        <ProjectFilm film={project.featuredFilm} />
      </section> : null}

      <section className="project-proof shell" aria-labelledby="proof-es-title">
        <div className="project-proof-heading"><p className="eyebrow">PRUEBA DEL PROYECTO</p><h2 id="proof-es-title">{project.title}, fotografiado.</h2><p>{media.length} fotografías aprobadas del evento.</p></div>
        <ProjectProofGallery items={project.media} initialVisible={18} locale="es" emptyLabel="FOTOGRAFÍAS Y VIDEO APROBADOS" />
      </section>

      <section className="project-evidence shell">
        <div><p className="eyebrow">RESULTADOS</p><h2>Lo que ASC3ND puede verificar.</h2></div>
        <div className="project-evidence-body">{project.outcomes.length ? <ul>{project.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul> : <p>Los totales de resultados se publicarán aquí después de ser verificados.</p>}</div>
      </section>

      {project.credits ? <section className="project-next shell">
        <p className="eyebrow">CON GRATITUD</p>
        <h2>Gracias a todas las personas que hicieron posible {project.title}.</h2>
        <p className="project-thanks">A barberos, voluntariado, familias, aliados, fotógrafos, organizadores y todas las personas que aportaron tiempo, talento y apoyo: gracias por presentarse por la comunidad.</p>
        <div className="project-next-actions"><EventCredits locale="es" eventLabel={`${project.title} · ${project.location} · ${project.dateLabel}`} groups={groups} /></div>
      </section> : null}
    </main>
  );
}
