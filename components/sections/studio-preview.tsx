"use client";

import { motion } from "framer-motion";
import {
  PanelLeft,
  Sparkles,
  Layers,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PanelGridArt, CharacterSheetArt, SceneArt } from "@/components/comic/process-art";
import { fadeUp, inViewOnce } from "@/lib/motion";

const CALLOUTS = [
  { Icon: PanelLeft, label: "Story · Characters · Scenes · Panels · Dialogue · Assets" },
  { Icon: Layers, label: "Non-destructive layers" },
  { Icon: Wand2, label: "AI assistant in the margin" },
];

export function StudioPreview() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          align="center"
          kicker="The studio"
          title={
            <>
              Figma-grade canvas, <span className="marker">comic-native</span> tools.
            </>
          }
          lead="The Studio is where generation becomes craft. Layers, panels, a character library and an AI co-pilot — all on one professional canvas."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-lg">
            {/* top bar */}
            <div className="flex items-center gap-3 border-b-2 border-ink bg-paper-deep px-4 py-2.5">
              <span className="font-display text-sm font-extrabold">Detective Cat · Ch.1</span>
              <span className="rounded-md border border-ink/20 bg-white px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                Page 3 / 12
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-2.5 py-1 text-xs font-bold">
                <Sparkles size={12} /> Export
              </span>
            </div>

            <div className="grid grid-cols-[44px_1fr] sm:grid-cols-[160px_1fr_200px]">
              {/* left rail */}
              <div className="flex flex-col gap-1 border-r-2 border-ink bg-paper p-2">
                {["Story", "Characters", "Scenes", "Panels", "Dialogue", "Assets"].map(
                  (t, i) => (
                    <div
                      key={t}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] ${
                        i === 3
                          ? "border-2 border-ink bg-accent font-bold"
                          : "text-ink-soft"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-sm bg-ink/40" />
                      <span className="hidden sm:inline">{t}</span>
                    </div>
                  ),
                )}
              </div>

              {/* canvas */}
              <div className="relative bg-paper-deep p-4">
                <div className="mx-auto grid max-w-sm grid-cols-2 gap-2.5 rounded-xl border-2 border-ink bg-white p-2.5 shadow-panel-sm">
                  <div className="col-span-2 overflow-hidden rounded-lg border-2 border-ink">
                    <SceneArt className="h-28 w-full" />
                  </div>
                  <div className="overflow-hidden rounded-lg border-2 border-ink">
                    <CharacterSheetArt className="h-24 w-full" />
                  </div>
                  <div className="overflow-hidden rounded-lg border-2 border-dashed border-ink/50 bg-paper">
                    <PanelGridArt className="h-24 w-full opacity-70" />
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-1.5">
                  {["−", "100%", "+"].map((z) => (
                    <span
                      key={z}
                      className="nums grid h-7 min-w-7 place-items-center rounded-md border-2 border-ink bg-white px-2 font-mono text-[11px]"
                    >
                      {z}
                    </span>
                  ))}
                </div>
              </div>

              {/* right rail */}
              <div className="hidden flex-col border-l-2 border-ink bg-paper p-3 sm:flex">
                <p className="kicker mb-2">AI assistant</p>
                <div className="rounded-lg border-2 border-ink bg-white p-2.5 text-[12px] leading-snug text-ink-soft">
                  Make panel 2 a low-angle hero shot, rain heavier.
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {["Generate next panel", "Add speech bubble", "Change art style"].map(
                    (s) => (
                      <span
                        key={s}
                        className="rounded-md border border-ink/15 bg-white px-2.5 py-1.5 text-[12px] text-ink-soft"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
                <p className="kicker mb-2 mt-4">Layers</p>
                <div className="flex flex-col gap-1 text-[12px] text-ink-soft">
                  {["Lettering", "Characters", "Background"].map((l, i) => (
                    <span
                      key={l}
                      className={`rounded px-2 py-1 ${i === 1 ? "bg-accent/40 font-semibold text-ink" : ""}`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {CALLOUTS.map((c) => (
                <li
                  key={c.label}
                  className="inline-flex items-center gap-2 text-sm text-ink-soft"
                >
                  <c.Icon size={16} className="text-ink" />
                  {c.label}
                </li>
              ))}
            </ul>
            <Button href="/studio" variant="primary" size="lg" className="shrink-0">
              Open the Studio <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
