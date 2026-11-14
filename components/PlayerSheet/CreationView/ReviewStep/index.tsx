'use client';

import { useCssHandles } from '@/hooks/useCssHandles';
import type { WizardStepId } from '@/lib/creation';
import { CheckIcon } from '../../../Icons';
import LevelUpDetail from '../../LevelUpDetail';
import LevelUpViewHandles from '../../LevelUpView/handles';
import CreationViewHandles from '../handles';
import { useStep } from '../useStep';

interface IProps {
  onGo: (step: WizardStepId) => void;
}

const STEP_TITLE: Record<string, string> = {
  identidade: 'Identidade',
  raca: 'Raça',
  classe: 'Classe',
  atributos: 'Atributos',
  nivel1: 'Nível 1',
  pericias: 'Perícias',
  magias: 'Magias',
  equipamento: 'Equipamento',
  historia: 'História',
};

/** O que falta: obrigatório em dourado, recomendado tracejado, com link ao passo. */
const ReviewStep = ({ onGo }: IProps) => {
  const lu = useCssHandles(LevelUpViewHandles);
  const handles = useCssHandles(CreationViewHandles);
  const { data, creation } = useStep();
  const required = data.issues.filter((i) => i.kind === 'required');
  const soft = data.issues.filter((i) => i.kind === 'recommended');
  const lastReturn = [...data.review]
    .reverse()
    .find((r) => r.kind === 'return');

  return (
    <div className={lu.luContent}>
      <div className={lu.luPane}>
        <div className={lu.luPaneHead}>
          <h3>Revisão</h3>
          <p>
            {required.length === 0
              ? 'Tudo o que é obrigatório está feito. Dá para enviar.'
              : `Faltam ${required.length} coisas obrigatórias para enviar.`}
          </p>
        </div>
        {creation.status === 'returned' && lastReturn?.notes && (
          <div className={lu.luNote} role="status">
            <b>Observações da staff ({lastReturn.by}):</b> {lastReturn.notes}
          </div>
        )}
        {required.length === 0 && soft.length === 0 && (
          <div className={handles.crEmpty}>
            <CheckIcon width={14} height={14} /> Nada pendente.
          </div>
        )}
        <ul className={handles.crIssues}>
          {required.map((i, n) => (
            <li key={`r${n}`} className={handles.crIssue} data-kind="required">
              <span>{i.message}</span>
              <button type="button" onClick={() => onGo(i.step)}>
                {STEP_TITLE[i.step]}
              </button>
            </li>
          ))}
          {soft.map((i, n) => (
            <li
              key={`s${n}`}
              className={handles.crIssue}
              data-kind="recommended"
            >
              <span>{i.message} (recomendado)</span>
              <button type="button" onClick={() => onGo(i.step)}>
                {STEP_TITLE[i.step]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <LevelUpDetail
        kind="Envio"
        title="Antes de enviar"
        body="Obrigatórios: nome, raça (e sub-raça quando a raça pede), classe, atributos completos, escolhas do nível 1, perícias e magias. Recomendados: equipamento, história, retrato e idioma extra."
      />
    </div>
  );
};

export default ReviewStep;
