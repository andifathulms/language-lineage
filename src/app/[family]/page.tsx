import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CognateGrid } from "@/components/CognateGrid";
import { ConfidenceRings } from "@/components/ConfidenceRings";
import { FamilyEssay } from "@/components/FamilyEssay";
import { FamilyAccent } from "@/components/FamilyAccent";
import { LineageTree } from "@/components/LineageTree";
import { InlineMarkdown } from "@/components/Markdown";
import { Pager } from "@/components/Pager";
import { SourceList } from "@/components/SourceList";
import { SpokenToday } from "@/components/SpokenToday";
import { TreeLegend } from "@/components/TreeLegend";
import {
  familyStats,
  getBranch,
  getBranches,
  getFamilies,
  getFamily,
  getPrimers,
  leavesUnder,
  rollupCountries,
  spineOrder,
} from "@/lib/content";
import type { TreeBranchInput, TreeClassificationInput } from "@/lib/treeLayout";
import type { Branch } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getFamilies().map((f) => ({ family: f.slug }));
}

export function generateMetadata({ params }: { params: { family: string } }): Metadata {
  const family = getFamily(params.family);
  return family ? { title: `${family.name} tree`, description: family.summary } : {};
}

function depthOf(id: string, byId: Map<string, Branch>): number {
  const parents = byId.get(id)?.parent_ids.filter((p) => byId.has(p)) ?? [];
  return parents.length ? 1 + Math.max(...parents.map((p) => depthOf(p, byId))) : 0;
}

