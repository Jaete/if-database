import { SVGProps } from 'react';

/** Estandarte: o papel de apoio ao grupo. */
const RoleSupportIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M6 21V3" />
    <path d="M6 4h12l-3 4.5L18 13H6" />
  </svg>
);

export default RoleSupportIcon;
