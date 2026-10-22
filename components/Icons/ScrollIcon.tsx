import { SVGProps } from 'react';

/** Pergaminho enrolado: a marca das características. */
const ScrollIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M5.2 5.2h13.6" />
    <circle cx="4.3" cy="5.2" r="1.25" />
    <circle cx="19.7" cy="5.2" r="1.25" />
    <path d="M6.6 5.8v10.2c0 1.7 2.3 2.8 5.4 2.8s5.4-1.1 5.4-2.8V5.8" />
    <path d="M8.6 9.2h6.8M8.6 11.8h6.8M8.6 14.4h4.4" />
  </svg>
);

export default ScrollIcon;
