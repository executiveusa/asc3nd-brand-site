import Link from "next/link";
import { StaffQueueDashboard } from "@/components/StaffQueueDashboard";
import { ParticipationIntakeDashboard } from "@/components/ParticipationIntakeDashboard";
import { RecoveryReview } from "@/components/RecoveryReview";
import { ContentCommandCenter } from "@/components/ContentCommandCenter";
import { ProjectMediaWorkbench } from "@/components/ProjectMediaWorkbench";
import styles from "./staff.module.css";

export const metadata = {
  title: "ASC3ND Staff · ICM Operations",
  robots: { index: false, follow: false },
};

export default function StaffPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>ASC3ND</Link>
        <div><p>Staff operations</p><h1>Identity → Context → Memory</h1></div>
      </header>
      <section className={styles.intro}>
        <p>One person record. Multiple operational routes. Website intake, follow-up, content, consent, recovery, project media, and CSV handoff all work from the ASC3ND operating system.</p>
      </section>
      <StaffQueueDashboard />
      <ProjectMediaWorkbench />
      <ParticipationIntakeDashboard />
      <RecoveryReview />
      <ContentCommandCenter />
    </main>
  );
}
