# 2 · UX Flows

The product has one north-star flow — **idea → finished comic** — and everything else supports it.

## A. First-visit → first creation (the conversion spine)

```
Land on /  ──► Hero shows a LIVE pipeline run (auto-playing)
   │             "Create a complete comic from a single idea."
   │
   ├─► User types into the hero prompt field ("A retired samurai fox…")
   │      └─► Submit → /studio (prompt carried as the project seed)
   │
   └─► OR scrolls: How it works → Features → Studio preview → Pricing
          └─► any CTA → /studio
```

Design intent: the visitor should be able to **start without reading**. The hero prompt field is a
real input; pressing Generate is the same action as the primary CTA.

## B. The generation flow (inside the Studio)

```
/studio  (empty / first run)
  1. PROMPT      one line in            → seed
  2. STORY       logline, 3 acts, beats → editable script        [stage 1]
  3. CHARACTERS  sheet + turnaround     → identity-locked cast    [stage 2]
  4. SCENES      environments + angles  → style-locked            [stage 3]
  5. PANELS      beats → shots → layout → page                    [stage 4]
  6. DIALOGUE    voices → balloons      → lettered text layer     [stage 5]
  7. REVIEW      finished page on canvas → export
```

Key UX rules:
- **Every stage is editable, none is a black box.** The user can stop, override, and resume at any
  beat. (Mirrored in the marketing hero, which lights up each beat in turn.)
- **Generation is explicit and metered.** Each render = one "generation". The free plan's 2-generation
  budget is visible and never silently consumed by edits (rearranging/relettering is free).
- **Consistency is automatic.** Once a character is designed, it's reused — the user never re-describes
  a character to keep it on-model.

## C. The editing flow (the Studio canvas)

```
Select tool (left rail)  →  Context panel updates (pages / cast / chapters / assets)
Select a panel (canvas)  →  Right inspector shows the panel + its layers
Ask the AI assistant     →  "make panel 2 a low-angle hero shot" → panel updates in place
Adjust layers            →  art / characters / foreground / background / lettering (non-destructive)
Zoom / reorder / split   →  manual overrides, no regeneration required
```

Non-destructive principle: **art, characters, and lettering live on separate layers**, so a text
rewrite never forces an art re-render (and never costs a generation).

## D. Upgrade flow (free → paid)

```
Free user hits the 2-generation cap
   └─► Soft wall: "Your project is safe and fully editable. To generate new art, pick a plan."
        ├─► /pricing  → Creator ($5) default highlight  → checkout → resume exactly where they were
        └─► Project, characters, and edits are PRESERVED (never deleted at the cap)
```

Rationale: never punish the user for hitting the cap. Preserve all work; gate only *new generation*.
This converts on value already felt, not on loss.

## E. Export flow

```
Export (top bar)  →  choose format
   ├─ Web (free, watermarked)
   ├─ HD images (Creator+)
   ├─ Print-ready PDF (Creator+)
   └─ Vertical webtoon strip (Creator+)
```

## F. Mobile flow (designed first, not adapted)

- Hero pipeline **stacks vertically**; the prompt field is full-width and thumb-reachable.
- How-It-Works and Features become **single-column card stacks**.
- The Studio collapses to: **horizontal tool strip (top) → canvas → assistant sheet (bottom)**.
  The left context + right inspector become bottom sheets rather than side rails.
- Heavy animations **degrade to their finished state** under `prefers-reduced-motion` and on small
  screens (the hero loop renders its end frame; reveals become instant).

## Error / edge states

| State | Behavior |
| --- | --- |
| Unknown feature slug | `notFound()` → custom 404 panel |
| Reduced motion | Hero shows completed pipeline; all reveals static |
| Generation fails | Retry inline; the failed attempt does **not** consume a generation |
| Offline / slow | Skeleton "halftone" placeholders fill panel slots until art arrives |
