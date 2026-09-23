import type { ClassificationStatus, SoundProcess, TurningPointType } from "@/lib/types";

export const TP_LABEL: Record<TurningPointType, string> = {
  SPLIT: "Split",
  SOUND_LAW: "Sound law",
  CONTACT: "Contact",
  WRITING_SYSTEM_ADOPTED: "Writing",
  EXTINCTION: "Extinction",
  REVITALIZATION: "Revitalization",
};

export const STATUS_LABEL: Record<ClassificationStatus, string> = {
  widely_accepted: "Widely accepted",
  minority_position: "Minority position",
  largely_rejected: "Largely rejected",
};

/** How many of three rings are drawn solid: acceptance shown, not just labelled. */
export const STATUS_RINGS: Record<ClassificationStatus, number> = {
  widely_accepted: 2,
  minority_position: 1,
  largely_rejected: 0,
};

/** Row order and wording for the comparative sound-law view. */
export const PROCESSES: { id: SoundProcess; label: string; blurb: string }[] = [
  {
    id: "consonant_shift",
    label: "Consonant shifts",
    blurb: "Whole series of consonants move to a new manner or place, often in a chain where one change makes room for the next.",
  },
  {
    id: "vowel_shift",
    label: "Vowel shifts",
    blurb: "Vowels change quality: raising, fronting, breaking into diphthongs, or diphthongs smoothing into single vowels.",
  },
  {
    id: "lenition",
    label: "Weakening and voicing",
    blurb: "Consonants become voiced, fricative or weaker in particular positions, usually between vowels or after unstressed syllables.",
  },
  {
    id: "merger",
    label: "Mergers",
    blurb: "Two sounds that were distinct fall together, and the old contrast survives only in related languages that kept it.",
  },
  {
    id: "loss",
    label: "Loss",
    blurb: "Sounds disappear: final consonants, unstressed vowels, or a consonant that leaves a lengthened vowel behind.",
  },
  {
    id: "assimilation",
    label: "Assimilation and strengthening",
    blurb: "A sound takes on features of its neighbour (palatalisation, doubling) or hardens into a stronger consonant.",
  },
  {
    id: "prosody",
    label: "Stress and prosody",
    blurb: "Changes to where the accent falls, which in turn drive later loss and weakening.",
  },
];

export const PROCESS_LABEL = Object.fromEntries(PROCESSES.map((p) => [p.id, p.label])) as Record<SoundProcess, string>;
