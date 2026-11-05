import type { Metadata } from "next";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LegalIdentity } from "@/components/LegalIdentity";
import { SocialLinks } from "@/components/SocialLinks";
import "./transparency.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Trust and transparency",
  description: "Washington corporate identity and the current status of ASC3ND's public tax and charitable-registration information.",
  path: "/transparency",
});

const facts = [
  ["Legal name", "THE ASC3ND COLLECTIVE"],
  ["Washington UBI", "606 247 629"],
  ["Entity type", "Washington nonprofit corporation"],
  ["Business status", "Active, according to the supplied Washington filing"],
  ["Formation date", "June 18, 2026"],
  ["Jurisdiction", "Washington, United States"],
  ["Nature of business", "Charitable"],
  ["Principal office", "Everett, Washington"],
  ["Registered agent", "Otha Minnifield Jr."],
] as const;

export default function TransparencyPage() {
  return <main id="main-content" tabIndex={-1}>
    <SiteHeader />
    <section className="transparency-hero shell" aria-labelledby="transparency-title">
      <p className="eyebrow">The ASC3ND Collective, public record</p>
      <h1 id="transparency-title">Trust &amp;<br />Transparency.</h1>
      <p>Our legal identity, public records, and the information we can confirm. No claims beyond the evidence.</p>
    </section>
    <section className="transparency-section shell" aria-labelledby="identity-title">
      <div className="transparency-intro"><p className="eyebrow">Organization</p><h2 id="identity-title">Who we are,<br />on record.</h2></div>
      <div className="transparency-details"><dl>{facts.map(([label, value]) => <div className="transparency-fact" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="transparency-source">Source: Washington Corporations and Charities Filing System record supplied by the organization. <a href="https://ccfs.sos.wa.gov/" target="_blank" rel="noreferrer">Search Washington public records ↗</a></p></div>
    </section>
    <section className="transparency-section shell" aria-labelledby="tax-title">
      <div className="transparency-intro"><p className="eyebrow">Tax and registration</p><h2 id="tax-title">What is<br />confirmed.</h2></div>
      <div className="transparency-details"><div className="transparency-status"><h3>Federal EIN</h3><p>Not yet confirmed for publication.</p></div><div className="transparency-status"><h3>Federal tax-exempt status</h3><p>Not yet confirmed for publication. Washington incorporation does not establish federal 501(c)(3) recognition.</p></div><div className="transparency-status"><h3>Washington charitable registration</h3><p>Not yet confirmed for publication. Charitable-solicitation registration is separate from corporate registration.</p></div><p className="transparency-source">These entries describe the information available for this website. They do not assert that an application has or has not been filed. <a href="https://www.irs.gov/charities-non-profits/tax-exempt-organization-search" target="_blank" rel="noreferrer">IRS tax-exempt organization search ↗</a></p></div>
    </section>
    <section className="transparency-section shell" aria-labelledby="giving-title">
      <div className="transparency-intro"><p className="eyebrow">Giving</p><h2 id="giving-title">Giving,<br />with clarity.</h2></div>
      <div className="transparency-details"><p>Before making a contribution, please confirm the legal recipient and any tax-deductibility information directly with the organization. We will publish verified federal tax and Washington charitable-registration information here when available.</p><p>Our nonprofit corporate status alone is not a representation that a contribution is tax-deductible.</p><a className="transparency-cta" href="/take-part">Explore ways to take part <span aria-hidden="true">↗</span></a></div>
    </section>
    <SiteFooter />
  </main>;
}
