import type { Sample } from "@/lib/types";
import { SourceList } from "./SourceList";

/** One attested phrase, with a word-by-word gloss aligned under the words it explains. */
export function SampleCard({ sample }: { sample: Sample }) {
  const aligned = (sample.transliteration ?? sample.text).trim().split(/\s+/);
  const glosses = sample.gloss?.trim().split(/\s+/);
  const interlinear = glosses && glosses.length === aligned.length;
  return (
    <figure className="plate relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-accent/70" />
      <p className="meta">{sample.language}</p>
      <blockquote dir="auto" className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2.1rem)] font-semibold leading-snug">
        {sample.text}
      </blockquote>
      {sample.ipa && <p className="mt-2 font-ipa text-[1.05rem] text-bark-soft">[{sample.ipa.replace(/^\[|\]$/g, "")}]</p>}
      {interlinear ? (
        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          {aligned.map((w, i) => (
            <div key={i} className="flex flex-col">
              <dt className="font-ipa text-[1.05rem] italic">{w}</dt>
              <dd className="mt-0.5 font-label text-[0.68rem] tracking-[0.06em] text-bark-soft">{glosses![i]}</dd>
            </div>
          ))}
        </dl>
      ) : (
        sample.transliteration && <p className="mt-2 font-ipa text-[1.05rem] italic">{sample.transliteration}</p>
      )}
      <figcaption className="mt-5 border-t border-ring/60 pt-4 font-serif text-[1.1rem] italic text-bark-soft">
        ‘{sample.translation.replace(/^['‘“"]|['’”"]$/g, "")}’
      </figcaption>
      <SourceList sources={sample.sources} />
    </figure>
  );
}
