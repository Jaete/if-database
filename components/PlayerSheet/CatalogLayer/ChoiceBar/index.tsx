'use client';

import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { ArrowLeftIcon } from '../../../Icons';
import type { ICatalogScreen } from '../types';
import ChoiceBarHandles from './handles';

interface IProps {
  /** `id` do texto "Escolhendo para…", que nomeia o diálogo. */
  labelId: string;
  playerName: string;
  /** "Raça", "Classe"… */
  title: string;
  stack: ICatalogScreen[];
  /** Volta uma tela, ou à ficha quando está na raiz. */
  onBack: () => void;
  onLeave: () => void;
}

/** A barra de cima da camada: voltar à ficha, para quem se escolhe e a trilha. */
const ChoiceBar = ({
  labelId,
  playerName,
  title,
  stack,
  onBack,
  onLeave,
}: IProps) => {
  const handles = useCssHandles(ChoiceBarHandles);
  return (
    <header className={handles.sheetCodexBar}>
      <button
        type="button"
        className={handles.sheetCodexBack}
        onClick={stack.length > 1 ? onBack : onLeave}
        aria-label={stack.length > 1 ? 'Voltar' : 'Voltar à ficha'}
      >
        <ArrowLeftIcon />
        <span>{stack.length > 1 ? 'Voltar' : 'Voltar à ficha'}</span>
      </button>
      <p id={labelId} className={handles.sheetCodexFor}>
        Escolhendo para <b>{playerName || 'o personagem'}</b> · {title}
      </p>
      <nav aria-label="Trilha" className={handles.sheetCodexCrumb}>
        {stack.map((screen, i) => (
          <span
            key={screen.id}
            className={`${handles.sheetCodexCrumbItem}${
              i === stack.length - 1
                ? ` ${applyModifiers(handles.sheetCodexCrumbItem, 'current')}`
                : ''
            }`}
            aria-current={i === stack.length - 1 ? 'page' : undefined}
          >
            {screen.label}
          </span>
        ))}
      </nav>
      {stack.length > 1 && (
        <button
          type="button"
          className={handles.sheetCodexBack}
          onClick={onLeave}
        >
          Voltar à ficha
        </button>
      )}
    </header>
  );
};

export default ChoiceBar;
