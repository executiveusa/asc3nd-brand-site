import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({ title: "Families", description: "Tell ASC3ND how you would like to take part. A person replies directly.", path: "/take-part/family" }),
  robots: { index: false, follow: false },
};

export default function FamilyParticipationPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="family" />
    </main>
  );
}
