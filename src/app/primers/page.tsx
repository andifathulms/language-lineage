import type { Metadata } from "next";
import Link from "next/link";
import { getPrimers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Primers",
  description: "Short explainers on how language families are proved, dated and argued over.",
};

export default function PrimersPage() {
  const primers = getPrimers();
  return (
    <div className="mx-auto max-w-page px-4 pt-12 sm:px-6 sm:pt-16">
      <p className="meta">Before the trees</p>
      <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.04]">How we know</h1>
      <p className="mt-5 max-w-reading text-[1.1rem] leading-[1.7] text-bark-soft">
        Four short explainers on the methods behind every tree on this site: how relationships are proved, what a sound
        law is, where the dates come from, and why some groupings are still argued over.
      </p>
      <ol className="mt-12 grid gap-5 sm:grid-cols-2">
        {primers.map((p) => (
          <li key={p.slug}>
            <Link href={`/primers/${p.slug}/`} className="plate lift group flex h-full flex-col p-6 no-underline sm:p-7">
              <span className="font-label text-[0.7rem] font-medium tracking-[0.14em] text-accent">
                {String(p.order).padStart(2, "0")}
              </span>
              <span className="mt-3 font-display text-2xl font-semibold leading-tight">{p.title}</span>
              <span className="mt-3 leading-relaxed text-bark-soft">{p.summary}</span>
              <span className="meta mt-5">
                Read{" "}
                <span aria-hidden="true" className="inline-block transition-transform duration-base ease-grow group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
