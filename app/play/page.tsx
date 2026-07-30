import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrickBreaker } from "@/components/game/brick-breaker";

export const metadata: Metadata = {
  title: "Play | Arpit Khandelwal",
  description:
    "A small browser brick-breaker where the brick field spells ARPIT. Built with canvas, no dependencies.",
  alternates: { canonical: "/play" },
  openGraph: {
    type: "website",
    url: "/play",
    title: "Play | Arpit Khandelwal",
    description: "A small browser brick-breaker where the brick field spells ARPIT.",
  },
};

export default function PlayPage() {
  return (
    <div className="portfolio-shell theme-operator min-h-screen">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-10 md:px-8 md:py-14">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] transition hover:text-[color:var(--accent)]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to the portfolio
          </Link>

          <p className="section-kicker">Coffee break</p>

          <h1 className="text-[clamp(1.75rem,5vw,2.75rem)] font-black uppercase leading-[0.9]">
            Break the
            <span className="block text-[color:var(--accent)]">name wall.</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[color:var(--muted)]">
            Every brick up there is one pixel of a 5&times;7 bitmap font, so the wall spells my name
            until you take it apart. Canvas, fixed-timestep physics, zero game libraries.
          </p>
        </header>

        <BrickBreaker />
      </main>
    </div>
  );
}
