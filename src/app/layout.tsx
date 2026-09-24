import type { Metadata } from "next";
import Link from "next/link";
import { getFamilies } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
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
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <header className="border-b border-ring/60">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
            <Link href="/" className="group flex items-center gap-2.5 no-underline">
              <RingGlyph className="h-7 w-7 text-heartwood transition-transform duration-base ease-grow group-hover:rotate-[20deg]" />
              <span className="font-display text-lg font-semibold tracking-tight text-bark">Language Lineage</span>
            </Link>
            <nav aria-label="Primary" className="font-label text-xs uppercase tracking-[0.14em] text-bark-soft">
              {/* One entry for all families: the list lives on the landing page and scales with it. */}
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                <li>
                  <Link href="/#families" className="no-underline hover:text-accent">
                    Families ({getFamilies().length})
                  </Link>
                </li>
                <li>
                  <Link href="/sound-laws/" className="no-underline hover:text-accent">
                    Sound laws
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="mt-24 border-t border-ring/60">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-sm text-bark-soft sm:px-6">
            <p>
              Prose is AI-drafted with citations attached and is pending specialist review. Where sources disagree on
              dating or grouping, the disagreement is stated, not resolved.
            </p>
            <p className="font-label text-[0.7rem] uppercase tracking-[0.14em]">
              Read-only · corrections by repository edit
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
