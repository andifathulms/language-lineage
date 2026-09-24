import fs from "node:fs";
import path from "node:path";
import { geoArea, geoCentroid, geoEqualEarth, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import countries from "i18n-iso-countries";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

// Build-time only: the "spoken today" map is rendered to plain SVG paths in the
// static export, so no geography or projection code reaches the browser.

type Country = Feature<Geometry, { name: string }>;

// Territories drawn without an ISO id in Natural Earth fold into the state that claims them.
const UNNUMBERED: Record<string, string> = { Somaliland: "706", "N. Cyprus": "196" };

function load(file: string): Country[] {
  const full = path.join(process.cwd(), "node_modules", "world-atlas", file);
  const t = JSON.parse(fs.readFileSync(full, "utf8")) as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const fc = feature(t, t.objects.countries) as FeatureCollection<Geometry, { name: string }>;
  return fc.features.map((f) => ({ ...f, id: f.id ?? UNNUMBERED[f.properties.name] }));
}

let cache: { coarse: Country[]; fine: Map<string, Country> } | null = null;
function atlas() {
  if (!cache) {
    // Some dependencies share their state's id (Ashmore and Cartier Islands carry Australia's 036):
    // keep the largest shape per id so a speck of reef never stands in for the country.
    const fine = new Map<string, Country>();
    for (const f of load("countries-50m.json")) {
      const prev = fine.get(String(f.id));
      if (!prev || geoArea(f) > geoArea(prev)) fine.set(String(f.id), f);
    }
    cache = { coarse: load("countries-110m.json"), fine };
  }
  return cache;
}

export interface MapShape {
  d: string;
  state: "living" | "historical" | "base";
}

export interface MapDot {
  x: number;
  y: number;
  state: "living" | "historical";
  name: string;
}

export interface WorldMap {
  width: number;
  height: number;
  shapes: MapShape[];
  dots: MapDot[]; // countries too small to see at this scale, or missing from the coarse atlas
}

const W = 960;
const H = 500;

/**
 * A map framed on the given countries. `living` and `historical` are ISO
 * alpha-3 codes; a code in both counts as living.
 */
export function worldMap(living: string[], historical: string[]): WorldMap | null {
  const { coarse, fine } = atlas();
  const num = (a: string) => countries.alpha3ToNumeric(a);
  const state = new Map<string, "living" | "historical">();
  historical.forEach((a) => num(a) && state.set(num(a)!, "historical"));
  living.forEach((a) => num(a) && state.set(num(a)!, "living"));
  if (!state.size) return null;

  const highlighted = [...state.keys()].map((id) => fine.get(id)).filter((f): f is Country => Boolean(f));
  if (!highlighted.length) return null;

  // Centre on the circular mean of the highlighted centroids, so a family
  // spanning the Pacific is not cut in half by the antimeridian.
  const cents = highlighted.map((f) => geoCentroid(f));
  const rad = Math.PI / 180;
  const lon0 = Math.atan2(
    cents.reduce((s, c) => s + Math.sin(c[0] * rad), 0),
    cents.reduce((s, c) => s + Math.cos(c[0] * rad), 0),
  ) / rad;

  const projection = geoEqualEarth().rotate([-lon0, 0]);
  const fc: FeatureCollection = { type: "FeatureCollection", features: highlighted };
  projection.fitExtent([[40, 30], [W - 40, H - 30]], fc);
  // Never zoom in so far that the neighbourhood disappears, nor out past the whole world.
  const worldScale = geoEqualEarth().fitExtent([[10, 10], [W - 10, H - 10]], { type: "Sphere" }).scale();
  const scale = Math.min(Math.max(projection.scale(), worldScale), worldScale * 9);
  if (scale !== projection.scale()) {
    const [cx, cy] = geoCentroid(fc);
    projection.scale(scale).translate([W / 2, H / 2]);
    const [px, py] = projection([cx, cy]) ?? [W / 2, H / 2];
    projection.translate([W - px, H - py]);
  }
  const pathGen = geoPath(projection).digits(1);

  const shapes: MapShape[] = [];
  const dots: MapDot[] = [];
  const drawn = new Set<string>();
  for (const f of coarse) {
    const [[x0, y0], [x1, y1]] = pathGen.bounds(f);
    if (x1 < 0 || y1 < 0 || x0 > W || y0 > H) continue;
    const d = pathGen(f);
    if (!d) continue;
    const s = state.get(String(f.id));
    shapes.push({ d, state: s ?? "base" });
    if (s) {
      drawn.add(String(f.id));
      if (pathGen.area(f) < 40) {
        const [x, y] = pathGen.centroid(f);
        dots.push({ x, y, state: s, name: f.properties.name });
      }
    }
  }
  for (const [id, s] of state) {
    if (drawn.has(id)) continue;
    const f = fine.get(id);
    const p = f && projection(geoCentroid(f));
    if (f && p && p[0] >= 0 && p[0] <= W && p[1] >= 0 && p[1] <= H) dots.push({ x: p[0], y: p[1], state: s, name: f.properties.name });
  }
  // Base first, then historical, then living on top.
  const order = { base: 0, historical: 1, living: 2 };
  shapes.sort((a, b) => order[a.state] - order[b.state]);
  return { width: W, height: H, shapes, dots };
}
