import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { participationRoutes } from "@/lib/site-content";

export default function TakePartPage() {
  return (
    <InteriorPage
      eyebrow="Take part"
      title="Want to be part of what comes next?"
      intro="ASC3ND is still building its permanent programs. For now, the easiest way in is a direct conversation. Choose the route that fits you."
    >
      <section className="interior-section shell">
        <DocumentaryFrame
          label="Approved participation image or brand video"
          slot="take-part"
        />
      </section>

      <section className="interior-section shell">
        <div className="choices">
          {participationRoutes.map(({ index, label, action, href }) => (
            <a href={href} key={index}>
              <span>{index}</span>
              <strong>{label}</strong>
              <em>{action}</em>
            </a>
          ))}
        </div>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Direct contact</p>
        <h2>Start with a conversation.</h2>
        <p><a className="text-link" href="mailto:hello@asc3nd.org">hello@asc3nd.org</a></p>
      </section>
    </InteriorPage>
  );
}
