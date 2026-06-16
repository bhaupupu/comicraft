"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricing } from "@/lib/site";
import { PlanCta } from "@/components/billing/plan-cta";
import { StarBurst } from "@/components/comic/star-burst";
import { Halftone } from "@/components/comic/halftone";
import { panelIn, stagger, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PricingCards() {
  return (
    <motion.div
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3"
    >
      {pricing.plans.map((plan, idx) => {
        const featured = plan.featured;
        return (
          <motion.div
            key={plan.id}
            variants={panelIn}
            className={cn("relative", featured && "md:-mt-4 md:mb-4")}
          >
            {featured && (
              <div className="absolute -right-3 -top-3 z-20">
                <StarBurst className="h-20 w-20">
                  Best
                  <br />
                  value
                </StarBurst>
              </div>
            )}
            <div
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-panel border-2 border-ink p-6",
                featured
                  ? "bg-ink text-paper shadow-panel-lg"
                  : "bg-white text-ink shadow-panel",
              )}
            >
              {featured && (
                <Halftone
                  className="absolute inset-x-0 top-0 h-24 opacity-[0.1]"
                  dot={10}
                  color="#FAF6EE"
                />
              )}

              {/* issue-number header */}
              <div className="relative flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.2em]",
                    featured ? "text-accent" : "text-ink-faint",
                  )}
                >
                  Issue #{idx + 1}
                </span>
                <span
                  className={cn(
                    "rounded-full border-2 px-2.5 py-0.5 font-display text-xs font-extrabold",
                    featured ? "border-accent text-accent" : "border-ink text-ink",
                  )}
                >
                  {plan.name}
                </span>
              </div>

              <div className="relative mt-5 flex items-end gap-1">
                <span className="font-display text-5xl font-extrabold leading-none">
                  ${plan.price}
                </span>
                <span
                  className={cn(
                    "mb-1 text-sm",
                    featured ? "text-paper/60" : "text-ink-faint",
                  )}
                >
                  {plan.cadence}
                </span>
              </div>
              <p
                className={cn(
                  "relative mt-2 text-[15px]",
                  featured ? "text-paper/75" : "text-ink-soft",
                )}
              >
                {plan.blurb}
              </p>

              <div className="relative my-5 h-px w-full bg-current opacity-15" />
              <p
                className={cn(
                  "relative mb-3 text-xs font-semibold uppercase tracking-wide",
                  featured ? "text-accent" : "text-ink-soft",
                )}
              >
                {plan.limit}
              </p>

              <ul className="relative flex flex-1 flex-col gap-2.5">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-[14px]">
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                        featured
                          ? "border-accent bg-accent/20"
                          : "border-ink bg-accent",
                      )}
                    >
                      <Check size={12} strokeWidth={3} className={featured ? "text-accent" : "text-ink"} />
                    </span>
                    <span className={featured ? "text-paper/90" : "text-ink"}>
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-6">
                <PlanCta planId={plan.id} label={plan.cta} featured={featured} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
