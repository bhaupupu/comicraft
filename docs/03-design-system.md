# 3 · Design System — "Premium Editorial Comic Studio"

The system is implemented in `tailwind.config.ts` + `app/globals.css`. This document is the spec
behind those files.

## Design principles

1. **Paper, not screen.** The canvas is warm paper, not a dark UI. Ink is the structural color.
2. **One pop, used sparingly.** A single marker-yellow highlight + a riso-red accent. No gradients
   as a crutch, no neon.
3. **Depth from line, not blur.** Hard offset "comic-panel" shadows and 2px ink borders create
   hierarchy — a printed, tactile feel.
4. **Texture is the brand.** Halftone dot fields and a subtle paper grain signal "comic" without
   kitsch.
5. **Type does the heavy lifting.** Big editorial display type; restrained UI mono for chrome.
6. **Show process, never random output.** All illustration is schematic line-art of *the workflow*.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#FAF6EE` | Page background |
| `paper-deep` | `#F2EADB` | Recessed/alternating sections |
| `paper.card` / white | `#FFFFFF` | Panels, cards |
| `ink` | `#181410` | Text, all line-work, primary buttons |
| `ink-soft` | `#4A423B` | Body copy |
| `ink-faint` | `#8C8175` | Captions, placeholders |
| `hairline` | `#E7DECE` | Subtle borders on paper |
| `accent` (marker yellow) | `#FFD23F` | Highlights, featured emphasis, primary "pop" |
| `pop` (riso red) | `#F0412E` | Energy, "live" dots, selected state, secondary CTA |
| `pop-blue` | `#2D6BFF` | Info / Scene feature accent (sparing) |
| `pop-mint` | `#13B07C` | Success / "generated" checks |
| `pop-violet` | `#6C4DF6` | Panel feature accent (sparing) |

Contrast: body text is `ink`/`ink-soft` on `paper`/white (≥ 7:1). Yellow is **never** used for text
on white — only as a highlight behind ink text or as a fill under ink. Pop-red text only on white.

## Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display / headings | **Bricolage Grotesque** 700–800 | Editorial, characterful; `letter-spacing:-0.02em`, tight leading |
| Body / UI | **Inter** | Readable, neutral |
| Chrome / labels / kbd | **JetBrains Mono** | "AI STUDIO" kickers, prompt text, `kicker` class |
| In-panel lettering | **Comic Neue** | Speech-bubble + caption lettering *only* — signals comic without Comic Sans kitsch |

Loaded via `next/font/google` as CSS variables (`--font-display`, `--font-sans`, `--font-mono`,
`--font-comic`) in `app/layout.tsx`. Fluid sizing via `clamp()` for headlines.

## Signature motifs (Tailwind utilities / components)

- **`.panel` / `shadow-panel`** — 2px ink border + hard offset shadow (`5px 5px 0 #181410`). The
  core surface. Variants: `shadow-panel-sm`, `-lg`, `-accent`, `-pop`.
- **`.marker`** — yellow highlighter sweep behind inline text (`linear-gradient(transparent 58%, accent 58%)`).
- **`.halftone`** — radial-dot field; `<Halftone>` component for decorative layers, with `fade` mask.
- **`.kicker`** — mono, uppercase, tracked-out section eyebrow with a red dot.
- **`<SpeechBubble>`** — ink-outlined balloon with a rotated-square tail; tones + "think" variant.
- **`<StarBurst>`** — SVG spiky "POW!" badge (e.g. "Best value" on pricing).
- **`<ComicPanel>`** — framed art region with optional numbered tag chip + yellow caption box.
- **Process art** (`components/comic/process-art.tsx`) — `CharacterSheetArt`, `StoryThreadArt`,
  `SceneArt`, `PanelGridArt`, `DialogueArt`, `ComicPageArt`. Schematic, never realistic.

## Spacing, radius, shape

- Container max-width **1200px**, 20px gutters (`.container-page`).
- Radii: `rounded-panel` 18px, `rounded-bubble` 24px, pills for buttons/chips.
- Borders: **2px ink** is the default structural border; 1px `hairline` for soft table rules.

## Page-by-page application

### Landing `/`
Hero (paper + yellow wash + halftone) → Principles (4 manifesto cards) → How It Works (6 numbered
panels) → Features (ink-bordered cards on `paper-deep`) → Studio preview (browser-chrome mock with
callouts) → Pricing preview (3 collectible cards) → footer CTA band (ink, halftone).
Rhythm alternates `paper` / `paper-deep` sections separated by 2px ink rules.

### Feature pages `/features/[slug]`
Split hero (copy + big line-art panel) → transformation flow (connected stage chips) → worked
example (prompt-in card → outputs-out checklist) → 3 "why different" panels → 3 cross-links.
Each feature carries an `accent` key for sparing per-feature color.

### Studio `/studio`
Editor chrome: top bar (project, page, undo/redo, Preview, Export) → left tool rail (ink) →
context panel → halftone canvas with selectable panels + zoom → right AI-assistant + layer
inspector. Selected panel uses the `pop` (red) ring. This is the one page that reads as *software*,
not marketing — denser, more chrome, still on-brand.

### Pricing `/pricing`
Three "Issue #1/2/3" collectible cards (featured = ink card, lifted, "Best value" starburst) →
comparison table (yellow-tinted Creator column) → FAQ (`<details>` with rotating +) → CTA.

## Accessibility baked in

- Focus ring is an **ink outline** (`:focus-visible`), not browser-blue.
- Skip-to-content link in `app/layout.tsx`.
- `prefers-reduced-motion` globally neutralizes animation in `globals.css`.
- Color is never the only signal (checks, labels, and icons accompany state).
- Semantic landmarks: `<header><main id="main"><footer>`, `<nav aria-label>`, `<ol>` for ordered
  steps, real `<button>`/`<a>` (via the polymorphic `<Button>`).
