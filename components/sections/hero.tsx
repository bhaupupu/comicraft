"use client";

import { motion } from "framer-motion";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Halftone } from "@/components/comic/halftone";
import { HeroPipeline } from "@/components/sections/hero-pipeline";
import { fadeUp, stagger } from "@/lib/motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* texture layers */}
      <Halftone
        className="absolute -right-20 -top-10 h-72 w-72 rotate-12 opacity-[0.13]"
        dot={11}
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-accent/15 to-transparent" />

      <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        {/* copy */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-sm font-semibold shadow-panel-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-pop" />
            The AI comic studio
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.95] text-ink"
          >
            Create a complete comic
            <br />
            from a single{" "}
            <span className="marker whitespace-nowrap">idea.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-md text-pretty text-lg leading-relaxed text-ink-soft"
          >
            Type one line. Comicraft writes the story, designs a cast that stays
            on-model, builds the scenes, lays out the panels and letters the
            dialogue — a finished comic in minutes.
          </motion.p>

          {/* fake prompt input → CTA */}
          <motion.form
            variants={fadeUp}
            action="/studio"
            className="group flex w-full max-w-md items-center gap-2 rounded-full border-2 border-ink bg-white p-1.5 pl-4 shadow-panel transition-shadow focus-within:shadow-panel-lg"
          >
            <span className="font-mono text-ink-faint">›</span>
            <input
              aria-label="Describe your comic idea"
              placeholder="A retired samurai fox opens a tea shop…"
              className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-ink-faint"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              Generate
              <CornerDownLeft size={16} />
            </Button>
          </motion.form>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-pop-mint" /> 2 free
              generations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-pop-mint" /> No credit
              card
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-pop-mint" /> Export in
              minutes
            </span>
          </motion.div>
        </motion.div>

        {/* live demo */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <HeroPipeline />
          <p className="mt-3 text-center font-mono text-xs text-ink-faint">
            ↑ a real run of the pipeline, start to finish
          </p>
        </motion.div>
      </div>

      <a
        href="#how-it-works"
        className="mx-auto mb-2 hidden w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink lg:flex"
      >
        See how it works <ArrowRight size={15} className="rotate-90" />
      </a>
    </section>
  );
}
