import { z } from "zod";

/**
 * The structured output the orchestrator asks the text model to produce from a
 * one-line premise. Validated with zod so a malformed model response is caught
 * (and repaired/retried) rather than persisted.
 */

export const DialogueLine = z.object({
  speaker: z.string(),
  text: z.string(),
});

export const PanelSpec = z.object({
  description: z.string(), // visual prompt for the image model
  shot: z.string(), // framing / mood (e.g. "low-angle hero shot, rain")
  dialogue: z.array(DialogueLine).default([]),
});

export const CharacterSpec = z.object({
  name: z.string(),
  role: z.string(), // Lead / Antagonist / Support …
  description: z.string(), // visual + personality, drives the reference image
});

export const StorySpec = z.object({
  title: z.string(),
  logline: z.string(),
  theme: z.string(),
  style: z.string(), // the art-direction "style lock" applied to every render
  acts: z
    .array(z.object({ title: z.string(), summary: z.string() }))
    .min(1)
    .max(3),
  characters: z.array(CharacterSpec).min(1).max(4),
  panels: z.array(PanelSpec).min(3).max(6), // page 1
});

/** A follow-on page: just more panels, reusing the established cast + style. */
export const NextPageSpec = z.object({
  panels: z.array(PanelSpec).min(3).max(6),
});

export type StorySpec = z.infer<typeof StorySpec>;
export type NextPageSpec = z.infer<typeof NextPageSpec>;
export type PanelSpec = z.infer<typeof PanelSpec>;
export type CharacterSpec = z.infer<typeof CharacterSpec>;
export type DialogueLine = z.infer<typeof DialogueLine>;

/** Pull the first JSON object out of a model response (handles ```json fences). */
export function extractJson(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const slice = start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate;
  return JSON.parse(slice);
}
