import Link from "next/link";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SocialLinks } from "@/components/SocialLinks";
import { asc3ndProjects, getApprovedProjectMedia } from "@/lib/projects";
import "./events.css";

export const metadata = {
  title: "Events | ASC3ND",
  description: "A growing archive of ASC3ND events, project records, films, approved photographs, credits, and verified outcomes.",
  alternates: {
    canonical: "https://asc3nd.org/events",
    languages: {
      "en-US": "https://asc3nd.org/events",
      es: "https://asc3nd.org/es/eventos",
    },
  },
};

export default function EventsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <header className="masthead shell">
        <Link className="wordmark" href="/" aria-label="ASC3ND home"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link href="/story">Story</Link>
          <Link href="/events" aria-current="page">Events</Link>
          <Link href="/take-part">Take part</Link>
          <LocaleSwitch enHref="/events" esHref="/es/eventos" />
        </nav>
      </header>

      <section className="events-hero shell">
        <p className="eyebrow">EVENT ARCHIVE</p>
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
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <Link className="event-record-cover" href={`/events/${project.slug}`} aria-label={`Open ${project.title} event record`}>
                {cover?.src ? (
                  <img src={cover.src} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                ) : (
                  <span className="event-record-empty">Approved event media</span>
                )}
              </Link>

              <div className="event-record-copy">
                <p className="eyebrow">{project.eyebrow}</p>
                <h2>{project.title}</h2>
                <p>{project.location} · {project.dateLabel}</p>
                <p className="event-record-summary">{project.summary}</p>
                <div className="event-record-proof">
                  {project.featuredFilm ? <span>Film</span> : null}
                  <span>{media.length} approved photos</span>
                  <span>{project.outcomes.length ? `${project.outcomes.length} verified outcomes` : "Outcomes pending verification"}</span>
                </div>
                <Link className="event-record-link" href={`/events/${project.slug}`}>
                  Open full event gallery <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="footer interior-footer">
        <div className="shell interior-footer-inner">
          <p className="eyebrow"><BrandWordmark /></p>
          <nav aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/story">Story</Link>
            <Link href="/events">Events</Link>
          <Link href="/merch">Merch</Link>
            <Link href="/take-part">Take part</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/youth-safety">Youth safety</Link>
            <a href="mailto:main@asc3nd.org">Contact</a>
          </nav>
          <SocialLinks />
        </div>
      </footer>
    </main>
  );
}
