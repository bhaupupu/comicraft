# 9 · Conversion Optimization

Goal: turn **visitors into creators**. The funnel is `land → understand → try → generate → upgrade`.
Every page is built around moving the user one step further.

## The core moves

1. **Show, don't tell — instantly.** The hero is a *live pipeline run*, not a screenshot. Within ~5s
   a visitor sees idea → story → characters → panels → comic. The value prop is demonstrated before
   any reading. (LCP is static text so the hero's animation never blocks perceived load.)
2. **Let them start in the hero.** The hero prompt field is a **real input**; submitting *is* the
   primary CTA (→ `/studio` with the idea as the seed). Lowest-friction possible entry.
3. **Remove the #1 objection up front.** "2 free generations · No credit card · Export in minutes"
   sits directly under the hero CTA.
4. **Don't show outputs as proof.** Per the brief — random generated covers *lower* perceived
   quality and frame the product as a reader. We prove **capability and control** instead
   (consistency, authorship, rights, the editor). This is itself a conversion decision.
5. **Two persistent CTAs, one narrative.** Header ("Start creating") + a big footer CTA band on
   every page. Feature pages cross-link to keep users inside the creation story, always one click
   from `/studio`.

## Pricing psychology

- **Free = real, not a teaser.** 2 generations, full pipeline, no card → users feel the magic before
  any ask. The cap gates *new generation*, never deletes work.
- **Anchor on Creator (\$5).** It's the visually featured "Issue #2" card (ink, lifted, "Best value"
  star-burst) — the obvious default between Free and Pro (classic center-stage decoy framing).
- **Pro (\$20) sells outcomes**: commercial license, priority, teams — for people making money.
- **Comic-collectible cards** ("Issue #1/2/3") are memorable and on-brand, avoiding generic-SaaS
  table fatigue while a **comparison table** still serves rational buyers.
- **Upgrade at the moment of value**, with work preserved → converting on gain, not loss.

## Friction audit (kept low by design)

| Friction | Mitigation |
| --- | --- |
| "Will it be any good?" | Live pipeline + consistency messaging; control emphasized |
| "Do I have to sign up first?" | Start from the hero prompt; account only when saving/exporting |
| "Will my characters look different each panel?" | "Consistency you can trust" is a top-level promise |
| "Can I sell what I make?" | Commercial rights stated on the Pro card + `/legal` |
| "Is this just a reader?" | Manifesto band: *Creation, not consumption* |

## Trust & social proof (without showing outputs)

- Proof of **capability**: the Studio preview (depth = credibility), the transformation flows.
- Proof of **safety**: no-card free tier, clear licensing, cancel-anytime.
- Future: creator testimonials about *workflow/speed*, named studios, and aggregate stats
  ("comics finished," not "covers generated") — process metrics, not output galleries.

## Mobile conversion

- Mobile-first hero: full-width prompt, thumb-reachable CTA, stacked pipeline.
- Sticky header CTA persists; mobile menu surfaces "Start free" prominently.
- Animations degrade to finished states so low-end devices still load fast (speed = conversion).

## Measurement plan

- **North-star:** % of visitors who complete a first generation.
- **Funnel events:** `hero_prompt_submit`, `cta_start_click`, `signup`, `first_generation`,
  `pipeline_complete`, `export`, `paywall_view`, `upgrade`.
- **Experiments to run:** hero copy ("Create a complete comic…" vs "Type an idea. Get a comic.");
  Creator price point; free-gen count (2 vs 3); paywall copy; with/without the manifesto band.
- **Guardrail metrics:** LCP/INP on mobile, generation success rate, cost-per-activated-user.

## SEO / acquisition

- Six **feature pages** target intent queries ("AI character generator", "comic panel generator",
  "AI dialogue/script for comics") — each is a real landing page with a transformation demo.
- Per-page `generateMetadata`, semantic HTML, fast static prerender (all 13 routes are static/SSG).
- Future: a `/templates` and use-case pages (webtoon, kids' comic, marketing comic) for long-tail.
