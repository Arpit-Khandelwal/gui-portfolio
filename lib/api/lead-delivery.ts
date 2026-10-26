import { LEAD_CONTEXT_KEYS, LEAD_CONTEXT_LABELS, type LeadContext } from "./lead-context";

/**
 * Delivers a sprint brief to every configured channel in parallel: email via
 * Resend and a Telegram message. The brief counts as delivered when at least
 * one channel accepts it.
 */
export interface Lead {
  name: string;
  email: string;
  message: string;
  context?: LeadContext;
}

export type Channel = "email" | "telegram";

export interface DeliveryResult {
  configured: Channel[];
  delivered: Channel[];
}

export const LEAD_EMAIL_FROM = "Website leads <leads@arpitkhandelwal.com>";
export const LEAD_EMAIL_TO_DEFAULT = "website.lead@arpitkhandelwal.com";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Title case for a world or audience id: "ai-team" → "Ai team". */
function pretty(value: string | undefined): string | null {
  if (!value) return null;
  const spaced = value.replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** "[Lead · Patent · Recruiter · hero] Ada Lovelace" — filterable in any inbox. */
export function leadSubject(lead: Lead): string {
  const c = lead.context ?? {};
  const tags = [pretty(c.world), pretty(c.audience), c.cta ? `${c.cta}${c.section ? ` @ ${c.section}` : ""}` : null].filter(Boolean);
  return `[Lead${tags.length ? ` · ${tags.join(" · ")}` : ""}] ${lead.name}`.slice(0, 200);
}

function contextRows(context: LeadContext | undefined): [string, string][] {
  if (!context) return [];
  return LEAD_CONTEXT_KEYS.flatMap((key) => (context[key] ? [[LEAD_CONTEXT_LABELS[key], context[key] as string] as [string, string]] : []));
}

export function leadEmailText(lead: Lead): string {
  const rows = contextRows(lead.context);
  return [
    `New sprint brief from ${lead.name} <${lead.email}>`,
    "",
    lead.message,
    "",
    ...(rows.length ? ["How this lead arrived", ...rows.map(([k, v]) => `- ${k}: ${v}`)] : []),
    "",
    "Reply to this email to answer the sender directly.",
  ].join("\n");
}

export function leadEmailHtml(lead: Lead): string {
  const rows = contextRows(lead.context)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`)
    .join("");
  return [
    `<div style="font-family:Georgia,serif;font-size:15px;line-height:1.5;color:#141414;max-width:640px">`,
    `<p style="font-family:'Courier New',monospace;font-size:12px;color:#c8261a;margin:0 0 8px">NEW SPRINT BRIEF</p>`,
    `<h1 style="font-size:22px;font-weight:400;margin:0 0 4px">${escapeHtml(lead.name)}</h1>`,
    `<p style="margin:0 0 16px"><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>`,
    `<pre style="white-space:pre-wrap;font-family:'Courier New',monospace;font-size:14px;background:#f4f5f2;border:1px solid #141414;padding:12px;margin:0 0 20px">${escapeHtml(lead.message)}</pre>`,
    rows ? `<p style="font-family:'Courier New',monospace;font-size:12px;margin:0 0 6px">HOW THIS LEAD ARRIVED</p><table style="font-size:14px;border-collapse:collapse">${rows}</table>` : "",
    `<p style="color:#555;font-size:13px;margin-top:20px">Reply to this email to answer the sender directly.</p>`,
    `</div>`,
  ].join("");
}

/** Resend tags allow only ASCII letters, numbers, underscores and dashes. */
function tagValue(value: string | undefined): string {
  return (value ?? "unknown").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 256) || "unknown";
}

async function sendEmail(lead: Lead, apiKey: string, to: string): Promise<boolean> {
  const c = lead.context ?? {};
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: LEAD_EMAIL_FROM,
      to: [to],
      reply_to: lead.email,
      subject: leadSubject(lead),
      text: leadEmailText(lead),
      html: leadEmailHtml(lead),
      tags: [
        { name: "world", value: tagValue(c.world) },
        { name: "audience", value: tagValue(c.audience) },
        { name: "ab_cohort", value: tagValue(c.abCohort) },
        { name: "cta", value: tagValue(c.cta) },
      ],
    }),
  });
  return response.ok;
}

async function sendTelegram(lead: Lead, token: string, chatId: string): Promise<boolean> {
  const c = lead.context ?? {};
  const meta = [c.world && `look: ${c.world}`, c.audience && `reader: ${c.audience}`, c.cta && `via: ${c.cta}`].filter(Boolean).join(" · ");
  const text = [
    "<b>🆕 New sprint brief</b>",
    meta ? `<i>${escapeHtml(meta)}</i>` : "",
    "",
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    `<b>Email:</b> ${escapeHtml(lead.email)}`,
    "",
    escapeHtml(lead.message),
  ].join("\n");
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  return response.ok;
}

/** Never throws: a channel that errors counts as not delivered. */
export async function deliverLead(lead: Lead, env: Readonly<Record<string, string | undefined>> = process.env): Promise<DeliveryResult> {
  const resendKey = env.RESEND_API_KEY || env.RESEND_KEY;
  const telegramToken = env.TELEGRAM_BOT_TOKEN;
  const telegramChat = env.TELEGRAM_CHAT_ID;

  const jobs: [Channel, () => Promise<boolean>][] = [];
  if (resendKey) jobs.push(["email", () => sendEmail(lead, resendKey, env.LEAD_EMAIL_TO || LEAD_EMAIL_TO_DEFAULT)]);
  if (telegramToken && telegramChat) jobs.push(["telegram", () => sendTelegram(lead, telegramToken, telegramChat)]);

  const outcomes = await Promise.all(jobs.map(([, run]) => run().catch(() => false)));
  return {
    configured: jobs.map(([channel]) => channel),
    delivered: jobs.filter((_, index) => outcomes[index]).map(([channel]) => channel),
  };
}
