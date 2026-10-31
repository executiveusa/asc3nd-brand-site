import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Families · ASC3ND", robots: { index: false, follow: false } };

export default function FamilyParticipationPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="family" />
    </main>
  );
}
