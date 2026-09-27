import { card } from "@/lib/og";
import { getBranches, getFamilies } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return card({
    kicker: "Narrative encyclopedia",
    title: "How languages grew apart",
    subtitle:
      "The splits, the dated sound laws that drove them, and the classifications historical linguists still dispute.",
    facts: [`${getFamilies().length} families`, `${getBranches().length} branches`],
  });
}
