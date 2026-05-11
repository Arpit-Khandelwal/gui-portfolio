import type { BuyerMode } from "./types";

export function buildSprintBrief({
  briefGoal,
  sprintType,
  sprintTimeline,
  sprintStage,
}: {
  briefGoal: BuyerMode["briefGoal"];
  sprintType: string;
  sprintTimeline: string;
  sprintStage: string;
}) {
  return [
    "Hey Arpit, I need help with a build sprint.",
    `Goal: ${briefGoal}`,
    `Work type: ${sprintType}`,
    `Timeline: ${sprintTimeline}`,
    `Current state: ${sprintStage}`,
    "Blocker:",
    "Stack:",
    "Can you help scope what can ship first?",
  ].join("\n");
}

export function buildApiSnippet({
  buyerLabel,
  sprintType,
  sprintTimeline,
}: {
  buyerLabel: string;
  sprintType: string;
  sprintTimeline: string;
}) {
  return `await hire("Arpit", {
  mode: "${buyerLabel}",
  sprint: "${sprintType}",
  timeline: "${sprintTimeline}",
  output: ["scoped plan", "merged PRs", "weekly demos", "handoff notes"]
});`;
}

export function buildChecklistText(checklistItems: readonly string[]) {
  return `AI backend sprint checklist\n\n${checklistItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
}

export function getAgentAnswer(question: string) {
  const lower = question.toLowerCase();

  if (lower.includes("mcp") || lower.includes("browser") || lower.includes("automation")) {
    return "Yes. The strongest proof is the Swiggy MCP server work: Playwright-backed browser sessions exposed through an MCP-style control layer for an AI concierge.";
  }

  if (lower.includes("solana") || lower.includes("crypto") || lower.includes("privacy") || lower.includes("zk")) {
    return "Yes, with product framing. The relevant proof is Helius Indexer, AgentPay, Dark Payroll, encrypted games, and Solana/Arcium/ZK experiments.";
  }

  if (lower.includes("backend") || lower.includes("api") || lower.includes("auth")) {
    return "Yes. Reskilll is the best signal: auth, Google OAuth, profile APIs, dashboard/profile editing, CMS console, judging, and submission flows.";
  }

  if (lower.includes("rate") || lower.includes("price") || lower.includes("cost")) {
    return "The site intentionally does not publish rates. The best next step is to DM the goal, stack, deadline, and what is stuck so the sprint can be scoped first.";
  }

  return "Likely, if the work involves AI agents, backend APIs, browser automation, product infrastructure, or integration-heavy execution. Send the goal, current stack, deadline, and blocker.";
}

export async function copyText(text: string, onSuccess: (value: boolean) => void) {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess(true);
    window.setTimeout(() => onSuccess(false), 1800);
  } catch {
    onSuccess(false);
  }
}
