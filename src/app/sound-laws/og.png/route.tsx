import { card } from "@/lib/og";
import { getSoundLaws } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return card({
    kicker: "Comparative view",
    title: "Sound laws, compared",
    subtitle: "Sound changes from every family covered, lined up by kind and placed on one timeline.",
    facts: [`${getSoundLaws().length} sound laws`],
  });
}
