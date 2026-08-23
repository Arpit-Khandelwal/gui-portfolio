import { describe, expect, test } from "vitest";
import { toYaml } from "@/lib/agent/yaml";

describe("toYaml", () => {
  test("emits nested objects with two-space indentation", () => {
    expect(toYaml({ a: { b: 1 } })).toBe('"a":\n  "b": 1\n');
  });

  test("emits scalar arrays as block sequences", () => {
    expect(toYaml({ a: ["x", "y"] })).toBe('"a":\n  - "x"\n  - "y"\n');
  });

  test("emits object arrays as indented sequence items", () => {
    expect(toYaml({ a: [{ b: 1 }] })).toBe('"a":\n  -\n    "b": 1\n');
  });

  test("renders empty containers inline", () => {
    expect(toYaml({ a: [], b: {} })).toBe('"a": []\n"b": {}\n');
  });

  test("quotes values that would otherwise change type or break parsing", () => {
    const yaml = toYaml({ version: "3.1.0", note: "a: b # c", yes: "true" });
    expect(yaml).toContain('"version": "3.1.0"');
    expect(yaml).toContain('"note": "a: b # c"');
    expect(yaml).toContain('"yes": "true"');
  });

  test("preserves booleans, numbers and null as YAML scalars", () => {
    expect(toYaml({ a: true, b: 2, c: null })).toBe('"a": true\n"b": 2\n"c": null\n');
  });

  test("drops undefined the way JSON does", () => {
    expect(toYaml({ a: 1, b: undefined })).toBe('"a": 1\n');
  });
});

describe("YAML round-trip against a real parser", () => {
  test("the published OpenAPI document parses back to an identical object", async () => {
    const { load } = await import("js-yaml");
    const { buildOpenApiDocument } = await import("@/lib/agent/openapi");
    const document = buildOpenApiDocument();
    expect(load(toYaml(document))).toEqual(JSON.parse(JSON.stringify(document)));
  });

  test("awkward scalars survive a round-trip", async () => {
    const { load } = await import("js-yaml");
    const awkward = {
      colon: "a: b",
      hash: "value # not a comment",
      dash: "- leading dash",
      numeric: "3.1.0",
      boolish: "no",
      multiline: "line one\nline two",
      unicode: "Arpit Khandelwal — em dash",
      quote: 'he said "hi"',
      empty: "",
    };
    expect(load(toYaml(awkward))).toEqual(awkward);
  });
});
