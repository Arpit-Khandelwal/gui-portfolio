---
name: Arpit Khandelwal
description: One proof archive, four switchable visual worlds (Patent, Laptop lid, Title wall, Plain) over a single content set.
colors:
  patent-ground: "#f4f5f2"
  patent-sheet: "#fbfbf8"
  patent-ink: "#141414"
  patent-muted: "#4c4d4a"
  patent-examiner-red: "#c8261a"
  patent-nonphoto-blue: "#6cb4dc"
  lid-metal: "#c5c9ce"
  lid-vinyl-white: "#ffffff"
  lid-paper: "#fbfaf6"
  lid-ink: "#18181a"
  lid-muted: "#3d4045"
  lid-orange: "#e5480f"
  lid-yellow: "#ffd23f"
  lid-blue: "#2860f0"
  lid-green: "#14b86a"
  lid-lilac: "#f4e9ff"
  wall-ground: "#0d0e11"
  wall-sheet: "#17191e"
  wall-ink: "#f2f2f0"
  wall-muted: "#a9abb2"
  wall-soft: "#c4c6cc"
  wall-edge: "#70737b"
  wall-amber: "#ffb000"
  wall-error: "#ff9585"
  canon-ground: "#0b0b0c"
  canon-sheet: "#121214"
  canon-ink: "#ededed"
  canon-muted: "#a1a1aa"
  canon-green: "#22c55e"
  canon-green-hover: "#4ade80"
  canon-green-ink: "#04130a"
  canon-error: "#f87171"
typography:
  patent-display:
    fontFamily: "Old Standard TT, Times New Roman, serif"
    fontSize: "clamp(2.3rem, 1.5rem + 2.2vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  patent-headline:
    fontFamily: "Old Standard TT, Times New Roman, serif"
    fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  patent-body:
    fontFamily: "Old Standard TT, Times New Roman, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  patent-label:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.1em"
  patent-numeral:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "0.95rem"
    fontWeight: 700
    fontFeature: "tnum"
  lid-badge-name:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 12.5cqi, 5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  lid-badge-caps:
    fontFamily: "Rubik Mono One, Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.2rem, 15cqi, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.02em"
  lid-body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 450
    lineHeight: 1.5
  wall-billboard:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 125"
  wall-row-title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.5vw, 1.6rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 115"
  wall-body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  canon-display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.6rem + 4.6vw, 5.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  canon-headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.25rem + 1.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  canon-lead:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.1rem + 0.85vw, 1.875rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  canon-body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  canon-mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
rounded:
  patent: "0px"
  wall-tag: "3px"
  wall: "6px"
  canon-control: "8px"
  canon-group: "10px"
  lid-tag: "6px"
  lid-rect: "14px"
  lid-card: "16px"
  lid-panel: "18px"
  lid-panel-lg: "24px"
  lid-sheet: "28px"
  pill: "999px"
spacing:
  patent-gutter: "clamp(1rem, 3.2vw, 2.5rem)"
  lid-gutter: "clamp(16px, 3.4vw, 48px)"
  wall-gutter: "clamp(1rem, 3.4vw, 3rem)"
  wall-gap: "0.75rem"
  canon-gutter: "clamp(1rem, 4vw, 3rem)"
  canon-section: "clamp(5rem, 3.5rem + 4vw, 8rem)"
  prose-measure: "44rem"
components:
  patent-file-button:
    backgroundColor: "{colors.patent-examiner-red}"
    textColor: "#ffffff"
    rounded: "{rounded.patent}"
    padding: "0.9rem 1.1rem"
  patent-file-button-hover:
    backgroundColor: "{colors.patent-sheet}"
    textColor: "{colors.patent-examiner-red}"
  patent-audience-option-active:
    backgroundColor: "{colors.patent-ink}"
    textColor: "{colors.patent-sheet}"
    rounded: "{rounded.patent}"
  lid-sticker:
    backgroundColor: "{colors.lid-orange}"
    textColor: "#ffffff"
    rounded: "{rounded.lid-rect}"
  lid-mark:
    backgroundColor: "{colors.lid-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "6px 16px 7px"
    height: "44px"
  wall-button-solid:
    backgroundColor: "{colors.wall-ink}"
    textColor: "{colors.wall-ground}"
    rounded: "{rounded.wall}"
    padding: "0 1.3rem"
    height: "3rem"
  wall-button-solid-hover:
    backgroundColor: "#ffffff"
  canon-button-primary:
    backgroundColor: "{colors.canon-green}"
    textColor: "{colors.canon-green-ink}"
    rounded: "{rounded.canon-control}"
    padding: "0 1.25rem"
    height: "2.875rem"
  canon-button-primary-hover:
    backgroundColor: "{colors.canon-green-hover}"
  canon-button-quiet:
    textColor: "{colors.canon-ink}"
    rounded: "{rounded.canon-control}"
    padding: "0 1.25rem"
    height: "2.875rem"
