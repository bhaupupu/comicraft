import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { getProjectContent } from "@/lib/data/projects";
import { imageBudget } from "@/lib/ai/metering";
import { providerStatus } from "@/lib/ai/router";
import { Studio } from "@/components/studio/studio";
import { GenerateStream } from "@/components/studio/generate-stream";
import { Halftone } from "@/components/comic/halftone";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  params,
}: {
  params: { projectId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/studio");

  const content = await getProjectContent(params.projectId, session.user.id);
  if (!content) notFound();

  const status = providerStatus();
  const generated = content.pages.some((p) => p.panels.length > 0);

  if (generated) {
    // Honest label: if Gemini's image quota forced the SVG fallback, say so.
    const engineLabel =
      content.art === "placeholder" ? "Mock placeholder" : status.label;
    return (
      <div className="min-h-[80vh] bg-paper">
        <Studio
          projectId={content.project.id}
          projectName={content.project.title}
          pages={content.pages}
          characters={content.characters}
          story={content.story}
          engineLabel={engineLabel}
          placeholderArt={content.art === "placeholder"}
          watermark={session.user.plan === "FREE"}
        />
      </div>
    );
  }

  // Empty project → prompt to generate.
  const budget = await imageBudget(session.user.id, session.user.plan);
  return (
    <div className="min-h-[80vh] bg-paper">
      <section className="container-page py-8">
        <Link
          href="/studio"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
        >
          <ChevronLeft size={15} /> Back to dashboard
        </Link>

        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-panel border-2 border-ink bg-white p-8 text-center shadow-panel">
          <Halftone className="absolute inset-x-0 top-0 h-24 opacity-[0.1]" dot={10} />
          <span className="relative inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-3 py-1 text-xs font-bold uppercase">
            <Sparkles size={12} /> {status.live ? `Engine: ${status.label}` : "Free mock engine"}
          </span>
          <h1 className="relative mt-4 font-display text-3xl font-extrabold">
            {content.project.title}
          </h1>
          <p className="relative mx-auto mt-2 max-w-md font-comic font-bold text-ink-soft">
            “{content.project.premise}”
          </p>
          <p className="relative mx-auto mt-4 max-w-md text-ink-soft">
            Comicraft will write the story, design the cast, and render your first page —
            keeping characters on-model across panels.
          </p>
          <div className="relative mt-6 flex justify-center">
            <GenerateStream projectId={content.project.id} />
          </div>
          <p className="relative mt-4 text-xs text-ink-faint">
            {budget.remaining} image generation{budget.remaining === 1 ? "" : "s"} left on your{" "}
            {session.user.plan} plan
            {!status.live && " · add GEMINI_API_KEY for real art"}.
          </p>
        </div>
      </section>
    </div>
  );
}
