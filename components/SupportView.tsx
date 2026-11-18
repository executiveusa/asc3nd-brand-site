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
              ? "Las donaciones en línea estarán disponibles cuando se confirme el enlace oficial de ASC3ND. Mientras tanto, puedes comunicarte directamente con el equipo."
              : "Online donations will be available once ASC3ND's official giving link is confirmed. In the meantime, contact the team directly."}</p>
            {ASC3ND_DONATION_URL ? (
              <a className="ss-action" href={ASC3ND_DONATION_URL} target="_blank" rel="noopener noreferrer">
                {rows.donate.action} <span className="arrow" aria-hidden="true">↗</span>
              </a>
            ) : (
              <a className="ss-action" href="mailto:main@asc3nd.org?subject=ASC3ND%20Giving%20Inquiry">
                {copy.eyebrow === "Apoyo" ? "Consultar cómo donar" : "Ask about giving"} <span className="arrow" aria-hidden="true">→</span>
              </a>
            )}
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
        <p><Link className="text-link" href={copy.eyebrow === "Apoyo" ? "/es/participar" : "/take-part"}>{copy.eyebrow === "Apoyo" ? "Participa: voluntariado, mentoría y alianzas" : "Get Involved: volunteer, mentor, or partner"} <span className="arrow" aria-hidden="true">→</span></Link></p>
      </section>
    </InteriorPage>
  );
}
