import { CommunitySignup } from "@/components/CommunitySignup";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { MotionReveal } from "@/components/MotionReveal";
import { SocialLinks } from "@/components/SocialLinks";
import { participationRoutes, siteStory } from "@/lib/site-content";

export default function Home() {
  return (
    <main id="main-content">
      <header className="masthead shell">
        <a className="wordmark" href="#top" aria-label="ASC3ND home">ASC3ND</a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#story">Founders</a>
          <a href="#community">Community</a>
          <a href="#take-part">Take part</a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <p className="eyebrow hero-eyebrow">{siteStory.hero.eyebrow}</p>
        <h1>{siteStory.hero.headline}</h1>
      </section>

      <MotionReveal>
        <section className="founders shell" id="story" aria-labelledby="founders-title">
          <p className="eyebrow" id="founders-title">FOUNDERS</p>
          <div className="founder-grid">
            {siteStory.founders.map((founder) => (
              <article className="founder-profile" key={founder.name}>
                <DocumentaryFrame
                  label={`PORTRAIT PLACEHOLDER — Add ${founder.name}'s approved founder photograph here.`}
                  slot={founder.mediaSlot}
                  className="portrait-placeholder"
                />
                <div className="founder-copy">
                  <p className="eyebrow">{founder.name} · {founder.role}</p>
                  <blockquote>“{founder.quote}”</blockquote>
                </div>
              </article>
            ))}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="community-proof shell" id="community" aria-labelledby="community-title">
          <div className="section-heading">
            <p className="eyebrow">COMMUNITY CUTS FOR KIDS</p>
            <h2 id="community-title">Proof goes here.</h2>
            <p className="placeholder-note">CONTENT PLACEHOLDER — Add only approved Community Cuts photography, video, verified outcomes, partner names, or participant testimony.</p>
          </div>
          <DocumentaryFrame
            label="MEDIA PLACEHOLDER — Add one approved Community Cuts photo or short documentary clip here."
            slot="hero"
          />
        </section>
      </MotionReveal>

      <MotionReveal>
        <section className="future shell" id="next" aria-labelledby="future-title">
          <p className="eyebrow">WHAT COMES NEXT</p>
          <h2 id="future-title">Next program or activity goes here.</h2>
          <p className="placeholder-note">CONTENT PLACEHOLDER — Add the next confirmed 90-day activity in the founders’ approved words. No speculative programs or impact claims.</p>
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
            <p className="eyebrow">ASC3ND.ORG</p>
            <h2>{siteStory.footer.lines.map((line) => <span key={line}>{line}<br /></span>)}</h2>
          </div>
          <div className="footer-meta">
            <nav aria-label="Footer navigation">
              <a href="#story">Founders</a>
              <a href="#community">Community</a>
              <a href="#take-part">Take part</a>
            </nav>
            <div><SocialLinks /><p>asc3nd.org<br />Privacy · Youth safety · Contact</p></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
