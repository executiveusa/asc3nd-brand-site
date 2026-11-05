import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { getApprovedMedia } from "@/lib/media-registry";
import { pageMetadata } from "@/lib/metadata";
import "../../home.css";

export const metadata = pageMetadata({
  title: "Participa",
  description: "Elige cómo acercarte a ASC3ND: como familia, como mentor o voluntario, o como aliado de la comunidad.",
  path: "/es/participar",
});

const routes = [
  {
    label: "Familias",
    action: "Mantente al tanto",
    detail: "Entérate de los programas y eventos para tu joven.",
    href: "/es/participar/familia",
  },
  {
    label: "Mentores y voluntarios",
    action: "Participa",
    detail: "Regala tu tiempo, tus habilidades o un oído atento a jóvenes de tu comunidad.",
    href: "/es/participar/mentores-voluntariado",
  },
  {
    label: "Aliados de la comunidad",
    action: "Habla con ASC3ND",
    detail: "Aporta un espacio, servicios o apoyo para un evento o programa.",
    href: "/es/participar/aliados",
  },
] as const;

export default function ParticiparPage() {
  return (
    <InteriorPage
      eyebrow="Participa"
      title="¿Quieres ser parte de lo que viene?"
      intro="ASC3ND todavía está armando sus programas permanentes. Por ahora, la forma más fácil de acercarte es conversar directamente con nosotros. Elige el camino que mejor te quede."
    >
      {getApprovedMedia("take-part") ? (
        <section className="interior-section shell">
          <DocumentaryFrame
            label="Las familias, los mentores, los voluntarios y los aliados de la comunidad son bienvenidos aquí."
            slot="take-part"
          />
        </section>
      ) : null}

      <section className="interior-section shell">
        <div className="home-join-list">
          {routes.map((route) => (
            <a className="home-join-row" href={route.href} key={route.href}>
              <span className="home-join-label">{route.label}</span>
              <span className="home-join-detail">{route.detail}</span>
              <span className="home-join-action">{route.action} <span className="arrow" aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Contacto directo</p>
        <h2>Empieza con una conversación.</h2>
        <p><a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a></p>
      </section>
    </InteriorPage>
  );
}
