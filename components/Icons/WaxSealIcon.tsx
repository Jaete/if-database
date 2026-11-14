import { SVGProps } from 'react';

/** O lacre de cera: contorno irregular, anel cheio e anel pontilhado. */
const WaxSealIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    {/* 16 gomos em volta de (50,50): cada um sai de um recuo (raio ~40) e
        estufa até ~44, com raios levemente diferentes para parecer cera
        derramada. Fechado em si mesmo e todo dentro do viewBox. */}
    <path
      d="M50 9.5Q59.4 2.9 65.9 11.7Q75.9 11.3 78.3 21.7Q89.6 23.6 87.9 34.3Q95.3 41 90.8 50Q97 59.3 86.8 65.2Q88.9 76 79.1 79.1Q76.2 89.2 65.5 87.3Q59.4 97.3 50 91.6Q40.9 95.6 34.6 87.1Q23.5 89.7 21 79Q11 76.1 12.5 65.5Q2.8 59.4 10.1 50Q4.2 40.9 11.8 34.2Q10.6 23.7 21.2 21.2Q23.3 10.1 34.3 12Q40.9 4.5 50 9.5Z"
      strokeWidth="1.4"
      strokeLinejoin="round"
      opacity=".55"
    />
    <circle cx="50" cy="50" r="34" strokeWidth="2" />
    <circle cx="50" cy="50" r="28" strokeWidth=".8" strokeDasharray="2 3" />
  </svg>
);

export default WaxSealIcon;
