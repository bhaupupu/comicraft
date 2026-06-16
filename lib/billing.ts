import "server-only";
import type Stripe from "stripe";
import type { Plan } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStripe, PLAN_PRICES, planFromPrice } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type Result = { url?: string; error?: string };

async function ensureCustomer(userId: string, email?: string | null): Promise<string> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (sub?.stripeCustomerId) return sub.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });
  await prisma.subscription.upsert({
    where: { userId },
    create: { userId, stripeCustomerId: customer.id, plan: "FREE" },
    update: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

/** Create a Stripe Checkout session for an upgrade; returns the redirect URL. */
export async function createCheckout(
  userId: string,
  email: string | null | undefined,
  plan: "creator" | "pro",
): Promise<Result> {
  const stripe = getStripe();
  const price = PLAN_PRICES[plan];
  if (!stripe || !price) return { error: "Billing isn't configured yet." };

  const customer = await ensureCustomer(userId, email);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${APP_URL}/studio?upgraded=1`,
    cancel_url: `${APP_URL}/pricing`,
    metadata: { userId, plan },
    subscription_data: { metadata: { userId, plan } },
  });
  return { url: session.url ?? undefined };
}

/** Open the Stripe customer portal so the user can manage/cancel their plan. */
export async function createPortal(userId: string): Promise<Result> {
  const stripe = getStripe();
  if (!stripe) return { error: "Billing isn't configured yet." };
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub?.stripeCustomerId) return { error: "No billing account yet — upgrade first." };

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${APP_URL}/studio`,
  });
  return { url: session.url };
}

/** Reconcile our DB plan from a Stripe subscription (called by the webhook). */
export async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price?.id;
  const active = sub.status === "active" || sub.status === "trialing";
  const plan: Plan = active ? planFromPrice(priceId) : "FREE";

  // current_period_end moved across Stripe API versions — read defensively.
  const raw = sub as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  const periodEnd = raw.current_period_end ?? raw.items?.data?.[0]?.current_period_end;
  const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000) : null;

  let userId = (sub.metadata?.userId as string | undefined) ?? undefined;
  if (!userId) {
    const existing = await prisma.subscription.findFirst({ where: { stripeCustomerId: customerId } });
    userId = existing?.userId;
  }
  if (!userId) return;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubId: sub.id,
      plan,
      status: sub.status,
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubId: sub.id,
      plan,
      status: sub.status,
      currentPeriodEnd,
    },
  });
  await prisma.user.update({ where: { id: userId }, data: { plan } });
}
