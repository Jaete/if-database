import { SVGProps } from 'react';

/** Espada com auréola: a marca no centro da roda. */
const HaloSwordIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="32"
    viewBox="0 0 24 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.15"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <ellipse cx="12" cy="3.2" rx="5" ry="1.65" />
    <path d="M12 6.9 14.2 18.8H9.8Z" />
    <path d="M6 19.2h12" />
    <path d="M12 19.2v5" />
    <circle cx="12" cy="26.1" r="1.45" />
  </svg>
);

export default HaloSwordIcon;
