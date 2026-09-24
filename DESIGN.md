# Language Lineage — DESIGN.md

## Concept
Where Field Atlas reads as a survey map (ink, charted vs. unmapped terrain), Language Lineage reads as **growth rings and root systems** — a family tree grown from a buried proto-form, branching and thickening over centuries, with living descendants as the visible canopy. The metaphor fits the content directly: a Branch literally grows out of its parent the way a limb grows from a trunk, and a sound law is the ring-boundary marking when the growth changed direction.

This keeps Language Lineage visually distinct from both Field Atlas (map/ink/parchment) and [[sulih]] (Lontara script-carving aesthetic) — this app isn't about maps or glyphs, it's about organic branching growth over time.

The overall register is **a well-made natural-history book**: calm, warm, generous margins, one strong illustration per spread. Professional first; the wood metaphor lives in the details (rings, grain, limbs), never in skeuomorphic textures or clip-art.

## Typography
Four faces, each with one job. Don't add a fifth.

| Role | Face | Notes |
|---|---|---|
| Display: headings, branch names, tree labels | **Fraunces** (SOFT axis 100, opsz on) | Rounded, grown rather than surveyed. Semibold (600) for h1/h2, never bold-black. Tight leading (1.02–1.1) and slight negative tracking at display sizes. |
| Reading: chapter prose, summaries | **Source Serif 4** | 1.075–1.125rem, line-height 1.75, measure ≈ 66ch (`max-w-reading`). Old-style figures in prose. |
| Specimen labels: turning-point types, eras, metadata | **IBM Plex Mono**, uppercase, 0.12–0.16em tracking, 0.65–0.75rem | Styled as a small label *pinned* to a ring (hairline border, dot), not a rubber stamp. |
| IPA transcriptions | **Gentium Plus** | Functional typography. Every phonetic form is real, selectable text in this face; never an image. |

Extended-Latin letters in headings fall through to Source Serif 4 (Fraunces builds "ō" badly from combining marks).

Scale (display): h1 `clamp(2.4rem, 6vw, 4.4rem)` · h2 1.875rem · h3 1.25–1.5rem. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.

## Color
All colors are CSS variables holding RGB triplets, so Tailwind alpha works and themes swap without touching class names.

**Base — warm wood-tone neutrals** (light / dark):

| Token | Role | Light | Dark |
|---|---|---|---|
| `cream` | page background (aged paper) | 247 241 229 | 25 20 16 |
| `paper` | raised surfaces: cards, panels, the tree plate | 252 249 242 | 34 28 23 |
| `soil` | recessed surfaces: the ground, lanes | 236 226 205 | 40 32 26 |
| `bark` | primary text | 52 38 28 | 238 228 210 |
| `bark-soft` | secondary text (≥ 4.5:1 on cream) | 104 82 65 | 186 168 145 |
| `heartwood` | limbs, primary wood tone | 138 90 59 | 196 145 106 |
| `sapwood` | pale wood highlight | 222 203 164 | 92 72 55 |
| `ring` | hairlines, borders, growth rings | 212 193 158 | 70 56 45 |
| `moss` | canopy, "evidence for", living | 96 110 56 | 156 172 104 |

The page carries a very faint grain (SVG noise, ~3% opacity) so large cream areas don't read as flat UI grey-beige. It must stay invisible at a glance.

**Family accent:** one earth-leaning accent per family, stored in the family's content file (`accent.light` / `accent.dark`), scoped via `--accent`. Every family page, card and tree takes its accent; nothing else in the UI uses saturated color. Accents must hold 4.5:1 against `cream` in their scheme because they are used for small label text.

**Contested turning points:** a hatched underline in the family accent (`.contested-mark`), and dashed ring-marks on the tree.

**Contested Classifications:** visibly lower confidence than settled Turning Points: a dashed ring-boundary border, and a three-ring confidence glyph where the number of solid rings shows the status (2 widely accepted · 1 minority · 0 largely rejected). Uncertainty is drawn, not just labelled.

## Layout & surfaces
- Max content width 72rem; 16px side gutters on phones, 24px from `sm`.
- Surfaces are flat: 1px `ring` hairline borders, `paper` fill, radius 6–10px. Shadows only as a soft, warm lift on hover (never grey drop shadows at rest).
- No cards inside cards. Chapter prose never sits in a card.

## Landing page
With many families covered, the landing page is an **index**, not a stack of essays:
- Hero: the thesis line, a short intro and a quiet count of what the book covers (families · branches · turning points · sound laws), with the large growth-ring cross-section as the illustration.
- Families: a responsive grid of family cards (1 → 2 → 3 columns), each with its accent as a thin top rule, its superfamily in specimen type, the name, a two-to-three-line summary clamp, and counts. The whole card is the link.
- Then the comparative sound-law entry point and the "what each branch records" explainer.

## The branch tree / spine view
The signature visual, drawn as **a tree in cross-section** rather than a flat organizational chart or Field Atlas's survey-map lines. It sits on its own `paper` plate so it reads as the page's figure.
- Each split (a branch gaining successors) reads as a limb forking from a trunk.
- Contact-driven convergence (a branch with more than one parent) reads as a graft point — visually distinct from an ordinary fork.
- Turning points sit as ring-marks along a branch's length; a SOUND_LAW is a full ring boundary across the limb.
- Contested Classifications sit outside the tree proper as faint dotted arcs between the branches they would join.
- Extinct branches are snapped, desaturated limbs; living leaves carry a moss canopy.

## Branch page layout
- Header: breadcrumb, branch name (Fraunces), the defining innovation in a larger italic register, era/region as specimen labels, all on a faint accent wash that fades into the page.
- Body: chapters in the reading column; chapter headings carry a small ring numeral.
- Sidebar (desktop): "On this page" with the current section highlighted as you read, then lineage (grows from / branches into / canopy). On phones the lineage block moves **below** the reading so the prose starts above the fold; a thin reading-progress rule sits under the header.
- Turning Points: a vertical ring-mark list using specimen-label type.
- Contested Classifications: dashed, lower-confidence panels with evidence for (moss) and against (accent) side by side.
- Figures: inline, tied to their turning points — no standalone bio section.
- End of page: "continue along the limb" links to the previous and next branch in spine order, and back to the tree.

## Motion
Shared house rhythm with the sibling apps: `--ease-grow` `cubic-bezier(0.22, 1, 0.36, 1)`, 600ms base, 1100ms slow. The vocabulary is **growth**, not ink settling — limbs extending from their base, ring-marks appearing as the growth passes them, timeline rings appearing left to right. Page chrome is quieter: hover lifts of 2px, color fades, nothing that bounces. All motion collapses under `prefers-reduced-motion`.

## What to avoid
- No reuse of Field Atlas's parchment/ink palette or survey-stamp metadata typography wholesale.
- No script/glyph-carving visual language — that's [[sulih]]'s territory.
- No genealogy-software look (no pedigree-chart boxes-and-lines) — the tree-in-cross-section framing is the point.
- No literal wood-grain photo textures, gradients-as-decoration, or glassmorphism. Warmth comes from palette and type, not effects.
