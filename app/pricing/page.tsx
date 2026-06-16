import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCards } from "@/components/sections/pricing-cards";
import { Halftone } from "@/components/comic/halftone";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with two generations. Creator at $5/mo, Pro at $20/mo with commercial rights and team features.",
};

const COMPARE: { row: string; free: string | boolean; creator: string | boolean; pro: string | boolean }[] = [
  { row: "Generations", free: "2 total", creator: "300 / mo", pro: "High limits" },
  { row: "Projects", free: "1", creator: "Unlimited", pro: "Unlimited" },
  { row: "Character library", free: false, creator: true, pro: true },
  { row: "HD export (no watermark)", free: false, creator: true, pro: true },
  { row: "PDF + webtoon export", free: false, creator: true, pro: true },
  { row: "Priority rendering", free: false, creator: false, pro: true },
  { row: "Advanced editor & layers", free: "Basic", creator: "Standard", pro: "Advanced" },
  { row: "Commercial license", free: false, creator: false, pro: true },
  { row: "Team seats & shared assets", free: false, creator: false, pro: true },
];

const FAQ = [
  {
    q: "What counts as a generation?",
    a: "Any single AI render — a character sheet, a scene, a panel, or a page. Editing text and re-arranging panels you already made is always free.",
  },
  {
    q: "What happens after my 2 free generations?",
    a: "Nothing is deleted. Your project stays, fully editable. You just need a paid plan to generate new art.",
  },
  {
    q: "Can I sell comics I make on Comicraft?",
    a: "On the Pro plan, yes — it includes a full commercial license. Free and Creator are for personal and non-commercial use.",
  },
  {
    q: "Do my characters stay consistent across plans?",
    a: "Always. Character identity-locking is core to the product on every plan — the difference is how many panels you can render.",
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-pop-mint">
        <Check size={13} strokeWidth={3} className="text-white" />
      </span>
    );
  if (value === false) return <Minus size={16} className="text-ink-faint" />;
  return <span className="text-[13px] font-semibold text-ink">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink py-16 sm:py-20">
        <Halftone className="absolute -right-10 top-0 h-56 w-56 opacity-[0.1]" dot={11} />
        <div className="container-page">
          <SectionHeading
            as="h1"
            align="center"
            kicker="Pricing"
            title={
              <>
                Pick your <span className="marker">issue.</span>
              </>
            }
            lead="Two free generations, no card. Then plans priced for real creators — from weekend strips to commercial series."
          />
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page">
          <PricingCards />
        </div>
      </section>

      {/* comparison */}
      <section className="border-y-2 border-ink bg-paper-deep py-16 sm:py-20">
        <div className="container-page">
          <h2 className="mb-8 text-center text-3xl font-extrabold">Compare the plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-panel border-2 border-ink bg-white">
              <thead>
                <tr className="border-b-2 border-ink bg-paper">
                  <th className="p-4 text-left font-mono text-xs uppercase tracking-wider text-ink-soft">
                    Feature
                  </th>
                  {["Free", "Creator", "Pro"].map((h) => (
                    <th
                      key={h}
                      className={`p-4 text-center font-display text-base font-extrabold ${
                        h === "Creator" ? "bg-accent/30" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r, i) => (
                  <tr key={r.row} className={i % 2 ? "bg-paper/40" : ""}>
                    <td className="border-t border-hairline p-4 text-[14px] font-semibold text-ink">
                      {r.row}
                    </td>
                    <td className="border-t border-hairline p-4 text-center">
                      <div className="grid place-items-center"><Cell value={r.free} /></div>
                    </td>
                    <td className="border-t border-hairline bg-accent/10 p-4 text-center">
                      <div className="grid place-items-center"><Cell value={r.creator} /></div>
                    </td>
                    <td className="border-t border-hairline p-4 text-center">
                      <div className="grid place-items-center"><Cell value={r.pro} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container-page max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-extrabold">Questions, answered</h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-panel border-2 border-ink bg-white p-5 shadow-panel-sm [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-extrabold text-ink">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-semibold">Still deciding? The first two are on us.</p>
            <Button href="/studio" variant="primary" size="lg">
              Start creating free
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
