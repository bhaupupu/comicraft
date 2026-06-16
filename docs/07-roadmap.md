# 7 · Technical Implementation Roadmap

A phased path from "marketing site + Studio mock" (this repo) to a production AI comic platform.

## Phase 0 — Foundation ✅ (this repo)
- Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion scaffold.
- Design system (tokens, type, comic motifs), shared component library.
- All marketing pages, six data-driven feature pages, **interactive Studio mock**, pricing.
- Verified: `tsc` clean, `next build` prerenders 13 routes.

## Phase 1 — Accounts & data ✅ (built — see docs/10-setup-guide.md)
- **Auth** ✅: Auth.js v5 (free/self-hosted), email+password (bcrypt) + optional Google/GitHub OAuth;
  edge-safe middleware gates `/studio/*`; `/login`, `/signup`. (`/reset` = a fast follow.)
- **DB** ✅: Postgres + Prisma. Models shipped: `User`, `Account`, `Session`, `Project`, `Character`,
  `Page`, `Panel`, `Asset`, `Generation`, `Subscription` (+ enums for plan/status/kind).
- **State** ✅: server actions (signup/login/create-project) + React Query provider (async jobs) +
  Zustand store (`lib/store/editor.ts`, wired into the Studio canvas).
- **Dashboard + editor** ✅: `/studio` lists real projects; `/studio/p/[id]` opens the editor for a
  persisted project.
- **Storage** ⏳: env + abstraction documented; the bucket is exercised in Phase 2 when assets exist.

## Phase 2 — The generation pipeline ✅ core built (see docs/11-phase2-guide.md)
- **Orchestrator** ✅: premise → story/script/dialogue (zod-validated JSON) → persisted
  characters/page/panels → images. (`lib/ai/orchestrator.ts`)
- **Model router** ✅: provider-agnostic fallback chain — Gemini (Nano Banana) → Cloudflare FLUX
  (free) → Pollinations → mock; text = Gemini → Anthropic → mock. Add fal/Replicate as one adapter
  each. (`lib/ai/router.ts`, `lib/ai/providers/*`)
- **Character engine** ✅: reference image per character; refs fed into panels for consistency
  (when the image engine supports refs, e.g. Nano Banana).
- **Panel engine** ✅: per-shot generation conditioned on style lock + character refs.
- **Metering** ✅: per-render `Generation` rows; plan caps (FREE=2 lifetime / paid monthly); failures
  never billed. (`lib/ai/metering.ts`)
- **Storage** ✅: data-URL default, local FS, or R2. (`lib/storage.ts`)
- **Streaming progress** ✅: generation streams over SSE (`app/api/projects/[id]/generate`); the editor
  shows the pipeline live (story → cast → panels) via `GenerateStream`, plus a **Regenerate** button.
- ⏳ **Durable queue**: the SSE run is request-tied (work saves, but progress isn't resumable on
  disconnect) — move long renders to a durable queue (Inngest/Temporal/Redis) with a Pro priority lane.
- ⏳ **Live in-editor regeneration**: wire the AI-assistant chat to targeted single-panel re-renders.

## Phase 3 — The real editor (weeks 4–7, overlaps)
- Turn the Studio mock into a live canvas: non-destructive **layers** (bg/chars/fg/lettering),
  drag/resize/split panels, zoom/pan.
- **Lettering layer**: vector balloons + editable text, auto-placement with manual override.
- **AI assistant**: wire the margin chat to targeted regenerations ("low-angle hero shot, panel 2").
- **Versioning**: per-panel history; undo/redo across the project.

## Phase 4 — Export & sharing ✅ core built
- **Exporters** ✅: client-side canvas composition → **PNG page**, **webtoon strip**, and **PDF**
  (jsPDF, lazy-loaded). Renders panel art + lettering + title. (`lib/export/comic-export.ts`,
  `components/studio/export-menu.tsx`, wired into the Studio top bar.)
- **Watermark** ✅: free-plan exports get an Comicraft watermark (`watermark` flag from the user's plan);
  paid plans export clean.
- ⏳ **Public share links** + "remix" gating + server-side HD render for very large pages.

## Phase 5 — Billing & plans ✅ core built (see docs/12-phase5-billing.md)
- **Stripe** ✅: Free / Creator (\$5) / Pro (\$20) via Checkout (subscription mode) + the customer
  portal; a signature-verified webhook syncs `User.plan` + `Subscription`. Plan-aware CTAs on the
  pricing cards (`components/billing/plan-cta.tsx`); dashboard upgrade chip + post-checkout banner.
- **Metered enforcement** ✅: Phase-2 metering already reads `User.plan`, so upgrades lift limits
  immediately; work is always preserved (the cap gates only new generation, never deletes projects).
- ⏳ Usage dashboard with invoice history (`/studio/billing`), annual plans/proration, team seats +
  shared character library (Pro).

## Phase 6 — Scale & polish (ongoing)
- Move hot generation paths to **self-host (Modal/RunPod)** at ~25k–50k img/mo.
- A/B **Nano Banana vs Seedream 4.0** via the router; cache character tokens.
- Optional **motion-comic** add-on (Higgsfield/Kling/Veo).
- Observability (OpenTelemetry), cost dashboards, content-moderation + C2PA provenance.
- GSAP scroll set-pieces on marketing (pinned How-It-Works, page-flip export preview).

## Cross-cutting
- **Perf**: keep marketing First Load JS low (server-first); lazy-load GSAP; `next/image` for assets.
- **A11y**: maintain focus rings, reduced-motion, semantic landmarks; audit each new surface.
- **Testing**: Playwright E2E for the generation + edit + export happy paths; Vitest for the router.
- **CI**: typecheck + build + lint on every PR; preview deploys (Vercel).

## Suggested stack summary
Next.js 14 · TS · Tailwind · Framer Motion (+GSAP) · Auth.js/Clerk · Postgres/Prisma ·
React Query + Zustand · S3 · Stripe · fal.ai/Replicate → Modal/RunPod · Claude · Nano Banana/FLUX.2/SDXL.
