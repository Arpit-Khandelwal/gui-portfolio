import { beforeEach, describe, expect, test } from "vitest";
import {
  clientKeyFrom,
  consumeRateLimit,
  rateLimitHeaders,
  resetRateLimits,
} from "@/lib/api/rate-limit";

const policy = { name: "test", limit: 2, windowSeconds: 60 };

beforeEach(() => resetRateLimits());

describe("consumeRateLimit", () => {
  test("allows requests up to the limit and reports the remaining quota", () => {
    expect(consumeRateLimit("a", policy, 0)).toMatchObject({ allowed: true, remaining: 1 });
    expect(consumeRateLimit("a", policy, 0)).toMatchObject({ allowed: true, remaining: 0 });
    expect(consumeRateLimit("a", policy, 0)).toMatchObject({ allowed: false, remaining: 0 });
  });

  test("keeps separate counters per client and per policy", () => {
    consumeRateLimit("a", policy, 0);
    consumeRateLimit("a", policy, 0);
    expect(consumeRateLimit("b", policy, 0).allowed).toBe(true);
    expect(consumeRateLimit("a", { ...policy, name: "other" }, 0).allowed).toBe(true);
  });

  test("starts a fresh window once the old one expires", () => {
    consumeRateLimit("a", policy, 0);
    consumeRateLimit("a", policy, 0);
    expect(consumeRateLimit("a", policy, 0).allowed).toBe(false);
    expect(consumeRateLimit("a", policy, 61_000).allowed).toBe(true);
  });

  test("counts down the reset window", () => {
    expect(consumeRateLimit("a", policy, 0).resetSeconds).toBe(60);
    expect(consumeRateLimit("a", policy, 30_000).resetSeconds).toBe(30);
  });
});

describe("rateLimitHeaders", () => {
  test("emits RFC 9331 formatted headers", () => {
    const result = consumeRateLimit("a", policy, 0);
    expect(rateLimitHeaders(result)).toEqual({
      "RateLimit-Policy": '"test";q=2;w=60',
      RateLimit: '"test";r=1;t=60',
    });
  });
});

describe("clientKeyFrom", () => {
  test("uses the first x-forwarded-for hop", () => {
    const request = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.9, 70.41.3.18" },
    });
    expect(clientKeyFrom(request)).toBe("203.0.113.9");
  });

  test("falls back to x-real-ip and then to a shared bucket", () => {
    expect(clientKeyFrom(new Request("https://e.com", { headers: { "x-real-ip": "5.5.5.5" } }))).toBe("5.5.5.5");
    expect(clientKeyFrom(new Request("https://e.com"))).toBe("anonymous");
  });
});
