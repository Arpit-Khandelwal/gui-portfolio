import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arpit Khandelwal | AI, Solana, and Backend Engineer",
  description:
    "Portfolio of Arpit Khandelwal, a full-stack engineer building AI agents, Solana applications, automation pipelines, and backend systems.",
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
