import fs from "node:fs";
import path from "node:path";
import type { Branch, Family, Figure, TurningPoint } from "./types";

export interface SoundLawEntry {
  tp: TurningPoint;
  branch: Branch;
  family: Family;
}

// Build-time content access. Everything is read from /content at build and
// baked into the static export; nothing here runs in the browser.

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJsonDir<T>(dir: string): T[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf8")) as T);
}

let cache: { families: Family[]; branches: Branch[]; figures: Figure[] } | null = null;

function load() {
  if (!cache) {
    cache = {
      families: readJsonDir<Family>("families"),
      branches: readJsonDir<Branch>("branches"),
      figures: JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "figures.json"), "utf8")) as Figure[],
    };
  }
  return cache;
}

export function getFamilies(): Family[] {
  return load().families;
}

export function getFamily(slug: string): Family | undefined {
  return load().families.find((f) => f.slug === slug);
}

export function getBranches(familySlug?: string): Branch[] {
  const all = load().branches;
  return familySlug ? all.filter((b) => b.family === familySlug) : all;
}

export function getBranch(id: string): Branch | undefined {
  return load().branches.find((b) => b.id === id);
}

export function getFigures(): Figure[] {
  return load().figures;
}

/** Figures credited on a given turning point. */
export function figuresForTurningPoint(tp: TurningPoint): Figure[] {
  return load().figures.filter((f) => f.turning_point_ids.includes(tp.id));
}

/** Figures on a branch who aren't tied to any of its turning points. */
export function unattachedFigures(branch: Branch): Figure[] {
  const tpIds = new Set(branch.turning_points.map((t) => t.id));
  return load().figures.filter(
    (f) => branch.figure_ids.includes(f.id) && !f.turning_point_ids.some((id) => tpIds.has(id)),
  );
}

export function familyStats(familySlug: string) {
  const branches = getBranches(familySlug);
  return {
    branches: branches.length,
    turningPoints: branches.reduce((n, b) => n + b.turning_points.length, 0),
    contested: branches.reduce((n, b) => n + b.contested_classifications.length, 0),
  };
}

/** Every sound law across all families, oldest first, for the comparative view. */
export function getSoundLaws(): SoundLawEntry[] {
  const { families, branches } = load();
  return branches
    .flatMap((branch) =>
      branch.turning_points
        .filter((tp) => tp.type === "SOUND_LAW")
        .map((tp) => ({ tp, branch, family: families.find((f) => f.slug === branch.family)! })),
    )
    .sort((a, b) => (a.tp.sort_year ?? 0) - (b.tp.sort_year ?? 0));
}
