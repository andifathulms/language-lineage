import type { TurningPointType } from "@/lib/types";
import { TypeGlyph } from "./LineageTree";
import { TP_LABEL } from "./labels";

const PIN_TYPES: TurningPointType[] = ["SPLIT", "CONTACT", "WRITING_SYSTEM_ADOPTED", "EXTINCTION", "REVITALIZATION"];

function Swatch({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="-14 -10 28 20" className="h-5 w-7 shrink-0" aria-hidden="true">
      {children}
    </svg>
  );
}

export function TreeLegend() {
  return (
    <dl className="grid gap-x-8 gap-y-3 text-sm text-bark-soft sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center gap-2.5">
        <dt>
          <Swatch>
            <rect x={-5} y={-10} width={10} height={20} className="fill-heartwood" />
            <line x1={-9} x2={9} y1={0} y2={0} className="stroke-paper" strokeWidth={2} />
          </Swatch>
        </dt>
        <dd>Full ring: a sound law, the line between before and after</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt>
          <Swatch>
            <rect x={-5} y={-10} width={10} height={20} className="fill-heartwood" />
            <line x1={-9} x2={9} y1={0} y2={0} className="stroke-paper" strokeWidth={2} strokeDasharray="2.2 1.8" />
          </Swatch>
        </dt>
        <dd>Dashed ring: dating, cause or credit is contested</dd>
      </div>
      {PIN_TYPES.map((t) => (
        <div key={t} className="flex items-center gap-2.5">
          <dt>
            <Swatch>
              <TypeGlyph type={t} />
            </Swatch>
          </dt>
          <dd>{TP_LABEL[t]}</dd>
        </div>
      ))}
      <div className="flex items-center gap-2.5">
        <dt>
          <Swatch>
            <path d="M-12,6 Q0,-12 12,6" fill="none" className="stroke-accent" strokeWidth={1.4} strokeDasharray="1.5 4" strokeLinecap="round" />
          </Swatch>
        </dt>
        <dd>Dotted arc: a proposed grouping that is still disputed</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt>
          <Swatch>
            <ellipse rx={8} ry={5} className="fill-heartwood stroke-bark" strokeWidth={1.2} />
            <line x1={-7} x2={7} className="stroke-paper" strokeWidth={1.2} />
          </Swatch>
        </dt>
        <dd>Graft: two lineages converging through contact</dd>
      </div>
      <div className="flex items-center gap-2.5">
        <dt>
          <Swatch>
            <path d="M-5,10L-5,-2L-2,-7L0,-3L3,-8L5,-2L5,10Z" className="fill-bark-soft" fillOpacity={0.55} />
          </Swatch>
        </dt>
        <dd>Snapped limb: an extinct branch with no living descendants</dd>
      </div>
    </dl>
  );
}
