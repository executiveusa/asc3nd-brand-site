import { InteriorPage } from "@/components/InteriorPage";
import { siteStoryEs } from "@/lib/site-content.es";

export const metadata = {
  title: "Participa | ASC3ND",
  description: "Formas de conectarte con ASC3ND como familia, mentor, voluntario o aliado comunitario.",
  alternates: { canonical: "https://asc3nd.org/es/participar", languages: { "en-US": "https://asc3nd.org/take-part", "es": "https://asc3nd.org/es/participar" } },
};

export default function ParticiparPage() {
  return (
    <InteriorPage
      eyebrow="Participa"
      title="¿Quieres formar parte de lo que viene?"
      intro="ASC3ND sigue desarrollando sus programas permanentes. Por ahora, la forma más sencilla de comenzar es una conversación directa. Elige la ruta que mejor se adapte a ti."
      locale="es"
      enHref="/take-part"
      esHref="/es/participar"
    >
      <section className="interior-section shell">
        <div className="choices">
          {siteStoryEs.participation.map(({ index, label, action, href }) => (
            <a href={href} key={index}><span>{index}</span><strong>{label}</strong><em>{action}</em></a>
          ))}
        </div>
      </section>
      <section className="interior-statement shell">
        <p className="eyebrow">CONTACTO DIRECTO</p>
        <h2>Empieza con una conversación.</h2>
        <p><a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a></p>
      </section>
    </InteriorPage>
  );
}
