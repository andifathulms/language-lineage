import { curveCatmullRom, line } from "d3";
import type { ClassificationStatus, TurningPointType } from "./types";

// Manual layered layout for a small lineage DAG, drawn as a tree growing up
// from a buried root. Pure and deterministic, so server and client agree.

export interface TreeBranchInput {
  id: string;
  name: string;
  parent_ids: string[];
  successor_ids: string[];
  extinct: boolean;
  descendants: string[];
  turning_points: { id: string; type: TurningPointType; title: string; date: string; contested: boolean }[];
}

export interface TreeClassificationInput {
  id: string;
  label: string;
  status: ClassificationStatus;
  linked: string[];
}

export interface Pt {
  x: number;
  y: number;
}

export interface Limb {
  key: string;
  from: Pt;
  c1: Pt;
  c2: Pt;
  to: Pt;
  w0: number;
  w1: number;
  depth: number; // growth order: limbs at the same depth grow together
}

export interface TreeNode {
  id: string;
  name: string;
  depth: number;
  isRoot: boolean;
  isLeaf: boolean;
  extinct: boolean;
  descendants: string[];
  end: Pt;
  limb: Limb;
  graft: Pt | null; // set when the branch has more than one parent
}

export interface RingMark {
  id: string;
  branchId: string;
  type: TurningPointType;
  title: string;
  date: string;
  contested: boolean;
  t: number;
  depth: number;
  p: Pt;
  n: Pt; // unit normal across the limb
  halfWidth: number;
  side: 1 | -1; // which edge the type pin sits on
}

export interface ClassificationArc {
  key: string;
  id: string;
  label: string;
  status: ClassificationStatus;
  from: Pt;
  to: Pt;
  c1: Pt;
  c2: Pt;
  peak: Pt; // highest point of the arc, where its label sits
}

export interface TreeLayout {
  width: number;
  height: number;
  groundY: number;
  canopyY: number;
  rootBase: Pt;
  nodes: TreeNode[];
  feeds: Limb[]; // parent → graft-point limbs for multi-parent branches
  marks: RingMark[];
  arcs: ClassificationArc[];
  maxDepth: number;
}

// ---------------------------------------------------------------- geometry

export function bezierPoint(l: Limb, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u,
    b = 3 * u * u * t,
    c = 3 * u * t * t,
    d = t * t * t;
  return {
    x: a * l.from.x + b * l.c1.x + c * l.c2.x + d * l.to.x,
    y: a * l.from.y + b * l.c1.y + c * l.c2.y + d * l.to.y,
  };
}

function bezierNormal(l: Limb, t: number): Pt {
  const u = 1 - t;
  const dx = 3 * u * u * (l.c1.x - l.from.x) + 6 * u * t * (l.c2.x - l.c1.x) + 3 * t * t * (l.to.x - l.c2.x);
  const dy = 3 * u * u * (l.c1.y - l.from.y) + 6 * u * t * (l.c2.y - l.c1.y) + 3 * t * t * (l.to.y - l.c2.y);
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

export function widthAt(l: Limb, t: number): number {
  // Slight ease so limbs stay thick near the fork and thin late.
  const s = t * t * (1.6 - 0.6 * t);
  return l.w0 + (l.w1 - l.w0) * s;
}

const outline = line<[number, number]>().curve(curveCatmullRom.alpha(0.5));

/** Closed, tapered outline of a limb, drawn from its base up to parameter tEnd. */
export function taperedPath(l: Limb, tEnd = 1): string {
  const steps = 28;
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tEnd;
    const p = bezierPoint(l, t);
    const n = bezierNormal(l, t);
    const hw = widthAt(l, t) / 2;
    left.push([p.x + n.x * hw, p.y + n.y * hw]);
    right.push([p.x - n.x * hw, p.y - n.y * hw]);
  }
  return `${outline(left)}L${outline(right.reverse())!.slice(1)}Z`;
}

