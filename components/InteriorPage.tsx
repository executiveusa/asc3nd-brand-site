import type { ReactNode } from "react";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SocialLinks } from "@/components/SocialLinks";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  locale?: "en" | "es";
  enHref?: string;
  esHref?: string;
};

export function InteriorPage({ eyebrow, title, intro, children, locale = "en", enHref = "/", esHref = "/es" }: InteriorPageProps) {
  return (
    <main id="main-content" tabIndex={-1} lang={locale}>
      <header className="masthead shell">
        <a className="wordmark" href={locale === "es" ? "/es" : "/"} aria-label={locale === "es" ? "Inicio de ASC3ND" : "ASC3ND home"}><BrandWordmark /></a>
        <nav className="nav" aria-label="Primary navigation">
          <a href={locale === "es" ? "/es/eventos" : "/events"}>{locale === "es" ? "Eventos" : "Events"}</a>
          <a href={locale === "es" ? "/es" : "/story"}>{locale === "es" ? "Historia" : "Story"}</a>
          <a href={locale === "es" ? "/es/participar" : "/take-part"}>{locale === "es" ? "Participar" : "Take part"}</a>
          <LocaleSwitch locale={locale} enHref={enHref} esHref={esHref} />
        </nav>
      </header>

      <section className="interior-hero shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>

      {children}

      <footer className="footer interior-footer">
        <div className="shell interior-footer-inner">
          <p className="eyebrow"><BrandWordmark /></p>
          <nav aria-label="Footer navigation">
            <a href={locale === "es" ? "/es" : "/"}>{locale === "es" ? "Inicio" : "Home"}</a>
            <a href={locale === "es" ? "/es/eventos" : "/events"}>{locale === "es" ? "Eventos" : "Events"}</a>
            <a href={locale === "es" ? "/es" : "/story"}>{locale === "es" ? "Historia" : "Story"}</a>
            <a href={locale === "es" ? "/es/participar" : "/take-part"}>{locale === "es" ? "Participar" : "Take part"}</a>
            <a href={locale === "es" ? "/es/privacidad" : "/privacy"}>{locale === "es" ? "Privacidad" : "Privacy"}</a>
            <a href={locale === "es" ? "/es/seguridad-juvenil" : "/youth-safety"}>{locale === "es" ? "Seguridad juvenil" : "Youth safety"}</a>
            <a href="mailto:main@asc3nd.org">{locale === "es" ? "Contacto" : "Contact"}</a>
          </nav>
          <SocialLinks />
        </div>
      </footer>
    </main>
  );
}
