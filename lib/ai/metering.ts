import "server-only";
import { prisma } from "@/lib/db";
import type { Plan } from "@prisma/client";

const IMAGE_KINDS = ["CHARACTER", "SCENE", "PANEL"] as const;

/** FREE image allowance (per pricing: 2). Bump for local testing via env. */
export function freeLimit() {
  return Number(process.env.INKWELL_FREE_IMAGE_LIMIT ?? 2);
}

export type Budget = {
  used: number;
  limit: number;
  remaining: number;
  window: "total" | "month";
};

/** How many image generations the user has left. FREE = lifetime; paid = this month. */
export async function imageBudget(userId: string, plan: Plan): Promise<Budget> {
  if (plan === "FREE") {
    const used = await prisma.generation.count({
      where: { userId, status: "SUCCEEDED", kind: { in: [...IMAGE_KINDS] } },
    });
    const limit = freeLimit();
    return { used, limit, remaining: Math.max(0, limit - used), window: "total" };
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const used = await prisma.generation.count({
    where: {
      userId,
      status: "SUCCEEDED",
      kind: { in: [...IMAGE_KINDS] },
      createdAt: { gte: start },
    },
  });
  const limit = plan === "CREATOR" ? 300 : 100_000;
  return { used, limit, remaining: Math.max(0, limit - used), window: "month" };
}
