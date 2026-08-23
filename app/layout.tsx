import type { Metadata, Viewport } from "next";
import Analytics from "./analytics";
import { profile } from "@/components/portfolio/data";
import { buildHomeJsonLd } from "@/lib/agent/json-ld";
import { AGENT_ENTRYPOINTS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
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
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/index.md" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "profile",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@ArpitKhandelwa3",
  },
  other: {
    // Advertised in the head as well as in headers so a crawler that only
    // parses HTML still finds the machine-readable surface.
    "ai-content-declaration": "human-authored",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7ef" },
    { media: "(prefers-color-scheme: dark)", color: "#09110e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="service-desc" type="application/json" href={AGENT_ENTRYPOINTS.openapiJson} />
        <link rel="describedby" type="text/plain" href={AGENT_ENTRYPOINTS.llmsTxt} />
        <link rel="help" href={AGENT_ENTRYPOINTS.docs} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
