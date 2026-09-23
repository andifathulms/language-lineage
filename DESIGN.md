# Language Lineage — DESIGN.md

## Concept
Where Field Atlas reads as a survey map (ink, charted vs. unmapped terrain), Language Lineage should read as **growth rings and root systems** — a family tree grown from a buried proto-form, branching and thickening over centuries, with living descendants as the visible canopy. The metaphor fits the content directly: a Branch literally grows out of its parent the way a limb grows from a trunk, and a sound law is the ring-boundary marking when the growth changed direction.

This keeps Language Lineage visually distinct from both Field Atlas (map/ink/parchment) and [[sulih]] (Lontara script-carving aesthetic) — this app isn't about maps or glyphs, it's about organic branching growth over time.

## Typography
- **Headings / branch names:** a serif with warmth rather than Field Atlas's austere survey-stamp feel — something that reads as grown, not surveyed (a humanist serif like Source Serif 4 works for both apps' base, but weight/size treatment here should feel rounder, less rigid).
- **Body / chapter prose:** same reading-first principle as every sibling app — long-form column, no card treatment.
- **Turning point tags (SPLIT, SOUND_LAW, CONTACT, etc.):** a monospace or slab, but styled more like a specimen label pinned to a ring — not Field Atlas's field-stamp register. Keep the two apps' metadata typography visibly different even if the underlying font choice overlaps.
- **IPA transcriptions:** must render in a proper IPA-capable font — treat this as functional typography, not decorative; sound-law content is unreadable if the phonetic characters don't render correctly.

## Color
- **Base:** warm wood-tone neutrals — bark brown, aged cream — rather than Field Atlas's paper-and-ink duotone.
- **Family accent:** one warm earth accent per family covered (v1: a single accent for the pilot family; more families get their own accent as width phase adds them, same extensibility principle as Field Atlas's per-domain accents).
- **Contested turning points:** a small hatch or underline treatment, consistent in spirit with Field Atlas's CONTESTED marker but in this app's own accent, not imported wholesale.
- **Contested Classifications:** rendered with visibly lower confidence than settled Turning Points — e.g. a dashed ring-boundary instead of a solid one — the same "uncertainty shown, not just labeled" principle as Field Atlas's Open Problems, adapted to this domain's different kind of unresolved (enduring disagreement, not unsolved-but-solvable).

## The branch tree / spine view
The signature visual, drawn as **a tree in cross-section** rather than a flat organizational chart or Field Atlas's survey-map lines:
- Each split (a branch gaining successors) reads as a limb forking from a trunk.
- Contact-driven convergence (a branch with more than one parent) reads as a graft point — visually distinct from an ordinary fork, since it's a genuinely different kind of event (two lineages meeting, not one splitting).
- Turning points sit as ring-marks along a branch's length — a SOUND_LAW turning point can be drawn as a visible ring boundary, since that's literally what a sound law is: the marker between "before" and "after."
- Contested Classifications, being enduring rather than resolving, might sit outside the tree proper — e.g. as a faint dotted connection between two branches that may or may not share a deeper root, rather than as a waypoint on the tree itself.

## Branch page layout
- Header: branch name (serif), one-line defining innovation in a smaller italic register underneath.
- Chapters: plain reading column, consistent with every sibling app.
- Turning Points: a vertical ring-mark list, using the specimen-label metadata typography above.
- Contested Classifications: visually set apart with the dashed/lower-confidence treatment, positioned so a reader immediately recognizes "this is an ongoing disagreement," distinct from Field Atlas's fading-ink treatment for genuinely open problems.
- Figures: inline, tied to their turning points — not a standalone bio section, consistent with every sibling app's people-are-not-the-point stance.

## Motion
Shared house rhythm (timing/easing/quality floor) with the sibling apps, but this app's motion vocabulary should feel like **growth**, not ink settling — branches extending and ring-marks appearing as the tree draws itself in, rather than Field Atlas's redrawing-map feel. Subtle, not a showpiece.

## What to avoid
- No reuse of Field Atlas's parchment/ink palette or survey-stamp metadata typography wholesale — same house rhythm, different per-app identity, per standing preference.
- No script/glyph-carving visual language — that's [[sulih]]'s territory; this app is about branching growth, not writing systems.
- No genealogy-software look (no generic pedigree-chart boxes-and-lines) — the tree-in-cross-section framing is the point.
