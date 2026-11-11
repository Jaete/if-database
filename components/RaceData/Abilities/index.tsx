'use client';

import type { IRaceTrait } from '@/db/races/race.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from '../../Icons';
import RaceGhostAdd from '../../RaceGhostAdd';
import RaceIconButton from '../../RaceIconButton';
import { NUMERALS } from '../fields';
import type { IRaceActions, TraitScope } from '../types';
import AbilitiesHandles from './handles';

interface IProps {
  traits: IRaceTrait[];
  scope: TraitScope;
  actions: IRaceActions;
}

/** Uma lista de habilidades raciais, com as opções "Escolha uma". */
const Abilities = ({ traits, scope, actions }: IProps) => {
  const handles = useCssHandles(AbilitiesHandles);
  const { canEdit } = actions;

  return (
    <>
      {traits.length > 0 ? (
        <ul className={handles.raceAbl}>
          {traits.map((trait, i) => (
            <li key={`${i}-${trait.name}`} className={handles.raceAb}>
              <div className={handles.raceAbHead}>
                <h3>{trait.name}</h3>
                {canEdit && (
                  <div className={handles.raceAbTools}>
                    <RaceIconButton
                      small
                      off={i === 0}
                      label={`Subir ${trait.name}`}
                      icon={<ChevronUpIcon />}
                      onClick={() => actions.moveTrait(scope, i, -1)}
                    />
                    <RaceIconButton
                      small
                      off={i === traits.length - 1}
                      label={`Descer ${trait.name}`}
                      icon={<ChevronDownIcon />}
                      onClick={() => actions.moveTrait(scope, i, 1)}
                    />
                    <RaceIconButton
                      small
                      label={`Editar ${trait.name}`}
                      icon={<PencilIcon />}
                      onClick={() => actions.editTrait(scope, i)}
                    />
                    <RaceIconButton
                      small
                      danger
                      label={`Excluir ${trait.name}`}
                      icon={<TrashIcon />}
                      onClick={() => actions.deleteTrait(scope, i)}
                    />
                  </div>
                )}
              </div>
              <p>{trait.description}</p>
              {trait.options && trait.options.length > 0 && (
                <div
                  className={handles.raceAbOpts}
                  role="group"
                  aria-label={`Opções de ${trait.name}`}
                >
                  <span className={handles.raceAbOptsCap}>Escolha uma</span>
                  {trait.options.map((option, k) => (
                    <div
                      key={`${k}-${option.name}`}
                      className={handles.raceAbOpt}
                    >
                      <div>
                        <i>{NUMERALS[k] ?? k + 1}</i>
                        <h4>{option.name}</h4>
                      </div>
                      <p>{option.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        canEdit && (
          <p className={handles.raceAbEmpty}>Nenhuma habilidade ainda.</p>
        )
      )}
      {canEdit && (
        <RaceGhostAdd
          label={scope === 'base' ? 'Habilidade só da raça base' : 'Habilidade'}
          onClick={() => actions.addTrait(scope)}
        />
      )}
    </>
  );
};

export default Abilities;
