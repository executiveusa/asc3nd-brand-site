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
  description: "A growing archive of ASC3ND events, project records, films, approved photographs, credits, and verified outcomes.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="events" />

      <section className="events-hero shell">
        <p className="eyebrow">Event archive</p>
        <h1>One record for every ASC3ND event.</h1>
        <p>
          Each event keeps its own film, approved photographs, credits, and verified outcomes here.
          The homepage stays focused on ASC3ND as a whole.
        </p>
      </section>

      <section className="events-list shell" aria-label="ASC3ND event archive">
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
                  {project.featuredFilm ? <span>Film</span> : null}
                  <span>{media.length} approved photos</span>
                  <span>{project.outcomes.length ? `${project.outcomes.length} verified outcomes` : "Outcomes pending verification"}</span>
                </div>
                <Link className="event-record-link" href={`/projects/${project.slug}`}>
                  Open the full event <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="events-next shell">
        <p className="eyebrow">Next event</p>
        <h2>The next confirmed ASC3ND event will be added here.</h2>
      </section>

      <SiteFooter />
    </main>
  );
}
