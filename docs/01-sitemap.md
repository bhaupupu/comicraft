# 1 · Sitemap

## Public marketing site (built in this repo)

```
/
├── /                              Landing page (conversion)
│     ├─ #how-it-works             anchor → How It Works section
│     └─ (CTAs → /studio)
│
├── /features                      Feature index (the six tools)
│   └── /features/[slug]           Six dedicated feature pages:
│         ├─ /features/story-generator
│         ├─ /features/character-generator
│         ├─ /features/scene-generator
│         ├─ /features/panel-generator
│         ├─ /features/dialogue-generator
│         └─ /features/comic-editor
│
├── /studio                        THE STUDIO — the editor (most important page)
│
├── /pricing                       Pricing (Free / Creator / Pro) + comparison + FAQ
│
└── *  (not-found)                 Custom 404 ("Panel not found!")
```

## Planned application surface (post-marketing, see roadmap)

```
/studio
├── /studio                        Dashboard — projects grid, "New comic" prompt
├── /studio/new                    First-run prompt → pipeline run
├── /studio/p/[projectId]          Project editor (story/characters/scenes/panels/dialogue/assets)
│     ├─ ?tool=story               left-rail deep links
│     ├─ ?tool=characters
│     ├─ ?panel=[id]               panel inspector
│     └─ /export                   export modal (PDF / HD / webtoon)
├── /studio/characters             Character library (reusable cast across projects)
└── /studio/settings               Account, plan, usage, team seats

/auth
├── /login
├── /signup
└── /reset
```

## Secondary / legal (stubs linked in the footer)

```
/about   /blog   /careers   /contact
/legal/terms   /legal/privacy   /legal/licensing   /legal/commercial-use
```

## Navigation model

- **Primary nav** (`lib/site.ts → primaryNav`): Features · Studio · Pricing · How it works.
- **Persistent CTAs**: "Log in" (ghost) + "Start creating" (primary) in the header; a large CTA band
  in the footer on every page.
- **Footer columns**: Create · Product · Company · Legal (`lib/site.ts → footerNav`).
- **Cross-linking**: every feature page links to three sibling features ("Keep building") and to the
  Studio, keeping the user inside the creation narrative.

## Route → primary conversion goal

| Route | Goal |
| --- | --- |
| `/` | Understand "type an idea → comic" in < 5s; click *Start creating* |
| `/features/*` | Build belief in a specific capability; click *Try it free* |
| `/studio` | Feel the product's depth and professionalism; sign up to use it |
| `/pricing` | Convert intent → plan; default toward Free (2 generations) then Creator |
