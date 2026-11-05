import { CreditsPage } from "@/components/CreditsPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Créditos",
  description: "Los barberos, voluntarios, aliados, fotógrafos y organizadores que hicieron posibles los eventos de ASC3ND, con su nombre.",
  path: "/es/creditos",
});

export default function Page() {
  return <CreditsPage locale="es" />;
}
