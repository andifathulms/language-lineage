import Link from "next/link";

export interface PagerLink {
  href: string;
  kicker: string;
  label: string;
}

// Previous / next at the foot of a page, so reading doesn't dead-end.
export function Pager({ prev, next, label }: { prev?: PagerLink; next?: PagerLink; label: string }) {
  if (!prev && !next) return null;
  const card = "plate lift group flex flex-col gap-1 p-5 no-underline sm:p-6";
  return (
    <nav aria-label={label} className="mt-20 grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="meta">
            <span aria-hidden="true" className="inline-block transition-transform duration-base ease-grow group-hover:-translate-x-1">
              ←
            </span>{" "}
            {prev.kicker}
          </span>
          <span className="font-display text-xl font-semibold text-bark transition-colors duration-base ease-grow group-hover:text-accent">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link href={next.href} className={`${card} sm:items-end sm:text-right`}>
          <span className="meta">
            {next.kicker}{" "}
            <span aria-hidden="true" className="inline-block transition-transform duration-base ease-grow group-hover:translate-x-1">
              →
            </span>
          </span>
          <span className="font-display text-xl font-semibold text-bark transition-colors duration-base ease-grow group-hover:text-accent">
            {next.label}
          </span>
        </Link>
      )}
    </nav>
  );
}
