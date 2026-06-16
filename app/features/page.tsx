import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { features } from "@/lib/features-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Halftone } from "@/components/comic/halftone";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Six tools, one pipeline — story, characters, scenes, panels, dialogue and the comic editor.",
};

export default function FeaturesIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink py-16 sm:py-20">
        <Halftone className="absolute -left-12 top-0 h-56 w-56 opacity-[0.1]" dot={11} />
        <div className="container-page">
          <SectionHeading
            as="h1"
            kicker="Features"
            title={
              <>
                Everything it takes to make a comic — <span className="marker">nothing it takes to read one.</span>
              </>
            }
            lead="Each tool is built for one job in the pipeline, and built to hand off cleanly to the next."
          />
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page flex flex-col gap-6">
          {features.map((f, i) => (
            <Link
              key={f.slug}
              href={`/features/${f.slug}`}
              className="group grid items-center gap-6 rounded-panel border-2 border-ink bg-white p-5 shadow-panel-sm transition-all hover:-translate-y-1 hover:shadow-panel sm:grid-cols-[260px_1fr] sm:p-6"
            >
              <div className="order-1 overflow-hidden rounded-xl border-2 border-ink bg-paper sm:order-none">
                <f.Art className="h-44 w-full sm:h-40" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
                  <span className="kicker">{f.eyebrow}</span>
                </div>
                <h2 className="text-2xl font-extrabold leading-tight text-ink">
                  {f.headline}
                </h2>
                <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                  {f.lead}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {f.flow.map((s, idx) => (
                    <span key={s} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
                      {s}
                      {idx < f.flow.length - 1 && <span className="text-ink-faint">→</span>}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    Explore <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="container-page mt-14 flex flex-col items-center gap-4 text-center">
          <h2 className="text-balance text-3xl font-extrabold">Ready to make your first one?</h2>
          <Button href="/studio" variant="primary" size="lg">
            Start creating free <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </>
  );
}
