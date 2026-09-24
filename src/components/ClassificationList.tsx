import Link from "next/link";
import type { Branch, ContestedClassification } from "@/lib/types";
import { ConfidenceRings } from "./ConfidenceRings";
import { InlineMarkdown } from "./Markdown";
import { SourceList } from "./SourceList";

// Enduring disagreements, set apart with a dashed ring-boundary so they read
// as lower confidence than the solid turning points above them.
export function ClassificationList({
  items,
  familySlug,
  branchById,
}: {
  items: ContestedClassification[];
  familySlug: string;
  branchById: Map<string, Branch>;
}) {
  return (
    <ul className="space-y-8">
      {items.map((c) => {
        const [name, ...rest] = c.proposed_grouping.split(":");
        const linked = (c.linked_branch_ids ?? []).map((id) => branchById.get(id)).filter(Boolean) as Branch[];
        return (
          <li
            key={c.id}
            id={c.id}
            className="scroll-mt-24 rounded-[10px] border-2 border-dashed border-accent/40 bg-accent/[0.03] p-5 sm:p-7"
          >
            <ConfidenceRings status={c.status} />
            <h3 className="mt-3 text-2xl font-semibold leading-snug">{name}</h3>
            {rest.length > 0 && <p className="mt-1 italic text-bark-soft">{rest.join(":").trim()}</p>}
            {linked.length > 1 && (
              <p className="mt-3 font-label text-[0.7rem] uppercase tracking-[0.12em] text-bark-soft">
                Would join ·{" "}
                {linked.map((b, i) => (
                  <span key={b.id}>
                    {i > 0 && " + "}
                    <Link href={`/${familySlug}/${b.id}/`}>{b.name}</Link>
                  </span>
                ))}
              </p>
            )}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="border-t-2 border-moss/50 pt-3">
                <h4 className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-moss">Evidence for</h4>
                <p className="mt-2 leading-relaxed">
                  <InlineMarkdown>{c.evidence_for}</InlineMarkdown>
                </p>
              </div>
              <div className="border-t-2 border-accent/50 pt-3">
                <h4 className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-accent">
                  Evidence against
                </h4>
                <p className="mt-2 leading-relaxed">
                  <InlineMarkdown>{c.evidence_against}</InlineMarkdown>
                </p>
              </div>
            </div>
            {c.sources && <SourceList sources={c.sources} />}
          </li>
        );
      })}
    </ul>
  );
}
