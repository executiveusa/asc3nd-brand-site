import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { pathways } from "@/lib/site-content";

export default function StoryPage() {
  return (
    <InteriorPage
      eyebrow="Why ASC3ND exists"
      title="Built close to the community."
      intro="ASC3ND is being built around a simple conviction: young people move further when trusted adults, meaningful experiences, and community support meet them with intention."
    >
      <section className="story shell interior-story">
        <DocumentaryFrame
          label="Approved founder portrait"
          slot="founder"
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">Founder belief</p>
          <blockquote>Founder-authored belief goes here.</blockquote>
          <p>The quote remains a placeholder until it is supplied and approved by the founder.</p>
        </div>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">What ASC3ND is building</p>
        <h2>A useful next step, repeated with intention.</h2>
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
