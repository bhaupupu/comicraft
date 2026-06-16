import { cn } from "@/lib/utils";

/** Spiky "POW!" star burst — an SFX badge. Pure SVG so it scales crisply. */
export function StarBurst({
  children,
  className,
  fill = "var(--accent)",
}: {
  children?: React.ReactNode;
  className?: string;
  fill?: string;
}) {
  const points = 12;
  const cx = 60;
  const cy = 60;
  const outer = 58;
  const inner = 44;
  // Round to 2dp so server and client render byte-identical points (avoids a
  // floating-point hydration mismatch between Node and the browser engine).
  const path = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    const x = (cx + r * Math.cos(a)).toFixed(2);
    const y = (cy + r * Math.sin(a)).toFixed(2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <polygon
          points={path}
          fill={fill}
          stroke="#181410"
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative z-10 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
        {children}
      </span>
    </span>
  );
}
