import type { Source } from "@/lib/types";

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <details className="group mt-3 text-sm">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-label text-[0.68rem] uppercase tracking-[0.12em] text-bark-soft hover:text-accent [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="inline-block transition-transform duration-base ease-grow group-open:rotate-90">
          ›
        </span>
        Sources ({sources.length})
      </summary>
      <ul className="mt-2 space-y-1.5 border-l border-ring pl-4 text-bark-soft">
        {sources.map((s) => (
          <li key={s.citation}>{s.url ? <a href={s.url}>{s.citation}</a> : s.citation}</li>
        ))}
      </ul>
    </details>
  );
}
