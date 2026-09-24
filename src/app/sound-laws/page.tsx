import type { Metadata } from "next";
import Link from "next/link";
import { accentClass, FamilyAccentStyles } from "@/components/FamilyAccent";
import { PROCESSES } from "@/components/labels";
import { SoundLawTimeline, type TimelineLane } from "@/components/SoundLawTimeline";
import { getFamilies, getSoundLaws, type SoundLawEntry } from "@/lib/content";

export const metadata: Metadata = {
  title: "Comparing sound laws",
  description: "Sound changes from every family covered, lined up by kind and placed on one timeline.",
};

const lawHref = (e: SoundLawEntry) => `/${e.family.slug}/${e.branch.id}/#${e.tp.id}`;

function LawItem({ e }: { e: SoundLawEntry }) {
  return (
    <li className={`${accentClass(e.family)} relative pl-6`}>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="absolute left-0 top-[0.3rem] h-3.5 w-3.5">
        <circle
          cx="8"
          cy="8"
          r="6"
          className="fill-cream stroke-accent"
          strokeWidth={2}
          strokeDasharray={e.tp.contested ? "2.4 2" : undefined}
        />
        <circle cx="8" cy="8" r="2" className="fill-accent" />
      </svg>
      <Link href={lawHref(e)} className="font-display text-lg font-semibold leading-snug no-underline hover:text-accent">
        <span className={e.tp.contested ? "contested-mark" : ""}>{e.tp.title}</span>
      </Link>
      <p className="mt-0.5 font-label text-[0.68rem] uppercase tracking-[0.1em] text-bark-soft">
        {e.branch.name} · {e.tp.date}
      </p>
      <p className="ipa mt-1.5 leading-relaxed text-bark">{e.tp.notation}</p>
    </li>
  );
}

export default function SoundLawsPage() {
  const families = getFamilies();
  const laws = getSoundLaws();

  const lanes: TimelineLane[] = families.map((f) => ({
    slug: f.slug,
    name: f.name,
    accentClass: accentClass(f),
    laws: laws
      .filter((e) => e.family.slug === f.slug)
      .map((e) => ({
        id: e.tp.id,
        title: e.tp.title,
        year: e.tp.sort_year ?? 0,
        date: e.tp.date,
        notation: e.tp.notation ?? "",
        contested: e.tp.contested,
        branchName: e.branch.name,
        href: lawHref(e),
      })),
  }));

  const rows = PROCESSES.map((p) => {
    const cells = families.map((f) => laws.filter((e) => e.tp.process === p.id && e.family.slug === f.slug));
    return { ...p, cells, shared: cells.filter((c) => c.length).length > 1 };
  }).filter((r) => r.cells.some((c) => c.length));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <FamilyAccentStyles families={families} />
      <header className="pb-8 pt-12 sm:pt-16">
        <nav aria-label="Breadcrumb" className="font-label text-xs uppercase tracking-[0.14em] text-bark-soft">
          <Link href="/" className="no-underline hover:text-accent">
            Families
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Sound laws</span>
        </nav>
        <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-tight">Comparing sound laws</h1>
        <p className="mt-4 max-w-reading text-lg leading-relaxed text-bark-soft">
          Every sound law recorded here, from {families.length} families with no proven relationship to each other,
          lined up by kind and placed on one clock. Languages that have never been in contact keep making the same kinds of change: consonants lost at the
          ends of words, stops moving in chains, contrasts merging.
        </p>
      </header>

      <section aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="font-label text-xs font-medium uppercase tracking-[0.16em] text-bark-soft">
          On one timeline
        </h2>
        <div className="mt-4">
          <SoundLawTimeline lanes={lanes} />
        </div>
      </section>

      <section aria-labelledby="matrix-heading" className="mt-16">
        <h2 id="matrix-heading" className="text-3xl font-semibold">
          By kind of change
        </h2>
        <p className="mt-2 max-w-reading text-bark-soft">
          Rows marked <span className="font-label text-[0.7rem] uppercase tracking-[0.12em] text-bark">parallel</span>{" "}
          have examples in more than one family. The similarity is one of kind, not of ancestry. No relationship between
          these families has been proven (see the Indo-Uralic and Nostratic debates).
        </p>

        <div
          className="mt-8 hidden gap-6 border-b border-ring/60 pb-3 md:grid"
          style={{ gridTemplateColumns: `15rem repeat(${families.length}, minmax(0, 1fr))` }}
        >
          <span />
          {families.map((f) => (
            <span
              key={f.slug}
              className={`${accentClass(f)} font-label text-xs font-medium uppercase tracking-[0.14em] text-accent`}
            >
              {f.name}
            </span>
          ))}
        </div>

        <div className="divide-y divide-ring/60">
          {rows.map((r) => (
            <section
              key={r.id}
              id={r.id}
              aria-labelledby={`${r.id}-heading`}
              className="grid scroll-mt-24 gap-6 py-8 md:grid-cols-[15rem_repeat(var(--cols),minmax(0,1fr))]"
              style={{ ["--cols" as string]: families.length }}
            >
              <div>
                <h3 id={`${r.id}-heading`} className="text-xl font-semibold">
                  {r.label}
                </h3>
                {r.shared && (
                  <span className="mt-2 inline-block rounded-full border border-bark/30 px-2 py-0.5 font-label text-[0.65rem] font-medium uppercase tracking-[0.12em]">
                    Parallel
                  </span>
                )}
                <p className="mt-2 text-sm leading-relaxed text-bark-soft">{r.blurb}</p>
              </div>
              {r.cells.map((cell, i) => (
                <div key={families[i].slug}>
                  <p
                    className={`${accentClass(families[i])} mb-3 font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-accent md:hidden`}
                  >
                    {families[i].name}
                  </p>
                  {cell.length ? (
                    <ul className="space-y-5">
                      {cell.map((e) => (
                        <LawItem key={e.tp.id} e={e} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm italic text-bark-soft/80">None recorded yet.</p>
                  )}
                </div>
              ))}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