---

# Design System: Arpit Khandelwal

## Overview

**Creative North Star: "One Archive, Four Rooms"**

The site is a single proof archive rendered as four complete visual worlds. The visitor chooses the room; the content, the brief, and the behaviour never change. Patent (the default, at `/`) files every build as a numbered figure on a bond-paper specification sheet. Laptop lid sticker-bombs the archive onto brushed aluminium. Title wall turns it into a dark streaming wall of typographic posters. Plain is the category-standard dark engineer portfolio, set carefully, for visitors who want no concept.

Each world is a full commitment, not a theme tint. Each one has its own typefaces, its own composition, its own component vocabulary, and its own motion grammar. What they share is a thin token contract (`--w-*`), one switcher, one inner-page shell, and one set of behaviours. Density is high in every world because the archive is deep. No world goes so minimal that the archive disappears, and no world reads as a SaaS landing page.

`<html data-world="patent|lid|wall|canon">` selects the tokens. An inline boot script in `<head>` sets the attribute before first paint: a `/w/<world>` path wins, then the `world` cookie, then `patent`. On a first-time human visit, the proxy assigns one of the four worlds at random (25% each). It records how the world was set in `world_src` (`ab`, `chosen` or `shared`) and the first assignment in `ab_cohort`. Crawlers and agents always get Patent. Choosing a world writes the cookie for one year (`max-age` 31536000, `samesite=lax`). On a homepage the page reloads to `/`, because each world's homepage is a separate prerendered page. Every other page only swaps tokens.

**Key Characteristics:**
- Four worlds, one content set (`components/portfolio/data.ts`, `lib/copy.ts`, `lib/world-copy.ts`), one brief hook (`useBrief`), and one analytics vocabulary.
- A shared `--w-*` contract with 13 slots. Every surface outside the homepage reads only these slots.
- Each homepage world scopes every selector under its own root class (`.world-patent`, `.world-lid`, `.world-wall`, `.world-canon`). All world stylesheets load on every `/w/*` page.
- One easing curve across the whole site: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Each world has a single accent, and that accent is also the world's focus colour. The one exception is Laptop lid, which focuses in ink.

### The shared contract

| Slot | Role |
|---|---|
| `--w-ground` | Page background behind everything |
| `--w-sheet` | Raised surface: sheet, card, `pre`, consent banner |
| `--w-ink` | Primary text and solid fills |
| `--w-muted` | Secondary text, footer, breadcrumbs |
| `--w-line` | Strong rules and borders |
| `--w-hair` | Hairline dividers |
| `--w-accent` / `--w-accent-ink` | The one action colour and the text set on it |
| `--w-construct` | Secondary structural colour (patent grid, lid blue, equals the accent in wall and canon) |
| `--w-select` | `::selection` background |
| `--w-display` / `--w-body` / `--w-label` | The world's three type roles |
| `--w-radius` | The world's base corner |

The legacy names `--background`, `--page-bg`, `--accent`, `--line` and similar are compatibility aliases onto `--w-*`, kept for `/play` and older prose markup. Do not use them in new work.

### The audience model

All four worlds share one audience model, through `useBrief()` and `components/worlds/audience.ts`.

