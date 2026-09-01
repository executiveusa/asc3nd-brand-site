import type { Metadata } from "next";
import "./globals.css";
import "./interior.css";
import "./gauntlet.css";

export const metadata: Metadata = {
  title: "ASC3ND | Community came through. Now we build forward.",
  description:
    "ASC3ND is building ways for young people to find trusted guidance, practice life skills, and connect with community opportunity.",
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
