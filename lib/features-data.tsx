import type { ComponentType } from "react";
import {
  CharacterSheetArt,
  DialogueArt,
  PanelGridArt,
  SceneArt,
  StoryThreadArt,
  ComicPageArt,
} from "@/components/comic/process-art";

export type AccentKey = "accent" | "pop" | "violet" | "blue" | "mint";

export type Feature = {
  slug: string;
  short: string;
  eyebrow: string;
  headline: string;
  lead: string;
  Art: ComponentType<{ className?: string }>;
  accent: AccentKey;
  /** The transformation, shown as an animated chain: input → … → output. */
  flow: string[];
  /** Worked example: one prompt, the artifacts it yields. */
  example: { input: string; outputs: string[] };
  bullets: { title: string; body: string }[];
};

export const accentClasses: Record<
  AccentKey,
  { bg: string; soft: string; ring: string; text: string }
> = {
  accent: { bg: "bg-accent", soft: "bg-accent/15", ring: "border-accent", text: "text-ink" },
  pop: { bg: "bg-pop", soft: "bg-pop/12", ring: "border-pop", text: "text-white" },
  violet: { bg: "bg-pop-violet", soft: "bg-pop-violet/12", ring: "border-pop-violet", text: "text-white" },
  blue: { bg: "bg-pop-blue", soft: "bg-pop-blue/12", ring: "border-pop-blue", text: "text-white" },
  mint: { bg: "bg-pop-mint", soft: "bg-pop-mint/12", ring: "border-pop-mint", text: "text-white" },
};

export const features: Feature[] = [
  {
    slug: "story-generator",
    short: "Story",
    eyebrow: "Story Generator",
    headline: "From a one-line idea to a shootable script.",
    lead: "Give Comicraft a premise and it returns a structured story — logline, three-act arc, chapter beats and panel-ready script — that you can rewrite at any altitude.",
    Art: StoryThreadArt,
    accent: "accent",
    flow: ["Idea", "Plot", "Chapters", "Script"],
    example: {
      input: "A retired samurai fox opens a tea shop in a city that fears him.",
      outputs: [
        "Logline + theme",
        "3-act structure",
        "8 chapter beats",
        "Panel-by-panel script",
      ],
    },
    bullets: [
      { title: "Structure, not soup", body: "Real story architecture — setups, turns and payoffs — not a wall of text." },
      { title: "Edit at any altitude", body: "Change the theme and the beats re-flow; change one line and only it changes." },
      { title: "Script that renders", body: "Output is already panel-aware, so the rest of the pipeline can pick it up instantly." },
    ],
  },
  {
    slug: "character-generator",
    short: "Characters",
    eyebrow: "Character Generator",
    headline: "Design a cast once. Keep it on-model forever.",
    lead: "Describe a character and get a full sheet — reference, expressions and a turnaround — locked to an identity that survives every later panel.",
    Art: CharacterSheetArt,
    accent: "pop",
    flow: ["Prompt", "Character sheet", "Expressions", "Turnaround"],
    example: {
      input: "Detective cat, charcoal fur, trench coat, one torn ear, world-weary.",
      outputs: ["Master reference", "6 expressions", "360° turnaround", "Re-usable identity token"],
    },
    bullets: [
      { title: "Consistency that holds", body: "An identity lock anchors the face and silhouette so panel 80 matches panel 1." },
      { title: "A real model sheet", body: "Front, 3/4, side and back — plus an expression range your artist would draw." },
      { title: "Re-use across projects", body: "Save a character to your library and drop them into any new comic." },
    ],
  },
  {
    slug: "scene-generator",
    short: "Scenes",
    eyebrow: "Scene Generator",
    headline: "Worlds that match your story — and each other.",
    lead: "Turn a location line into a layered environment: establishing shot, key angles and lighting moods, all stylistically consistent with your comic.",
    Art: SceneArt,
    accent: "blue",
    flow: ["Prompt", "Environment", "Angles", "Comic scene"],
    example: {
      input: "Rain-slick Tokyo alley at night, neon signage, steam from vents.",
      outputs: ["Establishing shot", "Reverse angle", "Close detail", "Mood variants"],
    },
    bullets: [
      { title: "Place, not wallpaper", body: "Scenes are built with depth and staging so characters can actually inhabit them." },
      { title: "Style-locked", body: "Every environment inherits your comic's art direction automatically." },
      { title: "Shot coverage", body: "Get multiple angles of the same place to cut between in your panels." },
    ],
  },
  {
    slug: "panel-generator",
    short: "Panels",
    eyebrow: "Panel Generator",
    headline: "Pages that lay themselves out — with rhythm.",
    lead: "Comicraft composes panels from your script, choosing layouts by narrative beat: a quiet grid for dialogue, a splash for the turn, a tight row for action.",
    Art: PanelGridArt,
    accent: "violet",
    flow: ["Script", "Shot list", "Layout", "Page"],
    example: {
      input: "Chapter 3 — the rooftop confrontation.",
      outputs: ["Beat → shot mapping", "Tension-aware layout", "Gutters & flow", "Print + webtoon pages"],
    },
    bullets: [
      { title: "Layout with intent", body: "Panel size and order follow the story's pacing, not a fixed template." },
      { title: "Two formats, one page", body: "Export the same page as a print spread or a vertical webtoon scroll." },
      { title: "Drag to override", body: "Don't like a beat? Re-size, split or merge panels by hand in seconds." },
    ],
  },
  {
    slug: "dialogue-generator",
    short: "Dialogue",
    eyebrow: "Dialogue Generator",
    headline: "Words in the right bubble, in the right order.",
    lead: "Generate dialogue and captions in each character's voice, auto-placed into balloons with reading-order, tails and lettering handled.",
    Art: DialogueArt,
    accent: "mint",
    flow: ["Scene", "Voices", "Balloons", "Lettering"],
    example: {
      input: "Tense standoff — detective vs. informant.",
      outputs: ["In-character lines", "Balloon placement", "Reading order", "Caption boxes"],
    },
    bullets: [
      { title: "Voice, not filler", body: "Each character speaks consistently — clipped, florid, nervous, whatever fits." },
      { title: "Placed for you", body: "Balloons land where the eye expects them, with correct tails and order." },
      { title: "Editable type", body: "Lettering is a live text layer — rewrite a line without re-rendering art." },
    ],
  },
  {
    slug: "comic-editor",
    short: "Editor",
    eyebrow: "Comic Editor",
    headline: "The studio where it all comes together.",
    lead: "A Figma-grade canvas for comics: layers, panels, characters and an AI assistant in the margin — refine anything, regenerate nothing you don't want to.",
    Art: ComicPageArt,
    accent: "accent",
    flow: ["Assets", "Canvas", "Refine", "Export"],
    example: {
      input: "Everything you generated, on one page.",
      outputs: ["Layered canvas", "Inline AI assistant", "Version history", "HD / PDF / webtoon export"],
    },
    bullets: [
      { title: "Non-destructive", body: "Art, text and layout live on separate layers — change one without breaking the rest." },
      { title: "AI in the margin", body: "Ask for a new angle, a punchier line or a different mood without leaving the page." },
      { title: "Ship anywhere", body: "Export to print-ready PDF, HD images, or a continuous webtoon strip." },
    ],
  },
];

export const featureBySlug = (slug: string) =>
  features.find((f) => f.slug === slug);
