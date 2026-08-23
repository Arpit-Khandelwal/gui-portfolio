import { workPayload } from "@/lib/agent/payloads";
import { RATE_LIMIT_POLICIES } from "@/lib/api/rate-limit";
import { guardRateLimit, jsonError, jsonOk } from "@/lib/api/respond";
import { parseWorkQuery } from "@/lib/api/validate";

export async function GET(request: Request) {
  const limit = guardRateLimit(request, RATE_LIMIT_POLICIES.read);
  if (limit.blocked) return limit.blocked;

  const query = parseWorkQuery(new URL(request.url).searchParams);
  if (!query.ok) {
    return jsonError(400, "validation_failed", "One or more query parameters are invalid.", {
      hint: "See the listWork operation in /openapi.json for the accepted values.",
      details: query.details,
      headers: limit.headers,
    });
  }

  return jsonOk(workPayload(query.value), { headers: limit.headers });
}
