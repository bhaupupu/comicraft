"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { Halftone } from "@/components/comic/halftone";
import { StarBurst } from "@/components/comic/star-burst";
import { cn } from "@/lib/utils";

export type ShelfBook = {
  id: string;
  title: string;
  premise: string;
  status: string;
  pages: number;
  cast: number;
  updated: string;
  cover: string | null;
};

const COVERS = [
  { bg: "bg-pop", text: "text-white", chip: "bg-white text-ink", burst: "var(--accent)" },
  { bg: "bg-pop-blue", text: "text-white", chip: "bg-white text-ink", burst: "var(--accent)" },
  { bg: "bg-accent", text: "text-ink", chip: "bg-ink text-paper", burst: "var(--pop)" },
  { bg: "bg-pop-violet", text: "text-white", chip: "bg-white text-ink", burst: "var(--accent)" },
  { bg: "bg-pop-mint", text: "text-white", chip: "bg-white text-ink", burst: "var(--accent)" },
  { bg: "bg-ink", text: "text-paper", chip: "bg-accent text-ink", burst: "var(--pop)" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export function Bookshelf({ books }: { books: ShelfBook[] }) {
  const shelves = chunk(books, 4);
  return (
    <div className="flex flex-col gap-10">
      {shelves.map((row, ri) => (
        <div key={ri}>
          <div className="grid grid-cols-2 gap-4 px-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {row.map((b, i) => (
              <Book key={b.id} book={b} delay={i * 0.05} />
            ))}
          </div>
          {/* wooden plank */}
          <div className="shelf-plank mx-1 mt-[-6px] h-4 rounded-b-md" />
          <div className="mx-3 h-3 rounded-b-xl bg-ink/10 blur-[1px]" />
        </div>
      ))}
    </div>
  );
}

function Book({ book, delay }: { book: ShelfBook; delay: number }) {
  const c = COVERS[hash(book.id) % COVERS.length];
  const ready = book.status === "READY" || book.pages > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12, rotate: -1 }}
      className="origin-bottom"
    >
      <Link
        href={`/studio/p/${book.id}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-r-lg rounded-l-sm border-2 border-ink shadow-panel transition-shadow hover:shadow-panel-lg"
      >
        {/* spine shading */}
        <span className="book-spine pointer-events-none absolute inset-0 z-20" />
        <span className="pointer-events-none absolute left-0 top-0 z-20 h-full w-2 bg-ink/25" />

        {book.cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.cover}
              alt={book.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-paper">
              <span className={cn("mb-1 inline-block rounded-full border-2 border-ink px-2 py-0.5 font-mono text-[9px] font-bold uppercase", c.chip)}>
                {ready ? "Ready" : "Draft"}
              </span>
              <h3 className="line-clamp-2 font-display text-base font-extrabold leading-tight">
                {book.title}
              </h3>
            </div>
          </>
        ) : (
          <div className={cn("relative flex h-full w-full flex-col p-3.5", c.bg, c.text)}>
            <Halftone className="absolute inset-0 opacity-[0.12]" dot={9} color="rgba(255,255,255,0.9)" />
            <span className={cn("relative z-10 w-fit rounded-full border-2 border-ink px-2 py-0.5 font-mono text-[9px] font-bold uppercase", c.chip)}>
              {ready ? "Ready" : "Draft"}
            </span>
            <h3 className="relative z-10 mt-3 line-clamp-3 font-display text-lg font-extrabold leading-[1.05]">
              {book.title}
            </h3>
            <p className="relative z-10 mt-2 line-clamp-3 font-comic text-[11px] font-bold leading-snug opacity-90">
              “{book.premise}”
            </p>
            <StarBurst
              className="absolute -bottom-3 -right-3 z-10 h-16 w-16 rotate-[10deg]"
              fill={c.burst}
            >
              <span className="text-[9px] leading-none">{book.pages}p</span>
            </StarBurst>
          </div>
        )}

        {/* pull-from-shelf hint */}
        <span className="absolute inset-x-0 top-0 z-30 flex translate-y-[-110%] items-center justify-center gap-1 bg-ink py-1 font-mono text-[10px] font-bold uppercase text-paper transition-transform group-hover:translate-y-0">
          <Sparkles size={11} /> Open
        </span>
      </Link>

      <div className="mt-2 flex items-center gap-2 px-0.5 text-[11px] text-ink-faint">
        <span>{book.pages} pages</span>
        <span>·</span>
        <span>{book.cast} cast</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <Clock size={11} /> {book.updated}
        </span>
      </div>
    </motion.div>
  );
}
