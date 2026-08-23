import { describe, expect, test } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { GET as getMarkdown } from "@/app/md/[[...slug]]/route";
import { AGENT_PAGE_PATHS } from "@/lib/agent/routes";
import { SITE_URL, absoluteUrl } from "@/lib/site";

describe("robots.txt", () => {
  const rules = robots();

  test("points at the canonical host, not the redirecting apex", () => {
    expect(rules.host).toBe(SITE_URL);
    expect(rules.sitemap).toBe(absoluteUrl("/sitemap.xml"));
  });

  test("allows every crawler through the wildcard rule", () => {
    const wildcard = (rules.rules as { userAgent: string | string[]; allow?: string }[])[0];
    expect(wildcard.userAgent).toBe("*");
    expect(wildcard.allow).toBe("/");
  });

  test("names every agent the audit reported as blocked", () => {
    const named = (rules.rules as { userAgent: string | string[] }[])[1].userAgent as string[];
    for (const agent of [
      "GPTBot",
      "ChatGPT-User",
      "ClaudeBot",
      "PerplexityBot",
      "Google-Extended",
      "Applebot-Extended",
      "DeepSeekBot",
      "ora-agent",
    ]) {
      expect(named, agent).toContain(agent);
    }
  });
});

describe("sitemap.xml", () => {
  const entries = sitemap();

  test("lists every canonical page route on the canonical host with a lastmod", () => {
    const urls = entries.map((entry) => entry.url);
    // /privacy is an alias whose canonical is /privacy-policy, so it is
    // deliberately absent: a sitemap should list canonical URLs only.
    const canonicalPages = AGENT_PAGE_PATHS.filter((path) => path !== "/privacy");
    for (const path of canonicalPages) {
      expect(urls, path).toContain(absoluteUrl(path));
    }
    expect(urls).not.toContain(absoluteUrl("/privacy"));
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
    }
  });

  test("never advertises the redirecting apex", () => {
    for (const entry of entries) {
      expect(entry.url).not.toMatch(/^https:\/\/arpitkhandelwal\.com/);
    }
  });
});

describe("markdown handler", () => {
  async function render(slug?: string[]) {
    return getMarkdown(new Request("https://www.arpitkhandelwal.com/md"), {
      params: Promise.resolve({ slug }),
    });
  }

  test("serves text/markdown with Vary: Accept and a canonical Link", async () => {
    const response = await render(["about"]);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("link")).toBe(`<${absoluteUrl("/about")}>; rel="canonical"`);
    expect(await response.text()).toContain("# About");
  });

  test("serves the homepage document for an empty slug", async () => {
    const response = await render(undefined);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("canonical: " + absoluteUrl("/"));
  });

  test("uses the aliased canonical for /privacy", async () => {
    const response = await render(["privacy"]);
    expect(response.status).toBe(200);
    expect(response.headers.get("link")).toBe(`<${absoluteUrl("/privacy-policy")}>; rel="canonical"`);
    expect(await response.text()).toContain(`canonical: ${absoluteUrl("/privacy-policy")}`);
  });

  test("404s in markdown, not HTML, for an unknown document", async () => {
    const response = await render(["nope"]);
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(await response.text()).toContain("# Not found");
  });
});
