import { InteriorPage } from "@/components/InteriorPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How ASC3ND uses and protects information shared through its website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <InteriorPage
      eyebrow="Privacy"
      title="How we use the information you share."
      intro="When you contact ASC3ND Collective through our website, we use the information you provide to respond to your request, connect you with the appropriate team, and send community updates only when you separately ask to receive them. We aim to collect only information needed for those purposes."
    >
      <section className="interior-statement shell">
        <h2>Information you choose to share</h2>
        <p>Depending on the form, we may receive your name, email address, optional phone number, organization, participation interests, availability, family support requests, preferred language, messages, and consent preferences.</p>
        <p>Please do not include a child&apos;s name, school, medical records, financial credentials, or other sensitive personal information in public website forms.</p>
      </section>

      <section className="interior-statement shell">
        <h2>How your information is used</h2>
        <p>We use submitted information to respond to inquiries, coordinate participation, and direct requests to the appropriate ASC3ND team.</p>
        <p>Community updates require a separate subscription choice. Submitting an inquiry does not grant permission to publish your photograph, story, or personal information.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Technology and service providers</h2>
        <p>Our website uses service providers for hosting, secure form processing, data storage, and email delivery. These providers process information as needed to operate the services.</p>
        <p>Technical information may also be processed to maintain website security and functionality.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Drafts saved on your device</h2>
        <p>Some participation forms can save unfinished drafts in your browser so you can return to them later.</p>
        <p>ASC3ND does not receive those drafts unless you submit the form. You can remove locally saved drafts by clearing this website&apos;s browser data.</p>
      </section>

      <section className="interior-statement shell">
        <h2>How long information is retained</h2>
        <p>We retain submitted information for the purposes for which it was collected and for additional periods required by applicable law, legitimate recordkeeping obligations, or an active legal hold.</p>
        <p>Website inquiries are managed separately from organizational, financial, and charitable-solicitation records.</p>
        <p>You may contact us to request access to, correction of, or deletion of information you submitted. Some records may need to be retained where legally required.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Questions and privacy requests</h2>
        <p>For privacy questions or requests concerning information you submitted, contact:</p>
        <p><a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a></p>
        <p>Please do not include sensitive information about a child in your initial email.</p>
      </section>
    </InteriorPage>
  );
}
