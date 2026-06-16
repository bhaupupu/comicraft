/**
 * Single source of truth for brand + navigation + commercial copy.
 * Rename the product, change the tagline, or re-price in ONE place.
 */

export const site = {
  name: "Comicraft",
  // The promise, stated the way it should read on the hero.
  tagline: "Type an idea. Get a comic.",
  description:
    "Comicraft is the AI comic studio. Go from a one-line idea to a finished, character-consistent comic — story, characters, scenes, panels and dialogue — in minutes.",
  url: "https://comicraft.vercel.app",
  email: "guptadiwanshu2007@gmail.com",
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Studio", href: "/studio" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/#how-it-works" },
];

export const featurePages: {
  slug: string;
  label: string;
  short: string;
}[] = [
  { slug: "story-generator", label: "Story Generator", short: "Story" },
  { slug: "character-generator", label: "Character Generator", short: "Characters" },
  { slug: "scene-generator", label: "Scene Generator", short: "Scenes" },
  { slug: "panel-generator", label: "Panel Generator", short: "Panels" },
  { slug: "dialogue-generator", label: "Dialogue Generator", short: "Dialogue" },
  { slug: "comic-editor", label: "Comic Editor", short: "Editor" },
];

export const footerNav: { heading: string; links: NavItem[] }[] = [
  {
    heading: "Create",
    links: [
      { label: "Story Generator", href: "/features/story-generator" },
      { label: "Character Generator", href: "/features/character-generator" },
      { label: "Scene Generator", href: "/features/scene-generator" },
      { label: "Panel Generator", href: "/features/panel-generator" },
      { label: "Dialogue Generator", href: "/features/dialogue-generator" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "The Studio", href: "/studio" },
      { label: "Comic Editor", href: "/features/comic-editor" },
      { label: "Pricing", href: "/pricing" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#" },
      { label: "Blog", href: "/#" },
      { label: "Careers", href: "/#" },
      { label: "Contact", href: "/#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/#" },
      { label: "Privacy", href: "/#" },
      { label: "Licensing", href: "/#" },
      { label: "Commercial use", href: "/pricing" },
    ],
  },
];

/** The six-beat creation pipeline used across hero, how-it-works and feature pages. */
export const pipeline = [
  { key: "idea", label: "Idea", caption: "One line is enough." },
  { key: "story", label: "Story", caption: "Plot, beats & script." },
  { key: "characters", label: "Characters", caption: "Cast that stays on-model." },
  { key: "scenes", label: "Scenes", caption: "Environments & shots." },
  { key: "panels", label: "Panels", caption: "Auto-laid-out pages." },
  { key: "comic", label: "Comic", caption: "Lettered & exportable." },
] as const;

export const pricing = {
  plans: [
    {
      id: "free",
      name: "Free",
      price: 0,
      cadence: "forever",
      blurb: "Try the full pipeline, no card.",
      cta: "Start free",
      featured: false,
      perks: [
        "2 free generations total",
        "1 project",
        "All creation tools",
        "Watermarked web export",
        "Community support",
      ],
      limit: "No credit card required",
    },
    {
      id: "creator",
      name: "Creator",
      price: 5,
      cadence: "/mo",
      blurb: "For makers shipping comics regularly.",
      cta: "Go Creator",
      featured: true,
      perks: [
        "300 generations / month",
        "Unlimited projects",
        "HD, watermark-free export",
        "Character library & re-use",
        "PDF + webtoon export",
      ],
      limit: "Billed monthly · cancel anytime",
    },
    {
      id: "pro",
      name: "Pro",
      price: 20,
      cadence: "/mo",
      blurb: "For studios, teams & commercial work.",
      cta: "Go Pro",
      featured: false,
      perks: [
        "High generation limits",
        "Priority rendering queue",
        "Advanced editor & layers",
        "Full commercial license",
        "Team seats & shared assets",
      ],
      limit: "Everything in Creator, plus",
    },
  ],
} as const;
