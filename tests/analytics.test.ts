import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ANALYTICS_EVENT_PARAMS,
  ANALYTICS_EVENTS,
  ANALYTICS_PARAM_KEYS,
  buildEventEntry,
  setAnalyticsContext,
  track,
} from "@/lib/analytics";
import {
  classifyLink,
  cleanLinkText,
  ENGAGED_MILESTONES,
  LINK_TEXT_MAX,
  newMilestones,
  pageTypeForPath,
  postSlugForPath,
  readProgress,
  SCROLL_MILESTONES,
  scrollPercent,
  vitalParams,
} from "@/lib/analytics-helpers";

type FakeWindow = { dataLayer?: Record<string, unknown>[]; clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } };

const globalWithWindow = globalThis as unknown as { window?: FakeWindow };

describe("analytics catalog", () => {
  it("documents params for every event, using only known keys", () => {
    for (const name of ANALYTICS_EVENTS) {
      const params = ANALYTICS_EVENT_PARAMS[name];
      expect(params, name).toBeDefined();
      for (const key of params) expect(ANALYTICS_PARAM_KEYS).toContain(key);
    }
  });

  it("has no duplicate event names or param keys", () => {
    expect(new Set(ANALYTICS_EVENTS).size).toBe(ANALYTICS_EVENTS.length);
    expect(new Set(ANALYTICS_PARAM_KEYS).size).toBe(ANALYTICS_PARAM_KEYS.length);
  });

  it("keeps event names within GA4's 40-character snake_case rule", () => {
    for (const name of ANALYTICS_EVENTS) expect(name).toMatch(/^[a-z][a-z0-9_]{0,39}$/);
  });
});

describe("buildEventEntry", () => {
  it("clears every known param so values never leak into the next event", () => {
    const entry = buildEventEntry("cta_click", { cta: "email" });
    expect(entry.event).toBe("cta_click");
    expect(entry.cta).toBe("email");
    expect("percent" in entry).toBe(true);
    expect(entry.percent).toBeUndefined();
  });

  it("drops undefined params without overriding the reset", () => {
    const entry = buildEventEntry("outbound_click", { link_domain: "github.com", section: undefined });
    expect(entry.link_domain).toBe("github.com");
    expect(entry.section).toBeUndefined();
  });

  it("does not reset context keys", () => {
    const entry = buildEventEntry("scroll_depth", { percent: 50 });
    expect("site_world" in entry).toBe(false);
    expect("page_type" in entry).toBe(false);
  });

  it("never lets a param override the event name", () => {
    expect(buildEventEntry("copy", { event: "spoofed" }).event).toBe("copy");
  });
});

describe("track and setAnalyticsContext", () => {
  beforeEach(() => {
    globalWithWindow.window = {};
  });
  afterEach(() => {
    delete globalWithWindow.window;
  });

  it("pushes one dataLayer entry per event and clears the previous event's keys", () => {
    track("scroll_depth", { percent: 75 });
    track("cta_click", { cta: "email" });
    const layer = globalWithWindow.window?.dataLayer ?? [];
    expect(layer).toHaveLength(2);
    expect(layer[1]).toMatchObject({ event: "cta_click", cta: "email" });
    expect(layer[1].percent).toBeUndefined();
    expect("percent" in layer[1]).toBe(true);
  });

  it("queues Clarity calls until clarity.js loads", () => {
    setAnalyticsContext("site_world", "lid");
    track("section_view", { section: "work" });
    expect(globalWithWindow.window?.clarity?.q).toEqual([
      ["set", "site_world", "lid"],
      ["event", "section_view"],
    ]);
    expect(globalWithWindow.window?.dataLayer?.[0]).toEqual({ site_world: "lid" });
  });

  it("re-applies context once when Clarity replaces its function, then sends the event", () => {
    setAnalyticsContext("page_type", "play");
    const calls: unknown[][] = [];
    const loaded = (...args: unknown[]) => {
      calls.push(args);
    };
    (globalWithWindow.window as FakeWindow).clarity = loaded;
    track("faq_open", { item: "pricing" });
    track("copy");
    expect(calls).toContainEqual(["set", "page_type", "play"]);
    expect(calls.filter((call) => call[0] === "set" && call[1] === "page_type")).toHaveLength(1);
    expect(calls.slice(-2)).toEqual([["event", "faq_open"], ["event", "copy"]]);
  });

  it("does nothing without a window", () => {
    delete globalWithWindow.window;
    expect(() => track("copy")).not.toThrow();
    expect(() => setAnalyticsContext("page_type", "home")).not.toThrow();
  });
});

describe("pageTypeForPath", () => {
  it.each([
    ["/", "home"],
    ["/w/lid", "home"],
    ["/writing", "writing_index"],
    ["/writing/", "writing_index"],
    ["/writing/shipping-mcp", "writing_post"],
    ["/docs", "docs"],
    ["/about", "about"],
    ["/contact", "contact"],
    ["/privacy", "privacy"],
    ["/privacy-policy", "privacy"],
    ["/play", "play"],
    ["/nope", "other"],
  ])("%s is %s", (path, expected) => {
    expect(pageTypeForPath(path)).toBe(expected);
  });
});

