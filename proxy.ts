import { NextResponse, type NextRequest } from "next/server";
import { MEDIA_MARKDOWN, negotiateMediaType } from "@/lib/agent/accept";
import {
  isNegotiablePath,
  markdownHandlerPath,
  markdownTwinBase,
  markdownTwinPath,
  normalisePagePath,
} from "@/lib/agent/routes";
import {
  AB_COHORT_COOKIE,
  DEFAULT_WORLD,
  WORLD_COOKIE,
  WORLD_COOKIE_MAX_AGE,
  WORLD_PARAM,
  WORLD_SOURCE_COOKIE,
  isNonHumanAgent,
  parseWorld,
  pickAbWorld,
  worldHomePath,
  type WorldId,
  type WorldSource,
} from "@/lib/worlds";

const COOKIE_OPTIONS = { path: "/", maxAge: WORLD_COOKIE_MAX_AGE, sameSite: "lax" } as const;

function setWorldCookies(response: NextResponse, world: WorldId, source: WorldSource): NextResponse {
  response.cookies.set(WORLD_COOKIE, world, COOKIE_OPTIONS);
  response.cookies.set(WORLD_SOURCE_COOKIE, source, COOKIE_OPTIONS);
  if (source === "ab") response.cookies.set(AB_COHORT_COOKIE, world, COOKIE_OPTIONS);
  return response;
}

/**
 * A/B/C/D test: a first-time human visitor with no world cookie gets one of
 * the four worlds at random. Crawlers and agents keep the default, so search
 * snapshots and agent reads stay stable. Set AB_TEST=off to stop assigning.
 */
function abAssignment(request: NextRequest): WorldId | null {
  if (process.env.AB_TEST === "off") return null;
  if (request.cookies.has(WORLD_COOKIE)) return null;
  if (isNonHumanAgent(request.headers.get("user-agent"))) return null;
  return pickAbWorld();
}

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

/**
 * `?world=lid` on any page stores the world and redirects to the clean URL, so
 * a shared link opens in the sender's world and canonical URLs stay bare.
 */
function worldParamRedirect(request: NextRequest): NextResponse | null {
  const world = parseWorld(request.nextUrl.searchParams.get(WORLD_PARAM));
  if (!request.nextUrl.searchParams.has(WORLD_PARAM)) return null;
  const clean = request.nextUrl.clone();
  clean.searchParams.delete(WORLD_PARAM);
  const response = NextResponse.redirect(clean, 307);
  return world ? setWorldCookies(response, world, "shared") : response;
}

/**
 * The homepage is prerendered once per world. A visitor who picked a world
 * other than the default is served that world's page under the same `/` URL.
 */
function worldHomeRewrite(request: NextRequest, world = parseWorld(request.cookies.get(WORLD_COOKIE)?.value)): NextResponse | null {
  if (!world || world === DEFAULT_WORLD) return null;
  return NextResponse.rewrite(new URL(worldHomePath(world), request.url));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const shared = worldParamRedirect(request);
  if (shared) return shared;

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
  if (!isNegotiablePath(pagePath)) return NextResponse.next();

  // React Server Component payload requests carry their own media type and
  // must pass through untouched.
  if (request.headers.get("RSC") === "1" || request.headers.has("Next-Router-Prefetch")) {
    return (pagePath === "/" && worldHomeRewrite(request)) || NextResponse.next();
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

  const assigned = abAssignment(request);
  const home = pagePath === "/" ? worldHomeRewrite(request, assigned ?? undefined) : null;
  const response = withNegotiationHeaders(home ?? NextResponse.next(), pagePath);
  return assigned ? setWorldCookies(response, assigned, "ab") : response;
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
    "/writing",
    // Posts are discovered from disk, which the edge runtime cannot do, so the
    // whole subtree is matched and the markdown handler resolves each slug.
    "/writing/:slug*",
    // Any `.md` path, so the markdown handler owns markdown 404s too.
    "/:path*.md",
  ],
};
