import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getProjectContent } from "@/lib/data/projects";
import { imageBudget } from "@/lib/ai/metering";
import { providerStatus } from "@/lib/ai/router";
import { StudioJourney } from "@/components/studio/studio-journey";

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
  const budget = await imageBudget(session.user.id, session.user.plan);
  const generated = content.pages.some((p) => p.panels.length > 0);

  return (
    <div className="min-h-[80vh] bg-paper">
      <StudioJourney
        projectId={content.project.id}
        projectName={content.project.title}
        premise={content.project.premise}
        generated={generated}
        pages={content.pages}
        characters={content.characters}
        story={content.story}
        watermark={session.user.plan === "FREE"}
        budgetRemaining={budget.remaining}
        providerLive={status.live}
        placeholderArt={content.art === "placeholder"}
      />
    </div>
  );
}
