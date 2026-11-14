import type { KeyboardEvent } from 'react';

/**
 * Teclado de um grupo `role="radiogroup"` feito de botões: as setas andam pelas
 * opções habilitadas e escolhem a que recebe o foco, Home e End vão às pontas.
 * Vai no contêiner do grupo; só um item do grupo fica na ordem do Tab (ver
 * `rovingTabIndex`).
 */
export const onRadioGroupKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  const keys = [
    'ArrowDown',
    'ArrowRight',
    'ArrowUp',
    'ArrowLeft',
    'Home',
    'End',
  ];
  if (!keys.includes(event.key)) return;

  const radios = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      '[role="radio"]:not(:disabled)'
    ),
  ];
  const at = radios.indexOf(document.activeElement as HTMLElement);
  if (at < 0) return;

  event.preventDefault();
  const last = radios.length - 1;
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? last
        : event.key === 'ArrowDown' || event.key === 'ArrowRight'
          ? (at + 1) % radios.length
          : (at - 1 + radios.length) % radios.length;
  radios[next].focus();
  radios[next].click();
};

/** O item que entra no Tab: o marcado, ou o primeiro se nenhum estiver. */
export const rovingTabIndex = (
  checked: boolean,
  anyChecked: boolean,
  index: number
): 0 | -1 => (checked || (!anyChecked && index === 0) ? 0 : -1);
