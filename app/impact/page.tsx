import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";

export default function ImpactPage() {
  return (
    <InteriorPage
      eyebrow="A first chapter"
      title="Community Cuts for Kids"
      intro="Everett · August 2026"
    >
      <section className="interior-section shell">
        <DocumentaryFrame
          label="Strongest Community Cuts photo or short film"
          slot="hero"
        />
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Proof</p>
        <h2>Show what happened. Only what we can verify.</h2>
        <p>Attendance, partners, services, quotes, and outcomes — add after approval.</p>
      </section>
    </InteriorPage>
  );
}
