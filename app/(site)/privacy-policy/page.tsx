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
    <main id="main" className="prose-main">
      <h1 className="mb-6 text-2xl font-bold">Privacy Policy</h1>
      <PrivacyContent />
    </main>
  );
}
