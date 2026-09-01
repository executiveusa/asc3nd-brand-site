const roll = [
  ["01", "Arrival", "A real community moment begins with people choosing to show up."],
  ["02", "Service", "Community Cuts for Kids is the first visible proof of ASC3ND in action."],
  ["03", "Connection", "Young people, families, volunteers, and local supporters shared the same space."],
  ["04", "What comes next", "The event is evidence for a longer path, not the end of the story."],
] as const;

const pathways = [
  ["01", "Trusted guidance", "Consistent adults who listen, encourage, and help young people recognize possibility."],
  ["02", "Leadership + life skills", "Experiences that help confidence become responsibility, resilience, and direction."],
  ["03", "Community-built opportunity", "Families, schools, mentors, and partners creating paths no one organization could build alone."],
] as const;

export default function Home() {
  return (
    <main>
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
        <p className="hero-copy">ASC3ND brings young people, trusted adults, meaningful experiences, and community support together to help create direction and opportunity.</p>
        <a className="text-link" href="#impact">See the first activation ↓</a>
      </section>

      <section className="cinematic shell" aria-label="Community Cuts documentary media placeholder">
        <div className="media-placeholder"><span>Approved Community Cuts documentary image or ambient film</span></div>
        <div className="media-caption"><span>Community Cuts for Kids</span><span>Everett · August 2026</span></div>
      </section>

      <section className="impact" id="impact">
        <div className="shell impact-intro">
          <p className="eyebrow">The first activation</p>
          <h2>The community showed us what can happen.</h2>
        </div>
        <div className="shell roll">
          <aside className="roll-index" aria-label="Community Roll index">
            <span className="eyebrow">Community Roll</span>
            <ol>{roll.map(([n, title]) => <li key={n}>{n} · {title}</li>)}</ol>
          </aside>
          <div>
            {roll.map(([n, title, copy]) => (
              <article className="roll-frame" key={n}>
                <div className="media-placeholder dark-media"><span>Approved event media · {title}</span></div>
                <div className="frame-copy"><span>{n} · {title}</span><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story shell" id="story">
        <div className="portrait-placeholder"><span>Approved founder portrait</span></div>
        <div className="story-copy">
          <p className="eyebrow">Why ASC3ND exists</p>
          <h2>Built close to the community.</h2>
          <p>ASC3ND is being built around a simple conviction: young people move further when trusted adults, meaningful experiences, and community support meet them with intention.</p>
          <blockquote>Founder-authored belief goes here.</blockquote>
        </div>
      </section>

      <section className="pathways shell" id="pathways">
        <p className="eyebrow">What ASC3ND is building</p>
        <h2>A meaningful next step can change a direction.</h2>
        <div className="pathway-list">
          {pathways.map(([n, title, copy]) => (
            <article className="pathway" key={n}>
              <span>{n}</span><h3>{title}</h3><p>{copy} <small>In development</small></p>
            </article>
          ))}
        </div>
      </section>

      <section className="take-part shell" id="take-part">
        <p className="eyebrow">Choose your place</p>
        <h2>The next chapter is built with the community.</h2>
        <div className="choices">
          <a href="mailto:hello@asc3nd.org?subject=Family interest"><span>01</span><strong>Families</strong><em>Stay connected →</em></a>
          <a href="mailto:hello@asc3nd.org?subject=Mentor or volunteer interest"><span>02</span><strong>Mentors + volunteers</strong><em>Share your interest →</em></a>
          <a href="mailto:hello@asc3nd.org?subject=Community partnership"><span>03</span><strong>Community partners</strong><em>Build with ASC3ND →</em></a>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-inner">
          <div>
            <p className="eyebrow">ASC3ND — with a three.</p>
            <h2>Empower youth.<br />Elevate futures.<br />Build community.</h2>
          </div>
          <div className="footer-meta">
            <nav aria-label="Footer navigation"><a href="#impact">Impact</a><a href="#story">Story</a><a href="#take-part">Take part</a></nav>
            <p>asc3nd.org<br />Privacy · Youth safety · Contact</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
