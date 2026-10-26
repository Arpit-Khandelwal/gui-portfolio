import { afterEach, describe, expect, test, vi } from "vitest";
import { parseLeadContext } from "@/lib/api/lead-context";
import { deliverLead, leadEmailHtml, leadSubject, LEAD_EMAIL_TO_DEFAULT } from "@/lib/api/lead-delivery";
import { parseContactBody } from "@/lib/api/validate";

const lead = {
  name: "Ada <script>",
  email: "ada@example.com",
  message: "MCP server in 4 weeks.",
  context: { world: "patent", audience: "recruiter", cta: "resume", section: "hero", abCohort: "patent", referrer: "https://www.linkedin.com/" },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseLeadContext", () => {
  test("keeps known keys, drops unknown ones, clips and cleans values", () => {
    const parsed = parseLeadContext({ world: "lid", evil: "x", referrer: "a\u0000b" + "c".repeat(400), audience: "" });
    expect(parsed).toEqual({ world: "lid", referrer: ("a b" + "c".repeat(400)).slice(0, 300) });
  });

  test("ignores non-objects", () => {
    expect(parseLeadContext("nope")).toBeUndefined();
    expect(parseLeadContext([1])).toBeUndefined();
    expect(parseLeadContext({})).toBeUndefined();
  });

  test("a bad context never fails the brief", () => {
    const result = parseContactBody({ name: "A", email: "a@example.com", message: "m", context: 42 });
    expect(result).toEqual({ ok: true, value: { name: "A", email: "a@example.com", message: "m" } });
  });
});

describe("lead email", () => {
  test("the subject names the look, the reader and the button", () => {
    expect(leadSubject(lead)).toBe("[Lead · Patent · Recruiter · resume @ hero] Ada <script>");
  });

  test("the HTML escapes visitor input", () => {
    const html = leadEmailHtml(lead);
    expect(html).not.toContain("<script>");
    expect(html).toContain("Ada &lt;script&gt;");
    expect(html).toContain("A/B cohort");
  });
});

describe("deliverLead", () => {
  test("reports nothing configured when no channel has credentials", async () => {
    expect(await deliverLead(lead, {})).toEqual({ configured: [], delivered: [] });
  });

  test("emails via Resend with reply-to, tags and the default inbox", async () => {
    const send = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", send);
    const result = await deliverLead(lead, { RESEND_KEY: "re_test" });
    expect(result).toEqual({ configured: ["email"], delivered: ["email"] });
    const [url, init] = send.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String(init.body));
    expect(body.to).toEqual([LEAD_EMAIL_TO_DEFAULT]);
    expect(body.reply_to).toBe("ada@example.com");
    expect(body.tags).toContainEqual({ name: "world", value: "patent" });
  });

  test("one channel failing does not lose the lead", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => new Response("{}", { status: String(url).includes("resend") ? 500 : 200 })),
    );
    const result = await deliverLead(lead, { RESEND_KEY: "re_test", TELEGRAM_BOT_TOKEN: "t", TELEGRAM_CHAT_ID: "c" });
    expect(result).toEqual({ configured: ["email", "telegram"], delivered: ["telegram"] });
  });
});
