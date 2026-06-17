"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clapperboard, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Halftone } from "@/components/comic/halftone";
import { fadeUp, inViewOnce } from "@/lib/motion";
import { VISUAL_STYLES } from "@/lib/studio-data";

const NOTES = [
  { shot: "Wide — burning villages along the ridge.", line: "We're too late again…", tilt: "-2.2deg", accent: "bg-accent" },
  { shot: "Close — Kael's ember eyes catch the fire.", line: "Then we end it tonight.", tilt: "1.8deg", accent: "bg-pop/15" },
  { shot: "Splash — the Eldest rears, wings out.", line: "You cannot kill what you don't understand.", tilt: "-1.2deg", accent: "bg-pop-blue/15" },
];

export function StudioTeaser() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          align="center"
          kicker="The studio"
          title={
            <>
              A creative workspace, <span className="marker">not a settings panel.</span>
            </>
          }
          lead="No sliders, no seeds, no jargon. Just a calm board where your story takes shape — and an AI that does the drawing."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-panel border-2 border-ink bg-paper-deep shadow-panel-lg">
            <Halftone className="absolute inset-0 opacity-[0.05]" dot={11} />

            {/* board header */}
            <div className="relative flex items-center gap-3 border-b-2 border-ink bg-white px-4 py-2.5">
              <span className="font-display text-sm font-extrabold">
                The Last Emberwright
              </span>
              <span className="rounded-md border border-ink/20 bg-paper px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                Storyboard · 2 pages
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-pop px-3 py-1 text-xs font-bold text-white shadow-panel-sm">
                <Clapperboard size={13} /> Start Production
              </span>
            </div>

            <div className="relative grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_240px]">
              {/* storyboard sticky notes */}
              <div>
                <p className="kicker mb-3">Page 1 — The Ash Ridge</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {NOTES.map((n, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -6, rotate: 0 }}
                      style={{ rotate: n.tilt }}
                      className="sticky-note flex flex-col p-3"
                    >
                      <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                      <div className={`mb-2 grid h-20 place-items-center rounded-md border-2 border-ink ${n.accent}`}>
                        <span className="font-mono text-[10px] font-bold uppercase text-ink-soft">
                          Panel {i + 1}
                        </span>
                      </div>
                      <p className="text-[12px] font-semibold leading-snug text-ink">
                        {n.shot}
                      </p>
                      <p className="mt-1.5 rounded-md border border-ink/15 bg-white px-2 py-1 font-comic text-[11px] font-bold text-ink-soft">
                        “{n.line}”
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 self-start font-mono text-[9px] uppercase text-ink-faint">
                        <GripVertical size={11} /> drag to reorder
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* side: character + style */}
              <div className="flex flex-col gap-4">
                <div className="rounded-panel border-2 border-ink bg-white p-3 shadow-panel-sm">
                  <p className="kicker mb-2">Lead character</p>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/characters/kael.jpg"
                      alt="Kael"
                      className="h-14 w-14 shrink-0 rounded-lg border-2 border-ink object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-sm font-extrabold">Kael</p>
                      <p className="font-mono text-[10px] text-ink-faint">
                        Protagonist · on-model ✓
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-panel border-2 border-ink bg-white p-3 shadow-panel-sm">
                  <p className="kicker mb-2">Visual style</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {VISUAL_STYLES.slice(0, 8).map((s, i) => (
                      <span
                        key={s.id}
                        className={`block aspect-square overflow-hidden rounded-md border-2 ${i === 0 ? "border-pop ring-2 ring-pop/30" : "border-ink"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.preview}
                          alt={s.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-ink-faint">
                    Japanese Manga selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button href="/studio" variant="primary" size="lg">
              Step into the Studio <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
