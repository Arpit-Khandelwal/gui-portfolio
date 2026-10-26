import { describe, expect, test } from "vitest";
import { buyerModes, selectedWork } from "@/components/portfolio/data";
import { inferAudience } from "@/components/worlds/audience";
import { orderWorkFor } from "@/components/worlds/use-brief";

describe("inferAudience", () => {
  test("a ?for= link wins over everything", () => {
    expect(inferAudience("?for=crypto", "recruiter", "https://www.linkedin.com/")).toEqual({ id: "crypto", source: "param" });
  });

  test("a stored choice wins over the referrer", () => {
    expect(inferAudience("", "ai-team", "https://www.linkedin.com/feed")).toEqual({ id: "ai-team", source: "stored" });
  });

  test("LinkedIn visitors are probably hiring", () => {
    expect(inferAudience("", null, "https://www.linkedin.com/in/someone")).toEqual({ id: "recruiter", source: "referrer" });
    expect(inferAudience("", null, "https://lnkd.in/abc")).toEqual({ id: "recruiter", source: "referrer" });
  });

  test("unknown values and referrers fall back to the default", () => {
    expect(inferAudience("?for=hacker", "nope", "https://x.com/")).toEqual({ id: buyerModes[0].id, source: "default" });
    expect(inferAudience("", null, "")).toEqual({ id: buyerModes[0].id, source: "default" });
  });
});

describe("orderWorkFor", () => {
  test("puts each reader's featured cases first, in order, and keeps every case", () => {
    for (const mode of buyerModes) {
      const ordered = orderWorkFor(mode);
      expect(ordered.slice(0, mode.featured.length).map((work) => work.title)).toEqual([...mode.featured]);
      expect(ordered).toHaveLength(selectedWork.length);
    }
  });

  test("every featured title exists in selectedWork", () => {
    const titles = new Set(selectedWork.map((work) => work.title));
    for (const mode of buyerModes) for (const title of mode.featured) expect(titles.has(title), title).toBe(true);
  });
});
