import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CrownMark } from "@/components/CrownMark";
import { CommunitySignup } from "@/components/CommunitySignup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { EssayGrid, type EssayEntry } from "@/components/EssayGrid";
import { RevealInit } from "@/components/RevealInit";
import { ui } from "@/lib/i18n";
import { communityCutsProject, getApprovedProjectMedia } from "@/lib/projects";
import {
  esDateLabel,
  esLocation,
  esProjectName,
  founderQuotesEs,
  homeEs as t,
  participationRoutesEs,
  pathwaysEs,
  translationNote,
} from "@/lib/site-content.es";
import "../home.css";
import { pageMetadata } from "@/lib/metadata";

const photo = (n: string) => `/images/projects/community-cuts/community-cuts-${n}.jpg`;

const focusPhotos = [photo("043"), photo("059"), photo("040")];

// Same order as the English page: the silent loop takes the tall right slot (second in the grid).
// essayAlts keeps the original photo order: 046, 081, 010, 042, 017, 016.
const essayPhotos = [
  { src: photo("046"), alt: t.essayAlts[0] },
  { src: photo("010"), alt: t.essayAlts[2] },
  { src: photo("042"), alt: t.essayAlts[3] },
  { src: photo("081"), alt: t.essayAlts[1] },
  { src: photo("017"), alt: t.essayAlts[4] },
  { src: photo("016"), alt: t.essayAlts[5] },
];
const essay: EssayEntry[] = [
  { kind: "photo", ...essayPhotos[0] },
  { kind: "loop" },
  ...essayPhotos.slice(1).map((p) => ({ kind: "photo" as const, ...p })),
];

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/es",
});

export default function HomeEs() {
  const photoCount = getApprovedProjectMedia(communityCutsProject).length;
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <RevealInit />
        <section className="home-hero shell" aria-labelledby="home-title">
          <div className="home-hero-crown" aria-hidden="true"><CrownMark /></div>
          <h1 id="home-title" className="home-hero-logo"><BrandLogo title="ASC3ND" /></h1>
          <p className="home-hero-promise">{ui.es.promise.join(" ")}</p>
          <p className="home-hero-explainer">{t.explainer}</p>
          <div className="home-hero-actions">
            <Link className="button button-solid" href="/es/participar">{t.ctaPrimary} <span className="arrow" aria-hidden="true">→</span></Link>
            <Link className="button button-line" href="/es/proyectos/community-cuts">{t.ctaSecondary} <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </section>

        <figure className="home-hero-media">
          <img data-reveal="" src={photo("060")} srcSet={`${photo("060").replace(".jpg", "-640.webp")} 640w, ${photo("060").replace(".jpg", "-1024.webp")} 1024w, ${photo("060").replace(".jpg", "-1600.webp")} 1600w`} sizes="100vw" style={{ height: "auto" }} alt={t.heroAlt} width={1600} height={1067} fetchPriority="high" />
          <figcaption className="shell home-proof">{t.proof(photoCount)}</figcaption>
        </figure>

        <section className="home-founders shell" id="historia" aria-labelledby="founders-title">
          <h2 id="founders-title" className="home-section-title">{t.foundersTitle}</h2>
          <div className="home-founders-grid">
            {founderQuotesEs.map((founder, i) => (
              <figure className="home-founder" key={founder.name}>
                <img data-reveal="" src={i === 0 ? "/media/founders/otha.webp" : "/media/founders/elisha.webp"} alt={t.founderAlt(founder.name, founder.role)} loading="lazy" />
                <blockquote>
                  <p>“{founder.quote}”</p>
                </blockquote>
                <figcaption>{founder.name}, {founder.role}</figcaption>
              </figure>
            ))}
          </div>
          <p className="translation-note">{translationNote}</p>
        </section>

        <section className="home-focus" aria-labelledby="focus-title">
          <div className="shell home-focus-head">
            <h2 id="focus-title" className="home-section-title">{t.focusTitle}</h2>
            <p>{t.focusIntro}</p>
          </div>
          {pathwaysEs.map((area, i) => (
            <article className={`home-focus-row shell ${i % 2 ? "is-reversed" : ""}`} key={area.title}>
              <img data-reveal="" src={focusPhotos[i]} alt={t.focusPhotoAlts[i]} loading="lazy" />
              <div className="home-focus-copy">
                <h3>{area.title}</h3>
                <p>{area.copy}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="home-essay" aria-labelledby="essay-title">
          <div className="shell home-essay-head">
            <h2 id="essay-title" className="home-section-title">{esProjectName}.</h2>
            <p>{esLocation}, {esDateLabel}. {t.essayIntro}</p>
            <Link className="text-link" href="/es/proyectos/community-cuts">{t.essayLink(photoCount)} <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
          <EssayGrid entries={essay} locale="es" />
        </section>

        <section className="home-join shell" id="participar" aria-labelledby="join-title">
          <h2 id="join-title" className="home-section-title">{t.joinTitle}</h2>
          <div className="home-join-list">
            {participationRoutesEs.map((route) => (
              <Link className="home-join-row" href={route.href} key={route.href}>
                <span className="home-join-label">{route.label}</span>
                <span className="home-join-detail">{route.detail}</span>
                <span className="home-join-action">{route.action} <span className="arrow" aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <CommunitySignup locale="es" />
      </main>
      <SiteFooter />
    </>
  );
}
