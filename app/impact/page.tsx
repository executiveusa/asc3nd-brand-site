import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { communityRoll } from "@/lib/site-content";

const slots = ["arrival", "service", "connection", "next"] as const;

export default function ImpactPage() {
  return (
    <InteriorPage
      eyebrow="Community Cuts for Kids · Everett · August 2026"
      title="Start with the day people showed up."
      intro="Community Cuts for Kids is the first public event in ASC3ND's story. We are using this page to show what happened, who came together, and what we are building from it."
    >
      <section className="interior-section shell">
        <DocumentaryFrame
          label="CLIENT CONTENT NEEDED — Add the strongest Community Cuts hero photo or short brand film here. This should immediately show real people, energy, and community participation."
          slot="hero"
        />
      </section>

      <section className="interior-section shell">
        <p className="eyebrow">Community Roll</p>
        <div className="interior-list">
          {communityRoll.map(({ index, title, copy }, itemIndex) => (
            <article key={index}>
              <DocumentaryFrame
                label={`CLIENT CONTENT NEEDED — Add a real event photo or short clip that best represents “${title}.”`}
                slot={slots[itemIndex]}
              />
              <div className="interior-row-copy">
                <span>{index}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">What we know</p>
        <h2>People came together around something useful.</h2>
        <p>
          CLIENT PROOF NEEDED — Add verified attendance totals, outcomes, a short testimonial, or another concrete result here once the numbers and quotes are approved.
        </p>
        <DocumentaryFrame
          label="CLIENT CONTENT NEEDED — Add a closing Community Cuts image or short film here. Use a strong final moment that communicates connection, gratitude, or what comes next."
          slot="impact-closing"
        />
      </section>
    </InteriorPage>
  );
}
