# 8 · Suggested Models — 2026 Comparison

Scored for **comic creation specifically**: prompt fidelity, **character retention across panels**,
comic/manga ability, licensing, and cost. (Research June 2026 — see sources in `06-ai-architecture.md`.)

## Image engines

| Model | Strength for comics | Character consistency | License / commercial | Cost (managed) | Verdict |
| --- | --- | --- | --- | --- | --- |
| **Gemini 2.5 Flash Image — "Nano Banana"** (Google) | Coherent multi-panel scenes, strong edits in one pass | ★★★★★ embedding-level **face-lock**, zero-shot | Commercial via Google API | API-priced | **Primary engine.** Best consistency in 2026 |
| **Seedream 4.0** (ByteDance) | Predictable, controllable | ★★★★ very consistent, more "stable" than bold | Commercial via API | API-priced | **A/B alternative / fallback** to Nano Banana |
| **FLUX.2 [pro]** (Black Forest Labs) | Best photoreal + anatomy + prompt fidelity | ★★★★ with refs/Redux | Commercial via BFL API | ~\$0.05/1024² (Replicate); \$0.012/MP (fal) | **Pro photoreal tier** |
| **FLUX.2 [dev]** | Same family, self-hostable | ★★★★ | **Non-commercial weights**; \$999/mo self-host license | self-host GPU | Self-host **only at high volume** |
| **SDXL** (Stability) | Huge ecosystem, ControlNet/IP-Adapter, cheap | ★★★ + LoRA/IP-Adapter | Open, commercial-friendly | ~\$0.003–0.01/img | **Free/cost tier base** |
| **Pony Diffusion V6 XL** (SDXL fine-tune) | **Best anime/manga** stylization | ★★★ + LoRA | Open | cheap | **Manga/anime style tier** |
| **Imagen 4** (Google) | High art-quality baseline | ★★★★ | Commercial via API | API-priced | Strong alt backend for stylized pages |
| **Higgsfield** | **Video** (Sora2/Veo/Kling aggregator) | n/a (motion, not stills) | Subscription, credits expire ~90d | \$15–84/mo | **Not the engine** — optional motion-comic add-on |

## Character-consistency techniques (how, not just what)

| Technique | What it does | Best for | Trade-off |
| --- | --- | --- | --- |
| **Nano Banana face-lock** | Anchors identity at embedding level, zero-shot | Cross-panel consistency out of the box | Provider-hosted |
| **Per-character LoRA** | Trains the character's face **+ clothing + body language** | A recurring **series** character used for years | Needs a quick training step |
| **PuLID (Flux II)** | Zero-shot identity injection at generation | Instant one-off consistency, no training | Can look "pasted on" if lighting mismatches |
| **IP-Adapter / InstantID** | Identity preservation from a reference | Fast face matching | Neglects attire/decoration; pair with LoRA |
| **ControlNet** | Pose/layout/depth conditioning | Staging a character in a panel composition | Identity still needs IP-Adapter/LoRA |

**Hybrid is the production answer:** LoRA (or Nano Banana token) for *who*, ControlNet for *pose/
framing*, IP-Adapter/PuLID for *zero-shot touch-ups*.

## Text & orchestration

| Model | Role |
| --- | --- |
| **Claude Opus 4.8** (`claude-opus-4-8`) | Story architecture, voice, the Studio AI assistant, prompt compilation |
| **Claude Sonnet 4.6** (`claude-sonnet-4-6`) | Cheaper per-panel shot expansion + dialogue at scale |

## Inference hosting

| Provider | Use it for | Note |
| --- | --- | --- |
| **fal.ai** | Launch default — fastest FLUX/SDXL, ~\$0.006–0.012/MP | Lowest latency managed |
| **Replicate** | Model diversity + quick swaps behind the router | ~\$0.003–0.05/img |
| **Modal** | Self-host batched SDXL/FLUX when volume grows | Python-first, caching |
| **RunPod** | Cheapest raw GPU / spot for self-host | Most ops work |
| **Google Vertex / AI Studio** | Nano Banana + Imagen 4 | Primary consistency engine |

**Cross-over point:** self-hosting beats managed per-image pricing at roughly **25k–50k images/mo**.
Start managed (fal/Replicate), move hot paths to Modal/RunPod as you scale.

## Recommended default stack

- **Consistency engine:** Nano Banana (Seedream 4.0 as A/B fallback)
- **Photoreal Pro tier:** FLUX.2 [pro] via API
- **Free/cost + manga tier:** SDXL / Pony + LoRA + IP-Adapter on fal.ai
- **Text brain:** Claude (Opus 4.8 / Sonnet 4.6)
- **Hosting:** fal.ai + Replicate now → Modal/RunPod at scale
- **Motion add-on (optional):** Higgsfield / Kling / Veo
