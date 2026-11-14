import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SocialLinks } from "@/components/SocialLinks";
import { asc3ndProjects, getApprovedProjectMedia } from "@/lib/projects";
import "./events.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Events",
  description: "ASC3ND community initiatives, including Fresh Fade, Fresh Grade and Project Joy, with real event photography.",
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

      <section className="events-current shell" aria-labelledby="current-initiatives-heading">
        <p className="eyebrow">Current &amp; Upcoming Initiatives</p>
        <h2 id="current-initiatives-heading">Project Joy: Asc3nd the Joy</h2>
        <p>ASC3ND Collective's active 2026 holiday giving initiative. Contact the team to learn about current participation and donation options.</p>
        <div className="events-current-actions"><Link href="/take-part">Get involved →</Link><Link href="/support">Support the mission →</Link></div>
      </section>
      <section className="events-list shell" aria-label="Past Events and Community Impact">
        <h2 className="events-section-heading">Past Events &amp; Community Impact</h2>
        {asc3ndProjects.map((project, index) => {
          const media = getApprovedProjectMedia(project);
          const cover = media[0];

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
                <h2>{project.title}</h2>
                <p>{project.location}, {project.dateLabel}</p>
                <p className="event-record-summary">{project.summary}</p>
                <div className="event-record-proof">
                  {project.featuredFilm ? <Link href={"/projects/" + project.slug + "#project-film-title"}>Watch Highlights</Link> : null}
                  <Link href={"/projects/" + project.slug + "#project-proof-title"}>View Gallery ({media.length})</Link>
                  <Link href="/credits">Community Partners</Link>
                </div>
                <Link className="event-record-link" href={`/projects/${project.slug}`}>
                  Open the full event <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>


      <SiteFooter />
    </main>
  );
}
