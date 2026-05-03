import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Arpit Khandelwal",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: May 3, 2026</p>

      <p className="mb-4">
        This website (<strong>arpitkhandelwal.com</strong>) is a personal
        portfolio site. Your privacy is important, and this page explains what
        data, if any, is collected when you visit.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Information Collected</h2>
      <p className="mb-4">
        This site does not collect personal information, use cookies, or require
        you to create an account. Basic analytics data (e.g., page views) may be
        collected by the hosting provider.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Third-Party Services</h2>
      <p className="mb-4">
        This site may be hosted on third-party platforms (e.g., Vercel) that may
        collect standard server logs including IP addresses and browser
        information. Please refer to their respective privacy policies for
        details.
      </p>

      <h2 className="text-lg font-semibold mt-8 mb-2">Contact</h2>
      <p>
        If you have any questions about this policy, feel free to reach out via
        the contact information on the main site.
      </p>
    </main>
  );
}
