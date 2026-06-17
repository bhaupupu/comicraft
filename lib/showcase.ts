/**
 * Curated comic showcase for the "See What's Possible" reader.
 * Art lives in /public/showcase (generated via scripts/generate-art.mjs).
 * Each genre reads like a real comic: a cover + a few interior pages with
 * narrator captions and dialogue the visitor can actually read.
 */

export type ReaderPage = {
  src: string;
  /** narrator caption box (yellow) */
  caption?: string;
  /** speech bubbles laid over the art */
  bubbles?: { text: string; at: "tl" | "tr" | "bl" | "br"; tone?: "default" | "pop" | "ink" }[];
};

export type ShowcaseComic = {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  /** tailwind text/border accent token, e.g. "pop" | "accent" | "pop-blue" */
  accent: string;
  cover: string;
  pages: ReaderPage[];
};

export const showcase: ShowcaseComic[] = [
  {
    id: "fantasy",
    title: "The Last Emberwright",
    genre: "Fantasy Adventure",
    tagline: "One hunter. One dragon. One last chance to end the burning.",
    accent: "accent-deep",
    cover: "/showcase/fantasy-cover.jpg",
    pages: [
      {
        src: "/showcase/fantasy-1.jpg",
        caption: "By dusk, the ridge villages were already ash.",
        bubbles: [{ text: "We're too late again…", at: "tl" }],
      },
      {
        src: "/showcase/fantasy-2.jpg",
        caption: "But the Emberwright's blade still remembered fire.",
        bubbles: [{ text: "Then we end it tonight.", at: "br", tone: "pop" }],
      },
      {
        src: "/showcase/fantasy-3.jpg",
        bubbles: [
          { text: "YOU CANNOT KILL WHAT YOU DO NOT UNDERSTAND.", at: "tr", tone: "ink" },
        ],
      },
    ],
  },
  {
    id: "scifi",
    title: "Neon Protocol",
    genre: "Sci-Fi Thriller",
    tagline: "In a city that never logs off, the truth is the last analog thing.",
    accent: "pop-blue",
    cover: "/showcase/scifi-cover.jpg",
    pages: [
      {
        src: "/showcase/scifi-1.jpg",
        caption: "Sector 9 — 03:14. The chase had no off-switch.",
      },
      {
        src: "/showcase/scifi-2.jpg",
        bubbles: [{ text: "The clue isn't in the data. It's in what's missing.", at: "bl" }],
      },
      {
        src: "/showcase/scifi-3.jpg",
        caption: "And then the witness opened its chest.",
        bubbles: [{ text: "I was never human, detective.", at: "tr", tone: "pop" }],
      },
    ],
  },
  {
    id: "romance",
    title: "The Space Between Us",
    genre: "Romance",
    tagline: "Two strangers, one umbrella, and a city that keeps raining.",
    accent: "pop",
    cover: "/showcase/romance-cover.jpg",
    pages: [
      {
        src: "/showcase/romance-1.jpg",
        caption: "We met the way good stories start — by accident.",
        bubbles: [{ text: "You can share, if you want.", at: "bl" }],
      },
      {
        src: "/showcase/romance-2.jpg",
        bubbles: [{ text: "Our hands kept finding the same rail.", at: "tr" }],
      },
      {
        src: "/showcase/romance-3.jpg",
        caption: "The city glittered. Neither of us looked at it.",
      },
    ],
  },
  {
    id: "sliceoflife",
    title: "After the Last Bell",
    genre: "Slice-of-Life Manga",
    tagline: "Nothing happens. Everything matters.",
    accent: "pop-mint",
    cover: "/showcase/sliceoflife-cover.jpg",
    pages: [
      {
        src: "/showcase/sliceoflife-1.jpg",
        caption: "Fourth period light always landed on the empty desk.",
      },
      {
        src: "/showcase/sliceoflife-2.jpg",
        bubbles: [{ text: "You made two lunches again?", at: "tl" }],
      },
      {
        src: "/showcase/sliceoflife-3.jpg",
        caption: "The train home was ours for exactly nine minutes.",
      },
    ],
  },
  {
    id: "superhero",
    title: "The Paper Sentinel",
    genre: "Superhero",
    tagline: "She folded the city back together — one page at a time.",
    accent: "pop-violet",
    cover: "/showcase/superhero-cover.jpg",
    pages: [
      {
        src: "/showcase/superhero-1.jpg",
        caption: "The change still hurt every single time.",
        bubbles: [{ text: "Not today. Not this block.", at: "bl", tone: "pop" }],
      },
      {
        src: "/showcase/superhero-2.jpg",
        bubbles: [{ text: "GOTCHA!", at: "tr", tone: "pop" }],
      },
      {
        src: "/showcase/superhero-3.jpg",
        caption: "Across the plaza, something far bigger looked up.",
      },
    ],
  },
  {
    id: "noir",
    title: "Rain on Saffron Street",
    genre: "Detective Noir",
    tagline: "Everybody lies. The rain just makes it honest.",
    accent: "ink",
    cover: "/showcase/noir-cover.jpg",
    pages: [
      {
        src: "/showcase/noir-1.jpg",
        caption: "The office smelled of cold coffee and colder cases.",
      },
      {
        src: "/showcase/noir-2.jpg",
        caption: "One clue. Lit by one streetlamp. Of course.",
        bubbles: [{ text: "She was here. So was someone else.", at: "bl", tone: "ink" }],
      },
      {
        src: "/showcase/noir-3.jpg",
        bubbles: [{ text: "You're a hard man to find, detective.", at: "tr" }],
      },
    ],
  },
];

export function getComic(id: string) {
  return showcase.find((c) => c.id === id) ?? showcase[0];
}
