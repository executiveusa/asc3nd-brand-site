import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CrownMark } from "@/components/CrownMark";
import { SocialLinks } from "@/components/SocialLinks";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <div className="site-footer-lead">
          <p className="site-footer-promise">Empower youth.<br />Elevate futures.<br />Build community.</p>
          <a className="site-footer-mail" href="mailto:main@asc3nd.org">main@asc3nd.org</a>
        </div>

        <nav className="site-footer-columns" aria-label="Footer navigation">
          <div>
            <h2>ASC3ND</h2>
            <Link href="/story">Story</Link>
            <Link href="/events">Events</Link>
            <Link href="/take-part">Take part</Link>
          </div>
          <div>
            <h2>Trust</h2>
            <Link href="/transparency">Transparency</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/youth-safety">Youth safety</Link>
          </div>
          <div>
            <h2>Follow</h2>
            <SocialLinks />
          </div>
        </nav>

        <div className="site-footer-sign">
          <div className="site-footer-mark" aria-hidden="true"><CrownMark /></div>
          <BrandLogo className="site-footer-logo" title="ASC3ND" />
        </div>

        <div className="site-footer-legal">
          <p>The ASC3ND Collective</p>
          <p>Washington nonprofit corporation, UBI 606 247 629</p>
          <Link href="/transparency">Public record <span className="arrow" aria-hidden="true">→</span></Link>
        </div>
      </div>
    </footer>
  );
}
