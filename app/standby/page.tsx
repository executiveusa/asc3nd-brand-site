import Image from "next/image";
import { Barlow, Barlow_Condensed } from "next/font/google";
import HoldingSignupForm from "./HoldingSignupForm";
import styles from "./holding.module.css";

const barlow = Barlow({ subsets: ["latin"], variable: "--font-barlow", display: "swap", weight: ["400","500","600","700","800","900"] });
const barlowCondensed = Barlow_Condensed({ subsets: ["latin"], variable: "--font-barlow-condensed", display: "swap", weight: ["500","600","700","800","900"] });

export const metadata = {
  title: "ASC3ND Collective",
  description: "ASC3ND is building the next chapter. Stay connected for programs, events, and opportunities for young people and the community.",
  robots: { index: false, follow: false },
};

export default function Asc3ndHoldingPage() {
  return (
    <main id="main-content" className={`${styles.page} ${barlow.variable} ${barlowCondensed.variable}`}>
      <section className={styles.shell} aria-labelledby="holding-title">
        <div className={styles.logoStage}>
          <Image
            className={styles.secondaryLogo}
            src="/images/asc3nd-logo-transparent-tight-v2.png"
            alt="ASC3ND Collective"
            width={1380}
            height={750}
            priority
            unoptimized
          />
        </div>
        <h1 className={styles.statementStack} id="holding-title">
          <span>Empower Youth</span>
          <span>Elevate Futures</span>
          <span>Build Community</span>
        </h1>
        <div className={styles.thankYouBlock}>
          <h2 className={styles.thankYouTitle}>Thank you for supporting ASC3ND.</h2>
          <p className={styles.thankYouCopy}>We’re building the next chapter now. Stay connected and we’ll keep you updated.</p>
        </div>
        <HoldingSignupForm />
      </section>
    </main>
  );
}
