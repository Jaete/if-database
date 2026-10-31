'use client';

import type { IClassCandidate } from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import ClassDataHandles from '../handles';
import CandidateHandles from './handles';

interface IProps {
  candidate: IClassCandidate;
  sourceUrl?: string;
  onAccept: () => void;
  /** Pede a confirmação antes de descartar. */
  onDiscard: () => void;
}

/**
 * O texto que a importação extraiu mas não confiou (só para editores).
 *
 * Fica visualmente fora do corpo da classe de propósito: isto não é conteúdo
 * publicado, é uma pergunta aberta.
 */
const Candidate = ({ candidate, sourceUrl, onAccept, onDiscard }: IProps) => {
  const handles = useCssHandles(CandidateHandles);
  const shared = useCssHandles(ClassDataHandles);

  const groups = (
    [
      ['Características', candidate.features],
      ['Arquétipos', candidate.archetypes],
      ['Talentos', candidate.talents],
    ] as const
  ).filter(([, list]) => (list?.length ?? 0) > 0);

  const coverage =
    typeof candidate.coverage === 'number'
      ? Math.round(candidate.coverage * 100)
      : null;

  return (
    <section
      className={handles.clsCandidate}
      aria-labelledby="class-candidate-title"
    >
      <div className={handles.clsCandidateBox}>
        <div>
          <h2 id="class-candidate-title" className={handles.clsCandidateTitle}>
            Texto extraído, à espera de avaliação
          </h2>
          <p className={handles.clsCandidateWhy}>
            {candidate.reason} Por isso nada disto entrou na classe
            automaticamente — confira contra{' '}
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                o tópico
              </a>
            ) : (
              'o tópico'
            )}{' '}
            antes de aceitar.
          </p>
          {coverage !== null && (
            <div
              className={handles.clsCandidateMeter}
              role="img"
              aria-label={`Cobertura: ${coverage}%`}
            >
              <span>
                <i style={{ width: `${coverage}%` }} />
              </span>
              {coverage}% de cobertura
            </div>
          )}
        </div>
        <div className={handles.clsCandidateActions}>
          <button
            type="button"
            className={`${shared.clsBtn} ${shared.clsBtn}--primary`}
            onClick={onAccept}
          >
            Aceitar tudo
          </button>
          <button
            type="button"
            className={`${shared.clsBtn} ${shared.clsBtn}--danger`}
            onClick={onDiscard}
          >
            Descartar
          </button>
        </div>
        <dl className={handles.clsCandidateGroups}>
          {groups.map(([label, list]) => (
            <div key={label} className={handles.clsCandidateGroup}>
              <dt>
                {list?.length} {label.toLowerCase()}
              </dt>
              <dd>{list?.map((item) => item.name).join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Candidate;
