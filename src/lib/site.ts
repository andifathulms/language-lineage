// Absolute URLs for share cards. Open Graph consumers never resolve relative
// paths, so every image and canonical URL has to carry the origin and, on a
// project page, the base path the workflow injects at build time.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://andifathulms.github.io").replace(/\/$/, "");

export const siteName = "Language Lineage";

/** Prefix a root-relative path with the deploy's base path. */
export function withBase(path: string): string {
  return `${basePath}${path}`;
}

/** Absolute URL for a root-relative path. */
export function absolute(path: string): string {
  return `${siteUrl}${withBase(path)}`;
}

/** The share card generated for a page by its own `og.png` route handler. */
export function ogImage(path: string, alt: string) {
  return { url: absolute(`${path}og.png`), width: 1200, height: 630, alt, type: "image/png" as const };
}

/**
 * Title, description, canonical and share-card text for one page. Open Graph
 * fields do not inherit a page's own `title`/`description` — and a child's
 * `twitter` object replaces the layout's outright — so both are spelled out
 * here rather than left to the defaults.
 */
export function pageMetadata({
  title,
  description,
  path,
  cardAlt,
}: {
  title: string;
  description: string;
  path: string;
  cardAlt?: string;
}) {
  const full = `${title} \u00b7 ${siteName}`;
  const image = ogImage(path, cardAlt ?? full);
  return {
    title,
    description,
    alternates: { canonical: withBase(path) },
    openGraph: { type: "article" as const, siteName, title: full, description, url: absolute(path), images: [image] },
    twitter: { card: "summary_large_image" as const, title: full, description, images: [image] },
  };
}
