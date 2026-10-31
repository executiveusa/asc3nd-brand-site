import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./interior.css";
import "./gauntlet.css";
import "./site-chrome.css";
import { OG_IMAGE, SITE_URL } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ASC3ND",
  description:
    "ASC3ND is building ways for young people to find trusted guidance, practice life skills, and connect with community opportunity.",
  openGraph: {
    type: "website",
    siteName: "ASC3ND",
    locale: "en_US",
    alternateLocale: ["es_US"],
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ASC3ND over a photo of families at the Community Cuts for Kids tent in Everett, Washington" }],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
