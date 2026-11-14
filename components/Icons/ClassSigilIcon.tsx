import { SVGProps } from 'react';

/**
 * O sigilo da classe: anel de runas, foice crescente e ampulheta (o do
 * Necromante). As classes ainda não têm sigilo próprio, então este vale para
 * todas até cada uma ganhar o seu.
 */
const ClassSigilIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <g data-sigil="spin">
      <circle
        cx="60"
        cy="60"
        r="55"
        strokeWidth=".8"
        strokeDasharray="1 5"
        opacity=".7"
      />
    </g>
    <circle data-sigil="draw" cx="60" cy="60" r="48" strokeWidth="1.4" />
    <circle
      data-sigil="draw"
      cx="60"
      cy="60"
      r="41"
      strokeWidth=".8"
      opacity=".6"
    />
    <path
      data-sigil="draw"
      d="M60 12v8M60 100v8M12 60h8M100 60h8M26 26l6 6M88 88l6 6M94 26l-6 6M32 88l-6 6"
      strokeWidth="1.2"
      opacity=".8"
    />
    <path
      data-sigil="draw"
      d="M44 36c10-8 26-6 34 4-9-4-20-3-28 4"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      data-sigil="draw"
      d="M50 46h20M50 84h20M52 46c0 10 8 12 8 16s-8 6-8 22M68 46c0 10-8 12-8 16s8 6 8 22"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M55 81h10l-5-6z" fill="currentColor" stroke="none" opacity=".75" />
  </svg>
);

export default ClassSigilIcon;
