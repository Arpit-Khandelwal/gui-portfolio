import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