- **The question.** Each world asks "What brings you here?" in its own voice. Patent asks "Field of use: what brings you here?". Laptop lid and Plain ask "What brings you here?". Title wall shows a "Who is watching?" profile picker. The four answers are Founder, AI team, Crypto infra and Recruiter, and each answer is labelled with its `buyer.ask` line (for example "Build the AI or backend part" or "Hire an engineer").
- **What an answer changes.**
  - `buyer.why` gives the one-line reason shown with the work.
  - `buyer.featured` names the cases that matter to this reader. `orderedWork` lists those cases first, in that order, then the rest of `selectedWork`. Each world marks featured cases in its own way: a red stamp in Patent, a "for you" dot in Laptop lid, top picks in Title wall, a "For you" tag in Plain.
  - `buyer.cta` replaces the main action. Three readers get a brief action ("Send a brief", "Send an agent brief", "Send an infra brief"); the recruiter gets "See the résumé".
- **The reorder.** A change of reader reorders the work in a single `document.startViewTransition`, and each case has a stable, unique `view-transition-name`. Group durations: Patent 520ms, Laptop lid 460ms (`view-transition-class: lid-sticker`), Title wall 460ms, Plain 340ms. The root cross-fade takes 200ms. Under reduced motion, or without view-transition support, the work swaps at once.
- **Inference.** An audience can be set by a `?for=<id>` link first, then by a stored choice (`localStorage` key `audience`), then by the referrer (a LinkedIn referrer means recruiter). Otherwise Founder is the default. The server and the first client render always use the default. When the audience is inferred, a dismissible note says why: "Picked for you because you came from LinkedIn." or "Picked from your link.". Patent shows the "Field of use" line only when the audience is not the default.

### Named Rules

**The Reader First Rule.** Each world asks the question, the answer reorders the work so the reader's `featured` cases come first, and the main action becomes the reader's `cta`. An inferred answer always says why it was picked. Never hide a case for any reader; only reorder.

**The One Content Rule.** Every world renders the same copy and data, the audience switch (Founder, AI team, Crypto infra, Recruiter), the sprint brief builder, and the contact form. Each one uses `useBrief()`: POST to `/api/contact` with a `mailto:` fallback. A world may restyle a behaviour. It may never drop one.

**The Same Instruments Rule.** Every world tags its sections with the same `data-analytics-section` ids: `hero` (or `billboard` in wall), `work`, `experiments`, `open-source`, `archive`, `play`, `about`, `process`, `terms`, `faq`, `brief`, `footer`. Every world fires the same `track()` events: `cta_click`, `audience_select` (with `source`: `click`, `param` or `referrer`), `ab_exposure`, `nav_click`, `brief_option`, `brief_copy`, `brief_submit`, `case_link`, `oss_link`, `archive_link`, `faq_open`, `outbound_click`. World-specific signatures add their own event: `figure_part_focus` (patent), `sticker_flip` (lid), `case_open` and `row_scroll` (wall). The switcher fires `world_switch` with `from`, `to` and `path`.

## Colors

Each world owns its palette. The shared rule is structural: one ground, one raised sheet, one ink, one muted ink, and exactly one action accent.

### Patent (default)
- **Examiner Red** (patent-examiner-red): reference numerals, the status dot, the "File a brief" action, focus outlines, and nothing else.
- **Non-photo Blue** (patent-nonphoto-blue): the construction grid behind figures (22% mix, 48px cells), audience hover tint (18% mix), and selection (35% alpha). It never carries text.
- **Bond Sheet** (patent-sheet) on **Cool Ground** (patent-ground): every content block is a sheet laid on the ground.
- **Drawing Ink** (patent-ink) for line art, borders, and text. **Carbon Grey** (patent-muted) for intros and the sheet count.

### Laptop lid
- **Brushed Metal** (lid-metal): the ground, with a tiling fractal-noise grain. The `<html>` element adds a radial sheen (`#dde0e4` to `#c5c9ce` to `#b3b8be`).
- **Sticker vinyls**: Hazard Orange (lid-orange, white text), Highlighter Yellow (lid-yellow, ink text), Hackathon Blue (lid-blue, white text), Mint Green (lid-green, ink text), Matte Black (lid-ink, white text), Lilac (lid-lilac, ink text), and plain white. Each colour is a class pair that sets `--bg` and `--fg`.
- **Vinyl White** (lid-vinyl-white): the 6px die-cut border on every sticker and the white sticker sheet behind long-form text. **Paper** (lid-paper) is the flip side of a sticker.

