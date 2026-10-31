import { InteriorPage } from "@/components/InteriorPage";
import { privacyEs as t } from "@/lib/site-content.es";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es/privacidad",
});

export default function PrivacidadPage() {
  return (
    <InteriorPage eyebrow={t.eyebrow} title={t.title} intro={t.intro}>
      {t.sections.map((s) => (
        <section className="interior-statement shell" key={s.eyebrow}>
          <p className="eyebrow">{s.eyebrow}</p>
          <h2>{s.title}</h2>
          <p>{s.body}</p>
        </section>
      ))}

      <section className="interior-statement shell">
        <p className="eyebrow">{t.questions.eyebrow}</p>
        <h2>{t.questions.title}</h2>
        <p>{t.questions.before}<a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a>{t.questions.after}</p>
      </section>
    </InteriorPage>
  );
}
