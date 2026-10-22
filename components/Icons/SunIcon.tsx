import { SVGProps } from 'react';

/** Sol: a marca das Artes Divinas. */
const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.15"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="3.3" />
    <path d="M12 1.5V8M12 16v6.5M1.5 12H8M16 12h6.5" />
    <path d="m5.2 5.2 3.9 3.9M14.9 14.9l3.9 3.9M18.8 5.2l-3.9 3.9M9.1 14.9 5.2 18.8" />
  </svg>
);

export default SunIcon;
