/**
 * The organic blue shapes that carry the brand's wave motif.
 * All shapes render in `text-*` color via `currentColor`.
 */

/** Desktop hero blob: fills the left side, S-curves into the right side. */
export function HeroBlob({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 0 H870 C915 125 970 265 995 420 C1000 540 955 690 915 805 C888 878 862 940 855 1000 H0 Z"
      />
    </svg>
  );
}

/** Horizontal wave divider, used at the bottom of the mobile hero panel. */
export function WaveDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 0 H1440 V30 C1200 90 960 10 720 40 C480 70 240 90 0 40 Z"
      />
    </svg>
  );
}

/** Small squiggle accent used under page headings. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 12"
      fill="none"
      className={className}
    >
      <path
        d="M2 8 C 14 2, 26 2, 38 8 S 62 14, 74 8 S 98 2, 118 8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
