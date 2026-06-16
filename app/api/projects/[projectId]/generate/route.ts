import { auth } from "@/auth";
import { getProject } from "@/lib/data/projects";
import { generateComic, generateNextPage } from "@/lib/ai/orchestrator";
import type { ProgressEvent } from "@/lib/ai/progress";

export const runtime = "nodejs"; // Prisma + generation need the Node runtime
export const dynamic = "force-dynamic";
export const maxDuration = 60; // allow long renders on Vercel (Hobby cap)

/** Streams generation progress as Server-Sent Events. */
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } },
) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const project = await getProject(params.projectId, session.user.id);
  if (!project) return new Response("Not found", { status: 404 });

  const userId = session.user.id;
  const plan = session.user.plan;
  const mode = new URL(req.url).searchParams.get("mode");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: ProgressEvent) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
      try {
        if (mode === "next-page") await generateNextPage(project, userId, plan, send);
        else await generateComic(project, userId, plan, send);
      } catch (e) {
        send({ type: "error", message: e instanceof Error ? e.message : "Generation failed." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
