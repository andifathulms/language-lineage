# Language Lineage

A read-only narrative encyclopedia of language families. It covers how each branch split from its parent, the dated sound laws and contact events behind each split, and the classifications historical linguists still dispute.

Eighteen families are covered:

- **Germanic** (Indo-European), 12 branches. v1 proved the format on a five-node thread here, and it was then widened: Proto-Germanic → East Germanic †, North Germanic (→ West Norse, East Norse), West Germanic (→ Anglo-Frisian (→ Anglic, Frisian), Low German, Low Franconian, High German).
- **Austronesian**, 10 branches: Proto-Austronesian → Formosan languages, Malayo-Polynesian (→ Philippine, Chamic, Malayic, Barito, Central Malayo-Polynesian, Oceanic (→ Polynesian)). Philippine and Central Malayo-Polynesian are drawn as limbs, though their status as subgroups is debated.
- **Uralic**, 10 branches: Proto-Uralic → Samoyedic, Finnic, Saami, Mordvinic, Mari, Permic, Ugric (→ Hungarian, Ob-Ugric). The first split is drawn as a fan because the intermediate Finno-Ugric node is disputed.
- **Turkic**, 9 branches: Proto-Turkic → Oghur, Common Turkic (→ Oghuz, Arghu, Kipchak, Karluk, South Siberian, Lena Turkic), following Johanson's six Common Turkic branches.
- **Semitic** (Afroasiatic), 11 branches: Proto-Semitic → East Semitic †, West Semitic (→ Ethiosemitic, Modern South Arabian, Old South Arabian †, Central Semitic (→ Arabic, Northwest Semitic (→ Aramaic, Canaanite))). No South Semitic node is drawn, because that grouping is disputed.
- **Bantu** (Niger-Congo), 9 branches: Proto-Bantu → Northwest Bantu, Western Bantu, Luban, Eastern Bantu (→ Great Lakes Bantu, Sabaki, Nyasa, Kusi). Northwest Bantu is drawn as one limb but is a geographical label, and Guthrie's zones are not used as branches.
- **Mayan**, 9 branches: Proto-Mayan → Huastecan, Yucatecan, Western Mayan (→ Cholan-Tzeltalan, Q'anjob'alan), Eastern Mayan (→ K'iche'an, Mamean), following Kaufman's classification.
- **Dravidian**, 9 branches: Proto-Dravidian → North Dravidian, Central Dravidian, South Dravidian (→ South-Central Dravidian, South Dravidian I (→ Tulu, Kannada, Tamil-Malayalam)), following Krishnamurti (2003).
- **Austroasiatic**, 11 branches: Proto-Austroasiatic → Munda, Khasian, Palaungic, Vietic, Katuic, Bahnaric, Khmeric, Monic, Aslian, Nicobarese, drawn as a single fan because the family has about a dozen primary branches and no well-supported intermediate groups. Khmuic, Pearic, Pakanic and Mangic are not yet drawn.
- **Uto-Aztecan**, 11 branches: Proto-Uto-Aztecan → Northern (→ Numic, Hopi, Tübatulabal, Takic), Southern (→ Tepiman, Taracahitan, Corachol, Aztecan).
- **Pama-Nyungan**, 10 branches: Proto-Pama-Nyungan → Western Desert, Ngumpin-Yapa, Arandic, Karnic, Thura-Yura, Yolŋu Matha, Paman, Kulin, Wiradhuric, drawn as a fan because the higher subgrouping is uncertain.
- **Sino-Tibetan**, 10 branches: Proto-Sino-Tibetan → Sinitic, Tibeto-Burman (→ Tibetic, Kiranti, Lolo-Burmese, Karenic, Kuki-Chin, Tani, Sal), with Sinitic as the first split following the 2019 phylogenies. Qiangic, Nungish, Tamangic and other subgroups are not yet drawn.
- **Algonquian** (Algic), 11 branches: Proto-Algonquian → Blackfoot, Arapahoan, Cheyenne, Cree–Innu, Ojibwe, Menominee, Meskwaki-Sauk-Kickapoo, Miami-Illinois, Shawnee, Eastern Algonquian. Only Eastern Algonquian is a proven subgroup, so the rest are drawn directly from the root.
- **Japonic**, 7 branches: Proto-Japonic → Mainland Japonic (→ Japanese, Hachijō), Ryukyuan (→ Northern Ryukyuan, Southern Ryukyuan).
- **Koreanic**, 3 branches: Proto-Koreanic → Korean, Jeju.
- **Kra-Dai**, 9 branches: Proto-Kra-Dai → Kra, Hlai, Kam-Sui, Be, Tai (→ Northern Tai, Central Tai, Southwestern Tai).
- **Quechuan**, 6 branches: Proto-Quechua → Central Quechua (Quechua I), Quechua II (→ Northern Peruvian, Kichwa, Southern Quechua), following Torero's classification.
- **Na-Dene** (Athabaskan-Eyak-Tlingit), 8 branches: Proto-Na-Dene → Tlingit, Athabaskan-Eyak (→ Eyak †, Athabaskan (→ Northern Athabaskan, Pacific Coast Athabaskan, Apachean)). Northern Athabaskan is drawn as one limb but is a geographical continuum, not a proven subgroup.

