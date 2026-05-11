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
  note: string;
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

export type CaseStudy = {
  title: string;
  type: string;
  href: string;
  period: string;
  problem: string;
  shipped: string;
  stack: readonly string[];
  credibility: string;
  proof: readonly string[];
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

export type ArchiveItem = readonly [title: string, text: string, href: string];
