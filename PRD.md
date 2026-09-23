# Language Lineage — PRD

## What this is
A read-only narrative encyclopedia of language families and branches — how one branch split from another, the dated sound changes and contact events that drove each split, and the macro-family classifications that remain genuinely disputed among historical linguists.

Sibling project to [[empire-rankings]] (succession/causation applied to polities), [[ruleset]] (rule-change timeline applied to sports), and [[science-encyclopedia]] (Field Atlas — turning points/open problems applied to math, physics, biology). Language Lineage applies the same shape to language: succession like the empire app, but the story is sound change and split, not conquest and dynasty.

## Motivation
Extends the "explain how a domain came to be divided the way it is" pattern to language: why does West Germanic exist as separate from Proto-Germanic, what sound law forced the split, and which macro-family groupings (Altaic, Nostratic, Austric) are still fought over rather than settled. Distinct from [[nusantara-languages]] (a geographic speaker-area map) and [[lapis]] (a borrowing/loanword transmission graph) — this app is causal and narrative, not spatial or lexical.

## Scope — v1
One narrow vertical: a single family's branching thread, 3–5 nodes deep, picked at build time rather than defaulted here (same discipline as Field Atlas's undecided pilot domain). Depth (more branches within the family) and width (more families) come after the format is proven.

## Non-goals (v1)
- No rating/metric layer, consistent with Field Atlas.
- No user accounts, no editing, no contributions — static site, corrections via repo edit, same as every sibling app.
- No individual-word-level etymology tracing (that's [[lapis]]'s job) — the entry unit here is the branch/family, not the word.
- No live dialectology or endangerment tracking — this is historical, not a living-languages status tracker.
- No exhaustive family coverage in v1.

## Content unit: the Branch
A Branch is a family/subfamily-level entry (e.g. "West Germanic," not "German," and not "Indo-European" as a whole). Each Branch has:
- A parent branch (or none, if root) and successor branches — a DAG, not a strict chain, since contact-driven convergence (creoles, sprachbunds, areal diffusion) can give a branch more than one ancestor
- An era/region it's associated with
- A one-line statement of what distinguishes it from its parent (the innovation that defines the split)
- Flexible narrative chapters, variable per branch (e.g. "Origins," "The Defining Sound Shift," "Daughter Branches," "Modern Descendants")
- A list of Turning Points
- A list of Contested Classifications
- A list of Figures, tied to specific turning points rather than given standalone biography treatment

## Turning Points
Dated events in a branch's history, tagged by type: SPLIT, SOUND_LAW, CONTACT, WRITING_SYSTEM_ADOPTED, EXTINCTION, REVITALIZATION. A CONTESTED flag marks turning points where dating, causation, or priority (who first formulated a given sound law, and when it actually took hold) is genuinely disputed among sources — same mechanism as the CONTESTED tag in [[empire-rankings]] and Field Atlas.

## Contested Classifications
This domain's equivalent of Field Atlas's Open Problems, reframed for the difference in kind: language macro-family groupings (Altaic, Nostratic, Austric, the internal shape of Trans-New Guinea) aren't unsolved-but-solvable the way a math conjecture is — they're live scholarly disagreements that may never fully resolve. Per classification: the proposed grouping, its status (widely accepted / minority position / largely rejected), the evidence offered for it, and the evidence or methodological objection against it. Framed neutrally — this section states positions and their grounds, not which side is correct.

## Views
1. **Family landing** — entry point into the family/families covered.
2. **Branch tree / spine view** — the succession thread, drawn as a branching tree (DAG), same structural approach as Field Atlas's field tree.
3. **Branch page** — chapters, turning points, contested classifications, figures, predecessor/successor links.
4. **Comparative sound-law view** (later, width phase) — align sound changes across branches/families side by side, once there's more than one family covered.

## Content sourcing
Page prose AI-drafted with citations attached (Glottolog, published sound-law catalogs, WOLD-style contact data), then reviewed — same process as the sibling apps. Where sources disagree on dating or grouping, state the disagreement rather than picking a side.

## v2 / later
- Widen the pilot family's branch tree beyond the v1 thread.
- Add additional families.
- Comparative sound-law view across families.
- Revisit whether this app eventually absorbs or cross-links with [[nusantara-languages]] (geographic family map) and [[lapis]] (loanword transmission graph) rather than remaining fully separate — worth deciding once this app has real content, not before.
