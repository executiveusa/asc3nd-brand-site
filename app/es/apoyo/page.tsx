import { SupportView } from "@/components/SupportView";
import { pageMetadata } from "@/lib/metadata";
import { supportEs } from "@/lib/support-shop.es";

export const metadata = pageMetadata({
  title: "Apoyo",
  description: "Apoya a ASC3ND Collective con donaciones o materiales. Para voluntariado y alianzas, visita Participa.",
  path: "/es/apoyo",
});

export default function ApoyoPage() {
  return <SupportView copy={supportEs} />;
}
