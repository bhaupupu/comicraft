import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns a Stripe client, or null when billing isn't configured (app still runs). */
export function getStripe(): Stripe | null {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client = new Stripe(key);
  return client;
}

export const PLAN_PRICES: Record<"creator" | "pro", string | undefined> = {
  creator: process.env.STRIPE_PRICE_CREATOR,
  pro: process.env.STRIPE_PRICE_PRO,
};

export function planFromPrice(priceId: string | null | undefined): "FREE" | "CREATOR" | "PRO" {
  if (priceId && priceId === PLAN_PRICES.pro) return "PRO";
  if (priceId && priceId === PLAN_PRICES.creator) return "CREATOR";
  return "FREE";
}

export function billingConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}
