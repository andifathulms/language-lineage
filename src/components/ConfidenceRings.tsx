import type { ClassificationStatus } from "@/lib/types";
import { STATUS_LABEL, STATUS_RINGS } from "./labels";

// Three ring-boundaries; the more accepted a grouping, the more of them are
// solid. Lower confidence is drawn, not only labelled.
export function ConfidenceRings({ status }: { status: ClassificationStatus }) {
  const solid = STATUS_RINGS[status];
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" aria-hidden="true" fill="none" stroke="currentColor">
        {[10.5, 7, 3.5].map((r, i) => (
          <circle key={r} cx="12" cy="12" r={r} strokeWidth={1.3} strokeDasharray={i < solid ? undefined : "1.6 2.2"} opacity={i < solid ? 1 : 0.6} />
        ))}
      </svg>
      <span className="font-label text-[0.7rem] font-medium uppercase tracking-[0.12em] text-accent">{STATUS_LABEL[status]}</span>
    </span>
  );
}
