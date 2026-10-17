import { requiresConsent } from "@/lib/consent-region";

/**
 * Tells the analytics loader whether this visitor must opt in first, from the
 * country Vercel resolves for the request. Internal to the site, so it lives
 * outside the documented /api surface. Never cached: the answer is per visitor.
 */
export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country");
  return Response.json(
    { requiresConsent: requiresConsent(country) },
    { headers: { "cache-control": "private, no-store" } },
  );
}
