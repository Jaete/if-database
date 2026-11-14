'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { sheetSounds } from '@/lib/sheetSounds';
import { ATTRIBUTES, sortedDesc, type Base } from '@/lib/creation';
import { ATTRIBUTE_LABELS } from '@/lib/levelUp';
import { formatModifier, modifierOf, type AttributeKey } from '@/lib/stats';
import { ChevronDownIcon, ChevronUpIcon } from '../../../../Icons';
import LevelUpButton from '../../../LevelUpButton';
import CreationViewHandles from '../../handles';

interface IProps {
  /** Os seis valores a distribuir (arranjo ou rolagem). */
  values: readonly number[];
  base: Base;
  /** Bônus da raça já resolvido, por atributo. */
  race: Record<AttributeKey, number>;
  /** Do mais importante ao menos: a "Sugerir pela classe". */
  suggestion: AttributeKey[];
  disabled: boolean;
  onChange: (base: Base) => void;
}

/**
 * "Pedras e espaços": os seis valores viram pedras, da maior para a menor, e
 * cada atributo é um espaço. Toque numa pedra e depois no atributo (ou o
 * contrário), arraste, ou tecle 1 a 6 com o foco no atributo. Tocar num espaço
 * cheio devolve a pedra; com outra pedra na mão, troca. A alternativa "Ordenar
 * a lista" troca valores com ↑ ↓.
 */
