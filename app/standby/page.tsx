import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { CommunitySignup, type SignupCopy } from "@/components/CommunitySignup";
import "./standby.css";

export const metadata: Metadata = {
  title: "ASC3ND Collective — Stay Connected",
  description: "ASC3ND is building the next chapter. Stay connected for programs, events, and opportunities for young people and the community.",
  robots: { index: false, follow: false },
};

const standbySignupCopy: SignupCopy = {
  title: "Stay connected",
  body: "We’ll keep you updated about ASC3ND programs, events, and opportunities.",
  name: "Name",
  email: "Email",
  consent: "Keep me updated about ASC3ND programs, events, and opportunities.",
  submit: "Keep me updated",
  submitting: "Submitting…",
  success: "Thank you. You're on the ASC3ND update list.",
  failed: "We couldn't save your information. Please try again.",
  unreachable: "We couldn't reach ASC3ND. Please try again.",
};

export default function StandbyPage() {
  return (
    <main id="main-content" className="standby-page">
      <div className="standby-inner">
        <div className="standby-wordmark"><BrandLogo title="ASC3ND Collective" /></div>
        <h1 className="standby-message">
          <span>Empower youth</span>
          <span>Elevate futures</span>
          <span>Build community</span>
        </h1>
        <p className="standby-thanks">Thank you for supporting ASC3ND.</p>
        <p className="standby-intro">We’re building the next chapter now. Stay connected and we’ll keep you updated.</p>
        <CommunitySignup copy={standbySignupCopy} language="en" sourcePage="asc3nd.org/standby" />
      </div>
    </main>
  );
}
