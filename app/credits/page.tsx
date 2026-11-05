import { CreditsPage } from "@/components/CreditsPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Credits",
  description: "The barbers, volunteers, partners, photographers and organizers who made ASC3ND events possible, thanked by name.",
  path: "/credits",
});

export default function Page() {
  return <CreditsPage />;
}
