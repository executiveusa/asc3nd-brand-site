import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandWordmark } from "@/components/BrandWordmark";
import { EventCredits } from "@/components/EventCredits";
import { ProjectFilm } from "@/components/ProjectFilm";
import { ProjectProofGallery } from "@/components/ProjectProofGallery";
import { asc3ndProjects, getApprovedProjectMedia, getProjectBySlug } from "@/lib/projects";
import "../../projects/community-cuts/project.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return asc3ndProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} | ASC3ND`,
    description: `ASC3ND event record for ${project.title} in ${project.location}.`,
  };
}

export default async function EventRecordPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const media = getApprovedProjectMedia(project);

  return (
    <main id="main-content" tabIndex={-1} className="project-page">
      <header className="masthead shell">
        <Link className="wordmark" href="/" aria-label="ASC3ND home"><BrandWordmark /></Link>
        <nav className="nav" aria-label="Event navigation">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/take-part">Take part</Link>
        </nav>
      </header>

      <section className="project-hero shell">
        <p className="eyebrow">{project.eyebrow}</p>
        <h1>{project.title}</h1>
        <div className="project-meta">
          <p>{project.location}</p>
          <p>{project.dateLabel}</p>
        </div>
        <p className="project-summary">{project.summary}</p>
      </section>

      {project.featuredFilm ? (
        <section className="project-film-section shell" aria-labelledby="project-film-title">
          <div className="project-film-copy">
            <p className="eyebrow">THE FILM</p>
            <h2 id="project-film-title">{project.title}.</h2>
            <p>Watch the full event film.</p>
          </div>
          <ProjectFilm film={project.featuredFilm} />
        </section>
      ) : null}

      <section className="project-proof shell" aria-labelledby="project-proof-title">
        <div className="project-proof-heading">
          <p className="eyebrow">PROJECT PROOF</p>
          <h2 id="project-proof-title">{project.title}, photographed.</h2>
          <p>{media.length ? `${media.length} approved event photographs.` : "Approved event photographs will appear here."}</p>
        </div>
        <ProjectProofGallery
          items={project.media}
          initialVisible={18}
          emptyLabel={`${project.title.toUpperCase()} — APPROVED PHOTOS / VIDEO`}
        />
      </section>

      <section className="project-evidence shell">
        <div><p className="eyebrow">OUTCOMES</p><h2>What ASC3ND can verify.</h2></div>
        <div className="project-evidence-body">
          {project.outcomes.length ? (
            <ul>{project.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          ) : (
            <p>Outcome totals will be published here after they are verified.</p>
          )}
        </div>
      </section>

      {project.credits ? (
        <section className="project-next shell">
          <p className="eyebrow">WITH GRATITUDE</p>
          <h2>Thank you to everyone who made {project.title} possible.</h2>
          <p className="project-thanks">{project.credits.intro}</p>
          <div className="project-next-actions">
            <EventCredits
              eventLabel={`${project.title} · ${project.location} · ${project.dateLabel}`}
              groups={project.credits.groups}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
