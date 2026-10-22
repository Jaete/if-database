import { SVGProps } from 'react';

/** Espada: a marca da classe que não conjura. */
const SwordIcon = (props: SVGProps<SVGSVGElement>) => (
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
    {/* Lâmina da ponta ao punho, na diagonal */}
    <path d="M19 3h2v2L10.5 15.5 8.5 13.5 19 3Z" />
    {/* Guarda e cabo */}
    <path d="M6.5 15.5 3 19l2 2 3.5-3.5" />
    <path d="m5 14 5 5" />
  </svg>
);

export default SwordIcon;
