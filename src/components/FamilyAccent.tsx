import type { Family } from "@/lib/types";

export const accentClass = (family: Pick<Family, "slug">) => `family-${family.slug}`;

function accentCss(family: Family) {
  const cls = accentClass(family);
  return (
    `.${cls}{--accent:${family.accent.light}}` +
    `@media (prefers-color-scheme: dark){.${cls}{--accent:${family.accent.dark}}}`
  );
}

// Scopes --accent to one family's earth tone, in both colour schemes.
export function FamilyAccent({
  family,
  className,
  children,
}: {
  family: Family;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `${accentClass(family)} ${className}` : accentClass(family)}>
      <style dangerouslySetInnerHTML={{ __html: accentCss(family) }} />
      {children}
    </div>
  );
}

/** Accent rules for several families at once, for pages that mix them; pair with accentClass(). */
export function FamilyAccentStyles({ families }: { families: Family[] }) {
  return <style dangerouslySetInnerHTML={{ __html: families.map(accentCss).join("") }} />;
}
