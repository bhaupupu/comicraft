"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { startCheckoutAction, openPortalAction } from "@/app/billing/actions";
import { Button } from "@/components/ui/button";

/**
 * Plan-aware CTA on the pricing cards:
 *  - logged out → sign up
 *  - current plan → manage (Stripe portal)
 *  - otherwise → start Checkout for that plan
 * Falls back gracefully when billing isn't configured (shows the returned error).
 */
export function PlanCta({
  planId,
  label,
  featured,
}: {
  planId: "free" | "creator" | "pro";
  label: string;
  featured?: boolean;
}) {
  const { data: session, status } = useSession();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const variant = featured ? "accent" : "primary";

  if (status === "loading") {
    return (
      <Button variant={variant} size="lg" className="w-full" disabled>
        …
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <Button href="/signup" variant={variant} size="lg" className="w-full">
        {label}
      </Button>
    );
  }

  if (planId === "free") {
    return (
      <Button href="/studio" variant={variant} size="lg" className="w-full">
        Go to studio
      </Button>
    );
  }

  const isCurrent = session.user.plan === planId.toUpperCase();

  if (isCurrent) {
    return (
      <div className="flex w-full flex-col gap-1">
        <Button
          variant={featured ? "accent" : "outline"}
          size="lg"
          className="w-full"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await openPortalAction();
              if (r?.error) setError(r.error);
            })
          }
        >
          {pending ? "Opening…" : "Manage plan"}
        </Button>
        {error && <p className="text-center text-xs text-pop">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Button
        variant={variant}
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await startCheckoutAction(planId as "creator" | "pro");
            if (r?.error) setError(r.error);
          })
        }
      >
        {pending ? "Redirecting…" : label}
      </Button>
      {error && (
        <p className={`text-center text-xs ${featured ? "text-accent" : "text-pop"}`}>{error}</p>
      )}
    </div>
  );
}
