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
    "I'd like to start a build sprint.",
    `Goal: ${briefGoal}`,
    `Work type: ${sprintType}`,
    `Timeline: ${sprintTimeline}`,
    `Current state: ${sprintStage}`,
    "",
    "What's stuck / context: ",
  ].join("\n");
}

export function buildChecklistText(checklistItems: readonly string[]) {
  return `AI backend sprint checklist\n\n${checklistItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
}

export type ContactResult = "sent" | "fallback";

export async function sendContact(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok ? "sent" : "fallback";
  } catch {
    return "fallback";
  }
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
