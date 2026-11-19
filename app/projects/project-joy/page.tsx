import { ProjectJoyPageContent } from "@/components/ProjectJoyPageContent";
import { pageMetadata } from "@/lib/metadata";
import { projectJoy } from "@/lib/initiative-content";

export const metadata = pageMetadata({
  title: projectJoy.title,
  description: "Support ASC3ND Collective's holiday Project Joy Toy Drive, bringing gifts, toys, and essential items to local children and youth.",
  path: "/projects/project-joy",
});

export default function ProjectJoyPage() {
  return <ProjectJoyPageContent locale="en" />;
}
