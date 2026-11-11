'use client';

import type { IRaceChoiceRule } from '@/db/races/race.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon, TrashIcon } from '../../Icons';
import RaceGhostAdd from '../../RaceGhostAdd';
import RaceIconButton from '../../RaceIconButton';
import type { IRaceActions } from '../types';
import ChoiceRulesHandles from './handles';

interface IProps {
  rules: IRaceChoiceRule[];
  actions: IRaceActions;
}

const summaryOf = (rule: IRaceChoiceRule): [string, string] =>
  rule.kind === 'dominantBlood'
    ? [
        'Escolha 1 raça',
        'Escolha qual das raças de origem é a dominante. Você recebe as habilidades comuns a todas as sub-raças dela.',
      ]
    : [
        `Escolha ${rule.count || 2} habilidades`,
        `Veja as habilidades das raças de origem e escolha ${rule.count || 2}. A escolha é feita na criação do personagem e não muda depois.`,
      ];

/**
 * As regras de escolha da raça mista: um trilho numerado, e não cards de
 * habilidade — o personagem não ganha estas regras, ele as segue para montar
 * a ficha.
 */
const ChoiceRules = ({ rules, actions }: IProps) => {
  const handles = useCssHandles(ChoiceRulesHandles);
  const { canEdit } = actions;

  return (
    <>
      <p className={handles.raceRulesLead}>
        O que o personagem ganha vem das raças que o formam. As regras abaixo
        dizem como montar isso na ficha; elas não são habilidades que o
        personagem recebe.
      </p>
      <ol className={handles.raceRules}>
        <li className={handles.raceRule}>
          <span className={handles.raceRuleSeal} aria-hidden="true">
            1
          </span>
          <div className={handles.raceRuleBody}>
            <div className={handles.raceRuleHead}>
              <h3>Raças de origem</h3>
              <span className={handles.raceRulePill}>Campo da ficha</span>
              {canEdit && (
                <span className={handles.raceRuleFixed}>
                  fixo · vem da ficha
                </span>
              )}
            </div>
            <p className={handles.raceRuleSum}>
              O Mestiço é a mistura de duas raças, como Elfos + Humanos ou Elfos
              + Moogles. Elas são registradas na ficha.
            </p>
          </div>
        </li>
        {rules.map((rule, i) => {
          const [pill, sum] = summaryOf(rule);
          return (
            <li key={`${i}-${rule.name}`} className={handles.raceRule}>
              <span className={handles.raceRuleSeal} aria-hidden="true">
                {i + 2}
              </span>
              <div className={handles.raceRuleBody}>
                <div className={handles.raceRuleHead}>
                  <h3>{rule.name}</h3>
                  <span className={handles.raceRulePill}>{pill}</span>
                  {canEdit && (
                    <span className={handles.raceRuleTools}>
                      <RaceIconButton
                        small
                        label={`Editar ${rule.name}`}
                        icon={<PencilIcon />}
                        onClick={() => actions.editRule(i)}
                      />
                      <RaceIconButton
                        small
                        danger
                        label={`Excluir ${rule.name}`}
                        icon={<TrashIcon />}
                        onClick={() => actions.deleteRule(i)}
                      />
                    </span>
                  )}
                </div>
                <p className={handles.raceRuleSum}>{sum}</p>
                {rule.description && (
                  <details className={handles.raceRuleSrc}>
                    <summary>Texto do tópico</summary>
                    <p>{rule.description}</p>
                  </details>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {canEdit && (
        <RaceGhostAdd label="Regra de escolha" onClick={actions.addRule} />
      )}
    </>
  );
};

export default ChoiceRules;
