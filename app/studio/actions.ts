"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createProject, getProject } from "@/lib/data/projects";
import { generateComic } from "@/lib/ai/orchestrator";

/** Create a project from the dashboard prompt, then jump into its editor. */
export async function createProjectAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/studio");

  const premise = String(formData.get("premise") ?? "").trim();
  if (!premise) redirect("/studio");

  const project = await createProject(session.user.id, premise);
  redirect(`/studio/p/${project.id}`);
}

export type GenerateActionResult = {
  ok: boolean;
  error?: string;
  made?: number;
  remaining?: number;
  placeholder?: boolean;
};

/** Run the full generation pipeline for a project, then revalidate its editor. */
export async function generateProjectAction(
  projectId: string,
): Promise<GenerateActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You're signed out." };

  const project = await getProject(projectId, session.user.id);
  if (!project) return { ok: false, error: "Project not found." };

  try {
    const res = await generateComic(project, session.user.id, session.user.plan);
    revalidatePath(`/studio/p/${projectId}`);
    return { ok: true, made: res.imagesMade, remaining: res.remaining, placeholder: res.placeholder };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Generation failed." };
  }
}
