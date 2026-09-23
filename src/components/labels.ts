import type { ClassificationStatus, TurningPointType } from "@/lib/types";

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
