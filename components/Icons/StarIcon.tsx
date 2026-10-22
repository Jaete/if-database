import { SVGProps } from 'react';

/** Estrela: a marca dos talentos. */
const StarIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="m12 2.4 2.7 5.7 6.2.8-4.6 4.2 1.2 6.1L12 16.2 6.5 19.2l1.2-6.1L3.1 8.9l6.2-.8L12 2.4Z" />
  </svg>
);

export default StarIcon;
