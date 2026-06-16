import type { Variants, Transition } from "framer-motion";

/** Shared spring used by panels / bubbles popping in. */
export const popSpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 26,
  mass: 0.7,
};

export const easeOut: Transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

/** Fade + rise — the default entrance for text blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

/** Stagger container; children should use `fadeUp` or `panelIn`. */
export const stagger = (gap = 0.09, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/** A comic panel snapping into place with a tiny rotation settle. */
export const panelIn: Variants = {
  hidden: { opacity: 0, y: 18, rotate: -1.5, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: popSpring,
  },
};

/** Speech bubble pop. */
export const bubblePop: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: popSpring },
};

/** Reusable viewport config so reveals fire once, slightly early. */
export const inViewOnce = { once: true, amount: 0.3 } as const;
