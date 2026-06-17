"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  Reorder,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Download,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Users,
  Wand2,
  X,
} from "lucide-react";
import type { EditorPage } from "@/lib/data/projects";
import type { ProgressEvent } from "@/lib/ai/progress";
import {
  STUDIO_STEPS,
  STORY_STARTERS,
  AI_STORY_ASSISTS,
  VISUAL_STYLES,
  PRODUCTION_STAGES,
  DEMO_CAST,
  DEMO_BOARD,
  type CastMember,
  type StudioStepKey,
  type BoardPage,
  type BoardPanel,
} from "@/lib/studio-data";
import { ExportMenu } from "@/components/studio/export-menu";
import { SpeechBubble } from "@/components/comic/speech-bubble";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  projectId: string;
  projectName: string;
  premise: string;
  generated: boolean;
  pages: EditorPage[];
  characters: { name: string; role: string | null; imageUrl: string | null }[];
  story: { logline?: string; theme?: string; style?: string } | null;
  watermark: boolean;
  budgetRemaining: number;
  providerLive: boolean;
  placeholderArt: boolean;
};

const STORY_HELPERS: Record<string, (s: string) => string> = {
  "Expand this idea": (s) =>
    `${s.trim()}\n\nAct I — We meet our lead in their ordinary world, and an inciting event upends it.\nAct II — The stakes rise; allies and an antagonist emerge; the lead is tested and changed.\nAct III — A final confrontation forces a choice that resolves what the story was really about.`,
  "Improve the plot": (s) =>
    `${s.trim()}\n\n• What does the lead want, and what do they need (often different)?\n• What's the worst thing that could happen — and then make it happen.\n• Give the antagonist a reason they believe they're right.`,
  "Suggest a twist": (s) =>
    `${s.trim()}\n\nTwist idea: the thing the lead has been fighting to protect turns out to be the source of the danger — and the "enemy" was trying to warn them all along.`,
};

