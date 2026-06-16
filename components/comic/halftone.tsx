import { cn } from "@/lib/utils";

/**
 * Halftone dot field. Use as a decorative texture layer (absolutely positioned)
 * or inline. `fade` masks the bottom edge for a printed-ink feel.
 */
export function Halftone({
  className,
  dot = 9,
  fade = false,
  color = "rgba(24,20,16,0.9)",
}: {
  className?: string;
  dot?: number;
  fade?: boolean;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", fade && "halftone-fade", className)}
      style={{
        backgroundImage: `radial-gradient(${color} 1.4px, transparent 1.5px)`,
        backgroundSize: `${dot}px ${dot}px`,
      }}
    />
  );
}
