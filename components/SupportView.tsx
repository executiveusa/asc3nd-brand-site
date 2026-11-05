import Link from "next/link";
import { InteriorPage } from "@/components/InteriorPage";
import { ZEFFY_DONATE_URL } from "@/lib/site-content";
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
            <p className="ss-detail">{rows.donate.detail}</p>
            <a className="ss-action" href={ZEFFY_DONATE_URL} target="_blank" rel="noopener noreferrer">
              {rows.donate.action} <span className="arrow" aria-hidden="true">↗</span>
            </a>
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
