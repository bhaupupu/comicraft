"use client";

import { motion } from "framer-motion";
import { PenTool, SlidersHorizontal, ShieldCheck, Repeat } from "lucide-react";
import { fadeUp, stagger, inViewOnce } from "@/lib/motion";

const PRINCIPLES = [
  {
    Icon: PenTool,
    title: "Creation, not consumption",
    body: "This isn't a feed of comics to scroll. It's the studio where you make your own.",
  },
  {
    Icon: Repeat,
    title: "Consistency you can trust",
    body: "Characters stay on-model from the first panel to the last. No drift, no re-rolls.",
  },
  {
    Icon: SlidersHorizontal,
    title: "You stay the author",
    body: "AI drafts; you direct. Every beat, line and panel is yours to override.",
  },
  {
    Icon: ShieldCheck,
    title: "Yours to publish",
    body: "Clear commercial rights on paid plans — sell it, print it, post it.",
  },
];

export function Principles() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="container-page">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PRINCIPLES.map((p) => (
            <motion.div key={p.title} variants={fadeUp} className="flex flex-col gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-ink bg-white shadow-panel-sm">
                <p.Icon size={22} className="text-ink" />
              </span>
              <h3 className="text-lg font-extrabold leading-tight text-ink">
                {p.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-ink-soft">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
