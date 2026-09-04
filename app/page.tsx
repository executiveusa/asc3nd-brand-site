import { CommunitySignup } from "@/components/CommunitySignup";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { SocialLinks } from "@/components/SocialLinks";
import { nextChapter, participationRoutes, siteStory } from "@/lib/site-content";

export default function Home() {
  return (
    <main id="main-content">
      <header className="masthead shell">
        <a className="brand-lockup" href="#top" aria-label="ASC3ND home">
          <span className="a3-mark" aria-hidden="true">A3</span>
          <span className="wordmark">ASC3ND</span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#story">Story</a>
          <a href="#first-chapter">First chapter</a>
          <a href="#next">What’s next</a>
          <a href="#take-part">Take part</a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <p className="eyebrow">{siteStory.hero.eyebrow}</p>
        <h1>
          {siteStory.hero.headline.map((line) => (
            <span key={line}>{line}<br /></span>
          ))}
        </h1>
        <a className="text-link" href={siteStory.hero.actionHref}>{siteStory.hero.action}</a>
      </section>

      <section className="cinematic shell" aria-label="ASC3ND founder film placeholder">
        <DocumentaryFrame
          label="FOUNDER FILM PLACEHOLDER — Use one of the founder reels here, or replace with new post-event footage."
          slot={siteStory.hero.mediaSlot}
        />
        <div className="media-caption"><span>ASC3ND founder story</span><span>Video / image interchangeable</span></div>
      </section>

      <section className="story shell" id="story">
        <DocumentaryFrame
          label="FOUNDER PORTRAIT OR VIDEO PLACEHOLDER — Keep this human and documentary, not promotional."
          slot={siteStory.story.mediaSlot}
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">{siteStory.story.eyebrow}</p>
          <h2>{siteStory.story.headline}</h2>
          <p>{siteStory.story.body}</p>
          <blockquote>{siteStory.story.founderBelief}</blockquote>
        </div>
      </section>

      <section className="impact" id="first-chapter">
        <div className="shell impact-intro">
          <p className="eyebrow">{siteStory.firstChapter.eyebrow}</p>
          <h2>{siteStory.firstChapter.headline}</h2>
          <p className="chapter-meta">{siteStory.firstChapter.meta}</p>
        </div>
        <div className="shell first-chapter-media">
          <DocumentaryFrame
            label="COMMUNITY CUTS PLACEHOLDER — Use the strongest single event image or a short post-event cut."
            slot={siteStory.firstChapter.mediaSlot}
            variant="dark"
          />
        </div>
      </section>

      <section className="pathways shell" id="next">
        <p className="eyebrow">{siteStory.next.eyebrow}</p>
        <h2>{siteStory.next.headline}</h2>
        <div className="pathway-list">
          {nextChapter.map(({ index, title, copy }) => (
            <article className="pathway" key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p><small>{copy}</small></p>
            </article>
          ))}
        </div>
      </section>

      <section className="take-part shell" id="take-part">
        <p className="eyebrow">{siteStory.takePart.eyebrow}</p>
        <h2>{siteStory.takePart.headline}</h2>
        <div className="choices">
          {participationRoutes.map(({ index, label, action, href }) => (
            <a href={href} key={index}>
              <span>{index}</span><strong>{label}</strong><em>{action}</em>
            </a>
          ))}
        </div>
      </section>

      <CommunitySignup />

      <footer className="footer">
        <div className="shell footer-inner">
          <div>
            <p className="eyebrow">{siteStory.footer.eyebrow}</p>
            <h2>{siteStory.footer.lines.map((line) => <span key={line}>{line}<br /></span>)}</h2>
          </div>
          <div className="footer-meta">
            <nav aria-label="Footer navigation">
              <a href="#story">Story</a>
              <a href="#first-chapter">First chapter</a>
              <a href="#next">What’s next</a>
              <a href="#take-part">Take part</a>
            </nav>
            <div><SocialLinks /><p>asc3nd.org<br />Privacy · Youth safety · Contact</p></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
