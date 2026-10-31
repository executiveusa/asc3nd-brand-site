import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { InteriorPage } from "@/components/InteriorPage";
import { participationRoutes } from "@/lib/site-content";
import { getApprovedMedia } from "@/lib/media-registry";
import "../home.css";

export default function TakePartPage() {
  return (
    <InteriorPage
      eyebrow="Take part"
      title="Want to be part of what comes next?"
      intro="ASC3ND is still building its permanent programs. For now, the easiest way in is a direct conversation. Choose the route that fits you."
    >
      {getApprovedMedia("take-part") ? (
        <section className="interior-section shell">
          <DocumentaryFrame
            label="Families, mentors, volunteers, and community partners are welcome here."
            slot="take-part"
          />
        </section>
      ) : null}

      <section className="interior-section shell">
        <div className="home-join-list">
          {participationRoutes.map((route) => (
            <a className="home-join-row" href={route.href} key={route.href}>
              <span className="home-join-label">{route.label}</span>
              <span className="home-join-detail">{route.detail}</span>
              <span className="home-join-action">{route.action} <span className="arrow" aria-hidden="true">→</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Direct contact</p>
        <h2>Start with a conversation.</h2>
        <p><a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a></p>
      </section>
    </InteriorPage>
  );
}
