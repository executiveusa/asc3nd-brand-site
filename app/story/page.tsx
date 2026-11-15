import Link from "next/link";
import { CollectiveLogo } from "@/components/CollectiveLogo";
import { projectJoy } from "@/lib/initiative-content";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { pathways, siteStory } from "@/lib/site-content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Our story",
  description: "ASC3ND began with Fresh Fade, Fresh Grade in Everett, Washington, in August 2026. Read how the organization is building from that foundation.",
  path: "/story",
});

export default function StoryPage() {
  const [otha] = siteStory.founders;

  return (
    <InteriorPage
      eyebrow="Why ASC3ND exists"
      title="It Started with a Vision. It's Growing into a Movement."
      intro="Asc3nd Collective was born from a shared passion for giving back, uplifting others, and creating meaningful opportunities for the next generation. What began as a vision to serve youth and families in our community came to life through our first initiative, Fresh Fade, Fresh Grade, in Everett, Washington, in August 2026. But our mission extends far beyond a single event. We believe every young person deserves to feel seen, supported, encouraged, and empowered to reach their full potential. Through community partnerships, mentorship, outreach, and meaningful experiences, we are building a collective where small acts of kindness create lasting impact."
    >
      <section className="story shell interior-story">
        <DocumentaryFrame
          label={otha.name}
          slot="founder-otha"
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">{otha.name}, {otha.role.toLowerCase()}</p>
          <blockquote>“{otha.quote}”</blockquote>
          <p>— {otha.name}</p>
        </div>
      </section>


      <CollectiveLogo alt="ASC3ND Collective logo: an orange crown above the name ASC3ND in white brush lettering, with the 3 in orange" />

      <section className="interior-statement shell">
        <p className="eyebrow">What comes next</p>
        <h2>Three Pillars. One Purpose. Endless Possibilities.</h2>
        <div className="interior-pathways">
          {pathways.map(({ title, copy }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <p>As Asc3nd Collective continues to grow, we're working to expand our initiatives and partnerships to bring these areas of focus to life.</p>
      </section>
      <section className="interior-section shell story-mission" aria-labelledby="mission-in-action">
        <h2 id="mission-in-action">Our Mission in Action</h2>
        <div className="story-mission-grid">
          <article>
            <p className="eyebrow">Community initiative</p>
            <h3>Fresh Fade, Fresh Grade</h3>
            <p>Fresh Fade, Fresh Grade brought our community together in Everett, Washington, in August 2026, to support youth and families as they prepared for the new school year.</p>
            <Link href="/projects/community-cuts">Explore Fresh Fade, Fresh Grade <span className="arrow" aria-hidden="true">→</span></Link>
          </article>
          <article>
            <p className="eyebrow">{projectJoy.en.type}</p>
            <h3>{projectJoy.title}</h3>
            <p>{projectJoy.en.awaiting}</p>
            <Link href="/projects/project-joy">{projectJoy.en.linkLabel} <span className="arrow" aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

    </InteriorPage>
  );
}
