import type { Figure, TurningPoint } from "@/lib/types";
import { TypeGlyph } from "./LineageTree";
import { InlineMarkdown } from "./Markdown";
import { SourceList } from "./SourceList";
import { TP_LABEL } from "./labels";

// Vertical ring-mark list: the branch drawn as a single upright limb with
// each turning point cut into it, oldest at the top.
export function TurningPointList({
  turningPoints,
  figuresFor,
}: {
  turningPoints: TurningPoint[];
  figuresFor: (tp: TurningPoint) => Figure[];
}) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[6px] rounded-full bg-heartwood/85" />
      {turningPoints.map((tp) => {
        const figures = figuresFor(tp);
        return (
          <li key={tp.id} id={tp.id} className="relative scroll-mt-24 pb-10 pl-12 last:pb-0">
            <svg viewBox="-14 -8 28 16" aria-hidden="true" className="absolute left-0 top-[0.35rem] h-4 w-7 overflow-visible">
              {tp.type === "SOUND_LAW" ? (
                <>
                  <line x1={-10} x2={10} className="stroke-bark/50" strokeWidth={0.8} strokeDasharray={tp.contested ? "2 2" : undefined} />
                  <line x1={-3} x2={3} className="stroke-cream" strokeWidth={2} strokeDasharray={tp.contested ? "1.6 1.2" : undefined} />
                </>
              ) : (
                <>
                  <line x1={0} x2={9} className="stroke-cream" strokeWidth={1.4} />
                  <g transform="translate(11,0)">
                    <TypeGlyph type={tp.type} />
                  </g>
                </>
              )}
            </svg>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="specimen">{TP_LABEL[tp.type]}</span>
              <span className="font-label text-xs text-bark-soft">{tp.date}</span>
              {tp.contested && (
                <span className="contested-mark font-label text-[0.68rem] font-medium uppercase tracking-[0.12em] text-accent">
                  Contested
                </span>
              )}
            </div>
            <h3 className="mt-2 text-xl font-semibold leading-snug">{tp.title}</h3>
            <p className="mt-2 max-w-reading leading-relaxed">
              <InlineMarkdown>{tp.description}</InlineMarkdown>
            </p>
            {figures.length > 0 && (
              <p className="mt-3 text-sm text-bark-soft">
                <span className="font-label text-[0.68rem] uppercase tracking-[0.12em]">Figures · </span>
                {figures.map((f, i) => (
                  <span key={f.id}>
                    {i > 0 && ", "}
                    <span className="font-semibold text-bark">{f.name}</span>
                    {f.lifespan && <span> ({f.lifespan})</span>}
                  </span>
                ))}
              </p>
            )}
            <SourceList sources={tp.sources} />
          </li>
        );
      })}
    </ol>
  );
}
