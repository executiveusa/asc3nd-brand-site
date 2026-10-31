import { SupportView } from "@/components/SupportView";
import { pageMetadata } from "@/lib/metadata";
import { supportEs } from "@/lib/support-shop.es";

export const metadata = pageMetadata({
  title: "Apoyo",
  description: "Dona, haz voluntariado, hazte aliado de ASC3ND o da materiales. Elige la forma que mejor te quede.",
  path: "/es/apoyo",
});

export default function ApoyoPage() {
  return <SupportView copy={supportEs} />;
}
