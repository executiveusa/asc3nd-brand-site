import { BrandWordmark } from "@/components/BrandWordmark";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { SocialLinks } from "@/components/SocialLinks";
import "../../transparency/transparency.css";

export const metadata = {
  title: "Confianza y transparencia | THE ASC3ND COLLECTIVE",
  description: "Identidad corporativa de Washington y estado actual de la información pública fiscal y de registro caritativo de ASC3ND.",
  alternates: { canonical: "https://asc3nd.org/es/transparencia", languages: { "en-US": "https://asc3nd.org/transparency", "es": "https://asc3nd.org/es/transparencia" } },
};

const facts = [
  ["Nombre legal", "THE ASC3ND COLLECTIVE"],
  ["UBI de Washington", "606 247 629"],
  ["Tipo de entidad", "Corporación sin fines de lucro de Washington"],
  ["Estado comercial", "Activa, según el registro de Washington proporcionado"],
  ["Fecha de formación", "18 de junio de 2026"],
  ["Jurisdicción", "Washington, Estados Unidos"],
  ["Naturaleza del negocio", "Caritativa"],
  ["Oficina principal", "Everett, Washington"],
  ["Agente registrado", "Otha Minnifield Jr."],
] as const;

export default function TransparenciaPage() {
  return <main id="main-content" tabIndex={-1} lang="es">
    <header className="masthead shell">
      <a className="wordmark" href="/es" aria-label="Inicio de ASC3ND"><BrandWordmark /></a>
      <nav className="nav" aria-label="Navegación principal">
        <a href="/es">Inicio</a><a href="/es/eventos">Eventos</a><a href="/es/participar">Participar</a>
        <LocaleSwitch locale="es" enHref="/transparency" esHref="/es/transparencia" />
      </nav>
    </header>

    <section className="transparency-hero shell" aria-labelledby="transparency-es-title">
      <p className="eyebrow">THE ASC3ND COLLECTIVE / REGISTRO PÚBLICO</p>
      <h1 id="transparency-es-title">Confianza y<br />transparencia.</h1>
      <p>Nuestra identidad legal, registros públicos y la información que podemos confirmar. Ninguna afirmación más allá de la evidencia.</p>
    </section>

    <section className="transparency-section shell" aria-labelledby="identity-es-title">
      <div className="transparency-intro"><p className="eyebrow">01 / ORGANIZACIÓN</p><h2 id="identity-es-title">Quiénes somos,<br />según el registro.</h2></div>
      <div className="transparency-details">
        <dl>{facts.map(([label,value]) => <div className="transparency-fact" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="transparency-source">Fuente: registro del Washington Corporations and Charities Filing System proporcionado por la organización. <a href="https://ccfs.sos.wa.gov/" target="_blank" rel="noreferrer">Consultar registros públicos de Washington ↗</a></p>
      </div>
    </section>

    <section className="transparency-section shell" aria-labelledby="tax-es-title">
      <div className="transparency-intro"><p className="eyebrow">02 / IMPUESTOS Y REGISTRO</p><h2 id="tax-es-title">Lo que está<br />confirmado.</h2></div>
      <div className="transparency-details">
        <div className="transparency-status"><h3>EIN federal</h3><p>Aún no confirmado para publicación.</p></div>
        <div className="transparency-status"><h3>Estado federal de exención fiscal</h3><p>Aún no confirmado para publicación. La incorporación en Washington no establece por sí sola reconocimiento federal 501(c)(3).</p></div>
        <div className="transparency-status"><h3>Registro caritativo de Washington</h3><p>Aún no confirmado para publicación. El registro para solicitar contribuciones caritativas es independiente del registro corporativo.</p></div>
        <p className="transparency-source">Estas entradas describen la información disponible para este sitio. No afirman que se haya presentado o no una solicitud. <a href="https://www.irs.gov/charities-non-profits/tax-exempt-organization-search" target="_blank" rel="noreferrer">Búsqueda de organizaciones exentas del IRS ↗</a></p>
      </div>
    </section>

    <section className="transparency-section shell" aria-labelledby="giving-es-title">
      <div className="transparency-intro"><p className="eyebrow">03 / APORTACIONES</p><h2 id="giving-es-title">Aportar,<br />con claridad.</h2></div>
      <div className="transparency-details">
        <p>Antes de realizar una aportación, confirma directamente con la organización el destinatario legal y cualquier información sobre deducibilidad fiscal. Publicaremos aquí la información federal fiscal y de registro caritativo de Washington cuando esté verificada.</p>
        <p>El estado corporativo sin fines de lucro por sí solo no representa que una aportación sea deducible de impuestos.</p>
        <a className="transparency-cta" href="/es/participar">Explora formas de participar <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <footer className="footer interior-footer"><div className="shell transparency-footer"><p>THE ASC3ND COLLECTIVE · Washington UBI 606 247 629</p><nav aria-label="Navegación del pie"><a href="/es">Inicio</a><a href="/es/eventos">Eventos</a><a href="/es/participar">Participar</a><a href="mailto:main@asc3nd.org">Contacto</a></nav><SocialLinks /></div></footer>
  </main>;
}
