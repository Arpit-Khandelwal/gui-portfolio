import type { Metadata } from "next";
import Link from "next/link";
import { publishedPosts } from "@/lib/writing/posts";

export const metadata: Metadata = {
  title: "Writing | Arpit Khandelwal",
  description:
    "Notes from shipped work by Arpit Khandelwal: AI agents and MCP servers, browser automation, backend infrastructure, and Solana.",
  alternates: {
    canonical: "/writing",
    types: { "text/markdown": "/writing.md" },
  },
  openGraph: { type: "website", url: "/writing", title: "Writing | Arpit Khandelwal" },
};

export default function WritingIndex() {
  const posts = publishedPosts();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[color:var(--muted)]">
        <Link href="/" className="hover:text-[color:var(--accent)]">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span>Writing</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">Writing</h1>
      <p className="mb-10">
        Notes from shipped work — AI agents and MCP servers, browser automation, backend
        infrastructure, and Solana.
      </p>

      {posts.length === 0 ? (
        <p className="text-[color:var(--muted)]">Nothing published yet.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <h2 className="text-lg font-semibold">
                  <Link href={post.path} className="hover:text-[color:var(--accent)]">
                    {post.title}
                  </Link>
                  {post.draft ? (
                    <span className="ml-2 align-middle text-xs font-normal text-[color:var(--muted)]">
                      draft
                    </span>
                  ) : null}
                </h2>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  <time dateTime={post.date}>{post.date}</time>
                </p>
                <p className="mt-2">{post.description}</p>
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-12 text-xs text-[color:var(--muted)]">
        <a href="/writing/rss.xml" className="underline hover:text-[color:var(--accent)]">
          RSS
        </a>
        <span aria-hidden="true"> · </span>
        <a href="/writing.md" className="underline hover:text-[color:var(--accent)]">
          Markdown
        </a>
      </p>
    </main>
  );
}
