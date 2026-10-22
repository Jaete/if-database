import { SVGProps } from 'react';

/** Mesa: a marca da progressão por nível. */
const TableIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M3.2 7.4h17.6v2.7H3.2Z" />
    <path d="M3.2 8.8h17.6" />
    <path d="M7.2 10.1v6.6M16.8 10.1v6.6" />
  </svg>
);

export default TableIcon;
