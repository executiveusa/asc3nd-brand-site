import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Donor inquiries",
    description: "Ask ASC3ND about giving. No payments are collected here.",
    path: "/take-part/donor",
  }),
  robots: { index: false, follow: false },
};

export default function DonorInquiryPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="donor" />
    </main>
  );
}
