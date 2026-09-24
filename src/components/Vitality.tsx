import type { Vitality } from "@/lib/types";
import { VITALITY } from "./labels";

/** Five cells filled to the UNESCO level: vitality shown as well as named. */
export function VitalityMeter({ vitality }: { vitality: Vitality }) {
  const { label, level } = VITALITY[vitality];
  return (
    <span className="inline-flex items-center gap-2.5">
      {level !== null && (
        <span aria-hidden="true" className="inline-flex gap-[3px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={`h-2.5 w-2 rounded-[1.5px] ${n <= level ? "bg-accent" : "border border-ring bg-transparent"}`} />
          ))}
        </span>
      )}
      <span className="font-label text-[0.68rem] font-medium uppercase tracking-[0.12em] text-bark-soft">{label}</span>
    </span>
  );
}
