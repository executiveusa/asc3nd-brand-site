import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

type Section = "story" | "events" | "take-part" | undefined;

const links = [
  { href: "/story", label: "Story", key: "story" },
  { href: "/events", label: "Events", key: "events" },
  { href: "/take-part", label: "Take part", key: "take-part" },
] as const;

export function SiteHeader({ current }: { current?: Section }) {
  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="site-logo" href="/" aria-label="ASC3ND home">
          <BrandLogo />
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.key} href={link.href} aria-current={current === link.key ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
