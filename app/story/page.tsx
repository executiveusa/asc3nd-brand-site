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
          label="CLIENT CONTENT NEEDED — Add the founder portrait or a short founder video here. The goal is to make the person behind ASC3ND feel visible, credible, and human."
          slot="founder"
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">Founder belief</p>
          <blockquote>CLIENT COPY NEEDED — Add a short founder quote here (1–3 sentences) explaining why ASC3ND exists and what you want young people to feel, learn, or gain.</blockquote>
          <p>Client note: this should sound like the founder speaking naturally, not like organizational marketing copy.</p>
        </div>
      </section>

      <section className="interior-section shell">
        <DocumentaryFrame
          label="CLIENT CONTENT NEEDED — Add a short founder, community, or brand-story video here. Use this space to deepen the story after the founder introduction."
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
