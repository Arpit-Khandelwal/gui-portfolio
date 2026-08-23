import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontMatter } from "@/lib/writing/frontmatter";

/**
 * The writing index, read from `content/writing/*.md` at build time.
 *
 * Node-only: this module touches the filesystem and must never be imported by
 * `proxy.ts`, which runs on the edge runtime.
 */

export const WRITING_DIR = join(process.cwd(), "content", "writing");
export const WRITING_BASE_PATH = "/writing";

export type Post = {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  /** Drafts are visible in development and excluded from production output. */
  draft: boolean;
  tags: readonly string[];
  /** Raw markdown body, without front matter. */
  body: string;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const { data, body } = parseFrontMatter(readFileSync(join(WRITING_DIR, fileName), "utf8"));
  return {
    slug,
    path: `${WRITING_BASE_PATH}/${slug}`,
    title: asString(data.title, slug),
    description: asString(data.description),
    date: asString(data.date, "1970-01-01"),
    draft: data.draft === true,
    tags: Array.isArray(data.tags) ? data.tags : [],
    body,
  };
}

/** Every post on disk, newest first, drafts included. */
export function allPosts(): Post[] {
  let fileNames: string[];
  try {
    fileNames = readdirSync(WRITING_DIR).filter((name) => name.endsWith(".md"));
  } catch {
    return [];
  }
  return fileNames.map(readPost).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Posts that should appear in the index, sitemap, RSS and llms.txt.
 * Drafts are included in development so they can be previewed while writing.
 */
export function publishedPosts(): Post[] {
  const includeDrafts = process.env.NODE_ENV !== "production";
  return allPosts().filter((post) => includeDrafts || !post.draft);
}

export function findPost(slug: string): Post | undefined {
  return allPosts().find((post) => post.slug === slug);
}
