import type { ReactNode } from "react";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SocialLinks } from "@/components/SocialLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function InteriorPage({ eyebrow, title, intro, children }: InteriorPageProps) {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader />

      <section className="interior-hero shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>

      {children}

      <SiteFooter />
    </main>
  );
}
