import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" style={{ minHeight: "100svh", padding: "48px clamp(20px, 5vw, 80px)", background: "#f5f2e8", color: "#120f0b" }}>
      <div style={{ maxWidth: 760 }}>
        <p style={{ margin: "0 0 18px", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>
          ASC3ND · Page moved
        </p>
        <h1 style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: .92, fontWeight: 400, letterSpacing: "-.05em" }}>
          This page is no longer here.
        </h1>
        <p style={{ margin: "28px 0", maxWidth: 620, fontSize: 18, lineHeight: 1.6 }}>
          The ASC3ND site has been reorganized. Use one of the current destinations below instead of a dead link.
        </p>
        <nav aria-label="404 recovery" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href="/" style={{ color: "inherit" }}>Home</Link>
          <Link href="/impact" style={{ color: "inherit" }}>Impact</Link>
          <Link href="/story" style={{ color: "inherit" }}>Story</Link>
          <Link href="/take-part" style={{ color: "inherit" }}>Take part</Link>
        </nav>
      </div>
    </main>
  );
}
