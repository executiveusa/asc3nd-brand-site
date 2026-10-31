import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { EventCredits } from "@/components/EventCredits";
import { ProjectFilm } from "@/components/ProjectFilm";
import { ProjectProofGallery } from "@/components/ProjectProofGallery";
import { communityCutsProject, getApprovedProjectMedia } from "@/lib/projects";
import "./project.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Community Cuts for Kids",
  description: "Community Cuts for Kids in Everett, Washington, August 2026: the event film, 86 approved photographs, and credits.",
  path: "/projects/community-cuts",
});

export default function CommunityCutsPage() {
  const media = getApprovedProjectMedia(communityCutsProject);

  return (
    <main id="main-content" tabIndex={-1} className="project-page">
      <SiteHeader current="events" />

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
            <p className="eyebrow">The film</p>
            <h2 id="project-film-title">Community Cuts for Kids, Everett.</h2>
            <p>Watch the full event film.</p>
          </div>
          <ProjectFilm film={communityCutsProject.featuredFilm} />
        </section>
      ) : null}

      <section className="project-proof shell" aria-labelledby="project-proof-title">
        <div className="project-proof-heading">
          <p className="eyebrow">Photographs</p>
          <h2 id="project-proof-title">Community Cuts, photographed.</h2>
          <p>{media.length ? `${media.length} approved event photographs.` : "Approved event photographs will appear here."}</p>
        </div>
        <ProjectProofGallery
          items={communityCutsProject.media}
          initialVisible={12}
          emptyLabel="COMMUNITY CUTS — APPROVED PHOTOS / VIDEO"
        />
      </section>

      <section className="project-evidence shell">
        <div><p className="eyebrow">Outcomes</p><h2>What ASC3ND can verify.</h2></div>
        <div className="project-evidence-body">
          {communityCutsProject.outcomes.length ? (
            <ul>{communityCutsProject.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          ) : (
            <p>Outcome totals will be published here after they are verified.</p>
          )}
        </div>
      </section>

      <section className="project-next shell">
        <p className="eyebrow">With gratitude</p>
        <h2>Thank you to everyone who made Community Cuts possible.</h2>
        {communityCutsProject.credits ? (
          <>
            <p className="project-thanks">{communityCutsProject.credits.intro}</p>
            <div className="project-next-actions">
              <EventCredits
                eventLabel={`${communityCutsProject.title} · ${communityCutsProject.location} · ${communityCutsProject.dateLabel}`}
                groups={communityCutsProject.credits.groups}
              />
            </div>
          </>
        ) : null}
      </section>
    <SiteFooter />
    </main>
  );
}
