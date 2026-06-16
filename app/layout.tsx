import type { Metadata, Viewport } from "next";
import Analytics from "./analytics";
import { profile } from "@/components/portfolio/data";
import "./globals.css";

const SITE_URL = "https://arpitkhandelwal.com";
const TITLE = "Arpit Khandelwal | Fractional AI & Backend Engineer";
const DESCRIPTION =
  "Fractional AI & backend engineer for build sprints across AI agents, backend automation, browser workflows, APIs, and integration-heavy products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Arpit Khandelwal",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "fractional engineer",
    "AI engineer",
    "backend engineer",
    "AI agents",
    "MCP server",
    "browser automation",
    "Solana",
    "build sprint",
    "Arpit Khandelwal",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "profile",
    siteName: "Arpit Khandelwal",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@ArpitKhandelwa3",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7ef" },
    { media: "(prefers-color-scheme: dark)", color: "#09110e" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Fractional AI & Backend Engineer",
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  sameAs: [profile.github, profile.x, profile.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
