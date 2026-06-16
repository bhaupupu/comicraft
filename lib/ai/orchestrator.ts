import "server-only";
import { Prisma, type Plan, type Project } from "@prisma/client";
import { prisma } from "@/lib/db";
import { StorySpec, NextPageSpec, extractJson } from "@/lib/ai/schema";
import { getTextProvider, getImageProvider } from "@/lib/ai/router";
import {
  buildStoryPrompt,
  buildCharacterPrompt,
  buildPanelPrompt,
  buildNextPagePrompt,
} from "@/lib/ai/prompts";
import { storeImage } from "@/lib/storage";
import { dataUrlToGenImage, type GenImage, type ImageProvider } from "@/lib/ai/provider";
import { imageBudget } from "@/lib/ai/metering";
import type { ProgressEvent } from "@/lib/ai/progress";

const MAX_IMAGES_PER_RUN = 6; // bound request latency regardless of plan

export type GenerateResult = {
  title: string;
  imagesMade: number;
  remaining: number;
  placeholder: boolean;
};

/** Render one image (metered + persisted). Returns null on failure (never billed). */
async function renderImage(
  image: ImageProvider,
  params: {
    userId: string;
    projectId: string;
    kind: "CHARACTER" | "PANEL";
    prompt: string;
    refs: (GenImage | null)[];
  },
): Promise<{ url: string; assetId: string; placeholder: boolean } | null> {
  const { userId, projectId, kind, prompt, refs } = params;
  const gen = await prisma.generation.create({
    data: { userId, projectId, kind, status: "RUNNING", prompt: prompt.slice(0, 400), provider: image.name },
  });
  try {
    const cleanRefs = refs.filter((r): r is GenImage => r !== null);
    const gi = await image.generate(prompt, cleanRefs);
    const placeholder = gi.mimeType.includes("svg");
    const stored = await storeImage(gi, `${kind.toLowerCase()}-${gen.id}`);
    const asset = await prisma.asset.create({ data: { userId, projectId, kind, url: stored.url } });
    await prisma.generation.update({ where: { id: gen.id }, data: { status: "SUCCEEDED", assetId: asset.id } });
    return { url: stored.url, assetId: asset.id, placeholder };
  } catch (e) {
    await prisma.generation.update({
      where: { id: gen.id },
      data: { status: "FAILED", error: (e instanceof Error ? e.message : String(e)).slice(0, 400) },
    });
    return null;
  }
}

/**
 * Full first-page generation: premise → story → cast → page 1 → panels.
 * Calls `onProgress` so the editor can stream the run.
 */
export async function generateComic(
  project: Project,
  userId: string,
  plan: Plan,
  onProgress: (e: ProgressEvent) => void = () => {},
): Promise<GenerateResult> {
  const text = getTextProvider();
  const image = getImageProvider();

  await prisma.project.update({ where: { id: project.id }, data: { status: "GENERATING" } });

  // 1) Story (text). One repair retry if the JSON doesn't validate.
  onProgress({ type: "stage", key: "story", label: "Writing the story…" });
  let story: StorySpec;
  try {
    story = StorySpec.parse(extractJson(await text.generate(buildStoryPrompt(project.premise))));
  } catch {
    story = StorySpec.parse(
      extractJson(await text.generate(buildStoryPrompt(project.premise) + "\n\nReturn ONLY valid minified JSON.")),
    );
  }
  await prisma.generation.create({
    data: { userId, projectId: project.id, kind: "STORY", status: "SUCCEEDED", provider: text.name },
  });

  // 2) Persist (wipe prior content so regenerate is idempotent).
  await prisma.page.deleteMany({ where: { projectId: project.id } }); // cascades panels
  await prisma.character.deleteMany({ where: { projectId: project.id } });
  await prisma.asset.deleteMany({ where: { projectId: project.id } });
  await prisma.project.update({ where: { id: project.id }, data: { title: story.title.slice(0, 80) } });

  const characters: { spec: (typeof story.characters)[number]; id: string; refImageUrl: string | null }[] = [];
  for (const c of story.characters) {
    const row = await prisma.character.create({
      data: { userId, projectId: project.id, name: c.name, role: c.role, description: c.description },
    });
    characters.push({ spec: c, id: row.id, refImageUrl: null });
  }

  const page = await prisma.page.create({
    data: {
      projectId: project.id,
      index: 0,
      layout: {
        title: story.title,
        logline: story.logline,
        theme: story.theme,
        style: story.style,
        acts: story.acts,
      } as Prisma.InputJsonValue,
    },
  });

  const panels: { spec: (typeof story.panels)[number]; id: string }[] = [];
  for (let i = 0; i < story.panels.length; i++) {
    const p = story.panels[i];
    const row = await prisma.panel.create({
      data: { pageId: page.id, index: i, prompt: p.description, shot: p as Prisma.InputJsonValue },
    });
    panels.push({ spec: p, id: row.id });
  }

  // 3) Images within budget.
  const budget = await imageBudget(userId, plan);
  let remaining = budget.remaining;
  let made = 0;
  let realCount = 0;

  const charBudget = Math.min(characters.length, remaining, MAX_IMAGES_PER_RUN);
  onProgress({ type: "stage", key: "characters", label: "Designing the cast…", total: charBudget });
  for (let i = 0; i < characters.length; i++) {
    if (remaining <= 0 || made >= MAX_IMAGES_PER_RUN) break;
    const c = characters[i];
    const out = await renderImage(image, {
      userId,
      projectId: project.id,
      kind: "CHARACTER",
      prompt: buildCharacterPrompt(c.spec, story.style),
      refs: [],
    });
    if (out) {
      c.refImageUrl = out.url;
      await prisma.character.update({ where: { id: c.id }, data: { refImageUrl: out.url } });
      remaining--;
      made++;
      if (!out.placeholder) realCount++;
    }
    onProgress({ type: "tick", key: "characters", current: i + 1, total: charBudget, label: c.spec.name });
  }

  const castRefs = characters.map((c) => dataUrlToGenImage(c.refImageUrl));
  const castNote = characters.length ? `Featuring: ${characters.map((c) => c.spec.name).join(", ")}.` : "";
  onProgress({ type: "stage", key: "panels", label: "Rendering the page…", total: panels.length });
  for (let i = 0; i < panels.length; i++) {
    if (remaining <= 0 || made >= MAX_IMAGES_PER_RUN) break;
    const p = panels[i];
    const out = await renderImage(image, {
      userId,
      projectId: project.id,
      kind: "PANEL",
      prompt: buildPanelPrompt(p.spec, story.style, castNote),
      refs: castRefs,
    });
    if (out) {
      await prisma.panel.update({ where: { id: p.id }, data: { assetId: out.assetId } });
      remaining--;
      made++;
      if (!out.placeholder) realCount++;
    }
    onProgress({ type: "tick", key: "panels", current: i + 1, total: panels.length });
  }

  await prisma.project.update({ where: { id: project.id }, data: { status: "READY" } });
  const placeholder = made > 0 && realCount === 0;
  onProgress({ type: "done", made, remaining, placeholder, title: story.title });
  return { title: story.title, imagesMade: made, remaining, placeholder };
}

