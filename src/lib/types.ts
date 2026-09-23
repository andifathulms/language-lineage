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
  turning_points: TurningPoint[];
  contested_classifications: ContestedClassification[];
  figure_ids: string[];
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
}
