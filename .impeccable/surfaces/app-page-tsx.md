---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/w/[world]/page.tsx","components/worlds"]
---

# Homepage (/) — four switchable worlds

Scope: the homepage `/`, rendered once per world (`/` = patent, `/w/lid`, `/w/wall`, `/w/canon` behind a cookie rewrite). Mode: Experience — the work leads from the first viewport; the brief action stays reachable in one move.
Audience: founders, AI product teams, crypto infra teams, recruiters, weighted equally; agents read the same content via `.md` twins.
Job: see the real builds, understand the "awkward middle" mechanism, and send a sprint brief (or open a hiring conversation).
Proof: `components/portfolio/data.ts` only (selectedWork with `parts`, openSource PRs, Reskilll 50k+, community, projectArchive). Copy: ASD-STE100, from `lib/world-copy.ts` + data.ts.
Constraints: agent-readable surface untouched; content only from data files; status "At Reskilll, select sprints"; no testimonials, prices, or X content; tone guardrails in PRODUCT.md (no SaaS hero, no hard sell, playful builds visible, archive depth visible).
User decision (2026-10-27): build all four directions and let the visitor switch with a world switcher.

## Direction contract

### World A — patent (default)
THESIS: The site is a patent specification; each build is a filed figure with numbered parts whose numerals resolve to live links. Refuses the hero-plus-card-grid portfolio.
OWN-WORLD: Cool bond white sheet (#fbfbf8) on #f4f5f2 ground, black ink line art at 1.5–2px, non-photo-blue construction grid (#6cb4dc), examiner red (#c8261a) only for reference numerals and the one action. Old Standard TT roman for titles and prose, Courier Prime for numerals, labels and the title block. Square corners, 2px sheet border, hairline rules.
STORY: Visitor reads the invention title and abstract, sees FIG. 1 (an agent operating a closed app through an MCP server), traces numerals to proof, rewrites the abstract by audience, reads the claims (terms), and files the brief on the application form.
FIRST VIEWPORT: One bordered sheet. Left margin column (~35–40%): invention title at display scale, abstract with red numerals running in the text, the four-way audience switch, status line, and the "File a brief" box. Right ~60%: FIG. 1 drawn in SVG, cropped to fill its panel, with leader lines and one numeral per real part of the hero case (102–108 for Swiggy MCP; parts are never invented to fill a range). Title block top-right carries the spec number; the sheet count sits in the sheet's top margin, never above a heading. "Fig. 1" caption bottom-left.
FORM: patent specification, #5 of 7 on the ranked list (laptop lid, departure board, sarkari file, card binder, patent drawing, Classmate notebook, git log); seed:363774459ed0184b.
SIGNATURE: hover/focus a numeral in text and its part in the figure lights in red, and the reverse; FIG. 0 draws this page as an agent reads it. Motion grammar: ink lines draw once on first view (stroke-dashoffset), then stay still; reduced motion shows them drawn.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

### World B — lid
THESIS: The archive is a sticker-bombed hackathon laptop lid; every build is a die-cut sticker you flip to read. Refuses the uniform project-card grid.
OWN-WORLD: Brushed-aluminium ground (#c5c9ce, soft radial sheen), die-cut vinyl stickers with 6px white borders and small real shadows, sticker colours #e5480f, #ffd23f, #2f6bff, #14b86a, #18181a, #f4e9ff. Bricolage Grotesque (800 for sticker titles), Rubik Mono One for badge caps.
STORY: Visitor meets a "HELLO, MY NAME IS" badge sticker, scans 20+ stickers at real overlap, flips one to read the case, then reaches the brief as a sticker sheet to fill.
FIRST VIEWPORT: The lid fills the viewport. Name badge sticker top-left at large scale with status and "Send a brief"; 10–14 build stickers overlapping across the rest at varied rotations and sizes; audience switch as four small stickers.
FORM: Laptop lid, #1 on the list (offered as the pick).
SIGNATURE: a sticker lifts on hover/focus (rotation eases toward 0, shadow grows) and flips to its back (problem, what was made, stack, link) on activate.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

### World C — wall
THESIS: Builds are a streaming title wall: rows (Shipped, Experiments, Open source, Small builds, Play) of title cards that grow on focus. Refuses static case lists.
OWN-WORLD: #0d0e11 ground, title cards as the only colour (each build owns one saturated hue plus a typographic poster), single amber focus ring #ffb000. Archivo with width axis: 112–125% heavy for titles, normal width for metadata.
STORY: Visitor lands on the featured build (Reskilll at 50k+), scrolls rows, focuses a card to read its line and stack, opens it, and finds "Send a brief" as the always-present second button.
FIRST VIEWPORT: Featured billboard top ~60% with headline, one line, two buttons (Open the build / Send a brief); the first row of cards peeks below.
FORM: Title wall, challenger (competitive), catalog pop-culture-shelf-streaming-title-card-wall.
SIGNATURE: focus or hover scales the card, reveals metadata and dims the rest of the row; rows scroll horizontally with snap and keyboard arrows.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

### World D — canon
THESIS: The category standard executed impeccably: a calm dark engineer portfolio. Chosen by the visitor who wants no concept.
OWN-WORLD: #0b0b0c ground, #ededed ink, #a1a1aa muted, one green #22c55e for status and links. Hanken Grotesk 800 display / 400 body, JetBrains Mono only for code and data.
STORY: Name, role, status, then selected work, open source, experience, terms, brief.
FIRST VIEWPORT: Left-aligned name + one-line role + status + two actions; selected work list starts above the fold.
FORM: Category standard (canon card).
SIGNATURE: none beyond precise hover/focus states.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Real screenshots of live builds for wall posters (typographic posters used until supplied).
