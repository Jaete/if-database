'use client';

import type { IRaceChoiceRule } from '@/db/races/race.d';
import type { IRaceChoice } from '@/lib/catalogChoice';
import {
  resolveRaceTraits,
  traitMatchesRef,
} from '@/services/raceTraits.service';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PencilIcon, TrashIcon } from '../../Icons';
import RaceGhostAdd from '../../RaceGhostAdd';
import RaceIconButton from '../../RaceIconButton';
import type { IRaceActions } from '../types';
import MixedChoice from './MixedChoice';
import ChoiceRulesHandles from './handles';

interface IProps {
  rules: IRaceChoiceRule[];
  actions: IRaceActions;
  /** Modo escolha da ficha: cada regra ganha o seletor dela embaixo. */
  choice?: IRaceChoice;
  raceSlug?: string;
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
const ChoiceRules = ({ rules, actions, choice, raceSlug }: IProps) => {
  const handles = useCssHandles(ChoiceRulesHandles);
  const { canEdit } = actions;
  const race = choice?.catalog.find((r) => r.slug === raceSlug);
  // Os seletores só existem depois de "Usar Mestiço": antes disso, a página é
  // só a leitura das regras.
  const active = !!choice && !!race && choice.draft?.slug === raceSlug;
  const draftChoice = active ? (choice.draft?.choice ?? {}) : {};
  const bySlug = new Map((choice?.catalog ?? []).map((r) => [r.slug, r]));
  const withOptions =
    active && race
      ? resolveRaceTraits(race, draftChoice, bySlug).filter(
          (t) => t.options?.length
        )
      : [];
  const optionsPending = withOptions.filter(
    (t) => !draftChoice.traitOptions?.some((o) => traitMatchesRef(t, o.ref))
  ).length;

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
            {active && race && choice && (
              <MixedChoice kind="origins" race={race} choice={choice} />
            )}
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
                {active && race && choice && (
                  <MixedChoice
                    kind={
                      rule.kind === 'dominantBlood'
                        ? 'dominantBlood'
                        : 'hybridHeritage'
                    }
                    race={race}
                    choice={choice}
                    count={rule.count}
                    description={
                      rule.kind === 'hybridHeritage'
                        ? rule.description
                        : undefined
                    }
                  />
                )}
                {rule.description && rule.kind !== 'hybridHeritage' && (
                  <details className={handles.raceRuleSrc}>
                    <summary>Texto do tópico</summary>
                    <p>{rule.description}</p>
                  </details>
                )}
              </div>
            </li>
          );
        })}
        {withOptions.length > 0 && race && choice && (
          <li className={handles.raceRule}>
            <span className={handles.raceRuleSeal} aria-hidden="true">
              {rules.length + 2}
            </span>
            <div className={handles.raceRuleBody}>
              <div className={handles.raceRuleHead}>
                <h3>Opções de uma habilidade</h3>
                <span className={handles.raceRulePill}>
                  {optionsPending > 0 ? `Falta ${optionsPending}` : 'Completa'}
                </span>
              </div>
              <p className={handles.raceRuleSum}>
                Uma habilidade que você escolheu manda escolher uma opção. A
                ficha guarda qual.
              </p>
              <MixedChoice kind="options" race={race} choice={choice} />
            </div>
          </li>
        )}
      </ol>
      {canEdit && (
        <RaceGhostAdd label="Regra de escolha" onClick={actions.addRule} />
      )}
    </>
  );
};

export default ChoiceRules;
