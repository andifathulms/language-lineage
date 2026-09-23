import { Fraunces, Gentium_Plus, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";

// Headings: Fraunces with its SOFT axis turned up — a serif that reads as grown
// rather than surveyed.
export const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  variable: "--font-display",
  display: "swap",
});

// Reading column.
export const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Specimen-label metadata (turning point types, eras).
export const label = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-label",
  display: "swap",
});

// Functional typography: full IPA coverage so transcriptions stay real text.
export const ipa = Gentium_Plus({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-ipa",
  display: "swap",
});

export const fontVariables = [display, serif, label, ipa].map((f) => f.variable).join(" ");
