import type { Metadata } from "next";
import "./globals.css";
import "./interior.css";
import "./gauntlet.css";

export const metadata: Metadata = {
  title: "ASC3ND | Empower Youth. Elevate Futures. Build Community.",
  description:
    "ASC3ND Collective — youth, mentorship, leadership, and community in Everett, Washington.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
