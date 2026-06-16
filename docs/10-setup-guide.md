# 10 · Setup Guide (Phase 1) — what *you* need to do

Phase 1 (accounts & data) is built. To run it on your machine you need **two things**: a
PostgreSQL database URL and an auth secret. OAuth (Google/GitHub) is optional. Everything here has a
**free** path.

> ⏱️ ~10 minutes. You won't touch the AI keys at all in Phase 1 — those are for Phase 2.

---

## ✅ Step-by-step

### 1. Install & generate the client
```bash
npm install          # also runs `prisma generate` via postinstall
```

### 2. Get a free PostgreSQL database (pick ONE)

**Option A — Neon (recommended, 2 min, no install):**
1. Go to **https://neon.tech** → sign up (free).
2. Create a project → it shows a **connection string**.
3. Copy the string that looks like:
   `postgresql://user:pass@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`

**Option B — Supabase:** https://supabase.com → New project → *Project Settings → Database →
Connection string (URI)*. Use the **pooled** "Transaction" string for serverless.

**Option C — Local Postgres:** install Postgres, then
`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inkwell"`.

### 3. Generate your auth secret
```bash
npx auth secret
```
This prints (and can auto-write) `AUTH_SECRET`. Or: `openssl rand -base64 33`.

### 4. Create `.env.local`
Copy the template and fill in the two required values:
```bash
cp .env.example .env.local       # Windows PowerShell: Copy-Item .env.example .env.local
```
Minimum to run:
```
DATABASE_URL=postgresql://...your Neon string...
AUTH_SECRET=...the value from step 3...
NEXTAUTH_URL=http://localhost:3000
```

### 5. Create the database tables
```bash
npm run db:push      # pushes the Prisma schema → your database
```
(Use `npm run db:studio` anytime to browse your data in a GUI.)

