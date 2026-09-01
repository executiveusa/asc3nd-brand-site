import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { SocialLinks } from "@/components/SocialLinks";
import {
  communityRoll,
  participationRoutes,
  pathways,
} from "@/lib/site-content";

const rollSlots = ["arrival", "service", "connection", "next"] as const;

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
        <p className="eyebrow">The ASC3ND Collective · Everett, Washington</p>
        <h1>Community came through.<br />Now we build forward.</h1>
        <p className="hero-copy">Community Cuts for Kids brought young people, families, volunteers, and local supporters into the same space. ASC3ND is building from that day with more ways for young people to find guidance, practice life skills, and connect with opportunity.</p>
        <a className="text-link" href="#impact">Start with Community Cuts ↓</a>
      </section>

      <section className="cinematic shell" aria-label="Community Cuts documentary media">
        <DocumentaryFrame label="Approved Community Cuts image or brand film" slot="hero" />
        <div className="media-caption"><span>Community Cuts for Kids</span><span>Everett · August 2026</span></div>
      </section>

      <section className="impact" id="impact">
        <div className="shell impact-intro"><p className="eyebrow">Where it started</p><h2>It started with Community Cuts for Kids.</h2></div>
        <div className="shell roll">
          <aside className="roll-index" aria-label="Community Roll index"><span className="eyebrow">Community Roll</span><ol>{communityRoll.map(({ index, title }) => <li key={index}>{index} · {title}</li>)}</ol></aside>
          <div>{communityRoll.map(({ index, title, copy }, itemIndex) => <article className="roll-frame" key={index}><DocumentaryFrame label={`Approved event image or video · ${title}`} slot={rollSlots[itemIndex]} variant="dark" /><div className="frame-copy"><span>{index} · {title}</span><p>{copy}</p></div></article>)}</div>
        </div>
      </section>

      <section className="story shell" id="story">
        <DocumentaryFrame label="Approved founder portrait or founder video" slot="founder" className="portrait-placeholder" />
        <div className="story-copy"><p className="eyebrow">Why ASC3ND exists</p><h2>Keep showing up after the event ends.</h2><p>ASC3ND starts with a simple belief: young people need trusted adults, useful experiences, and a community that stays involved. Community Cuts gave us a place to begin. The work now is to keep building.</p><blockquote>Founder-authored belief goes here.</blockquote></div>
      </section>

      <section className="pathways shell" id="pathways">
        <p className="eyebrow">What comes next</p><h2>Three areas we are building now.</h2>
        <DocumentaryFrame label="Approved ASC3ND pathway image or brand video" slot="pathways" />
        <div className="pathway-list">{pathways.map(({ index, title, copy, status }) => <article className="pathway" key={index}><span>{index}</span><h3>{title}</h3><p>{copy} <small>{status}</small></p></article>)}</div>
      </section>

      <section className="take-part shell" id="take-part">
        <p className="eyebrow">Take part</p><h2>Want to be part of what comes next?</h2>
        <DocumentaryFrame label="Approved participation image or brand video" slot="take-part" />
        <div className="choices">{participationRoutes.map(({ index, label, action, href }) => <a href={href} key={index}><span>{index}</span><strong>{label}</strong><em>{action}</em></a>)}</div>
      </section>

      <footer className="footer">
        <div className="shell footer-inner">
          <div><p className="eyebrow">ASC3ND, with a three.</p><h2>Empower youth.<br />Elevate futures.<br />Build community.</h2></div>
          <div className="footer-meta">
            <nav aria-label="Footer navigation"><a href="#impact">Impact</a><a href="#story">Story</a><a href="#take-part">Take part</a></nav>
            <div><SocialLinks /><p>asc3nd.org<br />Privacy · Youth safety · Contact</p></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
