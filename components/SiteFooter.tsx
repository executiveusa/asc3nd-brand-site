"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { CrownMark } from "@/components/CrownMark";
import { ClientBrandLockup, clientLogoEnabled } from "@/components/ClientBrandLockup";
import { SocialLinks } from "@/components/SocialLinks";
import { localeOf, ui } from "@/lib/i18n";
import { ASC3ND_DONATION_URL } from "@/lib/donation-config";
import { shopLink } from "@/lib/nav";

export function SiteFooter() {
  const locale = localeOf(usePathname() || "/");
  const t = ui[locale];
  const shop = shopLink(locale);
  const href = {
    story: locale === "es" ? "/es/historia" : "/story",
    events: locale === "es" ? "/es/eventos" : "/events",
    credits: locale === "es" ? "/es/creditos" : "/credits",
    takePart: locale === "es" ? "/es/participar" : "/take-part",
    volunteer: locale === "es" ? "/es/participar/mentores-voluntariado" : "/take-part/mentor-volunteer",
    partner: locale === "es" ? "/es/participar/aliados" : "/take-part/partner",
    support: locale === "es" ? "/es/apoyo" : "/support",
    transparency: locale === "es" ? "/es/transparencia" : "/transparency",
    privacy: locale === "es" ? "/es/privacidad" : "/privacy",
    youthSafety: locale === "es" ? "/es/seguridad-juvenil" : "/youth-safety",
  };

  return (
    <footer className="site-footer" lang={locale}>
      <div className="shell site-footer-inner">
        <div className="site-footer-lead">
          <p className="site-footer-promise">{t.promise[0]}<br />{t.promise[1]}<br />{t.promise[2]}</p>
          <a className="site-footer-mail" href="mailto:main@asc3ndcollective.com?subject=ASC3ND%20Website%20Inquiry" aria-label="Email ASC3ND Collective">main@asc3ndcollective.com</a>
          <a className="site-footer-support-cta" href={ASC3ND_DONATION_URL ?? (locale === "es" ? "/es/apoyo" : "/support")} target="_blank" rel="noopener noreferrer" aria-label={ASC3ND_DONATION_URL ? (locale === "es" ? "Donar a ASC3ND" : "Donate to ASC3ND") : (locale === "es" ? "Visitar Zeffy; donaciones a ASC3ND aún no disponibles" : "Visit Zeffy; ASC3ND donations not yet available")}>
            {ASC3ND_DONATION_URL ? (locale === "es" ? "Apoya nuestra misión" : "Support Our Mission") : (locale === "es" ? "Donar" : "Donate")} <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <nav className="site-footer-columns" aria-label={t.footerNav}>
          <div>
            <h2>{t.columns.asc3nd}</h2>
            <Link href={href.story}>{t.links.story}</Link>
            <Link href={href.events}>{t.links.events}</Link>
            <Link href={href.credits}>{t.links.credits}</Link>
            <Link href={href.takePart}>{t.links.takePart}</Link>
            <Link href={href.volunteer}>{locale === "es" ? "Voluntariado y mentoría" : "Volunteer & Mentor"}</Link>
            <Link href={href.partner}>{locale === "es" ? "Alianzas y patrocinio" : "Partner & Sponsor"}</Link>
            <Link href={href.support}>{t.links.support}</Link>
            {shop ? (
              shop.external ? (
                <a href={shop.href} target="_blank" rel="noopener noreferrer">{t.links.shop} <span className="arrow" aria-hidden="true">↗</span></a>
              ) : (
                <Link href={shop.href}>{t.links.shop}</Link>
              )
            ) : null}
          </div>
          <div>
            <h2>{t.columns.trust}</h2>
            <Link href={href.transparency}>{t.links.transparency}</Link>
            <Link href={href.privacy}>{t.links.privacy}</Link>
            <Link href={href.youthSafety}>{t.links.youthSafety}</Link>
          </div>
          <div>
            <h2>{t.columns.follow}</h2>
            <SocialLinks />
          </div>
        </nav>

        <div className="site-footer-sign">
          {clientLogoEnabled ? (
            <ClientBrandLockup className="site-footer-client-logo" />
          ) : (
            <>
              <div className="site-footer-mark" aria-hidden="true"><CrownMark /></div>
              <BrandLogo className="site-footer-logo" title="ASC3ND" />
            </>
          )}
        </div>

        <div className="site-footer-legal">
          <p>The ASC3ND Collective</p>
          <p>{t.legal}</p>
          <Link href={href.transparency}>{t.record} <span className="arrow" aria-hidden="true">→</span></Link>
        </div>
      </div>
    </footer>
  );
}
