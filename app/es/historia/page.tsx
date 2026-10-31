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
      </section>

      <section className="interior-section shell">
        <DocumentaryFrame label={elisha.name} slot="founder-elisha" />
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">{t.nextEyebrow}</p>
        <h2>{t.nextTitle}</h2>
        <div className="interior-pathways">
          {pathwaysEs.map(({ title, copy, status }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>{status}</small>
            </article>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
