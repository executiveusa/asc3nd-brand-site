import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { nextChapter } from "@/lib/site-content";

export default function StoryPage() {
  return (
    <InteriorPage
      eyebrow="The founders"
      title="Why ASC3ND exists."
      intro="Their words belong here."
    >
      <section className="story shell interior-story">
        <DocumentaryFrame
          label="Founder portrait or short film"
          slot="founder"
          className="portrait-placeholder"
        />
        <div className="story-copy">
          <p className="eyebrow">Founder belief</p>
          <blockquote>Founder quote — to confirm together.</blockquote>
        </div>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">What comes next</p>
        <h2>Define the next chapter together.</h2>
        <div className="interior-pathways">
          {nextChapter.map(({ index, title, copy }) => (
            <article key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <small>{copy}</small>
            </article>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