describe("postSlugForPath", () => {
  it("returns the slug of a post and null elsewhere", () => {
    expect(postSlugForPath("/writing/shipping-mcp")).toBe("shipping-mcp");
    expect(postSlugForPath("/writing/shipping-mcp/")).toBe("shipping-mcp");
    expect(postSlugForPath("/writing")).toBeNull();
    expect(postSlugForPath("/writing/rss.xml")).toBeNull();
    expect(postSlugForPath("/about")).toBeNull();
  });
});

describe("scroll and read progress", () => {
  it("returns null for a page that does not scroll", () => {
    expect(scrollPercent(0, 800, 800)).toBeNull();
  });

  it("measures the viewport's bottom edge against the document", () => {
    expect(scrollPercent(0, 500, 2000)).toBe(25);
    expect(scrollPercent(1500, 500, 2000)).toBe(100);
  });

  it("measures how much of an element is above the viewport bottom", () => {
    expect(readProgress(800, 1000, 800)).toBe(0);
    expect(readProgress(300, 1000, 800)).toBe(50);
    expect(readProgress(-500, 1000, 800)).toBe(100);
    expect(readProgress(0, 0, 800)).toBe(0);
  });
});

describe("newMilestones", () => {
  it("returns every unsent milestone up to the value, in order", () => {
    expect(newMilestones(80, SCROLL_MILESTONES, new Set())).toEqual([25, 50, 75]);
  });

  it("skips milestones already sent", () => {
    expect(newMilestones(95, SCROLL_MILESTONES, new Set([25, 50, 75]))).toEqual([90]);
  });

  it("treats 99.6% as the end of the page", () => {
    expect(newMilestones(99.6, SCROLL_MILESTONES, new Set([25, 50, 75, 90]))).toEqual([100]);
  });

  it("works for engaged seconds", () => {
    expect(newMilestones(61, ENGAGED_MILESTONES, new Set([30]))).toEqual([60]);
    expect(newMilestones(10, ENGAGED_MILESTONES, new Set())).toEqual([]);
  });
});

describe("cleanLinkText", () => {
  it("collapses whitespace and caps the length", () => {
    expect(cleanLinkText("  Read\n   more  ")).toBe("Read more");
    expect(cleanLinkText("x".repeat(100))).toHaveLength(LINK_TEXT_MAX);
    expect(cleanLinkText("   ")).toBeUndefined();
    expect(cleanLinkText(null)).toBeUndefined();
  });
});

describe("classifyLink", () => {
  const page = "https://www.arpitkhandelwal.com/writing";

  it("treats the apex and www hosts as the same site", () => {
    expect(classifyLink("https://arpitkhandelwal.com/about", page)).toEqual({ kind: "internal", path: "/about" });
    expect(classifyLink("/play", page)).toEqual({ kind: "internal", path: "/play" });
  });

  it("strips query strings and fragments from outbound URLs", () => {
    expect(classifyLink("https://cal.com/arpit?name=Jane&email=jane@example.com#x", page)).toEqual({
      kind: "outbound",
      domain: "cal.com",
      url: "https://cal.com/arpit",
    });
  });

  it("recognises mail, phone and other schemes", () => {
    expect(classifyLink("mailto:ak@arpitkhandelwal.com?subject=Hi", page)).toEqual({ kind: "email" });
    expect(classifyLink("tel:+15550100", page)).toEqual({ kind: "phone" });
    expect(classifyLink("javascript:void(0)", page)).toEqual({ kind: "other" });
  });
});

describe("vitalParams", () => {
  it("rounds millisecond metrics", () => {
    expect(vitalParams({ name: "LCP", value: 1234.56, rating: "good", navigationType: "navigate" })).toEqual({
      metric_name: "LCP",
      metric_value: 1235,
      rating: "good",
      navigation_type: "navigate",
    });
  });

  it("scales CLS by 1000 before rounding", () => {
    expect(vitalParams({ name: "CLS", value: 0.0523 })?.metric_value).toBe(52);
  });

  it("ignores metrics outside the reported set", () => {
    expect(vitalParams({ name: "Next.js-hydration", value: 10 })).toBeNull();
    expect(vitalParams({ name: "FID", value: 10 })).toBeNull();
  });
});

describe("linkEventParams", () => {
  it("drops query strings and fragments from link URLs", async () => {
    const { linkEventParams } = await import("@/lib/analytics-helpers");
    expect(linkEventParams("https://github.com/Arpit-Khandelwal?tab=repositories#top")).toEqual({
      link_domain: "github.com",
      link_url: "https://github.com/Arpit-Khandelwal",
    });
    expect(linkEventParams("/play?x=1")).toEqual({ link_domain: "www.arpitkhandelwal.com", link_url: "https://www.arpitkhandelwal.com/play" });
    expect(linkEventParams("mailto:ak@arpitkhandelwal.com?subject=hi").link_url).toBe("mailto:");
  });
});
