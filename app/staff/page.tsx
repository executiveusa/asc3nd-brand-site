import Link from "next/link";
import { StaffQueueDashboard } from "@/components/StaffQueueDashboard";
import { ParticipationIntakeDashboard } from "@/components/ParticipationIntakeDashboard";
import { RecoveryReview } from "@/components/RecoveryReview";
import { ContentCommandCenter } from "@/components/ContentCommandCenter";
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
        <p>One person record. Multiple operational routes. Website intake, follow-up, content, consent, recovery, and CSV handoff all work from the canonical Supabase relationship record.</p>
      </section>
      <StaffQueueDashboard />
      <ParticipationIntakeDashboard />
      <RecoveryReview />
      <ContentCommandCenter />
    </main>
  );
}
