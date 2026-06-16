"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, inViewOnce } from "@/lib/motion";

/** Kicker + headline + optional lead, with a staggered reveal. */
export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
  className,
  as = "h2",
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  const Title = as;
  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {kicker && (
        <motion.span variants={fadeUp} className="kicker inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-pop" />
          {kicker}
        </motion.span>
      )}
      <motion.div variants={fadeUp}>
        <Title className="text-balance text-[clamp(1.9rem,4.5vw,3.4rem)] font-extrabold text-ink">
          {title}
        </Title>
      </motion.div>
      {lead && (
        <motion.p
          variants={fadeUp}
          className="text-pretty text-lg leading-relaxed text-ink-soft"
        >
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
}