export function StudioJourney(props: Props) {
  const { projectId, projectName, premise, generated, pages } = props;
  const router = useRouter();

  const initialCast: CastMember[] = useMemo(() => {
    if (props.characters.length) {
      return props.characters.map((c, i) => ({
        id: `c${i}`,
        name: c.name,
        role: c.role ?? "Cast",
        portrait: c.imageUrl ?? "",
        personality: "Defined in your story.",
        background: "Generated with your comic.",
        appearance: "Kept on-model across every panel.",
        goal: "Drives the story forward.",
        relationship: "Part of the ensemble.",
        accent: ["pop", "pop-blue", "ink", "accent-deep"][i % 4],
      }));
    }
    return DEMO_CAST;
  }, [props.characters]);

  const initialBoard: BoardPage[] = useMemo(() => {
    if (generated && pages.length) {
      return pages.map((pg, i) => ({
        id: pg.id,
        title: `Page ${i + 1}`,
        panels: pg.panels.map((p) => ({
          id: p.id,
          shot: p.label,
          dialogue: p.dialogue[0]?.text,
        })),
      }));
    }
    return DEMO_BOARD;
  }, [generated, pages]);

  const [step, setStep] = useState<StudioStepKey>(generated ? "storyboard" : "story");
  const [reader, setReader] = useState(false);
  const [storyText, setStoryText] = useState(props.story?.logline || premise);
  const [styleId, setStyleId] = useState(VISUAL_STYLES[0].id);
  const [cast, setCast] = useState<CastMember[]>(initialCast);
  const [board, setBoard] = useState<BoardPage[]>(initialBoard);

  const stepIndex = STUDIO_STEPS.findIndex((s) => s.key === step);
  const goStep = (i: number) =>
    setStep(STUDIO_STEPS[Math.min(STUDIO_STEPS.length - 1, Math.max(0, i))].key);

  return (
    <div className="container-page py-6">
      <a
        href="/studio"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ChevronLeft size={15} /> Back to your bookshelf
      </a>

      {reader ? (
        <StudioReader
          projectName={projectName}
          pages={pages}
          watermark={props.watermark}
          onClose={() => setReader(false)}
        />
      ) : (
        <>
          {/* journey stepper */}
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-sm">
            <div className="flex items-center justify-between gap-2 border-b-2 border-ink bg-paper-deep px-4 py-2.5">
              <span className="font-display text-sm font-extrabold">{projectName}</span>
              {generated && (
                <button
                  onClick={() => setReader(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-3 py-1 text-xs font-bold shadow-panel-sm transition-transform hover:-translate-y-0.5"
                >
                  <BookOpen size={13} /> Read your comic
                </button>
              )}
            </div>
            <div className="flex items-stretch gap-1 overflow-x-auto p-2 no-scrollbar">
              {STUDIO_STEPS.map((s, i) => {
                const active = s.key === step;
                const done = i < stepIndex;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStep(s.key)}
                    className={cn(
                      "flex min-w-[150px] flex-1 items-center gap-2.5 rounded-lg border-2 px-3 py-2 text-left transition-all",
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-transparent hover:bg-paper-deep",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-sm font-extrabold",
                        active ? "bg-accent text-ink" : done ? "bg-pop-mint text-white" : "bg-white text-ink",
                      )}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : s.n}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold leading-tight">
                        {s.label}
                      </span>
                      <span
                        className={cn(
                          "block truncate text-[11px]",
                          active ? "text-paper/70" : "text-ink-faint",
                        )}
                      >
                        {s.blurb}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* step body */}
          <div className="mt-6 min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {step === "story" && (
                  <StoryStep value={storyText} onChange={setStoryText} />
                )}
                {step === "cast" && (
                  <CastStep cast={cast} setCast={setCast} />
                )}
                {step === "style" && (
                  <StyleStep styleId={styleId} setStyleId={setStyleId} />
                )}
                {step === "storyboard" && (
                  <StoryboardStep board={board} setBoard={setBoard} />
                )}
                {step === "production" && (
                  <ProductionStep
                    projectId={projectId}
                    generated={generated}
                    providerLive={props.providerLive}
                    budgetRemaining={props.budgetRemaining}
                    placeholderArt={props.placeholderArt}
                    onDone={() => {
                      router.refresh();
                      setReader(true);
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* step nav */}
          {step !== "production" && (
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                size="md"
                onClick={() => goStep(stepIndex - 1)}
                className={stepIndex === 0 ? "invisible" : ""}
              >
                <ArrowLeft size={16} /> {STUDIO_STEPS[Math.max(0, stepIndex - 1)].label}
              </Button>
              <Button variant="primary" size="md" onClick={() => goStep(stepIndex + 1)}>
                Next · {STUDIO_STEPS[Math.min(STUDIO_STEPS.length - 1, stepIndex + 1)].label}
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ----------------------------- Step 1 · Story ----------------------------- */
function StoryStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  function assist(label: string) {
    const fn = STORY_HELPERS[label];
    if (!fn) return;
    setBusy(label);
    setTimeout(() => {
      onChange(fn(value || "A story about…"));
      setBusy(null);
    }, 750);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="rounded-panel border-2 border-ink bg-white p-6 shadow-panel">
        <h2 className="font-display text-2xl font-extrabold">
          What story do you want to tell?
        </h2>
        <p className="mt-1 text-ink-soft">
          Write it the way you&apos;d tell a friend. One line or one page — we&apos;ll
          take it from here.
        </p>
        <div className="relative mt-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={9}
            placeholder="A retired samurai fox opens a tea shop, until the past walks back through the door…"
            className="w-full resize-y rounded-xl border-2 border-ink bg-paper p-4 font-comic text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:shadow-panel-sm"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="kicker flex items-center gap-1.5">
            <Sparkles size={12} /> AI help
          </span>
          {AI_STORY_ASSISTS.map((a) => (
            <button
              key={a.label}
              onClick={() => assist(a.label)}
              disabled={!!busy}
              title={a.hint}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 text-[13px] font-semibold transition-colors hover:bg-accent disabled:opacity-50"
            >
              {busy === a.label ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Wand2 size={13} />
              )}
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-panel border-2 border-ink bg-paper-deep p-4">
        <p className="kicker mb-3">Need a spark?</p>
        <div className="flex flex-col gap-2.5">
          {STORY_STARTERS.map((s) => (
            <button
              key={s.title}
              onClick={() => onChange(s.line)}
              className="group rounded-xl border-2 border-ink bg-white p-3 text-left shadow-panel-sm transition-all hover:-translate-y-0.5 hover:shadow-panel"
            >
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                {s.genre}
              </span>
              <span className="mt-0.5 block font-display text-sm font-extrabold text-ink">
                {s.title}
              </span>
              <span className="mt-1 block text-[12px] leading-snug text-ink-soft">
                {s.line}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Step 2 · Character Bible ------------------------ */
function CastStep({
  cast,
  setCast,
}: {
  cast: CastMember[];
  setCast: (c: CastMember[]) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [regen, setRegen] = useState<string | null>(null);

  const update = (id: string, patch: Partial<CastMember>) =>
    setCast(cast.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const remove = (id: string) => setCast(cast.filter((c) => c.id !== id));
  const add = () =>
    setCast([
      ...cast,
      {
        id: `n${Date.now()}`,
        name: "New character",
        role: "Cast",
        portrait: "",
        personality: "Describe their personality…",
        background: "Where do they come from?",
        appearance: "How do they look?",
        goal: "What do they want?",
        relationship: "How do they connect to the others?",
        accent: "accent-deep",
      },
    ]);
  const regenerate = (id: string) => {
    setRegen(id);
    setTimeout(() => setRegen(null), 1100);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Your character bible</h2>
          <p className="text-ink-soft">
            The cast of your story — edit anyone, add anyone. They&apos;ll stay
            on-model across every panel.
          </p>
        </div>
        <Button variant="accent" size="md" onClick={add}>
          <Plus size={16} /> Add character
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cast.map((c) => {
          const isEditing = editing === c.id;
          return (
            <motion.div
              key={c.id}
              layout
              whileHover={{ y: -4 }}
              className="group flex flex-col overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-sm transition-shadow hover:shadow-panel"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink bg-paper-deep">
                {c.portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.portrait}
                    alt={c.name}
                    className={cn(
                      "h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105",
                      regen === c.id && "blur-sm",
                    )}
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <Users size={40} className="text-ink-faint" />
                  </div>
                )}
                {regen === c.id && (
                  <div className="absolute inset-0 grid place-items-center bg-paper/60">
                    <Loader2 className="animate-spin text-ink" />
                  </div>
                )}
                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-full border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase",
                    c.accent === "ink" ? "bg-ink text-paper" : "bg-white text-ink",
                  )}
                >
                  {c.role}
                </span>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconChip label="Regenerate" onClick={() => regenerate(c.id)}>
                    <RefreshCw size={13} />
                  </IconChip>
                  <IconChip
                    label="Edit"
                    onClick={() => setEditing(isEditing ? null : c.id)}
                  >
                    <Pencil size={13} />
                  </IconChip>
                  <IconChip label="Remove" onClick={() => remove(c.id)}>
                    <Trash2 size={13} />
                  </IconChip>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                {isEditing ? (
                  <input
                    value={c.name}
                    onChange={(e) => update(c.id, { name: e.target.value })}
                    className="w-full rounded-md border-2 border-ink px-2 py-1 font-display text-lg font-extrabold outline-none"
                  />
                ) : (
                  <h3 className="font-display text-lg font-extrabold text-ink">
                    {c.name}
                  </h3>
                )}

                <dl className="mt-2 space-y-1.5 text-[12.5px] leading-snug">
                  <Field
                    label="Personality"
                    value={c.personality}
                    editing={isEditing}
                    onChange={(v) => update(c.id, { personality: v })}
                  />
                  <Field
                    label="Goal"
                    value={c.goal}
                    editing={isEditing}
                    onChange={(v) => update(c.id, { goal: v })}
                  />
                  {!isEditing && (
                    <>
                      <p className="text-ink-soft">
                        <span className="font-bold text-ink">Background:</span>{" "}
                        {c.background}
                      </p>
                      <p className="text-ink-soft">
                        <span className="font-bold text-ink">Looks:</span>{" "}
                        {c.appearance}
                      </p>
                      <p className="text-ink-soft">
                        <span className="font-bold text-ink">Ties:</span>{" "}
                        {c.relationship}
                      </p>
                    </>
                  )}
                </dl>

                {isEditing && (
                  <button
                    onClick={() => setEditing(null)}
                    className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full border-2 border-ink bg-pop-mint px-3 py-1 text-xs font-bold text-white"
                  >
                    <Check size={13} /> Done
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  if (editing) {
    return (
      <label className="block">
        <span className="font-mono text-[10px] uppercase text-ink-faint">{label}</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="mt-0.5 w-full resize-none rounded-md border-2 border-ink px-2 py-1 text-[12.5px] outline-none"
        />
      </label>
    );
  }
  return (
    <p className="text-ink-soft">
      <span className="font-bold text-ink">{label}:</span> {value}
    </p>
  );
}

function IconChip({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-white text-ink transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}

/* -------------------------- Step 3 · Visual Style ------------------------- */
function StyleStep({
  styleId,
  setStyleId,
}: {
  styleId: string;
  setStyleId: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl font-extrabold">Choose your look</h2>
        <p className="text-ink-soft">
          Tap a style to see your whole comic drawn that way. You can change it
          anytime.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {VISUAL_STYLES.map((s) => {
          const on = s.id === styleId;
          return (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              aria-pressed={on}
              className={cn(
                "group relative overflow-hidden rounded-panel border-2 text-left transition-all",
                on
                  ? "border-pop shadow-panel ring-2 ring-pop/30"
                  : "border-ink shadow-panel-sm hover:-translate-y-1 hover:shadow-panel",
              )}
            >
              <div className="aspect-[4/5] overflow-hidden bg-paper-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.preview}
                  alt={s.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="border-t-2 border-ink bg-white p-2.5">
                <p className="font-display text-sm font-extrabold leading-tight">
                  {s.name}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">
                  {s.vibe}
                </p>
              </div>
              {on && (
                <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-pop text-white">
                  <Check size={15} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------- Step 4 · Storyboard --------------------------- */
function StoryboardStep({
  board,
  setBoard,
}: {
  board: BoardPage[];
  setBoard: (b: BoardPage[]) => void;
}) {
  const [activeId, setActiveId] = useState(board[0]?.id ?? "");
  const active = board.find((p) => p.id === activeId) ?? board[0];

  const setPanels = (panels: BoardPanel[]) =>
    setBoard(board.map((p) => (p.id === active.id ? { ...p, panels } : p)));
  const updatePanel = (id: string, patch: Partial<BoardPanel>) =>
    setPanels(active.panels.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removePanel = (id: string) =>
    setPanels(active.panels.filter((p) => p.id !== id));
  const addPanel = () =>
    setPanels([
      ...active.panels,
      { id: `p${Date.now()}`, shot: "New panel — describe the shot…", dialogue: "" },
    ]);
  const addPage = () => {
    const id = `pg${Date.now()}`;
    setBoard([
      ...board,
      { id, title: `Page ${board.length + 1}`, panels: [{ id: `p${Date.now()}`, shot: "Opening shot…" }] },
    ]);
    setActiveId(id);
  };
  const removePage = (id: string) => {
    if (board.length <= 1) return;
    const next = board.filter((p) => p.id !== id);
    setBoard(next);
    if (activeId === id) setActiveId(next[0].id);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
      {/* pages */}
      <div>
        <p className="kicker mb-2">Pages</p>
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {board.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={cn(
                "group flex min-w-[140px] items-center justify-between gap-2 rounded-lg border-2 border-ink px-3 py-2 text-left text-[13px] transition-colors lg:min-w-0",
                p.id === active.id ? "bg-accent font-bold" : "bg-white text-ink-soft hover:bg-paper-deep",
              )}
            >
              <span className="truncate">Page {i + 1}</span>
              <span className="flex items-center gap-1">
                <span className="font-mono text-[10px] text-ink/50">{p.panels.length}</span>
                {board.length > 1 && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(p.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        removePage(p.id);
                      }
                    }}
                    className="opacity-0 transition-opacity hover:text-pop group-hover:opacity-100"
                    aria-label={`Remove page ${i + 1}`}
                  >
                    <X size={13} />
                  </span>
                )}
              </span>
            </button>
          ))}
          <button
            onClick={addPage}
            className="inline-flex min-w-[140px] items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-ink/40 px-3 py-2 text-[12px] font-bold text-ink-soft transition-colors hover:border-ink hover:bg-accent hover:text-ink lg:min-w-0"
          >
            <Plus size={14} /> Add page
          </button>
        </div>
      </div>

      {/* board */}
      <div className="relative rounded-panel border-2 border-ink bg-paper-deep p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="kicker">{active.title} · drag to re-pace</p>
          <button
            onClick={addPanel}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold hover:bg-accent"
          >
            <Plus size={13} /> Add panel
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={active.panels}
          onReorder={setPanels}
          className="grid gap-3 sm:grid-cols-2"
        >
          {active.panels.map((panel, i) => (
            <Reorder.Item
              key={panel.id}
              value={panel}
              className="sticky-note flex cursor-grab flex-col p-3 active:cursor-grabbing"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-ink-faint">
                  <GripVertical size={13} /> Panel {i + 1}
                </span>
                <button
                  onClick={() => removePanel(panel.id)}
                  className="text-ink-faint hover:text-pop"
                  aria-label="Remove panel"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <textarea
                value={panel.shot}
                onChange={(e) => updatePanel(panel.id, { shot: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-md border border-ink/15 bg-paper px-2 py-1.5 text-[12.5px] font-semibold leading-snug text-ink outline-none focus:border-ink"
              />
              <div className="mt-2 flex items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase text-ink-faint">Says</span>
                <input
                  value={panel.dialogue ?? ""}
                  onChange={(e) => updatePanel(panel.id, { dialogue: e.target.value })}
                  placeholder="add a line…"
                  className="min-w-0 flex-1 rounded-md border border-ink/15 bg-white px-2 py-1 font-comic text-[12px] font-bold text-ink outline-none placeholder:font-sans placeholder:font-normal placeholder:text-ink-faint focus:border-ink"
                />
              </div>
              {panel.note && (
                <p className="mt-2 rounded bg-accent/40 px-2 py-1 text-[11px] italic text-ink-soft">
                  📌 {panel.note}
                </p>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

/* -------------------------- Step 5 · Production --------------------------- */
function ProductionStep({
  projectId,
  generated,
  providerLive,
  budgetRemaining,
  placeholderArt,
  onDone,
}: {
  projectId: string;
  generated: boolean;
  providerLive: boolean;
  budgetRemaining: number;
  placeholderArt: boolean;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "running" | "done" | "error">("idle");
  const [stageIdx, setStageIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopTicker() {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }

  // Never leak the cinematic ticker if the step unmounts mid-production.
  useEffect(() => () => stopTicker(), []);

  async function run() {
    setError(null);
    setPhase("running");
    setStageIdx(0);
    // cinematic auto-advance (caps below final until the real "done" lands)
    if (!reduce) {
      tickRef.current = setInterval(() => {
        setStageIdx((i) => Math.min(PRODUCTION_STAGES.length - 2, i + 1));
      }, 1500);
    }
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, { method: "POST" });
      if (!res.ok || !res.body) {
        stopTicker();
        setError(
          res.status === 401
            ? "Your session expired — please log in again."
            : `Production failed (${res.status}).`,
        );
        setPhase("error");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let errored = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n\n")) >= 0) {
          const chunk = buf.slice(0, nl);
          buf = buf.slice(nl + 2);
          const line = chunk.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const ev = JSON.parse(line.slice(5).trim()) as ProgressEvent;
          if (ev.type === "stage") {
            if (ev.key === "characters") setStageIdx((i) => Math.max(i, 1));
            if (ev.key === "panels") setStageIdx((i) => Math.max(i, 3));
          } else if (ev.type === "error") {
            errored = true;
            setError(ev.message);
          }
        }
      }
      stopTicker();
      if (errored) {
        setPhase("error");
        return;
      }
      setStageIdx(PRODUCTION_STAGES.length - 1);
      setPhase("done");
      setTimeout(onDone, 1400);
    } catch {
      stopTicker();
      setError("Connection interrupted. Your work may have saved — refresh to check.");
      setPhase("error");
    }
  }

  if (phase === "idle") {
    return (
      <div className="grid place-items-center rounded-panel border-2 border-ink bg-white p-10 text-center shadow-panel">
        <span className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-ink bg-accent shadow-panel-sm">
          <Clapperboard size={36} />
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold">
          {generated ? "Roll camera again?" : "Ready to roll camera?"}
        </h2>
        <p className="mt-2 max-w-md text-ink-soft">
          {generated
            ? "Re-run production to regenerate your pages with the latest story, cast and style."
            : "We'll write the script, design your cast, plan the panels and illustrate every page — keeping your characters on-model throughout."}
        </p>
        <button
          onClick={run}
          className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-pop px-7 py-4 text-lg font-extrabold text-white shadow-panel transition-all hover:-translate-y-0.5 hover:shadow-panel-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          🎬 Start Production
        </button>
        <p className="mt-4 font-mono text-xs text-ink-faint">
          {providerLive
            ? `${budgetRemaining} render${budgetRemaining === 1 ? "" : "s"} left on your plan`
            : "Free demo engine · add an image key for full art"}
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="grid place-items-center rounded-panel border-2 border-ink bg-white p-10 text-center shadow-panel">
        <p className="max-w-md font-semibold text-pop">{error}</p>
        <Button variant="outline" size="md" className="mt-4" onClick={run}>
          <RefreshCw size={15} /> Try production again
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-panel border-2 border-ink bg-ink text-paper shadow-panel-lg">
      <div className="relative px-6 py-10 sm:px-12 sm:py-14">
        <div className="halftone pointer-events-none absolute inset-0 opacity-[0.08]" />
        <p className="kicker relative !text-accent">
          {phase === "done" ? "That's a wrap" : "Now in production"}
        </p>
        <h2 className="relative mt-1 font-display text-3xl font-extrabold text-paper">
          {phase === "done" ? "Your comic is ready." : "Bringing your comic to life…"}
        </h2>

        <ul className="relative mt-8 flex flex-col gap-3">
          {PRODUCTION_STAGES.map((s, i) => {
            const state = i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
            return (
              <motion.li
                key={s.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3.5"
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border-2",
                    state === "done"
                      ? "border-pop-mint bg-pop-mint text-white"
                      : state === "active"
                        ? "border-accent bg-accent text-ink"
                        : "border-paper/30 bg-transparent text-paper/40",
                  )}
                >
                  {state === "done" ? (
                    <Check size={16} strokeWidth={3} />
                  ) : state === "active" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block font-display text-lg font-extrabold leading-tight",
                      state === "pending" ? "text-paper/40" : "text-paper",
                    )}
                  >
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "block text-[12px]",
                      state === "pending" ? "text-paper/25" : "text-paper/60",
                    )}
                  >
                    {s.sub}
                  </span>
                </span>
                {state === "active" && (
                  <span className="ml-auto hidden font-mono text-[11px] text-accent sm:block">
                    rendering…
                  </span>
                )}
              </motion.li>
            );
          })}
        </ul>

        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-8"
          >
            <SpeechBubble tone="accent" tail="bl">
              Opening your finished comic…
            </SpeechBubble>
          </motion.div>
        )}

        {placeholderArt && phase === "done" && (
          <p className="relative mt-4 text-[12px] text-paper/60">
            Note: panel art used the free placeholder engine. Add an image key and
            re-run production for full illustrations.
          </p>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Finished reader ---------------------------- */
function StudioReader({
  projectName,
  pages,
  watermark,
  onClose,
}: {
  projectName: string;
  pages: EditorPage[];
  watermark: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const page = pages[idx];
  const go = (d: number) => {
    setDir(d);
    setIdx((i) => Math.min(pages.length - 1, Math.max(0, i + d)));
  };

  if (!pages.length) {
    return (
      <div className="grid place-items-center rounded-panel border-2 border-ink bg-white p-10 text-center">
        <p className="text-ink-soft">No pages yet — run production first.</p>
        <Button variant="outline" size="md" className="mt-3" onClick={onClose}>
          Back to studio
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-panel border-2 border-ink bg-paper-deep p-4 shadow-panel-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={15} /> Back to the studio
        </button>
        <span className="font-display text-sm font-extrabold">{projectName}</span>
        <ExportMenu
          title={pages.length > 1 ? `${projectName} — page ${idx + 1}` : projectName}
          panels={page.panels}
          watermark={watermark}
        />
      </div>

      <div className="perspective mx-auto max-w-2xl">
        <div className="relative aspect-[3/4] sm:aspect-[4/3]">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={page.id}
              initial={reduce ? { opacity: 0 } : { rotateY: dir > 0 ? 30 : -30, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { rotateY: dir > 0 ? -30 : 30, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="page-sheet preserve-3d absolute inset-0 overflow-auto rounded-panel border-2 border-ink p-3"
            >
              <div className="grid grid-cols-2 gap-2.5">
                {page.panels.map((p, i) => (
                  <figure
                    key={p.id}
                    className={cn(
                      "relative overflow-hidden rounded-lg border-2 border-ink bg-white",
                      i === 0 && "col-span-2",
                    )}
                  >
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt={p.label}
                        className={cn(
                          "w-full object-cover",
                          i === 0 ? "aspect-[16/9]" : "aspect-[4/3]",
                        )}
                      />
                    ) : (
                      <span className="halftone block aspect-[4/3] w-full opacity-20" />
                    )}
                    {p.dialogue[0] && (
                      <span className="absolute left-2 top-2 max-w-[80%] rounded-xl border-2 border-ink bg-white/95 px-2 py-1 font-comic text-[10px] font-bold leading-tight text-ink shadow-panel-sm">
                        {p.dialogue[0].text}
                      </span>
                    )}
                  </figure>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-2xl items-center justify-between">
        <button
          onClick={() => go(-1)}
          disabled={idx === 0}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white shadow-panel-sm disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-mono text-xs text-ink-faint">
          Page {idx + 1} of {pages.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={idx === pages.length - 1}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-ink text-paper shadow-panel-sm disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
