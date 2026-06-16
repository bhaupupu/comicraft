/**
 * Editorial line-art that depicts the *creation process* — not generated comic
 * output. Deliberately schematic (wireframes, turnarounds, panel scaffolds) so
 * the site sells the workflow, never random AI covers.
 */

const INK = "#181410";
const ACCENT = "#FFD23F";
const POP = "#F0412E";

function Figure({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x},0) scale(${scale})`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={0} cy={10} r={8} fill={ACCENT} />
      <path d="M0 18 L0 44 M0 26 L-12 36 M0 26 L12 36 M0 44 L-9 64 M0 44 L9 64" />
    </g>
  );
}

/** Character turnaround sheet — four poses on a model line. */
export function CharacterSheetArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} role="img" aria-label="Character turnaround sheet">
      <rect x="6" y="6" width="268" height="148" rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <line x1="20" y1="120" x2="260" y2="120" stroke={INK} strokeWidth="1.5" strokeDasharray="4 5" />
      <Figure x={52} />
      <Figure x={112} />
      <Figure x={172} />
      <Figure x={232} />
      <g fill={INK} fontFamily="monospace" fontSize="9">
        <text x="40" y="142">FRONT</text>
        <text x="104" y="142">3/4</text>
        <text x="162" y="142">SIDE</text>
        <text x="218" y="142">BACK</text>
      </g>
    </svg>
  );
}

/** Story thread — a branching beat timeline. */
export function StoryThreadArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} role="img" aria-label="Story beat timeline">
      <rect x="6" y="6" width="268" height="148" rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <path d="M28 40 H252 M28 80 H170 M28 120 H210" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {[28, 96, 164, 232].map((cx) => (
        <circle key={cx} cx={cx} cy={40} r={7} fill={ACCENT} stroke={INK} strokeWidth="2.2" />
      ))}
      {[28, 99, 170].map((cx) => (
        <circle key={cx} cx={cx} cy={80} r={6} fill="#fff" stroke={INK} strokeWidth="2.2" />
      ))}
      {[28, 119, 210].map((cx) => (
        <circle key={cx} cx={cx} cy={120} r={6} fill={POP} stroke={INK} strokeWidth="2.2" />
      ))}
    </svg>
  );
}

/** Scene environment — layered depth planes. */
export function SceneArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} role="img" aria-label="Scene environment layers">
      <rect x="6" y="6" width="268" height="148" rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <rect x="6" y="96" width="268" height="58" fill={ACCENT} opacity="0.35" />
      <path d="M30 120 L80 70 L120 120 Z M110 120 L170 60 L230 120 Z" fill="#fff" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="218" cy="46" r="16" fill={POP} stroke={INK} strokeWidth="2.4" />
      <line x1="6" y1="120" x2="274" y2="120" stroke={INK} strokeWidth="2.4" />
    </svg>
  );
}

/** Panel grid assembling. */
export function PanelGridArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} role="img" aria-label="Comic panel layout">
      <rect x="6" y="6" width="268" height="148" rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <g stroke={INK} strokeWidth="2.4" fill="none">
        <rect x="22" y="22" width="140" height="56" rx="4" fill={ACCENT} opacity="0.25" />
        <rect x="172" y="22" width="86" height="116" rx="4" />
        <rect x="22" y="88" width="64" height="50" rx="4" />
        <rect x="96" y="88" width="66" height="50" rx="4" fill={POP} opacity="0.15" />
      </g>
    </svg>
  );
}

/** Dialogue — stacked speech bubbles with lettering lines. */
export function DialogueArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 160" className={className} role="img" aria-label="Dialogue speech bubbles">
      <rect x="6" y="6" width="268" height="148" rx="12" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <g stroke={INK} strokeWidth="2.4">
        <rect x="26" y="28" width="150" height="44" rx="14" fill="#fff" />
        <path d="M48 72 l-8 16 l24 -16 z" fill="#fff" stroke="none" />
        <rect x="104" y="92" width="150" height="44" rx="14" fill={ACCENT} opacity="0.4" />
      </g>
      <g stroke={INK} strokeWidth="2" strokeLinecap="round">
        <line x1="40" y1="44" x2="160" y2="44" />
        <line x1="40" y1="56" x2="128" y2="56" />
        <line x1="118" y1="108" x2="238" y2="108" />
        <line x1="118" y1="120" x2="200" y2="120" />
      </g>
    </svg>
  );
}

/** Finished comic page — a stylized multi-panel cover, lettered (no AI render). */
export function ComicPageArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 280" className={className} role="img" aria-label="Finished comic page">
      <rect x="6" y="6" width="208" height="268" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="18" y="18" width="184" height="74" rx="4" fill={ACCENT} opacity="0.3" stroke={INK} strokeWidth="2.4" />
      <rect x="18" y="100" width="88" height="74" rx="4" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <rect x="114" y="100" width="88" height="74" rx="4" fill={POP} opacity="0.15" stroke={INK} strokeWidth="2.4" />
      <rect x="18" y="182" width="184" height="80" rx="4" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <g stroke={INK} strokeWidth="2.2" fill="#fff">
        <rect x="30" y="30" width="70" height="22" rx="9" />
      </g>
      <line x1="40" y1="41" x2="92" y2="41" stroke={INK} strokeWidth="2" />
    </svg>
  );
}
