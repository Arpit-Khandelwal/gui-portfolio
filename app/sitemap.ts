import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { publishedPosts } from "@/lib/writing/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = publishedPosts();
  const latestPost = posts[0] ? new Date(posts[0].date) : now;

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/docs"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/writing"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: absoluteUrl(post.path),
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: absoluteUrl("/play"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
