import type { Config } from "tailwindcss";

/**
 * Inkwell design system — "premium editorial comic studio".
 * Palette philosophy: warm paper + ink black line-work + ONE marker-yellow
 * highlight + a riso-red energy pop. No gradients-as-crutch, no neon.
 * Depth comes from hard offset "comic panel" shadows and halftone texture.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAF6EE", // base canvas
          deep: "#F2EADB", // recessed sections
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#181410", // text + comic line-work
          soft: "#4A423B", // muted body
          faint: "#8C8175", // captions / placeholders
        },
        hairline: "#E7DECE", // subtle borders on paper
        accent: {
          DEFAULT: "#FFD23F", // marker yellow highlight
          deep: "#F4B400",
        },
        pop: {
          DEFAULT: "#F0412E", // riso red — energy / live dots / secondary CTA
          blue: "#2D6BFF", // ink blue — links / info, used sparingly
          mint: "#13B07C", // "generated" success
          violet: "#6C4DF6", // tertiary accent for feature illustrations
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        comic: ["var(--font-comic)", "Comic Sans MS", "cursive"],
      },
      borderRadius: {
        panel: "18px",
        bubble: "24px",
      },
      boxShadow: {
        // Hard, offset "comic panel" shadows — the signature depth cue.
        panel: "5px 5px 0 0 #181410",
        "panel-sm": "3px 3px 0 0 #181410",
        "panel-lg": "8px 8px 0 0 #181410",
        "panel-accent": "5px 5px 0 0 #F4B400",
        "panel-pop": "5px 5px 0 0 #F0412E",
        soft: "0 14px 40px -18px rgba(24,20,16,0.35)",
        lift: "0 24px 60px -24px rgba(24,20,16,0.45)",
      },
      keyframes: {
        "marker-sweep": {
          "0%": { backgroundSize: "0% 100%" },
          "100%": { backgroundSize: "100% 100%" },
        },
        "bubble-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "panel-in": {
          "0%": { transform: "translateY(14px) rotate(-1.5deg)", opacity: "0" },
          "100%": { transform: "translateY(0) rotate(0)", opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "caret-blink": {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
        "dash-draw": {
          to: { strokeDashoffset: "0" },
        },
        drift: {
          "0%,100%": { transform: "translateY(0) rotate(var(--tw-rotate,0))" },
          "50%": { transform: "translateY(-14px) rotate(var(--tw-rotate,0))" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "ink-rise": {
          "0%": { transform: "translateY(110%)" },
          "100%": { transform: "translateY(0)" },
        },
        "tape-in": {
          "0%": { transform: "rotate(-8deg) scale(0.6)", opacity: "0" },
          "100%": { transform: "rotate(-4deg) scale(1)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "marker-sweep": "marker-sweep 0.7s ease-out forwards",
        "bubble-pop": "bubble-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "panel-in": "panel-in 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "caret-blink": "caret-blink 1s steps(1) infinite",
        drift: "drift 7s ease-in-out infinite",
        "drift-slow": "drift 11s ease-in-out infinite",
        bob: "bob 3.5s ease-in-out infinite",
        shimmer: "shimmer 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