The **comparative sound-law view** (`/sound-laws/`) lines up every sound law across families on one timeline and in a matrix by kind of change. That completes PRD.md's v2 list.

Each family page also has a **long-read essay** (how the family was recognised, its homeland and spread, what the languages share, the open questions), a **cognate table** where picking a sound highlights its regular correspondences, and a **map of where it is spoken today**, built from per-country speaker estimates. Each branch page gives present-day **speakers** with a UNESCO vitality level, the **countries** where it is spoken, and, where one could be sourced with confidence, a short **sample phrase** with a word-by-word gloss. Four **primers** (`/primers/`) explain the comparative method, sound laws, how splits are dated and why some groupings stay disputed.

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
  primers/<slug>.json     # method explainers, ordered by `order`
```

Conventions:

- **IPA and reconstructed forms** go in inline code (`` `*kuningaz` ``). They render in Gentium Plus as selectable text.
- **Sound laws** (`SOUND_LAW` turning points) must also set `process` (the kind of change, used as the comparison row), `notation` (the change in IPA, e.g. `*p *t *k → *f *θ *x`) and `sort_year` (a rough midpoint for the timeline; negative is BCE). The free-text `date` stays the text of record.
- **Turning points** are listed oldest first. The tree places them along the limb in that order.
- **Contested classifications** may set `linked_branch_ids` to draw a dotted arc between the branches the grouping would join.
- Each family file sets `buried_root`, the ancestry below its root branch. Setting `proven: false` draws the roots faint and dashed.
- **Depth fields**: `Family.essay` / `essay_sources` / `cognates`, and `Branch.speakers` / `countries` / `sample`. `countries` goes on leaf branches only, with ISO 3166-1 alpha-3 codes; internal branches and the family map aggregate their subtree. A sample's `gloss` must have as many space-separated words as its `transliteration` (or `text`).
- Optional extensions to the CLAUDE.md schema: `Branch.extinct`, `Branch.descendants`, `TurningPoint.title`, `ContestedClassification.linked_branch_ids` / `sources`, `Figure.lifespan`, and the `Family` file itself.

`npm run validate` checks parent/successor symmetry, id uniqueness, figure links, required sources, sound-law metadata, that no event from 1500 on is cited only to sources older than itself, that the lineage is acyclic, and that cognate tables, country codes, vitality levels and sample glosses are well formed. It runs before every build.

Prose is AI-drafted with citations and still needs specialist review.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages. The base path for a project page is picked up automatically. In the repository settings, set **Pages → Source** to **GitHub Actions**.
