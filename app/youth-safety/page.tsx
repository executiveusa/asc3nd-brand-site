import { InteriorPage } from "@/components/InteriorPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Youth Safety",
  description: "Website safety information for young people, families, mentors, volunteers, and partners.",
  path: "/youth-safety",
});

export default function YouthSafetyPage() {
  return (
    <InteriorPage
      eyebrow="Youth Safety"
      title="Every young person deserves a safe environment to learn, create, and grow."
      intro="ASC3ND Collective works to connect young people, families, mentors, volunteers, and community partners with meaningful opportunities. Protecting young people requires clear boundaries, responsible adults, appropriate permissions, and accessible ways to raise concerns."
    >
      <section className="interior-statement shell">
        <h2>A safe way to connect</h2>
        <p>Our public website provides information and contact forms intended for parents, guardians, mentors, volunteers, and community partners.</p>
        <p>It is not a private messaging service between children and adults, and it is not an emergency response channel.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Protecting children&apos;s information</h2>
        <p>Parents and guardians should submit initial participation inquiries on behalf of children.</p>
        <p>Please do not submit children&apos;s full names, schools, birth dates, medical information, private family circumstances, or sensitive personal details through public website forms.</p>
        <p>If additional information is needed, ASC3ND will identify an appropriate method for collecting it.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Photographs, videos, and personal stories</h2>
        <p>If you believe an image, name, or story involving a child has been published without appropriate permission, please contact ASC3ND so the concern can be reviewed.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Reporting a safety concern</h2>
        <p>If a child is in immediate danger, <strong>call 911</strong>.</p>
        <p>To report suspected child abuse or neglect in Washington State, contact:</p>
        <p><strong>Washington Department of Children, Youth, and Families</strong></p>
        <p><a className="text-link" href="tel:+18663634276">1-866-ENDHARM (1-866-363-4276)</a></p>
        <p>You may also contact the appropriate law-enforcement agency.</p>
        <p>Do not rely on website forms or ordinary email for urgent safety reports.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Safeguarding responsibilities</h2>
        <p>Youth-serving activities require appropriate supervision, screening where applicable, clear adult conduct standards, and procedures for responding to concerns.</p>
      </section>

      <section className="interior-statement shell">
        <h2>Questions about website safety</h2>
        <p>For questions about website information, photographs, or non-emergency follow-up, contact:</p>
        <p><a className="text-link" href="mailto:main@asc3nd.org">main@asc3nd.org</a></p>
        <p>This email address is not an emergency reporting service.</p>
      </section>
    </InteriorPage>
  );
}
