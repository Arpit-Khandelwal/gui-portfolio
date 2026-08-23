# arpitkhandelwal.com

Personal portfolio for Arpit Khandelwal — fractional AI & backend engineer. Next.js 16 (App Router) on Vercel, fronted by Cloudflare.

## Getting started

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm start            # serve the production build
npm test             # vitest (unit + route-handler tests)
npm run lint         # eslint
```

## Agent-readable surface

The site is built to be legible to AI agents and crawlers, not only to browsers. Everything below is public and unauthenticated.

| URL | What it is |
| --- | --- |
| `/llms.txt` | llmstxt.org summary with an explicit **when to use this** section and how to call the API. |
| `/openapi.json` | OpenAPI 3.1 spec: unique `operationId`, description, typed parameters, and response schema on every operation. |
| `/api/openapi.yaml` | The same document as YAML. |
| `/docs` | Human-readable API documentation (markdown twin at `/docs.md`). |
| `/api` | API index with the operation list and rate-limit policies. |
| `/api/profile`, `/api/availability`, `/api/services`, `/api/work`, `/api/faq` | Read endpoints over the content in `components/portfolio/data.ts`. |
| `/api/contact` | `POST` a sprint brief. |
| `/sitemap.xml`, `/robots.txt` | Discovery. Every major AI crawler is allowed by name, not only by wildcard. |
| `/about`, `/contact`, `/privacy` | Trust-anchor pages, 500+ characters of prose each in raw HTML. `/privacy` serves the full policy and declares `/privacy-policy` as its canonical, so a crawler that does not follow redirects still sees content. |

### JSON contract

Success is `{ "ok": true, "data": ... }`. Failure is `{ "ok": false, "error": { "code", "message", "hint", "details?", "documentation" } }`. Codes are stable and enumerated in `lib/api/respond.ts` and in the OpenAPI `Error` schema — branch on `error.code`, never on the message. Unknown `/api/*` paths return a JSON 404 rather than the HTML error page.

### Rate limits

`lib/api/rate-limit.ts` applies a fixed window per client IP and emits RFC 9331 `RateLimit` / `RateLimit-Policy` headers on every response, plus `Retry-After` on a 429.

The counter lives in the module scope of one serverless instance, so enforcement is **per-instance and best-effort** — enough to blunt a runaway retry loop, not a hard global quota. To make it exact, swap the `windows` map in `lib/api/rate-limit.ts` for a shared store (Vercel KV or Upstash Redis); nothing else needs to change.

### Markdown content negotiation

`proxy.ts` implements [acceptmarkdown.com](https://acceptmarkdown.com) negotiation for the page routes listed in `lib/agent/routes.ts`:

- `Accept: text/markdown` → `text/markdown; charset=utf-8` with `Vary: Accept`
- `Accept: text/html`, `*/*`, or no header → the normal page
- an `Accept` that excludes both → `406` with a JSON error body
- q-values are honoured, including `q=0` as an explicit refusal
- every page also has a `.md` twin: `/about.md`, `/index.md`, …
- an unknown `.md` path 404s in markdown, not as an HTML error page

Markdown bodies are generated in `lib/agent/markdown.ts` from the same content the pages render, and carry prose only — no navigation, styling, or layout markup.

Known limitation: Next 16 rewrites `Vary` on a page (RSC) render, so `Vary: Accept` is present on the markdown and 406 responses but not on the HTML one. Negotiation is still correct, because the proxy runs ahead of the CDN cache lookup — a markdown request is rewritten to `/md/...` and can never be served the HTML variant cached under the page path.

## Writing

Posts are plain markdown in `content/writing/*.md` with YAML front matter:

```yaml
---
title: "Post title"
description: "One sentence, used for the index, RSS, og:description and llms.txt."
date: 2026-08-24
draft: true
tags: [MCP, Playwright]
---
```

`draft: true` means the post renders in `next dev` but is excluded from the index, sitemap, RSS, `llms.txt` and the production build entirely. Flip it to `false` to publish — nothing else to do.

Each post automatically gets a `.md` twin (`/writing/<slug>.md`), an `Article` JSON-LD block whose `author`/`publisher` reference the homepage identity graph, a sitemap entry, an RSS item at `/writing/rss.xml`, and an `llms.txt` line.

`lib/writing/posts.ts` reads the filesystem, so it is Node-only and must never be imported by `proxy.ts`. The proxy negotiates the whole `/writing/` subtree by prefix and lets `app/md/[[...slug]]/route.ts` resolve or 404 each slug.

## Canonical host

`lib/site.ts` holds `SITE_URL`, which feeds every canonical tag, `og:url`, sitemap entry, robots directive, and OpenAPI server URL.

It must name the host that actually returns `200`. The apex (`arpitkhandelwal.com`) is configured in Vercel as a `308` redirect to `www`, so `SITE_URL` is `https://www.arpitkhandelwal.com`. Advertising the apex meant every canonical URL pointed at a bodyless redirect, and crawlers that do not follow redirects saw nothing at all.

If the apex is ever promoted to the primary domain in Vercel, set `NEXT_PUBLIC_SITE_URL=https://arpitkhandelwal.com` (or change the fallback in `lib/site.ts`) and everything downstream follows.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Overrides the canonical origin. Optional. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Contact-form delivery. Without them `POST /api/contact` returns `503 delivery_not_configured` and the UI falls back to `mailto:`. |

## Layout

```
app/            routes: pages, API handlers, llms.txt, openapi.json, /md markdown handler
components/     portfolio UI, the brick-breaker game, shared prose layout
lib/site.ts     canonical origin and agent entry points
lib/copy.ts     long-form prose shared by the HTML pages and their markdown twins
lib/docs.ts     API documentation content shared by /docs and /docs.md
lib/agent/      accept negotiation, markdown rendering, llms.txt, OpenAPI, JSON-LD, YAML
lib/api/        JSON response envelope, rate limiting, input validation
proxy.ts        Accept negotiation and .md twin routing
tests/          vitest suite
```
