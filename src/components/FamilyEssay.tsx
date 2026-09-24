import type { Chapter, Source } from "@/lib/types";
import { Prose } from "./Markdown";
import { OnThisPage } from "./OnThisPage";
import { SourceList } from "./SourceList";

export const chapterSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** A numbered long read with a section list that follows the reader on wide screens. */
export function FamilyEssay({ chapters, sources, idPrefix = "" }: { chapters: Chapter[]; sources: Source[]; idPrefix?: string }) {
  const toc = chapters.map((c) => ({ href: `#${idPrefix}${chapterSlug(c.title)}`, label: c.title }));
  return (
    <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="min-w-0">
        {chapters.map((c, i) => (
          <section key={c.title} id={`${idPrefix}${chapterSlug(c.title)}`} className="scroll-mt-24 pb-6">
            <p className="flex items-center gap-3 font-label text-[0.7rem] font-medium tracking-[0.14em] text-accent">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="h-px w-10 bg-accent/30" />
            </p>
            <h3 className="mt-3 text-[1.6rem] font-semibold leading-tight sm:text-[1.85rem]">{c.title}</h3>
            <div className={i === 0 ? "prose-lede" : undefined}>
              <Prose>{c.body}</Prose>
            </div>
          </section>
        ))}
        <SourceList sources={sources} />
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <OnThisPage items={toc} />
        </div>
      </aside>
    </div>
  );
}
