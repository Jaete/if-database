import { SVGProps } from 'react';

/** Escudo heráldico: a marca dos arquétipos. */
const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 2.6 19.4 6.1v5.6c0 4.3-3.1 6.7-7.4 8.7-4.3-2-7.4-4.4-7.4-8.7V6.1Z" />
    <path d="M12 5.8 16.6 8.1v3.4c0 2.7-1.9 4.3-4.6 5.6-2.7-1.3-4.6-2.9-4.6-5.6V8.1Z" />
    <path d="M12 5.8v11.3M9.1 10.4h5.8" />
  </svg>
);

export default ShieldIcon;
