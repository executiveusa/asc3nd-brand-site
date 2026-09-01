import { CommunitySignup } from "@/components/CommunitySignup";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { SocialLinks } from "@/components/SocialLinks";
import {
  communityRoll,
  participationRoutes,
  pathways,
  siteStory,
} from "@/lib/site-content";

export default function Home() {
  return (
    <main id="main-content">
      <header className="masthead shell">
        <a className="wordmark" href="#top" aria-label="ASC3ND home">ASC3ND</a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#impact">Impact</a>
          <a href="#story">Story</a>
          <a href="#take-part">Take part</a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <p className="eyebrow">{siteStory.hero.eyebrow}</p>
        <h1>{siteStory.hero.headline[0]}<br />{siteStory.hero.headline[1]}</h1>
        <p className="hero-copy">{siteStory.hero.body}</p>
        <a className="text-link" href={siteStory.hero.actionHref}>{siteStory.hero.action}</a>
      </section>

      <section className="cinematic shell" aria-label="Community Cuts documentary media">
        <DocumentaryFrame label="Approved Community Cuts image or brand film" slot={siteStory.hero.mediaSlot} />
        <div className="media-caption"><span>Community Cuts for Kids</span><span>Everett · August 2026</span></div>
      </section>

      <section className="impact" id="impact">
        <div className="shell impact-intro"><p className="eyebrow">{siteStory.impact.eyebrow}</p><h2>{siteStory.impact.headline}</h2></div>
        <div className="shell roll">
          <aside className="roll-index" aria-label="Community Roll index"><span className="eyebrow">Community Roll</span><ol>{communityRoll.map(({ index, title }) => <li key={index}>{index} · {title}</li>)}</ol></aside>
          <div>{communityRoll.map(({ index, title, copy, mediaSlot }) => <article className="roll-frame" key={index}><DocumentaryFrame label={`Approved event image or video · ${title}`} slot={mediaSlot} variant="dark" /><div className="frame-copy"><span>{index} · {title}</span><p>{copy}</p></div></article>)}</div>
        </div>
      </section>

      <section className="story shell" id="story">
        <DocumentaryFrame label="Approved founder portrait or founder video" slot={siteStory.story.mediaSlot} className="portrait-placeholder" />
        <div className="story-copy"><p className="eyebrow">{siteStory.story.eyebrow}</p><h2>{siteStory.story.headline}</h2><p>{siteStory.story.body}</p><blockquote>{siteStory.story.founderBelief}</blockquote></div>
      </section>

      <section className="pathways shell" id="pathways">
        <p className="eyebrow">{siteStory.pathways.eyebrow}</p><h2>{siteStory.pathways.headline}</h2>
        <DocumentaryFrame label="Approved ASC3ND pathway image or brand video" slot={siteStory.pathways.mediaSlot} />
        <div className="pathway-list">{pathways.map(({ index, title, copy, status }) => <article className="pathway" key={index}><span>{index}</span><h3>{title}</h3><p>{copy} <small>{status}</small></p></article>)}</div>
      </section>

      <section className="take-part shell" id="take-part">
        <p className="eyebrow">{siteStory.takePart.eyebrow}</p><h2>{siteStory.takePart.headline}</h2>
        <DocumentaryFrame label="Approved participation image or brand video" slot={siteStory.takePart.mediaSlot} />
        <div className="choices">{participationRoutes.map(({ index, label, action, href }) => <a href={href} key={index}><span>{index}</span><strong>{label}</strong><em>{action}</em></a>)}</div>
      </section>

      <CommunitySignup />

      <footer className="footer">
        <div className="shell footer-inner">
          <div><p className="eyebrow">{siteStory.footer.eyebrow}</p><h2>{siteStory.footer.lines.map((line) => <span key={line}>{line}<br /></span>)}</h2></div>
          <div className="footer-meta">
            <nav aria-label="Footer navigation"><a href="#impact">Impact</a><a href="#story">Story</a><a href="#take-part">Take part</a></nav>
            <div><SocialLinks /><p>asc3nd.org<br />Privacy · Youth safety · Contact</p></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
