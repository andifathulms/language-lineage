"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { easeCubicOut, select } from "d3";
import {
  bezierPoint,
  layoutTree,
  taperedPath,
  type Limb,
  type RingMark,
  type TreeBranchInput,
  type TreeClassificationInput,
  type TreeNode,
} from "@/lib/treeLayout";
import type { TurningPointType } from "@/lib/types";
import { TP_LABEL } from "./labels";

const LIMB_MS = 1000;
const STAGGER_MS = 650;

interface Props {
  familySlug: string;
  rootId: string;
  buriedRoot: { name: string; note: string; proven: boolean };
  branches: TreeBranchInput[];
  classifications: TreeClassificationInput[];
}

// Small deterministic hash so canopy clusters look organic but render the
// same on server and client.
function seeded(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function TypeGlyph({ type, className }: { type: TurningPointType; className?: string }) {
  switch (type) {
    case "SPLIT":
      return (
        <path
          d="M0,-4.5L4.5,0L0,4.5L-4.5,0Z"
          className={`fill-cream stroke-accent ${className ?? ""}`}
          strokeWidth={1.4}
        />
      );
    case "CONTACT":
      return <circle r={3.4} className={`fill-accent ${className ?? ""}`} />;
    case "WRITING_SYSTEM_ADOPTED":
      return (
        <rect
          x={-3.2}
          y={-3.2}
          width={6.4}
          height={6.4}
          className={`fill-cream stroke-accent ${className ?? ""}`}
          strokeWidth={1.4}
        />
      );
    case "EXTINCTION":
      return (
        <path
          d="M-3.4,-3.4L3.4,3.4M3.4,-3.4L-3.4,3.4"
          className={`stroke-bark ${className ?? ""}`}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      );
    case "REVITALIZATION":
      return <path d="M0,-4.6L4.2,3.4L-4.2,3.4Z" className={`fill-moss ${className ?? ""}`} />;
    case "SOUND_LAW":
      return <path d="M-5,0L5,0" className={`stroke-bark ${className ?? ""}`} strokeWidth={2} strokeLinecap="round" />;
  }
}

function Canopy({ node }: { node: TreeNode }) {
  const rnd = seeded(node.id);
  const leaves = Array.from({ length: 9 }, () => ({
    dx: (rnd() - 0.5) * 70,
    dy: (rnd() - 0.65) * 34,
    r: 9 + rnd() * 13,
    o: 0.16 + rnd() * 0.2,
  }));
  return (
    <g data-grow="canopy" data-delay={node.depth * STAGGER_MS + LIMB_MS * 0.8} aria-hidden="true">
      {leaves.map((l, i) => (
        <circle key={i} cx={node.end.x + l.dx} cy={node.end.y + l.dy} r={l.r} className="fill-moss" fillOpacity={l.o} />
      ))}
    </g>
  );
}

function SnappedTip({ node }: { node: TreeNode }) {
  const { x, y } = node.end;
  const w = node.limb.w1 / 2;
  return (
    <path
      aria-hidden="true"
      data-grow="snap"
      data-delay={node.depth * STAGGER_MS + LIMB_MS * 0.9}
      d={`M${x - w},${y + 1}L${x - w * 0.4},${y - 5}L${x},${y - 1}L${x + w * 0.5},${y - 7}L${x + w},${y + 1}Z`}
      className="fill-bark-soft"
      fillOpacity={0.55}
    />
  );
}

function Mark({ m, href, onFocus, onBlur }: { m: RingMark; href: string; onFocus: () => void; onBlur: () => void }) {
  const { p, n, halfWidth: hw, side } = m;
  const full = m.type === "SOUND_LAW";
  // Sound laws cut a full ring across the limb; other events notch one side and pin their type.
  const a = full ? -(hw + 4) : 0;
  const b = hw + (full ? 4 : 2);
  const pin = { x: p.x + n.x * side * (hw + 8), y: p.y + n.y * side * (hw + 8) };
  return (
    <Link
      href={href}
      aria-label={`${TP_LABEL[m.type]}: ${m.title}, ${m.date}${m.contested ? " (contested)" : ""}`}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      className="tree-mark"
    >
      <g data-grow="mark" data-delay={m.depth * STAGGER_MS + m.t * LIMB_MS}>
        <line
          x1={p.x + n.x * side * a}
          y1={p.y + n.y * side * a}
          x2={p.x + n.x * side * b}
          y2={p.y + n.y * side * b}
          className="stroke-cream"
          strokeWidth={full ? 2 : 1.4}
          strokeDasharray={m.contested ? "2.2 1.8" : undefined}
          strokeLinecap="round"
        />
        {full && (
          <line
            x1={p.x - n.x * (hw + 5)}
            y1={p.y - n.y * (hw + 5)}
            x2={p.x + n.x * (hw + 5)}
            y2={p.y + n.y * (hw + 5)}
            className="stroke-bark/40"
            strokeWidth={0.8}
            strokeDasharray={m.contested ? "2 2" : undefined}
          />
        )}
        {!full && (
          <g transform={`translate(${pin.x},${pin.y})`}>
            <TypeGlyph type={m.type} />
          </g>
        )}
        <circle cx={p.x} cy={p.y} r={Math.max(hw + 6, 10)} fill="transparent" className="tree-hit" />
      </g>
    </Link>
  );
}

export function LineageTree({ familySlug, rootId, buriedRoot, branches, classifications }: Props) {
  const layout = useMemo(() => layoutTree(branches, rootId, classifications), [branches, rootId, classifications]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<RingMark | null>(null);
  const [hoverBranch, setHoverBranch] = useState<string | null>(null);

  const branchHref = (id: string) => `/${familySlug}/${id}/`;
  const limbsByKey = useMemo(() => {
    const m = new Map<string, Limb>();
    layout.nodes.forEach((n) => m.set(n.limb.key, n.limb));
    layout.feeds.forEach((f) => m.set(f.key, f));
    return m;
  }, [layout]);

  // Growth animation: limbs extend from their base, ring-marks appear as the
  // growth passes them, canopy and labels follow, contested arcs come last.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = select(svg);
    if (!reduce) {
      root.selectAll<SVGPathElement, unknown>("[data-limb]").each(function () {
        const limb = limbsByKey.get(this.dataset.limb!);
        if (!limb) return;
        select(this)
          .attr("d", taperedPath(limb, 0.001))
          .transition()
          .delay(Math.max(limb.depth, 0) * STAGGER_MS)
          .duration(LIMB_MS)
          .ease(easeCubicOut)
          .attrTween("d", () => (t) => taperedPath(limb, Math.max(t, 0.001)));
      });
      root.selectAll<SVGElement, unknown>("[data-grow]").each(function () {
        const delay = Number(this.dataset.delay ?? 0);
        select(this).style("opacity", 0).transition().delay(delay).duration(420).ease(easeCubicOut).style("opacity", 1);
      });
    }
    svg.classList.remove("tree-pre");
    return () => {
      root.selectAll("*").interrupt();
    };
  }, [limbsByKey]);

  const { width, height, groundY, rootBase } = layout;
  const arcsDelay = (layout.maxDepth + 1) * STAGGER_MS + LIMB_MS * 0.5;
  const dim = (id: string) => (hoverBranch && hoverBranch !== id ? "opacity-50" : "opacity-100");

  return (
    <figure className="relative">
      {/* Wide trees keep a legible minimum size and scroll sideways on phones. */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          style={{ minWidth: `${Math.round(width * 0.62)}px` }}
          className="tree-pre h-auto w-full select-none"
          role="group"
          aria-label="Lineage tree. Each limb is a branch; ring-marks along it are turning points; dotted arcs are contested groupings."
        >
          <defs>
            <clipPath id="above-ground">
              <rect x={0} y={0} width={width} height={groundY} />
            </clipPath>
          </defs>

          {/* Growth rings radiating from the root: the cross-section backdrop. */}
          <g clipPath="url(#above-ground)" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <circle
                key={i}
                cx={rootBase.x}
                cy={groundY + 40}
                r={80 + i * 62 + (i % 3) * 7}
                fill="none"
                className="stroke-ring"
                strokeOpacity={0.45 - i * 0.03}
                strokeWidth={i % 4 === 0 ? 1.4 : 0.8}
              />
            ))}
          </g>

          {/* Soil and the buried proto-form. */}
          <g aria-hidden="true">
            <rect x={0} y={groundY} width={width} height={height - groundY} className="fill-soil" />
            <line x1={0} x2={width} y1={groundY} y2={groundY} className="stroke-ring" strokeWidth={1.2} />
            {[-1, -0.45, 0.2, 0.7, 1].map((dir, i) => (
              <path
                key={i}
                d={`M${rootBase.x + dir * 8},${groundY + 4} C${rootBase.x + dir * 30},${groundY + 30} ${rootBase.x + dir * 70},${groundY + 40 + i * 6} ${rootBase.x + dir * (110 + i * 12)},${groundY + 70 + (i % 2) * 22}`}
                fill="none"
                className="stroke-heartwood"
                strokeOpacity={buriedRoot.proven ? 0.45 : 0.25}
                strokeDasharray={buriedRoot.proven ? undefined : "3 5"}
                strokeWidth={2.6 - i * 0.3}
                strokeLinecap="round"
              />
            ))}
            <text
              x={rootBase.x}
              y={height - 26}
              textAnchor="middle"
              className="fill-bark-soft font-display italic"
              fontSize={15}
            >
              {buriedRoot.name}
            </text>
            <text
              x={rootBase.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-bark-soft font-label uppercase"
              fontSize={9}
              letterSpacing="0.14em"
            >
              {buriedRoot.note}
            </text>
          </g>

          {/* Graft feeds, then limbs (thickest first so forks overlap cleanly). */}
          {layout.feeds.map((f) => (
            <path key={f.key} data-limb={f.key} d={taperedPath(f)} className="fill-heartwood" />
          ))}
          {[...layout.nodes]
            .sort((a, b) => a.depth - b.depth)
            .map((n) => (
              <Link
                key={n.id}
                href={branchHref(n.id)}
                aria-label={`${n.name} branch`}
                tabIndex={-1}
                onMouseEnter={() => setHoverBranch(n.id)}
                onMouseLeave={() => setHoverBranch(null)}
              >
                <path
                  data-limb={n.limb.key}
                  d={taperedPath(n.limb)}
                  className={`transition-opacity duration-base ease-grow ${dim(n.id)} ${n.extinct ? "fill-bark-soft/55" : "fill-heartwood"}`}
                />
              </Link>
            ))}

          {/* Fork collars smooth the joins between parent and child limbs. */}
          {layout.nodes
            .filter((n) => !n.isLeaf)
            .map((n) => (
              <circle
                key={`collar-${n.id}`}
                cx={n.end.x}
                cy={n.end.y}
                r={n.limb.w1 / 2}
                className="fill-heartwood"
                data-grow="collar"
                data-delay={n.depth * STAGGER_MS + LIMB_MS * 0.9}
              />
            ))}
          {layout.nodes
            .filter((n) => n.graft)
            .map((n) => (
              <g key={`graft-${n.id}`} data-grow="graft" data-delay={n.depth * STAGGER_MS}>
                <ellipse
                  cx={n.graft!.x}
                  cy={n.graft!.y}
                  rx={n.limb.w0 * 0.75}
                  ry={n.limb.w0 * 0.45}
                  className="fill-heartwood stroke-bark"
                  strokeWidth={1.2}
                />
                <line
                  x1={n.graft!.x - n.limb.w0 * 0.7}
                  x2={n.graft!.x + n.limb.w0 * 0.7}
                  y1={n.graft!.y}
                  y2={n.graft!.y}
                  className="stroke-cream"
                  strokeWidth={1.2}
                />
              </g>
            ))}

          {layout.nodes
            .filter((n) => n.isLeaf && !n.extinct)
            .map((n) => (
              <Canopy key={`canopy-${n.id}`} node={n} />
            ))}
          {layout.nodes
            .filter((n) => n.isLeaf && n.extinct)
            .map((n) => (
              <SnappedTip key={`snap-${n.id}`} node={n} />
            ))}

          {/* Contested classifications: outside the tree proper, dotted, lower confidence. */}
          {layout.arcs.map((a) => {
            return (
              <g key={a.key} data-grow="arc" data-delay={arcsDelay}>
                <path
                  d={`M${a.from.x},${a.from.y} C${a.c1.x},${a.c1.y} ${a.c2.x},${a.c2.y} ${a.to.x},${a.to.y}`}
                  fill="none"
                  className="stroke-accent"
                  strokeOpacity={a.status === "widely_accepted" ? 0.75 : a.status === "minority_position" ? 0.5 : 0.3}
                  strokeWidth={1.4}
                  strokeDasharray="1.5 5"
                  strokeLinecap="round"
                />
                <circle cx={a.from.x} cy={a.from.y} r={2.6} className="fill-accent" fillOpacity={0.7} />
                <circle cx={a.to.x} cy={a.to.y} r={2.6} className="fill-accent" fillOpacity={0.7} />
                <text
                  x={a.peak.x}
                  y={a.peak.y - 9}
                  textAnchor="middle"
                  className="tree-halo fill-accent font-display italic"
                  fontSize={14}
                >
                  {a.label}?
                </text>
              </g>
            );
          })}

          {layout.marks.map((m) => (
            <Mark
              key={m.id}
              m={m}
              href={`${branchHref(m.branchId)}#${m.id}`}
              onFocus={() => setActive(m)}
              onBlur={() => setActive((cur) => (cur?.id === m.id ? null : cur))}
            />
          ))}

          {/* Labels. */}
          {layout.nodes.map((n) => {
            let x = n.end.x;
            let y = n.end.y;
            let anchor: "start" | "middle" | "end" = "middle";
            if (n.isRoot) {
              const p = bezierPoint(n.limb, 0.08);
              x = p.x + n.limb.w0 / 2 + 14;
              y = p.y - 4;
              anchor = "start";
            } else if (!n.isLeaf) {
              x = n.end.x + n.limb.w1 / 2 + 16;
              y = n.end.y + 5;
              anchor = x + 160 > width ? "end" : "start";
              if (anchor === "end") x = n.end.x - n.limb.w1 / 2 - 16;
            } else {
              y = n.extinct ? n.end.y - 30 : n.end.y - 44;
            }
            const sub = n.isLeaf
              ? n.descendants.length > 1
                ? `${n.descendants[0]} +${n.descendants.length - 1}`
                : n.descendants.join("")
              : null;
            return (
              <Link
                key={`label-${n.id}`}
                href={branchHref(n.id)}
                className="tree-label no-underline"
                onMouseEnter={() => setHoverBranch(n.id)}
                onMouseLeave={() => setHoverBranch(null)}
                onFocus={() => setHoverBranch(n.id)}
                onBlur={() => setHoverBranch(null)}
              >
                <g data-grow="label" data-delay={n.depth * STAGGER_MS + LIMB_MS * 0.85}>
                  <text
                    x={x}
                    y={y}
                    textAnchor={anchor}
                    className="tree-halo fill-bark font-display font-semibold"
                    fontSize={n.isLeaf ? 18 : 16}
                  >
                    {n.name}
                    {n.extinct ? " †" : ""}
                  </text>
                  {sub && (
                    <text
                      x={x}
                      y={y + 16}
                      textAnchor={anchor}
                      className="tree-halo fill-bark-soft font-label uppercase"
                      fontSize={9}
                      letterSpacing="0.1em"
                    >
                      {sub}
                    </text>
                  )}
                </g>
              </Link>
            );
          })}
        </svg>
      </div>

      <figcaption
        aria-live="polite"
        className="mt-3 flex min-h-[3.5rem] flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-ring/60 pt-3 text-sm"
      >
        {active ? (
          <>
            <span className="specimen">{TP_LABEL[active.type]}</span>
            <span className="font-label text-xs text-bark-soft">{active.date}</span>
            <span className={`font-display text-base font-semibold ${active.contested ? "contested-mark" : ""}`}>
              {active.title}
            </span>
            <span className="text-bark-soft">· {layout.nodes.find((n) => n.id === active.branchId)?.name}</span>
          </>
        ) : (
          <span className="text-bark-soft">
            Hover or tab to a ring-mark to read it. Select a limb or its name to open that branch.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
