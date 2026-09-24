// Referential-integrity check for /content. Runs before every build so a bad
// edit fails loudly instead of rendering a broken tree.
import fs from "node:fs";
import path from "node:path";
import countries from "i18n-iso-countries";

const root = path.join(process.cwd(), "content");
const readDir = (d) =>
  fs
    .readdirSync(path.join(root, d))
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: `${d}/${f}`, data: JSON.parse(fs.readFileSync(path.join(root, d, f), "utf8")) }));

const families = readDir("families");
const branches = readDir("branches");
const figures = JSON.parse(fs.readFileSync(path.join(root, "figures.json"), "utf8"));
const primers = fs.existsSync(path.join(root, "primers")) ? readDir("primers") : [];

const TP_TYPES = new Set(["SPLIT", "SOUND_LAW", "CONTACT", "WRITING_SYSTEM_ADOPTED", "EXTINCTION", "REVITALIZATION"]);
const PROCESSES = new Set(["consonant_shift", "vowel_shift", "lenition", "merger", "loss", "assimilation", "prosody"]);
const STATUSES = new Set(["widely_accepted", "minority_position", "largely_rejected"]);
const VITALITY = new Set([
  "safe",
  "vulnerable",
  "definitely_endangered",
  "severely_endangered",
  "critically_endangered",
  "extinct",
  "mixed",
]);
const words = (s) => s.trim().split(/\s+/).length;

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

const familySlugs = new Set(families.map((f) => f.data.slug));
const byId = new Map(branches.map((b) => [b.data.id, b.data]));
const tpIds = new Map();
const figureIds = new Set(figures.map((f) => f.id));

for (const { file, data: f } of families) {
  if (`families/${f.slug}.json` !== file) err(file, `file name should match slug "${f.slug}"`);
  if (!byId.has(f.root_branch_id)) err(file, `root_branch_id "${f.root_branch_id}" not found`);
  if (!f.buried_root?.name) err(file, "missing buried_root (what lies below the root branch)");
  if (!f.essay?.length) err(file, "missing essay (the family long read)");
  if (!f.cognates) err(file, "missing cognates (the How-we-know table)");
  if (f.essay) {
    if (!f.essay.length || f.essay.some((c) => !c.title || !c.body)) err(file, "essay chapters need a title and body");
    if (!f.essay_sources?.length) err(file, "essay needs essay_sources");
  }
  const ct = f.cognates;
  if (ct) {
    const n = ct.languages.length;
    for (const l of ct.languages) {
      const b = branches.find((x) => x.data.id === l.branch_id)?.data;
      if (!b || b.family !== f.slug) err(file, `cognate language "${l.name}" points at "${l.branch_id}", not a branch of this family`);
    }
    ct.rows.forEach((r, i) => {
      if (r.forms.length !== n) err(file, `cognate row ${i} ("${r.gloss}") has ${r.forms.length} forms for ${n} languages`);
    });
    for (const c of ct.correspondences) {
      if (c.reflexes.length !== n) err(file, `correspondence "${c.label}" has ${c.reflexes.length} reflexes for ${n} languages`);
      if (!c.rows.length || c.rows.some((i) => !ct.rows[i])) err(file, `correspondence "${c.label}" points at missing rows`);
    }
    if (!ct.sources?.length) err(file, "cognate table needs sources");
  }
}

for (const { file, data: p } of primers) {
  if (`primers/${p.slug}.json` !== file) err(file, `file name should match slug "${p.slug}"`);
  if (!p.chapters?.length || !p.sources?.length) err(file, "primer needs chapters and sources");
}

