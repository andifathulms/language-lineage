// Growth-ring mark used as the wordmark icon: off-centre rings, like a real
// cross-section where one side grew faster.
export function RingGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <ellipse cx="16" cy="16" rx="14" ry="13.2" strokeWidth="1.6" />
      <ellipse cx="15.2" cy="16.6" rx="10" ry="9.2" strokeWidth="1.2" opacity="0.8" />
      <ellipse cx="14.6" cy="17.1" rx="6.2" ry="5.6" strokeWidth="1.1" opacity="0.65" />
      <circle cx="14.2" cy="17.4" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
