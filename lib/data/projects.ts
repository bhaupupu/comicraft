import "server-only";
import { prisma } from "@/lib/db";

/** All of a user's projects, most-recently-updated first. */
export function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { pages: true, characters: true } } },
  });
}

/** A single project, scoped to its owner (returns null if not theirs). */
export function getProject(id: string, userId: string) {
  return prisma.project.findFirst({ where: { id, userId } });
}

export type ShelfProject = {
  id: string;
  title: string;
  premise: string;
  status: string;
  pages: number;
  cast: number;
  updated: string;
  cover: string | null;
};

/** Projects for the bookshelf — with a real raster cover when one exists. */
export async function listShelf(userId: string): Promise<ShelfProject[]> {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { pages: true, characters: true } },
      pages: {
        orderBy: { index: "asc" },
        take: 1,
        include: { panels: { orderBy: { index: "asc" }, take: 1 } },
      },
    },
  });

  const firstAssetId = (p: (typeof projects)[number]) =>
    p.pages[0]?.panels[0]?.assetId ?? null;
  const assetIds = projects
    .map(firstAssetId)
    .filter((x): x is string => !!x);
  const assets = assetIds.length
    ? await prisma.asset.findMany({ where: { id: { in: assetIds } } })
    : [];
  const urlFor = new Map(assets.map((a) => [a.id, a.url]));

  return projects.map((p) => {
    const aid = firstAssetId(p);
    const url = aid ? urlFor.get(aid) ?? null : null;
    const cover =
      url && !url.startsWith("data:image/svg") && !url.endsWith(".svg") ? url : null;
    return {
      id: p.id,
      title: p.title,
      premise: p.premise,
      status: p.status,
      pages: p._count.pages,
      cast: p._count.characters,
      updated: p.updatedAt.toLocaleDateString(),
      cover,
    };
  });
}

export type EditorPanel = {
  id: string;
  label: string;
  imageUrl: string | null;
  dialogue: { speaker: string; text: string }[];
};
export type EditorPage = { id: string; index: number; panels: EditorPanel[] };
export type EditorContent = {
  project: { id: string; title: string; premise: string; status: string };
  story: { logline?: string; theme?: string; style?: string } | null;
  characters: { name: string; role: string | null; imageUrl: string | null }[];
  pages: EditorPage[];
  /** Whether the rendered art is real raster output or the free SVG placeholder. */
  art: "real" | "placeholder" | "none";
};

function isPlaceholderUrl(u: string) {
  return u.startsWith("data:image/svg") || u.endsWith(".svg");
}

/** Everything the editor needs to render every page of a project (with asset URLs). */
export async function getProjectContent(
  id: string,
  userId: string,
): Promise<EditorContent | null> {
  const project = await prisma.project.findFirst({
    where: { id, userId },
    include: {
      characters: { orderBy: { createdAt: "asc" } },
      pages: {
        orderBy: { index: "asc" },
        include: { panels: { orderBy: { index: "asc" } } },
      },
    },
  });
  if (!project) return null;

  const allPanels = project.pages.flatMap((pg) => pg.panels);
  const assetIds = allPanels.map((p) => p.assetId).filter((x): x is string => !!x);
  const assets = assetIds.length
    ? await prisma.asset.findMany({ where: { id: { in: assetIds } } })
    : [];
  const assetUrl = new Map(assets.map((a) => [a.id, a.url]));
  const urlFor = (assetId: string | null) => (assetId ? assetUrl.get(assetId) ?? null : null);

  const layout = (project.pages[0]?.layout ?? null) as unknown as {
    logline?: string;
    theme?: string;
    style?: string;
  } | null;

  const allUrls = [
    ...project.characters.map((c) => c.refImageUrl),
    ...allPanels.map((p) => urlFor(p.assetId)),
  ].filter((u): u is string => !!u);
  const art: EditorContent["art"] =
    allUrls.length === 0 ? "none" : allUrls.some((u) => !isPlaceholderUrl(u)) ? "real" : "placeholder";

  return {
    art,
    project: {
      id: project.id,
      title: project.title,
      premise: project.premise,
      status: project.status,
    },
    story: layout ? { logline: layout.logline, theme: layout.theme, style: layout.style } : null,
    characters: project.characters.map((c) => ({
      name: c.name,
      role: c.role,
      imageUrl: c.refImageUrl,
    })),
    pages: project.pages.map((pg) => ({
      id: pg.id,
      index: pg.index,
      panels: pg.panels.map((p) => {
        const shot = (p.shot ?? {}) as unknown as {
          description?: string;
          dialogue?: { speaker: string; text: string }[];
        };
        return {
          id: p.id,
          label: (shot.description ?? p.prompt ?? `Panel ${p.index + 1}`).slice(0, 60),
          imageUrl: urlFor(p.assetId),
          dialogue: shot.dialogue ?? [],
        };
      }),
    })),
  };
}

/** Create a project from a one-line premise; derive a title from it. */
export function createProject(userId: string, premise: string) {
  const clean = premise.trim();
  const title =
    clean.length > 0
      ? clean.charAt(0).toUpperCase() + clean.slice(1, 60)
      : "Untitled comic";
  return prisma.project.create({
    data: { userId, premise: clean, title },
  });
}
