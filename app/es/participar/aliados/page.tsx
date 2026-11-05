import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Aliados de la comunidad",
    description: "Cuéntanos qué tipo de alianza, patrocinio o donación en especie te gustaría explorar con ASC3ND.",
    path: "/es/participar/aliados",
  }),
  robots: { index: false, follow: false },
};

export default function AliadosPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="partner" locale="es" />
    </main>
  );
}
