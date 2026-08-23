import { absoluteUrl } from "@/lib/site";
import { jsonError } from "@/lib/api/respond";

/**
 * Catch-all for unrecognised `/api/*` paths. Without it Next serves the HTML
 * 404 page, which an agent cannot parse.
 */
function notFound() {
  return jsonError(404, "not_found", "No such API endpoint.", {
    hint: `List the available operations at ${absoluteUrl("/api")} or read ${absoluteUrl("/openapi.json")}.`,
  });
}

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
export const HEAD = notFound;
