'use client';

import type ICharacterClass from '@/db/classes/class.d';
import type { IClassLevel } from '@/db/classes/class.d';
import { archetypePickOf } from '@/db/l10n/classes';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../../../Icons';
import ClassDataHandles from '../../handles';
import { grantKey, indexFeatures } from '../../featureLookup';
import ItemTools from '../ItemTools';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  characterClass: ICharacterClass;
  actions: ISectionActions;
  /** Seções existentes, para só linkar o que de fato abre. */
  available: ReadonlySet<string>;
  onGoto: (id: string, featureIndex?: number) => void;
  extraColumns: string[];
  nextLevel: number;
}

const ORDINALS = ['', '1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º'];
const ordinal = (circle: number) => ORDINALS[circle] ?? `${circle}º`;

const ASI = /em (um|dois) atributos?/i;

/**
 * A tabela de progressão. A linha dourada marca onde o bônus de proficiência
 * sobe, e os nomes concedidos levam à descrição.
 */
const Progression = ({
  characterClass: k,
  actions,
  available,
  onGoto,
  extraColumns,
  nextLevel,
}: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const { canEdit } = actions;
  const featureIndex = indexFeatures(k.features);

  /**
   * Os espaços de magia do nível, um losango por espaço, em blocos por
   * círculo. A célula crua ("4 (1º) / 2 (2º)") continua como título e rótulo
   * acessível: ela é a procedência, e o desenho não substitui o número exato.
   */
  const renderSlots = (level: IClassLevel) => {
    const groups = (level.spellSlots ?? [])
      .map((count, index) => ({ circle: index + 1, count: Number(count) || 0 }))
      .filter((group) => group.count > 0);

    // Sem a célula estruturada não há o que desenhar: algumas classes só têm o
    // texto original, e perdê-lo seria pior que não ter o desenho.
    if (groups.length === 0) return level.spellSlotsRaw ?? '—';

    const label = groups
      .map((g) => `${g.count} de ${ordinal(g.circle)}`)
      .join(', ');

    return (
      <span
        className={handles.clsSlots}
        role="img"
        aria-label={`Espaços de magia: ${label}`}
        title={level.spellSlotsRaw}
      >
        {groups.map((group) => (
          <span key={group.circle} className={handles.clsSlotGroup}>
            <span className={handles.clsSlotCircle}>
              {ordinal(group.circle)}
            </span>
            <span className={handles.clsSlotGrid}>
              {Array.from({ length: group.count }, (_, i) => (
                <i key={i} className={handles.clsSlot} />
              ))}
            </span>
          </span>
        ))}
      </span>
    );
  };

  const renderOption = (name: string) => {
    if (ASI.test(name))
      return <span className={handles.clsGrantAsi}>{name}</span>;

    let target: { id: string; feature?: number } | null = null;
    const feature = featureIndex.get(grantKey(name));
    if (feature !== undefined) {
      target = { id: 'caracteristicas', feature };
    } else if (archetypePickOf(name)) {
      target = { id: 'arquetipos' };
    } else if (
      /^talentos?\s+d[aeo]s?\b/i.test(
        name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      )
    ) {
      target = { id: 'talentos' };
    }
    if (!target || !available.has(target.id)) return name;

    const { id, feature: at } = target;
    return (
      <button
        type="button"
        className={handles.clsGrantLink}
        onClick={() => onGoto(id, at)}
      >
        {name}
      </button>
    );
  };

  const renderGrants = (level: IClassLevel) => {
    if (!level.grants?.length) {
      return level.abilityScoreIncrease ? (
        <span className={handles.clsGrantAsi}>
          {level.abilityScoreIncrease}
        </span>
      ) : (
        '—'
      );
    }
    return level.grants.map((grant, i) => (
      <span key={i}>
        {i > 0 && <span className={handles.clsGrantPlus}>+</span>}
        {grant.options.map((option, j) => (
          <span key={option.name}>
            {j > 0 && <span className={handles.clsGrantOr}>ou</span>}
            {renderOption(option.name)}
            {option.requiresPrerequisite && (
              <abbr title="Exige um requisito, descrito na própria habilidade">
                *
              </abbr>
            )}
          </span>
        ))}
      </span>
    ));
  };

  return (
    <>
      <div className={handles.clsProgScroll}>
        <table className={handles.clsProg}>
          <thead>
            <tr>
              <th>Nível</th>
              <th>Prof.</th>
              {k.isSpellcaster && <th>Truques</th>}
              {k.isSpellcaster && <th>Espaços por círculo</th>}
              {extraColumns.map((label) => (
                <th key={label}>{label}</th>
              ))}
              <th>Características</th>
              {canEdit && <th aria-label="Ações" />}
            </tr>
          </thead>
          <tbody>
            {(k.levels ?? []).map((level, index) => {
              const tier =
                level.proficiencyBonus !==
                k.levels?.[index - 1]?.proficiencyBonus;
              return (
                <tr
                  key={level.level}
                  className={`${handles.clsProgRow}${
                    tier ? ` ${applyModifiers(handles.clsProgRow, 'tier')}` : ''
                  }`}
                >
                  <td>
                    <span className={handles.clsProgSeal}>{level.level}</span>
                  </td>
                  <td className={handles.clsProgProf}>
                    {level.proficiencyBonus !== undefined ? (
                      tier ? (
                        <b>+{level.proficiencyBonus}</b>
                      ) : (
                        `+${level.proficiencyBonus}`
                      )
                    ) : (
                      '—'
                    )}
                  </td>
                  {k.isSpellcaster && (
                    <td className={handles.clsProgNum}>
                      {level.cantripsKnown ?? '—'}
                    </td>
                  )}
                  {k.isSpellcaster && <td>{renderSlots(level)}</td>}
                  {extraColumns.map((label) => (
                    <td key={label} className={handles.clsProgNum}>
                      {level.columns?.[label] ?? '—'}
                    </td>
                  ))}
                  <td className={handles.clsProgGrant}>
                    {renderGrants(level)}
                  </td>
                  {canEdit && (
                    <td>
                      <span className={handles.clsProgTools}>
                        <ItemTools
                          name={`nível ${level.level}`}
                          onEdit={() => actions.edit.level(index)}
                          onRemove={() =>
                            actions.ask({
                              title: `Excluir o nível ${level.level}?`,
                              message:
                                'A linha sai da tabela com tudo o que ela concede. Os outros níveis mantêm a numeração que têm.',
                              confirm: () => actions.remove.level(index),
                            })
                          }
                        />
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={handles.clsProgLegend}>
        <span>
          <b>Linha dourada</b>: o bônus de proficiência sobe
        </span>
        <span>
          <b>Sublinhado</b>: abre a descrição
        </span>
        <span>
          <b>ou</b>: escolha uma
        </span>
      </p>
      {canEdit && (
        <div className={handles.clsSecAdd}>
          <button
            type="button"
            className={shared.clsGhostBtn}
            onClick={() => actions.edit.level(-1)}
          >
            <PlusIcon />
            Nível {nextLevel}
          </button>
        </div>
      )}
    </>
  );
};

export default Progression;
