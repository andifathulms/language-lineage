import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfidenceRings } from "@/components/ConfidenceRings";
import { FamilyAccent } from "@/components/FamilyAccent";
import { LineageTree } from "@/components/LineageTree";
import { TreeLegend } from "@/components/TreeLegend";
import { getBranches, getFamilies, getFamily } from "@/lib/content";
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

/** Parents before children, siblings in content order: the spine as a list. */
function spineOrder(branches: Branch[], rootId: string): Branch[] {
  const byId = new Map(branches.map((b) => [b.id, b]));
  const out: Branch[] = [];
  const seen = new Set<string>();
  const visit = (id: string) => {
    const b = byId.get(id);
    if (!b || seen.has(id) || b.parent_ids.some((p) => byId.has(p) && !seen.has(p))) return;
    seen.add(id);
    out.push(b);
    b.successor_ids.forEach(visit);
  };
  visit(rootId);
  branches.forEach((b) => !seen.has(b.id) && out.push(b));
  return out;
}

function depthOf(id: string, byId: Map<string, Branch>): number {
  const parents = byId.get(id)?.parent_ids.filter((p) => byId.has(p)) ?? [];
  return parents.length ? 1 + Math.max(...parents.map((p) => depthOf(p, byId))) : 0;
}

export default function FamilyPage({ params }: { params: { family: string } }) {
  const family = getFamily(params.family);
  if (!family) notFound();
  const branches = getBranches(family.slug);
  const spine = spineOrder(branches, family.root_branch_id);
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

  return (
    <FamilyAccent family={family}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="pb-6 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="font-label text-xs uppercase tracking-[0.14em] text-bark-soft">
            <Link href="/" className="no-underline hover:text-accent">
              Families
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-accent">{family.superfamily ?? family.name}</span>
          </nav>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-tight">The {family.name} tree</h1>
          <p className="mt-4 max-w-reading text-lg leading-relaxed text-bark-soft">{family.summary}</p>
        </header>

        <section aria-label={`${family.name} lineage tree`} className="-mx-2 sm:mx-0">
          <LineageTree
            familySlug={family.slug}
            rootId={family.root_branch_id}
            branches={treeBranches}
            classifications={treeClassifications}
          />
        </section>

        <details className="mt-8 border-y border-ring/60 py-4 [&_summary::-webkit-details-marker]:hidden" open>
          <summary className="cursor-pointer font-label text-xs font-medium uppercase tracking-[0.14em] text-bark-soft">
            How to read the tree
          </summary>
          <div className="mt-5">
            <TreeLegend />
          </div>
        </details>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.25fr_1fr]">
          <section aria-labelledby="spine-heading">
            <h2 id="spine-heading" className="text-2xl font-semibold">
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
                    <Link href={`/${family.slug}/${b.id}/`} className="font-display text-xl font-semibold no-underline hover:text-accent">
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
            <h2 id="contested-heading" className="text-2xl font-semibold">
              Still disputed
            </h2>
            <p className="mt-2 text-bark-soft">
              Proposed groupings shown outside the tree proper. This page states each position and its grounds. It does
              not decide which side is right.
            </p>
            <ul className="mt-6 space-y-5">
              {classifications.map((c) => (
                <li key={c.id} className="rounded-sm border border-dashed border-accent/50 p-4">
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
      </div>
    </FamilyAccent>
  );
}
