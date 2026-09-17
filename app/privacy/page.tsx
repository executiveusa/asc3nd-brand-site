import { InteriorPage } from "@/components/InteriorPage";

export const metadata = {
  title: "Privacy | ASC3ND",
  description: "How ASC3ND handles information submitted through its website.",
};

export default function PrivacyPage() {
  return (
    <InteriorPage
      eyebrow="Privacy"
      title="What ASC3ND collects and why."
      intro="ASC3ND collects only the information people choose to submit through this website so the organization can respond, follow up, and send updates when permission is given."
    >
      <section className="interior-statement shell">
        <p className="eyebrow">What we collect</p>
        <h2>Information you choose to send us.</h2>
        <p>Depending on the form, that can include your name, email address, optional phone number, organization, participation goals, availability, family support requests, free-text responses, preferred language, and consent choices.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Why we use it</p>
        <h2>To respond and route your request.</h2>
        <p>Participation submissions are used to route follow-up to the appropriate ASC3ND team queue. Email updates are sent only when you separately opt in to receive them.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Saved on this device</p>
        <h2>Draft participation forms can stay in your browser.</h2>
        <p>Some participation forms save an unfinished draft in your browser's local storage so you can recover your answers on the same device. ASC3ND does not receive that draft until you submit the form.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Retention</p>
        <h2>No fixed public retention period is posted yet.</h2>
        <p>ASC3ND has not published a fixed website-data retention schedule. This page will be updated when a formal retention period is adopted.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Questions</p>
        <h2>Contact ASC3ND directly.</h2>
        <p>For questions about information you submitted through this website, email <a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a>.</p>
      </section>
    </InteriorPage>
  );
}
