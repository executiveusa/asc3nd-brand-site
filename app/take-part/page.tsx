import { InteriorPage } from "@/components/InteriorPage";
import { participationRoutes } from "@/lib/site-content";

export default function TakePartPage() {
  return (
    <InteriorPage
      eyebrow="Choose your place"
      title="The next chapter is built with the community."
      intro="ASC3ND is keeping participation simple while the permanent programs and systems are still being verified. Choose the route that fits you and start a direct conversation."
    >
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
        <h2>Start with a real conversation.</h2>
        <p><a className="text-link" href="mailto:hello@asc3nd.org">hello@asc3nd.org</a></p>
      </section>
    </InteriorPage>
  );
}
