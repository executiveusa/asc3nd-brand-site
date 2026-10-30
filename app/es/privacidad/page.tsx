import { InteriorPage } from "@/components/InteriorPage";

export const metadata = {
  title: "Privacidad | ASC3ND",
  description: "Cómo maneja ASC3ND la información enviada a través de su sitio web.",
  alternates: { canonical: "https://asc3nd.org/es/privacidad", languages: { "en-US": "https://asc3nd.org/privacy", "es": "https://asc3nd.org/es/privacidad" } },
};

export default function PrivacidadPage() {
  return <InteriorPage
    eyebrow="Privacidad"
    title="Qué recopila ASC3ND y por qué."
    intro="ASC3ND recopila únicamente la información que las personas deciden enviar a través de este sitio para poder responder, dar seguimiento y enviar novedades cuando existe permiso."
    locale="es" enHref="/privacy" esHref="/es/privacidad"
  >
    <section className="interior-statement shell"><p className="eyebrow">LO QUE RECOPILAMOS</p><h2>Información que tú decides enviarnos.</h2><p>Dependiendo del formulario, puede incluir nombre, correo electrónico, teléfono opcional, organización, metas de participación, disponibilidad, solicitudes de apoyo familiar, respuestas abiertas, idioma preferido y decisiones de consentimiento.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">POR QUÉ LA USAMOS</p><h2>Para responder y canalizar tu solicitud.</h2><p>Las solicitudes de participación se usan para dirigir el seguimiento a la cola adecuada del equipo de ASC3ND. Las novedades por correo electrónico se envían únicamente cuando aceptas recibirlas por separado.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">GUARDADO EN ESTE DISPOSITIVO</p><h2>Los borradores pueden permanecer en tu navegador.</h2><p>Algunos formularios guardan un borrador sin enviar en el almacenamiento local de tu navegador para que puedas recuperar tus respuestas en el mismo dispositivo. ASC3ND no recibe ese borrador hasta que lo envías.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">RETENCIÓN</p><h2>Aún no se publica un periodo fijo de retención.</h2><p>ASC3ND no ha publicado un calendario fijo de retención de datos del sitio. Esta página se actualizará cuando la organización adopte un periodo formal.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">PREGUNTAS</p><h2>Contacta directamente a ASC3ND.</h2><p>Para preguntas sobre información enviada a través del sitio, escribe a <a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a>.</p></section>
  </InteriorPage>;
}
