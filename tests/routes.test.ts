import { describe, expect, test } from "vitest";
import {
  AGENT_PAGE_PATHS,
  markdownHandlerPath,
  markdownTwinBase,
  markdownTwinPath,
  isNegotiablePath,
  normalisePagePath,
  pagePathForMarkdownTwin,
} from "@/lib/agent/routes";
import { AGENT_DOCUMENT_PATHS } from "@/lib/agent/markdown";

describe("agent page routes", () => {
  test("the edge-safe static path list matches the static markdown document registry", () => {
    expect([...AGENT_PAGE_PATHS].sort()).toEqual([...AGENT_DOCUMENT_PATHS].sort());
  });

  test("post paths are negotiable by prefix, since the edge cannot read the filesystem", () => {
    expect(isNegotiablePath("/writing")).toBe(true);
    expect(isNegotiablePath("/writing/some-post")).toBe(true);
    expect(isNegotiablePath("/writingfoo")).toBe(false);
    expect(isNegotiablePath("/nope")).toBe(false);
  });

  test("maps a post markdown twin back to its post path", () => {
    expect(pagePathForMarkdownTwin("/writing/some-post.md")).toBe("/writing/some-post");
  });

  test("normalises trailing slashes", () => {
    expect(normalisePagePath("/about/")).toBe("/about");
    expect(normalisePagePath("/")).toBe("/");
    expect(normalisePagePath("")).toBe("/");
  });

  test.each([
    ["/about.md", "/about"],
    ["/index.md", "/"],
    ["/privacy-policy.md", "/privacy-policy"],
  ])("maps the markdown twin %s to %s", (twin, page) => {
    expect(pagePathForMarkdownTwin(twin)).toBe(page);
  });

  test.each(["/about", "/unknown.md", "/readme.md", "/api/contact"])(
    "returns null for %s",
    (path) => {
      expect(pagePathForMarkdownTwin(path)).toBeNull();
    },
  );

  test("markdownTwinBase keeps unknown .md paths so the handler owns their 404", () => {
    expect(markdownTwinBase("/unknown.md")).toBe("/unknown");
    expect(markdownTwinBase("/index.md")).toBe("/");
    expect(markdownTwinBase("/about")).toBeNull();
  });

  test("advertises the twin URL for a page path", () => {
    expect(markdownTwinPath("/")).toBe("/index.md");
    expect(markdownTwinPath("/about")).toBe("/about.md");
  });

  test("maps page paths onto the markdown handler", () => {
    expect(markdownHandlerPath("/")).toBe("/md");
    expect(markdownHandlerPath("/docs")).toBe("/md/docs");
  });
});
