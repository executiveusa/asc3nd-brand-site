import Link from "next/link";
import { InteriorPage } from "@/components/InteriorPage";
import { ASC3ND_DONATION_URL } from "@/lib/donation-config";
import type { SupportCopy } from "@/lib/support-shop.en";
import "@/app/home.css";
import "@/app/support-shop.css";

export function SupportView({ copy }: { copy: SupportCopy }) {
  const { rows, trust } = copy;
  return (
    <InteriorPage eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro}>
      <section className="interior-section shell" aria-label={copy.eyebrow}>
        <div className="ss-list">
          <div className="ss-row">
            <h2 className="ss-label">{rows.donate.label}</h2>
            <p className="ss-detail">{ASC3ND_DONATION_URL ? rows.donate.detail : copy.eyebrow === "Apoyo"
              ? "Estamos confirmando el enlace oficial de donaciones de ASC3ND. No enviamos a visitantes a una página genérica."
              : "We are confirming ASC3ND's official donation campaign link. We will not redirect you to a generic platform."}</p>
            {ASC3ND_DONATION_URL ? (
              <a className="ss-action" href={ASC3ND_DONATION_URL} target="_blank" rel="noopener noreferrer">
                {rows.donate.action} <span className="arrow" aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link className="ss-action" href={copy.eyebrow === "Apoyo" ? "/es/participar" : "/take-part"}>
                {copy.eyebrow === "Apoyo" ? "Otras formas de apoyar" : "Other ways to help"} <span className="arrow" aria-hidden="true">→</span>
              </Link>
            )>
          </div>
          <div className="ss-row">
            <h2 className="ss-label">{rows.volunteer.label}</h2>
            <p className="ss-detail">{rows.volunteer.detail}</p>
            <Link className="ss-action" href={rows.volunteer.href}>
              {rows.volunteer.action} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="ss-row">
            <h2 className="ss-label">{rows.partner.label}</h2>
            <p className="ss-detail">{rows.partner.detail}</p>
            <Link className="ss-action" href={rows.partner.href}>
              {rows.partner.action} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="ss-row">
            <h2 className="ss-label">{rows.supplies.label}</h2>
            <p className="ss-detail">{rows.supplies.detail}</p>
            <a className="ss-action" href="mailto:main@asc3nd.org">{rows.supplies.action}</a>
          </div>
        </div>
      </section>

      <section className="interior-statement shell ss-trust" aria-labelledby="ss-trust-title">
        <p className="eyebrow">{trust.eyebrow}</p>
        <h2 id="ss-trust-title">{trust.title}</h2>
        <p>{trust.body}</p>
        <p><Link className="text-link" href={trust.href}>{trust.link} <span className="arrow" aria-hidden="true">→</span></Link></p>
      </section>
    </InteriorPage>
  );
}
