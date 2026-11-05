import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Mentores y voluntarios",
    description: "Dinos cómo quieres participar en ASC3ND como mentor o voluntario.",
    path: "/es/participar/mentores-voluntariado",
  }),
  robots: { index: false, follow: false },
};

export default function MentoresVoluntariadoPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="mentor-volunteer" locale="es" />
    </main>
  );
}
