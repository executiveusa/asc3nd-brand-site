import Link from "next/link";
import { CollectiveLogo } from "@/components/CollectiveLogo";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { founderQuotesEs, pathwaysEs, storyEs as t, translationNote } from "@/lib/site-content.es";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: t.meta.title, description: t.meta.description, path: "/es/historia" });

export default function HistoriaPage() {
  const [otha, elisha] = founderQuotesEs;
  return (
    <InteriorPage eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      <section className="interior-section shell story-narrative">
        <p>Lo que comenzó como una visión para apoyar a jóvenes y familias cobró vida con Fresh Fade, Fresh Grade en Everett, Washington, en agosto de 2026.</p>
        <p>Nuestra misión va más allá de un solo evento: creemos que cada joven merece sentirse escuchado, apoyado y capaz de desarrollar su potencial.</p>
        <p>Mediante alianzas comunitarias, mentoría y experiencias compartidas, construimos relaciones que generan oportunidades.</p>
      </section>
      <section className="story shell interior-story">
        <DocumentaryFrame label={otha.name} slot="founder-otha" className="portrait-placeholder" />
        <div className="story-copy">
          <p className="eyebrow">{otha.name}, {otha.role}</p><blockquote>“{otha.quote}”</blockquote><p>— {otha.name}</p><p className="translation-note">{translationNote}</p>
        </div>
      </section>
      <section className="interior-section shell story-elisha-quote" aria-label={elisha.name}>
        <div className="story-community-photo"><img src="/images/projects/community-cuts/community-cuts-044.jpg" alt="Jóvenes en el evento comunitario de regreso a clases de ASC3ND" loading="lazy" /></div>
        <div className="story-copy">
          <p className="eyebrow">{elisha.name}, {elisha.role}</p><blockquote>“{elisha.quote}”</blockquote><p>— {elisha.name}</p><p className="translation-note">{translationNote}</p>
        </div>
      </section>
      <CollectiveLogo alt="Logotipo de ASC3ND Collective: una corona naranja sobre el nombre ASC3ND en letras blancas de pincel, con el 3 en naranja" />
      <section className="interior-statement shell">
        <p className="eyebrow">{t.nextEyebrow}</p><h2>{t.nextTitle}</h2>
        <div className="interior-pathways">{pathwaysEs.map(({ title, copy }) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <p>Mientras ASC3ND Collective crece, trabajamos para ampliar las iniciativas y alianzas que harán realidad estas áreas de enfoque.</p>
      </section>
      <section className="interior-section shell story-mission-action">
        <p className="eyebrow">Nuestra misión en acción</p><h2>La participación empieza aquí.</h2>
        <div className="story-action-photo"><img src="/images/projects/community-cuts/community-cuts-042.jpg" alt="Una familia en el primer evento comunitario de ASC3ND" loading="lazy" /></div>
        <div className="story-action-links">
          <div><h3>Fresh Fade, Fresh Grade</h3><p>El primer evento comunitario de regreso a clases, en Everett, agosto de 2026.</p><Link href="/es/proyectos/community-cuts">Ver fotos y video →</Link></div>
          <div><h3>Project Joy: Asc3nd the Joy</h3><p>La iniciativa activa de apoyo navideño de ASC3ND en 2026. Consulta al equipo cómo participar.</p><Link href="/es/participar">Pregunta cómo participar →</Link></div>
        </div>
      </section>
    </InteriorPage>
  );
}
