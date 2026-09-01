import type { ReactNode } from "react";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function InteriorPage({ eyebrow, title, intro, children }: InteriorPageProps) {
  return (
    <main id="main-content">
      <header className="masthead shell">
        <a className="wordmark" href="/" aria-label="ASC3ND home">ASC3ND</a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="/impact">Impact</a>
          <a href="/story">Story</a>
          <a href="/take-part">Take part</a>
        </nav>
      </header>

      <section className="interior-hero shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>

      {children}

      <footer className="footer interior-footer">
        <div className="shell interior-footer-inner">
          <p className="eyebrow">ASC3ND, with a three.</p>
          <nav aria-label="Footer navigation">
            <a href="/">Home</a>
            <a href="/impact">Impact</a>
            <a href="/story">Story</a>
            <a href="/take-part">Take part</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
