"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { scaleLinear } from "d3";

export interface TimelineLaw {
  id: string;
  title: string;
  year: number;
  date: string;
  notation: string;
  contested: boolean;
  branchName: string;
  href: string;
}

export interface TimelineLane {
  slug: string;
  name: string;
  accentClass: string;
  laws: TimelineLaw[];
}

const WIDTH = 1000;
const LEFT = 130;
const RIGHT = 24;
const ROW = 20;
const DOT = 6.5;
const LANE_PAD = 22;
const GROW_MS = 1400;

const formatYear = (y: number) => (y < 0 ? `${-y} BCE` : y === 0 ? "1 CE" : `${y} CE`);

// Greedy stacking: each dot takes the lowest row where it clears its neighbours.
function stack(xs: number[], gap: number) {
  const rowEnds: number[] = [];
  return xs.map((x) => {
    let row = rowEnds.findIndex((end) => x - end >= gap);
    if (row === -1) row = rowEnds.length;
    rowEnds[row] = x;
    return row;
  });
}

export function SoundLawTimeline({ lanes }: { lanes: TimelineLane[] }) {
  const [active, setActive] = useState<(TimelineLaw & { lane: string }) | null>(null);

  const layout = useMemo(() => {
    const years = lanes.flatMap((l) => l.laws.map((s) => s.year));
    const x = scaleLinear()
      .domain([Math.floor(Math.min(...years) / 500) * 500, Math.ceil(Math.max(...years) / 500) * 500])
      .range([LEFT, WIDTH - RIGHT]);
    let y = 18;
    const placed = lanes.map((lane) => {
      const laws = [...lane.laws].sort((a, b) => a.year - b.year);
      const rows = stack(
        laws.map((s) => x(s.year)),
        DOT * 2 + 4,
      );
      const depth = Math.max(1, ...rows.map((r) => r + 1));
      const top = y;
      y += depth * ROW + LANE_PAD * 2;
      return {
        ...lane,
        top,
        height: depth * ROW + LANE_PAD * 2,
        dots: laws.map((s, i) => ({ ...s, cx: x(s.year), cy: top + LANE_PAD + rows[i] * ROW + ROW / 2 })),
      };
    });
    return { x, lanes: placed, height: y + 30, ticks: x.ticks(8) };
  }, [lanes]);

  return (
    <figure>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <svg
          viewBox={`0 0 ${WIDTH} ${layout.height}`}
          className="h-auto w-full min-w-[640px]"
          role="group"
          aria-label="Timeline of sound laws, one lane per family"
        >
          {layout.ticks.map((t) => (
            <g key={t} aria-hidden="true">
              <line
                x1={layout.x(t)}
                x2={layout.x(t)}
                y1={8}
                y2={layout.height - 26}
                className="stroke-ring"
                strokeWidth={t === 0 ? 1.2 : 0.7}
                strokeDasharray={t === 0 ? undefined : "2 4"}
              />
              <text
                x={layout.x(t)}
                y={layout.height - 10}
                textAnchor="middle"
                className="fill-bark-soft font-label"
                fontSize={10}
              >
                {formatYear(t)}
              </text>
            </g>
          ))}

          {layout.lanes.map((lane) => (
            <g key={lane.slug} className={lane.accentClass}>
              <rect x={0} y={lane.top} width={WIDTH} height={lane.height} className="fill-soil" fillOpacity={0.5} />
              <text
                x={12}
                y={lane.top + lane.height / 2 + 5}
                className="fill-accent font-display font-semibold"
                fontSize={16}
              >
                {lane.name}
              </text>
              {lane.dots.map((d) => (
                <Link
                  key={d.id}
                  href={d.href}
                  aria-label={`${d.title}, ${lane.name}, ${d.date}${d.contested ? " (contested)" : ""}`}
                  className="tree-mark"
                  onMouseEnter={() => setActive({ ...d, lane: lane.name })}
                  onMouseLeave={() => setActive((cur) => (cur?.id === d.id ? null : cur))}
                  onFocus={() => setActive({ ...d, lane: lane.name })}
                  onBlur={() => setActive((cur) => (cur?.id === d.id ? null : cur))}
                >
                  <g
                    className="timeline-dot"
                    style={{ animationDelay: `${((d.cx - LEFT) / (WIDTH - LEFT)) * GROW_MS}ms` }}
                  >
                    {/* A sound law is a ring boundary: drawn as a ring, dashed when contested. */}
                    <circle
                      cx={d.cx}
                      cy={d.cy}
                      r={DOT}
                      className="fill-cream stroke-accent"
                      strokeWidth={2}
                      strokeDasharray={d.contested ? "2.4 2" : undefined}
                    />
                    <circle cx={d.cx} cy={d.cy} r={2} className="fill-accent" />
                    <circle cx={d.cx} cy={d.cy} r={DOT + 5} fill="transparent" className="tree-hit" />
                  </g>
                </Link>
              ))}
            </g>
          ))}
        </svg>
      </div>
      <figcaption
        aria-live="polite"
        className="mt-3 flex min-h-[3.5rem] flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-ring/60 pt-3 text-sm"
      >
        {active ? (
          <>
            <span className="font-label text-xs text-bark-soft">{active.date}</span>
            <span className={`font-display text-base font-semibold ${active.contested ? "contested-mark" : ""}`}>
              {active.title}
            </span>
            <span className="text-bark-soft">
              · {active.branchName}, {active.lane}
            </span>
            <span className="ipa basis-full text-bark">{active.notation}</span>
          </>
        ) : (
          <span className="text-bark-soft">
            Hover or tab to a ring to read the sound law. Dates are rough midpoints. The text dates on each branch page
            are the record.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
