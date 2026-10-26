import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Bricolage_Grotesque,
  Courier_Prime,
  Hanken_Grotesk,
  JetBrains_Mono,
  Old_Standard_TT,
  Rubik_Mono_One,
} from "next/font/google";
import Analytics from "./analytics";
import { SiteTracking } from "@/components/analytics/site-tracking";
import { profile } from "@/components/portfolio/data";
import { buildHomeJsonLd } from "@/lib/agent/json-ld";
import { AGENT_ENTRYPOINTS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import { DEFAULT_WORLD, WORLD_BOOT_SCRIPT } from "@/lib/worlds";
import "./globals.css";

// One face family per world role. Only the default world's faces preload; the
// others download when a visitor switches, since browsers fetch only faces
// the rendered text actually uses.
const oldStandard = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-old-standard",
  display: "swap",
});
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  preload: false,
});
const rubikMono = Rubik_Mono_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rubik-mono",
  display: "swap",
  preload: false,
});
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
  preload: false,
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  preload: false,
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

const fontVariables = [oldStandard, courierPrime, bricolage, rubikMono, archivo, hanken, jetbrains]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "backend engineer",
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
  themeColor: "#f4f5f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-world={DEFAULT_WORLD} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Sets data-world from the cookie before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: WORLD_BOOT_SCRIPT }} />
        <link rel="service-desc" type="application/json" href={AGENT_ENTRYPOINTS.openapiJson} />
        <link rel="describedby" type="text/plain" href={AGENT_ENTRYPOINTS.llmsTxt} />
        <link rel="help" href={AGENT_ENTRYPOINTS.docs} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
        />
        <SiteTracking />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
