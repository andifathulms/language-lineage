import { card } from "@/lib/og";
import { getPrimers } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return card({
    kicker: "Primers",
    title: "How we know",
    subtitle: "Short explainers on how language families are proved, dated and argued over.",
    facts: [`${getPrimers().length} primers`],
  });
}
