import Link from "next/link";
import { StaffQueueDashboard } from "@/components/StaffQueueDashboard";
import styles from "./staff.module.css";

export const metadata = {
  title: "ASC3ND Staff · ICM Queues",
  robots: { index: false, follow: false },
};

export default function StaffPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>ASC3ND</Link>
        <div>
          <p>Staff operations</p>
          <h1>Identity → Context → Memory</h1>
        </div>
      </header>
      <section className={styles.intro}>
        <p>
          One person record. Multiple operational routes. Access is limited by the role assigned to your authenticated ASC3ND account.
        </p>
      </section>
      <StaffQueueDashboard />
    </main>
  );
}
