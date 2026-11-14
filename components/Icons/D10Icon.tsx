import { SVGProps } from 'react';

/** Dado de dez faces visto de frente. */
const D10Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M32 4 58 26 32 60 6 26Z" />
    <path d="M6 26 32 36 58 26M32 36v24" opacity=".55" />
  </svg>
);

export default D10Icon;
