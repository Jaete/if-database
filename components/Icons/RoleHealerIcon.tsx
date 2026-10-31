import { SVGProps } from 'react';

/** Gota com cruz: o papel de cura. */
const RoleHealerIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3Z" />
    <path d="M12 11v6M9 14h6" />
  </svg>
);

export default RoleHealerIcon;
