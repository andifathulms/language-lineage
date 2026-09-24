"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  href: string;
  label: string;
}

// Section list that follows the reader: the section whose heading most recently
// passed under the header is marked current.
export function OnThisPage({ items }: { items: TocItem[] }) {
  const [current, setCurrent] = useState(items[0]?.href);

  useEffect(() => {
    const sections = items
      .map((t) => document.getElementById(t.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 120;
      let active = sections[0];
      for (const s of sections) if (s.getBoundingClientRect().top <= line) active = s;
      // At the very bottom, the last section wins even if its heading never reached the line.
      const el = document.documentElement;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) active = sections[sections.length - 1];
      setCurrent(`#${active.id}`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="meta">On this page</p>
      <ul className="mt-3 space-y-0.5 border-l border-ring text-sm">
        {items.map((t) => {
          const on = t.href === current;
          return (
            <li key={t.href}>
              <a
                href={t.href}
                aria-current={on ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1 pl-4 no-underline transition-colors duration-base ease-grow ${
                  on ? "border-accent font-medium text-bark" : "border-transparent text-bark-soft hover:text-bark"
                }`}
              >
                {t.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
