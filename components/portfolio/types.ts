// Copy follows ISO 24495-1 plain language, with STE-style sentence rules (ASD-STE100).
import type { LucideIcon } from "lucide-react";

export type Icon = LucideIcon;

export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  avatar: string;
  x: string;
  github: string;
  linkedin: string;
  resume: string;
};

export type BuyerMode = {
  id: string;
  label: string;
  eyebrow: string;
  promise: string;
  body: string;
  tags: readonly string[];
  briefGoal: string;
};

export type WorkMode = {
  id: string;
  label: string;
};

export type IconText = {
  label: string;
  icon: Icon;
  text: string;
};

export type SprintStep = {
  title: string;
  label: string;
  icon: Icon;
  text: string;
};

export type ProofMetric = {
  value: string;
  label: string;
  detail: string;
};

export type CaseStatus = "shipped" | "experiment";

export type CaseStudy = {
  title: string;
  type: string;
  href: string;
  period: string;
  status: CaseStatus;
  problem: string;
  shipped: string;
  stack: readonly string[];
  credibility: string;
  proof: readonly string[];
  /** 3-5 system part labels (each 3 words or fewer), true to the stack. */
  parts?: readonly string[];
};

export type OpenSourceState = "merged" | "in-review";

export type OpenSourcePr = {
  repo: string;
  number: number;
  title: string;
  href: string;
  state: OpenSourceState;
};

export type Experience = {
  company: string;
  title: string;
  period: string;
  text: string;
};

export type Skill = {
  name: string;
  label: string;
  icon: Icon;
};

export type ArchitectureNode = {
  id: string;
  label: string;
  icon: Icon;
  text: string;
  projects: readonly string[];
};

export type Social = {
  label: string;
  href: string;
  icon: Icon;
};

export type Faq = {
  q: string;
  a: string;
};

export type ArchiveItem = readonly [title: string, text: string, href: string];
