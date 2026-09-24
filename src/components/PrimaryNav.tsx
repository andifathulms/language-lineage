"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Marks the section the reader is in. Family and branch pages count as "Families".
export function PrimaryNav({ familyCount }: { familyCount: number }) {
  const path = usePathname() ?? "/";
  const inSoundLaws = path.startsWith("/sound-laws");
  const inFamilies = !inSoundLaws && path !== "/";
  const item = (active: boolean) =>
    `relative py-1 no-underline transition-colors duration-base ease-grow hover:text-bark ${
      active
        ? "text-bark after:absolute after:inset-x-0 after:-bottom-[3px] after:h-[2px] after:rounded-full after:bg-accent"
        : ""
    }`;
  return (
    <nav aria-label="Primary" className="font-label text-[0.68rem] font-medium uppercase tracking-[0.08em] text-bark-soft sm:text-[0.7rem] sm:tracking-[0.14em]">
      {/* One entry for all families: the list lives on the landing page and scales with it. */}
      <ul className="flex gap-x-3.5 whitespace-nowrap sm:gap-x-6">
        <li>
          <Link href="/#families" className={item(inFamilies)} aria-current={inFamilies ? "page" : undefined}>
            Families <span className="hidden text-bark-soft/70 sm:inline">{familyCount}</span>
          </Link>
        </li>
        <li>
          <Link href="/sound-laws/" className={item(inSoundLaws)} aria-current={inSoundLaws ? "page" : undefined}>
            Sound laws
          </Link>
        </li>
      </ul>
    </nav>
  );
}
