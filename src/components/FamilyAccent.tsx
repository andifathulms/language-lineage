import type { Family } from "@/lib/types";

// Scopes --accent to one family's earth tone, in both colour schemes.
export function FamilyAccent({ family, children }: { family: Family; children: React.ReactNode }) {
  const cls = `family-${family.slug}`;
  const css =
    `.${cls}{--accent:${family.accent.light}}` +
    `@media (prefers-color-scheme: dark){.${cls}{--accent:${family.accent.dark}}}`;
  return (
    <div className={cls}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </div>
  );
}
