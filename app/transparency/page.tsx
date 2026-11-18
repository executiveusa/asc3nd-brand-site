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
    </section>
    <section className="transparency-section shell" aria-labelledby="identity-title">
      <div className="transparency-intro"><p className="eyebrow">Organization</p><h2 id="identity-title">Who we are,<br />on record.</h2></div>
      <div className="transparency-details"><dl>{facts.map(([label, value]) => <div className="transparency-fact" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="transparency-source">Source: Washington Corporations and Charities Filing System record supplied by the organization. <a href="https://ccfs.sos.wa.gov/" target="_blank" rel="noreferrer">Search Washington public records ↗</a></p></div>
    </section>
    <section className="transparency-section shell" aria-labelledby="tax-title">
      <div className="transparency-intro"><p className="eyebrow" id="tax-title">Tax and registration</p></div>
      <div className="transparency-details"><div className="transparency-status"><h3>Federal EIN</h3><p>42-3010954 — reported by an independent nonprofit directory using IRS-derived records.</p></div><div className="transparency-status"><h3>Federal tax-exempt status</h3><p>The same independent directory lists The Asc3nd Collective as a 501(c)(3) public charity (509(a)(2)), with an effective date in June 2026 and eligibility for tax-deductible contributions.</p></div><div className="transparency-status"><h3>Washington charitable registration</h3><p>Not yet independently confirmed for publication. Charitable-solicitation registration is separate from Washington nonprofit incorporation.</p></div><p className="transparency-source">Sources: <a href="https://philanthropy.org/990/report/423010954/the-asc3nd-collective" target="_blank" rel="noopener noreferrer">ASC3ND nonprofit profile (independent IRS-derived listing) ↗</a> · <a href="https://www.irs.gov/charities-non-profits/tax-exempt-organization-search" target="_blank" rel="noopener noreferrer">IRS Tax Exempt Organization Search (search EIN 42-3010954) ↗</a> · <a href="https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf" target="_blank" rel="noopener noreferrer">IRS exempt organization master file ↗</a> · <a href="https://ccfs.sos.wa.gov/" target="_blank" rel="noopener noreferrer">Washington corporations and charities records ↗</a>.</p></div>
    </section>
    <section className="transparency-section shell" aria-labelledby="giving-title">
      <div className="transparency-intro"><p className="eyebrow">Giving</p><h2 id="giving-title">Giving,<br />with clarity.</h2></div>
      <div className="transparency-details"><p>An independent nonprofit directory reports that The Asc3nd Collective is eligible to receive tax-deductible contributions. Before giving, confirm the legal recipient, the charity’s current IRS eligibility and any tax-deductibility information directly with the organization or through the IRS. We will update this page as the primary IRS and Washington charitable-registration records and donation checkout are verified.</p><p>Our nonprofit corporate status alone is not a representation that a contribution is tax-deductible.</p><a className="transparency-cta" href="/take-part">Explore ways to get involved <span aria-hidden="true">↗</span></a></div>
    </section>
    <SiteFooter />
  </main>;
}
