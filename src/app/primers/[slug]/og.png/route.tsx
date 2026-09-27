import { card } from "@/lib/og";
import { getPrimer, getPrimers } from "@/lib/content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPrimers().map((p) => ({ slug: p.slug }));
}

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const primer = getPrimer(params.slug)!;
  return card({ kicker: "Primer · how we know", title: primer.title, subtitle: primer.summary });
}
