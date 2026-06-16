"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CornerDownRight, Check } from "lucide-react";
import { features, featureBySlug, accentClasses } from "@/lib/features-data";
import { Button } from "@/components/ui/button";
import { Halftone } from "@/components/comic/halftone";
import { fadeUp, panelIn, stagger, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Receives a `slug` (a serializable string) rather than the Feature object,
 * because the object holds an `Art` component function that cannot cross the
 * server→client boundary. The data module is imported here on the client.
 */
export function FeaturePage({ slug }: { slug: string }) {
  const feature = featureBySlug(slug);
  if (!feature) return null;
  const others = features.filter((f) => f.slug !== feature.slug).slice(0, 3);
  const accent = accentClasses[feature.accent];

  return (
    <article>
      {/* hero */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <Halftone className="absolute -right-16 top-0 h-64 w-64 opacity-[0.12]" dot={11} />
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-[1fr_1fr] lg:py-24">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start gap-5"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <Link
                href="/features"
                className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-ink"
              >
                ← Features
              </Link>
              <span className="kicker">{feature.eyebrow}</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-balance text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.96] text-ink"
            >
              {feature.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-lg text-pretty text-lg leading-relaxed text-ink-soft">
              {feature.lead}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button href="/studio" variant="primary" size="lg">
                Try it free <ArrowRight size={16} />
              </Button>
              <Button href="/studio" variant="outline" size="lg">
                Open the Studio
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-panel border-2 border-ink bg-white p-3 shadow-panel-lg"
          >
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={cn("h-2.5 w-2.5 rounded-full border-2 border-ink", accent.bg)} />
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                {feature.short} preview
              </span>
            </div>
            <feature.Art className="h-full w-full" />
          </motion.div>
        </div>
      </section>

      {/* transformation flow */}
      <section className="border-b-2 border-ink bg-paper-deep py-16">
        <div className="container-page">
          <p className="kicker mb-6 text-center">The transformation</p>
          <motion.ol
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
            className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            {feature.flow.map((step, i) => (
              <motion.li key={step} variants={panelIn} className="flex items-center gap-3">
                <div className="flex min-w-[140px] flex-col items-center rounded-panel border-2 border-ink bg-white px-5 py-4 text-center shadow-panel-sm">
                  <span className="font-mono text-[11px] text-ink-faint">0{i + 1}</span>
                  <span className="mt-1 font-display text-base font-extrabold text-ink">
                    {step}
                  </span>
                </div>
                {i < feature.flow.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="mx-auto shrink-0 rotate-90 text-ink sm:rotate-0"
                  />
                )}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* worked example */}
      <section className="py-16 sm:py-24">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inViewOnce}>
            <p className="kicker mb-3">One prompt in</p>
            <div className="rounded-panel border-2 border-ink bg-white p-1.5 shadow-panel">
              <div className="flex items-start gap-2 rounded-xl bg-paper p-4">
                <span className="font-mono text-ink-faint">›</span>
                <p className="font-mono text-[15px] leading-relaxed text-ink">
                  {feature.example.input}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
          >
            <p className="kicker mb-3">
              <CornerDownRight size={13} className="mr-1 inline" /> Everything out
            </p>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {feature.example.outputs.map((o) => (
                <motion.li
                  key={o}
                  variants={panelIn}
                  className="flex items-center gap-2.5 rounded-xl border-2 border-ink bg-white px-3.5 py-3 text-[14px] font-semibold shadow-panel-sm"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-pop-mint">
                    <Check size={13} strokeWidth={3} className="text-white" />
                  </span>
                  {o}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* why it's different */}
      <section className="border-y-2 border-ink bg-paper-deep py-16 sm:py-24">
        <div className="container-page">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {feature.bullets.map((b) => (
              <motion.div
                key={b.title}
                variants={panelIn}
                className="rounded-panel border-2 border-ink bg-white p-6 shadow-panel-sm"
              >
                <h3 className="text-lg font-extrabold text-ink">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{b.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* cross-links */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold text-ink">Keep building</h2>
            <Link href="/features" className="text-sm font-semibold text-ink-soft hover:text-ink">
              All features →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/features/${o.slug}`}
                className="group flex items-center gap-4 rounded-panel border-2 border-ink bg-white p-4 shadow-panel-sm transition-all hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
                  <o.Art className="h-full w-full" />
                </div>
                <div>
                  <p className="font-extrabold text-ink">{o.short}</p>
                  <p className="text-xs text-ink-soft">{o.eyebrow}</p>
                </div>
                <ArrowRight
                  size={18}
                  className="ml-auto text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
