import type { Metadata } from "next";
import Script from "next/script";
import ClarityInit from "./clarity-init";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arpit Khandelwal | Fractional AI Backend Engineer",
  description:
    "Fractional AI backend engineer for build sprints across AI agents, backend automation, browser workflows, APIs, and integration-heavy products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en">
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2XHHRXL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ClarityInit />
        {children}
        <Script id="gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K2XHHRXL');
        `}</Script>
      </body>
    </html>
  );
}
