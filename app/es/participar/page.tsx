import { ContactForm } from "@/components/ContactForm";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { getApprovedMedia } from "@/lib/media-registry";
import { pageMetadata } from "@/lib/metadata";
import { participationRoutesEs } from "@/lib/site-content.es";
import "../../home.css";

export const metadata = pageMetadata({
  title: "Participa",
  description: "Elige cómo acercarte a ASC3ND: como familia, como mentor o voluntario, o como aliado de la comunidad.",
  path: "/es/participar",
});

const routes = participationRoutesEs;

export default function ParticiparPage() {
  return (
    <InteriorPage
      eyebrow="Participa"
      title="Forma parte de algo más grande."
      intro="En ASC3ND Collective creemos que el cambio significativo ocurre cuando las personas se reúnen con un propósito común. Si quieres conocer oportunidades para tu familia, ofrecer tiempo como voluntario o colaborar como organización, hay un lugar para ti en nuestra comunidad."
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

      <ContactForm locale="es" />
    </InteriorPage>
  );
}
