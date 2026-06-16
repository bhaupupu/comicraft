import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Wordmark: an ink-blob "nib" glyph + the product name. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-[11px] border-2 border-ink bg-ink shadow-[2px_2px_0_0_#FFD23F]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          {/* fountain-pen nib */}
          <path
            d="M12 3 L17 14 L12 21 L7 14 Z"
            fill="#FAF6EE"
            stroke="#FAF6EE"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="13.5" r="1.7" fill="#181410" />
          <line x1="12" y1="15" x2="12" y2="21" stroke="#181410" strokeWidth="1.4" />
        </svg>
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        {site.name}
      </span>
    </span>
  );
}
