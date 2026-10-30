import { BrandWordmark } from "@/components/BrandWordmark";
import { CrownMark } from "@/components/CrownMark";
import { CommunitySignup } from "@/components/CommunitySignup";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { HeroWordmark } from "@/components/HeroWordmark";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { MotionReveal } from "@/components/MotionReveal";
import { RecentWorkVideoCard } from "@/components/RecentWorkVideoCard";
import { SocialLinks } from "@/components/SocialLinks";
import { communityCutsProject, getApprovedProjectMedia } from "@/lib/projects";
import { communityCutsEs, siteStoryEs } from "@/lib/site-content.es";
import "../community-proof.css";

export const metadata = {
  title: "ASC3ND | Español",
  description: "ASC3ND ayuda a jóvenes a encontrar orientación confiable, practicar habilidades para la vida y conectarse con oportunidades en su comunidad.",
  alternates: {
    canonical: "https://asc3nd.org/es",
    languages: { "en-US": "https://asc3nd.org/", "es": "https://asc3nd.org/es" },
  },
};

export default function SpanishHome() {
  const poster = getApprovedProjectMedia(communityCutsProject)[0]?.src;

  return (
    <main id="main-content" tabIndex={-1} lang="es">
      <header className="masthead shell">
        <a className="wordmark" href="/es" aria-label="Inicio de ASC3ND"><BrandWordmark /></a>
        <nav className="nav home-nav" aria-label="Navegación principal">
          <a href="#historia">Fundadores</a>
          <a href="/es/eventos">Trabajo</a>
          <a href="#participar">Participar</a>
          <a href="/es/merch">Merch</a>
          <LocaleSwitch locale="es" enHref="/" esHref="/es" />
        </nav>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-mark"><CrownMark /></div>
        <h1><HeroWordmark /></h1>
        <div className="hero-statements" aria-label="Misión de ASC3ND">
          {siteStoryEs.hero.lines.map((line) => <p key={line} className="hero-statement-line">{line}</p>)}
        </div>
        <p className="hero-explainer">{siteStoryEs.hero.explainer}</p>
        <div className="hero-actions" aria-label="Comienza aquí">
          <a className="hero-action hero-action-primary" href="#participar">Participar <span aria-hidden="true">→</span></a>
          <a className="hero-action" href="/es/eventos">Ver nuestro trabajo <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <MotionReveal>
        <section className="founders shell" id="historia" aria-labelledby="founders-es-title">
          <p className="eyebrow" id="founders-es-title">FUNDADORES</p>
          <div className="founder-grid">
            {siteStoryEs.founders.map((founder) => (
              <article className="founder-profile" key={founder.name}>
                <DocumentaryFrame label={founder.name} slot={founder.mediaSlot} className="portrait-placeholder" />
                <div className="founder-copy">
                  <p className="eyebrow">{founder.name} · {founder.role}</p>
                  <blockquote>“{founder.quote}”<cite className="founder-attribution">— {founder.name}</cite></blockquote>
                  <p className="translation-note">{founder.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="focus-areas shell" id="como" aria-labelledby="focus-es-title">
          <div className="focus-heading">
            <p className="eyebrow">CÓMO AYUDA ASC3ND</p>
            <h2 id="focus-es-title">Tres áreas que la organización está desarrollando alrededor de jóvenes.</h2>
          </div>
          <div className="focus-list">
            {siteStoryEs.pathways.map(({ index, title, copy, status }) => (
              <article className="focus-item" key={index}>
                <span className="focus-index">{index}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
                <small>{status}</small>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="community-proof shell" id="comunidad" aria-labelledby="community-es-title">
          <div className="section-heading">
            <p className="eyebrow">TRABAJO RECIENTE · PROYECTO 001</p>
            <h2 id="community-es-title">Community Cuts for Kids.</h2>
            <div className="community-project-meta">
              <p>{communityCutsProject.location} · {communityCutsProject.dateLabel}</p>
              <p className="community-project-summary">{communityCutsEs.summary}</p>
              <a href="/es/eventos/community-cuts">Abrir registro del evento <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          {communityCutsProject.featuredFilm ? (
            <RecentWorkVideoCard
              src={communityCutsProject.featuredFilm.embedSrc}
              poster={poster}
              href="/es/eventos/community-cuts"
              label="Community Cuts for Kids"
              overlayLabel="Ver el trabajo"
            />
          ) : null}
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="take-part shell" id="participar" aria-labelledby="take-part-es-title">
          <p className="eyebrow">PARTICIPA</p>
          <h2 id="take-part-es-title">Elige cómo quieres conectarte.</h2>
          <div className="choices">
            {siteStoryEs.participation.map(({ index, label, action, href }) => (
              <a href={href} key={index}><span>{index}</span><strong>{label}</strong><em>{action}</em></a>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal><CommunitySignup locale="es" /></MotionReveal>

      <footer className="footer">
        <div className="shell footer-inner">
          <div><p className="eyebrow"><BrandWordmark text="ASC3ND.ORG" /></p><h2>{siteStoryEs.footer.map((line) => <span key={line}>{line}<br /></span>)}</h2></div>
          <div className="footer-meta">
            <nav className="footer-links" aria-label="Navegación del pie de página">
              <a href="#historia"><span>Fundadores</span><span aria-hidden="true">↗</span></a>
              <a href="/es/eventos"><span>Trabajo</span><span aria-hidden="true">↗</span></a>
              <a href="#participar"><span>Participar</span><span aria-hidden="true">↗</span></a>
              <a href="/es/merch"><span>Merch</span><span aria-hidden="true">↗</span></a>
            </nav>
            <div><SocialLinks /><p><a href="/es/transparencia">Transparencia</a> · <a href="/es/privacidad">Privacidad</a> · <a href="/es/seguridad-juvenil">Seguridad juvenil</a> · <a href="mailto:main@asc3nd.org">Contacto</a></p></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
