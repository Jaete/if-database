'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import {
  ATTRIBUTES,
  POINT_BUY_BUDGET,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  pointCost,
  pointsSpent,
  type Base,
} from '@/lib/creation';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import LevelUpViewHandles from '../../../LevelUpView/handles';
import CreationViewHandles from '../../handles';

interface IProps {
  base: Base;
  disabled: boolean;
  onChange: (base: Base) => void;
}

/** Compra de pontos: 27 pontos, 8 a 15. Só conclui com os 27 gastos. */
const PointBuy = ({ base, disabled, onChange }: IProps) => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const spent = pointsSpent(base) ?? 0;
  const left = POINT_BUY_BUDGET - spent;

  const step = (key: (typeof ATTRIBUTES)[number], by: 1 | -1) => {
    const now = base[key] ?? POINT_BUY_MIN;
    const next = now + by;
    const cost = pointCost(next);
    if (cost === null) return;
    if (by > 0 && (pointCost(next) ?? 0) - (pointCost(now) ?? 0) > left) return;
    onChange({ ...base, [key]: next });
  };

  return (
    <div className={handles.crBuy}>
      <div className={lu.luPool} role="status">
        <span className={handles.crBudget} data-done={left === 0 || undefined}>
          {spent} de {POINT_BUY_BUDGET} pontos
        </span>
        <span>{left === 0 ? 'Tudo gasto.' : `Faltam ${left}.`}</span>
      </div>
      {ATTRIBUTES.map((key) => {
        const value = base[key] ?? POINT_BUY_MIN;
        const canUp =
          value < POINT_BUY_MAX &&
          (pointCost(value + 1) ?? 0) - (pointCost(value) ?? 0) <= left;
        return (
          <div key={key} className={handles.crBuyRow}>
            <span>
              <b>{ATTRIBUTE_LABELS[key][0]}</b>{' '}
              <small>{ATTRIBUTE_LABELS[key][1]}</small>
            </span>
            <button
              type="button"
              aria-label={`Diminuir ${ATTRIBUTE_LABELS[key][1]}`}
              disabled={disabled || value <= POINT_BUY_MIN}
              onClick={() => step(key, -1)}
            >
              −
            </button>
            <output>{value}</output>
            <button
              type="button"
              aria-label={`Aumentar ${ATTRIBUTE_LABELS[key][1]}`}
              disabled={disabled || !canUp}
              onClick={() => step(key, 1)}
            >
              +
            </button>
            <small>custa {pointCost(value)}</small>
          </div>
        );
      })}
    </div>
  );
};

export default PointBuy;
