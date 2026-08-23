import { describe, expect, test } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "@/proxy";
import { AGENT_PAGE_PATHS } from "@/lib/agent/routes";

function call(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(new URL(`https://www.arpitkhandelwal.com${path}`), { headers }));
}

function rewriteTarget(response: Response) {
  const target = response.headers.get("x-middleware-rewrite");
  return target ? new URL(target).pathname : null;
}

describe("matcher coverage", () => {
  test("matches every negotiated page", () => {
    for (const path of AGENT_PAGE_PATHS) {
      expect(config.matcher, path).toContain(path);
    }
  });

  test("matches every markdown twin through one wildcard entry", () => {
    expect(config.matcher).toContain("/:path*.md");
  });

  test("does not match assets, API routes, or the markdown handler", () => {
    for (const entry of config.matcher) {
      expect(entry.startsWith("/api")).toBe(false);
      expect(entry.startsWith("/md")).toBe(false);
      expect(entry.startsWith("/_next")).toBe(false);
    }
  });
});

describe("Accept negotiation", () => {
  test("serves HTML and advertises the markdown alternate by default", () => {
    const response = call("/", { accept: "text/html,application/xhtml+xml,*/*;q=0.8" });
    expect(response.status).toBe(200);
    expect(rewriteTarget(response)).toBeNull();
    expect(response.headers.get("vary")).toContain("Accept");
    expect(response.headers.get("link")).toContain('rel="alternate"; type="text/markdown"');
  });

  test("rewrites to the markdown handler when markdown is preferred", () => {
    const response = call("/about", { accept: "text/markdown" });
    expect(rewriteTarget(response)).toBe("/md/about");
    expect(response.headers.get("vary")).toContain("Accept");
  });

  test("rewrites the homepage to the root markdown handler", () => {
    expect(rewriteTarget(call("/", { accept: "text/markdown" }))).toBe("/md");
  });

  test("honours q-values when choosing between html and markdown", () => {
    expect(rewriteTarget(call("/", { accept: "text/html;q=0.5, text/markdown;q=0.9" }))).toBe("/md");
    expect(rewriteTarget(call("/", { accept: "text/html;q=0.9, text/markdown;q=0.5" }))).toBeNull();
  });

  test("answers 406 with JSON when nothing acceptable can be produced", async () => {
    const response = call("/", { accept: "application/json" });
    expect(response.status).toBe(406);
    expect(response.headers.get("vary")).toContain("Accept");
    const body = await response.json();
    expect(body.error.code).toBe("not_acceptable");
    expect(body.error.hint).toContain("text/markdown");
  });

  test("never 406s a request with no Accept header", () => {
    expect(call("/").status).toBe(200);
  });

  test("passes RSC payload requests through untouched", () => {
    const rsc = call("/", { accept: "text/x-component", RSC: "1" });
    expect(rsc.status).toBe(200);
    expect(rewriteTarget(rsc)).toBeNull();
    expect(rsc.headers.get("link")).toBeNull();

    const prefetch = call("/", { accept: "application/json", "Next-Router-Prefetch": "1" });
    expect(prefetch.status).toBe(200);
  });
});

describe("markdown twins", () => {
  test.each([
    ["/about.md", "/md/about"],
    ["/index.md", "/md"],
    ["/privacy-policy.md", "/md/privacy-policy"],
  ])("%s rewrites to %s", (twin, target) => {
    const response = call(twin);
    expect(rewriteTarget(response)).toBe(target);
    expect(response.headers.get("vary")).toContain("Accept");
  });

  test("an unknown .md path still reaches the markdown handler, which 404s in markdown", () => {
    expect(rewriteTarget(call("/nope.md"))).toBe("/md/nope");
  });

  test("/privacy negotiates like any other page", () => {
    expect(rewriteTarget(call("/privacy", { accept: "text/markdown" }))).toBe("/md/privacy");
  });
});
