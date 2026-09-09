import { BrandWordmark } from "@/components/BrandWordmark";
import "./legal-identity.css";

export function LegalIdentity({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "legal-identity legal-identity--compact" : "legal-identity"}>
    <p className="legal-identity-name">THE <BrandWordmark /> COLLECTIVE</p>
    <p>Washington nonprofit corporation · UBI 606 247 629</p>
    <a href="/transparency">Trust &amp; Transparency <span aria-hidden="true">↗</span></a>
  </div>;
}
