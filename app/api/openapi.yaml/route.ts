import { buildOpenApiDocument } from "@/lib/agent/openapi";
import { toYaml } from "@/lib/agent/yaml";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(toYaml(buildOpenApiDocument()), {
    headers: {
      "content-type": "application/yaml; charset=utf-8",
      link: `<${absoluteUrl("/openapi.json")}>; rel="alternate"; type="application/json"`,
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
