import type { Metadata } from "next";
import { PrivacyContent } from "@/components/site/privacy-content";

/**
 * `/privacy` is the path agents and auditors probe by convention. It serves the
 * full policy — a bodyless redirect reads as "no content" to anything that does
 * not follow redirects — while naming `/privacy-policy` as the canonical URL so
 * the two are never treated as duplicate pages.
 */
export const metadata: Metadata = {
  title: "Privacy Policy | Arpit Khandelwal",
  description: "How arpitkhandelwal.com uses analytics, cookies, and consent.",
  alternates: {
    canonical: "/privacy-policy",
    types: { "text/markdown": "/privacy-policy.md" },
  },
};

export default function PrivacyAlias() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed">
      <h1 className="mb-6 text-2xl font-bold">Privacy Policy</h1>
      <PrivacyContent />
    </main>
  );
}
