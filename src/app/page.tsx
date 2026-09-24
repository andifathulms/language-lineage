import Link from "next/link";
import { FamilyAccent } from "@/components/FamilyAccent";
import { HeroRings } from "@/components/HeroRings";
import { RingGlyph } from "@/components/RingGlyph";
import { familyStats, getBranches, getFamilies, getSoundLaws } from "@/lib/content";

export default function Home() {
  const families = getFamilies();
  const branches = getBranches();
  const counts = [
    { n: families.length, label: "families" },
    { n: branches.length, label: "branches" },
    { n: branches.reduce((n, b) => n + b.turning_points.length, 0), label: "turning points" },
    { n: getSoundLaws().length, label: "sound laws" },
  ];

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6">
      <section className="grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div>
          <p className="specimen mb-7">A narrative encyclopedia of language families</p>
          <h1 className="text-[clamp(2.6rem,6.4vw,4.75rem)] font-semibold leading-[1.02]">
            How one language <em className="pr-[0.06em] font-medium italic text-heartwood">grew</em> into many.
          </h1>
          <p className="mt-7 max-w-reading text-[1.15rem] leading-[1.7] text-bark-soft">
            Each branch of a language family split from its parent for a reason: a sound law that changed every word, a
            migration across the sea, years of contact with neighbours. This is a record of those splits, when they
            happened and what caused them, and of the groupings that historical linguists still argue about.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#families"
              className="inline-flex items-center gap-2 rounded-full bg-bark px-6 py-3 font-label text-xs font-medium uppercase tracking-[0.14em] text-cream no-underline transition-colors duration-base ease-grow hover:bg-heartwood"
            >
              Browse the families <span aria-hidden="true">↓</span>
            </a>
            <Link
              href="/sound-laws/"
              className="inline-flex items-center gap-2 rounded-full border border-ring px-6 py-3 font-label text-xs font-medium uppercase tracking-[0.14em] text-bark no-underline transition-colors duration-base ease-grow hover:border-bark"
            >
              Compare sound laws
            </Link>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-ring/70 pt-6 sm:grid-cols-4">
            {counts.map((c) => (
              <div key={c.label}>
                <dt className="meta">{c.label}</dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums text-bark [font-feature-settings:'lnum']">
                  {c.n}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroRings className="mx-auto hidden w-full max-w-[26rem] lg:block" />
      </section>

      <section id="families" aria-labelledby="families-heading" className="scroll-mt-20 border-t border-ring/60 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="meta">The index</p>
            <h2 id="families-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
              Families covered
            </h2>
          </div>
          <p className="max-w-md text-bark-soft">
            Each family opens on its tree. Every limb is a branch with its own page.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {families.map((f) => {
            const stats = familyStats(f.slug);
            return (
              <li key={f.slug} className="flex">
                <FamilyAccent family={f} className="flex w-full">
                  <Link
                    href={`/${f.slug}/`}
                    className="plate lift group relative flex w-full flex-col overflow-hidden p-6 no-underline"
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-label text-[0.68rem] font-medium uppercase tracking-[0.14em] text-accent">
                        {f.superfamily ? `Branch of ${f.superfamily}` : "Top-level family"}
                      </p>
                      <RingGlyph className="h-6 w-6 shrink-0 text-accent/70 transition-transform duration-base ease-grow group-hover:rotate-[25deg]" />
                    </div>
                    <h3 className="mt-3 text-[1.75rem] font-semibold leading-tight transition-colors duration-base ease-grow group-hover:text-accent">
                      {f.name}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-[0.95rem] leading-relaxed text-bark-soft">{f.summary}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                      <p className="flex flex-wrap gap-x-4 gap-y-1 font-label text-[0.68rem] uppercase tracking-[0.1em] text-bark-soft">
                        <span>
                          <b className="font-medium text-bark">{stats.branches}</b> branches
                        </span>
                        <span>
                          <b className="font-medium text-bark">{stats.turningPoints}</b> events
                        </span>
                        {stats.contested > 0 && (
                          <span>
                            <b className="font-medium text-bark">{stats.contested}</b> disputed
                          </span>
                        )}
                      </p>
                      <span
                        aria-hidden="true"
                        className="text-accent transition-transform duration-base ease-grow group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </FamilyAccent>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-20 grid gap-5 md:grid-cols-2">
        {[
          {
            href: "/primers/",
            kicker: "Before the trees",
            title: "How we know",
            body: "Four short primers: how relationships are proved, what a sound law is, where the dates come from, and why some groupings stay disputed.",
            cta: "Read the primers",
          },
          {
            href: "/sound-laws/",
            kicker: "Across families",
            title: "Compare sound laws side by side",
            body: "Grimm\u2019s law beside the Hawaiian shift, lost final consonants in Germanic and in the Pacific, on one timeline. Unrelated languages keep making the same kinds of change.",
            cta: "Open the timeline",
          },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="plate lift group flex flex-col p-8 no-underline sm:p-10">
            <p className="meta">{card.kicker}</p>
            <p className="mt-3 font-display text-2xl font-semibold leading-snug text-bark sm:text-3xl">{card.title}</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-bark-soft">{card.body}</p>
            <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-bark px-6 py-3 font-label text-xs font-medium uppercase tracking-[0.14em] text-cream transition-colors duration-base ease-grow group-hover:bg-heartwood">
              {card.cta} <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="reading-heading" className="mt-20 border-t border-ring/60 pt-12">
        <p className="meta">What each branch records</p>
        <h2 id="reading-heading" className="sr-only">
          What each branch records
        </h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Turning points",
              body: "Dated splits, sound laws, contact, new scripts, extinctions and revivals, drawn as rings along each limb. Where the dating or the credit is disputed, the ring is dashed.",
            },
            {
              title: "Contested classifications",
              body: "Groupings that remain in dispute, set out with the evidence each side offers. They are shown as dotted arcs outside the tree, because they may never be settled.",
            },
            {
              title: "Speakers and places",
              body: "How many people speak each branch today, how secure its languages are on UNESCO's scale, where on the map they are spoken, and a short phrase in the language itself.",
            },
            {
              title: "Figures, in context",
              body: "The people who formulated a sound law or recorded a dying language appear next to the event they are connected with. They do not get separate biographies.",
            },
          ].map((item, i) => (
            <div key={item.title}>
              <span className="font-label text-xs text-heartwood">0{i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-bark-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
