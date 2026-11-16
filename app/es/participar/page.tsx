import { ContactForm } from "@/components/ContactForm";
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
    label: "Familias y jóvenes",
    action: "Mantente al tanto",
    detail: "Entérate de los programas y eventos para tu joven.",
    href: "/es/participar/familia",
  },
  {
    label: "Voluntarios y mentores",
    action: "Participa",
    detail: "Regala tu tiempo, tus habilidades o un oído atento a jóvenes de tu comunidad.",
    href: "/es/participar/mentores-voluntariado",
  },
  {
    label: "Aliados comunitarios y patrocinadores",
    action: "Habla con ASC3ND",
    detail: "Aporta un espacio, servicios o apoyo para un evento o programa.",
    href: "/es/participar/aliados",
  },
  {
    label: "Apoya nuestra misión",
    action: "Formas de apoyar",
    detail: "Conoce las opciones para contribuir y ayudar a crecer a ASC3ND.",
    href: "/es/apoyo",
  },
] as const;

export default function ParticiparPage() {
  return (
    <InteriorPage
      eyebrow="Participa"
      title="Sé parte de algo más grande."
      supporting="Cada acto de bondad, cada conexión y cada contribución tienen el poder de marcar la diferencia. Ya seas parte de una familia, voluntario o aliado comunitario, hay un lugar para ti en Asc3nd Collective."
      intro="En Asc3nd Collective creemos que el cambio significativo ocurre cuando las personas se unen con un propósito común. Ya sea que busques oportunidades para tu familia, quieras ofrecer tu tiempo y talento como voluntario o representes a una organización interesada en colaborar, te invitamos a formar parte de nuestro colectivo en crecimiento. Juntos podemos crear experiencias significativas, fortalecer los vínculos comunitarios y ayudar a la próxima generación a prosperar."
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
