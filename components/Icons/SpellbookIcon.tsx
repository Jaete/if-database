import { SVGProps } from 'react';

/** Livro de magia: a marca da classe que conjura. */
const SpellbookIcon = (props: SVGProps<SVGSVGElement>) => (
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
    {/* Capa e lombada */}
    <path d="M5 4a2 2 0 0 1 2-2h12v18H7a2 2 0 0 0-2 2V4Z" />
    <path d="M5 18h14" />
    {/* A faísca sobre o livro é o que o separa de um caderno qualquer */}
    <path d="M11.2 7.2 12 5l.8 2.2L15 8l-2.2.8L12 11l-.8-2.2L9 8l2.2-.8Z" />
  </svg>
);

export default SpellbookIcon;
