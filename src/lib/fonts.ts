import { Fraunces, Gentium_Plus, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";

// Headings: Fraunces with its SOFT axis turned up — a serif that reads as grown
// rather than surveyed.
export const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "opsz"],
  variable: "--font-display",
  display: "swap",
});

// Fraunces draws "ō" badly: without a precomposed glyph, browsers build it from
// Fraunces's "o" plus a combining macron. This face covers only extended Latin
// and sits first in the heading stack, so those letters come from Source Serif 4.
export const displayExt = localFont({
  src: "../../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-ext-wght-normal.woff2",
  weight: "200 900",
  variable: "--font-display-ext",
  display: "swap",
  adjustFontFallback: false,
  fallback: [],
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF",
    },
  ],
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

export const fontVariables = [display, displayExt, serif, label, ipa].map((f) => f.variable).join(" ");
