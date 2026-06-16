"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { features } from "@/lib/features-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { panelIn, stagger, inViewOnce } from "@/lib/motion";

export function FeaturesOverview() {
  return (
    <section className="relative border-y-2 border-ink bg-paper-deep py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="The toolkit"
          title={
            <>
              Six tools. <span className="marker">One pipeline.</span>
            </>
          }
          lead="Every part of making a comic, each strong on its own — and wired together so the whole thing just flows."
        />

        <motion.div
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.slug} variants={panelIn}>
              <Link
                href={`/features/${f.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-sm transition-all hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="relative border-b-2 border-ink bg-paper">
                  <f.Art className="h-40 w-full" />
                  <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-white opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-extrabold text-ink">{f.eyebrow}</h3>
                  <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {f.lead.split(" — ")[0]}.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.flow.map((step, i) => (
                      <span
                        key={step}
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-soft"
                      >
                        {step}
                        {i < f.flow.length - 1 && (
                          <span className="text-ink-faint">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
