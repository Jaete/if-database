'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import type { AttributeMethod } from '@/lib/creation';
import { POINT_BUY_BUDGET } from '@/lib/creation';
import { LockIcon } from '../../../../Icons';
import CreationViewHandles from '../../handles';

interface IProps {
  method?: AttributeMethod;
  /** Já rolou: os outros métodos ficam travados. */
  rolled: boolean;
  disabled: boolean;
  onPick: (method: AttributeMethod) => void;
}

const METHODS: { id: AttributeMethod; title: string; text: string }[] = [
  {
    id: 'pointBuy',
    title: 'Compra de pontos',
    text: `${POINT_BUY_BUDGET} pontos, cada atributo de 8 a 15.`,
  },
  {
    id: 'standardArray',
    title: 'Arranjo padrão',
    text: '15, 14, 13, 12, 10 e 8, cada um uma vez.',
  },
  {
    id: 'roll',
    title: 'Rolagem 4d6',
    text: 'Seis vezes 4d6, sem o menor. Definitiva e gravada.',
  },
];

/** O método primeiro; rolar trava os outros dois. */
const Methods = ({ method, rolled, disabled, onPick }: IProps) => {
  const handles = useCssHandles(CreationViewHandles);
  return (
    <div className={handles.crMethods} role="radiogroup" aria-label="Método">
      {METHODS.map((m) => {
        const locked = rolled && m.id !== 'roll';
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            className={handles.crMethod}
            aria-checked={method === m.id}
            disabled={disabled || locked || (rolled && method === 'roll')}
            onClick={() => onPick(m.id)}
          >
            <b>
              {m.title}
              {locked && <LockIcon width={11} height={11} aria-hidden />}
            </b>
            <span>
              {m.id === 'roll' && rolled
                ? 'Rolado: o resultado é final.'
                : locked
                  ? 'Bloqueado pela rolagem.'
                  : m.text}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Methods;
