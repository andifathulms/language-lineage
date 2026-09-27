import { card } from "@/lib/og";
import { familyStats, getFamilies, getFamily } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getFamilies().map((f) => ({ family: f.slug }));
}

export function GET(_req: Request, { params }: { params: { family: string } }) {
  const family = getFamily(params.family)!;
  const stats = familyStats(family.slug);
  return card({
    kicker: family.superfamily ? `Family · ${family.superfamily}` : "Family tree",
    title: family.name,
    subtitle: family.summary,
    facts: [`${stats.branches} branches`, `${stats.turningPoints} turning points`, `${stats.contested} disputed`],
  });
}
