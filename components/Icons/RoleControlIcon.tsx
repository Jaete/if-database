import { SVGProps } from 'react';

/** Vórtice: o papel de controle de campo. */
const RoleControlIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 12a1.5 1.5 0 1 1 1.5 1.5" />
    <path d="M13.5 13.5A4 4 0 1 1 16 10" />
    <path d="M16 10a7 7 0 1 1-2.3-5.3" />
    <path d="M19 4l-1.5 3.5L21 9" />
  </svg>
);

export default RoleControlIcon;
