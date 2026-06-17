"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Halftone } from "@/components/comic/halftone";
import { SpeechBubble } from "@/components/comic/speech-bubble";
import { StarBurst } from "@/components/comic/star-burst";
import { fadeUp, stagger } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yUp = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yDown = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -28]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-gradient-to-b from-accent/20 via-paper to-transparent" />
      <Halftone className="absolute -left-16 top-24 h-72 w-72 opacity-[0.12]" dot={12} />
      <Halftone className="absolute -right-10 bottom-0 h-64 w-64 opacity-[0.1]" dot={10} fade />

      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.06fr] lg:gap-8 lg:py-16">
        {/* ---------------- copy ---------------- */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-semibold shadow-panel-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-pop" />
            The comic creation studio
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-balance font-display text-[clamp(2.6rem,6.4vw,5rem)] font-extrabold leading-[0.94] text-ink"
          >
            Turn Ideas Into
            <br />
            Comics{" "}
            <span className="marker whitespace-nowrap">Worth Reading.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg text-pretty text-lg leading-relaxed text-ink-soft"
          >
            Create manga, graphic novels, and cinematic comic stories using
            AI—no drawing skills required.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/studio" variant="pop" size="lg">
              <Sparkles size={18} /> Start Creating Free
            </Button>
            <Button href="#showcase" variant="outline" size="lg">
              <BookOpen size={18} /> Explore Comics
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft"
          >
            {["No drawing skills", "2 free projects", "Export in minutes"].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-pop-mint" /> {t}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* ---------------- comic collage ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative"
        >
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
            {/* tall hero close-up */}
            <motion.figure
              style={reduce ? undefined : { y: yUp }}
              className="relative row-span-2 overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-lg"
            >
              <span className="absolute left-0 top-0 z-10 rounded-br-xl border-b-2 border-r-2 border-ink bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-paper">
                01 · The Emberwright
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/hunter.jpg"
                alt="Manga close-up of a dragon hunter with glowing eyes"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </motion.figure>

            {/* dragon splash */}
            <motion.figure
              style={reduce ? undefined : { y: yDown }}
              className="relative overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/dragon.jpg"
                alt="A hunter facing a colossal dragon"
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
              <figcaption className="absolute inset-x-2 bottom-2 rounded-md border-2 border-ink bg-accent px-2.5 py-1 font-comic text-[11px] font-bold leading-tight text-ink">
                Ch. 1 — The Ash Ridge
              </figcaption>
            </motion.figure>

            {/* sci-fi range panel */}
            <motion.figure
              style={reduce ? undefined : { y: yMid }}
              className="relative overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/city.jpg"
                alt="A cyberpunk detective on a neon street"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <span className="absolute right-2 top-2 rounded-full border-2 border-ink bg-white px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                Sci-Fi
              </span>
            </motion.figure>
          </div>

          {/* floating overlays */}
          <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 sm:block">
            <SpeechBubble tone="pop" tail="br" className="animate-bob shadow-panel-sm">
              Wait — I made this?!
            </SpeechBubble>
          </div>

          <StarBurst
            className="absolute -right-4 -top-5 h-24 w-24 rotate-[14deg] animate-drift-slow drop-shadow-[3px_3px_0_#181410]"
            fill="var(--pop)"
          >
            <span className="leading-[0.9] text-white">
              NO
              <br />
              DRAW
              <br />
              SKILL
            </span>
          </StarBurst>
        </motion.div>
      </div>
    </section>
  );
}
