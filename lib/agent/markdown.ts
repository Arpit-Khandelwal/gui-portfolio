import {
  availability,
  badFits,
  engagementGet,
  engagementTerms,
  experience,
  faqs,
  focusAreas,
  goodFits,
  profile,
  projectArchive,
  selectedWork,
  skills,
  sprintSteps,
} from "@/components/portfolio/data";
import { SITE_URL, absoluteUrl, AGENT_ENTRYPOINTS } from "@/lib/site";
import { aboutIntro, aboutSections, contactIntro, contactSections, contactChannels, type CopySection } from "@/lib/copy";
import { docsEndpoints, docsEntryPoints, docsErrorCodes, docsIntro, rateLimitSummary } from "@/lib/docs";

/**
 * Markdown renderings of every page route, served when a client negotiates
 * `Accept: text/markdown` and at the `.md` twin of each path.
 *
 * These carry prose only: no navigation, styling, or layout markup.
 */

export type AgentDocument = {
  path: string;
  title: string;
  description: string;
  /** Canonical page URL, when it differs from `path` (alias routes). */
  canonicalPath?: string;
  render: () => string;
};

function frontMatter(document: Omit<AgentDocument, "render">) {
  return [
    "---",
    `title: ${JSON.stringify(document.title)}`,
    `description: ${JSON.stringify(document.description)}`,
    `canonical: ${absoluteUrl(document.canonicalPath ?? document.path)}`,
    "---",
    "",
  ].join("\n");
}

function renderSections(sections: readonly CopySection[]) {
  return sections
    .map((section) => [`## ${section.heading}`, "", ...section.paragraphs.flatMap((p) => [p, ""])].join("\n"))
    .join("\n");
}

function homeMarkdown() {
  return [
    `# ${profile.name}`,
    "",
    profile.role,
    "",
    `Based in ${profile.location}. ${availability.status}. ${availability.reply}.`,
    "",
    "## What I do",
    "",
    ...focusAreas.map((area) => `- **${area.label}** — ${area.text}`),
    "",
    "## How a sprint runs",
    "",
    ...sprintSteps.map((step, index) => `${index + 1}. **${step.title}** (${step.label}) — ${step.text}`),
    "",
    "## Selected work",
    "",
    ...selectedWork.flatMap((item) => [
      `### ${item.title} — ${item.type} (${item.period}, ${item.status})`,
      "",
      `**Problem.** ${item.problem}`,
      "",
      `**Shipped.** ${item.shipped}`,
      "",
      `**Stack.** ${item.stack.join(", ")}`,
      "",
      `**Proof.** ${item.proof.join("; ")}`,
      "",
      `Link: ${item.href}`,
      "",
    ]),
    "## Project archive",
    "",
    ...projectArchive.map(([title, summary, href]) => `- **${title}** — ${summary} (${href})`),
    "",
    "## Experience",
    "",
    ...experience.map((role) => `- **${role.title}, ${role.company}** (${role.period}) — ${role.text}`),
    "",
    "## Stack",
    "",
    skills.map((skill) => skill.name).join(", ") + ".",
    "",
    "## Engagement",
    "",
    ...engagementTerms.map(([label, value]) => `- **${label}** — ${value}`),
    "",
    "What you get:",
    "",
    ...engagementGet.map((item) => `- ${item}`),
    "",
    "## Fit",
    "",
    "Good fits:",
    "",
    ...goodFits.map((item) => `- ${item}`),
    "",
    "Not a fit:",
    "",
    ...badFits.map((item) => `- ${item}`),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((faq) => [`### ${faq.q}`, "", faq.a, ""]),
    "## Contact",
    "",
    `Email: ${profile.email}. ${availability.reply}.`,
    "",
    `Machine-readable API: ${absoluteUrl(AGENT_ENTRYPOINTS.openapiJson)} · Docs: ${absoluteUrl(AGENT_ENTRYPOINTS.docs)}`,
    "",
  ].join("\n");
}

function aboutMarkdown() {
  return [`# About ${profile.name}`, "", aboutIntro, "", renderSections(aboutSections)].join("\n");
}

function contactMarkdown() {
  return [
    `# Contact ${profile.name}`,
    "",
    contactIntro,
    "",
    "## Channels",
    "",
    ...contactChannels.map((channel) => `- **${channel.label}** — ${channel.value} (${channel.href})`),
    "",
    renderSections(contactSections),
  ].join("\n");
}