const AssignBoard = ({
  values,
  base,
  race,
  suggestion,
  disabled,
  onChange,
}: IProps) => {
  const handles = useCssHandles(CreationViewHandles);
  const stones = sortedDesc(values);
  const [mode, setMode] = useState<'stones' | 'order'>('stones');
  const [heldStone, setHeldStone] = useState<number | null>(null);
  const [heldSlot, setHeldSlot] = useState<AttributeKey | null>(null);

  // Cada espaço cheio consome a primeira pedra livre do mesmo valor.
  const used = new Map<AttributeKey, number>();
  const taken = new Set<number>();
  for (const key of ATTRIBUTES) {
    const v = base[key];
    if (v === undefined) continue;
    const at = stones.findIndex((s, i) => s === v && !taken.has(i));
    if (at >= 0) {
      used.set(key, at);
      taken.add(at);
    }
  }
  const free = stones.map((_, i) => i).filter((i) => !taken.has(i));

  const assign = (key: AttributeKey, stone: number) => {
    onChange({ ...base, [key]: stones[stone] });
    setHeldStone(null);
    setHeldSlot(null);
    sheetSounds.play('pick');
  };
  const release = (key: AttributeKey) => {
    const next = { ...base };
    delete next[key];
    onChange(next);
    sheetSounds.play('unpick');
  };

  const clickStone = (i: number) => {
    if (disabled) return;
    if (heldSlot) return assign(heldSlot, i);
    setHeldStone(heldStone === i ? null : i);
    setHeldSlot(null);
  };
  const clickSlot = (key: AttributeKey) => {
    if (disabled) return;
    if (heldStone !== null) return assign(key, heldStone);
    if (used.has(key)) return release(key);
    setHeldSlot(heldSlot === key ? null : key);
  };

  const suggest = () => {
    const next: Base = {};
    suggestion.forEach((key, i) => {
      next[key] = stones[i];
    });
    onChange(next);
    sheetSounds.play('pick');
  };

  // ── Ordenar a lista ──
  const ordered = ATTRIBUTES.map((k) => base[k]);
  const orderedComplete = ordered.every((v) => v !== undefined);
  const toOrder = () => {
    setMode('order');
    if (orderedComplete) return;
    const next: Base = {};
    ATTRIBUTES.forEach((k, i) => {
      next[k] = stones[i];
    });
    onChange(next);
  };
  const swap = (i: number, j: number) => {
    if (j < 0 || j >= ATTRIBUTES.length) return;
    const a = ATTRIBUTES[i];
    const b = ATTRIBUTES[j];
    onChange({ ...base, [a]: base[b], [b]: base[a] });
    sheetSounds.play('pick');
  };
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const row = (key: AttributeKey) => {
    const v = base[key];
    const total = v === undefined ? undefined : v + race[key];
    return (
      <>
        <span className={handles.crSlotVal}>{v ?? '·'}</span>
        <span className={handles.crSlotBonus}>
          {race[key] ? `+${race[key]}` : ''}
        </span>
        <span className={handles.crSlotTotal}>
          {total === undefined
            ? ''
            : `${total} (${formatModifier(modifierOf(total))})`}
        </span>
      </>
    );
  };

  return (
    <div>
      <div className={handles.crTools}>
        <LevelUpButton
          variant={mode === 'stones' ? 'secondary' : 'ghost'}
          onClick={() => setMode('stones')}
        >
          Pedras
        </LevelUpButton>
        <LevelUpButton
          variant={mode === 'order' ? 'secondary' : 'ghost'}
          disabled={disabled}
          onClick={toOrder}
        >
          Ordenar a lista
        </LevelUpButton>
        <LevelUpButton variant="ghost" disabled={disabled} onClick={suggest}>
          Sugerir pela classe
        </LevelUpButton>
        <LevelUpButton
          variant="ghost"
          disabled={disabled}
          onClick={() => onChange({})}
        >
          Limpar
        </LevelUpButton>
      </div>

      {mode === 'stones' ? (
        <>
          <div
            className={handles.crStones}
            role="group"
            aria-label="Pedras disponíveis"
          >
            {free.length === 0 && (
              <span className={handles.crHint}>
                Todas as pedras estão nos espaços.
              </span>
            )}
            {free.map((i) => (
              <button
                key={i}
                type="button"
                className={handles.crStone}
                aria-pressed={heldStone === i}
                disabled={disabled}
                draggable={!disabled}
                onDragStart={(e) =>
                  e.dataTransfer.setData('text/plain', `stone:${i}`)
                }
                onClick={() => clickStone(i)}
              >
                {stones[i]}
              </button>
            ))}
          </div>
          <div className={handles.crSlots}>
            {ATTRIBUTES.map((key) => (
              <button
                key={key}
                type="button"
                className={handles.crSlot}
                data-filled={used.has(key) || undefined}
                aria-pressed={heldSlot === key}
                aria-label={`${ATTRIBUTE_LABELS[key][1]}: ${base[key] ?? 'vazio'}`}
                disabled={disabled}
                onClick={() => clickSlot(key)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const [kind, ref] = e.dataTransfer
                    .getData('text/plain')
                    .split(':');
                  if (kind === 'stone') assign(key, Number(ref));
                  else if (kind === 'slot') {
                    const from = ref as AttributeKey;
                    if (from !== key) {
                      onChange({
                        ...base,
                        [key]: base[from],
                        [from]: base[key],
                      });
                      sheetSounds.play('pick');
                    }
                  }
                }}
                draggable={!disabled && used.has(key)}
                onDragStart={(e) =>
                  e.dataTransfer.setData('text/plain', `slot:${key}`)
                }
                onKeyDown={(e) => {
                  const n = Number(e.key);
                  if (n >= 1 && n <= free.length) {
                    e.preventDefault();
                    assign(key, free[n - 1]);
                  }
                }}
              >
                <span className={handles.crSlotAttr}>
                  {ATTRIBUTE_LABELS[key][0]}
                </span>
                {row(key)}
              </button>
            ))}
          </div>
        </>
      ) : (
        <ol className={handles.crOrder}>
          {ATTRIBUTES.map((key, i) => (
            <li
              key={key}
              className={handles.crOrderRow}
              draggable={!disabled}
              onDragStart={() => setDragFrom(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragFrom !== null) swap(dragFrom, i);
                setDragFrom(null);
              }}
            >
              <span className={handles.crSlotAttr}>
                {ATTRIBUTE_LABELS[key][0]}
              </span>
              {row(key)}
              <button
                type="button"
                aria-label={`Subir ${ATTRIBUTE_LABELS[key][1]}`}
                disabled={disabled || i === 0}
                onClick={() => swap(i, i - 1)}
              >
                <ChevronUpIcon width={12} height={12} />
              </button>
              <button
                type="button"
                aria-label={`Descer ${ATTRIBUTE_LABELS[key][1]}`}
                disabled={disabled || i === ATTRIBUTES.length - 1}
                onClick={() => swap(i, i + 1)}
              >
                <ChevronDownIcon width={12} height={12} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default AssignBoard;
