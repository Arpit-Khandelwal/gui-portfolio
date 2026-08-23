import { buildOpenApiDocument } from "@/lib/agent/openapi";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(buildOpenApiDocument(), null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      link: `<${absoluteUrl("/api/openapi.yaml")}>; rel="alternate"; type="application/yaml"`,
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
