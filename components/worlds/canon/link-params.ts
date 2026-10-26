import { linkEventParams } from "@/lib/analytics-helpers";
/** `link_domain` and `link_url` for a link click, in the shape GA4 expects. */
export function linkParams(href: string): { link_domain: string; link_url: string } {
  return linkEventParams(href);
}