/**
 * Generate the NEXT page of an existing comic — continues the story with the
 * established cast (reusing their reference images for consistency).
 */
export async function generateNextPage(
  project: Project,
  userId: string,
  plan: Plan,
  onProgress: (e: ProgressEvent) => void = () => {},
): Promise<GenerateResult> {
  const text = getTextProvider();
  const image = getImageProvider();

  const characters = await prisma.character.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "asc" },
  });
  const firstPage = await prisma.page.findFirst({
    where: { projectId: project.id },
    orderBy: { index: "asc" },
  });
  const meta = (firstPage?.layout ?? {}) as unknown as { logline?: string; theme?: string; style?: string };
  const agg = await prisma.page.aggregate({ where: { projectId: project.id }, _max: { index: true } });
  const nextIndex = (agg._max.index ?? -1) + 1;
  const style = meta.style ?? "";

  await prisma.project.update({ where: { id: project.id }, data: { status: "GENERATING" } });

  onProgress({ type: "stage", key: "story", label: `Plotting page ${nextIndex + 1}…` });
  const promptInput = {
    premise: project.premise,
    logline: meta.logline,
    theme: meta.theme,
    style: meta.style,
    characters: characters.map((c) => c.name),
    pageNumber: nextIndex + 1,
  };
  let spec: NextPageSpec;
  try {
    spec = NextPageSpec.parse(extractJson(await text.generate(buildNextPagePrompt(promptInput))));
  } catch {
    spec = NextPageSpec.parse(
      extractJson(await text.generate(buildNextPagePrompt(promptInput) + "\n\nReturn ONLY valid minified JSON.")),
    );
  }
  await prisma.generation.create({
    data: { userId, projectId: project.id, kind: "STORY", status: "SUCCEEDED", provider: text.name },
  });

  const page = await prisma.page.create({
    data: { projectId: project.id, index: nextIndex, layout: { continuation: true } as Prisma.InputJsonValue },
  });
  const panels: { spec: (typeof spec.panels)[number]; id: string }[] = [];
  for (let i = 0; i < spec.panels.length; i++) {
    const p = spec.panels[i];
    const row = await prisma.panel.create({
      data: { pageId: page.id, index: i, prompt: p.description, shot: p as Prisma.InputJsonValue },
    });
    panels.push({ spec: p, id: row.id });
  }

  const budget = await imageBudget(userId, plan);
  let remaining = budget.remaining;
  let made = 0;
  let realCount = 0;
  const castRefs = characters.map((c) => dataUrlToGenImage(c.refImageUrl));
  const castNote = characters.length ? `Featuring: ${characters.map((c) => c.name).join(", ")}.` : "";

  onProgress({ type: "stage", key: "panels", label: "Rendering the page…", total: panels.length });
  for (let i = 0; i < panels.length; i++) {
    if (remaining <= 0 || made >= MAX_IMAGES_PER_RUN) break;
    const p = panels[i];
    const out = await renderImage(image, {
      userId,
      projectId: project.id,
      kind: "PANEL",
      prompt: buildPanelPrompt(p.spec, style, castNote),
      refs: castRefs,
    });
    if (out) {
      await prisma.panel.update({ where: { id: p.id }, data: { assetId: out.assetId } });
      remaining--;
      made++;
      if (!out.placeholder) realCount++;
    }
    onProgress({ type: "tick", key: "panels", current: i + 1, total: panels.length });
  }

  await prisma.project.update({ where: { id: project.id }, data: { status: "READY" } });
  const placeholder = made > 0 && realCount === 0;
  onProgress({ type: "done", made, remaining, placeholder, title: project.title });
  return { title: project.title, imagesMade: made, remaining, placeholder };
}
