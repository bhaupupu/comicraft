"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { showcase, type ShowcaseComic } from "@/lib/showcase";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpeechBubble } from "@/components/comic/speech-bubble";
import { Halftone } from "@/components/comic/halftone";
import { cn } from "@/lib/utils";

/** Literal class maps so Tailwind keeps the accent utilities at build time. */
const ACCENT: Record<string, { chip: string; dot: string }> = {
  "accent-deep": { chip: "bg-accent-deep text-ink", dot: "bg-accent-deep" },
  "pop-blue": { chip: "bg-pop-blue text-white", dot: "bg-pop-blue" },
  pop: { chip: "bg-pop text-white", dot: "bg-pop" },
  "pop-mint": { chip: "bg-pop-mint text-white", dot: "bg-pop-mint" },
  "pop-violet": { chip: "bg-pop-violet text-white", dot: "bg-pop-violet" },
  ink: { chip: "bg-ink text-paper", dot: "bg-ink" },
};

const BUBBLE_POS: Record<string, string> = {
  tl: "left-3 top-3",
  tr: "right-3 top-3",
  bl: "left-3 bottom-16",
  br: "right-3 bottom-16",
};

export function Showcase() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(showcase[0].id);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(false);

  const comic = showcase.find((c) => c.id === activeId) ?? showcase[0];
  // page 0 is the cover; interior pages follow
  const total = comic.pages.length + 1;
  const accent = ACCENT[comic.accent] ?? ACCENT.pop;

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      setPage((p) => Math.min(total - 1, Math.max(0, p + delta)));
    },
    [total],
  );

  const pick = (c: ShowcaseComic) => {
    setActiveId(c.id);
    setDir(1);
    setPage(0);
  };

  // keyboard paging
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom) {
        if (e.key === "Escape") setZoom(false);
        return;
      }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, zoom]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) go(1);
    else if (info.offset.x > 80) go(-1);
  };

  const isCover = page === 0;
  const interior = comic.pages[page - 1];
  const src = isCover ? comic.cover : interior.src;

  return (
    <section
      id="showcase"
      className="relative overflow-hidden border-y-2 border-ink bg-paper-deep py-20 sm:py-28"
    >
      <Halftone className="absolute right-0 top-10 h-72 w-72 opacity-[0.08]" dot={12} />
      <div className="container-page">
        <SectionHeading
          align="center"
          kicker="See what's possible"
          title={
            <>
              Real stories, <span className="marker">made to be read.</span>
            </>
          }
          lead="Flip through comics built in the studio — across every genre. This is the kind of thing you'll be making by tonight."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* contents / genre picker */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="kicker mb-3">Pick a genre</p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {showcase.map((c) => {
                const on = c.id === activeId;
                const ac = ACCENT[c.accent] ?? ACCENT.pop;
                return (
                  <button
                    key={c.id}
                    onClick={() => pick(c)}
                    aria-pressed={on}
                    className={cn(
                      "group flex min-w-[220px] shrink-0 items-center gap-3 rounded-panel border-2 border-ink p-2.5 text-left transition-all lg:min-w-0",
                      on
                        ? "bg-white shadow-panel"
                        : "bg-white/50 hover:bg-white hover:shadow-panel-sm",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.cover}
                      alt=""
                      className="h-14 w-11 shrink-0 rounded-md border-2 border-ink object-cover"
                      loading="lazy"
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", ac.dot)} />
                        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                          {c.genre}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate font-display text-[15px] font-extrabold leading-tight text-ink">
                        {c.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* reader */}
          <div className="flex flex-col items-center">
            <div className="perspective w-full max-w-md">
              <div className="relative aspect-[3/4] w-full">
                <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                  <motion.div
                    key={`${comic.id}-${page}`}
                    custom={dir}
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { rotateY: dir > 0 ? 38 : -38, opacity: 0, x: dir > 0 ? 60 : -60 }
                    }
                    animate={{ rotateY: 0, opacity: 1, x: 0 }}
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : { rotateY: dir > 0 ? -38 : 38, opacity: 0, x: dir > 0 ? -60 : 60 }
                    }
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    drag={reduce ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={onDragEnd}
                    className="preserve-3d page-sheet absolute inset-0 cursor-grab overflow-hidden rounded-panel border-2 border-ink active:cursor-grabbing"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={isCover ? `${comic.title} cover` : `${comic.title} page ${page}`}
                      className="pointer-events-none h-full w-full object-cover"
                      draggable={false}
                      loading="lazy"
                    />

                    {/* cover plate */}
                    {isCover && (
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/20 to-transparent p-5 text-paper">
                        <span
                          className={cn(
                            "mb-2 w-fit rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                            accent.chip,
                          )}
                        >
                          {comic.genre}
                        </span>
                        <h3 className="font-display text-3xl font-extrabold leading-[0.95]">
                          {comic.title}
                        </h3>
                        <p className="mt-1.5 max-w-[88%] font-comic text-sm font-bold text-paper/90">
                          {comic.tagline}
                        </p>
                      </div>
                    )}

                    {/* interior: caption + bubbles */}
                    {!isCover && interior && (
                      <>
                        {interior.bubbles?.map((b, i) => (
                          <div
                            key={i}
                            className={cn("absolute max-w-[62%]", BUBBLE_POS[b.at])}
                          >
                            <SpeechBubble
                              tone={b.tone ?? "default"}
                              tail={b.at === "tl" || b.at === "tr" ? "bl" : "tl"}
                              className="!text-[12px] shadow-panel-sm"
                            >
                              {b.text}
                            </SpeechBubble>
                          </div>
                        ))}
                        {interior.caption && (
                          <p className="absolute inset-x-3 bottom-3 rounded-md border-2 border-ink bg-accent px-3 py-1.5 font-comic text-[12px] font-bold leading-tight text-ink shadow-panel-sm">
                            {interior.caption}
                          </p>
                        )}
                      </>
                    )}

                    {/* zoom affordance */}
                    <button
                      onClick={() => setZoom(true)}
                      aria-label="Zoom this page"
                      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-white/90 text-ink opacity-0 transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100 md:opacity-100"
                    >
                      <ZoomIn size={16} />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* controls */}
            <div className="mt-5 flex w-full max-w-md items-center justify-between gap-3">
              <button
                onClick={() => go(-1)}
                disabled={page === 0}
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white shadow-panel-sm transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDir(i > page ? 1 : -1);
                      setPage(i);
                    }}
                    aria-label={`Go to page ${i + 1}`}
                    className={cn(
                      "h-2.5 rounded-full border-2 border-ink transition-all",
                      i === page ? "w-7 bg-ink" : "w-2.5 bg-white hover:bg-paper-deep",
                    )}
                  />
                ))}
              </div>

              <button
                onClick={() => go(1)}
                disabled={page === total - 1}
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-ink text-paper shadow-panel-sm transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              {isCover ? "Cover" : `Page ${page} of ${total - 1}`} · swipe, tap dots, or use ← →
            </p>
          </div>
        </div>
      </div>

      {/* zoom lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/80 p-6 backdrop-blur-sm"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={src}
              alt=""
              className="max-h-[88vh] max-w-full rounded-panel border-2 border-ink shadow-panel-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setZoom(false)}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border-2 border-paper bg-ink text-paper"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
