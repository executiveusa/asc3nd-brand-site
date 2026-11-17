import { SupportView } from "@/components/SupportView";
import { pageMetadata } from "@/lib/metadata";
import { supportEn } from "@/lib/support-shop.en";

export const metadata = pageMetadata({
  title: "Support",
  description: "Support ASC3ND Collective through financial giving or in-kind supplies. Volunteer and partnership opportunities are under Get Involved.",
  path: "/support",
});

export default function SupportPage() {
  return <SupportView copy={supportEn} />;
}
