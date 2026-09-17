import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { pathways, siteStory } from "@/lib/site-content";

export default function StoryPage() {
  const [otha, elisha] = siteStory.founders;

  return (
    <InteriorPage
      eyebrow="Why ASC3ND exists"
      title="ASC3ND began with Community Cuts for Kids."
      intro="In Everett in August 2026, Community Cuts brought ASC3ND's work into public view. The organization is building from that foundation: trusted guidance, useful experiences, and stronger community connections for young people."
    >
      <section className="story shell interior-story">
        <DocumentaryFrame
          label={otha.name}
          slot="founder-otha"
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">{otha.name} · {otha.role}</p>
          <blockquote>“{otha.quote}”</blockquote>
          <p>— {otha.name}</p>
        </div>
      </section>

      <section className="interior-section shell">
        <DocumentaryFrame
          label={elisha.name}
          slot="founder-elisha"
        />
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">What comes next</p>
        <h2>Three areas ASC3ND is developing.</h2>
        <div className="interior-pathways">
          {pathways.map(({ index, title, copy, status }) => (
            <article key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>{status}</small>
            </article>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
