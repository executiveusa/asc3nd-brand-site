import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { communityRoll } from "@/lib/site-content";

const slots = ["arrival", "service", "connection", "next"] as const;

export default function ImpactPage() {
  return (
    <InteriorPage
      eyebrow="Community Cuts for Kids · Everett · August 2026"
      title="The first proof is a real community moment."
      intro="Community Cuts for Kids is the first public activation in ASC3ND's story. This page documents what is verified now and leaves everything else unclaimed until the evidence is approved."
    >
      <section className="interior-section shell">
        <DocumentaryFrame
          label="Approved Community Cuts documentary image or ambient film"
          slot="hero"
        />
      </section>

      <section className="interior-section shell">
        <p className="eyebrow">Community Roll</p>
        <div className="interior-list">
          {communityRoll.map(({ index, title, copy }, itemIndex) => (
            <article key={index}>
              <DocumentaryFrame
                label={`Approved event media · ${title}`}
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
        <p className="eyebrow">What this proves</p>
        <h2>ASC3ND can bring people into the same room around a useful act.</h2>
        <p>Attendance totals, outcomes, testimonials, and longer-term program claims remain intentionally absent until verified.</p>
      </section>
    </InteriorPage>
  );
}
