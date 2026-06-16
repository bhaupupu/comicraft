# 12 · Phase 5 Guide — Stripe billing

Phase 5 adds real subscriptions: **Free / Creator ($5) / Pro ($20)**, Stripe Checkout, the customer
portal, and a webhook that keeps each user's plan in sync. The app runs fine **without** Stripe —
upgrade buttons just say "billing isn't configured yet" until you add the keys.

## What got built
| Piece | File | Role |
| --- | --- | --- |
| Stripe client | `lib/stripe.ts` | lazy client + price→plan map (null when unconfigured) |
| Billing logic | `lib/billing.ts` | `createCheckout`, `createPortal`, `syncSubscription` |
| Server actions | `app/billing/actions.ts` | `startCheckoutAction`, `openPortalAction` |
| Webhook | `app/api/webhooks/stripe/route.ts` | verifies signature → updates `User.plan` + `Subscription` |
| Upgrade CTA | `components/billing/plan-cta.tsx` | plan-aware buttons on the pricing cards |
| Dashboard | `app/studio/page.tsx` | "Upgrade" chip for free users + post-checkout banner |

The metering from Phase 2 (`lib/ai/metering.ts`) already reads `User.plan`, so upgrading immediately
raises generation limits (Free = 2 images lifetime → Creator = 300/mo → Pro = high).

## Setup (Stripe **test mode** — ~10 min)

1. **Create a Stripe account** → https://dashboard.stripe.com. Toggle **Test mode** (top-right).
2. **Secret key:** *Developers → API keys* → copy **Secret key** (`sk_test_…`):
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```
3. **Create the two products** (*Product catalog → + Add product*). For each, add a **recurring
   monthly** price:
   - **Creator** — $5.00 / month
   - **Pro** — $20.00 / month

   Open each price and copy its **API ID** (starts with `price_…`, NOT `prod_…`):
   ```
   STRIPE_PRICE_CREATOR=price_...
   STRIPE_PRICE_PRO=price_...
   ```
4. **Webhook secret** — pick one:
   - **Local dev (recommended):** install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then:
     ```bash
     stripe login
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
     It prints a signing secret (`whsec_…`) → put it in `.env.local`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```
     Keep `stripe listen` running while you test.
   - **Production:** *Developers → Webhooks → Add endpoint* →
     `https://yourdomain.com/api/webhooks/stripe`, select events
     `checkout.session.completed`, `customer.subscription.created/updated/deleted` → copy the
     signing secret.
5. **Restart `npm run dev`** (env is read at startup).

## Test the upgrade flow
1. Sign in → go to **/pricing**.
2. Click **Go Creator** (or Pro) → you're redirected to Stripe Checkout.
3. Pay with the test card **`4242 4242 4242 4242`**, any future expiry, any CVC/ZIP.
4. You're sent back to `/studio?upgraded=1` (success banner). The webhook flips your plan to CREATOR/PRO
   within a second — refresh if the chip still says FREE.
5. On the pricing page your current plan now shows **Manage plan** → opens the Stripe **customer
   portal** (change/cancel). Cancelling fires a webhook that drops you back to FREE.

## How it maps
- `startCheckoutAction(plan)` → `createCheckout` → Stripe Checkout (subscription mode), creating a
  Stripe customer per user (stored on `Subscription.stripeCustomerId`).
- Stripe → **webhook** → `syncSubscription` writes `Subscription` + `User.plan` from the live
  subscription's price + status (active/trialing → that plan; canceled/past_due → FREE).
- `PlanCta` reads the session plan client-side to show **Go / Current / Manage**.

## Notes & next
- **Idempotent + source-of-truth:** the webhook is authoritative. The `?upgraded=1` banner is just UX;
  the plan only changes when Stripe confirms.
- **Security:** the webhook verifies the Stripe signature; never trust the success redirect alone.
- ⏳ Next: proration messaging, annual plans, usage-based add-on credits, and a dedicated
  `/studio/billing` settings page with invoice history (the portal covers most of this already).
