# Language Lineage — CLAUDE.md

Technical build notes for Claude Code. Read PRD.md and DESIGN.md first.

## Stack
- Frontend-only, static site — no backend, per standing preference for portfolio apps that deploy on GitHub Pages.
- Next.js 14 (static export) + Tailwind CSS, matching the established frontend stack.
- Content as structured files in the repo (JSON or MDX with frontmatter), not a database — corrections are a repo edit, same as every sibling app.
- D3.js for the branch-tree/spine view (branching DAG layout, same rationale as Field Atlas's field tree — v1 is only 3–5 nodes, so a manual layered layout is enough; no general graph-layout library needed at this scale).
- No specialized notation renderer needed (unlike Field Atlas's optional KaTeX) — this domain's technical content is IPA transcription. If sound laws need phonetic notation, use a proper IPA-capable web font rather than image assets, so transcriptions stay selectable/searchable text.

## Data model

```
Branch {
  id: string
  family: string               // e.g. "Indo-European", "Austronesian" — top-level grouping, filterable like Field Atlas's domain
  name: string
  parent_ids: string[]         // DAG — supports contact-driven multiple ancestry
  successor_ids: string[]      // denormalized inverse of parent_ids
  era: string
  region: string
  defining_innovation: string  // one line: what split this off from its parent
  chapters: Chapter[]
  turning_points: TurningPoint[]
  contested_classifications: ContestedClassification[]
  figure_ids: string[]
}

Chapter {
  title: string
  body: string                 // markdown/MDX
}

TurningPoint {
  id: string
  branch_id: string
  date: string                 // often approximate/ranged — store as text, not a strict date type
  type: "SPLIT" | "SOUND_LAW" | "CONTACT" | "WRITING_SYSTEM_ADOPTED" | "EXTINCTION" | "REVITALIZATION"
  description: string
  contested: boolean
  sources: Source[]
}

ContestedClassification {
  id: string
  branch_id: string
  proposed_grouping: string
  status: "widely_accepted" | "minority_position" | "largely_rejected"
  evidence_for: string
  evidence_against: string
}

Figure {
  id: string
  name: string
  branch_ids: string[]
  turning_point_ids: string[]  // contributions tied to specific events, not standalone bio
}

Source {
  citation: string
  url: string | null
}
```

Keep this schema self-contained to this app (not merged into Field Atlas's shared collections) — different domain, different app, per PRD.md's framing as a standalone sibling rather than a fourth Field Atlas domain.

## Content authoring
One file per Branch (e.g. `content/branches/west-germanic.json` or `.mdx`), same single-file-diff-correction model as the sibling apps.

## Pages / routing
- `/` — family landing (v1: single family, but leave room for `/[family-slug]` to branch as coverage widens)
- `/[family-slug]` — branch tree / spine view for that family
- `/[family-slug]/[branch-slug]` — branch page

## Branch tree rendering
Same DAG-not-strict-chain caveat as Field Atlas: contact-driven branches can have more than one parent. Don't assume a pure linear timeline component.

## Deployment
Static export → GitHub Pages, same as the other portfolio-vertical apps.

## Visual identity
Distinct from Field Atlas and the other siblings — see DESIGN.md. Shared house rhythm (timing/easing/quality floor), own color/typeface/layout.
