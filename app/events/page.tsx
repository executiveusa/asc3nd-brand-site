import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SocialLinks } from "@/components/SocialLinks";
import { asc3ndProjects, getApprovedProjectMedia } from "@/lib/projects";
import "./events.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { projectJoy } from "@/lib/initiative-content";
import { CommunityPartnersSummary } from "@/components/CommunityPartnersSummary";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Events",
  description: "Discover ASC3ND Collective's community initiatives, past events, and opportunities to get involved.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="events" />

      <section className="events-hero shell">
        <p className="eyebrow">Our Impact in Action</p>
        <h1>Where Purpose Meets Action.</h1>
        <p>From community outreach and youth-focused initiatives to meaningful partnerships, every Asc3nd Collective event is an opportunity to give back, build connections, and make a difference.</p>
      </section>

      <section className="events-next shell" aria-labelledby="current-initiatives-title">
        <h2 id="current-initiatives-title">Current &amp; Upcoming Initiatives</h2>
        <article className="event-record event-record--upcoming" aria-labelledby="project-joy-title">
          <div className="event-record-cover initiative-event-media" aria-hidden="true"><span>PROJECT JOY</span></div>
          <div className="event-record-copy">
            <p className="eyebrow">{projectJoy.en.type}</p>
            <h3 id="project-joy-title">{projectJoy.title}</h3>
            <p>{projectJoy.en.awaiting}</p>
            <Link className="event-record-link" href="/projects/project-joy">{projectJoy.en.linkLabel} <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </article>
      </section>
      <section className="shell" aria-labelledby="past-impact-title">
        <h2 id="past-impact-title">Past Events &amp; Community Impact</h2>
      </section>

      <section className="events-list shell" aria-label="ASC3ND community events and impact">
        {asc3ndProjects.map((project, index) => {
          const media = getApprovedProjectMedia(project);
          const cover = media[0];
          const href = `/projects/${project.slug}`;

          return (
            <article className="event-record" key={project.slug}>
              <div className="event-record-index">
                
              </div>

              <Link className="event-record-cover" href={`/projects/${project.slug}`} aria-label={`Open ${project.title} event record`}>
                {cover?.src ? (
                  <img src={cover.src} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                ) : (
                  <span className="event-record-empty">Approved event media</span>
                )}
              </Link>

              <div className="event-record-copy">
                <p className="eyebrow">{project.eyebrow}</p>
                <h2>{project.title} — Back-to-School Community Event</h2>
                <p>{project.location}, {project.dateLabel}</p>
                <p className="event-record-summary">{project.summary}</p>
                <div className="event-record-proof">
                  {project.featuredFilm ? <Link href={`${href}#project-film-title`}>Watch Highlights</Link> : null}
                  <Link href={`${href}#project-proof-title`}>View Gallery ({media.length} photos)</Link>
                  <Link href={`${href}#${project.outcomes.length ? "project-evidence-title" : "project-partners-title"}`}>{project.outcomes.length ? `${project.outcomes.length} verified outcomes` : "Community Partners"}</Link>
                </div>
                <Link className="event-record-link" href={`/projects/${project.slug}`}>
                  Explore the event <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>



      <CommunityPartnersSummary />
      <SiteFooter />
    </main>
  );
}
