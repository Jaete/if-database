import { SVGProps } from 'react';

/** Lista: a marca de uma lista própria da classe. */
const ListIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M9 7h10M9 12h10M9 17h10" />
    <circle cx="5.5" cy="7" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="5.5" cy="12" r="0.8" fill="currentColor" stroke="none" />
    <circle cx="5.5" cy="17" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export default ListIcon;
