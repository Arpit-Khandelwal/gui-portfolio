import type { Metadata } from "next";
import { ProsePage } from "@/components/site/prose-page";
import { aboutIntro, aboutSections } from "@/lib/copy";
import { profile } from "@/components/portfolio/data";

export const metadata: Metadata = {
  title: "About Arpit Khandelwal | Fractional AI & Backend Engineer",
  description:
    "Background, how fixed-scope build sprints run, and which AI and backend engagements are a good or bad fit for Arpit Khandelwal.",
  alternates: {
    canonical: "/about",
    types: { "text/markdown": "/about.md" },
  },
  openGraph: { type: "profile", url: "/about", title: "About Arpit Khandelwal" },
};

export default function AboutPage() {
  return (
    <ProsePage title={`About ${profile.name}`} intro={aboutIntro} sections={aboutSections} />
  );
}
