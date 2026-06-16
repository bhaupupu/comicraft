"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  ScrollText,
  Users,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquare,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { panelIn, stagger, inViewOnce } from "@/lib/motion";

const STEPS = [
  { n: 1, label: "Idea", caption: "Write one line — or a whole logline.", Icon: Lightbulb },
  { n: 2, label: "Story", caption: "AI drafts plot, beats, chapters & script.", Icon: ScrollText },
  { n: 3, label: "Characters", caption: "A cast designed once, kept on-model everywhere.", Icon: Users },
  { n: 4, label: "Scenes", caption: "Environments and shots, generated to match.", Icon: ImageIcon },
  { n: 5, label: "Panels", caption: "Pages auto-laid-out with cinematic pacing.", Icon: LayoutGrid },
  { n: 6, label: "Dialogue", caption: "Speech bubbles written and lettered for you.", Icon: MessageSquare },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="How it works"
          title={
            <>
              Six steps from <span className="marker">blank page</span> to finished comic.
            </>
          }
          lead="Each step is automatic — but everything stays editable. Jump in at any stage and take the wheel."
        />

        <motion.ol
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {STEPS.map((s) => (
            <motion.li key={s.n} variants={panelIn}>
              <div className="group relative h-full rounded-panel border-2 border-ink bg-white p-5 shadow-panel-sm transition-all hover:-translate-y-1 hover:shadow-panel">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-ink bg-accent">
                    <s.Icon size={20} className="text-ink" />
                  </span>
                  <span className="font-display text-4xl font-extrabold text-paper-deep transition-colors group-hover:text-accent">
                    0{s.n}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-ink">{s.label}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                  {s.caption}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
