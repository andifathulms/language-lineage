import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassificationList } from "@/components/ClassificationList";
import { FamilyAccent } from "@/components/FamilyAccent";
import { Prose } from "@/components/Markdown";
import { OnThisPage } from "@/components/OnThisPage";
import { Pager } from "@/components/Pager";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SampleCard } from "@/components/SampleCard";
import { SpokenToday } from "@/components/SpokenToday";
import { VitalityMeter } from "@/components/Vitality";
import { TurningPointList } from "@/components/TurningPointList";
import {
  ancestry,
  figuresForTurningPoint,
  getBranch,
  getBranches,
  getFamily,
  leavesUnder,
  rollupCountries,
  spineOrder,
  unattachedFigures,
} from "@/lib/content";
import type { Branch } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBranches().map((b) => ({ family: b.family, branch: b.id }));
}

export function generateMetadata({ params }: { params: { branch: string } }): Metadata {
  const branch = getBranch(params.branch);
  return branch ? { title: branch.name, description: branch.defining_innovation } : {};
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function BranchLinks({ ids, byId, familySlug }: { ids: string[]; byId: Map<string, Branch>; familySlug: string }) {
  return (
    <>
      {ids.map((id, i) => {
        const b = byId.get(id);
        return (
          <span key={id}>
            {i > 0 && ", "}
            {b ? <Link href={`/${familySlug}/${b.id}/`}>{b.name}</Link> : id}
          </span>
        );
      })}
    </>
  );
}

export default function BranchPage({ params }: { params: { family: string; branch: string } }) {
  const family = getFamily(params.family);
  const branch = getBranch(params.branch);
  if (!family || !branch || branch.family !== family.slug) notFound();

  const byId = new Map(getBranches(family.slug).map((b) => [b.id, b]));
  const loose = unattachedFigures(branch);
  const lineage = ancestry(branch);
  const spine = spineOrder(family.slug);
  const at = spine.findIndex((b) => b.id === branch.id);
  const prev = spine[at - 1];
  const next = spine[at + 1];
  const isLeaf = !branch.successor_ids.length;
  const rollup = rollupCountries(leavesUnder(branch));
  const toc = [
    ...branch.chapters.map((c) => ({ href: `#${slugify(c.title)}`, label: c.title })),
    ...(branch.sample ? [{ href: "#sample", label: "In its own words" }] : []),
    ...(rollup.length ? [{ href: "#spoken-today", label: isLeaf ? "Where it's spoken" : "Where its languages are spoken" }] : []),
    { href: "#turning-points", label: "Turning points" },
    ...(branch.contested_classifications.length ? [{ href: "#contested", label: "Contested classifications" }] : []),
  ];

  return (
    <FamilyAccent family={family}>
      <ReadingProgress />
      <div className="bg-gradient-to-b from-accent/[0.07] to-transparent">
        <header className="mx-auto max-w-page px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
          <nav aria-label="Breadcrumb" className="meta">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href={`/${family.slug}/`} className="text-accent no-underline hover:text-bark">
                  {family.name} tree
                </Link>
              </li>
              {lineage.map((b) => (
                <li key={b.id} className="flex items-center gap-x-2">
                  <span aria-hidden="true" className="text-ring">
                    /
                  </span>
                  <Link href={`/${family.slug}/${b.id}/`} className="no-underline hover:text-accent">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.4rem)] font-semibold leading-[1.03]">
            {branch.name}
            {branch.extinct && <span className="text-bark-soft"> †</span>}
          </h1>
          <p className="mt-5 max-w-3xl font-serif text-[1.3rem] italic leading-[1.55] text-bark-soft sm:text-[1.4rem]">
            {branch.defining_innovation}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            <span className="specimen">{branch.era}</span>
            <span className="specimen">{branch.region}</span>
            {branch.extinct && <span className="specimen">No living descendants</span>}
          </div>
        </header>
      </div>

      <article className="mx-auto max-w-page px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 border-t border-ring/60 pt-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0">
            <details className="group mb-10 rounded-[10px] border border-ring/70 bg-paper px-5 py-3.5 lg:hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="meta">On this page</span>
                <span aria-hidden="true" className="text-bark-soft transition-transform duration-base ease-grow group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <ol className="mt-3 space-y-1.5 border-t border-ring/60 pt-3 text-[0.95rem]">
                {toc.map((t) => (
                  <li key={t.href}>
                    <a href={t.href} className="no-underline hover:text-accent">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            {branch.chapters.map((c, i) => (
              <section key={c.title} id={slugify(c.title)} className="scroll-mt-24 pb-8">
                <p className="flex items-center gap-3 font-label text-[0.7rem] font-medium tracking-[0.14em] text-accent">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="h-px w-10 bg-accent/30" />
                </p>
                <h2 className="mt-3 text-[1.9rem] font-semibold leading-tight sm:text-[2.1rem]">{c.title}</h2>
                <div className={i === 0 ? "prose-lede" : undefined}>
                  <Prose>{c.body}</Prose>
                </div>
              </section>
            ))}

            {branch.sample && (
              <section id="sample" aria-labelledby="sample-heading" className="scroll-mt-24 pb-12 pt-4">
                <p className="meta">A sample</p>
                <h2 id="sample-heading" className="mb-6 mt-2 text-[1.9rem] font-semibold sm:text-[2.1rem]">
                  In its own words
                </h2>
                <SampleCard sample={branch.sample} />
              </section>
            )}

            {rollup.length > 0 && (
              <section id="spoken-today" aria-labelledby="spoken-heading" className="mt-8 scroll-mt-24 border-t border-ring/60 pb-4 pt-12">
                <p className="meta">On the map</p>
                <h2 id="spoken-heading" className="mb-6 mt-2 text-[1.9rem] font-semibold sm:text-[2.1rem]">
                  {isLeaf ? "Where it’s spoken" : "Where its languages are spoken"}
                </h2>
                <SpokenToday
                  rollup={rollup}
                  familySlug={family.slug}
                  subject={isLeaf ? `${branch.name} languages` : `the languages of ${branch.name}`}
                  showBranches={!isLeaf}
                  listLimit={8}
                  stacked
                />
              </section>
            )}

            <section id="turning-points" aria-labelledby="tp-heading" className="mt-8 scroll-mt-24 border-t border-ring/60 pt-12">
              <p className="meta">Rings along the limb</p>
              <h2 id="tp-heading" className="mt-2 text-[1.9rem] font-semibold sm:text-[2.1rem]">
                Turning points
              </h2>
              <p className="mb-10 mt-2 text-bark-soft">Oldest first.</p>
              <TurningPointList turningPoints={branch.turning_points} figuresFor={figuresForTurningPoint} />
              {loose.length > 0 && (
                <p className="mt-10 text-sm text-bark-soft">
                  Also associated with this branch: {loose.map((f) => f.name).join(", ")}.
                </p>
              )}
            </section>

            {branch.contested_classifications.length > 0 && (
              <section id="contested" aria-labelledby="cc-heading" className="mt-20 scroll-mt-24 border-t border-ring/60 pt-12">
                <p className="meta">Outside the tree</p>
                <h2 id="cc-heading" className="mt-2 text-[1.9rem] font-semibold sm:text-[2.1rem]">
                  Contested classifications
                </h2>
                <p className="mb-10 mt-2 max-w-reading text-bark-soft">
                  These disagreements may never be settled. Each position is given with its grounds, and no side is
                  declared correct.
                </p>
                <ClassificationList items={branch.contested_classifications} familySlug={family.slug} branchById={byId} />
              </section>
            )}
          </div>

          <aside className="min-w-0">
            <div className="space-y-10 lg:sticky lg:top-24">
              <div className="hidden lg:block">
                <OnThisPage items={toc} />
              </div>

              <dl className="plate space-y-5 p-5 text-sm">
                {branch.speakers && (
                  <div className="border-b border-ring/60 pb-5">
                    <dt className="meta">Speakers today</dt>
                    <dd className="mt-1.5 font-display text-lg leading-snug">{branch.speakers.estimate}</dd>
                    <dd className="mt-2">
                      <VitalityMeter vitality={branch.speakers.vitality} />
                    </dd>
                    {branch.speakers.note && <dd className="mt-2 leading-relaxed text-bark-soft">{branch.speakers.note}</dd>}
                  </div>
                )}
                <div>
                  <dt className="meta">{branch.parent_ids.length > 1 ? "Grafted from" : "Grows from"}</dt>
                  <dd className="mt-1.5 font-display text-lg leading-snug">
                    {branch.parent_ids.length ? (
                      <BranchLinks ids={branch.parent_ids} byId={byId} familySlug={family.slug} />
                    ) : (
                      <span className="italic text-bark-soft">
                        {family.buried_root.name}
                        {family.buried_root.proven ? " (outside this tree)" : ""}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="border-t border-ring/60 pt-5">
                  <dt className="meta">Branches into</dt>
                  <dd className="mt-1.5 font-display text-lg leading-snug">
                    {branch.successor_ids.length ? (
                      <BranchLinks ids={branch.successor_ids} byId={byId} familySlug={family.slug} />
                    ) : (
                      <span className="italic text-bark-soft">{branch.extinct ? "None: the limb ends here" : "Not yet mapped further"}</span>
                    )}
                  </dd>
                </div>
                {branch.descendants && branch.descendants.length > 0 && (
                  <div className="border-t border-ring/60 pt-5">
                    <dt className="meta">{branch.extinct ? "Attested languages" : "Canopy"}</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {branch.descendants.map((d) => (
                        <span key={d} className="rounded-full bg-moss/10 px-2.5 py-0.5 text-[0.85rem] text-bark">
                          {d}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              <Link
                href={`/${family.slug}/`}
                className="group flex items-center gap-2 font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bark-soft no-underline hover:text-accent"
              >
                <span aria-hidden="true" className="transition-transform duration-base ease-grow group-hover:-translate-x-1">
                  ←
                </span>
                See it on the {family.name} tree
              </Link>
            </div>
          </aside>
        </div>

        <Pager
          label="Continue along the limb"
          prev={prev && { href: `/${family.slug}/${prev.id}/`, kicker: "Previous branch", label: prev.name }}
          next={next && { href: `/${family.slug}/${next.id}/`, kicker: "Next branch", label: next.name }}
        />
      </article>
    </FamilyAccent>
  );
}
