import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassificationList } from "@/components/ClassificationList";
import { FamilyAccent } from "@/components/FamilyAccent";
import { Prose } from "@/components/Markdown";
import { TurningPointList } from "@/components/TurningPointList";
import { figuresForTurningPoint, getBranch, getBranches, getFamily, unattachedFigures } from "@/lib/content";
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
  const toc = [
    ...branch.chapters.map((c) => ({ href: `#${slugify(c.title)}`, label: c.title })),
    { href: "#turning-points", label: "Turning points" },
    ...(branch.contested_classifications.length ? [{ href: "#contested", label: "Contested classifications" }] : []),
  ];

  return (
    <FamilyAccent family={family}>
      <article className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="border-b border-ring/60 pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="font-label text-xs uppercase tracking-[0.14em] text-bark-soft">
            <Link href="/" className="no-underline hover:text-accent">
              Families
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${family.slug}/`} className="no-underline hover:text-accent">
              {family.name} tree
            </Link>
          </nav>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.05]">
            {branch.name}
            {branch.extinct && <span className="text-bark-soft"> †</span>}
          </h1>
          <p className="mt-4 max-w-2xl text-xl italic leading-relaxed text-bark-soft">{branch.defining_innovation}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="specimen">{branch.era}</span>
            <span className="specimen">{branch.region}</span>
            {branch.extinct && <span className="specimen">No living descendants</span>}
          </div>
        </header>

        <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0">
            {branch.chapters.map((c) => (
              <section key={c.title} id={slugify(c.title)} className="scroll-mt-24 pb-6">
                <h2 className="text-3xl font-semibold">{c.title}</h2>
                <Prose>{c.body}</Prose>
              </section>
            ))}

            <section id="turning-points" aria-labelledby="tp-heading" className="scroll-mt-24 border-t border-ring/60 pt-10">
              <h2 id="tp-heading" className="text-3xl font-semibold">
                Turning points
              </h2>
              <p className="mb-8 mt-2 text-bark-soft">Oldest first, as rings along the limb.</p>
              <TurningPointList turningPoints={branch.turning_points} figuresFor={figuresForTurningPoint} />
              {loose.length > 0 && (
                <p className="mt-8 text-sm text-bark-soft">
                  Also associated with this branch: {loose.map((f) => f.name).join(", ")}.
                </p>
              )}
            </section>

            {branch.contested_classifications.length > 0 && (
              <section id="contested" aria-labelledby="cc-heading" className="mt-16 scroll-mt-24 border-t border-ring/60 pt-10">
                <h2 id="cc-heading" className="text-3xl font-semibold">
                  Contested classifications
                </h2>
                <p className="mb-8 mt-2 max-w-reading text-bark-soft">
                  These disagreements may never be settled. Each position is given with its grounds, and no side is
                  declared correct.
                </p>
                <ClassificationList items={branch.contested_classifications} familySlug={family.slug} branchById={byId} />
              </section>
            )}
          </div>

          <aside className="order-first lg:order-none">
            <div className="space-y-8 lg:sticky lg:top-8">
              <nav aria-label="On this page" className="hidden lg:block">
                <p className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bark-soft">On this page</p>
                <ul className="mt-3 space-y-1.5 border-l border-ring pl-4 text-sm">
                  {toc.map((t) => (
                    <li key={t.href}>
                      <a href={t.href} className="no-underline hover:text-accent">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bark-soft">
                    {branch.parent_ids.length > 1 ? "Grafted from" : "Grows from"}
                  </dt>
                  <dd className="mt-1 font-display text-lg">
                    {branch.parent_ids.length ? (
                      <BranchLinks ids={branch.parent_ids} byId={byId} familySlug={family.slug} />
                    ) : (
                      <span className="italic text-bark-soft">
                        {family.superfamily ? `Proto-${family.superfamily}` : "—"} (outside v1)
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bark-soft">
                    Branches into
                  </dt>
                  <dd className="mt-1 font-display text-lg">
                    {branch.successor_ids.length ? (
                      <BranchLinks ids={branch.successor_ids} byId={byId} familySlug={family.slug} />
                    ) : (
                      <span className="italic text-bark-soft">{branch.extinct ? "None: the limb ends here" : "Not yet mapped further"}</span>
                    )}
                  </dd>
                </div>
                {branch.descendants && branch.descendants.length > 0 && (
                  <div>
                    <dt className="font-label text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bark-soft">
                      {branch.extinct ? "Attested languages" : "Canopy"}
                    </dt>
                    <dd className="mt-1 leading-relaxed">{branch.descendants.join(" · ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </article>
    </FamilyAccent>
  );
}
