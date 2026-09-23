# Language Lineage

A read-only narrative encyclopedia of language families. It covers how each branch split from its parent, the dated sound laws and contact events behind each split, and the classifications historical linguists still dispute.

The pilot family is **Germanic** (Indo-European). v1 proved the format on a five-node thread, and the tree has since been widened to twelve branches:

- Proto-Germanic → East Germanic †, North Germanic, West Germanic
- North Germanic → West Norse, East Norse
- West Germanic → Anglo-Frisian, Low German, Low Franconian, High German
- Anglo-Frisian → Anglic, Frisian

Still to come, from PRD.md's v2 list: more families, then the comparative sound-law view across them.

See [PRD.md](PRD.md) for scope, [DESIGN.md](DESIGN.md) for visual identity and [CLAUDE.md](CLAUDE.md) for build notes.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # content integrity check
npm run build      # validate + static export to out/
```

## Content

All content is JSON in `content/`. There is no database, so a correction is an edit to one file.

```
content/
  families/<slug>.json    # family: summary, accent colour, root branch
  branches/<id>.json      # one file per branch (file name = id)
  figures.json            # people, tied to turning point ids
```

Conventions:

- **IPA and reconstructed forms** go in inline code (`` `*kuningaz` ``). They render in Gentium Plus as selectable text.
- **Turning points** are listed oldest first. The tree places them along the limb in that order.
- **Contested classifications** may set `linked_branch_ids` to draw a dotted arc between the branches the grouping would join.
- Each family file sets `buried_root`, the ancestry below its root branch. Setting `proven: false` draws the roots faint and dashed.
- Optional extensions to the CLAUDE.md schema: `Branch.extinct`, `Branch.descendants`, `TurningPoint.title`, `ContestedClassification.linked_branch_ids` / `sources`, `Figure.lifespan`, and the `Family` file itself.

`npm run validate` checks parent/successor symmetry, id uniqueness, figure links, required sources and that the lineage is acyclic. It runs before every build.

Prose is AI-drafted with citations and still needs specialist review.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages. The base path for a project page is picked up automatically. In the repository settings, set **Pages → Source** to **GitHub Actions**.
