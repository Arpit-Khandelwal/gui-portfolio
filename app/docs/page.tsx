import type { Metadata } from "next";
import Link from "next/link";
import { docsEndpoints, docsEntryPoints, docsErrorCodes, docsIntro, rateLimitSummary } from "@/lib/docs";
import { AGENT_ENTRYPOINTS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "API & Agent Documentation | Arpit Khandelwal",
  description:
    "Public API for arpitkhandelwal.com: OpenAPI 3.1 spec, JSON endpoints for profile, services, work, availability and contact, error codes, rate limits, and markdown content negotiation.",
  alternates: {
    canonical: "/docs",
    types: { "text/markdown": "/docs.md" },
  },
  openGraph: { type: "website", url: "/docs", title: "API & Agent Documentation | Arpit Khandelwal" },
};

const CURL_EXAMPLE = `curl -s ${SITE_URL}/api/availability

curl -s -X POST ${SITE_URL}/api/contact \\
  -H 'content-type: application/json' \\
  -d '{"name":"Ada","email":"ada@example.com","message":"We need an MCP server for our internal tools in 4 weeks."}'`;

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed">
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-[color:var(--muted)]">
        <Link href="/" className="hover:text-[color:var(--accent)]">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span>Documentation</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">API &amp; agent documentation</h1>
      <p className="mb-8">{docsIntro}</p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Entry points</h2>
      <ul className="mb-4 space-y-1">
        {docsEntryPoints.map((entry) => (
          <li key={entry.path}>
            <a className="font-semibold underline hover:text-[color:var(--accent)]" href={entry.path}>
              <code>{entry.path}</code>
            </a>
            <span className="text-[color:var(--muted)]"> — {entry.description}</span>
          </li>
        ))}
      </ul>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Endpoints</h2>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[color:var(--line)] text-xs uppercase tracking-wide text-[color:var(--muted)]">
              <th scope="col" className="py-2 pr-4">Method</th>
              <th scope="col" className="py-2 pr-4">Path</th>
              <th scope="col" className="py-2 pr-4">Operation</th>
              <th scope="col" className="py-2">Returns</th>
            </tr>
          </thead>
          <tbody>
            {docsEndpoints.map((endpoint) => (
              <tr key={endpoint.operationId} className="border-b border-[color:var(--line)] align-top">
                <td className="py-2 pr-4 font-semibold">{endpoint.method}</td>
                <td className="py-2 pr-4"><code>{endpoint.path}</code></td>
                <td className="py-2 pr-4"><code>{endpoint.operationId}</code></td>
                <td className="py-2 text-[color:var(--muted)]">{endpoint.returns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Authentication</h2>
      <p className="mb-4">
        None. Every endpoint is public. The read endpoints are safe to call from an agent without any
        credential; <code>POST /api/contact</code> writes a message to a private inbox and should only be
        called when a user has explicitly asked to get in touch.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Response shape</h2>
      <p className="mb-4">
        Success responses are <code>{'{ "ok": true, "data": ... }'}</code>. Failures are{" "}
        <code>{'{ "ok": false, "error": { "code", "message", "hint", "documentation" } }'}</code> with an
        appropriate HTTP status. Branch on <code>error.code</code>, which is stable, rather than on the
        message text.
      </p>
      <div className="mb-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[color:var(--line)] text-xs uppercase tracking-wide text-[color:var(--muted)]">
              <th scope="col" className="py-2 pr-4">Code</th>
              <th scope="col" className="py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {docsErrorCodes.map((entry) => (
              <tr key={entry.code} className="border-b border-[color:var(--line)] align-top">
                <td className="py-2 pr-4"><code>{entry.code}</code></td>
                <td className="py-2 text-[color:var(--muted)]">{entry.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Rate limits</h2>
      <p className="mb-4">{rateLimitSummary}</p>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Example</h2>
      <pre className="mb-4 overflow-x-auto rounded-md border border-[color:var(--line)] p-4 text-xs">
        <code>{CURL_EXAMPLE}</code>
      </pre>

      <h2 className="mb-2 mt-8 text-lg font-semibold">Markdown content negotiation</h2>
      <p className="mb-4">
        Every page route honours <code>Accept: text/markdown</code> and responds with{" "}
        <code>Vary: Accept</code>, per acceptmarkdown.com. The same content is reachable at the{" "}
        <code>.md</code> twin of any page path, for example{" "}
        <a className="font-semibold underline hover:text-[color:var(--accent)]" href="/about.md">
          /about.md
        </a>
        . A request whose <code>Accept</code> header excludes both <code>text/html</code> and{" "}
        <code>text/markdown</code> receives a <code>406</code>.
      </p>

      <p className="mt-8 text-[color:var(--muted)]">
        Start with{" "}
        <a className="font-semibold underline hover:text-[color:var(--accent)]" href={AGENT_ENTRYPOINTS.llmsTxt}>
          llms.txt
        </a>{" "}
        for when-to-use guidance, then{" "}
        <a className="font-semibold underline hover:text-[color:var(--accent)]" href={AGENT_ENTRYPOINTS.openapiJson}>
          openapi.json
        </a>{" "}
        for callable operations.
      </p>
    </main>
  );
}
