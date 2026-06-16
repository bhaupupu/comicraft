# 5 · Animation Plan

> **Rule:** motion explains the product. Every animation maps to a real step in making a comic.
> Nothing animates purely for decoration. Everything degrades gracefully.

## Tooling

- **Framer Motion** — component reveals, the hero pipeline, the mobile sheet, assistant typing.
  Variants are centralized in `lib/motion.ts`.
- **GSAP + ScrollTrigger** — reserved for scroll-scrubbed/pinned sequences in Phase 2 (e.g. a pinned
  "How It Works" comic strip that draws as you scroll). Listed as a dependency; not required for the
  current build, which uses Framer's `whileInView`.
- **CSS keyframes** (in `tailwind.config.ts`) — cheap, GPU-friendly loops: `marker-sweep`,
  `bubble-pop`, `panel-in`, `float`, `caret-blink`.

## Signature animations (built)

| # | Where | What | How |
| --- | --- | --- | --- |
| 1 | Hero | **Live pipeline run** — types a prompt, then lights each stage (Story→…→Comic) while a comic page assembles panel-by-panel, then loops | `HeroPipeline` state machine; panels `panelIn` (spring), checklist checks `popSpring`, progress bar width tween |
| 2 | Global | **Panels assembling** — cards/panels rise + settle with a tiny rotation | `panelIn` variant (`opacity/y/rotate/scale` → spring) |
| 3 | Global | **Speech bubbles popping** — overshoot pop | `bubblePop` / `popSpring`, `bubble-pop` keyframe |
| 4 | Headings | **Staggered reveal** — kicker → title → lead | `stagger()` + `fadeUp`, `whileInView` once |
| 5 | Hero/links | **Marker highlight** under key words | `.marker` (static) / `marker-sweep` keyframe (animated option) |
| 6 | Pricing | **Star-burst** "Best value" settles at a tilt | spring rotate-in |
| 7 | Header | **Mobile sheet** slide/fade | `AnimatePresence` |
| 8 | Studio | **AI assistant typing** dots + message-in | looping dot opacity; messages append |
| 9 | Buttons | **Press physics** — offset shadow collapses on `:active` | Tailwind active utilities |

## Planned (Phase 2, GSAP)

- **Pinned How-It-Works strip** — scroll scrubs the 6 beats; each panel "inks in" (SVG `pathLength`
  draw) as it enters. Maps 1:1 to the pipeline.
- **Story timeline expanding** — beats unspool along a drawn thread on the Story feature page.
- **Comic page flip** — a page-turn transition between finished pages in the export preview.
- **Character "appearing"** — turnaround poses fade in around the model line on the Character page.

## Performance budget

- Animate only **`transform` and `opacity`** (compositor-friendly). No animated `width/height/top`
  except the hero progress bar (small, infrequent).
- **`whileInView` with `once: true`** (`inViewOnce`) — reveals fire once; no scroll-thrash.
- Hero loop uses `setTimeout` chains with full cleanup on unmount; no `setInterval` leaks.
- Lazy-load GSAP/ScrollTrigger only on pages that use it (dynamic import) to protect First Load JS.
- Target: no long tasks > 50ms on mid-tier mobile during reveals; keep hero JS off the critical path
  for LCP (the headline is static text, not animated).

## Accessibility & graceful degradation

- **`prefers-reduced-motion`** — `globals.css` reduces all durations to ~0 and disables smooth
  scroll; `HeroPipeline` checks `useReducedMotion()` and renders the **finished** pipeline (no loop).
- **Mobile** — reveals still run (they're cheap) but the hero pipeline stacks; Phase-2 scrubbed GSAP
  sequences fall back to static finished states below a breakpoint.
- **No motion-only meaning** — anything conveyed by animation (e.g. "generated") is also conveyed by
  a persistent icon/label.
- **Hydration safety** — any computed geometry (e.g. `StarBurst` points) is rounded to fixed
  precision so server and client render byte-identical markup.
