import { describe, expect, test } from "vitest";
import { buildOpenApiDocument } from "@/lib/agent/openapi";
import { toYaml } from "@/lib/agent/yaml";
import { SITE_URL } from "@/lib/site";

const document = buildOpenApiDocument();

type Operation = {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: { name: string; in: string; schema: object; description?: string }[];
  responses: Record<string, { content?: Record<string, { schema: object }> }>;
};

function operations(): [string, string, Operation][] {
  return Object.entries(document.paths).flatMap(([path, methods]) =>
    Object.entries(methods as Record<string, Operation>).map(
      ([method, operation]) => [path, method, operation] as [string, string, Operation],
    ),
  );
}

describe("OpenAPI document", () => {
  test("declares OpenAPI 3.1 and the canonical server", () => {
    expect(document.openapi).toBe("3.1.0");
    expect(document.servers[0].url).toBe(SITE_URL);
  });

  test("documents when to use the API and its auth model", () => {
    expect(document.info.description).toContain("When to use this API");
    expect(document.info.description).toContain("Authentication");
    expect(document.info.description).toContain("Rate limits");
  });

  test("every operation has a unique operationId", () => {
    const ids = operations().map(([, , operation]) => operation.operationId);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every operation carries a summary and a description", () => {
    for (const [path, method, operation] of operations()) {
      expect(operation.summary, `${method} ${path} summary`).toBeTruthy();
      expect((operation.description ?? "").length, `${method} ${path} description`).toBeGreaterThan(40);
    }
  });

  test("every operation returns a typed 200 schema", () => {
    for (const [path, method, operation] of operations()) {
      const ok = operation.responses["200"];
      expect(ok, `${method} ${path} 200`).toBeDefined();
      expect(ok.content?.["application/json"]?.schema, `${method} ${path} schema`).toBeDefined();
    }
  });

  test("every declared parameter is typed and described", () => {
    for (const [path, method, operation] of operations()) {
      for (const parameter of operation.parameters ?? []) {
        expect(parameter.schema, `${method} ${path} ${parameter.name}`).toBeDefined();
        expect(parameter.description, `${method} ${path} ${parameter.name}`).toBeTruthy();
        expect(["query", "path", "header"]).toContain(parameter.in);
      }
    }
  });

  test("every $ref resolves to a defined component schema", () => {
    const refs = JSON.stringify(document).match(/"#\/components\/schemas\/[A-Za-z]+"/g) ?? [];
    const names = new Set(refs.map((ref) => ref.replace(/"|#\/components\/schemas\//g, "")));
    expect(names.size).toBeGreaterThan(0);
    for (const name of names) {
      expect(document.components.schemas, name).toHaveProperty(name);
    }
  });

  test("documents the rate-limit headers agents should self-throttle on", () => {
    const availability = document.paths["/api/availability"].get.responses["200"];
    expect(availability.headers).toHaveProperty("RateLimit");
    expect(availability.headers).toHaveProperty("RateLimit-Policy");
    expect(document.paths["/api/availability"].get.responses["429"].headers).toHaveProperty("Retry-After");
  });

  test("the error schema enumerates machine-readable codes", () => {
    const codes = document.components.schemas.Error.properties.error.properties.code.enum;
    expect(codes).toContain("validation_failed");
    expect(codes).toContain("rate_limited");
    expect(codes).toContain("not_found");
  });

  test("serialises to YAML that round-trips key content", () => {
    const yaml = toYaml(document);
    expect(yaml.startsWith('"openapi": "3.1.0"')).toBe(true);
    expect(yaml).toContain('"operationId": "createSprintBrief"');
    expect(yaml.endsWith("\n")).toBe(true);
  });
});
