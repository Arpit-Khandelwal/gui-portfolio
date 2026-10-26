import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";
import { profile } from "@/components/portfolio/data";
import { publishedPosts } from "@/lib/writing/posts";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822 date, which RSS 2.0 requires for pubDate. */
function rfc822(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toUTCString();
}

export function GET() {
  const posts = publishedPosts();
  const items = posts
    .map((post) =>
      [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(absoluteUrl(post.path))}</link>`,
        `      <guid isPermaLink="true">${escapeXml(absoluteUrl(post.path))}</guid>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${SITE_NAME} — Writing`)}</title>`,
    `    <link>${escapeXml(absoluteUrl("/writing"))}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    `    <managingEditor>${escapeXml(`${profile.email} (${profile.name})`)}</managingEditor>`,
    `    <atom:link href="${escapeXml(absoluteUrl("/writing/rss.xml"))}" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return new Response(feed, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
