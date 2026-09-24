import type { Metadata } from "next";
import Link from "next/link";
import { getFamilies } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { PrimaryNav } from "@/components/PrimaryNav";
import { RingGlyph } from "@/components/RingGlyph";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Language Lineage",
    template: "%s · Language Lineage",
  },
  description:
    "A narrative encyclopedia of language families: how branches split, the sound laws and contact that drove each split, and the classifications still in dispute.",
};

// Marks the document as JS-enabled before first paint so the tree can start
// "ungrown" without a flash; without JS the fully grown tree is shown.
const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const families = getFamilies();
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-40 border-b border-ring/60 bg-cream/85 backdrop-blur-md supports-[backdrop-filter]:bg-cream/70">
          <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-4 sm:px-6">
            <Link href="/" className="group flex shrink-0 items-center gap-2 no-underline sm:gap-2.5">
              <RingGlyph className="h-6 w-6 sm:h-7 sm:w-7 text-heartwood transition-transform duration-base ease-grow group-hover:rotate-[20deg]" />
              <span className="whitespace-nowrap font-display text-[1.05rem] font-semibold tracking-tight text-bark sm:text-[1.15rem]">Language Lineage</span>
            </Link>
            <PrimaryNav familyCount={families.length} />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="mt-28 border-t border-ring/60 bg-soil/40">
          <div className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5 no-underline">
                <RingGlyph className="h-6 w-6 text-heartwood" />
                <span className="font-display text-lg font-semibold text-bark">Language Lineage</span>
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-bark-soft">
                Prose is AI-drafted with citations attached and is pending specialist review. Where sources disagree on
                dating or grouping, the disagreement is stated, not resolved.
              </p>
              <p className="meta">Read-only · corrections by repository edit</p>
            </div>
            <nav aria-label="All families">
              <p className="meta">Families</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                {families.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/${f.slug}/`} className="text-bark-soft no-underline hover:text-bark">
                      {f.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/sound-laws/" className="text-bark-soft no-underline hover:text-bark">
                    Sound laws, compared
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
