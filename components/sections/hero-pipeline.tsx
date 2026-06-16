"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import {
  CharacterSheetArt,
  DialogueArt,
  PanelGridArt,
  SceneArt,
  StoryThreadArt,
} from "@/components/comic/process-art";
import { popSpring } from "@/lib/motion";

const PROMPT = "A detective cat solving crimes in neon-lit Tokyo";

const STAGES = [
  { key: "story", label: "Story written", art: StoryThreadArt },
  { key: "characters", label: "Cast designed", art: CharacterSheetArt },
  { key: "scenes", label: "Scenes built", art: SceneArt },
  { key: "panels", label: "Panels laid out", art: PanelGridArt },
  { key: "dialogue", label: "Dialogue lettered", art: DialogueArt },
] as const;

/**
 * Self-running demo of the creation pipeline:
 * types a prompt → lights up each generation stage → assembles a comic page → loops.
 * Honors prefers-reduced-motion by rendering the finished state, no loop.
 */
export function HeroPipeline() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? PROMPT.length : 0);
  const [stage, setStage] = useState(reduce ? STAGES.length : -1);
  const [, force] = useReducer((n) => n + 1, 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduce) return;
    let mounted = true;

    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    function run() {
      if (!mounted) return;
      setTyped(0);
      setStage(-1);

      // typewriter
      for (let i = 1; i <= PROMPT.length; i++) {
        timers.current.push(setTimeout(() => mounted && setTyped(i), 38 * i));
      }
      const typeDone = 38 * PROMPT.length + 450;

      // stages
      STAGES.forEach((_, idx) => {
        timers.current.push(
          setTimeout(() => mounted && setStage(idx), typeDone + idx * 780),
        );
      });

      // finished, hold, then loop
      const finished = typeDone + STAGES.length * 780 + 1900;
      timers.current.push(
        setTimeout(() => {
          if (!mounted) return;
          clearAll();
          run();
          force();
        }, finished),
      );
    }

    run();
    return () => {
      mounted = false;
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const done = stage >= STAGES.length - 1;

  return (
    <div className="relative w-full select-none">
      {/* browser chrome card */}
      <div className="overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-lg">
        <div className="flex items-center gap-2 border-b-2 border-ink bg-paper-deep px-4 py-2.5">
          <span className="h-3 w-3 rounded-full border border-ink/40 bg-pop" />
          <span className="h-3 w-3 rounded-full border border-ink/40 bg-accent" />
          <span className="h-3 w-3 rounded-full border border-ink/40 bg-pop-mint" />
          <span className="ml-2 font-mono text-xs text-ink-soft">
            comicraft.app / new
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase">
            <Sparkles size={11} /> Live
          </span>
        </div>

        <div className="grid gap-0 sm:grid-cols-[1fr_1.05fr]">
          {/* left: prompt + checklist */}
          <div className="border-b-2 border-ink p-4 sm:border-b-0 sm:border-r-2">
            <p className="kicker mb-2">Prompt</p>
            <div className="min-h-[64px] rounded-xl border-2 border-ink bg-paper px-3 py-2.5 font-mono text-[13px] leading-relaxed text-ink">
              {PROMPT.slice(0, typed)}
              <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-caret-blink bg-ink align-middle" />
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {STAGES.map((s, idx) => {
                const active = stage >= idx;
                return (
                  <li
                    key={s.key}
                    className="flex items-center gap-2.5 text-[13px]"
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        backgroundColor: active ? "#13B07C" : "#FFFFFF",
                        scale: active ? 1 : 0.9,
                      }}
                      transition={popSpring}
                      className="grid h-5 w-5 place-items-center rounded-full border-2 border-ink"
                    >
                      {active && <Check size={12} strokeWidth={3} color="#fff" />}
                    </motion.span>
                    <span
                      className={
                        active ? "font-semibold text-ink" : "text-ink-faint"
                      }
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full border border-ink/30 bg-paper">
                <motion.div
                  className="h-full bg-ink"
                  animate={{
                    width: `${((stage + 1) / STAGES.length) * 100}%`,
                  }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                />
              </div>
              <span className="nums font-mono text-[11px] font-bold text-ink-soft">
                {Math.max(0, Math.round(((stage + 1) / STAGES.length) * 100))}%
              </span>
            </div>
          </div>

          {/* right: assembling comic page */}
          <div className="relative bg-paper p-4">
            <p className="kicker mb-2">Comic page</p>
            <div className="grid aspect-[3/4] grid-cols-2 grid-rows-3 gap-2 rounded-xl border-2 border-ink bg-white p-2">
              {STAGES.map((s, idx) => {
                const Art = s.art;
                const visible = stage >= idx;
                // first panel spans both columns for a "splash" feel
                const span = idx === 0 ? "col-span-2" : "";
                return (
                  <div
                    key={s.key}
                    className={`relative overflow-hidden rounded-lg border-2 border-ink ${span}`}
                  >
                    <AnimatePresence>
                      {visible ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={popSpring}
                          className="absolute inset-0 grid place-items-center bg-white"
                        >
                          <Art className="h-full w-full" />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-paper-deep">
                          <span className="halftone h-full w-full opacity-20" />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: -8 }}
                  exit={{ opacity: 0 }}
                  transition={popSpring}
                  className="absolute -right-3 -top-3 grid h-16 w-16 place-items-center rounded-full border-2 border-ink bg-accent text-center font-display text-[11px] font-extrabold uppercase leading-none shadow-panel-sm"
                >
                  Done!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
