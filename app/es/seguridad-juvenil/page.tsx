import { InteriorPage } from "@/components/InteriorPage";

export const metadata = {
  title: "Seguridad juvenil | ASC3ND",
  description: "Límites públicos de seguridad del sitio de ASC3ND para jóvenes, familias, voluntariado, mentores y aliados.",
  alternates: { canonical: "https://asc3nd.org/es/seguridad-juvenil", languages: { "en-US": "https://asc3nd.org/youth-safety", "es": "https://asc3nd.org/es/seguridad-juvenil" } },
};

export default function SeguridadJuvenilPage() {
  return <InteriorPage
    eyebrow="Seguridad juvenil"
    title="Límites claros para una organización que sirve a jóvenes."
    intro="El sitio público de ASC3ND está diseñado para conectar familias, voluntariado, mentores y aliados comunitarios con la organización sin crear canales privados de mensajería directa entre jóvenes y adultos."
    locale="es" enHref="/youth-safety" esHref="/es/seguridad-juvenil"
  >
    <section className="interior-statement shell"><p className="eyebrow">CONTACTO EN EL SITIO</p><h2>Los formularios públicos canalizan el seguimiento de ASC3ND.</h2><p>Los formularios están dirigidos a familias, mentores y voluntariado, y aliados comunitarios. No son servicios de emergencia ni un sistema de chat privado entre menores y adultos individuales.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">INFORMACIÓN SENSIBLE</p><h2>Comparte únicamente lo necesario para la solicitud.</h2><p>No uses los formularios públicos para enviar información de emergencia, contraseñas, datos de cuentas financieras, expedientes médicos u otra información altamente sensible salvo que ASC3ND te haya proporcionado un proceso seguro específico.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">FOTOS + HISTORIAS</p><h2>El material público debe estar aprobado antes de publicarse.</h2><p>El sistema de medios de proyectos de ASC3ND está diseñado para publicar únicamente material aprobado cuando el estado de consentimiento correspondiente esté confirmado.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">SALVAGUARDAS FORMALES</p><h2>La guía del sitio no sustituye una política organizacional de protección.</h2><p>Esta página describe los límites del sitio público. ASC3ND debe mantener y aprobar por separado sus procedimientos operativos de protección juvenil para programas, voluntariado, mentoría, eventos y personal.</p></section>
    <section className="interior-statement shell"><p className="eyebrow">PREGUNTAS O INQUIETUDES</p><h2>Contacta a ASC3ND.</h2><p>Escribe a <a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a> para una pregunta sobre seguridad del sitio, inquietud sobre medios o solicitud de seguimiento.</p></section>
  </InteriorPage>;
}
