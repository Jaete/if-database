'use client';

import { useEffect, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import LevelUpDetail from '../../LevelUpDetail';
import { sheetSounds } from '@/lib/sheetSounds';
import LevelUpViewHandles from '../handles';
import type { IStepProps } from '../types';
import { stepsOf } from '../useLevelDraft';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

/** "O que chega sozinho": proficiência, características garantidas e espaços. */
const GainsStep = ({ plan, draft, patch }: IStepProps) => {
  const handles = useCssHandles(LevelUpViewHandles);
  const [hover, setHover] = useState<string | null>(null);

  // Ver os ganhos conta como o passo feito (é só leitura).
  const seen = draft.seenGains;
  useEffect(() => {
    if (!seen) patch({ seenGains: true });
  }, [seen, patch]);

  const focus =
    plan.autoFeatures.find((f) => f.name === hover) ?? plan.autoFeatures[0];
  const { from, to } = plan.proficiency;
  const choices = stepsOf(plan)
    .filter((s) => s.required)
    .map((s) => s.title)
    .join(', ');

  return (
    <div className={handles.luContent}>
      <div className={handles.luPane}>
        <div className={handles.luPaneHead}>
          <h3>O que chega sozinho</h3>
          <p>
            Isto entra na ficha sem escolha.
            {choices ? (
              <>
                {' '}
                Depois vêm <b>{choices}</b>.
              </>
            ) : null}
          </p>
        </div>
        <div className={handles.luGains}>
          {to !== null && (
            <div
              className={`${handles.luGain}${from === to ? ` ${handles.luGain}--same` : ''}`}
            >
              <span className={handles.luGainKey}>Bônus de Proficiência</span>
              <span className={handles.luGainValue}>
                {from === to || from === null ? (
                  <>+{to}</>
                ) : (
                  <>
                    <s>+{from}</s>
                    <span>→</span>+{to}
                  </>
                )}
              </span>
              <p>
                {from === to
                  ? 'Sem mudança neste nível.'
                  : 'Ataques, perícias proficientes e resistências sobem junto.'}
              </p>
            </div>
          )}
          {plan.autoFeatures.map((f) => (
            <button
              key={f.name}
              type="button"
              className={handles.luGain}
              aria-pressed={focus?.name === f.name}
              onClick={() => {
                setHover(f.name);
                sheetSounds.play('paperSlide');
              }}
              onMouseEnter={() => setHover(f.name)}
            >
              <span className={handles.luGainGlyph} aria-hidden="true">
                {f.name.charAt(0)}
              </span>
              <span className={handles.luGainKey}>Característica</span>
              <span className={handles.luGainValue}>{f.name}</span>
              <p>
                {f.description.slice(0, 110)}
                {f.description.length > 110 ? '…' : ''}
              </p>
            </button>
          ))}
          {plan.spells.slots.length > 0 && plan.spells.adds.length > 0 && (
            <div className={handles.luGain}>
              <span className={handles.luGainKey}>Espaços de magia</span>
              <span className={handles.luGainValue}>
                {plan.spells.adds
                  .map((a) => `+${a.add} no ${a.circle}º círculo`)
                  .join(' · ')}
              </span>
              <div className={handles.luSlotRow}>
                {plan.spells.slots.map((n, i) => (
                  <span
                    key={i}
                    className={`${handles.luSlot}${
                      n !== (plan.spells.prevSlots[i] ?? 0)
                        ? ` ${handles.luSlot}--new`
                        : ''
                    }`}
                  >
                    <b>{ROMAN[i + 1]}</b>
                    <span>{n}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {plan.hp.die && (
            <div className={handles.luGain}>
              <span className={handles.luGainKey}>Vida</span>
              <span className={handles.luGainValue}>d{plan.hp.die} + CON</span>
              <p>Você escolhe no passo Vida: valor fixo ou rolar o dado.</p>
            </div>
          )}
        </div>
      </div>
      {focus ? (
        <LevelUpDetail
          kind={`Característica · nível ${plan.level}`}
          title={focus.name}
          body={focus.description}
        />
      ) : (
        <LevelUpDetail
          kind={`Nível ${plan.level}`}
          title="Ganhos do nível"
          body=""
        />
      )}
    </div>
  );
};

export default GainsStep;
