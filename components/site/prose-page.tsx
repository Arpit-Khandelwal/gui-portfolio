import Link from "next/link";
import type { ReactNode } from "react";
import type { CopySection } from "@/lib/copy";

/**
 * Shared layout for the long-form trust-anchor pages (about, contact, docs).
 * Matches the existing privacy-policy page so these read as part of the same
 * site rather than bolted on.
 */
export function ProsePage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro: string;
  sections?: readonly CopySection[];
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[color:var(--muted)]">
        <Link href="/" className="hover:text-[color:var(--accent)]">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{title}</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <p className="mb-8">{intro}</p>

      {children}

      {sections?.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-2 mt-8 text-lg font-semibold">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mb-4">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
