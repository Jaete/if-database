import { SVGProps } from 'react';

/** Seta para cima sobre uma base: "subir de nível". */
const LevelUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 19V6M6 11l6-6 6 6" />
    <path d="M5 21h14" opacity=".55" />
  </svg>
);

export default LevelUpIcon;
