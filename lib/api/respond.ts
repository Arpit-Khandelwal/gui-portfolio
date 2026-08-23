import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site";
import {
  clientKeyFrom,
  consumeRateLimit,
  rateLimitHeaders,
  type RateLimitPolicy,
  type RateLimitResult,
} from "@/lib/api/rate-limit";

/**
 * Every API response — success or failure — is JSON in one shape, so an agent
 * can branch on `ok` and on a stable `error.code` instead of parsing prose or,
 * worse, an HTML error page.
 */

export type ApiErrorCode =
  | "invalid_json"
  | "validation_failed"
  | "method_not_allowed"
  | "not_found"
  | "not_acceptable"
  | "rate_limited"
  | "delivery_not_configured"
  | "upstream_failure";

export type ApiErrorDetail = { field: string; issue: string };

export type ApiErrorBody = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    hint?: string;
    details?: readonly ApiErrorDetail[];
    documentation: string;
  };
};

const DOCS_URL = absoluteUrl("/docs");

const BASE_HEADERS: Record<string, string> = {
  // Machine-readable variants of this resource, so a crawler that only reads
  // headers can still find the spec.
  Link: `<${absoluteUrl("/openapi.json")}>; rel="service-desc"; type="application/json", <${DOCS_URL}>; rel="describedby"`,
  Vary: "Accept",
};

export function jsonOk<T>(
  data: T,
  options: { status?: number; headers?: Record<string, string>; meta?: Record<string, unknown> } = {},
) {
  const body = options.meta ? { ok: true as const, data, meta: options.meta } : { ok: true as const, data };
  return NextResponse.json(body, {
    status: options.status ?? 200,
    headers: { ...BASE_HEADERS, ...options.headers },
  });
}

export function jsonError(
  status: number,
  code: ApiErrorCode,
  message: string,
  options: { hint?: string; details?: readonly ApiErrorDetail[]; headers?: Record<string, string> } = {},
) {
  const body: ApiErrorBody = {
    ok: false,
    error: {
      code,
      message,
      ...(options.hint ? { hint: options.hint } : {}),
      ...(options.details?.length ? { details: options.details } : {}),
      documentation: DOCS_URL,
    },
  };
  return NextResponse.json(body, {
    status,
    headers: { ...BASE_HEADERS, ...options.headers },
  });
}

export function rateLimited(result: RateLimitResult) {
  return jsonError(429, "rate_limited", "Too many requests from this client.", {
    hint: `Wait ${result.resetSeconds} seconds, then retry. Read the RateLimit header to self-throttle.`,
    headers: {
      ...rateLimitHeaders(result),
      "Retry-After": String(result.resetSeconds),
    },
  });
}

/**
 * Applies a rate-limit policy and returns either a ready-made 429 or the
 * headers to attach to the successful response.
 */
export function guardRateLimit(request: Request, policy: RateLimitPolicy) {
  const result = consumeRateLimit(clientKeyFrom(request), policy);
  if (!result.allowed) return { blocked: rateLimited(result) } as const;
  return { blocked: null, headers: rateLimitHeaders(result) } as const;
}

export function methodNotAllowed(allowed: readonly string[]) {
  return jsonError(405, "method_not_allowed", `Method not allowed. Use ${allowed.join(" or ")}.`, {
    hint: `See ${absoluteUrl("/openapi.json")} for the supported operations on this path.`,
    headers: { Allow: allowed.join(", ") },
  });
}
