# Comicraft — the AI comic creation studio

> **Type an idea. Get a comic.**
> A premium, light, editorial AI comic *creation* platform — Figma-for-comics, not a comic reader.

This repo is a from-scratch redesign of the product as an **AI comic creation studio**. The
entire experience communicates **creation, not consumption**: there is no gallery of random
AI-generated comics anywhere on the marketing site. Every visual sells the *workflow* — the
prompt, the pipeline, the editor, the transformation.

---

## Run it

The **marketing site** runs with zero config. The **app** (accounts + Studio, Phase 1) needs a free
Postgres URL and an auth secret — a 10-minute setup in **[docs/10-setup-guide.md](docs/10-setup-guide.md)**.

```bash
npm install                     # also runs `prisma generate`
# marketing site only:
npm run dev                     # http://localhost:3000

# full app (after .env.local — see the setup guide):
npm run db:push                 # create tables in your database
npm run dev                     # sign up → dashboard → create a project

npm run build && npm run start  # production
npm run typecheck
```

Requirements: Node 18.18+ (Next.js 14). The marketing pages, feature pages, and pricing render
without env vars; `/login`, `/signup`, `/studio` need the Phase-1 env (DB + `AUTH_SECRET`).

---

## What's built

A real, runnable Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion application.

| Route | What it is |
| --- | --- |
| `/` | Landing page — animated hero pipeline, how-it-works, feature grid, studio preview, pricing preview |
| `/features` | Feature index (six tools) |
| `/features/[slug]` | Six data-driven feature pages (story, character, scene, panel, dialogue, editor) |
| `/login`, `/signup` | **Auth** (Phase 1) — Auth.js email/password + optional Google/GitHub |
| `/studio` | **Dashboard** (Phase 1) — your projects, "New comic" prompt; auth-gated |
| `/studio/p/[id]` | **The Studio editor** — Figma-for-comics canvas (tools, AI assistant, layers) |
| `/pricing` | Comic-collectible pricing cards, comparison table, FAQ |
| `*` | Custom 404 ("Panel not found!") |

Verified: `tsc --noEmit` passes, `next build` compiles all 15 routes, middleware gates `/studio`
(unauth → `/login`), all public routes return 200.

**Phase 1 (accounts & data) is built**: Auth.js v5, Prisma + Postgres schema, protected routes,
a real projects data layer, and the React Query + Zustand state layer. See
[docs/10-setup-guide.md](docs/10-setup-guide.md) to run it.

**Phase 2 (generation pipeline) core is built**: premise → story → cast → page → panels via a
provider-agnostic model router (Gemini "Nano Banana" → Cloudflare FLUX → mock fallback), zod-validated
story schema, per-plan metering, and data-URL/R2 storage — wired into the editor. Runs at $0 with the
mock provider; real with a Gemini key. See **[docs/11-phase2-guide.md](docs/11-phase2-guide.md)**
(includes a security note + free-image options). What's next in [docs/07-roadmap.md](docs/07-roadmap.md).

---

## Design language — "premium editorial comic studio"

- **Warm paper** background (`#FAF6EE`) + **ink** line-work (`#181410`), one **marker-yellow**
  highlight (`#FFD23F`) and a **riso-red** energy pop (`#F0412E`). No gradient soup, no neon.
- Depth comes from **hard offset "comic panel" shadows** and **halftone** texture, not blur.
- Type: **Bricolage Grotesque** (display) · **Inter** (body) · **JetBrains Mono** (UI chrome) ·
  **Comic Neue** (in-panel lettering only).
- All "art" on the site is **deliberate SVG line-art of the process** (turnarounds, panel grids,
  story threads) — never fake generated output.

Rename the product, re-price, or re-word the nav in one place: `lib/site.ts`.

---

## Project structure

```
app/                     # App Router routes
  layout.tsx             # fonts, metadata, header/footer
  page.tsx               # landing (composes sections/*)
  features/              # index + [slug] dynamic feature pages
  studio/                # the editor
  pricing/               # pricing
components/
  layout/                # header, footer, logo
  ui/                    # button, section-heading
  comic/                 # halftone, speech-bubble, comic-panel, star-burst, process-art
  sections/              # hero, how-it-works, features, studio-preview, pricing, ...
  studio/                # the interactive Studio editor
lib/
  site.ts                # brand, nav, pricing — single source of truth
  features-data.tsx      # the six feature pages, data-driven
  motion.ts              # shared Framer Motion variants
  utils.ts               # cn()
docs/                    # the nine deliverables (sitemap, UX, design system, AI arch, …)
```

## The nine deliverables

See [`docs/`](docs/00-overview.md):

1. [Sitemap](docs/01-sitemap.md)
2. [UX flows](docs/02-ux-flows.md)
3. [Design system](docs/03-design-system.md)
4. [Component architecture](docs/04-component-architecture.md)
5. [Animation plan](docs/05-animation-plan.md)
6. [AI generation architecture](docs/06-ai-architecture.md)
7. [Technical roadmap](docs/07-roadmap.md)
8. [Suggested models](docs/08-models.md)
9. [Conversion optimization](docs/09-conversion.md)
