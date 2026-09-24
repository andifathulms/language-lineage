# Language Lineage

A read-only narrative encyclopedia of language families. It covers how each branch split from its parent, the dated sound laws and contact events behind each split, and the classifications historical linguists still dispute.

Eight families are covered:

- **Germanic** (Indo-European), 12 branches. v1 proved the format on a five-node thread here, and it was then widened: Proto-Germanic → East Germanic †, North Germanic (→ West Norse, East Norse), West Germanic (→ Anglo-Frisian (→ Anglic, Frisian), Low German, Low Franconian, High German).
- **Austronesian**, 7 branches: Proto-Austronesian → Formosan languages, Malayo-Polynesian (→ Malayic, Barito, Oceanic (→ Polynesian)).
- **Uralic**, 8 branches: Proto-Uralic → Samoyedic, Finnic, Saami, Permic, Ugric (→ Hungarian, Ob-Ugric). The first split is drawn as a fan because the intermediate Finno-Ugric node is disputed.
- **Turkic**, 7 branches: Proto-Turkic → Oghur, Common Turkic (→ Oghuz, Kipchak, Karluk, Lena Turkic). Of the Siberian Turkic languages only Sakha and Dolgan are drawn, since the grouping of the rest is uncertain.
- **Semitic** (Afroasiatic), 9 branches: Proto-Semitic → East Semitic †, West Semitic (→ Ethiosemitic, Central Semitic (→ Arabic, Northwest Semitic (→ Aramaic, Canaanite))). The South Arabian languages are left out until their position is clearer.
- **Bantu** (Niger-Congo), 7 branches: Proto-Bantu → Northwest Bantu, Western Bantu, Eastern Bantu (→ Great Lakes Bantu, Sabaki, Kusi). Northwest Bantu is drawn as one limb but is a geographical label, and Guthrie's zones are not used as branches.
- **Mayan**, 9 branches: Proto-Mayan → Huastecan, Yucatecan, Western Mayan (→ Cholan-Tzeltalan, Q'anjob'alan), Eastern Mayan (→ K'iche'an, Mamean), following Kaufman's classification.
- **Dravidian**, 9 branches: Proto-Dravidian → North Dravidian, Central Dravidian, South Dravidian (→ South-Central Dravidian, South Dravidian I (→ Tulu, Kannada, Tamil-Malayalam)), following Krishnamurti (2003).

The **comparative sound-law view** (`/sound-laws/`) lines up every sound law across families on one timeline and in a matrix by kind of change. That completes PRD.md's v2 list.

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
- **Sound laws** (`SOUND_LAW` turning points) must also set `process` (the kind of change, used as the comparison row), `notation` (the change in IPA, e.g. `*p *t *k → *f *θ *x`) and `sort_year` (a rough midpoint for the timeline; negative is BCE). The free-text `date` stays the text of record.
- **Turning points** are listed oldest first. The tree places them along the limb in that order.
- **Contested classifications** may set `linked_branch_ids` to draw a dotted arc between the branches the grouping would join.
- Each family file sets `buried_root`, the ancestry below its root branch. Setting `proven: false` draws the roots faint and dashed.
- Optional extensions to the CLAUDE.md schema: `Branch.extinct`, `Branch.descendants`, `TurningPoint.title`, `ContestedClassification.linked_branch_ids` / `sources`, `Figure.lifespan`, and the `Family` file itself.

`npm run validate` checks parent/successor symmetry, id uniqueness, figure links, required sources and that the lineage is acyclic. It runs before every build.

Prose is AI-drafted with citations and still needs specialist review.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages. The base path for a project page is picked up automatically. In the repository settings, set **Pages → Source** to **GitHub Actions**.
