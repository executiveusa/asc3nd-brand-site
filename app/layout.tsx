import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASC3ND — Community came through. Now we build forward.",
  description:
    "The ASC3ND Collective builds practical pathways around trusted guidance, life skills, and community-built opportunity for young people.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
