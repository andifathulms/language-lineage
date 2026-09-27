// Share cards. Every page renders its own 1200×630 PNG at build time so a
// pasted link shows what that page actually is, not one generic image.
// Ink ground, paper type, terracotta rings — the brand's three logo colors
// only; sage and teal stay page furniture (see exports/README.txt).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#1C1712";
const paper = "#EDE3D3";
const terracotta = "#C98B5C";

const fontFile = (name: string) => readFileSync(join(process.cwd(), "assets", "og", name));

// Read once per build rather than once per card (≈200 cards).
// Static instances: satori cannot read a variable font's fvar table, so the
// display face is Fraunces pinned at wght 600 / SOFT 60 (see README).
const fonts = [
  { name: "Fraunces", data: fontFile("Fraunces-Semibold.ttf"), weight: 600 as const, style: "normal" as const },
  { name: "Fraunces", data: fontFile("Fraunces-Regular.ttf"), weight: 400 as const, style: "normal" as const },
  { name: "Plex", data: fontFile("IBMPlexMono-Regular.ttf"), weight: 400 as const, style: "normal" as const },
];

/** The growth-ring mark, off-centre the same way RingGlyph is. */
function Rings({ scale = 1, opacity = 1 }: { scale?: number; opacity?: number }) {
  const s = 32 * scale;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" stroke={terracotta} style={{ opacity }}>
      <ellipse cx="16" cy="16" rx="14" ry="13.2" strokeWidth="1.6" />
      <ellipse cx="15.2" cy="16.6" rx="10" ry="9.2" strokeWidth="1.2" opacity="0.8" />
      <ellipse cx="14.6" cy="17.1" rx="6.2" ry="5.6" strokeWidth="1.1" opacity="0.65" />
      <circle cx="14.2" cy="17.4" r="1.8" fill={terracotta} stroke="none" />
    </svg>
  );
}

export interface CardProps {
  /** Small mono line above the title: what kind of page this is. */
  kicker: string;
  title: string;
  /** One or two sentences; trimmed rather than wrapped past four lines. */
  subtitle?: string;
  /** Mono facts along the bottom, e.g. era · region. */
  facts?: string[];
}

// Cut at a word boundary: a card that ends mid-word reads like a bug.
function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

// Long names need to give up some size before they wrap to three lines.
function titleSize(title: string): number {
  if (title.length > 44) return 62;
  if (title.length > 28) return 76;
  return 92;
}

export function card({ kicker, title, subtitle, facts = [] }: CardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          color: paper,
          fontFamily: "Fraunces",
          fontWeight: 600,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Oversized mark bleeding off the right edge, the way the hero does. */}
        <div style={{ position: "absolute", top: -110, right: -150, display: "flex" }}>
          <Rings scale={17} opacity={0.14} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Rings scale={1.2} />
          <span style={{ fontSize: 26, letterSpacing: "-0.01em" }}>Language Lineage</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          <span
            style={{
              fontFamily: "Plex",
              fontWeight: 400,
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: terracotta,
            }}
          >
            {clamp(kicker, 48)}
          </span>
          <span style={{ marginTop: 18, fontSize: titleSize(title), lineHeight: 1.04, letterSpacing: "-0.02em" }}>
            {clamp(title, 72)}
          </span>
          {subtitle ? (
            <span style={{ marginTop: 24, fontWeight: 400, fontSize: 29, lineHeight: 1.4, color: "rgba(237,227,211,0.72)" }}>
              {clamp(subtitle, 165)}
            </span>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "Plex", fontWeight: 400, fontSize: 21 }}>
          {facts.length ? (
            <span style={{ color: "rgba(237,227,211,0.6)" }}>{clamp(facts.join("  ·  "), 90)}</span>
          ) : null}
        </div>

        {/* Terracotta rule along the bottom edge — the growth ring, unrolled. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            background: terracotta,
          }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
