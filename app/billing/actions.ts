"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createCheckout, createPortal } from "@/lib/billing";

/** Start a Checkout for an upgrade; redirects to Stripe on success. */
export async function startCheckoutAction(
  plan: "creator" | "pro",
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in first." };

  const res = await createCheckout(session.user.id, session.user.email, plan);
  if (res.url) redirect(res.url); // throws — navigation to Stripe
  return { error: res.error ?? "Could not start checkout." };
}

/** Open the Stripe customer portal. */
export async function openPortalAction(): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in first." };

  const res = await createPortal(session.user.id);
  if (res.url) redirect(res.url);
  return { error: res.error ?? "Could not open billing." };
}
