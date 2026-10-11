import { SVGProps } from 'react';

// The scroll wheel uses --icon-accent (falling back to currentColor), so a
// stylesheet can highlight it without a second color prop.
const MouseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <rect x="5" y="2" width="14" height="20" rx="7" />
    <rect
      x="10.5"
      y="5.5"
      width="3"
      height="6"
      rx="1.5"
      stroke="none"
      fill="var(--icon-accent, currentColor)"
    />
  </svg>
);

export default MouseIcon;
