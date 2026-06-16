import type { CharacterSpec, PanelSpec } from "@/lib/ai/schema";

export function buildStoryPrompt(premise: string): string {
  return `You are a comics writer-director. Turn the premise into a tight, shootable FIRST PAGE.

PREMISE: "${premise}"

Return a JSON object with EXACTLY these fields:
- title:   a short comic title (<= 60 chars)
- logline: a one-sentence hook
- theme:   the story's theme, in a few words
- style:   an art-direction "style lock" — ONE line describing the consistent visual style applied to EVERY panel
- acts:    array of up to 3 objects { title, summary }
- characters: 1–4 objects { name, role, description }, where description is a vivid VISUAL + personality brief used to draw a reference sheet (mention silhouette, clothing, colors)
- panels:  3–6 page-1 panels, each { description, shot, dialogue } where:
    • description = a concrete VISUAL prompt for the panel art (NO text/letters in the image)
    • shot        = framing + mood (e.g. "low-angle hero shot, neon, rain")
    • dialogue    = array of { speaker, text }; speaker is a character name or "Caption"

Keep characters named and consistent across panels. Output ONLY the JSON object.`;
}

export function buildNextPagePrompt(opts: {
  premise: string;
  logline?: string;
  theme?: string;
  style?: string;
  characters: string[];
  pageNumber: number;
}): string {
  return `Continue this comic onto PAGE ${opts.pageNumber}.

PREMISE: "${opts.premise}"
${opts.logline ? `LOGLINE: ${opts.logline}` : ""}
${opts.theme ? `THEME: ${opts.theme}` : ""}
CAST (reuse these EXACT names, keep them consistent): ${opts.characters.join(", ") || "the established cast"}
STYLE LOCK: ${opts.style ?? "match the existing pages"}

Write 3–6 panels that advance the story on this page. Return a JSON object:
{ "panels": [ { "description", "shot", "dialogue": [ { "speaker", "text" } ] } ] }
where description is a concrete VISUAL prompt (NO text in the image) and shot is framing + mood.
Keep the same characters and visual style. Output ONLY the JSON object.`;
}

export function buildCharacterPrompt(c: CharacterSpec, style: string): string {
  return `Character reference sheet, full body, neutral pose, plain off-white background. ${c.description}. Art direction: ${style}. Clean comic line-art, model-sheet style. IMPORTANT: no text, no labels, no speech bubbles, no watermark.`;
}

export function buildPanelPrompt(p: PanelSpec, style: string, castNote: string): string {
  return `Comic book panel. ${p.description}. Shot: ${p.shot}. ${castNote} Art direction: ${style}. Dynamic composition, strong silhouettes. IMPORTANT: do NOT render any text, letters, speech bubbles, captions, or watermark — lettering is added on a separate layer.`;
}
