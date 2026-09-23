import Link from "next/link";
import { FamilyAccent } from "@/components/FamilyAccent";
import { RingGlyph } from "@/components/RingGlyph";
import { familyStats, getBranch, getFamilies } from "@/lib/content";

export default function Home() {
  const families = getFamilies();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid gap-10 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="specimen mb-6">A narrative encyclopedia of language families</p>
          <h1 className="text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.02]">
            How one language grew into many.
          </h1>
          <p className="mt-6 max-w-reading text-lg leading-relaxed text-bark-soft">
            Each branch of a language family split from its parent for a reason: a sound law that changed every word, a
            migration across the sea, years of contact with neighbours. This is a record of those splits, when they
            happened and what caused them, and of the groupings that historical linguists still argue about.
          </p>
        </div>
        <RingGlyph className="hidden h-56 w-56 justify-self-end text-ring lg:block" />
      </section>

      <section aria-labelledby="families-heading" className="border-t border-ring/60 pt-10">
        <h2 id="families-heading" className="font-label text-xs font-medium uppercase tracking-[0.16em] text-bark-soft">
          Families covered
        </h2>
        <ul className="mt-6 space-y-10">
          {families.map((f) => {
            const stats = familyStats(f.slug);
            const root = getBranch(f.root_branch_id);
            return (
              <li key={f.slug}>
                <FamilyAccent family={f}>
                  <article className="group grid gap-6 border-l-2 border-accent/70 pl-6 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <p className="font-label text-xs uppercase tracking-[0.14em] text-accent">
                        {f.superfamily ? `Branch of ${f.superfamily}` : "Top-level family"}
                      </p>
                      <h3 className="mt-2 text-4xl font-semibold">
                        <Link href={`/${f.slug}/`} className="no-underline hover:text-accent">
                          {f.name}
                        </Link>
                      </h3>
                      <p className="mt-4 max-w-reading leading-relaxed">{f.summary}</p>
                      <p className="mt-4 font-label text-xs uppercase tracking-[0.12em] text-bark-soft">
                        {stats.branches} branches · {stats.turningPoints} turning points · {stats.contested} contested
                        classifications
                        {root ? ` · rooted in ${root.name}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/${f.slug}/`}
                      className="inline-flex items-center gap-2 self-end whitespace-nowrap rounded-full border border-accent px-5 py-2.5 font-label text-xs font-medium uppercase tracking-[0.14em] text-accent no-underline transition-colors duration-base ease-grow hover:bg-accent hover:text-cream"
                    >
                      Grow the tree <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                </FamilyAccent>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="reading-heading" className="mt-20 grid gap-10 border-t border-ring/60 pt-10 md:grid-cols-3">
        <h2 id="reading-heading" className="sr-only">
          What each branch records
        </h2>
        <div>
          <h3 className="text-xl font-semibold">Turning points</h3>
          <p className="mt-2 leading-relaxed text-bark-soft">
            Dated splits, sound laws, contact, new scripts, extinctions and revivals, drawn as rings along each limb.
            Where the dating or the credit is disputed, the ring is dashed.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Contested classifications</h3>
          <p className="mt-2 leading-relaxed text-bark-soft">
            Groupings that remain in dispute, set out with the evidence each side offers. They are shown as dotted arcs
            outside the tree, because they may never be settled.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Figures, in context</h3>
          <p className="mt-2 leading-relaxed text-bark-soft">
            The people who formulated a sound law or recorded a dying language appear next to the event they are
            connected with. They do not get separate biographies.
          </p>
        </div>
      </section>
    </div>
  );
}
