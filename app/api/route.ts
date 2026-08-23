import { AGENT_ENTRYPOINTS, absoluteUrl } from "@/lib/site";
import { RATE_LIMIT_POLICIES } from "@/lib/api/rate-limit";
import { guardRateLimit, jsonOk } from "@/lib/api/respond";

/** Index of the public API, so `/api` is a useful landing point rather than a 404. */
export async function GET(request: Request) {
  const limit = guardRateLimit(request, RATE_LIMIT_POLICIES.read);
  if (limit.blocked) return limit.blocked;

  return jsonOk(
    {
      name: "Arpit Khandelwal — Public Agent API",
      description:
        "Read the profile, services, work history, and availability of a fractional AI and backend engineer, and submit a build-sprint brief. Public and unauthenticated.",
      documentation: absoluteUrl(AGENT_ENTRYPOINTS.docs),
      openapi: {
        json: absoluteUrl(AGENT_ENTRYPOINTS.openapiJson),
        yaml: absoluteUrl(AGENT_ENTRYPOINTS.openapiYaml),
      },
      llmsTxt: absoluteUrl(AGENT_ENTRYPOINTS.llmsTxt),
      operations: [
        { operationId: "getProfile", method: "GET", path: "/api/profile" },
        { operationId: "getAvailability", method: "GET", path: "/api/availability" },
        { operationId: "getServices", method: "GET", path: "/api/services" },
        { operationId: "listWork", method: "GET", path: "/api/work" },
        { operationId: "listFaq", method: "GET", path: "/api/faq" },
        { operationId: "createSprintBrief", method: "POST", path: "/api/contact" },
      ],
      rateLimits: Object.values(RATE_LIMIT_POLICIES).map((policy) => ({
        policy: policy.name,
        limit: policy.limit,
        windowSeconds: policy.windowSeconds,
      })),
    },
    { headers: limit.headers },
  );
}
