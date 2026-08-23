import {
  availability,
  badFits,
  engagementGet,
  engagementTerms,
  faqs,
  focusAreas,
  goodFits,
  profile,
  projectArchive,
  selectedWork,
  skills,
  sprintSteps,
  sprintTimelines,
  sprintTypes,
} from "@/components/portfolio/data";
import { SITE_URL } from "@/lib/site";

/**
 * Serialises the portfolio content into the JSON shapes described by the
 * OpenAPI document. The portfolio data module stays the single source of
 * truth; nothing here re-authors content.
 */

export const TIMEZONE = "Asia/Kolkata";

export function profilePayload() {
  return {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    timezone: TIMEZONE,
    email: profile.email,
    links: {
      website: SITE_URL,
      github: profile.github,
      x: profile.x,
      linkedin: profile.linkedin,
      resume: profile.resume,
    },
    skills: skills.map((skill) => ({ name: skill.name, category: skill.label })),
  };
}

export function availabilityPayload() {
  return {
    status: availability.status,
    replyWindow: availability.reply,
    acceptingBriefs: true,
    engagementModel: "Fixed-scope build sprints, 2-6 weeks, flat price per sprint tied to a shipped outcome.",
    sprintLengths: [...sprintTimelines],
    sprintTypes: [...sprintTypes],
  };
}

export function servicesPayload() {
  return {
    focusAreas: focusAreas.map((area) => ({ label: area.label, description: area.text })),
    process: sprintSteps.map((step, index) => ({
      step: index + 1,
      title: step.title,
      description: step.text,
    })),
    deliverables: [...engagementGet],
    terms: engagementTerms.map(([label, value]) => ({ label, value })),
    goodFits: [...goodFits],
    badFits: [...badFits],
  };
}

export type WorkQuery = { status?: "shipped" | "experiment"; limit?: number };

export function workPayload(query: WorkQuery = {}) {
  const filtered = query.status
    ? selectedWork.filter((item) => item.status === query.status)
    : selectedWork;
  const limited = typeof query.limit === "number" ? filtered.slice(0, query.limit) : filtered;

  return {
    caseStudies: limited.map((item) => ({
      title: item.title,
      type: item.type,
      status: item.status,
      period: item.period,
      url: item.href,
      problem: item.problem,
      summary: item.shipped,
      stack: [...item.stack],
      proof: [...item.proof],
    })),
    archive: projectArchive.map(([title, summary, url]) => ({ title, summary, url })),
  };
}

export function faqPayload() {
  return faqs.map((faq) => ({ question: faq.q, answer: faq.a }));
}
