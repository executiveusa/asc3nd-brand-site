import { DocumentaryFrame } from "@/components/DocumentaryFrame";
import { ContactForm } from "@/components/ContactForm";
import { InteriorPage } from "@/components/InteriorPage";
import { participationRoutes } from "@/lib/site-content";
import { getApprovedMedia } from "@/lib/media-registry";
import "../home.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Get Involved",
  description: "Families, mentors, volunteers, and community partners: choose the route that fits you and start a direct conversation with ASC3ND.",
  path: "/take-part",
});

export default function TakePartPage() {
  return (
    <InteriorPage
      eyebrow="Take part"
      title="Be Part of Something Bigger."
      supporting="Every act of kindness, every connection, and every contribution has the power to make a difference. Whether you’re a family, volunteer, or community partner, there’s a place for you in the Asc3nd Collective."
      intro="At Asc3nd Collective, we believe meaningful change happens when people come together with a shared purpose. Whether you're looking for opportunities for your family, want to volunteer your time and talents, or represent an organization interested in partnering with us, we welcome you to be part of our growing collective. Together, we can create meaningful experiences, strengthen community connections, and help the next generation thrive."
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

      <ContactForm />
    </InteriorPage>
  );
}
