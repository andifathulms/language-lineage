// Data model — mirrors CLAUDE.md. Self-contained to this app.
// Optional fields marked "extension" are additions the tree view needs;
// they are safe to omit in content files.

export type TurningPointType =
  | "SPLIT"
  | "SOUND_LAW"
  | "CONTACT"
  | "WRITING_SYSTEM_ADOPTED"
  | "EXTINCTION"
  | "REVITALIZATION";

// Kind of sound change, used to line up sound laws across families.
export type SoundProcess =
  | "consonant_shift"
  | "vowel_shift"
  | "lenition"
  | "merger"
  | "loss"
  | "assimilation"
  | "prosody";

export type ClassificationStatus = "widely_accepted" | "minority_position" | "largely_rejected";

// UNESCO's language vitality scale; "mixed" for a branch whose languages differ.
export type Vitality =
  | "safe"
  | "vulnerable"
  | "definitely_endangered"
  | "severely_endangered"
  | "critically_endangered"
  | "extinct"
  | "mixed";

export interface Source {
  citation: string;
  url: string | null;
}

export interface Chapter {
  title: string;
  body: string; // markdown; inline code (`…`) renders as an IPA transcription
}

export interface TurningPoint {
  id: string;
  branch_id: string;
  date: string; // approximate/ranged — free text, listed in chronological order
  type: TurningPointType;
  title: string; // extension: short label for the ring-mark
  description: string;
  contested: boolean;
  sources: Source[];
  // Required on SOUND_LAW turning points (extension), for the comparative view:
  process?: SoundProcess;
  notation?: string; // the change itself, rendered in the IPA face, e.g. "*p *t *k → *f *θ *x"
  sort_year?: number; // rough midpoint for plotting; negative = BCE. `date` stays the text of record.
}

export interface ContestedClassification {
  id: string;
  branch_id: string;
  proposed_grouping: string;
  status: ClassificationStatus;
  evidence_for: string;
  evidence_against: string;
  linked_branch_ids?: string[]; // extension: branches the grouping would join (drawn as a dotted arc)
  sources?: Source[]; // extension
}

export interface Branch {
  id: string;
  family: string; // family slug
  name: string;
  parent_ids: string[];
  successor_ids: string[];
  era: string;
  region: string;
  defining_innovation: string;
  extinct?: boolean; // extension: drawn as a dead limb that stops short of the canopy
  descendants?: string[]; // extension: modern/attested languages shown at the canopy
  chapters: Chapter[];
  speakers?: Speakers; // extension: present-day speakers of everything below this branch
  countries?: CountryPresence[]; // extension: on leaf branches; internal branches aggregate their subtree
  sample?: Sample; // extension: one short attested phrase from a descendant language
  turning_points: TurningPoint[];
  contested_classifications: ContestedClassification[];
  figure_ids: string[];
}

export interface Speakers {
  estimate: string; // free text, e.g. "c. 60 million"; "None (extinct since 2008)"
  vitality: Vitality;
  note?: string;
  sources: Source[];
}

export interface CountryPresence {
  iso: string; // ISO 3166-1 alpha-3, used to shade the map
  name: string;
  speakers?: string; // rough estimate in this country; omitted for extinct branches
}

export interface Sample {
  language: string;
  text: string; // as written, in the native script if it has one
  transliteration?: string; // for non-Latin scripts
  ipa?: string;
  gloss?: string; // word-by-word, words separated by spaces to line up with `text`
  translation: string;
  sources: Source[];
}

export interface CognateLanguage {
  name: string;
  branch_id: string;
}

export interface CognateRow {
  gloss: string; // the meaning, e.g. "eye"
  proto: string | null; // reconstructed form, without the asterisk
  forms: (string | null)[]; // one per language, same order; null where no cognate survives
}

export interface Correspondence {
  label: string; // e.g. "*C"
  reflexes: (string | null)[]; // what it became in each language, same order as `languages`
  rows: number[]; // indices of the rows that show it
}

export interface CognateTable {
  intro: string; // markdown paragraph
  proto_label: string; // column heading, e.g. "Proto-Austronesian"
  languages: CognateLanguage[];
  rows: CognateRow[];
  correspondences: Correspondence[];
  sources: Source[];
}

export interface Primer {
  slug: string;
  order: number;
  title: string;
  summary: string;
  chapters: Chapter[];
  sources: Source[];
}

export interface Figure {
  id: string;
  name: string;
  lifespan?: string; // extension
  branch_ids: string[];
  turning_point_ids: string[];
}

export interface Family {
  slug: string;
  name: string;
  superfamily: string | null;
  summary: string;
  root_branch_id: string;
  // What lies below the root: shown in the tree's soil and on the root branch page.
  buried_root: { name: string; note: string; proven: boolean };
  accent: { light: string; dark: string }; // RGB triplets, e.g. "156 74 34"
  sources: Source[];
  essay?: Chapter[]; // extension: the long read on the family page
  essay_sources?: Source[];
  cognates?: CognateTable; // extension: "How we know" on the family page
}
