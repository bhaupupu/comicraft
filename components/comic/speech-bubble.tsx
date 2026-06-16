import { cn } from "@/lib/utils";

type Tail = "bl" | "br" | "tl" | "tr" | "none";
type Tone = "default" | "accent" | "pop" | "ink";

const tones: Record<Tone, string> = {
  default: "bg-white text-ink",
  accent: "bg-accent text-ink",
  pop: "bg-pop text-white",
  ink: "bg-ink text-paper",
};

/**
 * A comic speech bubble. The tail is a rotated, ink-outlined square clipped to a
 * triangle so it inherits the bubble's border + fill cleanly.
 */
export function SpeechBubble({
  children,
  tail = "bl",
  tone = "default",
  className,
  think = false,
}: {
  children: React.ReactNode;
  tail?: Tail;
  tone?: Tone;
  className?: string;
  think?: boolean;
}) {
  const tailPos: Record<Exclude<Tail, "none">, string> = {
    bl: "left-7 -bottom-2",
    br: "right-7 -bottom-2",
    tl: "left-7 -top-2",
    tr: "right-7 -top-2",
  };

  return (
    <div
      className={cn(
        "relative inline-block max-w-xs border-2 border-ink px-4 py-2.5 font-comic text-[15px] font-bold leading-snug",
        think ? "rounded-[40%]" : "rounded-2xl",
        tones[tone],
        className,
      )}
    >
      {children}
      {tail !== "none" && !think && (
        <span
          aria-hidden
          className={cn(
            "absolute h-3.5 w-3.5 rotate-45 border-b-2 border-r-2 border-ink",
            tone === "default"
              ? "bg-white"
              : tone === "accent"
                ? "bg-accent"
                : tone === "pop"
                  ? "bg-pop"
                  : "bg-ink",
            tailPos[tail],
          )}
        />
      )}
    </div>
  );
}
