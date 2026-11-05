import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({ title: "Community partners", description: "Tell ASC3ND how you would like to take part. A person replies directly.", path: "/take-part/partner" }),
  robots: { index: false, follow: false },
};

export default function PartnerParticipationPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="partner" />
    </main>
  );
}