### Title wall
- **Screen Black** (wall-ground) with **Panel** (wall-sheet) for raised surfaces.
- **Marquee Amber** (wall-amber): the single focus ring, the skip link, and the active switcher option. `--w-construct` is the same amber, not a second colour.
- **Poster fields**: each build's hue is generated deterministically from its title in `poster.ts` (FNV-1a hash). The hue is taken from 110° to 400°, so it always skips 40–110°. Title ink is chosen by computed WCAG contrast (target 6:1, floor 4.5:1). A softer ink is also required to reach 4.5:1.
- **Error Coral** (wall-error): form errors on the dark wall.
- **Edge Grey** (wall-edge) for ghost-button and panel insets. **Soft Grey** (wall-soft) for secondary text on dark panels. **Silver** (wall-muted) for metadata.

### Plain
- **Signal Green** (canon-green): status dot, links (`c-open`), and the primary button. **Bright Green** (canon-green-hover) is the hover state of the primary button only. **Deep Green Ink** (canon-green-ink) is the text on green.
- **Near Black** (canon-ground) with **Raised Black** (canon-sheet). **Paper White** (canon-ink) and **Zinc** (canon-muted).
- **Error Red** (canon-error): form errors.
- Tints are ink at fixed alphas: 6% and 10% fills, 12% hairline, 20% strong hairline, plus green at 14%.

### Named Rules
**The One Accent Rule.** Each world has exactly one action colour. It marks the action, live status, and focus, and nothing decorative. In patent, red appears only on numerals and the one action.

**The Amber Is Reserved Rule.** In the title wall, posters may use any hue except 40–110°. Amber always means "focus is here".

## Typography

Each world brings its own fonts. All seven families load through `next/font` with `display: swap`. Only Old Standard TT and Courier Prime are preloaded, because Patent is the default world.

### Patent
**Display and body:** Old Standard TT (roman, weight 400 for titles). **Label:** Courier Prime (400/700).
The pairing is a typeset specification with typewritten form fields. Titles stay at weight 400; the patent never shouts.
- **Display** (patent-display): the invention title in the margin column.
- **Headline** (patent-headline): section titles.
- **Figure label**: "Fig. N" in display italic, `clamp(2rem, 1.4rem + 1.8vw, 3.4rem)`, with an italic caption alongside.
- **Body** (patent-body): abstract and prose, limited to 60ch for intros.
- **Label** (patent-label): uppercase typed field names ("Abstract", "Inventor record"). These are the specification's own form headings.
- **Numeral** (patent-numeral): red reference numerals in running text, with a dotted underline.

### Laptop lid
**Display and body:** Bricolage Grotesque (body at 450, sticker titles at 800, promise lines at 750). **Badge caps:** Rubik Mono One.
- **Badge name** (lid-badge-name): the name on the "HELLO, MY NAME IS" badge, sized with container units (`cqi`).
- **Badge caps** (lid-badge-caps): the "HELLO" band. Rubik Mono One is also used for small uppercase sticker labels (audience label at 0.7rem, badge foot at 0.74rem).
- **Body** (lid-body).

### Title wall
**One family:** Archivo with its width axis. Heavy and wide for titles, normal width for reading.
- **Billboard** (wall-billboard): weight 900 at 125% width, max 11ch.
- **Row title** (wall-row-title): weight 800 at 115% width.
- **Buttons**: weight 700 at 110% width, 0.98rem.
- **Body** (wall-body): 100% width. Billboard line at `clamp(1rem, 0.9rem + 0.3vw, 1.15rem)`, weight 500, 48ch.
- **Poster glyphs**: oversized letterforms at weight 900 and 125% width, in the low-contrast glyph tone. Sized by container (`118cqh` on cards, `clamp(11rem, 23vw, 24rem)` on the billboard). They are decorative and set `pointer-events: none`.

