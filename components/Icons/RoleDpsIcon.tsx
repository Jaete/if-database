import { SVGProps } from 'react';

/** Garras: três cortes paralelos, o papel de dano. */
const RoleDpsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M5 15 13 3" />
    <path d="M8.5 18.5 16.5 6.5" />
    <path d="M12 22l8-12" />
  </svg>
);

export default RoleDpsIcon;