### 6. Run it
```bash
npm run dev          # http://localhost:3000
```
Now:
1. Click **Start creating** → you're sent to `/login`.
2. Go to **Create an account**, sign up with email + password.
3. You land on **`/studio`** (your dashboard).
4. Type an idea → **New comic** → you're dropped into the **editor** for that project.
5. Refresh `/studio` — your project is saved (it's in Postgres).

That's Phase 1 working: real accounts, protected routes, persisted projects.

---

## 🔑 (Optional) Enable "Continue with Google / GitHub"

The app works with email/password alone. To add social login:

**Google** — https://console.cloud.google.com → *APIs & Services → Credentials → Create OAuth client
ID → Web application*. Authorized redirect URI:
`http://localhost:3000/api/auth/callback/google`. Put the ID/secret in `.env.local`:
```
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

**GitHub** — https://github.com/settings/developers → *New OAuth App*. Callback URL:
`http://localhost:3000/api/auth/callback/github`.
```
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```
The buttons appear automatically once the keys are present. (For production, add your live domain's
callback URL too.)

---

## 📋 All API keys — what, where, free?

### Phase 1 — needed now
| Variable | Purpose | Where to get it | Cost |
| --- | --- | --- | --- |
| `DATABASE_URL` | Postgres connection | Neon / Supabase / local | **Free** tier |
| `AUTH_SECRET` | Signs sessions | `npx auth secret` | **Free** |
| `AUTH_GOOGLE_ID/SECRET` | Google login *(optional)* | Google Cloud Console | **Free** |
| `AUTH_GITHUB_ID/SECRET` | GitHub login *(optional)* | GitHub Dev Settings | **Free** |
| `NEXTAUTH_URL` | Callback base URL | — (just set it) | — |

### Phase 2 — needed later (AI generation; not required to run Phase 1)
| Variable | Purpose | Where | Cost |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | **Nano Banana** image engine + can also do text | https://aistudio.google.com/apikey | **Free tier**, then paid |
| `ANTHROPIC_API_KEY` | Claude — story/script/dialogue brain | https://console.anthropic.com | Paid (trial credits) |
| `FAL_KEY` | Managed SDXL/FLUX inference | https://fal.ai | Free credits, then ~\$0.006–0.012/img |
| `REPLICATE_API_TOKEN` | Many image models behind one API | https://replicate.com | Pay-per-use |
| `HIGGSFIELD_API_KEY` | *Optional* motion-comic export | https://higgsfield.ai | Paid |
| `ASSET_BUCKET_*` | Store rendered images (S3-compatible) | Cloudflare R2 | **Free** 10 GB |

---

## 🆓 Free model alternatives (run generation at \$0)

You do **not** need any paid AI key. Here's a completely free path for Phase 2, plus the open models.

### The brain (text: story / script / dialogue)
| Free option | How | Notes |
| --- | --- | --- |
| **Google Gemini** (free tier) | `GEMINI_API_KEY` from AI Studio | Same key does text **and** images — best single free key |
| **Groq** | https://groq.com (free) | Very fast Llama 3.x / Qwen / GPT-OSS; generous free tier |
| **OpenRouter** free models | https://openrouter.ai | Several `:free` models (Llama, Qwen, DeepSeek) |
| **Ollama** (local, \$0) | https://ollama.com → `ollama run llama3.1` | Runs on your machine, no key, fully private |

### The image engine (characters / scenes / panels)
| Free option | How | Notes |
| --- | --- | --- |
| **Gemini 2.5 Flash Image ("Nano Banana")** | AI Studio free tier | **Keeps the recommended consistency engine at \$0 to start** |
| **Cloudflare Workers AI** | https://developers.cloudflare.com/workers-ai | Free tier includes **FLUX.1 [schnell]** + **SDXL**, serverless, no GPU |
| **Pollinations.ai** | `https://image.pollinations.ai/prompt/<text>` | Completely free, **no API key**, FLUX-based — great for prototyping |
| **Hugging Face Inference API** | https://huggingface.co (free token) | FLUX.1-schnell / SDXL / SD 3.5 on the free tier |
| **fal.ai / Together / Replicate** | sign-up credits | Free starting credits to trial managed FLUX/SDXL |
| **Local ComfyUI / Fooocus / A1111** | run on your own GPU (8–12 GB+) | \$0 forever; full control; best for LoRA character training |

### Open-weight models (free to use / self-host)
- **FLUX.1 [schnell]** — Apache-2.0, **commercial use allowed**, fast, runs locally. Best free default.
- **SDXL** + **SDXL-Turbo** — open, huge ecosystem, ControlNet/IP-Adapter/LoRA.
- **Stable Diffusion 3.5** (Large / Medium) — open weights.
- **Pony Diffusion V6 XL** — best free **anime/manga** stylization (SDXL fine-tune).
- **Qwen-Image** — strong open model, good text rendering.
> Note: **FLUX.1 [dev]** and **FLUX.2 [dev]** are *non-commercial* weights — use `[schnell]` (Apache-2.0)
> for free commercial work, or the BFL API for `[pro]`.

### 💯 A 100%-free starter stack
- **DB:** Neon free · **Auth:** Auth.js + (optional) Google/GitHub OAuth (free)
- **Text brain:** Gemini free tier *(or Groq / local Ollama)*
- **Image engine:** Gemini 2.5 Flash Image free tier *(or Cloudflare Workers AI FLUX-schnell / Pollinations)*
- **Storage:** Cloudflare R2 free *(or Supabase Storage free)*
- **Hosting:** Vercel Hobby (free) + Neon — deploys this repo as-is

With this stack you can run the whole product — accounts, data, and AI generation — without spending
anything, and only move to paid managed inference (fal.ai) or self-hosting when volume grows
(~25k–50k images/month is the usual cross-over; see `docs/08-models.md`).

---

## 🧯 Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Environment variable not found: DATABASE_URL` | `.env.local` missing/typo'd; restart `npm run dev` after editing env |
| `Can't reach database server` | Neon string needs `?sslmode=require`; check project isn't paused |
| Login does nothing / 500 | `AUTH_SECRET` not set, or `NEXTAUTH_URL` wrong |
| OAuth "redirect_uri_mismatch" | Callback URL must be `…/api/auth/callback/<provider>` exactly |
| Schema changes not reflected | Re-run `npm run db:push` |
| `prisma` client type errors | `npm run db:generate` |

Next: **Phase 2 — the generation pipeline** (orchestrator + model router). See `docs/07-roadmap.md`.
