# Comicraft — Product & Redesign Overview

## The thesis

Most "AI comic" sites make one fatal mistake: they **plaster the homepage with AI-generated comic
covers**. Visitors judge an AI product by its outputs, and random generated covers always read as
*cheap* — they lower perceived quality before the user has typed a word. Worse, a wall of finished
comics frames the product as something to **consume** (a reader, a Webtoon clone) rather than
something to **create with**.

Comicraft inverts this. The product is a **creation tool** — Figma for comics, Cursor for
storytelling. So the entire surface sells the **workflow and the transformation**, never the
artifact:

- The hero is a **live run of the pipeline** — idea → story → characters → scenes → panels → comic.
- Feature pages show **input → output transformations**, rendered as schematic line-art.
- The Studio is shown as a **professional editor**, not a feed.
- The only "comics" depicted are **deliberate wireframe illustrations of the process**.

> Positioning line: **"Type an idea. Get a comic."**

## What changed from the old design

| Old (the reference) | New (Comicraft) |
| --- | --- |
| Dark, neon, "AI startup" aesthetic | Premium **light editorial** — paper + ink + one highlight |
| Large galleries of generated comic covers | **Zero** generated-comic galleries; process-driven visuals |
| Everything on one homepage | **Multi-page**: landing, 6 feature pages, studio, pricing |
| "Join 50,000 creators" social proof of outputs | Proof of **capability and control** (consistency, authorship, rights) |
| Generic SaaS pricing table | **Comic-collectible** pricing cards ("Issue #1/2/3") |
| Reader/consumer framing | **Creator/studio** framing throughout |

## Audience & jobs-to-be-done

- **Hobbyist storyteller** — "I have an idea but can't draw." Job: get a shareable comic fast.
- **Indie creator / webtoon author** — Job: produce consistent series pages on a schedule.
- **Studio / marketer** — Job: commercial-licensed comic content, team workflows, brand characters.

## The six-beat pipeline (the spine of the whole product)

`Idea → Story → Characters → Scenes → Panels → Dialogue → (Comic)`

Every page, animation, and tool maps to this spine. It appears in the hero, in How-It-Works, in the
Studio's left rail, and as the `pipeline` constant in `lib/site.ts`.

## Index of deliverables

1. **[Sitemap](01-sitemap.md)** — every route and its purpose.
2. **[UX flows](02-ux-flows.md)** — first-run, generation, edit, upgrade, and mobile flows.
3. **[Design system](03-design-system.md)** — tokens, type, color, motifs, page-by-page specs.
4. **[Component architecture](04-component-architecture.md)** — the component tree and contracts.
5. **[Animation plan](05-animation-plan.md)** — what animates, why, and how it degrades.
6. **[AI generation architecture](06-ai-architecture.md)** — the pipeline, model routing, consistency.
7. **[Technical roadmap](07-roadmap.md)** — phased build plan from marketing site to GA.
8. **[Suggested models](08-models.md)** — researched 2026 model/provider comparison + recommendation.
9. **[Conversion optimization](09-conversion.md)** — how the funnel is built to convert visitors → creators.
