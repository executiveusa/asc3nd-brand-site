import Link from "next/link";
import { EditorialProofCarousel } from "@/components/EditorialProofCarousel";
import { getStoryProofs } from "@/lib/editorial-proof";
import { CollectiveLogo } from "@/components/CollectiveLogo";
import { projectJoy } from "@/lib/initiative-content";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { founderQuotesEs, pathwaysEs, storyEs as t, translationNote } from "@/lib/site-content.es";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es/historia",
});

export default function HistoriaPage() {
  const [otha] = founderQuotesEs;

  return (
    <InteriorPage eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      <section className="story shell interior-story">
        <DocumentaryFrame label={otha.name} slot="founder-otha" className="portrait-placeholder" />
        <div className="story-copy">
          <p className="eyebrow">{otha.name}, {otha.role}</p>
          <blockquote>“{otha.quote}”</blockquote>
          <p>— {otha.name}</p>
          <p className="translation-note">{translationNote}</p>
        </div>
        <p>A medida que Asc3nd Collective sigue creciendo, trabajamos para ampliar nuestras iniciativas y alianzas y hacer realidad estas áreas de enfoque.</p>
      </section>


      <EditorialProofCarousel items={getStoryProofs()} locale="es" />

      <CollectiveLogo alt="Logotipo de ASC3ND Collective: una corona naranja sobre el nombre ASC3ND en letras blancas de pincel, con el 3 en naranja" />

      <section className="interior-statement shell">
        <p className="eyebrow">{t.nextEyebrow}</p>
        <h2>{t.nextTitle}</h2>
        <div className="interior-pathways">
          {pathwaysEs.map(({ title, copy }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="interior-section shell story-mission" aria-labelledby="mission-in-action">
        <h2 id="mission-in-action">Nuestra misión en acción</h2>
        <div className="story-mission-grid">
          <article>
            <p className="eyebrow">Iniciativa comunitaria</p>
            <h3>Fresh Fade, Fresh Grade</h3>
            <p>Fresh Fade, Fresh Grade reunió a nuestra comunidad en Everett, Washington, en agosto de 2026 para apoyar a jóvenes y familias durante el regreso a clases.</p>
            <Link href="/es/proyectos/community-cuts">Conoce Fresh Fade, Fresh Grade <span className="arrow" aria-hidden="true">→</span></Link>
          </article>
          <article>
            <p className="eyebrow">{projectJoy.es.type}</p>
            <h3>{projectJoy.title}</h3>
            <p>{projectJoy.es.awaiting}</p>
            <Link href="/es/proyectos/project-joy">{projectJoy.es.linkLabel} <span className="arrow" aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

    </InteriorPage>
  );
}
