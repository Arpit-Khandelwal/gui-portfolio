# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Four audiences, weighted equally. None is primary, and none should be served as a fallback path for another:

- **Founders** running founder-led teams who need the AI or backend piece shipped without hiring a full team.
- **AI product teams** with agent demos that have to survive real users: MCP servers, browser automation, retrieval, auth, orchestration.
- **Crypto and protocol infra teams** who need backend, agent, and privacy rails around their product (Solana, Arcium, Helius, ZK).
- **Recruiters and hiring managers** evaluating a hands-on engineer for fractional or fractional-to-full-time roles.

A fifth reader is machine: AI agents and crawlers acting for any of the above. They read the site through `/llms.txt`, the OpenAPI document, markdown twins, and JSON endpoints rather than the rendered page.

## Product Purpose

arpitkhandelwal.com is the proof archive and front door for Arpit Khandelwal, a backend and AI-systems engineer in Bengaluru. He leads tech at Reskilll and takes a limited number of outside fixed-scope AI and backend build sprints (two to six weeks, one at a time). The outside work is a one-person practice, not an agency and not a staffing firm. (Confirmed 2026-10-26: "At Reskilll + select sprints".)

Success is a qualified conversation started: a written sprint brief (by email, the homepage sprint configurator, or `POST /api/contact`), or, for the recruiter audience, a hiring conversation. A brief that is a bad fit and gets a fast, clear no also counts as the site working.

## Positioning

Four claims lead together; the user chose all four:

1. **The awkward middle.** Senior execution on the parts that are hard to hire for and easy to get wrong: auth, data models, third-party integrations, agents that survive real users, and automation against surfaces that never offered an API.
2. **Shipped, public proof.** A long archive of live builds (Swiggy MCP server, Gossip DAO, Helius indexer, Dark Payroll, the Arcium privacy suite, x402 services, sold.) instead of adjectives.
3. **Fixed scope, flat price.** Two-to-six-week sprints, a flat price tied to a shipped outcome, no hourly billing, a reply within 24 hours, one sprint at a time.
4. **The site is itself agent-legible.** The portfolio demonstrates the craft it sells: an agent can discover, read, and contact the practice without driving a browser.

## Operating Context

- Visitors arrive from the résumé (cv.arpitkhandelwal.com), GitHub, LinkedIn, X, and project subdomains (`*.arpitkhandelwal.com`), and increasingly through AI agents and LLM search.
- The homepage carries an audience switcher (buyer modes), a sprint configurator that composes a brief, case studies with a drawer, an architecture map, FAQs, and engagement terms.
- The engagement ritual is fixed: brief → reply within 24h → scoping call within 48h → written scope signed off → weekly merged PRs, demos, and tradeoff notes → handoff docs.
- `/play` is a canvas brick-breaker whose walls spell the CV and turn over 42 dossier cards.
- `/writing` publishes markdown posts with RSS, JSON-LD, and `.md` twins.

## Capabilities and Constraints

- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, lucide-react, on Vercel behind Cloudflare. Vitest covers route handlers and agent files.
- **Canonical host is `www.arpitkhandelwal.com`.** The apex 308-redirects to it; every canonical URL, sitemap entry, and OpenAPI server must name the host that returns 200 (`lib/site.ts`).
- **One content source.** Portfolio content lives in `components/portfolio/data.ts` and `lib/copy.ts`. The HTML pages, markdown twins, API payloads, JSON-LD, and `llms.txt` are all generated from it and must never drift apart.
- **API contract:** `{ ok, data }` / `{ ok, error: { code, message, hint, details?, documentation } }` with stable, enumerated error codes; per-instance best-effort rate limits with RFC 9331 headers.
- **Analytics:** GTM (GA4 + Clarity) loads for every visitor except EU/EEA, UK, and Switzerland, where consent is asked first.
- **Writing drafts are Arpit's to author.** Posts marked `draft: true` must not be filled with invented technical detail.
- **Four visual worlds (decided 2026-10-27):** the site ships four switchable looks over one content set: Patent (default), Laptop lid, Title wall, Plain. The choice lives in a `world` cookie; `?world=<id>` shares one. Every world must carry the same content, the audience switch, the brief builder and the contact form.
- **Copy standard:** plain language (ISO 24495-1) with ASD-STE100 sentence rules: short sentences, active voice, no marketing adjectives.

