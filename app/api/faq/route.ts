import { faqPayload } from "@/lib/agent/payloads";
import { RATE_LIMIT_POLICIES } from "@/lib/api/rate-limit";
import { guardRateLimit, jsonOk } from "@/lib/api/respond";

export async function GET(request: Request) {
  const limit = guardRateLimit(request, RATE_LIMIT_POLICIES.read);
  if (limit.blocked) return limit.blocked;
  return jsonOk(faqPayload(), { headers: limit.headers });
}
