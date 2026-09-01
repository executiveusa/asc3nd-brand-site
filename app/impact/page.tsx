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
          label="Approved Community Cuts image or brand film"
          slot="hero"
        />
      </section>

      <section className="interior-section shell">
        <p className="eyebrow">Community Roll</p>
        <div className="interior-list">
          {communityRoll.map(({ index, title, copy }, itemIndex) => (
            <article key={index}>
              <DocumentaryFrame
                label={`Approved event image or video · ${title}`}
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
          We will add attendance totals, outcomes, and testimonials only after
          they are verified and approved.
        </p>
        <DocumentaryFrame
          label="Approved Community Cuts closing image or brand film"
          slot="impact-closing"
        />
      </section>
    </InteriorPage>
  );
}
