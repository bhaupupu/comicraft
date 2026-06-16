# 11 · Phase 2 Guide — the generation pipeline

Phase 2 turns "New comic" into real generation: **premise → story → cast → page → panels**, with a
provider-agnostic model router, metering, and storage. It runs at **\$0** out of the box (mock
provider) and uses **real Gemini** when your key is present.

> 🔐 **Security first — please read.** Your real `DATABASE_URL` (Neon password) and `GEMINI_API_KEY`
> are currently in **`.env.example`**, which is committed to git (it is NOT git-ignored) and was
> shared in chat. Two actions:
> 1. **Move them to `.env.local`** (git-ignored). Next.js reads `.env.local`, **not** `.env.example`,
>    so the app won't even pick them up where they are now.
> 2. **Rotate both** — regenerate the Gemini key (AI Studio) and reset the Neon database password —
>    since they've been exposed. Keep `.env.example` as blank placeholders only.

---

## What got built

| Piece | File | Role |
| --- | --- | --- |
| Story schema | `lib/ai/schema.ts` | zod-validated structured story (title/logline/acts/characters/panels) |
| Provider contracts | `lib/ai/provider.ts` | `TextProvider` / `ImageProvider` interfaces |
| Gemini adapter | `lib/ai/providers/gemini.ts` | text + Nano Banana image (your key) |
| Anthropic adapter | `lib/ai/providers/anthropic.ts` | optional Claude text brain |
| Cloudflare adapter | `lib/ai/providers/cloudflare.ts` | **free** FLUX-schnell images |
| Mock adapter | `lib/ai/providers/mock.ts` | zero-key story + SVG panels (always works) |
| Router | `lib/ai/router.ts` | picks engines as a fallback chain → mock |
| Prompts | `lib/ai/prompts.ts` | story / character / panel prompt builders |
| Storage | `lib/storage.ts` | data-URL (default) / local FS / R2 |
| Metering | `lib/ai/metering.ts` | per-plan image budget (FREE=2) |
| Orchestrator | `lib/ai/orchestrator.ts` | the whole pipeline, persisting to Postgres |
| Action | `app/studio/actions.ts` | `generateProjectAction` |
| Editor | `app/studio/p/[id]/page.tsx` + `components/studio/studio.tsx` | renders real story, cast & panels |

## Run it
1. Ensure Phase 1 is set up (DB + `AUTH_SECRET` → `docs/10-setup-guide.md`) and the keys are in
   **`.env.local`**.
2. `npm run db:push` (if you haven't) → `npm run dev`.
3. Sign up → dashboard → type an idea → **New comic** → on the project page click **Generate my comic**.
4. You'll watch it **stream live**: *Writing the story ✓ → Designing the cast (x/N) → Rendering the page (x/M)*,
   then the editor loads your real story, named cast, and lettered page. (Re-run anytime with **Regenerate** in the editor top bar.)

---

## ⚠️ Your Gemini image status (verified)

I tested your key against the live API:
- **Text** (`gemini-2.5-flash`) → **works** ✅ (generated a valid story end-to-end).
- **Image** (`gemini-2.5-flash-image`, the correct model name) → **HTTP 429: quota exceeded** ❌.
  Nano Banana image generation needs **billing enabled** on your Google AI account; the free tier's
  image quota is effectively zero.

So today the pipeline gives you a **real story + cast + dialogue**, with **free SVG placeholder
panels**. To get real panel art, do ONE of:

### Option A — enable Gemini image (best consistency)
Enable billing at https://aistudio.google.com (or Google Cloud) so `gemini-2.5-flash-image` has
quota. Then regenerate — real, character-consistent panels (Nano Banana uses your character refs).

### Option B — free real images via Cloudflare Workers AI (no Gemini billing)
1. Create a free Cloudflare account → https://dash.cloudflare.com.
2. **Workers AI** → get your **Account ID** and an **API token** (with Workers AI permission).
3. Add to `.env.local`:
   ```
   CF_ACCOUNT_ID=...
   CF_API_TOKEN=...
   ```
4. Regenerate. The router uses FLUX.1-schnell (free tier) when Gemini image fails.
   *(Note: Cloudflare can't take character reference images, so consistency is weaker than Nano Banana.)*

### Option C — stay on the free mock
Do nothing. You get on-brand SVG placeholder panels — perfect for wiring the UI and the flow.

> Pollinations (the old no-key option) now returns **HTTP 402** — it requires a paid token, so it's
> only used if you set `POLLINATIONS_TOKEN`.

---

## The model router (how "don't hardcode" works)

`getImageProvider()` builds an ordered chain and tries each until one succeeds, always ending at the
mock so generation can't fail outright:

```
GEMINI_API_KEY        → Nano Banana (gemini-2.5-flash-image)   ← character-consistent
CF_ACCOUNT_ID+TOKEN   → Cloudflare FLUX-schnell (free)
POLLINATIONS_TOKEN    → Pollinations (FLUX)
(always)              → mock SVG placeholder
```

Add fal.ai / Replicate / SDXL+LoRA by writing one more adapter in `lib/ai/providers/` and pushing it
into the chain. Text is `Gemini → Anthropic → mock`.

## Metering & cost
- Each image render is a metered `Generation` row. FREE = **2 lifetime** images (per pricing);
  CREATOR/PRO are monthly. Bump locally with `INKWELL_FREE_IMAGE_LIMIT` in `.env.local`, or set your
  user's `plan` to `PRO` in `npm run db:studio`.
- A run renders at most 6 images (to bound latency). Re-run "Generate" to continue / regenerate.
- Failed renders are recorded but **never** counted against your budget.

## Storage
- Default: **data: URLs** stored in the DB — zero config, works everywhere.
- `ASSET_STORAGE=local` → writes to `public/generated/`.
- Set `ASSET_BUCKET_*` (Cloudflare R2 free tier) for production.

## Streaming (built)
Generation streams progress over **Server-Sent Events** from `POST /api/projects/[id]/generate`
(`app/api/projects/[projectId]/generate/route.ts`). The orchestrator emits `stage`/`tick`/`done`
events ( `lib/ai/progress.ts` ) and the editor's `GenerateStream` component lights up each step live —
no more blocking spinner. A **Regenerate** button in the editor re-runs the pipeline.

## Known limits (next pass)
- The SSE stream is tied to the request: if the user closes the tab mid-run the work still saves to the
  DB, but progress isn't resumable. A **durable background queue** (Inngest/Temporal/Redis worker) is
  the production hardening — see `docs/07-roadmap.md` Phase 2 "Queue".
- The in-editor AI assistant chat is still canned; wiring it to targeted single-panel regeneration is next.
- Multi-page generation: currently page 1; "Add page" is the follow-up.
