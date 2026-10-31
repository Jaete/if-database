import { SVGProps } from 'react';

/**
 * Astrolábio: anéis, pontas cardinais e losango.
 *
 * É o ornamento de fundo do card de classe sem imagem. O desenho do papel vai
 * por cima, centralizado, como outro ícone — por isso o miolo fica livre.
 */
interface IProps extends SVGProps<SVGSVGElement> {
  /** Classe do grupo do anel externo (círculos e pontas), para animá-lo à parte do miolo. */
  ringClassName?: string;
}

const AstrolabeIcon = ({ ringClassName, ...props }: IProps) => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <g className={ringClassName}>
      <circle cx="100" cy="100" r="92" strokeWidth="0.8" />
      <circle
        cx="100"
        cy="100"
        r="78"
        strokeWidth="0.6"
        strokeDasharray="2 5"
      />
      {[0, 45, 90, 135].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 100 100)`} strokeWidth="0.8">
          <line x1="100" y1="6" x2="100" y2="30" />
          <line x1="100" y1="170" x2="100" y2="194" />
        </g>
      ))}
    </g>
    <circle cx="100" cy="100" r="46" strokeWidth="1" />
    <path d="M100 54 L146 100 L100 146 L54 100Z" strokeWidth="0.6" />
  </svg>
);

export default AstrolabeIcon;