for (const { file, data: b } of branches) {
  if (`branches/${b.id}.json` !== file) err(file, `file name should match id "${b.id}"`);
  if (!familySlugs.has(b.family)) err(file, `unknown family "${b.family}"`);
  for (const p of b.parent_ids) {
    const parent = byId.get(p);
    if (!parent) err(file, `parent "${p}" not found`);
    else if (!parent.successor_ids.includes(b.id)) err(file, `parent "${p}" does not list it in successor_ids`);
  }
  for (const s of b.successor_ids) {
    const succ = byId.get(s);
    if (!succ) err(file, `successor "${s}" not found`);
    else if (!succ.parent_ids.includes(b.id)) err(file, `successor "${s}" does not list it in parent_ids`);
  }
  for (const tp of b.turning_points) {
    if (tpIds.has(tp.id)) err(file, `duplicate turning point id "${tp.id}"`);
    tpIds.set(tp.id, b.id);
    if (tp.branch_id !== b.id) err(file, `turning point "${tp.id}" has branch_id "${tp.branch_id}"`);
    if (!TP_TYPES.has(tp.type)) err(file, `turning point "${tp.id}" has unknown type "${tp.type}"`);
    if (!tp.sources?.length) err(file, `turning point "${tp.id}" has no sources`);
    // An event from 1500 on must have at least one source written after it happened.
    const eventYears = (tp.date.match(/\b(1[5-9]\d\d|20\d\d)\b/g) ?? []).map(Number);
    const sourceYears = (tp.sources ?? []).map((s) => Number(s.citation.match(/\b(1[5-9]\d\d|20\d\d)\b/)?.[0])).filter(Boolean);
    if (eventYears.length && sourceYears.length && Math.max(...sourceYears) < Math.min(...eventYears))
      err(file, `turning point "${tp.id}" (${Math.min(...eventYears)}) is newer than all its sources (latest ${Math.max(...sourceYears)})`);
    if (tp.type === "SOUND_LAW") {
      if (!PROCESSES.has(tp.process)) err(file, `sound law "${tp.id}" needs a process (${[...PROCESSES].join(", ")})`);
      if (!tp.notation) err(file, `sound law "${tp.id}" needs a notation`);
      if (typeof tp.sort_year !== "number") err(file, `sound law "${tp.id}" needs a numeric sort_year`);
    }
  }
  for (const cc of b.contested_classifications) {
    if (cc.branch_id !== b.id) err(file, `classification "${cc.id}" has branch_id "${cc.branch_id}"`);
    if (!STATUSES.has(cc.status)) err(file, `classification "${cc.id}" has unknown status "${cc.status}"`);
    for (const l of cc.linked_branch_ids ?? []) if (!byId.has(l)) err(file, `classification "${cc.id}" links unknown "${l}"`);
  }
  for (const f of b.figure_ids) if (!figureIds.has(f)) err(file, `unknown figure "${f}"`);
  if (!b.speakers) err(file, "missing speakers (present-day speakers of this branch)");
  if (!b.successor_ids.length && !b.countries?.length) err(file, "leaf branch needs countries");
  if (b.speakers) {
    if (!VITALITY.has(b.speakers.vitality)) err(file, `unknown vitality "${b.speakers.vitality}"`);
    if (!b.speakers.sources?.length) err(file, "speakers need sources");
  }
  for (const c of b.countries ?? []) {
    if (!countries.isValid(c.iso) || c.iso.length !== 3) err(file, `country "${c.name}" has invalid ISO alpha-3 "${c.iso}"`);
  }
  if (b.sample) {
    if (!b.sample.sources?.length) err(file, "sample needs sources");
    const aligned = b.sample.transliteration ?? b.sample.text;
    if (b.sample.gloss && words(b.sample.gloss) !== words(aligned))
      err(file, `sample gloss has ${words(b.sample.gloss)} words for ${words(aligned)} in "${aligned}"`);
  }
}

for (const f of figures) {
  for (const b of f.branch_ids) {
    if (!byId.has(b)) err(`figures.json`, `${f.id} references unknown branch "${b}"`);
    else if (!byId.get(b).figure_ids.includes(f.id)) err(`figures.json`, `${f.id} not listed in ${b}.figure_ids`);
  }
  for (const t of f.turning_point_ids) if (!tpIds.has(t)) err(`figures.json`, `${f.id} references unknown turning point "${t}"`);
}

// Cycle check — the lineage must be a DAG.
const state = new Map();
const visit = (id, trail) => {
  if (state.get(id) === 1) return err(`branches/${id}.json`, `cycle: ${[...trail, id].join(" → ")}`);
  if (state.get(id) === 2) return;
  state.set(id, 1);
  for (const s of byId.get(id)?.successor_ids ?? []) visit(s, [...trail, id]);
  state.set(id, 2);
};
for (const id of byId.keys()) visit(id, []);

if (errors.length) {
  console.error(`Content validation failed (${errors.length}):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`Content OK — ${families.length} families, ${branches.length} branches, ${tpIds.size} turning points, ${figures.length} figures.`);
