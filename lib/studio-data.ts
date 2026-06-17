/**
 * Static content for the guided Studio journey:
 * Story → Character Bible → Style → Storyboard → Production.
 * Demo cast / storyboard are shown before a project has generated content,
 * so the workspace never feels empty.
 */

export const STUDIO_STEPS = [
  { key: "story", n: 1, label: "Story", blurb: "What do you want to tell?" },
  { key: "cast", n: 2, label: "Character Bible", blurb: "Meet your cast." },
  { key: "style", n: 3, label: "Visual Style", blurb: "Pick the look." },
  { key: "storyboard", n: 4, label: "Storyboard", blurb: "Shape every page." },
  { key: "production", n: 5, label: "Production", blurb: "Roll camera." },
] as const;

export type StudioStepKey = (typeof STUDIO_STEPS)[number]["key"];

/** Inspiration starters for the Story step (verbatim from the creative brief). */
export const STORY_STARTERS = [
  {
    title: "The last dragon hunter",
    line: "The last dragon hunter, sworn to protect the final human city, discovers the dragons were never the enemy.",
    genre: "Fantasy",
  },
  {
    title: "Impossible crimes",
    line: "A cyberpunk detective with a glitching memory solves crimes that haven't happened yet.",
    genre: "Sci-Fi Noir",
  },
  {
    title: "Rival hearts",
    line: "Two rival superheroes, secretly falling in love, must hide it from a city that needs them at war.",
    genre: "Romance",
  },
  {
    title: "The cursed samurai",
    line: "A cursed samurai who cannot die wanders the provinces searching for the one death that means redemption.",
    genre: "Historical",
  },
];

export const AI_STORY_ASSISTS = [
  { label: "Expand this idea", hint: "Turn one line into a full premise" },
  { label: "Improve the plot", hint: "Tighten stakes & pacing" },
  { label: "Suggest a twist", hint: "Add an unexpected turn" },
];

/** Visual style cards (previews generated into /public/styles). */
export type VisualStyle = {
  id: string;
  name: string;
  vibe: string;
  preview: string;
};

export const VISUAL_STYLES: VisualStyle[] = [
  { id: "manga", name: "Japanese Manga", vibe: "Screentone, speed-lines, raw motion", preview: "/styles/manga.jpg" },
  { id: "western", name: "Western Comics", vibe: "Bold ink, halftone, primary punch", preview: "/styles/western.jpg" },
  { id: "graphic-novel", name: "Graphic Novel", vibe: "Painterly, muted, grown-up", preview: "/styles/graphic-novel.jpg" },
  { id: "storybook", name: "Storybook", vibe: "Warm watercolor, gentle wonder", preview: "/styles/storybook.jpg" },
  { id: "noir", name: "Noir Detective", vibe: "High contrast, rain, long shadows", preview: "/styles/noir.jpg" },
  { id: "anime", name: "Anime", vibe: "Cel-shaded, vivid, expressive", preview: "/styles/anime.jpg" },
  { id: "watercolor", name: "Watercolor", vibe: "Soft washes, loose, dreamlike", preview: "/styles/watercolor.jpg" },
  { id: "childrens", name: "Children's Comics", vibe: "Rounded, bright, full of joy", preview: "/styles/childrens.jpg" },
];

/** Demo cast for the Character Bible (shown until a project generates its own). */
export type CastMember = {
  id: string;
  name: string;
  role: string;
  portrait: string;
  personality: string;
  background: string;
  appearance: string;
  goal: string;
  relationship: string;
  accent: string;
};

export const DEMO_CAST: CastMember[] = [
  {
    id: "kael",
    name: "Kael Emberwright",
    role: "Protagonist",
    portrait: "/characters/kael.jpg",
    personality: "Stubborn, loyal, haunted by what he's had to burn.",
    background: "Last of an order sworn to hunt dragons — until he learned the truth.",
    appearance: "Windswept dark hair, ember-orange eyes, scarred leather armor.",
    goal: "Stop the burning without becoming the monster he was trained to be.",
    relationship: "Reluctant protector of Mira; old debt to Soren.",
    accent: "pop",
  },
  {
    id: "mira",
    name: "Mira",
    role: "Deuteragonist",
    portrait: "/characters/mira.jpg",
    personality: "Curious, fearless, sharper than she lets on.",
    background: "A runaway mage who can hear what the dragons are really saying.",
    appearance: "Silver hair, traveling cloak, a staff that glows when she's near truth.",
    goal: "Prove the dragons are not the enemy before the city ends them.",
    relationship: "Kael's conscience; the bridge between two warring worlds.",
    accent: "pop-blue",
  },
  {
    id: "vyrn",
    name: "Vyrn",
    role: "Antagonist",
    portrait: "/characters/vyrn.jpg",
    personality: "Ancient, patient, terrifyingly reasonable.",
    background: "The eldest dragon — the only one who remembers how the war truly began.",
    appearance: "Obsidian scales, broken horn, eyes like cooling lava.",
    goal: "Make humanity remember the bargain it broke.",
    relationship: "Kael's mirror; Mira's impossible ally.",
    accent: "ink",
  },
  {
    id: "soren",
    name: "Soren",
    role: "Mentor",
    portrait: "/characters/soren.jpg",
    personality: "Gruff, warm under the armor, quietly grieving.",
    background: "A veteran blacksmith who forged every blade the order ever carried.",
    appearance: "Eyepatch, braided beard, hands mapped with old burns.",
    goal: "Keep one last hunter alive long enough to choose differently.",
    relationship: "Raised Kael after the order fell.",
    accent: "accent-deep",
  },
];

/** Cinematic production pipeline stages (used by the Production step). */
export const PRODUCTION_STAGES = [
  { key: "script", label: "Writing the script", sub: "Beats, pacing & scene order" },
  { key: "cast", label: "Designing the characters", sub: "Locking the cast on-model" },
  { key: "panels", label: "Planning the panels", sub: "Cinematic page layouts" },
  { key: "pages", label: "Illustrating the pages", sub: "Rendering every shot" },
  { key: "dialogue", label: "Adding the dialogue", sub: "Lettering speech & captions" },
  { key: "volume", label: "Finalizing the volume", sub: "Binding it into a comic" },
] as const;

/** Demo storyboard (Page → Panels → Dialogue) shown before generation. */
export type BoardPanel = { id: string; shot: string; dialogue?: string; note?: string };
export type BoardPage = { id: string; title: string; panels: BoardPanel[] };

export const DEMO_BOARD: BoardPage[] = [
  {
    id: "pg1",
    title: "Page 1 — The Ash Ridge",
    panels: [
      { id: "p1", shot: "Wide: burning villages along the ridge at dusk.", dialogue: "We're too late again…", note: "Open cold. No hero yet." },
      { id: "p2", shot: "Close: Kael's ember eyes catch the firelight.", dialogue: "Then we end it tonight." },
      { id: "p3", shot: "Low angle: he draws the rune-blade, sparks fly." },
    ],
  },
  {
    id: "pg2",
    title: "Page 2 — The Eldest",
    panels: [
      { id: "p4", shot: "Splash: Vyrn rears, wings blotting the moon.", dialogue: "You cannot kill what you do not understand.", note: "Full-bleed splash for impact." },
      { id: "p5", shot: "Two-shot: Mira steps between hunter and dragon.", dialogue: "Both of you — stop." },
    ],
  },
];
