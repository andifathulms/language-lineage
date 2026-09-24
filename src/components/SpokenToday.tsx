import Link from "next/link";
import type { CountryRollup } from "@/lib/content";
import { worldMap } from "@/lib/worldMap";

const FILL = {
  base: "fill-ring/45 stroke-cream",
  historical: "fill-accent/20 stroke-accent/60 [stroke-dasharray:3_2]",
  living: "fill-accent/75 stroke-cream",
};

/** Countries where a family or branch is spoken today, as a map and a ranked list. */
export function SpokenToday({
  rollup,
  familySlug,
  subject,
  showBranches,
  listLimit = 10,
  stacked = false,
}: {
  rollup: CountryRollup[];
  familySlug: string;
  subject: string; // "Kra-Dai languages", "Southwestern Tai"
  showBranches: boolean; // list which branch is spoken where (family and internal pages)
  listLimit?: number;
  stacked?: boolean; // map above list, for narrow columns
}) {
  if (!rollup.length) return null;
  const map = worldMap(
    rollup.filter((c) => c.living).map((c) => c.iso),
    rollup.filter((c) => !c.living).map((c) => c.iso),
  );
  const hasHistorical = rollup.some((c) => !c.living);
  const hasLiving = rollup.some((c) => c.living);
  const shown = rollup.slice(0, listLimit);
  const rest = rollup.slice(listLimit);

  const row = (c: CountryRollup) => (
    <li key={c.iso} className="flex flex-col gap-0.5 border-b border-ring/50 py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="font-display text-[1.05rem] font-semibold leading-snug">
        {c.name}
        {!c.living && <span className="ml-2 font-label text-[0.62rem] font-medium uppercase tracking-[0.12em] text-bark-soft">formerly</span>}
      </span>
      <span className="text-sm leading-snug text-bark-soft sm:text-right">
        {c.entries.map((e, i) => (
          <span key={e.branch.id}>
            {i > 0 && " · "}
            {showBranches && (
              <Link href={`/${familySlug}/${e.branch.id}/`} className="no-underline hover:text-accent">
                {e.branch.name}
              </Link>
            )}
            {showBranches && e.speakers && " "}
            {e.speakers && <span className="tabular-nums">{e.speakers}</span>}
          </span>
        ))}
      </span>
    </li>
  );

  return (
    <div className={`grid gap-8 ${stacked ? "" : "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start"}`}>
      <figure className="plate overflow-hidden p-2 sm:p-3">
        {map && (
          <svg
            viewBox={`0 0 ${map.width} ${map.height}`}
            role="img"
            aria-label={`Map of the countries where ${subject} are spoken${hasHistorical ? " or were once spoken" : ""}`}
            className="block h-auto w-full"
          >
            {map.shapes.map((s, i) => (
              <path key={i} d={s.d} className={FILL[s.state]} strokeWidth={s.state === "historical" ? 0.9 : 0.5} strokeLinejoin="round" />
            ))}
            {map.dots.map((d) => (
              <g key={d.name}>
                <title>{d.name}</title>
                <circle cx={d.x} cy={d.y} r={7} className={d.state === "living" ? "fill-accent/25" : "fill-none"} />
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={3.2}
                  className={d.state === "living" ? "fill-accent stroke-cream" : "fill-cream stroke-accent"}
                  strokeWidth={1.2}
                />
              </g>
            ))}
          </svg>
        )}
        <figcaption className="flex flex-wrap gap-x-5 gap-y-1 px-2 pb-1 pt-3 font-label text-[0.65rem] uppercase tracking-[0.12em] text-bark-soft">
          {hasLiving && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-4 rounded-[2px] bg-accent/75" />
              Spoken today
            </span>
          )}
          {hasHistorical && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-4 rounded-[2px] border border-dashed border-accent/60 bg-accent/20" />
              Formerly spoken
            </span>
          )}
          <span className="normal-case tracking-normal">Shading marks whole countries, not the regions within them.</span>
        </figcaption>
      </figure>

      <div>
        <ol>{shown.map(row)}</ol>
        {rest.length > 0 && (
          <details className="group mt-1">
            <summary className="cursor-pointer list-none py-2 font-label text-[0.68rem] uppercase tracking-[0.12em] text-bark-soft hover:text-accent [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="mr-1.5 inline-block transition-transform duration-base ease-grow group-open:rotate-90">
                ›
              </span>
              {rest.length} more {rest.length === 1 ? "country" : "countries"}
            </summary>
            <ol>{rest.map(row)}</ol>
          </details>
        )}
        <p className="mt-4 text-sm leading-relaxed text-bark-soft">
          Figures are rough first-language estimates, rounded, from censuses and Ethnologue. Counts for small or
          scattered communities are especially uncertain.
        </p>
      </div>
    </div>
  );
}
