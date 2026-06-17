"use client";

import { motion } from "framer-motion";
import {
  PenLine,
  Users,
  Palette,
  LayoutGrid,
  Clapperboard,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { panelIn, stagger, inViewOnce } from "@/lib/motion";

const STEPS = [
  {
    n: 1,
    label: "Story",
    Icon: PenLine,
    body: "Write what you'd tell a friend. The AI helps you expand it, sharpen the plot, and find the twist.",
  },
  {
    n: 2,
    label: "Character Bible",
    Icon: Users,
    body: "Your cast appears as cards — faces, personalities, goals. Edit anyone, add anyone, keep them on-model.",
  },
  {
    n: 3,
    label: "Visual Style",
    Icon: Palette,
    body: "Pick a look you love from real previews — manga, noir, watercolor, anime and more.",
  },
  {
    n: 4,
    label: "Storyboard",
    Icon: LayoutGrid,
    body: "Shape every page like sticky notes on a board. Drag panels, edit dialogue, set the pacing.",
  },
  {
    n: 5,
    label: "Production",
    Icon: Clapperboard,
    body: "Hit Start Production and watch it come to life — scripted, drawn, lettered, and bound into a comic.",
  },
];

export function Journey() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="The creation journey"
          title={
            <>
              From blank page to{" "}
              <span className="marker">bound comic</span>, in five moves.
            </>
          }
          lead="It doesn't feel like operating software. It feels like directing a story — and the studio keeps up with you at every step."
        />

        <motion.ol
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {/* connecting inked path (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-[3px] lg:block">
            <div className="ink-divider mx-[10%]" />
          </div>

          {STEPS.map((s) => (
            <motion.li key={s.n} variants={panelIn} className="relative">
              <div className="group flex h-full flex-col rounded-panel border-2 border-ink bg-white p-5 shadow-panel-sm transition-all hover:-translate-y-1 hover:shadow-panel">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-accent font-display text-lg font-extrabold text-ink shadow-panel-sm transition-transform group-hover:-rotate-6">
                    {s.n}
                  </span>
                  <s.Icon size={22} className="text-ink-soft" />
                </div>
                <h3 className="text-lg font-extrabold leading-tight text-ink">
                  {s.label}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
