import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { projectJoy } from "@/lib/initiative-content";
import "@/app/projects/community-cuts/project.css";
import "@/app/project-joy.css";

type Locale = "en" | "es";

/**
 * Campaign facts and assets provided by ASC3ND and published on its official
 * Zeffy Project Joy fundraiser. No unpublished date, drop-off, or outcome claims.
 * A distinct donation destination from ASC3ND's general campaign.
 */
export function ProjectJoyPageContent({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const c = projectJoy[locale];
  const events = es ? "/es/eventos" : "/events";
  const inquiry = "mailto:main@asc3ndcollective.com?subject=ASC3ND%20Project%20Joy%20Inquiry";

  return (
    <main id="main-content" tabIndex={-1} className="project-page project-joy-page" lang={locale}>
      <SiteHeader current="events" />
      <section className="project-hero shell joy-hero" aria-labelledby="joy-title">
        <div className="joy-hero-copy">
          <p className="eyebrow">{c.type}</p>
          <h1 id="joy-title">{projectJoy.title}</h1>
          <p className="project-summary">{c.storyIntro}</p>
          <p className="joy-tagline">{c.tagline}</p>
          <div className="joy-primary-actions">
            <a className="joy-donate-button" href={projectJoy.donationUrl}
              target="_blank" rel="noopener noreferrer">
              {c.donateAction} <span aria-hidden="true">↗</span>
            </a>
            <a className="joy-secondary-link" href="#joy-story">{c.learnAction} <span aria-hidden="true">↓</span></a>
          </div>
          <p className="joy-link-note">{c.checkoutNote}</p>
        </div>
        <div className="joy-brand-art">
          <img src={projectJoy.artworkUrl}
            alt="Official Project Joy Toy Drive artwork from ASC3ND Collective"
            width={1200} height={1200} loading="eager" decoding="async"/>
        </div>
      </section>

      <section id="joy-story" className="project-evidence shell joy-story" aria-labelledby="joy-story-heading">
        <h2 id="joy-story-heading">{c.overviewTitle}</h2>
        <div className="project-evidence-body joy-copy">
          <p>{c.purpose}</p>
          <p>{c.recipientNeeds}</p>
          <p>{c.donationImpact}</p>
          <p className="joy-tagline joy-tagline-small">{c.tagline}</p>
        </div>
      </section>

      <section className="project-next shell joy-support" aria-labelledby="joy-support-heading">
        <p className="eyebrow">{c.supportEyebrow}</p>
        <h2 id="joy-support-heading">{c.involvementTitle}</h2>
        <p className="project-thanks">{c.involvementIntro}</p>
        <div className="joy-support-grid">
          <article>
            <span className="joy-support-number">01</span>
            <h3>{c.fundsTitle}</h3>
            <p>{c.fundsText}</p>
            <a className="joy-support-link" href={projectJoy.donationUrl} target="_blank" rel="noopener noreferrer">
              {c.donateAction} <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article>
            <span className="joy-support-number">02</span>
            <h3>{c.toysTitle}</h3>
            <p>{c.toysText}</p>
            <a className="joy-support-link" href={inquiry}>
              {c.askAboutToys} <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article>
            <span className="joy-support-number">03</span>
            <h3>{c.volunteerTitle}</h3>
            <p>{c.volunteerText}</p>
            <a className="joy-support-link" href={inquiry}>
              {c.askAboutVolunteering} <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>

      <section className="project-evidence shell joy-partners" aria-labelledby="joy-partners-heading">
        <h2 id="joy-partners-heading">{c.partnersTitle}</h2>
        <div className="project-evidence-body joy-copy">
          <p>{c.partnersIntro}</p>
          <ul>
            <li><strong>New Beginnings — Ending Domestic Violence</strong></li>
            <li><strong>Friends of Youth</strong></li>
          </ul>
          <p>{c.partnerContext}</p>
        </div>
      </section>

      <section className="project-next shell joy-final" aria-labelledby="joy-final-heading">
        <h2 id="joy-final-heading">{c.finalTitle}</h2>
        <p className="project-thanks">{c.finalText}</p>
        <div className="joy-primary-actions">
          <a className="joy-donate-button" href={projectJoy.donationUrl} target="_blank" rel="noopener noreferrer">
            {c.donateAction} <span aria-hidden="true">↗</span>
          </a>
          <Link className="joy-secondary-link" href={events}>
            {c.backToEvents} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