function makeLimb(key: string, from: Pt, to: Pt, w0: number, w1: number, depth: number): Limb {
  const rise = from.y - to.y;
  // Vertical S-curve: leave the fork upward, arrive at the tip upward.
  const lean = Math.abs(from.x - to.x) < 1 ? 10 : 0;
  return {
    key,
    from,
    c1: { x: from.x + lean, y: from.y - rise * 0.55 },
    c2: { x: to.x - lean * 0.4, y: to.y + rise * 0.42 },
    to,
    w0,
    w1,
    depth,
  };
}

// ---------------------------------------------------------------- layout

export function layoutTree(
  branches: TreeBranchInput[],
  rootId: string,
  classifications: TreeClassificationInput[],
): TreeLayout {
  const canopyY = 250;
  const arcBandY = 36;
  const marginX = 120;
  const byId = new Map(branches.map((b) => [b.id, b]));
  const kids = (id: string) => (byId.get(id)?.successor_ids ?? []).filter((s) => byId.has(s));
  const parents = (id: string) => (byId.get(id)?.parent_ids ?? []).filter((p) => byId.has(p));

  // Depth = longest path from a root, so a grafted branch sits above both parents.
  const depthMemo = new Map<string, number>();
  const depthOf = (id: string): number => {
    if (!depthMemo.has(id)) {
      const ps = parents(id);
      depthMemo.set(id, ps.length ? Math.max(...ps.map(depthOf)) + 1 : 0);
    }
    return depthMemo.get(id)!;
  };

  // Leaf order from a depth-first walk keeps siblings adjacent.
  const leafOrder: string[] = [];
  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const ks = kids(id);
    if (!ks.length) leafOrder.push(id);
    ks.forEach(walk);
  };
  walk(rootId);
  branches.forEach((b) => walk(b.id)); // anything unreachable from the root

  // The canvas grows with the tree: wider per leaf, taller per internal level.
  const internal = branches.filter((b) => kids(b.id).length);
  const maxInternal = internal.length ? Math.max(...internal.map((b) => depthOf(b.id))) : 0;
  // Each leaf gets a slot wide enough for its name (about 10.5 units per character
  // in the 18px display face), never less than 150; spare room is shared out evenly.
  const need = leafOrder.map((id) => Math.max(150, (byId.get(id)?.name.length ?? 0) * 10.5 + 24));
  const needed = need.reduce((s, w) => s + w, 0);
  const width = Math.max(1000, needed + 2 * marginX);
  const height = 780 + 120 * Math.max(0, maxInternal - 1);
  const groundY = height - 130;

  const spread = (width - 2 * marginX) / Math.max(needed, 1);
  const leafX = new Map<string, number>();
  let cursor = marginX;
  leafOrder.forEach((id, i) => {
    leafX.set(id, cursor + (need[i] * spread) / 2);
    cursor += need[i] * spread;
  });
  const xMemo = new Map<string, number>();
  const xOf = (id: string): number => {
    if (!xMemo.has(id)) {
      const ks = kids(id);
      xMemo.set(id, ks.length ? ks.reduce((s, k) => s + xOf(k), 0) / ks.length : leafX.get(id)!);
    }
    return xMemo.get(id)!;
  };

  const leafMemo = new Map<string, number>();
  const leafCount = (id: string): number => {
    if (!leafMemo.has(id)) {
      const ks = kids(id);
      leafMemo.set(id, ks.length ? ks.reduce((s, k) => s + leafCount(k), 0) : 1);
    }
    return leafMemo.get(id)!;
  };
  const girth = (id: string) => 6 + 9 * Math.sqrt(leafCount(id)); // sqrt keeps wide families from a bloated trunk

  const internalY = (d: number) => groundY - ((groundY - canopyY) * (d + 1)) / (maxInternal + 2);

  // Resolve nodes parent-first so every start point exists.
  const ordered = [...branches].sort((a, b) => depthOf(a.id) - depthOf(b.id));
  const nodes = new Map<string, TreeNode>();
  const feeds: Limb[] = [];

  for (const b of ordered) {
    const depth = depthOf(b.id);
    const ps = parents(b.id);
    const isLeaf = kids(b.id).length === 0;
    const x = xOf(b.id);
    const g = girth(b.id);

    let from: Pt;
    let w0 = g * 0.95;
    let graft: Pt | null = null;
    if (ps.length === 0) {
      from = { x, y: groundY + 8 };
      w0 = g * 1.4; // flared trunk base
    } else if (ps.length === 1) {
      from = nodes.get(ps[0])!.end;
    } else {
      const ends = ps.map((p) => nodes.get(p)!.end);
      graft = { x, y: Math.min(...ends.map((e) => e.y)) - 36 };
      ends.forEach((e, i) => feeds.push(makeLimb(`${b.id}~feed${i}`, e, graft!, g * 0.62, g * 0.72, depth - 0.5)));
      from = graft;
    }

    let y: number;
    if (!isLeaf) y = internalY(depth);
    else if (b.extinct) y = from.y - (from.y - canopyY) * 0.58;
    else y = canopyY;

    const end = { x, y };
    const w1 = isLeaf ? (b.extinct ? g * 0.42 : 2.2) : g * 0.72;
    nodes.set(b.id, {
      id: b.id,
      name: b.name,
      depth,
      isRoot: ps.length === 0,
      isLeaf,
      extinct: b.extinct,
      descendants: b.descendants,
      end,
      limb: makeLimb(b.id, from, end, w0, w1, depth),
      graft,
    });
  }

  // Turning points sit as ring-marks along their branch, oldest nearest the base.
  const marks: RingMark[] = [];
  for (const b of ordered) {
    const node = nodes.get(b.id)!;
    const n = b.turning_points.length;
    b.turning_points.forEach((tp, i) => {
      // The root's label sits at the base of the trunk, so its marks start higher.
      const t0 = node.isRoot ? 0.26 : 0.14;
      const t = n === 1 ? (t0 + 0.88) / 2 : t0 + (i * (0.88 - t0)) / (n - 1);
      marks.push({
        id: tp.id,
        branchId: b.id,
        type: tp.type,
        title: tp.title,
        date: tp.date,
        contested: tp.contested,
        t,
        depth: node.depth,
        p: bezierPoint(node.limb, t),
        n: bezierNormal(node.limb, t),
        halfWidth: widthAt(node.limb, t) / 2,
        side: i % 2 === 0 ? 1 : -1,
      });
    });
  }

  // Contested groupings float outside the tree proper: dotted arcs that rise
  // from the two limbs into a band above the canopy.
  const arcs: ClassificationArc[] = [];
  for (const c of classifications) {
    const linked = c.linked.filter((id) => nodes.has(id));
    for (let i = 0; i + 1 < linked.length; i++) {
      const a = bezierPoint(nodes.get(linked[i])!.limb, 0.86);
      const z = bezierPoint(nodes.get(linked[i + 1])!.limb, 0.86);
      const inset = (z.x - a.x) * 0.22;
      const c1 = { x: a.x + inset, y: arcBandY };
      const c2 = { x: z.x - inset, y: arcBandY };
      arcs.push({
        key: `${c.id}-${i}`,
        id: c.id,
        label: c.label,
        status: c.status,
        from: a,
        to: z,
        c1,
        c2,
        peak: { x: (a.x + 3 * c1.x + 3 * c2.x + z.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + z.y) / 8 },
      });
    }
  }

  const all = [...nodes.values()];
  const root = nodes.get(rootId) ?? all[0];
  return {
    width,
    height,
    groundY,
    canopyY,
    rootBase: root ? root.limb.from : { x: width / 2, y: groundY },
    nodes: all,
    feeds,
    marks,
    arcs,
    maxDepth: Math.max(0, ...all.map((n) => n.depth)),
  };
}
