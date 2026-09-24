import type { Config } from "tailwindcss";

// All colors resolve to CSS variables (see src/app/globals.css) so light/dark
// themes and per-family accents swap without touching class names.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bark: "rgb(var(--bark) / <alpha-value>)",
        "bark-soft": "rgb(var(--bark-soft) / <alpha-value>)",
        cream: "rgb(var(--cream) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        heartwood: "rgb(var(--heartwood) / <alpha-value>)",
        sapwood: "rgb(var(--sapwood) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        soil: "rgb(var(--soil) / <alpha-value>)",
        moss: "rgb(var(--moss) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display-ext)", "var(--font-display)", "Georgia", "serif"], // ext = extended Latin only (see fonts.ts)
        serif: ["var(--font-serif)", "Georgia", "serif"],
        label: ["var(--font-label)", "ui-monospace", "monospace"],
        ipa: ["var(--font-ipa)", "Charis SIL", "Doulos SIL", "Noto Serif", "serif"],
      },
      transitionTimingFunction: {
        grow: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        base: "600ms",
      },
      maxWidth: {
        reading: "40rem",
        page: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
