// Copy follows ISO 24495-1 plain language, with STE-style sentence rules (ASD-STE100).
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
  "Arpit Khandelwal is a backend and AI-systems engineer in Bengaluru, India. He leads tech at Reskilll. He also takes a small number of fixed-scope build sprints of two to six weeks, one at a time.";

export const aboutSections: readonly CopySection[] = [
  {
    heading: "Work today",
    paragraphs: [
      "Arpit leads tech at Reskilll. He built its platform end to end: OTP and Google OAuth login, a CMS console, a judging and submissions engine, and organiser dashboards. For a national hackathon, the platform took more than 50,000 registrations on one t3.micro instance. It needed zero deployments after the dev close, and it held off spam and attacks.",
      "Outside Reskilll, he takes a small number of build sprints, one at a time. This outside work is a one-person practice. It is not an agency, and it is not a staffing firm.",
      "The sprints focus on the parts of a product that are hard to hire for and easy to get wrong. These are auth, data models, third-party integrations, AI agents that must hold up with real users, and automation of surfaces that have no API.",
    ],
  },
  {
    heading: "Background",
    paragraphs: [
      "From January to July 2025, he was an AI and backend engineer at Avici Money. There he built agent orchestration for an AI concierge: tool calls, task routing and multi-step state. One part was a Playwright-backed MCP server that let the concierge operate a closed consumer app.",
      "From 2023 to 2024, he was a software developer at Hewlett Packard Enterprise. He worked on DAST microservices that join WebInspect, Burp Suite, OWASP ZAP and OpenVAS output into one pipeline.",
      "He has done freelance work since 2021: LLM workflows, scrapers, FFmpeg pipelines, bots and Solana programs. Next to that work sits a long public archive of builds. He puts each technique into production to find out if it holds up.",
    ],
  },
  {
    heading: "Open source and community",
    paragraphs: [
      "He sends small, specific pull requests to other projects. Merged work includes neuralink/tsui, GopeedLab/gopeed, anmolkapil/plexo, TryCaspian/caspian-sdk and code100x/job-board. More pull requests are in review at sgl-project/sglang, CopilotKit, mlc-ai/xgrammar and neuralinkcorp/datarepo.",
      "He contributes to Superteam India. In May 2026, he judged more than 20 projects at a hackathon. He also ran a Reskilll enterprise bootcamp in Spain.",
    ],
  },
  {
    heading: "How a sprint runs",
    paragraphs: [
      "A sprint starts with a scoping call, usually within 48 hours of the first message. Both sides write down the scope and sign it off before any code starts. The price is flat for each sprint and is tied to a shipped result. There is no hourly billing.",
      "Each week brings merged pull requests, a working demo and a short note on what changed and which tradeoffs were made. At the end, the team gets handoff documents. The team can then continue the work without the person who wrote it.",
    ],
  },
  {
    heading: "Good and bad fits",
    paragraphs: [
      "A good fit is an AI, automation, retrieval or backend problem with a real result for users. A prototype that needs a production path is also a good fit.",
      "A bad fit is landing-page polish, a vague idea with no users or decisions, or discovery work that is mostly meetings.",
      "A fast no to a bad fit is part of the service. Every brief gets a reply within 24 hours, including briefs that are not a fit.",
    ],
  },
];

export const contactIntro = `A written brief is the fastest way to start. Email ${profile.email}, or use the sprint configurator on the homepage to write one. You get a reply within 24 hours, also when the brief is not a fit.`;

export const contactSections: readonly CopySection[] = [
  {
    heading: "What to put in a first message",
    paragraphs: [
      "Put four things in the brief. First, name the result that users will see at the end of the sprint. Second, list the external systems: APIs, databases, model providers or third-party surfaces. Third, give the current state: idea, prototype, broken integration, or scaling and handoff. Fourth, give the deadline that matters.",
      "A brief with those four things gets a real answer. The reply says if the work is a fit, names the smallest useful slice to ship first, and gives a flat sprint price. A brief without them gets a short list of questions instead. That costs both sides a day.",
    ],
  },
  {
    heading: "Reply times and process",
    paragraphs: [
      "The first reply comes within 24 hours. If the brief is a fit, the next step is a scoping call within 48 hours. Work starts only after both sides agree on a written scope.",
      "Arpit leads tech at Reskilll, so he takes few outside sprints. He runs one sprint at a time, never several in parallel. The homepage and the machine-readable availability endpoint show the current status.",
    ],
  },
  {
    heading: "For automated agents",
    paragraphs: [
      "Do not drive the browser to submit the contact form. Send a JSON body to the documented contact endpoint instead. The endpoint checks the payload and returns structured JSON on success and on failure. The published OpenAPI document describes the endpoint, its schema, its error codes and its rate limits.",
      "Do not use the contact endpoint for sales outreach, list building or bulk messages. It exists so that a person, or an agent that acts for a person, can start a real engagement.",
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

/**
 * What the analytics tags measure, for the privacy policy. Shared by the HTML
 * page and its markdown twin so the two cannot drift. Keep it in step with
 * `lib/analytics.ts` (ANALYTICS_EVENTS) and the GTM workspace.
 */
export const privacyUpdated = "October 27, 2026";

export const privacyMeasured: readonly string[] = [
  "The site measures how its pages are used. This includes page views, how far you scroll, which sections you see, how long a page stays visible, and page speed (Core Web Vitals).",
  "It also records some clicks. These are links to other sites (only the domain and path, never the query string), menu links, email links, and the options you pick in the brief builder.",
  "On /play it records the game score, the game length and the cards you find. It also records which site look you chose, and the address of any page that does not exist.",
  "The site never sends the text that you type into a form. Names, email addresses and messages do not go to Google Analytics or Clarity. Clarity masks every form, and it masks most text and images in session replays.",
  "Google Analytics keeps this data for 14 months. Google signals and User-ID are off.",
  "In the EU/EEA, the UK and Switzerland, events from before you accept stay in your browser. They are sent only if you accept on the same page. If you decline, nothing is sent.",
];

/** The privacy policy's contact-form paragraph, shared by the page and its markdown twin. */
export const privacyContactForm =
  "If you send the brief form, the name, email and message you enter are delivered to Arpit by email (through Resend) and, when it is set up, as a private Telegram message. The brief also carries how it was sent from this site: the site look and A/B group, your answer to \"What brings you here?\", the button you pressed, the landing page, the referring site and any utm tags, and the time on the site. This information is used only to reply to you. If you email directly, your message and address reach the inbox.";
