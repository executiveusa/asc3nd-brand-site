import { InteriorPage } from "@/components/InteriorPage";

export const metadata = {
  title: "Youth Safety | ASC3ND",
  description: "ASC3ND's public website safety boundaries for youth, families, volunteers, mentors, and partners.",
};

export default function YouthSafetyPage() {
  return (
    <InteriorPage
      eyebrow="Youth safety"
      title="Clear boundaries for a youth-serving organization."
      intro="ASC3ND's public website is designed to connect families, volunteers, mentors, and community partners with the organization without creating private direct-messaging channels between youth and adults."
    >
      <section className="interior-statement shell">
        <p className="eyebrow">Website contact</p>
        <h2>Public forms route to ASC3ND follow-up queues.</h2>
        <p>The participation forms are intended for families, mentors and volunteers, and community partners. They are not emergency services and are not a private chat system between minors and individual adults.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Sensitive information</p>
        <h2>Share only what is needed for the request.</h2>
        <p>Do not use the public website forms to send emergency information, passwords, financial account information, medical records, or other highly sensitive information unless ASC3ND has provided a specific secure process for it.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Photos + stories</p>
        <h2>Public media should be approved before publication.</h2>
        <p>ASC3ND's project media system is designed to publish approved material only when the associated consent status is confirmed. Questions about a published image or story can be sent directly to ASC3ND.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Formal safeguards</p>
        <h2>Website guidance is not a substitute for an organizational safeguarding policy.</h2>
        <p>This page describes the boundaries of the public website. ASC3ND should separately maintain and approve its operational youth-safeguarding procedures for programs, volunteers, mentors, events, and staff.</p>
      </section>

      <section className="interior-statement shell">
        <p className="eyebrow">Questions or concerns</p>
        <h2>Contact ASC3ND.</h2>
        <p>Email <a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a> with a website safety question, media concern, or request for follow-up.</p>
      </section>
    </InteriorPage>
  );
}
