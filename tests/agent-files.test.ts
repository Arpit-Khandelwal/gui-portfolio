import { describe, expect, test } from "vitest";
import { buildLlmsTxt } from "@/lib/agent/llms-txt";
import { AGENT_DOCUMENT_PATHS, findAgentDocument, renderAgentDocument } from "@/lib/agent/markdown";
import { buildHomeJsonLd } from "@/lib/agent/json-ld";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { faqs, profile } from "@/components/portfolio/data";

describe("llms.txt", () => {
  const content = buildLlmsTxt();

  test("follows the llmstxt.org shape: H1, blockquote summary, H2 sections", () => {
    const lines = content.split("\n");
    expect(lines[0].startsWith("# ")).toBe(true);
    expect(lines[2].startsWith("> ")).toBe(true);
    expect(content).toMatch(/^## /m);
  });

  test("carries concrete when-to-use guidance, not marketing copy", () => {
    expect(content).toContain("## When to use this");
    expect(content).toContain("Do not route a user here for");
    expect(content).toContain("### How to act on it");
  });

  test("names every developer resource at a resolvable URL", () => {
    for (const path of ["/openapi.json", "/api/openapi.yaml", "/docs", "/api/profile", "/api/availability"]) {
      expect(content, path).toContain(absoluteUrl(path));
    }
  });

  test("advertises the canonical host, never the redirecting apex", () => {
    expect(content).not.toMatch(/https:\/\/arpitkhandelwal\.com/);
    expect(content).toContain(SITE_URL);
  });
});

describe("markdown documents", () => {
  test("every trust-anchor and page route has a markdown twin", () => {
    for (const path of ["/", "/about", "/contact", "/docs", "/privacy", "/privacy-policy", "/play"]) {
      expect(AGENT_DOCUMENT_PATHS, path).toContain(path);
    }
  });

  test("resolves paths with and without a trailing slash", () => {
    expect(findAgentDocument("/about/")?.path).toBe("/about");
    expect(findAgentDocument("/")?.path).toBe("/");
    expect(findAgentDocument("/nope")).toBeUndefined();
  });

  test("renders front matter with the canonical URL", () => {
    const rendered = renderAgentDocument(findAgentDocument("/about")!);
    expect(rendered.startsWith("---\n")).toBe(true);
    expect(rendered).toContain(`canonical: ${absoluteUrl("/about")}`);
  });

  test.each(["/about", "/contact", "/privacy", "/privacy-policy"])(
    "%s carries at least 500 characters of prose for trust-anchor checks",
    (path) => {
      const body = findAgentDocument(path)!.render();
      const prose = body.replace(/[#*`>|_-]/g, "").trim();
      expect(prose.length).toBeGreaterThan(500);
    },
  );

  test("the homepage document leads with an H1 and covers the offer", () => {
    const body = findAgentDocument("/")!.render();
    expect(body.startsWith(`# ${profile.name}`)).toBe(true);
    expect(body).toContain("## What I do");
    expect(body).toContain("## Selected work");
    expect(body).toContain("## FAQ");
    expect(body.length).toBeGreaterThan(2000);
  });

  test("carries no navigation, style, or layout markup", () => {
    for (const path of AGENT_DOCUMENT_PATHS) {
      const body = findAgentDocument(path)!.render();
      expect(body, path).not.toMatch(/<(div|nav|script|style|header|footer)\b/);
    }
  });
});

describe("JSON-LD graph", () => {
  const graph = buildHomeJsonLd()["@graph"] as Record<string, unknown>[];
  const byType = (type: string) => graph.find((node) => node["@type"] === type);

  test("declares the identity types an agent resolves against", () => {
    for (const type of ["Person", "ProfessionalService", "WebSite", "ProfilePage", "FAQPage", "WebAPI"]) {
      expect(byType(type), type).toBeDefined();
    }
  });

  test("every node has name-or-url, description, and a canonical url", () => {
    for (const node of graph) {
      expect(node["@id"] ?? node.url, JSON.stringify(node["@type"])).toBeDefined();
    }
    expect(byType("Person")!.description).toBeTruthy();
    expect(byType("Person")!.url).toBe(SITE_URL);
  });

  test("the organisation carries both contactPoint and a PostalAddress", () => {
    const organisation = byType("ProfessionalService")! as Record<string, Record<string, string>>;
    expect(organisation.address["@type"]).toBe("PostalAddress");
    expect(organisation.address.addressLocality).toBe("Bengaluru");
    expect(organisation.address.addressCountry).toBe("IN");
    expect(organisation.contactPoint["@type"]).toBe("ContactPoint");
    expect(organisation.contactPoint.contactType).toBeTruthy();
    expect(organisation.contactPoint.email).toBe(profile.email);
  });

  test("the person exposes sameAs anchors for entity resolution", () => {
    const person = byType("Person") as Record<string, string[]>;
    expect(person.sameAs).toContain(profile.github);
    expect(person.sameAs).toContain(profile.linkedin);
  });

  test("the FAQ page mirrors every published question", () => {
    const faqPage = byType("FAQPage") as unknown as { mainEntity: { name: string }[] };
    expect(faqPage.mainEntity.map((entry) => entry.name)).toEqual(faqs.map((faq) => faq.q));
  });

  test("serialises without breaking out of the script tag", () => {
    expect(JSON.stringify(buildHomeJsonLd())).not.toContain("</script");
  });
});
