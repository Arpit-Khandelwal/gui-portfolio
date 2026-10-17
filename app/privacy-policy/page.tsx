import type { Metadata } from "next";
import { PrivacyContent } from "@/components/site/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | Arpit Khandelwal",
  description: "How arpitkhandelwal.com uses analytics and cookies.",
  alternates: {
    canonical: "/privacy-policy",
    types: { "text/markdown": "/privacy-policy.md" },
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed">
      <h1 className="mb-6 text-2xl font-bold">Privacy Policy</h1>
      <PrivacyContent />
    </main>
  );
}
