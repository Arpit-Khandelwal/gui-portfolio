/**
 * Page paths that participate in `Accept` content negotiation and have a
 * markdown twin.
 *
 * Deliberately dependency-free: the proxy runs on the edge runtime and must
 * not pull in the React/icon-heavy portfolio data module. A test asserts this
 * list matches the markdown document registry.
 */
export const AGENT_PAGE_PATHS = [
  "/",
  "/about",
  "/contact",
  "/docs",
  "/privacy",
  "/privacy-policy",
  "/play",
] as const;

export const AGENT_PAGE_PATH_SET: ReadonlySet<string> = new Set(AGENT_PAGE_PATHS);

/** Normalises a request path: strips a trailing slash, maps "" to "/". */
export function normalisePagePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * Strips the `.md` suffix from a markdown twin path, or returns null when the
 * path is not a twin at all. `/index.md` is the twin of `/`.
 *
 * Unknown page paths are returned rather than rejected, so the `/md` handler
 * owns every `.md` 404 and can answer it in markdown instead of HTML.
 */
export function markdownTwinBase(pathname: string): string | null {
  if (!pathname.endsWith(".md")) return null;
  const base = pathname.slice(0, -".md".length);
  if (base === "/index" || base === "" || base === "/") return "/";
  return normalisePagePath(base);
}

/** The page path a markdown twin maps to, or null when no such page exists. */
export function pagePathForMarkdownTwin(pathname: string): string | null {
  const base = markdownTwinBase(pathname);
  return base !== null && AGENT_PAGE_PATH_SET.has(base) ? base : null;
}

/** The `/md/...` handler path that renders a given page path as markdown. */
export function markdownHandlerPath(pagePath: string) {
  return pagePath === "/" ? "/md" : `/md${pagePath}`;
}

/** The markdown twin URL advertised for a page path. */
export function markdownTwinPath(pagePath: string) {
  return pagePath === "/" ? "/index.md" : `${pagePath}.md`;
}
