"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Check, Plus } from "lucide-react";
import type { ProgressEvent } from "@/lib/ai/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "full" | "next-page";

function orderFor(mode: Mode): string[] {
  return mode === "next-page" ? ["story", "panels"] : ["story", "characters", "panels"];
}
function labelFor(key: string, mode: Mode): string {
  if (key === "story") return mode === "next-page" ? "Plotting the page" : "Writing the story";
  if (key === "characters") return "Designing the cast";
  return "Rendering the page";
}

type StageState = { status: "pending" | "active" | "done"; current?: number; total?: number; label?: string };
type Phase = "idle" | "running" | "done" | "error";

export function GenerateStream({
  projectId,
  label = "Generate my comic",
  mode = "full",
  compact = false,
}: {
  projectId: string;
  label?: string;
  mode?: Mode;
  compact?: boolean;
}) {
  const router = useRouter();
  const order = orderFor(mode);
  const init = (): Record<string, StageState> =>
    Object.fromEntries(order.map((k) => [k, { status: "pending" as const }]));

  const [phase, setPhase] = useState<Phase>("idle");
  const [stages, setStages] = useState<Record<string, StageState>>(init);
  const [error, setError] = useState<string | null>(null);

  function handle(e: ProgressEvent) {
    if (e.type === "stage") {
      setStages((prev) => {
        const next = { ...prev };
        const idx = order.indexOf(e.key);
        order.forEach((k, i) => {
          if (i < idx) next[k] = { ...next[k], status: "done" };
        });
        next[e.key] = { status: "active", total: e.total, current: 0 };
        return next;
      });
    } else if (e.type === "tick") {
      setStages((prev) => ({
        ...prev,
        [e.key]: { ...prev[e.key], status: "active", current: e.current, total: e.total, label: e.label },
      }));
    } else if (e.type === "done") {
      setStages((prev) => {
        const next = { ...prev };
        order.forEach((k) => (next[k] = { ...next[k], status: "done" }));
        return next;
      });
      setPhase("done");
      setTimeout(() => router.refresh(), 1000);
    } else if (e.type === "error") {
      setError(e.message);
      setPhase("error");
    }
  }

  async function run() {
    setError(null);
    setStages(init());
    setPhase("running");
    try {
      const url = `/api/projects/${projectId}/generate${mode === "next-page" ? "?mode=next-page" : ""}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok || !res.body) {
        setError(res.status === 401 ? "Your session expired — please log in again." : `Request failed (${res.status}).`);
        setPhase("error");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n\n")) >= 0) {
          const chunk = buf.slice(0, nl);
          buf = buf.slice(nl + 2);
          const line = chunk.split("\n").find((l) => l.startsWith("data:"));
          if (line) handle(JSON.parse(line.slice(5).trim()) as ProgressEvent);
        }
      }
    } catch {
      setError("Connection interrupted. Your work may have saved — refresh to check.");
      setPhase("error");
    }
  }

  if (phase === "idle") {
    if (compact) {
      return (
        <button
          onClick={run}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-ink/40 px-3 py-2 text-[12px] font-bold text-ink-soft transition-colors hover:border-ink hover:bg-accent hover:text-ink"
        >
          <Plus size={13} /> Add page
        </button>
      );
    }
    return (
      <Button variant="primary" size="lg" onClick={run}>
        <Sparkles size={16} /> {label}
      </Button>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="max-w-xs text-center text-xs font-medium text-pop">{error}</p>
        <Button variant="outline" size={compact ? "sm" : "md"} onClick={run}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-panel border-2 border-ink bg-white text-left shadow-panel-sm",
        compact ? "p-3" : "mx-auto w-full max-w-sm p-5",
      )}
    >
      <p className="kicker mb-3 flex items-center gap-1.5">
        <Loader2 size={12} className={phase === "running" ? "animate-spin" : ""} />
        {phase === "done" ? "Finished — loading…" : compact ? "Adding a page…" : "Generating your comic…"}
      </p>
      <ul className="flex flex-col gap-2.5">
        {order.map((k) => {
          const s = stages[k];
          const showCount = k === "panels" || k === "characters" ? (s.total ? `${s.current ?? 0}/${s.total}` : null) : null;
          return (
            <li key={k} className="flex items-center gap-3 text-[13px]">
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink",
                  s.status === "done" ? "bg-pop-mint" : s.status === "active" ? "bg-accent" : "bg-white",
                )}
              >
                {s.status === "done" ? (
                  <Check size={13} strokeWidth={3} className="text-white" />
                ) : s.status === "active" ? (
                  <Loader2 size={13} className="animate-spin text-ink" />
                ) : null}
              </span>
              <span className={cn("flex-1 font-semibold", s.status === "pending" ? "text-ink-faint" : "text-ink")}>
                {labelFor(k, mode)}
                {s.label && s.status === "active" ? <span className="font-normal text-ink-soft"> · {s.label}</span> : null}
              </span>
              {showCount && <span className="nums font-mono text-xs text-ink-soft">{showCount}</span>}
            </li>
          );
        })}
      </ul>
      {phase === "done" && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-sm font-semibold text-ink">
          ✨ Done.
        </motion.p>
      )}
    </div>
  );
}