### Plain
**Display and body:** Hanken Grotesk (800 for h1, 600 for h2 and h3, 500 for the lead, 400 for body). **Mono:** JetBrains Mono, used only for code and data.
Tabular numerals are on for the whole world. The world's text scale tokens: `--c-text-sm` 0.875rem, `-md` 0.9375rem, `-body` 1.0625rem, `-h3` 1.1875rem, plus the clamps above.

### Small text steps
These are the reused sizes below body text. Use them before adding a new size.
- Patent: 0.75rem, 0.78rem, 0.8rem, 0.82rem, 0.84rem, 0.85rem.
- Laptop lid: 0.66rem, 0.72rem, 0.74rem, 0.82rem, 0.92rem, 0.95rem, 0.98rem. Larger steps are 1.12rem, 1.28rem and 1.3rem.
- Title wall: 0.76rem, 0.8rem, 0.82rem, 0.84rem, 0.85rem, 0.86rem, 0.88rem, 0.9rem, 0.92rem, 0.95rem. Larger steps are 1.05rem and 1.1rem.
- Plain: the `--c-text-*` scale, plus 0.75rem and 0.8125rem for mono labels.

### Inner pages (all worlds)
`.prose-main` sets body at 1.0625rem / 1.65, h1 at `clamp(2.25rem, 1.6rem + 2.6vw, 3.75rem)` / 1.02, h2 at 1.5rem, and paragraphs at 68ch. Each world then re-voices the headings. Patent uses weight 400, with h2 as uppercase Courier Prime. Lid uses an 800 h1. Wall uses an uppercase 900 h1 at 112% width. Canon uses an 800 h1 at -0.035em.

### Named Rules
**The Typed Field Rule.** In patent, anything a clerk would type goes in Courier Prime: numerals, labels, the title block, and nav. Anything an author would write goes in Old Standard TT.

**The Width Is The Voice Rule.** In the title wall, hierarchy comes from Archivo's width axis and weight, never from a second family.

## Layout

- **Patent:** bordered sheets with a max width of 90rem, centred, and a gutter of `--pt-gutter`. Sheets stack with 1.75rem between them, and sheet padding is `clamp(1.25rem, 3vw, 2.5rem)`. The first viewport is one sheet split into a margin column (title, abstract, audience switch, status, "File a brief") and a figure panel. A title block sits top-right and the sheet count sits centred in the top margin. Figure sheets use a `1.25fr 1fr` grid that alternates sides. At 960px and below, every grid becomes one column and the margin column gains a bottom rule. At 640px and below, the audience switch becomes 2×2, tables become stacked rows, and the title block becomes static.
- **Laptop lid:** the lid fills the viewport. The badge sits top-left, with 10–14 stickers overlapping across the rest. Each sticker is positioned by `--dx`, `--dy` and `--r` from `lid-layout.ts`. At 1099px and below the lid stacks into a packed, flowing pile: offsets are switched off (`--off: 0`) and rotation is scaled to 0.6. At 640px and below rotation is scaled to 0.4. Hit targets are at least 44px.
- **Title wall:** a billboard at about 60% of the viewport height (`clamp(30rem, 60svh, 40rem)`), with a poster column and a `minmax(17rem, 23rem)` side column. Below it come horizontal rows of cards at `clamp(14.5rem, 21vw, 21rem)` wide with a 4:3 ratio and a 0.75rem gap. Rows use x-mandatory scroll snap and keyboard arrows. At 900px and below the billboard stacks.
- **Plain:** a 74rem shell with a gutter of `clamp(1rem, 4vw, 3rem)` and sections spaced by `--c-section-space`. The intro is left-aligned, and the selected-work list starts above the fold. Breakpoints are 40rem, 52rem, 56rem and 64rem.
- **Inner pages:** a 72rem header and footer, and a 44rem prose column (56rem with `.prose-wide`).

## Elevation & Depth

Depth is set per world and follows the world's material.

- **Patent is flat.** Depth comes from a 2px ink sheet border, 1px rules, and hairlines (ink at 22%). There are no shadows.
- **Laptop lid uses real, small shadows**, like vinyl on metal:
  - At rest: `0 1px 1.5px rgba(22,24,28,0.3), 0 7px 14px -5px rgba(22,24,28,0.42)`.
  - Lifted: `0 3px 5px rgba(22,24,28,0.2), 0 24px 38px -12px rgba(22,24,28,0.55)`. The lifted shadow sits on a `::after` layer, so only its opacity animates.
  - The long-form sticker sheet uses a 6px white spread plus two soft drops.
