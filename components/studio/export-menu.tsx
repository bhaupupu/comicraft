"use client";

import { useState } from "react";
import { Download, FileImage, FileText, ScrollText, Loader2, ChevronDown } from "lucide-react";
import { exportComic, type ExportKind, type ExportPanel } from "@/lib/export/comic-export";
import { cn } from "@/lib/utils";

const OPTIONS: { kind: ExportKind; label: string; sub: string; Icon: typeof FileImage }[] = [
  { kind: "png", label: "Page (PNG)", sub: "Print-style page image", Icon: FileImage },
  { kind: "webtoon", label: "Webtoon strip", sub: "Tall vertical scroll", Icon: ScrollText },
  { kind: "pdf", label: "PDF", sub: "Print-ready document", Icon: FileText },
];

export function ExportMenu({
  title,
  panels,
  watermark,
}: {
  title: string;
  panels: ExportPanel[];
  watermark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(kind: ExportKind) {
    setBusy(kind);
    setError(null);
    try {
      await exportComic(kind, { title, panels, watermark });
      setOpen(false);
    } catch {
      setError("Export failed — try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-3 py-1 text-xs font-bold shadow-panel-sm transition-transform hover:-translate-y-px"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download size={12} /> Export
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close export menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel"
          >
            {OPTIONS.map((o) => (
              <button
                key={o.kind}
                role="menuitem"
                disabled={busy !== null}
                onClick={() => run(o.kind)}
                className="flex w-full items-center gap-3 border-b border-hairline px-3.5 py-2.5 text-left last:border-b-0 hover:bg-paper disabled:opacity-50"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-ink bg-paper">
                  {busy === o.kind ? <Loader2 size={15} className="animate-spin" /> : <o.Icon size={15} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-ink">{o.label}</span>
                  <span className="block text-[11px] text-ink-faint">{o.sub}</span>
                </span>
              </button>
            ))}
            {watermark && (
              <p className="bg-paper-deep px-3.5 py-2 text-[11px] text-ink-soft">
                Free exports are watermarked. Upgrade to remove it.
              </p>
            )}
            {error && <p className="px-3.5 py-2 text-[11px] font-medium text-pop">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}
