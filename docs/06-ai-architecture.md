# 6 · AI Generation Architecture

> Researched June 2026. The brief asked me **not to hardcode an image model**, to evaluate
> **Higgsfield**, and to recommend the best architecture across quality, consistency, character
> retention, comic ability, and cost. Sources are listed at the end and in `docs/08-models.md`.

## TL;DR recommendation

1. **Do not build the core image pipeline on Higgsfield.** Higgsfield is a *video* generation
   aggregator (Sora 2, Veo 3.1, Kling, etc.) with a credit model that's punishing for high-volume
   still-image work. It's the **wrong tool for character-consistent comic panels**. Keep it as an
   **optional premium "motion-comic / animate-this-panel" feature**, not the engine.
2. **Make character consistency the architecture's center of gravity** — it's the #1 thing that makes
   or breaks an AI comic. In 2026 the strongest production answer is **Google Gemini 2.5 Flash Image
   ("Nano Banana")**, whose face-lock anchors identity at the embedding level across panels.
3. **Don't hardcode — route.** Put a **provider-agnostic model router** behind one internal API so
   you can swap engines per tier, per style, and as the market moves (it moves monthly).
4. **Letter in a separate vector/HTML layer — never bake text into the AI image.** Diffusion models
   are unreliable at text and baked text isn't editable. This is both a quality and a UX decision.

## The pipeline (orchestration)

```
                         ┌──────────────────────────────────────────┐
   one-line idea ─────►  │  ORCHESTRATOR  (LLM = Claude)             │
                         │  story → script → shot list → dialogue   │  ← text brain
                         └───────────────┬──────────────────────────┘
                                         │ structured JSON (beats, characters, shots, lines)
            ┌────────────────────────────┼─────────────────────────────┐
            ▼                            ▼                              ▼
   CHARACTER ENGINE             SCENE / PANEL ENGINE             LETTERING ENGINE
   (identity-locked refs)  ──►  (consistent art, per panel)  ──► (vector balloons + text,
   Nano Banana / SDXL+LoRA      Nano Banana edits w/ refs        placed programmatically,
                                + style lock                     NOT drawn by the model)
            └───────────────► ASSET STORE (S3) ◄──────────────────────┘
                                         │
                                         ▼
                              COMPOSITOR (the Studio canvas)
                              layers: bg / chars / fg / lettering → export (PDF / HD / webtoon)
```

### 1. The text brain — Claude
Story, three-act structure, chapter beats, a **panel-aware script**, a **shot list** (who/where/
framing/mood per panel), and **in-character dialogue**. One model orchestrates the whole narrative
and emits typed JSON the image stages consume.
- **Model:** `claude-opus-4-8` for the heavy creative pass (structure, voice); `claude-sonnet-4-6`
  for cheaper per-panel shot expansion and dialogue. Claude also acts as the **prompt compiler** —
  turning the script into well-formed image prompts and as the **"AI assistant"** in the Studio.

### 2. Character engine — the consistency core
Design a character **once**, then reuse its identity everywhere:
- **Primary:** **Gemini 2.5 Flash Image ("Nano Banana")** — generate the master reference, the
  expression set, and the turnaround; its **face-lock anchors facial structure at the embedding
  level**, which is exactly what kills cross-panel drift. Strongest zero-shot consistency in 2026.
- **Open-source / cost tier:** **SDXL (or Pony Diffusion V6 XL for stylized manga/anime) + a
  per-character LoRA**, optionally with **PuLID / IP-Adapter** for zero-shot identity. LoRA captures
  not just the face but clothing/silhouette/body language — best for a recurring series character.
- **Output:** a reusable **character identity token** (reference image set + LoRA/embedding handle)
  stored in the user's character library and injected into every later panel prompt.

### 3. Scene & panel engine
For each shot in the shot list, generate the panel art **conditioned on**: the scene's style lock,
the relevant character identity token(s), and the shot's framing/mood. Nano Banana's reference-image
editing keeps cast + style coherent across panels in a single pass; the open tier uses SDXL/FLUX with
ControlNet (pose/layout) + IP-Adapter (identity) in a ComfyUI graph.

### 4. Lettering engine (separate layer — important)
Dialogue and captions are placed as **vector/HTML balloons over the art**, with reading-order,
tails, and word-wrap computed programmatically. **No text is rendered by the diffusion model.**
Benefits: crisp legible type, instant rewrites with zero re-render and zero generation cost, and full
localization later.

### 5. Compositor
The Studio canvas assembles **non-destructive layers** (background / characters / foreground /
lettering) and exports to print PDF, HD images, or a continuous webtoon strip.

## The model router (why we "don't hardcode")

A single internal interface — `generate({ kind, prompt, refs, style, tier }) → asset` — dispatches
to providers by **tier and task**, so engines are swappable as quality/price shift:

