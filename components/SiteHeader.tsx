"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { clientLogoEnabled } from "@/components/ClientBrandLockup";
import { ThemeToggle } from "@/components/ThemeToggle";
import { counterpart, localeOf, ui } from "@/lib/i18n";
import { navFor } from "@/lib/nav";
import { ASC3ND_DONATION_URL } from "@/lib/donation-config";

/** Disable without reverting via NEXT_PUBLIC_ASC3ND_INTERIOR_HEADER_LOGO=off. */
const interiorClientWordmarkEnabled =
  clientLogoEnabled && process.env.NEXT_PUBLIC_ASC3ND_INTERIOR_HEADER_LOGO !== "off";
type Section = "story" | "events" | "take-part" | "shop" | undefined;

function sectionOf(pathname: string): Section {
  if (/^\/(es\/)?(story|historia)/.test(pathname)) return "story";
  if (/^\/(es\/)?(events|eventos|projects|proyectos)/.test(pathname)) return "events";
  if (/^\/(es\/)?(take-part|participar)/.test(pathname)) return "take-part";
  if (/^\/(es\/)?(shop|tienda)/.test(pathname)) return "shop";
  return undefined;
}

export function SiteHeader({ current }: { current?: Section }) {
  const pathname = usePathname() || "/";
  const locale = localeOf(pathname);
  const t = ui[locale];
  const other = counterpart(pathname);
  const active = sectionOf(pathname) ?? current;
  const hideHomeWordmark = clientLogoEnabled && (pathname === "/" || pathname === "/es");
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const donateHref = ASC3ND_DONATION_URL ?? (locale === "es" ? "/es/apoyo" : "/support");

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const donateLabel = t.donate;
  const donate = ASC3ND_DONATION_URL ? (
    <a className="button button-solid donate-pill" href={donateHref} target="_blank" rel="noopener noreferrer"
       aria-label={t.donateLabel}>{donateLabel} <span aria-hidden="true">↗</span></a>
  ) : (
    <Link className="button button-solid donate-pill" href={donateHref} onClick={() => setOpen(false)}>
      {donateLabel}
    </Link>
  );

  return (
    <header className={interiorClientWordmarkEnabled && !hideHomeWordmark
      ? "site-header site-header--dark-logo" : "site-header"}>
      <div className="shell site-header-inner">
        {!hideHomeWordmark ? (
          <Link className="site-logo" href={locale === "es" ? "/es" : "/"} aria-label={t.homeLabel}>
            {interiorClientWordmarkEnabled ? (
              <Image src="/brand/asc3nd-collective-logo.webp" width={1380} height={735}
                className="site-header-client-logo" alt="" priority />
            ) : <BrandLogo />}
          </Link>
        ) : null}

        <div id={panelId} className="site-panel" data-open={open ? "true" : "false"}>
          <nav className="site-nav" aria-label={t.primary}>
            {navFor(locale).map((link) =>
              link.external ? (
                <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label} <span className="arrow" aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link key={link.key} href={link.href} onClick={() => setOpen(false)}
                  aria-current={active === link.key ? "page" : undefined}>{link.label}</Link>
              )
            )}
          </nav>
          <div className="site-mobile-donate">{donate}</div>
        </div>

        <div className="site-header-actions">
          <div className="locale-switch" role="group" aria-label={t.language}>
            {locale === "en" ? (
              <>
                <span aria-current="true" lang="en">EN</span>
                <Link href={other.href} hrefLang="es-US" lang="es" aria-label="Ver esta página en español">ES</Link>
              </>
            ) : (
              <>
                <Link href={other.href} hrefLang="en-US" lang="en" aria-label="View this page in English">EN</Link>
                <span aria-current="true" lang="es">ES</span>
              </>
            )}
          </div>
          <ThemeToggle locale={locale} />
          <div className="site-desktop-donate">{donate}</div>
          <button type="button" className="site-menu-toggle"
            aria-label={open ? t.close : t.menu} aria-expanded={open} aria-controls={panelId}
            onClick={() => setOpen(value => !value)}>
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
