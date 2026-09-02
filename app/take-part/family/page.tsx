import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";

export const metadata = { title: "Families · ASC3ND", robots: { index: false, follow: false } };

export default function FamilyParticipationPage() {
  return (
    <main id="main-content">
      <header className="masthead shell"><Link className="wordmark" href="/">ASC3ND</Link><nav className="nav"><Link href="/take-part">Back to Take part</Link></nav></header>
      <ParticipationForm kind="family" />
    </main>
  );
}
