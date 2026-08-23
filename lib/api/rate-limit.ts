/**
 * Fixed-window rate limiting with RFC 9331 response headers.
 *
 * Scope note: the counter lives in the module scope of a single serverless
 * instance, so enforcement is per-instance and best-effort. It is enough to
 * blunt a runaway agent retry loop, and the emitted `RateLimit` /
 * `RateLimit-Policy` / `Retry-After` headers are always accurate for the
 * instance that answered. Globally exact limits would need a shared store
 * (Vercel KV / Upstash Redis); see README for the swap point.
 */

export type RateLimitPolicy = {
  /** Policy name echoed in the RateLimit headers. */
  name: string;
  /** Requests permitted per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
};

export const RATE_LIMIT_POLICIES = {
  read: { name: "read", limit: 120, windowSeconds: 60 },
  contact: { name: "contact", limit: 5, windowSeconds: 600 },
} as const satisfies Record<string, RateLimitPolicy>;

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window resets. */
  resetSeconds: number;
  policy: RateLimitPolicy;
};

type Window = { count: number; expiresAt: number };

const windows = new Map<string, Window>();

/** Drops expired windows so the map cannot grow without bound. */
function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.expiresAt <= now) windows.delete(key);
  }
}

export function consumeRateLimit(
  clientKey: string,
  policy: RateLimitPolicy,
  now = Date.now(),
): RateLimitResult {
  if (windows.size > 5000) sweep(now);

  const key = `${policy.name}:${clientKey}`;
  const existing = windows.get(key);
  const window: Window =
    existing && existing.expiresAt > now
      ? existing
      : { count: 0, expiresAt: now + policy.windowSeconds * 1000 };

  window.count += 1;
  windows.set(key, window);

  const resetSeconds = Math.max(0, Math.ceil((window.expiresAt - now) / 1000));
  return {
    allowed: window.count <= policy.limit,
    limit: policy.limit,
    remaining: Math.max(0, policy.limit - window.count),
    resetSeconds,
    policy,
  };
}

/** RFC 9331 headers describing the quota state of the request just served. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const { policy } = result;
  return {
    "RateLimit-Policy": `"${policy.name}";q=${policy.limit};w=${policy.windowSeconds}`,
    RateLimit: `"${policy.name}";r=${result.remaining};t=${result.resetSeconds}`,
  };
}

/** Best-effort client identity: the edge-provided client IP, else a shared bucket. */
export function clientKeyFrom(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "anonymous";
}

/** Test seam: clears all counters. */
export function resetRateLimits() {
  windows.clear();
}