## Brand Commitments

- **Name:** Arpit Khandelwal. Role line: backend and AI-systems engineer; tech lead at Reskilll; takes select build sprints.
- **Binding:** the agent-readable surface stays: `/llms.txt`, `/openapi.json` and `/api/openapi.yaml`, `/docs`, the `/api/*` read endpoints and `POST /api/contact`, `.md` twins with `Accept: text/markdown` negotiation, JSON-LD, and explicit AI-crawler allowances in `robots.txt`.
- **Incumbent voice (not yet confirmed as binding):** first person, direct, plain, specific. Section heads such as "Outcomes before adjectives." and "Straight answers." Says no to bad fits in public.

## Evidence on Hand

- **Case studies and archive:** `components/portfolio/data.ts`, with `selectedWork` (12 entries with problem, shipped, stack, live link, status) and `projectArchive` (12 smaller builds, most live on subdomains).
- **Metrics in use:** Gossip DAO reached 50+ users and 200+ posts in 24 hours; 5+ years shipping since 2021; 10+ case-grade builds; 2-6 week sprints.
- **Employment history:** Tech at Reskilll (current; X bio "Tech @ Reskilll"), Avici Money (Jan-Jul 2025), Hewlett Packard Enterprise (2023-2024), freelance since 2021.
- **Reskilll at scale (approved for the site):** the platform he built took 50k+ registrations for a national hackathon, ran on a t3.micro, needed zero deployments after the dev close, and held off spam and attacks (his X post, 2026-09-14). He also ran a Reskilll enterprise bootcamp in Spain.
- **Open source (approved):** merged PRs in neuralink/tsui (#30), GopeedLab/gopeed (#1588), anmolkapil/plexo (~12), TryCaspian/caspian-sdk, code100x/job-board; in review at sgl-project/sglang, CopilotKit, mlc-ai/xgrammar, neuralinkcorp/datarepo. Source of truth: the `oss:start` block of github.com/Arpit-Khandelwal/Arpit-Khandelwal README.
- **Newer builds (approved):** Leash (agent subscription spend control on Prava + Visa Intelligent Commerce, Agentic Commerce Hackathon, Aug 2026), Slop Filter for LinkedIn (Jev-judged BAIT/CORP/BRAG stamps; 5 GitHub stars, ~530 views on the X launch post), GraveShift (Solana Graveyard Hackathon, graveshift.arpitkhandelwal.com), tic-tac-futures/XOXO.
- **Community (approved):** Superteam India contributor; judged 20+ projects at a hackathon (May 2026).
- **Writing:** five posts in `content/writing/`, all `draft: true` with outlines and TODOs. Nothing is published yet.
- **Absent; do not fabricate:** client testimonials, client logos used as endorsements, published sprint prices, team size beyond one, and any post body content.
- **Availability line:** the old "1 sprint slot open for July" is stale. The confirmed stance is "at Reskilll, taking select sprints"; no month or slot count is confirmed, so do not publish one.

## Tone guardrails (confirmed 2026-10-26)

The site must not read as a SaaS or agency landing page, must not sell hard (the work carries the pitch), must not bury the playful builds (/play, XOXO, sold., the slop filter), and must not go so minimal that the depth of the archive disappears.

## Product Principles

1. **Proof over claims.** Every claim should resolve to a live build, a linked repo, or a number already in `data.ts`.
2. **Every audience is first-class.** Re-pitch for each visitor type; never demote one to a footnote.
3. **One truth, many renderings.** Humans and agents read the same content; a change to one surface is a change to all of them.
4. **The site is a working sample.** Machine legibility, API hygiene, and reliability are part of the product, not SEO garnish.
5. **Make starting cheap and saying no fast.** The shortest path to a written brief, and a clear answer within 24 hours either way.
