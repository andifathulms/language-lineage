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
          className="fill-paper stroke-accent"
          strokeWidth={2}
          strokeDasharray={e.tp.contested ? "2.4 2" : undefined}
        />
        <circle cx="8" cy="8" r="2" className="fill-accent" />
      </svg>
      <Link href={lawHref(e)} className="font-display text-lg font-semibold leading-snug no-underline hover:text-accent">
        <span className={e.tp.contested ? "contested-mark" : ""}>{e.tp.title}</span>
      </Link>
      <p className="mt-2 font-label text-[0.68rem] uppercase tracking-[0.1em] text-bark-soft">
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
    const groups = families
      .map((f) => ({ family: f, laws: laws.filter((e) => e.tp.process === p.id && e.family.slug === f.slug) }))
      .filter((g) => g.laws.length);
    return { ...p, groups, count: groups.reduce((n, g) => n + g.laws.length, 0) };
  }).filter((r) => r.groups.length);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6">
      <FamilyAccentStyles families={families} />
      <header className="pb-10 pt-12 sm:pt-16">
        <nav aria-label="Breadcrumb" className="meta">
          <Link href="/" className="no-underline hover:text-accent">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2 text-ring">
            /
          </span>
          <span>Sound laws</span>
        </nav>
        <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.04]">Comparing sound laws</h1>
        <p className="mt-5 max-w-reading text-[1.1rem] leading-[1.7] text-bark-soft">
          Every sound law recorded here, from {families.length} families with no proven relationship to each other,
          lined up by kind and placed on one clock. Languages that have never been in contact keep making the same
          kinds of change: consonants lost at the ends of words, stops moving in chains, contrasts merging.
        </p>
        <nav aria-label="Kinds of change" className="mt-8 flex flex-wrap gap-2">
          {rows.map((r) => (
            <a
              key={r.id}
              href={`#${r.id}`}
              className="rounded-full border border-ring bg-paper px-3.5 py-1.5 text-sm text-bark no-underline transition-colors duration-base ease-grow hover:border-bark"
            >
              {r.label} <span className="font-label text-xs text-bark-soft">{r.count}</span>
            </a>
          ))}
        </nav>
      </header>

      <section aria-labelledby="timeline-heading">
        <p className="meta">All families</p>
        <h2 id="timeline-heading" className="mt-2 text-3xl font-semibold">
          On one timeline
        </h2>
        <div className="mt-6">
          <SoundLawTimeline lanes={lanes} />
        </div>
      </section>

      <section aria-labelledby="matrix-heading" className="mt-20">
        <p className="meta">Parallel changes</p>
        <h2 id="matrix-heading" className="mt-2 text-3xl font-semibold">
          By kind of change
        </h2>
        <p className="mt-2 max-w-reading text-bark-soft">
          Kinds with examples in more than one family are marked{" "}
          <span className="font-label text-[0.7rem] uppercase tracking-[0.12em] text-bark">parallel</span>. The
          similarity is one of kind, not of ancestry. No relationship between these families has been proven (see the
          Indo-Uralic and Nostratic debates).
        </p>

        <div className="mt-6 divide-y divide-ring/60 border-t border-ring/60">
          {rows.map((r) => (
            <section key={r.id} id={r.id} aria-labelledby={`${r.id}-heading`} className="scroll-mt-24 py-12">
              <div className="grid gap-4 md:grid-cols-[1fr_2fr] md:items-baseline">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 id={`${r.id}-heading`} className="text-2xl font-semibold">
                    {r.label}
                  </h3>
                  {r.groups.length > 1 && (
                    <span className="rounded-full border border-bark/30 px-2 py-0.5 font-label text-[0.65rem] font-medium uppercase tracking-[0.12em]">
                      Parallel · {r.groups.length} families
                    </span>
                  )}
                </div>
                <p className="max-w-reading leading-relaxed text-bark-soft">{r.blurb}</p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {r.groups.map((g) => (
                  <div key={g.family.slug} className={`${accentClass(g.family)} plate relative overflow-hidden p-5`}>
                    <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
                    <p className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-accent">
                      {g.family.name}
                    </p>
                    <ul className="mt-4 space-y-5">
                      {g.laws.map((e) => (
                        <LawItem key={e.tp.id} e={e} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