function docsMarkdown() {
  return [
    `# Developer and agent documentation — ${profile.name}`,
    "",
    docsIntro,
    "",
    "## Entry points",
    "",
    ...docsEntryPoints.map((entry) => `- \`${entry.path}\` — ${entry.description}`),
    "",
    "## Endpoints",
    "",
    "| Method | Path | Operation | Returns |",
    "| --- | --- | --- | --- |",
    ...docsEndpoints.map((e) => `| ${e.method} | ${e.path} | ${e.operationId} | ${e.returns} |`),
    "",
    "## Response shape",
    "",
    'Success responses are `{ "ok": true, "data": ... }`. Failures are `{ "ok": false, "error": { "code", "message", "hint", "documentation" } }` with an appropriate HTTP status. Branch on `error.code`, which is stable, rather than on the message text.',
    "",
    "| Code | Meaning |",
    "| --- | --- |",
    ...docsErrorCodes.map((entry) => `| \`${entry.code}\` | ${entry.meaning} |`),
    "",
    "## Rate limits",
    "",
    rateLimitSummary,
    "",
    "## Example",
    "",
    "```bash",
    `curl -s ${SITE_URL}/api/availability`,
    "",
    `curl -s -X POST ${SITE_URL}/api/contact \\`,
    "  -H 'content-type: application/json' \\",
    '  -d \'{"name":"Ada","email":"ada@example.com","message":"We need an MCP server for our internal tools in 4 weeks."}\'',
    "```",
    "",
    "## Markdown content negotiation",
    "",
    "Every page route honours `Accept: text/markdown` and responds with `Vary: Accept`, per acceptmarkdown.com. The same content is also reachable at the `.md` twin of any page path, for example `/about.md`. A request whose `Accept` header excludes both `text/html` and `text/markdown` gets a `406`.",
    "",
  ].join("\n");
}

function privacyMarkdown() {
  return [
    "# Privacy Policy",
    "",
    "Last updated: June 16, 2026.",
    "",
    `This website (${SITE_URL}) is a personal portfolio site for ${profile.name}, a fractional AI and backend engineer. This page explains what is collected when you visit and how you control it.`,
    "",
    "## Analytics and cookies",
    "",
    "With your consent, this site loads Google Tag Manager and Microsoft Clarity. Clarity records anonymised session analytics (page interactions, heatmaps, and session replay) and, together with Google Tag Manager, sets cookies such as `_clck` and `_clsk`. These tools run only after you choose \"Accept\" in the consent banner. If you choose \"Decline\", no analytics scripts are loaded and no analytics cookies are set. Your choice is stored locally in your browser so you are not asked again; clearing site data resets it.",
    "",
    "## Contact form",
    "",
    "If you submit the contact form, the name, email, and message you enter are delivered as a private Telegram notification so the message can be answered. If you email directly, your message and address reach the inbox. This information is used only to respond to you.",
    "",
    "## Hosting",
    "",
    "The site is hosted on Vercel, which may collect standard server logs (including IP address and browser information) as part of delivering the site. See Vercel's privacy policy for details.",
    "",
    "## Contact",
    "",
    `Questions about this policy? Email ${profile.email}.`,
    "",
  ].join("\n");
}

function playMarkdown() {
  return [
    "# Play — brick breaker",
    "",
    `An interactive brick-breaker game built into ${profile.name}'s portfolio. The brick wall spells ARPIT, and clearing bricks unlocks collectible cards drawn from the CV: roles, projects, and stack entries.`,
    "",
    "The game is a canvas-based client experience and has no machine-readable content beyond this description. For the underlying CV data an agent should read `/api/profile`, `/api/work`, and `/api/services` instead.",
    "",
  ].join("\n");
}

const documents: readonly AgentDocument[] = [
  {
    path: "/",
    title: "Arpit Khandelwal — Fractional AI & Backend Engineer",
    description: "Fixed-scope AI and backend build sprints: services, shipped work, terms, and contact.",
    render: homeMarkdown,
  },
  {
    path: "/about",
    title: "About Arpit Khandelwal",
    description: "Background, how sprints run, and which engagements are a good or bad fit.",
    render: aboutMarkdown,
  },
  {
    path: "/contact",
    title: "Contact Arpit Khandelwal",
    description: "How to send a sprint brief, what to include, and expected response times.",
    render: contactMarkdown,
  },
  {
    path: "/docs",
    title: "Developer and agent documentation",
    description: "Public API endpoints, OpenAPI spec, error codes, rate limits, and content negotiation.",
    render: docsMarkdown,
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description: "Analytics, cookies, consent, contact-form handling, and hosting.",
    render: privacyMarkdown,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Analytics, cookies, consent, contact-form handling, and hosting.",
    canonicalPath: "/privacy-policy",
    render: privacyMarkdown,
  },
  {
    path: "/play",
    title: "Play — brick breaker",
    description: "Interactive brick-breaker game with collectible CV cards.",
    render: playMarkdown,
  },
] as const;

export const AGENT_DOCUMENT_PATHS = documents.map((document) => document.path);

export function findAgentDocument(path: string): AgentDocument | undefined {
  const normalised = path === "" ? "/" : path.replace(/\/+$/, "") || "/";
  return documents.find((document) => document.path === normalised);
}

export function renderAgentDocument(document: AgentDocument) {
  return `${frontMatter(document)}${document.render()}`;
}
