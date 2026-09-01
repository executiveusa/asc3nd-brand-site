import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { pathways } from "@/lib/site-content";

export default function StoryPage() {
  return (
    <InteriorPage
      eyebrow="Why ASC3ND exists"
      title="The event was a beginning, not the whole idea."
      intro="ASC3ND starts with a simple belief: young people need trusted adults, useful experiences, and a community that stays involved. Community Cuts gave us a place to begin."
    >
      <section className="story shell interior-story">
        <DocumentaryFrame
          label="Approved founder portrait or founder video"
          slot="founder"
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">Founder belief</p>
          <blockquote>Founder-authored belief goes here.</blockquote>
          <p>We will replace this placeholder when the founder approves the final words.</p>
        </div>
      </section>

      <section className="interior-section shell">
        <DocumentaryFrame
          label="Approved founder, community, or brand story video"
          slot="story-context"
        />
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">What comes next</p>
        <h2>We are building in three areas.</h2>
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
