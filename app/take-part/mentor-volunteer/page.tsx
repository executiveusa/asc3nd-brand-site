import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Mentors + Volunteers · ASC3ND", robots: { index: false, follow: false } };

export default function MentorVolunteerPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="mentor-volunteer" />
    </main>
  );
}
