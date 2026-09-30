import { SVGProps } from 'react';

const PortraitPlaceholderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...props}
  >
    <circle cx="50" cy="42" r="15" fill="currentColor" fillOpacity="0.08" />
    <path
      d="M18 104 Q20 72 50 68 Q80 72 82 104"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <path d="M44 68 L50 80 L56 68" strokeWidth="1" />
  </svg>
);

export default PortraitPlaceholderIcon;
