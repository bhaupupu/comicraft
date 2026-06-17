// One-off: curate real comic art for the marketing site + studio demo via
// Pollinations (free FLUX endpoint). Writes into /public. Re-run to refresh.
// Usage: node scripts/generate-art.mjs
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUB = path.join(ROOT, "public");

const QUALITY =
  "professional comic book art, clean confident ink linework, dynamic paneling, expressive faces, cinematic dramatic lighting, rich detail, graphic novel quality, masterpiece";

/** @type {{file:string,w:number,h:number,seed:number,prompt:string}[]} */
const JOBS = [];
const add = (file, w, h, seed, prompt) =>
  JOBS.push({ file, w, h, seed, prompt: `${prompt}, ${QUALITY}` });

// ---------------- Hero ----------------
add("hero/hunter.jpg", 768, 1024, 11,
  "manga close-up portrait of a determined young dragon hunter, windswept hair, glowing ember-orange eyes, scarf, ash falling, black and white with selective warm glow");
add("hero/dragon.jpg", 1024, 768, 12,
  "epic manga splash panel, a lone hunter facing a colossal ancient dragon on a cliff at dusk, dramatic scale, ink and screentone");
add("hero/city.jpg", 1024, 768, 13,
  "cinematic comic panel, cyberpunk detective walking a rain-soaked neon street, reflections, moody");
add("hero/romance.jpg", 768, 1024, 14,
  "soft romance manga panel, two people sharing one umbrella in gentle rain, warm watercolor wash, tender");

// ---------------- Showcase genres: cover + 3 interior panels ----------------
const GENRES = [
  { id: "fantasy", seed: 100, cover: "lone dragon hunter standing on a windswept cliff facing a colossal ancient dragon, epic fantasy comic cover, dusk, embers",
    panels: ["a burning village at dusk seen from a ridge, smoke and ash, fantasy comic panel",
      "close-up of a hunter drawing a glowing rune-etched sword, sparks, determined",
      "a colossal dragon rearing with wings spread, lightning behind, dramatic low angle"] },
  { id: "scifi", seed: 200, cover: "cyberpunk detective in a long coat under towering neon holograms in rain, sci-fi thriller comic cover, blade-runner mood",
    panels: ["a sleek hovercar chase between megastructures at night, motion lines, sci-fi panel",
      "a detective studying a floating holographic crime-scene clue, blue glow",
      "a humanoid android revealing a glowing circuit beneath synthetic skin, tense reveal"] },
  { id: "romance", seed: 300, cover: "two young people under one umbrella in city rain at night, glowing shop signs, tender romance graphic novel cover, warm tones",
    panels: ["a quiet cafe meeting, two people across a small table, soft window light, romance manga",
      "two hands almost touching on a train handrail, blush, intimate close-up",
      "a rooftop at night overlooking glittering city lights, two silhouettes, warm"] },
  { id: "sliceoflife", seed: 400, cover: "high school students laughing together on a school rooftop at golden hour, slice of life manga cover, warm nostalgic",
    panels: ["sunlight streaming through a classroom window onto an empty desk, peaceful, slice of life",
      "a carefully packed bento lunch box on a wooden desk, cozy, manga still life",
      "a teenager riding an empty evening train home, reflection in the window, wistful"] },
  { id: "superhero", seed: 500, cover: "a caped superhero mid-leap over a glowing city skyline at dawn, dynamic western comic cover, bold colors, halftone",
    panels: ["a young person transforming into a hero in a burst of light, dramatic, comic panel",
      "a hero catching a falling civilian above the street, motion, heroic",
      "a hero and a towering villain facing off in a ruined plaza, tension, splash"] },
  { id: "noir", seed: 600, cover: "a trench-coat detective lighting a cigarette under a lone streetlamp in fog, high-contrast black and white noir comic cover",
    panels: ["a smoky private detective office at night, venetian blind shadows, noir panel",
      "a rain-soaked crime scene alley with a single clue under lamplight, noir",
      "a mysterious femme fatale silhouette in a doorway, dramatic shadow, noir"] },
];
for (const g of GENRES) {
  add(`showcase/${g.id}-cover.jpg`, 768, 1024, g.seed, g.cover);
  g.panels.forEach((p, i) => add(`showcase/${g.id}-${i + 1}.jpg`, 1024, 768, g.seed + i + 1, p));
}

// ---------------- Visual style picker previews ----------------
const STYLES = [
  ["manga", 700, "black and white Japanese manga panel, screentone shading, dynamic action pose, speed lines"],
  ["western", 710, "bold western superhero comic, saturated primary colors, heavy ink, halftone dots, dynamic"],
  ["graphic-novel", 720, "painterly mature graphic novel illustration, muted palette, atmospheric, detailed"],
  ["storybook", 730, "warm whimsical storybook illustration, soft watercolor, friendly characters, cozy"],
  ["noir", 740, "high contrast black and white noir comic, deep shadows, rain, dramatic chiaroscuro"],
  ["anime", 750, "vibrant cel-shaded anime key art, expressive character, bright colors, clean"],
  ["watercolor", 760, "delicate watercolor comic art, soft washes, loose linework, gentle palette"],
  ["childrens", 770, "bright cheerful children's comic, rounded friendly shapes, bold flat colors, playful"],
];
for (const [id, seed, prompt] of STYLES) add(`styles/${id}.jpg`, 640, 640, seed, `${prompt}, single character`);

// ---------------- Character bible (for "The Last Emberwright") ----------------
const CHARS = [
  ["kael", 800, "manga character portrait, a young dragon hunter, windswept dark hair, ember-orange eyes, leather armor and scarf, determined, neutral background"],
  ["mira", 810, "manga character portrait, a runaway young mage, silver hair, glowing staff, traveling cloak, curious eyes, neutral background"],
  ["vyrn", 820, "manga character portrait, an ancient intelligent dragon, scaled horned face, glowing eyes, menacing and wise, neutral background"],
  ["soren", 830, "manga character portrait, a grizzled veteran mentor blacksmith, eyepatch, braided beard, warm stern, neutral background"],
];
for (const [id, seed, prompt] of CHARS) add(`characters/${id}.jpg`, 640, 768, seed, prompt);

// ---------------- Run ----------------
async function fetchImage(job, attempt = 1) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    job.prompt,
  )}?width=${job.w}&height=${job.h}&model=flux&nologo=true&seed=${job.seed}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) throw new Error(`tiny (${buf.length}b)`);
    const out = path.join(PUB, job.file);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, buf);
    console.log(`ok   ${job.file}  ${(buf.length / 1024).toFixed(0)}kb`);
    return true;
  } catch (e) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1500 * attempt));
      return fetchImage(job, attempt + 1);
    }
    console.log(`FAIL ${job.file}  ${e.message}`);
    return false;
  }
}

const FORCE = process.argv.includes("--force");
let ok = 0, skip = 0, fail = 0;
for (const job of JOBS) {
  if (!FORCE && existsSync(path.join(PUB, job.file))) { skip++; continue; }
  const r = await fetchImage(job);
  r ? ok++ : fail++;
}
console.log(`\nDONE  generated=${ok} skipped=${skip} failed=${fail} total=${JOBS.length}`);
