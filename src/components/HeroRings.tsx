// Large cross-section for the landing hero: off-centre growth rings, with a few
// accent rings standing in for sound laws. Rings grow outward on load.
const RINGS = Array.from({ length: 15 }, (_, i) => {
  const r = 14 + i * 12.5 + (i % 3) * 2.2;
  return {
    r,
    // The pith sits low-left: rings are wider on the side that grew faster.
    cx: 200 - i * 0.9,
    cy: 200 + i * 0.7,
    ry: r * (0.94 + ((i * 7) % 5) * 0.008),
    law: i === 5 || i === 9 || i === 13,
    dashed: i === 11,
  };
});

export function HeroRings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" fill="none">
      <defs>
        <clipPath id="hero-disc">
          <circle cx="200" cy="200" r="195" />
        </clipPath>
      </defs>
      <circle cx="200" cy="200" r="196" className="fill-paper" />
      <g clipPath="url(#hero-disc)">
        {RINGS.map((ring, i) => (
          <ellipse
            key={i}
            cx={ring.cx}
            cy={ring.cy}
            rx={ring.r}
            ry={ring.ry}
            className={`hero-ring ${ring.law ? "stroke-accent" : "stroke-heartwood"}`}
            strokeOpacity={ring.law ? 0.9 : 0.22 + (i % 4 === 0 ? 0.18 : 0)}
            strokeWidth={ring.law ? 2 : i % 4 === 0 ? 1.4 : 0.9}
            strokeDasharray={ring.dashed ? "3 5" : undefined}
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </g>
      {/* A radial check: the one crack every real cross-section has. */}
      <path d="M198 204 L128 296 L118 314" className="stroke-heartwood" strokeOpacity={0.35} strokeWidth={1.2} strokeLinecap="round" />
      <circle cx="200" cy="200" r="4.5" className="fill-heartwood" />
      <circle cx="200" cy="200" r="196" className="stroke-ring" strokeWidth={1.2} />
    </svg>
  );
}
