"use client";

import Link from "next/link";
import { useState } from "react";
import type { CognateTable } from "@/lib/types";

// The interactive part of "How we know": pick a sound correspondence and the
// rows that show it light up, with what the proto-sound became in each language.
export function CognateGrid({ table, familySlug }: { table: Omit<CognateTable, "intro" | "sources">; familySlug: string }) {
  const [active, setActive] = useState<number | null>(table.correspondences.length ? 0 : null);
  const c = active === null ? null : table.correspondences[active];
  const lit = new Set(c?.rows ?? []);
  const star = table.proto_attested ? "" : "*";

  return (
    <div>
      {table.correspondences.length > 0 && (
        <div className="mb-5">
          <p className="meta" id="corr-label">
            Follow one sound
          </p>
          <div role="group" aria-labelledby="corr-label" className="mt-2.5 flex flex-wrap gap-2">
            {table.correspondences.map((k, i) => (
              <button
                key={k.label}
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(active === i ? null : i)}
                className={`rounded-full border px-3.5 py-1 font-ipa text-[1.02rem] transition-colors duration-base ease-grow ${
                  active === i ? "border-accent bg-accent text-cream" : "border-ring bg-paper text-bark hover:border-accent/60"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="plate overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-ring">
              <th scope="col" className="sticky left-0 bg-paper px-4 py-3 font-label text-[0.65rem] font-medium uppercase tracking-[0.12em] text-bark-soft">
                Meaning
              </th>
              <th scope="col" className="px-4 py-3 font-label text-[0.65rem] font-medium uppercase tracking-[0.12em] text-accent">
                {table.proto_label}
              </th>
              {table.languages.map((l) => (
                <th key={l.name} scope="col" className="px-4 py-3 font-display text-[0.98rem] font-semibold">
                  <Link href={`/${familySlug}/${l.branch_id}/`} className="no-underline hover:text-accent">
                    {l.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => {
              const on = lit.has(i);
              const dim = c !== null && !on;
              return (
                <tr
                  key={r.gloss}
                  className={`border-b border-ring/50 transition-[background-color,opacity] duration-base ease-grow ${
                    on ? "bg-accent/[0.09]" : ""
                  } ${dim ? "opacity-45" : ""}`}
                >
                  <th scope="row" className="sticky left-0 bg-paper px-4 py-2.5 font-serif text-[0.95rem] font-normal italic text-bark-soft">
                    ‘{r.gloss}’
                  </th>
                  <td className="whitespace-nowrap px-4 py-2.5 font-ipa text-[1.05rem] text-accent">{r.proto ? `${star}${r.proto}` : "—"}</td>
                  {r.forms.map((f, j) => (
                    <td key={j} className="whitespace-nowrap px-4 py-2.5 font-ipa text-[1.05rem]">
                      {f ?? <span className="text-bark-soft/60">—</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {c && (
            <tfoot>
              <tr className="bg-accent/[0.06]">
                <th scope="row" className="sticky left-0 bg-paper px-4 py-3 font-label text-[0.65rem] font-medium uppercase tracking-[0.12em] text-accent">
                  Becomes
                </th>
                <td className="px-4 py-3 font-ipa text-[1.1rem] font-semibold text-accent">{c.label}</td>
                {c.reflexes.map((x, j) => (
                  <td key={j} className="px-4 py-3 font-ipa text-[1.1rem] font-semibold">
                    {x ?? <span className="text-bark-soft/60">—</span>}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p className="mt-3 text-sm text-bark-soft" aria-live="polite">
        {c
          ? `Rows showing ${c.label} are highlighted. The bottom line gives its regular outcome in each language.`
          : "A dash means the language uses an unrelated word for that meaning."}
      </p>
    </div>
  );
}
