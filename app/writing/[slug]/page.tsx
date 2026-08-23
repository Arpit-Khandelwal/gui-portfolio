import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/site/markdown-body";
import { buildArticleJsonLd } from "@/lib/agent/json-ld";
import { findPost, publishedPosts } from "@/lib/writing/posts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Drafts are excluded, so a production build never prerenders a page that
  // would only 404. They still render on demand in development.
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Arpit Khandelwal`,
    description: post.description,
    alternates: {
      canonical: post.path,
      types: { "text/markdown": `${post.path}.md` },
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: post.path,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ["Arpit Khandelwal"],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();
  if (post.draft && process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(post)) }}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[color:var(--muted)]">
        <Link href="/" className="hover:text-[color:var(--accent)]">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href="/writing" className="hover:text-[color:var(--accent)]">
          Writing
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{post.title}</span>
      </nav>

      <article>
        <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
        <p className="mb-8 text-xs text-[color:var(--muted)]">
          <time dateTime={post.date}>{post.date}</time>
          {post.draft ? <span> · draft</span> : null}
        </p>
        <MarkdownBody markdown={post.body} />
      </article>

      <p className="mt-12 text-xs text-[color:var(--muted)]">
        <a href={`${post.path}.md`} className="underline hover:text-[color:var(--accent)]">
          Read as markdown
        </a>
      </p>
    </main>
  );
}
