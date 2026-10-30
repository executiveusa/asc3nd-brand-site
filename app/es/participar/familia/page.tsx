import Link from "next/link";
import { ParticipationForm } from "@/components/ParticipationForm";

export const metadata = { title: "Familias · ASC3ND", robots: { index: false, follow: false } };

export default function FamiliaPage() {
  return <main id="main-content" tabIndex={-1} lang="es">
    <header className="masthead shell"><Link className="wordmark" href="/es">ASC3ND</Link><nav className="nav" aria-label="Navegación"><Link href="/es/participar">Volver a Participa</Link></nav></header>
    <ParticipationForm kind="family" locale="es" />
  </main>;
}
