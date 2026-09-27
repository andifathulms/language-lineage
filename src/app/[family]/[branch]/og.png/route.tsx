import { card } from "@/lib/og";
import { getBranch, getBranches, getFamily } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getBranches().map((b) => ({ family: b.family, branch: b.id }));
}

export function GET(_req: Request, { params }: { params: { branch: string } }) {
  const branch = getBranch(params.branch)!;
  const family = getFamily(branch.family);
  return card({
    kicker: family ? `${family.name}${branch.extinct ? " · extinct" : ""}` : "Branch",
    title: branch.name,
    subtitle: branch.defining_innovation,
    facts: [branch.era, branch.region],
  });
}
