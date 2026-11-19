import { ProjectJoyPageContent } from "@/components/ProjectJoyPageContent";
import { pageMetadata } from "@/lib/metadata";
import { projectJoy } from "@/lib/initiative-content";

export const metadata = pageMetadata({
  title: projectJoy.title,
  description: "Apoya a ASC3ND Collective con Project Joy, su colecta navideña de juguetes, regalos y artículos esenciales para niñas, niños y jóvenes.",
  path: "/es/proyectos/project-joy",
});

export default function ProjectJoyEsPage() {
  return <ProjectJoyPageContent locale="es" />;
}
