import fs from "node:fs";
import path from "node:path";
import type { Branch, Family, Figure, Primer, TurningPoint } from "./types";

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

let cache: { families: Family[]; branches: Branch[]; figures: Figure[]; primers: Primer[] } | null = null;

function load() {
  if (!cache) {
    cache = {
      families: readJsonDir<Family>("families"),
      branches: readJsonDir<Branch>("branches"),
      figures: JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "figures.json"), "utf8")) as Figure[],
      primers: fs.existsSync(path.join(CONTENT_DIR, "primers"))
        ? readJsonDir<Primer>("primers").sort((a, b) => a.order - b.order)
        : [],
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

/** Parents before children, siblings in content order: the spine as a list. */
export function spineOrder(familySlug: string): Branch[] {
  const branches = getBranches(familySlug);
  const rootId = getFamily(familySlug)?.root_branch_id ?? "";
  const byId = new Map(branches.map((b) => [b.id, b]));
  const out: Branch[] = [];
  const seen = new Set<string>();
  const visit = (id: string) => {
    const b = byId.get(id);
    if (!b || seen.has(id) || b.parent_ids.some((p) => byId.has(p) && !seen.has(p))) return;
    seen.add(id);
    out.push(b);
    b.successor_ids.forEach(visit);
  };
  visit(rootId);
  branches.forEach((b) => !seen.has(b.id) && out.push(b));
  return out;
}

/** First-parent chain from the root down to (not including) this branch. */
export function ancestry(branch: Branch): Branch[] {
  const chain: Branch[] = [];
  const seen = new Set<string>([branch.id]);
  let cur = branch.parent_ids.map(getBranch).find(Boolean);
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    chain.unshift(cur);
    cur = cur.parent_ids.map(getBranch).find(Boolean);
  }
  return chain;
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

export function getPrimers(): Primer[] {
  return load().primers;
}

export function getPrimer(slug: string): Primer | undefined {
  return load().primers.find((p) => p.slug === slug);
}

/** Leaf branches at or below this one: where `countries` are recorded. */
export function leavesUnder(branch: Branch): Branch[] {
  const out: Branch[] = [];
  const seen = new Set<string>();
  const visit = (b: Branch | undefined) => {
    if (!b || seen.has(b.id)) return;
    seen.add(b.id);
    if (!b.successor_ids.length) out.push(b);
    b.successor_ids.forEach((id) => visit(getBranch(id)));
  };
  visit(branch);
  return out;
}

/** "c. 60 million" → 60000000. Rough, for ordering only; 0 when there is no number. */
export function parseSpeakerCount(text: string | undefined): number {
  const m = text?.replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(million|thousand|m\b|k\b)?/i);
  if (!m) return 0;
  const unit = (m[2] ?? "").toLowerCase();
  return parseFloat(m[1]) * (unit.startsWith("m") ? 1e6 : unit.startsWith("t") || unit === "k" ? 1e3 : 1);
}

export interface CountryRollup {
  iso: string;
  name: string;
  living: boolean; // at least one living branch is spoken here
  weight: number; // summed rough speaker count, for ordering
  entries: { branch: Branch; speakers?: string }[];
}

/** Countries for a set of leaf branches, largest communities first, historical-only last. */
export function rollupCountries(leaves: Branch[]): CountryRollup[] {
  const map = new Map<string, CountryRollup>();
  for (const b of leaves) {
    const extinct = Boolean(b.extinct) || b.speakers?.vitality === "extinct";
    for (const c of b.countries ?? []) {
      const r = map.get(c.iso) ?? { iso: c.iso, name: c.name, living: false, weight: 0, entries: [] };
      r.living ||= !extinct;
      r.weight += parseSpeakerCount(c.speakers);
      r.entries.push({ branch: b, speakers: c.speakers });
      map.set(c.iso, r);
    }
  }
  return [...map.values()].sort((a, b) => Number(b.living) - Number(a.living) || b.weight - a.weight || a.name.localeCompare(b.name));
}
