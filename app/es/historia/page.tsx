import { CollectiveLogo } from "@/components/CollectiveLogo";
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
  const [otha, elisha] = founderQuotesEs;

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

      <section className="interior-section shell">
        <DocumentaryFrame label={elisha.name} slot="founder-elisha" />
      </section>

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
      <section className="interior-section shell" aria-labelledby="mission-in-action">
        <h2 id="mission-in-action">Nuestra misión en acción</h2>
        <p>Fresh Fade, Fresh Grade reunió a nuestra comunidad en Everett, Washington, en agosto de 2026 para apoyar a jóvenes y familias durante el regreso a clases.</p>
        <p>Project Joy: Asc3nd the Joy es otra iniciativa de ASC3ND. Los detalles de la campaña y las formas de participar se publicarán cuando estén confirmados.</p>
      </section>

    </InteriorPage>
  );
}
