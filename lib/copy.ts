import { profile } from "@/components/portfolio/data";

/**
 * Long-form prose for the trust-anchor pages (/about, /contact) and their
 * markdown representations. Kept in one place so the HTML page and the
 * `Accept: text/markdown` variant can never drift apart.
 */
export type CopySection = {
  heading: string;
  paragraphs: readonly string[];
};

export const aboutIntro =
  "Arpit Khandelwal is a fractional AI and backend engineer based in Bengaluru, India, working with founders and small product teams on fixed-scope build sprints of two to six weeks.";

export const aboutSections: readonly CopySection[] = [
  {
    heading: "What this practice is",
    paragraphs: [
      "This is a one-person engineering practice, not an agency and not a staffing firm. Engagements are fixed-scope, fixed-window build sprints: a single senior engineer joins an existing team or an existing codebase, ships a named outcome, and hands the work back with documentation the team can act on.",
      "The work concentrates on the parts of a product that are awkward to hire for and easy to get wrong: authentication, data models, integrations with third-party systems, AI agents that have to survive real users, browser automation against surfaces that were never meant to be automated, and the operational glue between all of it.",
    ],
  },
  {
    heading: "Background",
    paragraphs: [
      "Previously an AI and backend engineer at Avici Money, building AI concierge infrastructure for ordering, booking, and task execution, and a software developer at Hewlett Packard Enterprise working on microservice integrations across security tooling including WebInspect, Burp Suite, OWASP ZAP, and OpenVAS.",
      "Alongside client work there is a long public archive of shipped experiments: MCP servers, retrieval-backed chatbots, Solana programs and dApps, media pipelines, and automation bots. Those projects exist because the fastest way to know whether a technique survives production is to put it in production.",
    ],
  },
  {
    heading: "How sprints run",
    paragraphs: [
      "A sprint starts with a scoping call, usually within 48 hours of first contact. Scope is written down and signed off before any code is written, and pricing is flat per sprint and tied to a shipped outcome rather than billed hourly.",
      "During the sprint the cadence is weekly: merged pull requests, a working demo, and a short note covering what changed and which tradeoffs were taken. At the end, handoff documentation goes to the team so the work keeps moving without a dependency on the person who wrote it.",
    ],
  },
  {
    heading: "Good and bad fits",
    paragraphs: [
      "A good fit looks like an AI, automation, retrieval, or backend problem with a real user-facing outcome attached, or a prototype that needs a credible production path. A bad fit looks like landing-page polish, a vague idea with no defined users or decisions, or discovery work that is mostly meetings.",
      "Saying no to a bad fit quickly is part of the service. Every inbound brief gets a reply within 24 hours, including the ones that are not a fit.",
    ],
  },
];

export const contactIntro = `The fastest way to start a conversation is a written brief. Email ${profile.email} directly, or use the sprint configurator on the homepage to generate one. Replies go out within 24 hours, every time, including for briefs that are not a fit.`;

export const contactSections: readonly CopySection[] = [
  {
    heading: "What to include in a first message",
    paragraphs: [
      "Four things make a brief immediately actionable: the user-facing outcome you want to exist at the end of the sprint, the external systems involved (APIs, databases, model providers, third-party surfaces), the current state of the work (idea, prototype, broken integration, or scaling and handoff), and the deadline that matters.",
      "A brief with those four things gets a real answer: whether it is a fit, the smallest useful slice to ship first, and a flat sprint price. A brief without them gets a short list of clarifying questions instead, which costs both sides a day.",
    ],
  },
  {
    heading: "Response times and process",
    paragraphs: [
      "First reply lands within 24 hours. If the brief is a fit, the next step is a scoping call within 48 hours. Work begins once written scope is agreed, and never before.",
      "Availability is limited by design, because sprints are run one at a time rather than in parallel. Current availability is published on the homepage and in the machine-readable availability endpoint.",
    ],
  },
  {
    heading: "For automated agents",
    paragraphs: [
      "Agents should not attempt to submit the contact form by driving the browser. Post a JSON body to the documented contact endpoint instead, which validates the payload and returns structured JSON on both success and failure. The endpoint, its schema, its error codes, and its rate-limit policy are described in the published OpenAPI document.",
      "Do not use the contact endpoint for sales outreach, list building, or unsolicited bulk messages. It exists so a person or an agent acting for a person can start a real engagement.",
    ],
  },
];

export const contactChannels: readonly { label: string; value: string; href: string }[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", value: "Arpit-Khandelwal", href: profile.github },
  { label: "LinkedIn", value: "arpit-khandelwal", href: profile.linkedin },
  { label: "X", value: "@ArpitKhandelwa3", href: profile.x },
  { label: "Résumé", value: "cv.arpitkhandelwal.com", href: profile.resume },
];
