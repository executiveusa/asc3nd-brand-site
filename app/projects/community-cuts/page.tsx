import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { EventCredits } from "@/components/EventCredits";
import { ProjectFilm } from "@/components/ProjectFilm";
import { ProjectProofGallery } from "@/components/ProjectProofGallery";
import { communityCutsProject, getApprovedProjectMedia } from "@/lib/projects";
import "./project.css";

export const metadata = {
  title: "Community Cuts for Kids | ASC3ND",
  description: "ASC3ND project proof for Community Cuts for Kids in Everett, Washington.",
};

export default function CommunityCutsPage() {
  const media = getApprovedProjectMedia(communityCutsProject);

  return (
    <main id="main-content" className="project-page">
      <header className="masthead shell">
        <Link className="wordmark" href="/" aria-label="ASC3ND home"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Project navigation">
          <Link href="/">Home</Link>
          <Link href="/#community">Community</Link>
          <Link href="/take-part">Take part</Link>
        </nav>
      </header>

      <section className="project-hero shell">
        <p className="eyebrow">{communityCutsProject.eyebrow}</p>
        <h1>{communityCutsProject.title}</h1>
        <div className="project-meta">
          <p>{communityCutsProject.location}</p>
          <p>{communityCutsProject.dateLabel}</p>
        </div>
        <p className="project-summary">{communityCutsProject.summary}</p>
      </section>

      {communityCutsProject.featuredFilm ? (
        <section className="project-film-section shell" aria-labelledby="project-film-title">
          <div className="project-film-copy">
            <p className="eyebrow">THE FILM</p>
            <h2 id="project-film-title">Community, in motion.</h2>
            <p>Watch the full Community Cuts film from Everett.</p>
          </div>
          <ProjectFilm film={communityCutsProject.featuredFilm} />
        </section>
      ) : null}

      <section className="project-proof shell" aria-labelledby="project-proof-title">
        <div className="project-proof-heading">
          <p className="eyebrow">PROJECT PROOF</p>
          <h2 id="project-proof-title">The work, documented.</h2>
          <p>{media.length ? `${media.length} approved media items.` : "Approved event media will appear here."}</p>
        </div>
        <ProjectProofGallery items={communityCutsProject.media} emptyLabel="COMMUNITY CUTS — APPROVED PHOTOS / VIDEO" />
      </section>

      <section className="project-evidence shell">
        <div><p className="eyebrow">OUTCOMES</p><h2>Verified outcomes.</h2></div>
        <div className="project-evidence-body">
          {communityCutsProject.outcomes.length ? (
            <ul>{communityCutsProject.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          ) : (
            <p>Verified project outcomes will be added when approved.</p>
          )}
        </div>
      </section>

      <section className="project-next shell">
        <p className="eyebrow">WITH GRATITUDE</p>
        <h2>Thank you to everyone who made Community Cuts possible.</h2>
        {communityCutsProject.credits ? (
          <>
            <p className="project-thanks">{communityCutsProject.credits.intro}</p>
            <div className="project-next-actions">
              <EventCredits
                eventLabel={`${communityCutsProject.title} · ${communityCutsProject.location} · ${communityCutsProject.dateLabel}`}
                groups={communityCutsProject.credits.groups}
              />
              <Link href="/take-part">Take part <span aria-hidden="true">↗</span></Link>
            </div>
          </>
        ) : (
          <Link href="/take-part">Take part <span aria-hidden="true">↗</span></Link>
        )}
      </section>
    </main>
  );
}
