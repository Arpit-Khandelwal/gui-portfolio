import type { ApiErrorDetail } from "@/lib/api/respond";
import type { WorkQuery } from "@/lib/agent/payloads";

/**
 * Boundary validation for every request that carries input. Pure functions so
 * the rules can be tested without spinning up a route.
 */

export type Validated<T> = { ok: true; value: T } | { ok: false; details: ApiErrorDetail[] };

const WORK_STATUSES = ["shipped", "experiment"] as const;
const MAX_WORK_LIMIT = 50;

export function parseWorkQuery(params: URLSearchParams): Validated<WorkQuery> {
  const details: ApiErrorDetail[] = [];
  const query: WorkQuery = {};

  const status = params.get("status");
  if (status !== null) {
    if ((WORK_STATUSES as readonly string[]).includes(status)) {
      query.status = status as WorkQuery["status"];
    } else {
      details.push({ field: "status", issue: `Must be one of: ${WORK_STATUSES.join(", ")}.` });
    }
  }

  const limit = params.get("limit");
  if (limit !== null) {
    const parsed = Number(limit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_WORK_LIMIT) {
      details.push({ field: "limit", issue: `Must be an integer between 1 and ${MAX_WORK_LIMIT}.` });
    } else {
      query.limit = parsed;
    }
  }

  return details.length ? { ok: false, details } : { ok: true, value: query };
}

export type ContactInput = { name: string; email: string; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_LIMITS = { name: 120, email: 200, message: 5000 } as const;

export function parseContactBody(body: unknown): Validated<ContactInput> {
  const details: ApiErrorDetail[] = [];
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, details: [{ field: "body", issue: "Expected a JSON object." }] };
  }

  const record = body as Record<string, unknown>;
  const read = (field: keyof typeof FIELD_LIMITS) => {
    const raw = record[field];
    if (typeof raw !== "string" || raw.trim() === "") {
      details.push({ field, issue: "Required, and must be a non-empty string." });
      return "";
    }
    const value = raw.trim();
    if (value.length > FIELD_LIMITS[field]) {
      details.push({ field, issue: `Must be at most ${FIELD_LIMITS[field]} characters.` });
      return "";
    }
    return value;
  };

  const name = read("name");
  const email = read("email");
  const message = read("message");

  if (email && !EMAIL_PATTERN.test(email)) {
    details.push({ field: "email", issue: "Must be a valid email address so a reply can be delivered." });
  }

  return details.length ? { ok: false, details } : { ok: true, value: { name, email, message } };
}
