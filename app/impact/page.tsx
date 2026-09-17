import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { communityRoll } from "@/lib/site-content";

const slots = ["arrival", "service", "connection", "next"] as const;

export default function ImpactPage() {
  return (
    <InteriorPage
      eyebrow="Community Cuts for Kids · Everett · August 2026"
      title="Community Cuts is ASC3ND's first public project record."
      intro="The project page brings together the full event film, 86 approved photographs, and event credits from Community Cuts for Kids in Everett, Washington."
    >
      <section className="interior-section shell">
        <DocumentaryFrame
          label="Community Cuts for Kids · Everett, Washington · August 2026"
          slot="hero"
        />
      </section>

      <section className="interior-section shell">
        <p className="eyebrow">Community Cuts record</p>
        <div className="interior-list">
          {communityRoll.map(({ index, title, copy }, itemIndex) => (
            <article key={index}>
              <DocumentaryFrame
                label={`${title} · Community Cuts for Kids`}
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
        <p className="eyebrow">What ASC3ND can verify</p>
        <h2>The film and approved photographs are public now.</h2>
        <p>
          Outcome totals and additional testimony will be added only after they are verified and approved.
        </p>
        <DocumentaryFrame
          label="Community Cuts project record"
          slot="impact-closing"
        />
      </section>
    </InteriorPage>
  );
}
