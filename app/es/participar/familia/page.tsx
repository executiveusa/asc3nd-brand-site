import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Familias",
    description: "Cuéntanos qué podría ayudar a tu familia a acercarse a ASC3ND.",
    path: "/es/participar/familia",
  }),
  robots: { index: false, follow: false },
};

export default function FamiliaPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="family" locale="es" />
    </main>
  );
}
