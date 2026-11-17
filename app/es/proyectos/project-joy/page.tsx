import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";
import { projectJoy } from "@/lib/initiative-content";
import "../../../projects/community-cuts/project.css";
import "../../../initiative-placeholder.css";

export const metadata = {
  ...pageMetadata({
  title: projectJoy.title,
  description: "Iniciativa solidaria de ASC3ND para la temporada navideña de 2026. Los detalles se publicarán cuando los fundadores los confirmen.",
  path: "/es/proyectos/project-joy",
  }),
  robots: { index: false, follow: true },
};

export default function ProjectJoyEsPage() {
  const c = projectJoy.es;
  return (
    <main id="main-content" tabIndex={-1} className="project-page">
      <SiteHeader current="events" />
      <section className="project-hero shell">
        <p className="eyebrow">{c.type}</p>
        <h1>{projectJoy.title}</h1>
        <p className="project-summary">{c.storyIntro}</p>
      </section>
      <section className="project-evidence shell" aria-labelledby="joy-story-heading">
        <h2 id="joy-story-heading">{c.overviewTitle}</h2>
        <div className="project-evidence-body"><div className="initiative-pending-slot" data-pending="story"><strong>PENDIENTE — Historia / fechas / beneficiarios</strong><p>{c.overviewPending}</p></div></div>
      </section>
      <section className="project-proof shell" aria-labelledby="joy-media-heading">
        <div className="project-proof-heading">
          <p className="eyebrow">{projectJoy.title}</p>
          <h2 id="joy-media-heading">{c.mediaTitle}</h2>
          <p>{c.mediaBody}</p>
        </div>
        <div className="initiative-media-stage" role="img" aria-label="Espacio para fotografía y video aprobados de Project Joy"><span>{projectJoy.title}</span><small>{c.mediaPending}</small></div>
      </section>
      <section className="project-next shell" aria-labelledby="joy-next-heading">
        <p className="eyebrow">{projectJoy.title}</p>
        <h2 id="joy-next-heading">{c.involvementTitle}</h2>
        <div className="initiative-pending-slot" data-pending="participation"><strong>PENDIENTE — Participación / enlace oficial de donación</strong><p className="project-thanks">{c.involvementBody}</p></div>
        <div className="project-next-actions">
          <Link href="/es/eventos">Volver a Eventos <span className="arrow" aria-hidden="true">→</span></Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