- **Title wall uses soft cast shadows under posters**:
  - Cards at rest: `0 14px 28px -18px rgb(0 0 0 / .75)`.
  - Cards when grown: `0 26px 40px -20px rgb(0 0 0 / .85)`.
  - Billboard poster: `0 30px 60px -36px rgb(0 0 0 / .8)`.
  - The billboard's hue bleeds into the ground through radial gradients.
- **Plain is flat.** Depth comes from 1px inset hairlines and ink tints.
- **Shared:** the consent banner floats with `0 18px 40px rgba(0,0,0,0.22)`.

**The Material Decides Rule.** Shadows exist only where the world's material casts them: vinyl on a lid, posters on a wall. Paper sheets and the plain world stay flat.

## Shapes

- **Patent:** square corners everywhere (`--w-radius: 0`). The status dot and drawn parts are the only circles. Line art uses a 2px stroke with square caps and mitre joins. Thin lines are 1px, dashed lines are `6 5`, and wires are 1.5px.
- **Laptop lid:** die-cut forms. Every sticker has a 6px white border (4px on small pills and dots) and is a circle, a 14px rectangle, or a pill. Small labels use 6px corners, cards 16px, panels 18px and 24px, and the long-form sheet 28px. Rotation is part of the shape.
- **Title wall:** 6px corners on cards, buttons and the billboard, and 3px on small tags.
- **Plain:** 8px on buttons, 10px on segmented groups, 7px on segmented options, pill-shaped chips, and 4px on the focus outline.

## Components

### World switcher (shared)
A single bordered segmented control (`role="group"`, `aria-pressed`) that appears in every header. It uses the world's label font at 0.75rem, a minimum height of 2.25rem, and hairline dividers. The active option is ink on ground. Each world re-skins it:
- Lid: a black pill with a 3px white border, and the active option in yellow.
- Wall: the active option in amber.
- Canon: 8px corners and the muted body face.

### Patent
- **File a brief:** a solid examiner-red block with a 2px red border, set in 1.6rem bold display type, with an arrow svg. On hover or focus it inverts to red on sheet, and the arrow moves 4px to the right. A quiet variant uses an ink outline.
- **Reference numeral:** red Courier Prime with a dotted underline. When lit it gets a solid underline and a 12% red tint, and the matching figure part strokes red. This works both ways.
- **Audience switch:** a 1px-ruled grid of four. The active option is ink with sheet-coloured text, and hover tints it non-photo blue.
- **Form fields:** a bottom rule only (1.5px ink) with Courier Prime input. The textarea is ruled like lined paper. On focus the border turns red.

### Laptop lid
- **Sticker:** see Shapes for the form. On hover or focus it lifts: rotation eases toward 0 (×0.15), it rises 7px, scales up by 3.5%, and the lifted shadow fades in over 480ms. On activate it flips on Y (720ms, 1200px perspective) to a paper back showing problem, build, stack and link.
- **Name badge:** a "HELLO, MY NAME IS" sticker that holds the status and "Send a brief".
- **Audience stickers:** the audience switch as four small stickers under a rotated black Rubik Mono label.
- **Mark and nav:** the mark is a black pill rotated -2°. Nav links are pills at least 44px tall, with a 2px underline on hover.

### Title wall
- **Card:** a typographic poster in one of five layouts (corner, edge, ribbon, split, numeral). On hover (pointer devices only) or focus it scales up by 6%, reveals its metadata strip, and dims its siblings to 42%. The open card gets a ground-and-ink double ring.
- **Buttons:** 3rem tall. The poster button is poster ink on poster field and rises 2px. The outline button uses a 2px inset. The solid button is ink, turning white on hover. The ghost button uses a 1px edge inset. All buttons press to scale 0.98.
- **Billboard:** the featured build, with two actions (open the build, Send a brief).

