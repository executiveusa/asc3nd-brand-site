"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { counterpart, localeOf, ui } from "@/lib/i18n";
import { ZEFFY_DONATE_URL } from "@/lib/site-content";

type Section = "story" | "events" | "take-part" | "shop" | undefined;

function sectionOf(pathname: string): Section {
  if (/^\/(es\/)?(story|historia)/.test(pathname)) return "story";
  if (/^\/(es\/)?(events|eventos|projects)/.test(pathname)) return "events";
  if (/^\/(es\/)?(take-part|participar|support|apoyo)/.test(pathname)) return "take-part";
  if (/^\/(es\/)?(shop|tienda)/.test(pathname)) return "shop";
  return undefined;
}

export function SiteHeader({ current }: { current?: Section }) {
  const pathname = usePathname() || "/";
  const locale = localeOf(pathname);
  const t = ui[locale];
  const other = counterpart(pathname);
  const active = sectionOf(pathname) ?? current;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="site-logo" href={locale === "es" ? "/es" : "/"} aria-label={t.homeLabel}>
          <BrandLogo />
        </Link>

        <div className="site-header-actions">
          <a className="button button-solid donate-pill" href={ZEFFY_DONATE_URL} target="_blank" rel="noopener noreferrer" aria-label={t.donateLabel}>
            {t.donate} <span className="arrow" aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            className="site-menu-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.close : t.menu}
          </button>
        </div>

        <div id={panelId} className="site-panel" data-open={open ? "true" : "false"}>
          <nav className="site-nav" aria-label={t.primary}>
            {t.nav.map((link) => (
              <Link key={link.key} href={link.href} aria-current={active === link.key ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="locale-switch" role="group" aria-label={t.language}>
            {locale === "en" ? (
              <>
                <span aria-current="true">EN</span>
                <span aria-hidden="true">|</span>
                <Link href={other.href} hrefLang="es-US" lang="es" aria-label="Ver esta página en español">ES</Link>
              </>
            ) : (
              <>
                <Link href={other.href} hrefLang="en-US" lang="en" aria-label="View this page in English">EN</Link>
                <span aria-hidden="true">|</span>
                <span aria-current="true">ES</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

