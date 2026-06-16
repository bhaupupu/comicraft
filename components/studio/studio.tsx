"use client";

import { useRef, useState, useTransition, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ScrollText,
  Users,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquare,
  Library,
  Undo2,
  Redo2,
  Play,
  Download,
  Sparkles,
  Send,
  Plus,
  Eye,
  Lock,
  ChevronLeft,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { generateProjectAction } from "@/app/studio/actions";
import { ExportMenu } from "@/components/studio/export-menu";
import { GenerateStream } from "@/components/studio/generate-stream";
import {
  CharacterSheetArt,
  SceneArt,
  PanelGridArt,
  DialogueArt,
  StoryThreadArt,
} from "@/components/comic/process-art";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store/editor";

const TOOLS = [
  { key: "story", label: "Story", Icon: ScrollText },
  { key: "characters", label: "Characters", Icon: Users },
  { key: "scenes", label: "Scenes", Icon: ImageIcon },
  { key: "panels", label: "Panels", Icon: LayoutGrid },
  { key: "dialogue", label: "Dialogue", Icon: MessageSquare },
  { key: "assets", label: "Assets", Icon: Library },
] as const;

type ToolKey = (typeof TOOLS)[number]["key"];

type Dialogue = { speaker: string; text: string };
type RealPanel = { id: string; label: string; imageUrl: string | null; dialogue: Dialogue[] };
type RealPage = { id: string; index: number; panels: RealPanel[] };
type RealCharacter = { name: string; role: string | null; imageUrl: string | null };

type CanvasItem = {
  id: string;
  label: string;
  span?: boolean;
  imageUrl?: string | null;
  Art?: ComponentType<{ className?: string }>;
  dialogue?: Dialogue[];
};

// Fallback demo content (used when a project has no generated page yet).
const DEMO_PANELS: CanvasItem[] = [
  { id: "p1", Art: SceneArt, label: "Establishing — Tokyo alley", span: true },
  { id: "p2", Art: CharacterSheetArt, label: "Detective enters" },
  { id: "p3", Art: PanelGridArt, label: "Clue close-up" },
  { id: "p4", Art: DialogueArt, label: "Standoff dialogue" },
  { id: "p5", Art: StoryThreadArt, label: "The turn" },
];

const DEMO_CHARACTERS: RealCharacter[] = [
  { name: "Detective Cat", role: "Lead", imageUrl: null },
  { name: "The Informant", role: "Support", imageUrl: null },
  { name: "Neon Boss", role: "Antagonist", imageUrl: null },
];

const SUGGESTIONS = [
  "Generate the next panel",
  "Make panel 2 a low-angle hero shot",
  "Add a speech bubble",
  "Heavier rain, more neon",
];

type Msg = { who: "you" | "ai"; text: string };

export function Studio({
  projectId,
  projectName,
  pages,
  characters,
  story,
  engineLabel,
  placeholderArt = false,
  watermark = false,
}: {
  projectId?: string;
  projectName?: string;
  pages?: RealPage[];
  characters?: RealCharacter[];
  story?: { logline?: string; theme?: string; style?: string } | null;
  engineLabel?: string;
  placeholderArt?: boolean;
  watermark?: boolean;
}) {
  const realPages = pages && pages.some((p) => p.panels.length) ? pages : null;
  const realMode = !!realPages;

  const [activePageId, setActivePageId] = useState<string>(realPages?.[0]?.id ?? "");
  const activePage = realPages?.find((p) => p.id === activePageId) ?? realPages?.[0] ?? null;
  const activeIndex = realPages ? Math.max(0, realPages.findIndex((p) => p.id === activePage?.id)) : 0;

  const items: CanvasItem[] = activePage
    ? activePage.panels.map((p, i) => ({
        id: p.id,
        label: p.label,
        imageUrl: p.imageUrl,
        dialogue: p.dialogue,
        span: i === 0,
      }))
    : DEMO_PANELS;
  const cast = characters && characters.length ? characters : DEMO_CHARACTERS;

  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const storeSelected = useEditorStore((s) => s.selectedPanelId);
  const selectPanel = useEditorStore((s) => s.selectPanel);
  const zoom = useEditorStore((s) => s.zoom);
  const zoomIn = useEditorStore((s) => s.zoomIn);
  const zoomOut = useEditorStore((s) => s.zoomOut);

  const selected = items.find((i) => i.id === storeSelected)?.id ?? items[0]?.id ?? "";

  const [messages, setMessages] = useState<Msg[]>([
    {
      who: "ai",
      text: realMode
        ? "Your page is rendered. Want me to re-stage a panel or punch up a line?"
        : "Page 3 is laid out. Want me to letter the standoff, or re-stage a panel?",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim() || busy) return;
    setMessages((m) => [...m, { who: "you", text }]);
    setDraft("");
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          who: "ai",
          text: "Done — I kept the cast on-model. (Live in-editor regeneration ships next.)",
        },
      ]);
      setBusy(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" }));
    }, 1100);
  }

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <div className="container-page py-6">
      <a
        href="/studio"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ChevronLeft size={15} /> Back to dashboard
      </a>

      <div className="overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel-lg">
        {/* top bar */}
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-ink bg-paper-deep px-4 py-2.5">
          <span className="font-display text-sm font-extrabold">
            {projectName ?? "Detective Cat in Tokyo"}
          </span>
          <span className="rounded-md border border-ink/20 bg-white px-2 py-0.5 font-mono text-[11px] text-ink-soft">
            Page {realMode ? activeIndex + 1 : 1} / {realPages?.length ?? 1}
          </span>
          <div className="ml-1 flex items-center gap-1">
            <IconBtn label="Undo"><Undo2 size={15} /></IconBtn>
            <IconBtn label="Redo"><Redo2 size={15} /></IconBtn>
          </div>
          {engineLabel && (
            <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-pop-mint" /> {engineLabel}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {projectId && <RegenButton projectId={projectId} />}
            <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold sm:inline-flex">
              <Play size={12} /> Preview
            </span>
            {activePage ? (
              <ExportMenu
                title={
                  realPages && realPages.length > 1
                    ? `${projectName ?? "comic"} — page ${activeIndex + 1}`
                    : projectName ?? "comic"
                }
                panels={activePage.panels}
                watermark={watermark}
              />
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-3 py-1 text-xs font-bold shadow-panel-sm">
                <Download size={12} /> Export
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[64px_220px_1fr_280px]">
          {/* tool rail */}
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-ink bg-ink px-2 py-2 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r-2 lg:py-3">
            {TOOLS.map((t) => {
              const active = tool === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTool(t.key)}
                  className={cn(
                    "flex shrink-0 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-semibold transition-colors lg:w-full",
                    active ? "bg-accent text-ink" : "text-paper/70 hover:bg-white/10",
                  )}
                  aria-pressed={active}
                >
                  <t.Icon size={18} />
                  {t.label}
                </button>
              );
            })}
          </nav>

          {/* context panel */}
          <aside className="border-b-2 border-ink bg-paper p-3 lg:border-b-0 lg:border-r-2">
            <ContextPanel
              tool={tool}
              cast={cast}
              story={story}
              pages={realPages}
              activePageId={activePage?.id ?? ""}
              onSelectPage={setActivePageId}
              projectId={projectId}
              panelCount={items.length}
            />
          </aside>

          {/* canvas */}
          <section className="relative bg-paper-deep">
            <div className="halftone pointer-events-none absolute inset-0 opacity-[0.06]" />
            <div ref={scrollRef} className="relative max-h-[560px] overflow-auto p-6">
              <div
                className="mx-auto w-full max-w-md origin-top transition-transform"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                <div className="grid grid-cols-2 gap-3 rounded-xl border-2 border-ink bg-white p-3 shadow-panel">
                  {items.map((item) => {
                    const isSel = selected === item.id;
                    const Art = item.Art;
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectPanel(item.id)}
                        className={cn(
                          "group relative aspect-[4/3] overflow-hidden rounded-lg border-2 text-left transition-all",
                          item.span && "col-span-2 aspect-[16/9]",
                          isSel ? "border-pop ring-2 ring-pop/30" : "border-ink hover:border-pop/60",
                        )}
                      >
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.label} className="h-full w-full object-cover" />
                        ) : Art ? (
                          <Art className="h-full w-full" />
                        ) : (
                          <span className="halftone block h-full w-full opacity-20" />
                        )}

                        {/* lettering layer — a real speech bubble over the art */}
                        {item.dialogue && item.dialogue.length > 0 && (
                          <span className="absolute left-2 top-2 max-w-[80%] rounded-xl border-2 border-ink bg-white/95 px-2 py-1 font-comic text-[10px] font-bold leading-tight text-ink shadow-panel-sm">
                            {item.dialogue[0].text}
                          </span>
                        )}

                        <span className="absolute inset-x-0 bottom-0 truncate bg-ink/85 px-2 py-1 font-mono text-[10px] text-paper opacity-0 transition-opacity group-hover:opacity-100">
                          {item.label}
                        </span>
                        {isSel && (
                          <span className="absolute right-1.5 top-1.5 rounded-full border-2 border-ink bg-pop px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                            SELECTED
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => send("Generate the next panel")}
                    className="grid aspect-[4/3] h-full min-h-[88px] place-items-center rounded-lg border-2 border-dashed border-ink/40 bg-paper text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    <span className="flex flex-col items-center gap-1 text-[11px] font-semibold">
                      <Plus size={16} /> New panel
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-ink bg-white px-1.5 py-1 shadow-panel-sm">
              <button onClick={zoomOut} aria-label="Zoom out" className="grid h-6 w-6 place-items-center rounded-full hover:bg-ink/5">−</button>
              <span className="nums w-10 text-center font-mono text-[11px] font-bold">{zoom}%</span>
              <button onClick={zoomIn} aria-label="Zoom in" className="grid h-6 w-6 place-items-center rounded-full hover:bg-ink/5">+</button>
            </div>
          </section>

          {/* AI assistant + inspector */}
          <aside className="flex flex-col border-t-2 border-ink bg-paper lg:border-l-2 lg:border-t-0">
            <div className="border-b-2 border-ink/10 p-3">
              <p className="kicker mb-2 flex items-center gap-1.5">
                <Sparkles size={12} /> AI assistant
              </p>
              <div className="flex max-h-44 flex-col gap-2 overflow-auto">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[90%] rounded-xl border-2 border-ink px-3 py-2 text-[12px] leading-snug",
                      m.who === "ai" ? "bg-white text-ink" : "ml-auto bg-ink text-paper",
                    )}
                  >
                    {m.text}
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-1 rounded-xl border-2 border-ink bg-white px-3 py-2">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-ink"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={busy}
                    className="rounded-full border border-ink/15 bg-white px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
                className="mt-3 flex items-center gap-1.5 rounded-full border-2 border-ink bg-white p-1 pl-3"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask Comicraft to change anything…"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-[12px] outline-none placeholder:text-ink-faint"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>

            {/* inspector */}
            <div className="p-3">
              <p className="kicker mb-2">Selected panel</p>
              <div className="rounded-lg border-2 border-ink bg-white p-2.5">
                <p className="text-[13px] font-bold text-ink">{selectedItem?.label}</p>
                {selectedItem?.dialogue && selectedItem.dialogue.length > 0 ? (
                  <p className="mt-1 font-comic text-[11px] text-ink-soft">
                    {selectedItem.dialogue[0].speaker}: “{selectedItem.dialogue[0].text}”
                  </p>
                ) : (
                  <p className="mt-0.5 font-mono text-[10px] text-ink-faint">on-model ✓</p>
                )}
              </div>
              <p className="kicker mb-2 mt-4">Layers</p>
              <div className="flex flex-col gap-1">
                {["Lettering", "Characters", "Foreground", "Background"].map((l, i) => (
                  <div
                    key={l}
                    className={cn(
                      "flex items-center gap-2 rounded px-2 py-1.5 text-[12px]",
                      i === 1 ? "bg-accent/40 font-semibold text-ink" : "text-ink-soft",
                    )}
                  >
                    <Eye size={13} />
                    <span className="flex-1">{l}</span>
                    {i === 3 && <Lock size={12} className="text-ink-faint" />}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {placeholderArt && (
        <div className="mt-4 rounded-xl border-2 border-ink bg-accent/30 px-4 py-3 text-center text-sm font-medium text-ink">
          The story, cast and lettering are real — but the panel art is the free SVG placeholder
          (your Gemini image quota is unavailable). Enable Gemini image billing, or add a free image
          key (Cloudflare Workers AI), then regenerate for full art. See docs/11-phase2-guide.md.
        </div>
      )}
      <p className="mt-4 text-center text-sm text-ink-faint">
        Click panels, switch tools, and chat with the assistant. Layout, lettering and re-staging are
        live; in-editor regeneration ships in the next pass.
      </p>
    </div>
  );
}

function RegenButton({ projectId }: { projectId: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      onClick={() =>
        start(async () => {
          await generateProjectAction(projectId);
          router.refresh();
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold transition-colors hover:bg-paper-deep disabled:opacity-50"
      title="Re-run the generation pipeline for this page"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
      {pending ? "Regenerating…" : "Regenerate"}
    </button>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid h-7 w-7 place-items-center rounded-md border border-ink/15 bg-white text-ink-soft hover:bg-ink/5"
    >
      {children}
    </button>
  );
}

function ContextPanel({
  tool,
  cast,
  story,
  pages,
  activePageId,
  onSelectPage,
  projectId,
  panelCount,
}: {
  tool: ToolKey;
  cast: RealCharacter[];
  story?: { logline?: string; theme?: string; style?: string } | null;
  pages: RealPage[] | null;
  activePageId: string;
  onSelectPage: (id: string) => void;
  projectId?: string;
  panelCount: number;
}) {
  if (tool === "characters") {
    return (
      <div className="flex flex-col gap-2">
        <Header title="Cast" action="New" />
        {cast.map((c) => (
          <div key={c.name} className="flex items-center gap-2.5 rounded-lg border-2 border-ink bg-white p-2">
            {c.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imageUrl} alt={c.name} className="h-9 w-9 shrink-0 rounded-md border-2 border-ink object-cover" />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border-2 border-ink bg-accent">
                <Users size={14} className="text-ink" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold">{c.name}</p>
              <p className="font-mono text-[10px] text-ink-faint">{c.role ?? "Cast"} · locked</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tool === "story") {
    return (
      <div className="flex flex-col gap-2">
        <Header title="Story" action="Edit" />
        {story?.logline ? (
          <>
            <div className="rounded-lg border-2 border-ink bg-accent px-3 py-2 font-comic text-[12px] font-bold leading-snug">
              {story.logline}
            </div>
            {story.theme && (
              <p className="px-1 text-[11px] text-ink-soft">
                <span className="font-semibold">Theme:</span> {story.theme}
              </p>
            )}
            {story.style && (
              <p className="px-1 text-[11px] text-ink-faint">
                <span className="font-semibold">Style:</span> {story.style}
              </p>
            )}
          </>
        ) : (
          ["1 · The torn ear", "2 · Neon & rain", "3 · The standoff", "4 · The turn"].map((c, i) => (
            <div
              key={c}
              className={cn(
                "rounded-lg border-2 border-ink px-3 py-2 text-[13px]",
                i === 2 ? "bg-accent font-bold" : "bg-white text-ink-soft",
              )}
            >
              {c}
            </div>
          ))
        )}
      </div>
    );
  }

  if (tool === "assets") {
    return (
      <div className="flex flex-col gap-2">
        <Header title="Assets" action="Upload" />
        <div className="grid grid-cols-2 gap-2">
          {[SceneArt, CharacterSheetArt, PanelGridArt, DialogueArt].map((Art, i) => (
            <div key={i} className="overflow-hidden rounded-lg border-2 border-ink bg-white">
              <Art className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // panels / scenes / dialogue → page list
  return (
    <div className="flex flex-col gap-2">
      <p className="kicker mb-1">Pages</p>
      {pages && pages.length ? (
        pages.map((p, i) => {
          const isActive = p.id === activePageId;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPage(p.id)}
              className={cn(
                "flex items-center justify-between rounded-lg border-2 border-ink px-3 py-2 text-left text-[13px] transition-colors",
                isActive ? "bg-accent font-bold" : "bg-white text-ink-soft hover:bg-paper-deep",
              )}
            >
              <span>Page {i + 1}</span>
              <span className="font-mono text-[10px] text-ink/50">{p.panels.length} panels</span>
            </button>
          );
        })
      ) : (
        <div className="flex items-center justify-between rounded-lg border-2 border-ink bg-accent px-3 py-2 text-[13px] font-bold">
          <span>Page 1</span>
          <span className="font-mono text-[10px] text-ink/60">{panelCount} panels</span>
        </div>
      )}
      {projectId && pages && pages.length ? (
        <GenerateStream projectId={projectId} mode="next-page" compact />
      ) : (
        <button className="rounded-lg border-2 border-dashed border-ink/40 px-3 py-2 text-[12px] font-semibold text-ink-soft hover:border-ink hover:text-ink">
          + Add page
        </button>
      )}
    </div>
  );
}

function Header({ title, action }: { title: string; action: string }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <p className="kicker">{title}</p>
      <button className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-white px-2 py-0.5 text-[11px] font-bold hover:bg-accent">
        <Plus size={11} /> {action}
      </button>
    </div>
  );
}
