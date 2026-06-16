import { cn } from "@/lib/utils";

/**
 * A framed comic panel. Children are the "art" (SVG illustration, gradient field,
 * or live editor surface). Optional `caption` renders the yellow narrator box;
 * `tag` renders a top-left number/label chip.
 */
export function ComicPanel({
  children,
  className,
  caption,
  tag,
  tilt = 0,
}: {
  children?: React.ReactNode;
  className?: string;
  caption?: React.ReactNode;
  tag?: React.ReactNode;
  tilt?: number;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-panel border-2 border-ink bg-white shadow-panel",
        className,
      )}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {tag !== undefined && (
        <span className="absolute left-0 top-0 z-10 rounded-br-xl border-b-2 border-r-2 border-ink bg-ink px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-paper">
          {tag}
        </span>
      )}
      {children}
      {caption !== undefined && (
        <figcaption className="absolute inset-x-2 bottom-2 z-10 rounded-md border-2 border-ink bg-accent px-3 py-1.5 font-comic text-[13px] font-bold leading-tight text-ink">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
