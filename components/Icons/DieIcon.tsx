import { SVGProps } from 'react';

/** Dado isométrico: a marca dos dados da classe. */
const DieIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 3.6 20.4 8.2 12 12.8 3.6 8.2Z" />
    <path d="M3.6 8.2 12 12.8v8.6l-8.4-4.6Z" />
    <path d="M20.4 8.2 12 12.8v8.6l8.4-4.6Z" />
    <circle cx="9.5" cy="6.7" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="7.6" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="9.1" cy="9.3" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="14.1" cy="10.2" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="12" cy="8.4" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="6.3" cy="11.4" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="9.3" cy="12.8" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="7.8" cy="14.4" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="6.5" cy="15.8" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="17.1" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="15.2" cy="12.4" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="17.2" cy="14.6" r="0.55" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="16.6" r="0.55" fill="currentColor" stroke="none" />
  </svg>
);

export default DieIcon;
