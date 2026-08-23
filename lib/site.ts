import { profile } from "@/components/portfolio/data";

/**
 * Canonical origin for every absolute URL the site emits (metadata, JSON-LD,
 * sitemap, robots, OpenAPI servers).
 *
 * This MUST match the host that actually returns 200. The apex
 * (arpitkhandelwal.com) is configured as a 308 redirect to the `www` host, so
 * advertising the apex made every canonical, `og:url`, and `<loc>` point at a
 * bodyless redirect. Agents that do not follow redirects saw nothing.
 *
 * If the apex is ever promoted to the primary domain, set
 * `NEXT_PUBLIC_SITE_URL=https://arpitkhandelwal.com` (or edit the fallback) and
 * everything downstream follows.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.arpitkhandelwal.com").replace(/\/+$/, "");

/** Hosts that resolve to this site, canonical first. */
export const SITE_HOSTS = ["www.arpitkhandelwal.com", "arpitkhandelwal.com"] as const;

export const SITE_NAME = "Arpit Khandelwal";
export const SITE_TITLE = "Arpit Khandelwal | Fractional AI & Backend Engineer";
export const SITE_DESCRIPTION =
  "Fractional AI & backend engineer for build sprints across AI agents, backend automation, browser workflows, APIs, and integration-heavy products.";

export const CONTACT_EMAIL = profile.email;

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

/**
 * Machine-readable entry points, published at predictable URLs and listed in
 * llms.txt so agents can discover them by name.
 */
export const AGENT_ENTRYPOINTS = {
  llmsTxt: "/llms.txt",
  openapiJson: "/openapi.json",
  openapiYaml: "/api/openapi.yaml",
  docs: "/docs",
  apiRoot: "/api",
} as const;
