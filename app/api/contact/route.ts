import { availability, profile } from "@/components/portfolio/data";
import { RATE_LIMIT_POLICIES } from "@/lib/api/rate-limit";
import { guardRateLimit, jsonError, jsonOk, methodNotAllowed } from "@/lib/api/respond";
import { parseContactBody } from "@/lib/api/validate";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  const limit = guardRateLimit(request, RATE_LIMIT_POLICIES.contact);
  if (limit.blocked) return limit.blocked;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body was not valid JSON.", {
      hint: "Send a JSON object with content-type: application/json.",
      headers: limit.headers,
    });
  }

  const parsed = parseContactBody(raw);
  if (!parsed.ok) {
    return jsonError(400, "validation_failed", "The brief is missing required fields or has invalid values.", {
      hint: "name, email, and message are all required. See the createSprintBrief operation in /openapi.json.",
      details: parsed.details,
      headers: limit.headers,
    });
  }

  const { name, email, message } = parsed.value;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // No bot configured: tell the client to fall back to mailto.
    return jsonError(503, "delivery_not_configured", "Contact delivery is not configured on the server.", {
      hint: `Email ${profile.email} directly instead.`,
      headers: limit.headers,
    });
  }

  const text = [
    "<b>🆕 New sprint brief</b>",
    "",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    "",
    escapeHtml(message),
  ].join("\n");

  let res: Response;
  try {
    res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch {
    return jsonError(502, "upstream_failure", "Could not reach the delivery provider.", {
      hint: `Retry once, then email ${profile.email} directly.`,
      headers: limit.headers,
    });
  }

  if (!res.ok) {
    return jsonError(502, "upstream_failure", "The delivery provider rejected the message.", {
      hint: `Retry once, then email ${profile.email} directly.`,
      headers: limit.headers,
    });
  }

  return jsonOk({ delivered: true, replyWindow: availability.reply }, { headers: limit.headers });
}

export async function GET() {
  return methodNotAllowed(["POST"]);
}
