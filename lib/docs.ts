import { AGENT_ENTRYPOINTS } from "@/lib/site";
import { RATE_LIMIT_POLICIES } from "@/lib/api/rate-limit";

/**
 * Single source of truth for the developer documentation, rendered both as the
 * /docs HTML page and as its markdown twin.
 */

export type EntryPoint = { path: string; description: string };

export const docsEntryPoints: readonly EntryPoint[] = [
  { path: AGENT_ENTRYPOINTS.llmsTxt, description: "Site summary and when-to-use guidance for agents." },
  { path: AGENT_ENTRYPOINTS.openapiJson, description: "OpenAPI 3.1 description of every endpoint (JSON)." },
  { path: AGENT_ENTRYPOINTS.openapiYaml, description: "The same specification in YAML." },
  { path: AGENT_ENTRYPOINTS.apiRoot, description: "Index of the public API with the operation list." },
  { path: "/sitemap.xml", description: "Every indexable URL, with lastmod dates." },
  { path: "/robots.txt", description: "Crawl policy. Every major AI agent is explicitly allowed." },
];

export type DocsEndpoint = {
  method: "GET" | "POST";
  path: string;
  operationId: string;
  returns: string;
};

export const docsEndpoints: readonly DocsEndpoint[] = [
  { method: "GET", path: "/api/profile", operationId: "getProfile", returns: "Identity, location, contact address, profile links, stack" },
  { method: "GET", path: "/api/availability", operationId: "getAvailability", returns: "Booking status, reply window, sprint lengths and types" },
  { method: "GET", path: "/api/services", operationId: "getServices", returns: "Focus areas, process, deliverables, terms, good and bad fits" },
  { method: "GET", path: "/api/work", operationId: "listWork", returns: "Case studies and the project archive" },
  { method: "GET", path: "/api/faq", operationId: "listFaq", returns: "Published questions and answers" },
  { method: "POST", path: "/api/contact", operationId: "createSprintBrief", returns: "Delivers a sprint brief; replies within 24 hours" },
];

export const docsErrorCodes: readonly { code: string; meaning: string }[] = [
  { code: "invalid_json", meaning: "The request body could not be parsed as JSON." },
  { code: "validation_failed", meaning: "A field or query parameter was missing or malformed; see error.details." },
  { code: "method_not_allowed", meaning: "The HTTP method is not supported on this path." },
  { code: "not_found", meaning: "No such API endpoint." },
  { code: "not_acceptable", meaning: "The Accept header excluded every media type this resource can produce." },
  { code: "rate_limited", meaning: "Quota exhausted; wait for Retry-After seconds." },
  { code: "delivery_not_configured", meaning: "Contact delivery is unavailable; email directly instead." },
  { code: "upstream_failure", meaning: "A downstream provider failed; retry once, then email directly." },
];

export const rateLimitSummary = `Read endpoints allow ${RATE_LIMIT_POLICIES.read.limit} requests per ${RATE_LIMIT_POLICIES.read.windowSeconds} seconds per client. POST /api/contact allows ${RATE_LIMIT_POLICIES.contact.limit} per ${RATE_LIMIT_POLICIES.contact.windowSeconds} seconds. Every response carries RFC 9331 RateLimit and RateLimit-Policy headers, and a 429 additionally carries Retry-After in seconds. Self-throttle from those headers rather than retrying blindly.`;

export const docsIntro =
  "Machine-readable entry points for arpitkhandelwal.com. Everything below is public, unauthenticated, and returns JSON. Agents should read llms.txt first for when-to-use guidance, then the OpenAPI document for callable operations.";
