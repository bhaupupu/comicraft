# 4 · Component Architecture

## Principles

- **Server-first.** Pages are Server Components; only interactive/animated pieces are
  `"use client"`. This keeps First Load JS low (home ≈ 154 kB).
- **Data-driven pages.** The six feature pages are one component (`FeaturePage`) fed by
  `lib/features-data.tsx`. Change copy/data, not markup. Pricing, nav, and brand all live in
  `lib/site.ts`.
- **A small comic "vocabulary."** Reusable primitives (`panel`, `speech-bubble`, `halftone`,
  `star-burst`, process-art) compose every screen, so the look stays consistent.
- **One boundary rule.** Never pass a component/function as a prop from a Server Component into a
  Client Component (React can't serialize it). Pass a serializable key (e.g. a `slug`) and resolve
  the data on the client. (This was a real build error, fixed in `FeaturePage`.)

## Tree

```
app/layout.tsx  (Server)
├── next/font (display, sans, mono, comic) → CSS vars
├── <SiteHeader>            "use client"  — sticky, scroll state, mobile sheet
│     └── <Logo>, <Button>
├── <main>{children}</main>
└── <SiteFooter>            (Server)      — CTA band + link columns + <Halftone>

app/page.tsx  (Server) — composes:
├── <Hero>                 client — copy + prompt field + <HeroPipeline>
│     └── <HeroPipeline>   client — the auto-playing pipeline demo
├── <Principles>           client — 4 manifesto cards (reveal)
├── <HowItWorks>           client — 6 numbered step panels
├── <FeaturesOverview>     client — 6 cards from features-data
├── <StudioPreview>        client — editor mock + callouts
└── <PricingPreview>       (Server) → <PricingCards> (client)

app/features/page.tsx        (Server) — index list from features-data
app/features/[slug]/page.tsx (Server) — generateStaticParams + notFound → <FeaturePage slug>
app/studio/page.tsx          (Server) → <Studio> (client)
app/pricing/page.tsx         (Server) — <PricingCards> + comparison table + FAQ (<details>)
app/not-found.tsx            (Server) — <SpeechBubble> 404
```

## Component contracts (the reusable layer)

| Component | Location | Props (key) | Notes |
| --- | --- | --- | --- |
| `Button` | `components/ui/button.tsx` | `variant` (primary/accent/pop/ghost/outline), `size`, `href?` | Polymorphic `<a>`(Link)/`<button>`, forwardRef, active-press shadow |
| `SectionHeading` | `components/ui/section-heading.tsx` | `kicker`, `title`, `lead`, `align`, `as` | Staggered reveal; client |
| `Halftone` | `components/comic/halftone.tsx` | `dot`, `fade`, `color`, `className` | Decorative dot field |
| `SpeechBubble` | `components/comic/speech-bubble.tsx` | `tail`, `tone`, `think` | Ink-outlined balloon w/ tail |
| `ComicPanel` | `components/comic/comic-panel.tsx` | `caption`, `tag`, `tilt` | Framed art region |
| `StarBurst` | `components/comic/star-burst.tsx` | `fill` | SVG POW badge (points rounded for hydration) |
| `process-art` | `components/comic/process-art.tsx` | `className` | 6 schematic SVG illustrations |
| `Logo` | `components/layout/logo.tsx` | — | Nib glyph + wordmark from `site.name` |

## State & interactivity

- **`SiteHeader`** — `scrolled` (scroll listener → border/blur), `open` (mobile sheet; locks body
  scroll). `AnimatePresence` for the sheet.
- **`HeroPipeline`** — a timed state machine: typewriter (`typed`) → stage stepper (`stage`) →
  hold → loop. Honors `useReducedMotion()` (renders finished state, no loop). Cleans up all timers
  on unmount.
- **`Studio`** — the richest client component: `tool` (active left-rail tool → `ContextPanel`),
  `selected` (panel → inspector), `messages` + `busy` (AI assistant chat with simulated latency),
  `zoom`. All self-contained (no backend) — the seam where real APIs attach (see roadmap).

## Where the real backend attaches

The Studio is intentionally a faithful **mock** of the eventual app. To make it live:
- Replace the canned `send()` in `Studio` with a call to the orchestration API
  (`/api/generate`, see `docs/06-ai-architecture.md`).
- Replace `PANELS` / `CHARACTERS` static data with project state (server actions + a store like
  Zustand for canvas, React Query for async generations).
- Swap `process-art` placeholders for `next/image` of rendered assets from the asset bucket.

## Conventions

- `cn()` (clsx + tailwind-merge) for class composition.
- Motion variants centralized in `lib/motion.ts` (`fadeUp`, `panelIn`, `bubblePop`, `stagger`,
  `popSpring`, `inViewOnce`) — never hand-roll durations per component.
- Icons: `lucide-react` (tree-shaken).
- Strict TypeScript; no `any` in app code.
