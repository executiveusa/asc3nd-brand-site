import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CrownMark } from "@/components/CrownMark";
import { CommunitySignup } from "@/components/CommunitySignup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EssayGrid, type EssayEntry } from "@/components/EssayGrid";
import { RevealInit } from "@/components/RevealInit";
import { communityCutsProject, getApprovedProjectMedia } from "@/lib/projects";
import { participationRoutes, pathways, siteStory } from "@/lib/site-content";
import "./home.css";
import { pageMetadata } from "@/lib/metadata";

const photo = (n: string) => `/images/projects/community-cuts/community-cuts-${n}.jpg`;

const focusPhotos = [
  { src: photo("043"), alt: "Otha Minnifield, in an ASC3ND shirt, talking with a young person at Community Cuts for Kids" },
  { src: photo("059"), alt: "A volunteer barber in an ASC3ND shirt giving a boy a haircut" },
  { src: photo("040"), alt: "Families and volunteers at the ASC3ND table under the event tent" },
];

const essayPhotos = [
  { src: photo("046"), alt: "ASC3ND volunteers laughing while sorting backpacks in front of a back-to-school sign" },
  { src: photo("010"), alt: "Two volunteers at the ASC3ND sign-in table" },
  { src: photo("042"), alt: "A mother and her sons holding the items they received" },
  { src: photo("081"), alt: "A barber shaping a boy's hair" },
  { src: photo("017"), alt: "A volunteer handing out backpacks under the ASC3ND banner" },
  { src: photo("016"), alt: "Haircuts underway inside the barbershop" },
];

// The silent loop takes the tall right slot (second in the grid); photos keep their order around it.
const essay: EssayEntry[] = [
  { kind: "photo", ...essayPhotos[0] },
  { kind: "loop" },
  ...essayPhotos.slice(1).map((p) => ({ kind: "photo" as const, ...p })),
];

export const metadata = pageMetadata({
  title: "Empower youth. Elevate futures. Build community.",
  description: "ASC3ND helps young people find trusted guidance, practice life skills, and connect with community opportunity.",
  path: "/",
});

export default function Home() {
  const photoCount = getApprovedProjectMedia(communityCutsProject).length;
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <RevealInit />
        <section className="home-hero shell" aria-labelledby="home-title">
          <div className="home-hero-crown" aria-hidden="true"><CrownMark /></div>
          <h1 id="home-title" className="home-hero-logo"><BrandLogo title="ASC3ND" /></h1>
          <p className="home-hero-promise">{siteStory.hero.lines.join(" ")}</p>
          <p className="home-hero-explainer">
            ASC3ND helps young people find trusted guidance, practice life skills, and connect with community opportunity.
          </p>
          <div className="home-hero-actions">
            <Link className="button button-solid" href="/take-part">Take part <span className="arrow" aria-hidden="true">→</span></Link>
            <Link className="button button-line" href="/projects/community-cuts">See Community Cuts <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <figure className="home-hero-media">
          <img data-reveal="" src={photo("060")} style={{ height: "auto" }} alt="Families lining up at the ASC3ND tent, under a banner reading Empower youth, Elevating futures, Build community" width={1600} height={1067} fetchPriority="high" />
          <figcaption className="shell home-proof">The first event: Community Cuts for Kids, Everett, Washington, August 2026. {photoCount} photographs in the public record.</figcaption>
        </figure>

        <section className="home-founders shell" id="story" aria-labelledby="founders-title">
          <h2 id="founders-title" className="home-section-title">Started by Otha and Elisha Minnifield.</h2>
          <div className="home-founders-grid">
            {siteStory.founders.map((founder, i) => (
              <figure className="home-founder" key={founder.name}>
                <img data-reveal="" src={i === 0 ? "/media/founders/otha.webp" : "/media/founders/elisha.webp"} alt={`${founder.name}, founder of the ASC3ND Collective`} loading="lazy" />
                <blockquote>
                  <p>“{founder.quote}”</p>
                </blockquote>
                <figcaption>{founder.name}, {founder.role.toLowerCase()}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="home-focus" aria-labelledby="focus-title">
          <div className="shell home-focus-head">
            <h2 id="focus-title" className="home-section-title">What ASC3ND is building.</h2>
            <p>Three areas guide the work. Each one is still in development.</p>
          </div>
          {pathways.map((area, i) => (
            <article className={`home-focus-row shell ${i % 2 ? "is-reversed" : ""}`} key={area.title}>
              <img data-reveal="" src={focusPhotos[i].src} alt={focusPhotos[i].alt} loading="lazy" />
              <div className="home-focus-copy">
                <h3>{area.title}</h3>
                <p>{area.copy}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="home-essay" aria-labelledby="essay-title">
          <div className="shell home-essay-head">
            <h2 id="essay-title" className="home-section-title">{communityCutsProject.title}.</h2>
            <p>
              {communityCutsProject.location}, {communityCutsProject.dateLabel}. Haircuts and school supplies for kids heading back to school.
            </p>
            <Link className="text-link" href="/projects/community-cuts">See all {photoCount} photos and the film <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
          <EssayGrid entries={essay} />
        </section>

        <section className="home-join shell" id="take-part" aria-labelledby="join-title">
          <h2 id="join-title" className="home-section-title">Find your way in.</h2>
          <div className="home-join-list">
            {participationRoutes.map((route) => (
              <Link className="home-join-row" href={route.href} key={route.href}>
                <span className="home-join-label">{route.label}</span>
                <span className="home-join-detail">{route.detail}</span>
                <span className="home-join-action">{route.action} <span className="arrow" aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <CommunitySignup />
      </main>
      <SiteFooter />
    </>
  );
}
