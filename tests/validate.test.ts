import { describe, expect, test } from "vitest";
import { parseContactBody, parseWorkQuery } from "@/lib/api/validate";

describe("parseWorkQuery", () => {
  test("accepts an empty query", () => {
    expect(parseWorkQuery(new URLSearchParams())).toEqual({ ok: true, value: {} });
  });

  test("accepts valid status and limit", () => {
    expect(parseWorkQuery(new URLSearchParams("status=experiment&limit=3"))).toEqual({
      ok: true,
      value: { status: "experiment", limit: 3 },
    });
  });

  test.each(["status=Shipped", "status=", "status=other"])("rejects %s", (query) => {
    const result = parseWorkQuery(new URLSearchParams(query));
    expect(result.ok).toBe(false);
  });

  test.each(["limit=0", "limit=51", "limit=1.5", "limit=", "limit=abc"])("rejects %s", (query) => {
    const result = parseWorkQuery(new URLSearchParams(query));
    expect(result.ok).toBe(false);
  });

  test("reports every invalid parameter in one response", () => {
    const result = parseWorkQuery(new URLSearchParams("status=x&limit=0"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.details.map((d) => d.field)).toEqual(["status", "limit"]);
  });
});

describe("parseContactBody", () => {
  const valid = { name: "Ada", email: "ada@example.com", message: "Ship an MCP server." };

  test("accepts a well-formed brief and trims whitespace", () => {
    expect(parseContactBody({ ...valid, name: "  Ada  " })).toEqual({ ok: true, value: valid });
  });

  test.each([null, "string", 42, ["a"]])("rejects a non-object body: %s", (body) => {
    const result = parseContactBody(body);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.details[0].field).toBe("body");
  });

  test.each(["name", "email", "message"])("requires %s", (field) => {
    const result = parseContactBody({ ...valid, [field]: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.details.some((d) => d.field === field)).toBe(true);
  });

  test("rejects non-string fields", () => {
    const result = parseContactBody({ ...valid, name: 5 });
    expect(result.ok).toBe(false);
  });

  test.each(["nope", "a@b", "a b@c.co", "@example.com"])("rejects the email %s", (email) => {
    expect(parseContactBody({ ...valid, email }).ok).toBe(false);
  });

  test("enforces length caps so an agent cannot post a novel", () => {
    expect(parseContactBody({ ...valid, message: "x".repeat(5001) }).ok).toBe(false);
    expect(parseContactBody({ ...valid, message: "x".repeat(5000) }).ok).toBe(true);
    expect(parseContactBody({ ...valid, name: "x".repeat(121) }).ok).toBe(false);
  });
});
