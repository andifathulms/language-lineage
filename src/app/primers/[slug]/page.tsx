import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FamilyEssay } from "@/components/FamilyEssay";
import { Pager } from "@/components/Pager";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getPrimer, getPrimers } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPrimers().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const primer = getPrimer(params.slug);
  return primer ? { title: primer.title, description: primer.summary } : {};
}

export default function PrimerPage({ params }: { params: { slug: string } }) {
  const primer = getPrimer(params.slug);
  if (!primer) notFound();
  const all = getPrimers();
  const at = all.findIndex((p) => p.slug === primer.slug);
  const prev = all[at - 1];
  const next = all[at + 1];
  return (
    <>
      <ReadingProgress />
      <div className="bg-gradient-to-b from-accent/[0.07] to-transparent">
        <header className="mx-auto max-w-page px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
          <nav aria-label="Breadcrumb" className="meta">
            <Link href="/primers/" className="text-accent no-underline hover:text-bark">
              Primers
            </Link>
            <span aria-hidden="true" className="mx-2 text-ring">
              /
            </span>
            <span>{String(primer.order).padStart(2, "0")}</span>
          </nav>
          <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.4rem)] font-semibold leading-[1.03]">{primer.title}</h1>
          <p className="mt-5 max-w-3xl font-serif text-[1.3rem] italic leading-[1.55] text-bark-soft sm:text-[1.4rem]">
            {primer.summary}
          </p>
        </header>
      </div>
      <article className="mx-auto max-w-page border-t border-ring/60 px-4 pt-12 sm:px-6">
        <FamilyEssay chapters={primer.chapters} sources={primer.sources} />
        <Pager
          label="More primers"
          prev={prev && { href: `/primers/${prev.slug}/`, kicker: "Previous primer", label: prev.title }}
          next={
            next
              ? { href: `/primers/${next.slug}/`, kicker: "Next primer", label: next.title }
              : { href: "/#families", kicker: "Now see it at work", label: "The family trees" }
          }
        />
      </article>
    </>
  );
}
