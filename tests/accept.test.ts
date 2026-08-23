import { describe, expect, test } from "vitest";
import { MEDIA_HTML, MEDIA_MARKDOWN, negotiateMediaType, parseAcceptHeader } from "@/lib/agent/accept";

describe("parseAcceptHeader", () => {
  test("returns an empty list for a missing or blank header", () => {
    expect(parseAcceptHeader(null)).toEqual([]);
    expect(parseAcceptHeader("")).toEqual([]);
  });

  test("reads q-values and defaults them to 1", () => {
    const ranges = parseAcceptHeader("text/html;q=0.5, text/markdown");
    expect(ranges).toEqual([
      { type: "text", subtype: "html", quality: 0.5, specificity: 2 },
      { type: "text", subtype: "markdown", quality: 1, specificity: 2 },
    ]);
  });

  test("clamps out-of-range and unparsable q-values", () => {
    expect(parseAcceptHeader("text/html;q=9")[0].quality).toBe(1);
    expect(parseAcceptHeader("text/html;q=-2")[0].quality).toBe(0);
    expect(parseAcceptHeader("text/html;q=banana")[0].quality).toBe(1);
  });

  test("classifies wildcard specificity", () => {
    expect(parseAcceptHeader("*/*")[0].specificity).toBe(0);
    expect(parseAcceptHeader("text/*")[0].specificity).toBe(1);
    expect(parseAcceptHeader("text/html")[0].specificity).toBe(2);
  });
});

describe("negotiateMediaType", () => {
  const html = { outcome: "match", mediaType: MEDIA_HTML };
  const markdown = { outcome: "match", mediaType: MEDIA_MARKDOWN };

  test.each([
    ["absent header", null, html],
    ["empty header", "", html],
    ["curl default", "*/*", html],
    [
      "real Chrome header",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      html,
    ],
    ["explicit markdown", "text/markdown", markdown],
    ["markdown preferred by q-value", "text/html;q=0.8, text/markdown;q=0.9", markdown],
    ["html preferred by q-value", "text/markdown;q=0.4, text/html;q=0.9", html],
    ["equal q-values resolve to html", "text/markdown, text/html", html],
    ["text wildcard resolves to html", "text/*", html],
    ["markdown wins over a wildcard fallback", "text/markdown, */*;q=0.1", markdown],
    ["unknown types are ignored when markdown is offered", "application/pdf, text/markdown", markdown],
  ])("%s", (_label, header, expected) => {
    expect(negotiateMediaType(header)).toEqual(expected);
  });

  test.each([
    ["json only", "application/json"],
    ["images only", "image/png, image/webp"],
    ["everything refused", "*/*;q=0"],
    ["both supported types zero-weighted", "text/html;q=0, text/markdown;q=0"],
  ])("rejects %s with not-acceptable", (_label, header) => {
    expect(negotiateMediaType(header)).toEqual({ outcome: "not-acceptable" });
  });

  test("q=0 on html falls through to markdown rather than refusing", () => {
    expect(negotiateMediaType("text/html;q=0, text/markdown")).toEqual(markdown);
  });
});
