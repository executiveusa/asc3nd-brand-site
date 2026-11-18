import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";
import { projectJoy } from "@/lib/initiative-content";
import "../community-cuts/project.css";
import "../../initiative-placeholder.css";

export const metadata = {
  ...pageMetadata({
  title: projectJoy.title,
  description: "ASC3ND's 2026 holiday giving initiative. Founder-approved campaign details will be added when confirmed.",
  path: "/projects/project-joy",
  }),
  robots: { index: false, follow: true },
};

export default function ProjectJoyPage() {
  const c = projectJoy.en;
  return (
    <main id="main-content" tabIndex={-1} className="project-page">
      <SiteHeader current="events" />
      <section className="project-hero shell">
        <p className="eyebrow">{c.type}</p>
        <h1>{projectJoy.title}</h1>
        <p className="project-summary">{c.storyIntro}</p>
      </section>
      <section className="project-evidence shell" aria-labelledby="joy-story-heading">
        <h2 id="joy-story-heading">{c.overviewTitle}</h2>
        <div className="project-evidence-body"><div className="initiative-pending-slot" data-pending="story"><p>{c.overviewPending}</p></div></div>
      </section>
      <section className="project-proof shell" aria-labelledby="joy-media-heading">
        <div className="project-proof-heading">
          <p className="eyebrow">{projectJoy.title}</p>
          <h2 id="joy-media-heading">{c.mediaTitle}</h2>
          <p>{c.mediaBody}</p>
        </div>
        <div className="initiative-media-stage" role="img" aria-label="Placeholder for approved Project Joy photographs and video"><span>{projectJoy.title}</span><small>{c.mediaPending}</small></div>
      </section>
      <section className="project-evidence shell" aria-labelledby="joy-outcomes-heading"><h2 id="joy-outcomes-heading">Community impact</h2><div className="initiative-pending-slot" data-pending="outcomes"><p>Event results and community impact will be documented here after verification and founder approval.</p></div></section>
      <section className="project-next shell" aria-labelledby="joy-next-heading">
        <p className="eyebrow">{projectJoy.title}</p>
        <h2 id="joy-next-heading">{c.involvementTitle}</h2>
        <div className="initiative-pending-slot" data-pending="participation"><p className="project-thanks">{c.involvementBody}</p></div>
        <div className="project-next-actions">
          <Link href="/events">Back to Events <span className="arrow" aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="project-next shell" aria-labelledby="joy-partners-heading"><h2 id="joy-partners-heading">Community Partners</h2><div className="initiative-pending-slot" data-pending="partners"><p>Approved partners, sponsors, and contributor credits will appear here after permission to publish.</p></div></section>
      <SiteFooter />
    </main>
  );
}