| Plan tier | Character & panel engine | Rationale |
| --- | --- | --- |
| **Free** | SDXL/Pony on managed serverless (fal.ai/Replicate), capped | Cheapest per image; the 2 free gens cost cents |
| **Creator ($5)** | **Nano Banana** primary, SDXL+LoRA fallback | Best consistency at a price the plan supports |
| **Pro ($20)** | Nano Banana + **FLUX.2 [pro]** for photoreal, priority queue | Top quality + commercial licensing + speed |
| **Add-on** | **Higgsfield / Kling / Veo** for motion-comic export | Optional premium "animate a panel" |

Providers are abstracted so you can A/B **Nano Banana vs. Seedream 4.0** (ByteDance — more
*predictable*, a strong alternative) per request without touching product code.

## Hosting & cost (2026)

- **Managed serverless** for launch — **fal.ai** (fastest, ~\$0.006–0.012 / MP for FLUX-class) and
  **Replicate** (most model-diverse, ~\$0.003–0.05 / image) behind the router. Lowest ops burden.
- **Self-host on Modal / RunPod** once volume justifies it — batched SDXL/FLUX on A10G/H100 beats
  managed per-image pricing at roughly **25k–50k images/month**. RunPod has the cheapest raw GPU;
  Modal is the cleanest Python serverless with caching.
- **Nano Banana** via Google AI Studio / Vertex API; **FLUX.2 [dev]** weights are **non-commercial**
  — commercial use needs the BFL API or a **\$999/mo self-host license**, so prefer **FLUX.2 [pro]
  via API** unless self-host volume is high.

### Rough unit economics (panel = 1 generation)
- Free tier (SDXL managed): ~\$0.003–0.01 / panel → 2 free gens ≈ sub-cent cost.
- Creator (Nano Banana): a few cents / panel; 300 gens/mo well within a \$5 plan with margin.
- Pro (FLUX.2 pro / priority): higher per-image, offset by price + commercial licensing.

## Guardrails

- **Safety/moderation** on prompts and outputs (provider moderation + a policy layer); block disallowed
  content; watermark free-tier exports.
- **Provenance** — attach C2PA/content-credentials to exports where supported.
- **Rights** — commercial license only on Pro; surface model-license terms in `/legal/licensing`.
- **Cost control** — generations are metered server-side; edits/relettering are free; failed renders
  never bill a generation.

## Sources (June 2026)

- Higgsfield is a multi-model **video** platform (Sora 2 / Veo 3.1 / Kling / WAN / Seedance), \$15–84/mo,
  credit-based, credits expire ~90 days — [imagine.art](https://www.imagine.art/blogs/higgsfield-ai-pricing),
  [Wikipedia](https://en.wikipedia.org/wiki/Higgsfield_AI), [fluxnote.io](https://fluxnote.io/guides/higgsfield-ai-review).
- Nano Banana (Gemini 2.5 Flash Image) — embedding-level **face-lock**, production-ready cross-panel
  consistency — [Google Developers Blog](https://developers.googleblog.com/en/introducing-gemini-2-5-flash-image/),
  [jenova.ai](https://www.jenova.ai/en/resources/ai-comic-panel-creator), [comistitch.com](https://comistitch.com/blog/best-ai-comic-generator-2026/).
- Consistency techniques (PuLID vs LoRA vs IP-Adapter/InstantID) — [thinkpeak.ai](https://thinkpeak.ai/best-loras-consistent-characters-2026/),
  [runcomfy.com](https://www.runcomfy.com/comfyui-workflows/pulid-flux-ii-in-comfyui-consistent-character-ai-generation).
- FLUX.2 licensing / self-host cost / GPU needs — [bfl.ai/pricing/licensing](https://bfl.ai/pricing/licensing),
  [spheron.network](https://www.spheron.network/blog/deploy-flux2-gpu-cloud-production-guide/), [flowith.io](https://flowith.io/blog/flux-2-pro-dev-faq-licensing-lora-fine-tuning-api-rate-limits-self-hosting/).
- Provider cost comparison (fal.ai / Replicate / Modal / RunPod) — [apiscout.dev](https://apiscout.dev/guides/fal-ai-vs-replicate-vs-modal-2026),
  [gputracker.dev](https://gputracker.dev/blog/serverless-gpu-comparison), [digitalapplied.com](https://www.digitalapplied.com/blog/ai-image-generation-api-pricing-comparison-2026).
- Model/style landscape (FLUX vs SDXL vs Pony, manga) — [bentoml.com](https://www.bentoml.com/blog/a-guide-to-open-source-image-generation-models),
  [aiarty.com](https://www.aiarty.com/stable-diffusion-guide/best-stable-diffusion-models.htm).
