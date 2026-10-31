import { SVGProps } from 'react';

/** Chave: o papel de utilidade. */
const RoleUtilityIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx="8" cy="8" r="4" />
    <path d="M11 11l9 9" />
    <path d="M16.5 16.5 19 14" />
    <path d="M14 14l2-2" />
  </svg>
);

export default RoleUtilityIcon;
