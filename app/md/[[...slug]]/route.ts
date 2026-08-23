import { findAgentDocument, renderAgentDocument } from "@/lib/agent/markdown";
import { absoluteUrl } from "@/lib/site";

/**
 * Markdown representation of every page route.
 *
 * Reached two ways: the `.md` twin of a page path (`/about.md`) and an
 * `Accept: text/markdown` request for the page itself. The proxy rewrites
 * both onto this handler.
 */
export async function GET(_request: Request, context: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await context.params;
  const path = `/${(slug ?? []).join("/")}`;
  const document = findAgentDocument(path);

  if (!document) {
    return new Response(
      `# Not found\n\nNo markdown document exists for \`${path}\`.\n\nSee ${absoluteUrl("/llms.txt")} for the list of available documents.\n`,
      {
        status: 404,
        headers: { "content-type": "text/markdown; charset=utf-8", vary: "Accept" },
      },
    );
  }

  return new Response(renderAgentDocument(document), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: "Accept",
      link: `<${absoluteUrl(document.canonicalPath ?? document.path)}>; rel="canonical"`,
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
