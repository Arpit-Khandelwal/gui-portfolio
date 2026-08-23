import type { Metadata } from "next";
import { ProsePage } from "@/components/site/prose-page";
import { contactChannels, contactIntro, contactSections } from "@/lib/copy";
import { profile } from "@/components/portfolio/data";

export const metadata: Metadata = {
  title: "Contact Arpit Khandelwal | Start a build sprint",
  description:
    "How to send a build-sprint brief to Arpit Khandelwal, what to include, expected response times, and the JSON endpoint agents should use instead of the form.",
  alternates: {
    canonical: "/contact",
    types: { "text/markdown": "/contact.md" },
  },
  openGraph: { type: "profile", url: "/contact", title: "Contact Arpit Khandelwal" },
};

export default function ContactPage() {
  return (
    <ProsePage title={`Contact ${profile.name}`} intro={contactIntro} sections={contactSections}>
      <h2 className="mb-2 mt-8 text-lg font-semibold">Channels</h2>
      <ul className="mb-4 space-y-1">
        {contactChannels.map((channel) => (
          <li key={channel.label}>
            <span className="text-[color:var(--muted)]">{channel.label}: </span>
            <a
              className="font-semibold underline hover:text-[color:var(--accent)]"
              href={channel.href}
              rel={channel.href.startsWith("mailto:") ? undefined : "noreferrer"}
            >
              {channel.value}
            </a>
          </li>
        ))}
      </ul>
    </ProsePage>
  );
}
