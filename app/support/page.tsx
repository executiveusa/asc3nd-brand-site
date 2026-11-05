import { SupportView } from "@/components/SupportView";
import { pageMetadata } from "@/lib/metadata";
import { supportEn } from "@/lib/support-shop.en";

export const metadata = pageMetadata({
  title: "Support",
  description: "Donate, volunteer, partner with ASC3ND, or give supplies. Choose the route that fits you.",
  path: "/support",
});

export default function SupportPage() {
  return <SupportView copy={supportEn} />;
}
