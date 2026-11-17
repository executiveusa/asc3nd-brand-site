import { ParticipationForm } from "@/components/ParticipationForm";
import { SiteHeader } from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Consultas sobre donaciones",
    description: "Consulta sobre cómo apoyar a ASC3ND. No se procesan pagos aquí.",
    path: "/es/participar/donante",
  }),
  robots: { index: false, follow: false },
};

export default function DonorInquiryPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SiteHeader current="take-part" />
      <ParticipationForm kind="donor" locale="es" />
    </main>
  );
}
