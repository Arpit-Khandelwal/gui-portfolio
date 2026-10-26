import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundTracker } from "@/components/analytics/not-found-tracker";

export const metadata: Metadata = {
  title: "Page not found | Arpit Khandelwal",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="prose-main" style={{ color: "var(--w-ink)" }}>
      <NotFoundTracker />
      <h1>This page does not exist.</h1>
      <p>The link can be old, or the address can have an error.</p>
      <p>
        <Link href="/" style={{ color: "var(--w-accent)" }}>
          Go to the homepage
        </Link>
      </p>
    </main>
  );
}
