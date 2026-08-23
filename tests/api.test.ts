import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { GET as getProfile } from "@/app/api/profile/route";
import { GET as getAvailability } from "@/app/api/availability/route";
import { GET as getServices } from "@/app/api/services/route";
import { GET as getFaq } from "@/app/api/faq/route";
import { GET as getWork } from "@/app/api/work/route";
import { GET as getApiIndex } from "@/app/api/route";
import { GET as getUnknown } from "@/app/api/[...unknown]/route";
import { GET as getContact, POST as postContact } from "@/app/api/contact/route";
import { RATE_LIMIT_POLICIES, resetRateLimits } from "@/lib/api/rate-limit";
import { faqs, profile } from "@/components/portfolio/data";

function request(url: string, init: RequestInit = {}, ip = "203.0.113.1") {
  return new Request(url, {
    ...init,
    headers: { "x-forwarded-for": ip, ...(init.headers as Record<string, string>) },
  });
}

beforeEach(() => resetRateLimits());

describe("read endpoints", () => {
  test.each([
    ["/api/profile", getProfile],
    ["/api/availability", getAvailability],
    ["/api/services", getServices],
    ["/api/faq", getFaq],
    ["/api/work", getWork],
    ["/api", getApiIndex],
  ])("%s returns a JSON success envelope with rate-limit headers", async (path, handler) => {
    const response = await handler(request(`https://www.arpitkhandelwal.com${path}`));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("vary")).toContain("Accept");
    expect(response.headers.get("ratelimit-policy")).toMatch(/q=\d+;w=\d+/);
    expect(response.headers.get("ratelimit")).toMatch(/r=\d+;t=\d+/);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.data).toBeDefined();
  });

  test("getProfile returns the identity fields agents resolve against", async () => {
    const body = await (await getProfile(request("https://www.arpitkhandelwal.com/api/profile"))).json();
    expect(body.data.name).toBe(profile.name);
    expect(body.data.email).toBe(profile.email);
    expect(body.data.links.github).toBe(profile.github);
    expect(body.data.skills.length).toBeGreaterThan(0);
  });

  test("listFaq mirrors the published FAQ", async () => {
    const body = await (await getFaq(request("https://www.arpitkhandelwal.com/api/faq"))).json();
    expect(body.data).toEqual(faqs.map((faq) => ({ question: faq.q, answer: faq.a })));
  });

  test("getServices states both good and bad fits", async () => {
    const body = await (await getServices(request("https://www.arpitkhandelwal.com/api/services"))).json();
    expect(body.data.goodFits.length).toBeGreaterThan(0);
    expect(body.data.badFits.length).toBeGreaterThan(0);
  });
});

describe("listWork query handling", () => {
  test("filters by status", async () => {
    const response = await getWork(request("https://www.arpitkhandelwal.com/api/work?status=shipped"));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.caseStudies.every((item: { status: string }) => item.status === "shipped")).toBe(true);
  });

  test("applies limit", async () => {
    const body = await (await getWork(request("https://www.arpitkhandelwal.com/api/work?limit=2"))).json();
    expect(body.data.caseStudies).toHaveLength(2);
  });

  test.each(["status=nope", "limit=0", "limit=999", "limit=abc"])(
    "rejects %s with a structured 400",
    async (query) => {
      const response = await getWork(request(`https://www.arpitkhandelwal.com/api/work?${query}`));
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe("validation_failed");
      expect(body.error.details.length).toBeGreaterThan(0);
      expect(body.error.documentation).toContain("/docs");
    },
  );
});

describe("unknown API paths", () => {
  test("return JSON rather than the HTML 404 page", async () => {
    const response = await getUnknown();
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body.error.code).toBe("not_found");
    expect(body.error.hint).toContain("/openapi.json");
  });
});

describe("createSprintBrief", () => {
  const url = "https://www.arpitkhandelwal.com/api/contact";
  const valid = { name: "Ada", email: "ada@example.com", message: "MCP server in 4 weeks." };

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("rejects a non-POST method with a JSON 405 and an Allow header", async () => {
    const response = await getContact();
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    expect((await response.json()).error.code).toBe("method_not_allowed");
  });

  test("rejects an unparsable body with invalid_json", async () => {
    const response = await postContact(request(url, { method: "POST", body: "{oops" }));
    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("invalid_json");
  });

  test("reports every missing field at once", async () => {
    const response = await postContact(
      request(url, { method: "POST", body: JSON.stringify({}) }),
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("validation_failed");
    expect(body.error.details.map((detail: { field: string }) => detail.field)).toEqual([
      "name",
      "email",
      "message",
    ]);
  });

  test("rejects a malformed email address", async () => {
    const response = await postContact(
      request(url, { method: "POST", body: JSON.stringify({ ...valid, email: "not-an-email" }) }),
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error.details[0].field).toBe("email");
  });

  test("falls back with delivery_not_configured when no bot is configured", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    const response = await postContact(request(url, { method: "POST", body: JSON.stringify(valid) }));
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body.error.code).toBe("delivery_not_configured");
    expect(body.error.hint).toContain(profile.email);
  });

  test("returns upstream_failure when the provider rejects the message", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "chat");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 400 })));
    const response = await postContact(request(url, { method: "POST", body: JSON.stringify(valid) }));
    expect(response.status).toBe(502);
    expect((await response.json()).error.code).toBe("upstream_failure");
  });

  test("delivers a valid brief and reports the reply window", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "chat");
    const send = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", send);

    const response = await postContact(request(url, { method: "POST", body: JSON.stringify(valid) }));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, data: { delivered: true, replyWindow: expect.any(String) } });
    expect(send).toHaveBeenCalledOnce();
  });
});

describe("rate limiting", () => {
  test("returns 429 with Retry-After once the contact quota is spent", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    const url = "https://www.arpitkhandelwal.com/api/contact";
    const body = JSON.stringify({ name: "Ada", email: "a@b.co", message: "hi" });

    for (let i = 0; i < RATE_LIMIT_POLICIES.contact.limit; i += 1) {
      const response = await postContact(request(url, { method: "POST", body }, "198.51.100.7"));
      expect(response.status).not.toBe(429);
    }

    const blocked = await postContact(request(url, { method: "POST", body }, "198.51.100.7"));
    const blockedBody = await blocked.json();
    expect(blocked.status).toBe(429);
    expect(blockedBody.error.code).toBe("rate_limited");
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    vi.unstubAllEnvs();
  });

  test("counts each client independently", async () => {
    const first = await getProfile(request("https://www.arpitkhandelwal.com/api/profile", {}, "1.1.1.1"));
    const second = await getProfile(request("https://www.arpitkhandelwal.com/api/profile", {}, "2.2.2.2"));
    expect(first.headers.get("ratelimit")).toBe(second.headers.get("ratelimit"));
  });
});
