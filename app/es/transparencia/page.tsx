import type { Metadata } from "next";
import Link from "next/link";
import { transparencyEs as t } from "@/lib/site-content.es";
import "../../transparency/transparency.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es/transparencia",
});

export default function TransparenciaPage() {
  return <main id="main-content" tabIndex={-1}>
    <SiteHeader />
    <section className="transparency-hero shell" aria-labelledby="transparency-title">
      <p className="eyebrow">{t.heroEyebrow}</p>
      <h1 id="transparency-title">Confianza y<br />transparencia.</h1>
      <p>{t.heroIntro}</p>
    </section>
    <section className="transparency-section shell" aria-labelledby="identity-title">
      <div className="transparency-intro"><p className="eyebrow">{t.org.eyebrow}</p><h2 id="identity-title">Quiénes somos,<br />según el registro.</h2></div>
      <div className="transparency-details"><dl>{t.facts.map(([label, value]) => <div className="transparency-fact" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="transparency-source">{t.org.source}<a href="https://ccfs.sos.wa.gov/" target="_blank" rel="noreferrer">{t.org.link} <span aria-hidden="true">↗</span></a></p></div>
    </section>
    <section className="transparency-section shell" aria-labelledby="tax-title">
      <div className="transparency-intro"><p className="eyebrow">{t.tax.eyebrow}</p><h2 id="tax-title">Lo que está<br />confirmado.</h2></div>
      <div className="transparency-details">{t.tax.statuses.map(([label, text]) => <div className="transparency-status" key={label}><h3>{label}</h3><p>{text}</p></div>)}<p className="transparency-source">{t.tax.source}<a href="https://www.irs.gov/charities-non-profits/tax-exempt-organization-search" target="_blank" rel="noreferrer">{t.tax.link} <span aria-hidden="true">↗</span></a></p></div>
    </section>
    <section className="transparency-section shell" aria-labelledby="giving-title">
      <div className="transparency-intro"><p className="eyebrow">{t.giving.eyebrow}</p><h2 id="giving-title">Donar,<br />con claridad.</h2></div>
      <div className="transparency-details"><p>{t.giving.p1}</p><p>{t.giving.p2}</p><Link className="transparency-cta" href="/es/participar">{t.giving.cta} <span aria-hidden="true">→</span></Link></div>
    </section>
    <SiteFooter />
  </main>;
}
