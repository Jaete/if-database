'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { formatSlotCell, parseSlotCell } from '@/db/l10n/classes';
import { CloseIcon } from '../../Icons';
import SlotsFieldHandles from './handles';

const MAX_CIRCLE = 9;
const ORDINALS = ['', '1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º'];

interface IProps {
  /** A célula crua, a mesma que a importação grava ("4 (1º) / 2 (2º)"). */
  value: string;
  /**
   * O que o nível anterior concede, por círculo. É o piso: um nível nunca
   * tira o que o anterior já deu.
   */
  floor: number[];
  onChange: (next: string) => void;
}

/**
 * Edita os espaços de magia de um nível, um círculo por vez.
 *
 * Fala texto com o formulário — recebe e devolve a célula crua — porque é esse
 * o formato que a importação grava e que `parseSlotCell` deriva em
 * `spellSlots`. Trocar a interface sem trocar o formato mantém um só lugar
 * definindo a regra, e a procedência do que veio do fórum intacta.
 *
 * O piso do nível anterior não é validado, é construído: o "−" para no piso e
 * o círculo que o nível anterior concede não tem como ser removido. Um estado
 * inválido não chega a existir, em vez de existir e ser recusado na hora de
 * salvar.
 */
const SlotsField = ({ value, floor, onChange }: IProps) => {
  const handles = useCssHandles(SlotsFieldHandles);
  const [adding, setAdding] = useState(false);

  const parsed = parseSlotCell(value);

  // O piso vence o que está gravado. Um nível pode ter ficado abaixo do
  // anterior porque o anterior subiu depois dele; mostrar o valor velho seria
  // mostrar algo que esta tela não deixa mais escrever.
  const slots = Array.from(
    { length: Math.max(parsed.length, floor.length) },
    (_, i) => Math.max(parsed[i] ?? 0, floor[i] ?? 0)
  );

  const write = (next: number[]) => onChange(formatSlotCell(next));

  const setAt = (index: number, count: number) =>
    write(
      Array.from({ length: Math.max(slots.length, index + 1) }, (_, i) =>
        i === index ? count : (slots[i] ?? 0)
      )
    );

  const present = slots
    .map((count, index) => ({ count, circle: index + 1 }))
    .filter((slot) => slot.count > 0);

  const absent = Array.from({ length: MAX_CIRCLE }, (_, i) => i + 1).filter(
    (circle) => !(slots[circle - 1] > 0)
  );

  return (
    <div className={handles.slotsField}>
      {present.length === 0 && (
        <p className={handles.slotsEmpty}>
          Este nível não concede espaço de magia.
        </p>
      )}

      {present.map(({ circle, count }) => {
        const min = floor[circle - 1] ?? 0;
        return (
          <div key={circle} className={handles.slotsRow}>
            <span className={handles.slotsCircle}>{ORDINALS[circle]}</span>
            <span className={handles.slotsStepper}>
              <button
                type="button"
                className={handles.slotsStep}
                onClick={() => setAt(circle - 1, count - 1)}
                disabled={count <= Math.max(min, 1)}
                aria-label={`Menos um espaço de ${ORDINALS[circle]} círculo`}
              >
                −
              </button>
              <span className={handles.slotsCount} aria-live="polite">
                {count}
              </span>
              <button
                type="button"
                className={handles.slotsStep}
                onClick={() => setAt(circle - 1, count + 1)}
                aria-label={`Mais um espaço de ${ORDINALS[circle]} círculo`}
              >
                +
              </button>
            </span>
            {min > 0 ? (
              <span className={handles.slotsFloor}>mín. {min}</span>
            ) : (
              <button
                type="button"
                className={handles.slotsRemove}
                onClick={() => setAt(circle - 1, 0)}
                aria-label={`Remover o ${ORDINALS[circle]} círculo`}
              >
                <CloseIcon />
              </button>
            )}
          </div>
        );
      })}

      {absent.length > 0 &&
        (adding ? (
          <select
            className={handles.slotsAddSelect}
            autoFocus
            defaultValue=""
            onKeyDown={(event) => event.stopPropagation()}
            onChange={(event) => {
              const circle = Number(event.target.value);
              if (circle) setAt(circle - 1, 1);
              setAdding(false);
            }}
          >
            <option value="" disabled>
              Escolha o círculo
            </option>
            {absent.map((circle) => (
              <option key={circle} value={circle}>
                {ORDINALS[circle]} círculo
              </option>
            ))}
          </select>
        ) : (
          <button
            type="button"
            className={handles.slotsAdd}
            onClick={() => setAdding(true)}
          >
            + Adicionar círculo
          </button>
        ))}
    </div>
  );
};

export default SlotsField;
