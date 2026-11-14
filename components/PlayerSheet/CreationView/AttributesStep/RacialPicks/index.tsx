'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTES } from '@/lib/creation';
import type { IBonusSpec } from '@/lib/raceRules';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import CreationViewHandles from '../../handles';

interface IProps {
  spec: IBonusSpec;
  picks: string[];
  raceName: string;
  disabled: boolean;
  onChange: (picks: string[]) => void;
}

/**
 * Bônus da raça: o fixo é mostrado, e cada "+N à escolha" aponta um atributo.
 * Os bônus à escolha vão em atributos DIFERENTES (o fixo da sub-raça pode
 * somar ao mesmo atributo).
 */
const RacialPicks = ({ spec, picks, raceName, disabled, onChange }: IProps) => {
  const handles = useCssHandles(CreationViewHandles);
  return (
    <div className={handles.crPicks}>
      {spec.free.map((amount, i) => (
        <div key={i} className={handles.crPickRow}>
          <span>
            {raceName}: +{amount} à escolha {spec.free.length > 1 ? i + 1 : ''}
          </span>
          <div role="radiogroup" aria-label={`Bônus à escolha ${i + 1}`}>
            {ATTRIBUTES.map((key) => {
              const takenByOther = picks.some((p, j) => j !== i && p === key);
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  className={handles.crPickBtn}
                  aria-checked={picks[i] === key}
                  disabled={disabled || takenByOther}
                  title={takenByOther ? 'Já recebe o outro bônus' : undefined}
                  onClick={() => {
                    const next = [...picks];
                    next[i] = key;
                    onChange(next.slice(0, spec.free.length));
                    sheetSounds.play('pick');
                  }}
                >
                  {ATTRIBUTE_LABELS[key][0]}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RacialPicks;