### Plain
- **Buttons:** 2.875rem tall, 600 weight, 8px corners. The primary button is green and gets brighter on hover. The quiet button has a strong hairline border that turns ink on hover. Both press down 1px.
- **Segmented and chips:** the active segment is a 10% tint with a strong-hairline inset. The active chip is ink on ground.
- **Link action:** green text whose arrow moves 2px up and to the right on hover.

### Motion (per world)
Every world uses the one easing curve and animates only transforms and opacity. The exceptions are Title wall's panel row track and Patent's disclosure block size. Feedback lands in 110–300ms and signature moves in 420–720ms. Every world has a reduced-motion path in which every state still appears, but immediately.

- **Patent:**
  - FIG. 1 draws once (see Elevation and the figure rules). A numeral and its figure part light together, with a 160ms stroke change.
  - A featured sheet gets a red stamp, rotated -4°, in its margin. It lands in 420ms: scale 1.6, then 0.96, then 1.
  - A filed brief gets a FILED stamp across the form, with the date, rotated -9°. It lands in 520ms: scale 1.9, then 0.94, then 1.
  - Audience options press over 120ms.
  - "File a brief" presses down 1px. While a brief is sending, it pulses on a 1.1s loop.
  - Under reduced motion, the stamps appear in place and nothing draws.
- **Laptop lid:**
  - Lift: 480ms.
  - Press: the sticker squashes to scale 1.03 × 0.94 over 110ms, and to 1.04 × 0.9 on lifted stickers.
  - Peel: on flip, the sticker lifts 9px at one corner and turns ±3° over 300ms, then rotates on Y over 720ms.
  - Slap: a sticker lands from scale 1.45 and opacity 0 over 280ms.
  - Success: a 200px round orange SENT sticker, rotated -12°, slaps onto the form.
  - Spinner: 800ms.
  - Under reduced motion, every transition takes 0ms and every animation is off, including the view-transition group.
- **Title wall:**
  - Card grow: 460ms.
  - Press: 140ms (`--wall-press`). Cards press to 0.97, or to 1.02 while hovered. Controls press to 0.94.
  - The panel opens in place on a 460ms row track, with content fading over 260ms and moving over 460ms.
  - Entrances rise 0.4rem over 420ms (260ms for form states).
  - Copy confirmation pops from scale 0.85 over 260ms.
  - "Brief sent" slides in like a notification (transform 520ms, opacity 300ms), then leaves on its own.
  - Spinner: 700ms.
  - Under reduced motion, transitions are off and only opacity changes.
- **Plain:**
  - Duration tokens: `--c-press` 120ms, `--c-fast` 180ms, `--c-draw` 240ms, `--c-slide` 280ms, `--c-slow` 300ms.
  - The segmented control has one pill that slides to the pressed option. Chips fade their own fill instead.
  - Swapped content pops in at `--c-slow`.
  - The sent check draws by wiping its cover off over 420ms, after a 160ms delay.
  - Spinner: 700ms.
  - Under reduced motion, nothing moves and states swap.

## Do's and Don'ts

### Do:
- **Do** read only `--w-*` tokens on any surface outside the homepage, so it follows the active world without extra code.
- **Do** scope every homepage-world selector under its `.world-<id>` root.
- **Do** ship every new section in all four worlds, with the same `data-analytics-section` id and the same `track()` events.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for every transition, and give every motion a reduced-motion path.
- **Do** keep patent figure numerals equal to real parts of the case (102, 104 and so on). Never pad a range.
- **Do** choose wall poster ink by computed contrast of at least 4.5:1.
- **Do** render the audience question, `orderedWork`, and `buyer.cta` in every world, and reorder through a view transition with a reduced-motion fallback that swaps at once.

### Don't:
- **Don't** put examiner red on anything in patent except numerals, status, focus and the one action.
- **Don't** use a poster hue from 40–110° on the title wall. Amber belongs to focus.
- **Don't** add shadows to patent or plain surfaces. Don't flatten lid stickers or wall posters.
- **Don't** round patent corners, and don't square lid stickers.
- **Don't** add a second family to the title wall. Use Archivo's width axis instead.
- **Don't** let a world drop the audience switch, the brief builder, or the contact form.
- **Don't** apply an inferred audience without the note that says why it was picked.