export default function FamilyPage({ params }: { params: { family: string } }) {
  const family = getFamily(params.family);
  if (!family) notFound();
  const branches = getBranches(family.slug);
  const spine = spineOrder(family.slug);
  const byId = new Map(branches.map((b) => [b.id, b]));

  const treeBranches: TreeBranchInput[] = branches.map((b) => ({
    id: b.id,
    name: b.name,
    parent_ids: b.parent_ids,
    successor_ids: b.successor_ids,
    extinct: Boolean(b.extinct),
    descendants: b.descendants ?? [],
    turning_points: b.turning_points.map(({ id, type, title, date, contested }) => ({ id, type, title, date, contested })),
  }));
  const classifications = branches.flatMap((b) => b.contested_classifications);
  const treeClassifications: TreeClassificationInput[] = classifications.map((c) => ({
    id: c.id,
    label: c.proposed_grouping.split(":")[0].trim(),
    status: c.status,
    linked: c.linked_branch_ids ?? [],
  }));

  const families = getFamilies();
  const idx = families.findIndex((f) => f.slug === family.slug);
  const prev = families[(idx - 1 + families.length) % families.length];
  const next = families[(idx + 1) % families.length];
  const stats = familyStats(family.slug);
  const rootBranch = getBranch(family.root_branch_id);
  const rollup = rootBranch ? rollupCountries(leavesUnder(rootBranch)) : [];
  const primer = getPrimers()[0];
  const sections = [
    family.essay?.length ? { href: "#story", label: "The story" } : null,
    family.cognates ? { href: "#how-we-know", label: "How we know" } : null,
    rollup.length ? { href: "#spoken-today", label: "Where it's spoken" } : null,
    { href: "#spine-heading", label: "Every branch" },
    classifications.length ? { href: "#contested-heading", label: "Still disputed" } : null,
  ].filter((x): x is { href: string; label: string } => Boolean(x));
  const facts = [
    { label: "Branches", value: String(stats.branches) },
    { label: "Turning points", value: String(stats.turningPoints) },
    { label: "Disputed", value: String(stats.contested) },
  ];

  return (
    <FamilyAccent family={family}>
      <div className="bg-gradient-to-b from-accent/[0.07] to-transparent">
        <header className="mx-auto grid max-w-page gap-10 px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_16rem] lg:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="meta">
              <Link href="/#families" className="no-underline hover:text-accent">
                Families
              </Link>
              <span aria-hidden="true" className="mx-2 text-ring">
                /
              </span>
              <span className="text-accent">{family.superfamily ?? "Top-level family"}</span>
            </nav>
            <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.04]">
              The {family.name} tree
            </h1>
            <p className="mt-5 max-w-reading text-[1.1rem] leading-[1.7] text-bark-soft">{family.summary}</p>
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t border-ring/70 pt-5 lg:grid-cols-1 lg:gap-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="meta">{f.label}</dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums [font-feature-settings:'lnum']">
                  {f.value}
                </dd>
              </div>
            ))}
            {rootBranch?.speakers && (
              <div className="col-span-3 lg:col-span-1">
                <dt className="meta">Speakers today</dt>
                <dd className="mt-1 font-display text-lg leading-snug">{rootBranch.speakers.estimate}</dd>
              </div>
            )}
            <div className="col-span-3 lg:col-span-1">
              <dt className="meta">Buried root</dt>
              <dd className="mt-1 font-display text-lg italic text-bark-soft">{family.buried_root.name}</dd>
            </div>
          </dl>
        </header>
      </div>

      <div className="mx-auto max-w-page px-4 sm:px-6">
        <section aria-label={`${family.name} lineage tree`}>
          <LineageTree
            familySlug={family.slug}
            rootId={family.root_branch_id}
            buriedRoot={family.buried_root}
            branches={treeBranches}
            classifications={treeClassifications}
          />
        </section>

        <details open className="group mt-6 rounded-[10px] border border-ring/70 px-5 py-4 [&_summary::-webkit-details-marker]:hidden sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="meta">How to read the tree</span>
            <span
              aria-hidden="true"
              className="text-bark-soft transition-transform duration-base ease-grow group-open:rotate-180"
            >
              ⌄
            </span>
          </summary>
          <div className="mt-5 border-t border-ring/60 pt-5">
            <TreeLegend />
          </div>
        </details>

        {sections.length > 2 && (
          <nav aria-label="Sections" className="mt-10 flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="rounded-full border border-ring bg-paper px-3.5 py-1 font-label text-[0.68rem] font-medium uppercase tracking-[0.12em] text-bark-soft no-underline hover:border-accent/60 hover:text-bark"
              >
                {s.label}
              </a>
            ))}
          </nav>
        )}

        {family.essay && family.essay.length > 0 && (
          <section id="story" aria-labelledby="story-heading" className="mt-16 scroll-mt-24 border-t border-ring/60 pt-12">
            <p className="meta">The long read</p>
            <h2 id="story-heading" className="mb-8 mt-2 text-3xl font-semibold sm:text-[2.3rem]">
              The story of {family.name}
            </h2>
            <FamilyEssay chapters={family.essay} sources={family.essay_sources ?? []} idPrefix="story-" />
          </section>
        )}

        {family.cognates && (
          <section id="how-we-know" aria-labelledby="evidence-heading" className="mt-20 scroll-mt-24 border-t border-ring/60 pt-12">
            <p className="meta">The evidence</p>
            <h2 id="evidence-heading" className="mt-2 text-3xl font-semibold sm:text-[2.3rem]">
              How we know they are related
            </h2>
            <div className="mb-8 mt-4 max-w-reading text-[1.05rem] leading-[1.7] text-bark-soft">
              <p>
                <InlineMarkdown>{family.cognates.intro}</InlineMarkdown>
              </p>
              {primer && (
                <p className="mt-3 text-[0.95rem]">
                  New to this? <Link href={`/primers/${primer.slug}/`}>{primer.title}</Link> explains the method.
                </p>
              )}
            </div>
            <CognateGrid
              familySlug={family.slug}
              table={{
                proto_label: family.cognates.proto_label,
                languages: family.cognates.languages,
                rows: family.cognates.rows,
                correspondences: family.cognates.correspondences,
              }}
            />
            <SourceList sources={family.cognates.sources} />
          </section>
        )}

        {rollup.length > 0 && (
          <section id="spoken-today" aria-labelledby="spoken-heading" className="mt-20 scroll-mt-24 border-t border-ring/60 pt-12">
            <p className="meta">On the map</p>
            <h2 id="spoken-heading" className="mb-8 mt-2 text-3xl font-semibold sm:text-[2.3rem]">
              Where it&rsquo;s spoken today
            </h2>
            <SpokenToday rollup={rollup} familySlug={family.slug} subject={`${family.name} languages`} showBranches />
          </section>
        )}

        <div className="mt-20 grid gap-16 border-t border-ring/60 pt-12 lg:grid-cols-[1.25fr_1fr]">
          <section aria-labelledby="spine-heading">
            <p className="meta">Every branch</p>
            <h2 id="spine-heading" className="mt-2 scroll-mt-24 text-3xl font-semibold">
              The spine, base to canopy
            </h2>
            <ol className="mt-6 space-y-0">
              {spine.map((b) => {
                const depth = depthOf(b.id, byId);
                return (
                  <li key={b.id} className="relative border-l border-ring py-4 pl-6" style={{ marginLeft: `${depth * 1.25}rem` }}>
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full border-2 ${b.extinct ? "border-bark-soft bg-cream" : "border-heartwood bg-heartwood"}`}
                    />
                    <Link
                      href={`/${family.slug}/${b.id}/`}
                      className="font-display text-xl font-semibold no-underline transition-colors duration-base ease-grow hover:text-accent"
                    >
                      {b.name}
                      {b.extinct ? " †" : ""}
                    </Link>
                    <p className="mt-0.5 font-label text-[0.7rem] uppercase tracking-[0.1em] text-bark-soft">{b.era}</p>
                    <p className="mt-2 italic leading-relaxed text-bark-soft">{b.defining_innovation}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="contested-heading">
            <p className="meta">Outside the tree</p>
            <h2 id="contested-heading" className="mt-2 scroll-mt-24 text-3xl font-semibold">
              Still disputed
            </h2>
            <p className="mt-2 text-bark-soft">
              Proposed groupings shown outside the tree proper. This page states each position and its grounds. It does
              not decide which side is right.
            </p>
            <ul className="mt-6 space-y-5">
              {classifications.map((c) => (
                <li key={c.id} className="rounded-[8px] border border-dashed border-accent/50 bg-accent/[0.03] p-5">
                  <ConfidenceRings status={c.status} />
                  <p className="mt-2 font-display text-lg font-semibold leading-snug">
                    <Link href={`/${family.slug}/${c.branch_id}/#${c.id}`} className="no-underline hover:text-accent">
                      {c.proposed_grouping.split(":")[0]}
                    </Link>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-bark-soft">
                    {c.proposed_grouping.split(":").slice(1).join(":").trim()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Pager
          label="Other families"
          prev={{ href: `/${prev.slug}/`, kicker: "Previous family", label: prev.name }}
          next={{ href: `/${next.slug}/`, kicker: "Next family", label: next.name }}
        />
      </div>
    </FamilyAccent>
  );
}
