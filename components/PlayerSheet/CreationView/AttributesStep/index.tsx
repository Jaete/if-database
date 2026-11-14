'use client';

import { useRef, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import {
  ATTRIBUTES,
  POINT_BUY_MIN,
  STANDARD_ARRAY,
  suggestOrder,
  type AttributeMethod,
  type Base,
} from '@/lib/creation';
import { resolveBonus } from '@/lib/raceRules';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { AttributeRollAsk, AttributeRollStage } from '../RollDialog';
import { useStep } from '../useStep';
import AssignBoard from './AssignBoard';
import Methods from './Methods';
import PointBuy from './PointBuy';
import RacialPicks from './RacialPicks';
import Summary from './Summary';
import LevelUpPill from '../../LevelUpPill';
import type { AttributeRoll } from '../../CreationContext';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Atributos em três blocos: o método, a distribuição, e os bônus da raça. O
 * resumo ao vivo fica sempre à direita. Rolar trava os outros métodos.
 */
const AttributesStep = () => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { creation, data, d } = useStep();
  const method = data.creation.method;
  const roll = data.rolls.find((r) => r.kind === 'attributes');
  const rolled = !!data.creation.rollId || !!roll;
  const [ask, setAsk] = useState(false);
  const [stage, setStage] = useState<null | {
    phase: 'tumble' | 'settled';
    roll?: AttributeRoll;
  }>(null);
  const timer = useRef(0);
  const disabled = !creation.canEdit;

  const setBase = (base: Base) => creation.patch({ creation: { base } });

  const pick = (next: AttributeMethod) => {
    if (next === method) return;
    if (next === 'roll') {
      if (rolled) {
        creation.patch({ creation: { method: 'roll' } });
        return;
      }
      setAsk(true);
      sheetSounds.play('paperSlide');
      return;
    }
    sheetSounds.play('pick');
    creation.patch({
      creation: {
        method: next,
        ...(next === 'pointBuy'
          ? {
              base: Object.fromEntries(
                ATTRIBUTES.map((k) => [k, POINT_BUY_MIN])
              ) as Base,
            }
          : {}),
      },
    });
  };

  const doRoll = async () => {
    setAsk(false);
    setStage({ phase: 'tumble' });
    const wait = reducedMotion() ? 250 : 1700;
    sheetSounds.die(wait / 1000);
    const [result] = await Promise.all([
      creation.rollAttributes(),
      new Promise((resolve) => {
        timer.current = window.setTimeout(resolve, wait);
      }),
    ]);
    if (!result) {
      setStage(null);
      return;
    }
    sheetSounds.play('dieBell');
    setStage({ phase: 'settled', roll: result });
  };

  const bonus = resolveBonus(d.spec, data.creation.racialPicks ?? []);
  const values = method === 'roll' ? (d.rollSums ?? []) : STANDARD_ARRAY;
  const suggestion = suggestOrder(
    d.klass?.spellcastingAbility,
    d.klass?.savingThrows ?? []
  );

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={handles.crBlockHead}>
          <h3>1 · Método</h3>
        </div>
        <Methods
          method={method}
          rolled={rolled}
          disabled={disabled || creation.busy}
          onPick={pick}
        />
        {rolled && (
          <LevelUpPill tone="muted">
            Rolado · os outros métodos estão bloqueados
          </LevelUpPill>
        )}

        <div className={handles.crBlockHead}>
          <h3>2 · Distribuir</h3>
        </div>
        {!method && (
          <div className={lu.luNote}>Escolha o método para distribuir.</div>
        )}
        {method === 'pointBuy' && (
          <PointBuy base={d.base} disabled={disabled} onChange={setBase} />
        )}
        {(method === 'standardArray' || (method === 'roll' && d.rollSums)) && (
          <AssignBoard
            values={values}
            base={d.base}
            race={bonus}
            suggestion={suggestion}
            disabled={disabled}
            onChange={setBase}
          />
        )}

        <div className={handles.crBlockHead}>
          <h3>3 · Bônus da raça</h3>
        </div>
        {!d.race ? (
          <div className={lu.luNote}>Escolha a raça para ver os bônus.</div>
        ) : d.spec.free.length === 0 ? (
          <div className={lu.luNote}>
            {Object.keys(d.spec.fixed).length > 0
              ? 'Os bônus fixos da raça já entram nos totais.'
              : 'Esta raça não dá bônus de atributo.'}
          </div>
        ) : (
          <RacialPicks
            spec={d.spec}
            picks={data.creation.racialPicks ?? []}
            raceName={d.race.name}
            disabled={disabled}
            onChange={(picks) =>
              creation.patch({ creation: { racialPicks: picks } })
            }
          />
        )}
      </div>
      <Summary
        totals={d.totals}
        placed={d.placed}
        hp={d.hp}
        hitDie={d.klass?.hitDie ?? null}
      />
      {ask && (
        <AttributeRollAsk
          busy={creation.busy}
          onCancel={() => setAsk(false)}
          onRoll={() => void doRoll()}
        />
      )}
      {stage && (
        <AttributeRollStage
          phase={stage.phase}
          sets={stage.roll?.sets}
          sums={stage.roll?.sums}
          at={stage.roll?.at}
          rollId={stage.roll?.rollId}
          onContinue={() => {
            setStage(null);
            sheetSounds.play('paperSlide');
          }}
        />
      )}
    </div>
  );
};

export default AttributesStep;
