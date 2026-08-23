import { NextResponse, type NextRequest } from "next/server";
import { MEDIA_MARKDOWN, negotiateMediaType } from "@/lib/agent/accept";
import {
  AGENT_PAGE_PATH_SET,
  markdownHandlerPath,
  markdownTwinBase,
  markdownTwinPath,
  normalisePagePath,
} from "@/lib/agent/routes";

/**
 * acceptmarkdown.com content negotiation for page routes.
 *
 * Scope is intentionally narrow — only the known page paths and their `.md`
 * twins — so assets, RSC payloads, Open Graph images and API routes can never
 * be renegotiated or refused.
 */

const NOT_ACCEPTABLE_BODY = JSON.stringify({
  ok: false,
  error: {
    code: "not_acceptable",
    message: "This resource can be served as text/html or text/markdown only.",
    hint: "Send `Accept: text/markdown` for prose, `Accept: text/html` for the page, or omit the header.",
    documentation: "https://www.arpitkhandelwal.com/docs",
  },
});

function withNegotiationHeaders(response: NextResponse, pagePath: string) {
  // Appended, not set: Next.js already varies on its RSC headers and
  // overwriting them would break router prefetch caching.
  //
  // Next 16 replaces `Vary` wholesale on a page (RSC) render, so this survives
  // on the markdown and 406 responses but not on the HTML one. That is the
  // response acceptmarkdown.com inspects, and negotiation itself is safe
  // either way: this proxy runs ahead of the CDN cache lookup, so a
  // markdown request is rewritten to /md/... and can never be served the
  // HTML variant cached under the page path.
  response.headers.append("Vary", "Accept");
  response.headers.append(
    "Link",
    `<${markdownTwinPath(pagePath)}>; rel="alternate"; type="text/markdown"`,
  );
  return response;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Every `.md` path is handed to the markdown handler, including ones with no
  // document behind them, so an unknown twin 404s in markdown rather than
  // returning an HTML error page an agent cannot parse.
  const twinOf = markdownTwinBase(pathname);
  if (twinOf !== null) {
    return NextResponse.rewrite(new URL(markdownHandlerPath(twinOf), request.url), {
      headers: { Vary: "Accept" },
    });
  }

  const pagePath = normalisePagePath(pathname);
  if (!AGENT_PAGE_PATH_SET.has(pagePath)) return NextResponse.next();

  // React Server Component payload requests carry their own media type and
  // must pass through untouched.
  if (request.headers.get("RSC") === "1" || request.headers.has("Next-Router-Prefetch")) {
    return NextResponse.next();
  }

  const negotiation = negotiateMediaType(request.headers.get("accept"));

  if (negotiation.outcome === "not-acceptable") {
    return new NextResponse(NOT_ACCEPTABLE_BODY, {
      status: 406,
      headers: { "content-type": "application/json; charset=utf-8", Vary: "Accept" },
    });
  }

  if (negotiation.mediaType === MEDIA_MARKDOWN) {
    return withNegotiationHeaders(
      NextResponse.rewrite(new URL(markdownHandlerPath(pagePath), request.url)),
      pagePath,
    );
  }

  return withNegotiationHeaders(NextResponse.next(), pagePath);
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/contact",
    "/docs",
    "/privacy",
    "/privacy-policy",
    "/play",
    // Any `.md` path, so the markdown handler owns markdown 404s too.
    "/:path*.md",
  ],
};
