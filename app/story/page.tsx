import Link from "next/link";
import { CollectiveLogo } from "@/components/CollectiveLogo";
import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { pathways, siteStory } from "@/lib/site-content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Our story",
  description: "The ASC3ND Collective began with a shared vision and its inaugural Fresh Fade, Fresh Grade event in Everett, Washington.",
  path: "/story",
});

export default function StoryPage() {
  const [otha, elisha] = siteStory.founders;
  return (
    <InteriorPage
      eyebrow="Our story"
      title="It Started with a Vision. It's Growing into a Movement."
      intro="Asc3nd Collective was born from a shared passion for giving back, uplifting others, and creating meaningful opportunities for the next generation."
    >
      <section className="interior-section shell story-narrative">
        <p>What began as a vision to serve youth and families in our community came to life through our first initiative, Fresh Fade, Fresh Grade, in Everett, Washington, in August 2026.</p>
        <p>But our mission extends far beyond a single event. We believe every young person deserves to feel seen, supported, encouraged, and empowered to reach their full potential.</p>
        <p>Through community partnerships, mentorship, outreach, and meaningful experiences, we are building a collective where small acts of kindness create lasting impact.</p>
      </section>
      <section className="story shell interior-story">
        <DocumentaryFrame label={otha.name} slot="founder-otha" className="portrait-placeholder" />
        <div className="story-copy">
          <p className="eyebrow">{otha.name}, {otha.role.toLowerCase()}</p>
          <blockquote>“{otha.quote}”</blockquote>
          <p>— {otha.name}</p>
        </div>
      </section>
      <section className="interior-section shell story-elisha-quote" aria-label={elisha.name}>
        <div className="story-community-photo">
          <img src="/images/projects/community-cuts/community-cuts-044.jpg" alt="Young people together at ASC3ND's back-to-school community event" loading="lazy" />
        </div>
        <div className="story-copy">
          <p className="eyebrow">{elisha.name}, {elisha.role.toLowerCase()}</p>
          <blockquote>“{elisha.quote}”</blockquote>
          <p>— {elisha.name}</p>
        </div>
      </section>
      <CollectiveLogo alt="ASC3ND Collective logo: an orange crown above the name ASC3ND in white brush lettering, with the 3 in orange" />
      <section className="interior-statement shell">
        <p className="eyebrow">Our three pillars</p>
        <h2>Three Pillars. One Purpose. Endless Possibilities.</h2>
        <div className="interior-pathways">
          {pathways.map(({ title, copy }) => (
            <article key={title}><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <p>As Asc3nd Collective continues to grow, we're working to expand our initiatives and partnerships to bring these areas of focus to life.</p>
      </section>
      <section className="interior-section shell story-mission-action">
        <p className="eyebrow">Our Mission in Action</p>
        <h2>Community involvement starts here.</h2>
        <div className="story-action-photo"><img src="/images/projects/community-cuts/community-cuts-042.jpg" alt="A family at ASC3ND's first back-to-school community event" loading="lazy" /></div>
        <div className="story-action-links">
          <div><h3>Fresh Fade, Fresh Grade</h3><p>Our inaugural back-to-school community event in Everett, Washington, August 2026.</p><Link href="/projects/community-cuts">View event photographs and film →</Link></div>
          <div><h3>Project Joy: Asc3nd the Joy</h3><p>ASC3ND's active 2026 holiday giving initiative. Ask the team for current participation details.</p><Link href="/take-part">Ask how to get involved →</Link></div>
        </div>
      </section>
    </InteriorPage>
  );
}
