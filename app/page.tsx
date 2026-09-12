import { BrandWordmark } from "@/components/BrandWordmark";
import { CrownMark } from "@/components/CrownMark";
import { LegalIdentity } from "@/components/LegalIdentity";
import { CommunitySignup } from "@/components/CommunitySignup";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { MotionReveal } from "@/components/MotionReveal";
import { ProjectProofGallery } from "@/components/ProjectProofGallery";
import { SocialLinks } from "@/components/SocialLinks";
import { communityCutsProject } from "@/lib/projects";
import { participationRoutes, siteStory } from "@/lib/site-content";
import "./community-proof.css";

export default function Home() {
  return (
    <main id="main-content">
      <header className="masthead shell">
        <a className="wordmark" href="#top" aria-label="ASC3ND home"><BrandWordmark /></a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#story">Founders</a>
          <a href="#community">Community</a>
          <a href="#take-part">Take part</a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-mark"><CrownMark /></div>
        <h1><BrandWordmark text={siteStory.hero.headline} /></h1>
        <div
          className="hero-statements"
          aria-label="ASC3ND mission statements"
        >
          {siteStory.hero.lines.map((line) => (
            <p key={line} className="hero-statement-line">
              {line}
            </p>
          ))}
        </div>
        <p className="hero-explainer">ASC3ND helps young people find trusted guidance, practice life skills, and connect with community opportunity.</p>
        <div className="hero-actions" aria-label="Start here">
          <a className="hero-action hero-action-primary" href="#take-part">Take part <span aria-hidden="true">→</span></a>
          <a className="hero-action" href="#community">See the work <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <MotionReveal>
        <section className="founders shell" id="story" aria-labelledby="founders-title">
          <p className="eyebrow" id="founders-title">FOUNDERS</p>
          <div className="founder-grid">
            {siteStory.founders.map((founder) => (
              <article className="founder-profile" key={founder.name}>
                <DocumentaryFrame
                  label={`PORTRAIT PLACEHOLDER — ${founder.name}`}
                  slot={founder.mediaSlot}
                  className="portrait-placeholder"
                />
                <div className="founder-copy">
                  <p className="eyebrow">{founder.name} · {founder.role}</p>
                  <blockquote>
                    “{founder.quote}”
                    <cite className="founder-attribution">— {founder.name}</cite>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="community-proof shell" id="community" aria-labelledby="community-title">
          <div className="section-heading">
            <p className="eyebrow">COMMUNITY CUTS FOR KIDS · PROJECT 001</p>
            <h2 id="community-title">Community Cuts.</h2>
            <div className="community-project-meta">
              <p>{communityCutsProject.location} · {communityCutsProject.dateLabel}</p>
              <a href="/projects/community-cuts">View the project <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <ProjectProofGallery
            items={communityCutsProject.media}
            compact
            emptyLabel="COMMUNITY CUTS — APPROVED PHOTOS / VIDEO"
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="future shell" id="next" aria-labelledby="future-title">
          <p className="eyebrow">WHAT COMES NEXT</p>
          <h2 id="future-title">Next ASC3ND program.</h2>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="take-part shell" id="take-part" aria-labelledby="take-part-title">
          <p className="eyebrow">TAKE PART</p>
          <h2 id="take-part-title">Choose how you want to connect.</h2>
          <div className="choices">
            {participationRoutes.map(({ index, label, action, href }) => (
              <a href={href} key={index}>
                <span>{index}</span><strong>{label}</strong><em>{action}</em>
              </a>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <CommunitySignup />
      </MotionReveal>

      <footer className="footer">
        <div className="shell footer-inner">
          <div>
            <p className="eyebrow"><BrandWordmark text="ASC3ND.ORG" /></p>
            <h2>{siteStory.footer.lines.map((line) => <span key={line}>{line}<br /></span>)}</h2>
          </div>
          <div className="footer-meta">
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="#story"><span>Founders</span><span aria-hidden="true">↗</span></a>
              <a href="#community"><span>Community</span><span aria-hidden="true">↗</span></a>
              <a href="#take-part"><span>Take part</span><span aria-hidden="true">↗</span></a>
              <a href="https://www.zeffy.com/home/online-donation-platform-nonprofits" target="_blank" rel="noreferrer"><span>Donate</span><span aria-hidden="true">↗</span></a>
            </nav>
            <div><SocialLinks /><p><BrandWordmark text="asc3nd.org" /><br />Privacy · Youth safety · <a className="footer-contact-link" href="mailto:main@asc3nd.org">Contact</a></p><LegalIdentity compact /></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
