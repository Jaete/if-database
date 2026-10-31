'use client';

import type ICharacterClass from '@/db/classes/class.d';
import type { ITalent } from '@/db/classes/class.d';
import { useCssHandles } from '@/hooks/useCssHandles';
import { PlusIcon } from '../../../Icons';
import Description from '../../Description';
import ClassDataHandles from '../../handles';
import ItemTools from '../ItemTools';
import SectionModalHandles from '../handles';
import type { ISectionActions } from '../types';

interface IProps {
  characterClass: ICharacterClass;
  actions: ISectionActions;
}

interface IEntry {
  talent: ITalent;
  index: number;
}

/**
 * Os talentos, em grade de cards. Os que vieram de uma lista com regra
 * própria de destrave (`group`/`unlock`) ficam sob o cabeçalho dela.
 */
const Talents = ({ characterClass: k, actions }: IProps) => {
  const handles = useCssHandles(SectionModalHandles);
  const shared = useCssHandles(ClassDataHandles);
  const { canEdit } = actions;

  const entries: IEntry[] = (k.talents ?? []).map((talent, index) => ({
    talent,
    index,
  }));
  const loose = entries.filter((entry) => !entry.talent.group);
  const groups = entries.reduce<
    { name: string; unlock?: string; entries: IEntry[] }[]
  >((acc, entry) => {
    const name = entry.talent.group;
    if (!name) return acc;
    const found = acc.find((group) => group.name === name);
    if (found) found.entries.push(entry);
    else acc.push({ name, unlock: entry.talent.unlock, entries: [entry] });
    return acc;
  }, []);

  const renderTalent = ({ talent, index }: IEntry) => (
    <article key={`${talent.name}-${index}`} className={handles.clsTalent}>
      <div className={handles.clsFeatHead}>
        <h3 className={handles.clsFeatName}>{talent.name}</h3>
        {canEdit && (
          <ItemTools
            name={talent.name}
            onEdit={() => actions.edit.talent(index)}
            onRemove={() =>
              actions.ask({
                title: `Excluir o talento ${talent.name}?`,
                message:
                  'O talento sai da classe com a descrição e as tabelas dele.',
                confirm: () => actions.remove.talent(index),
              })
            }
          />
        )}
      </div>
      {talent.requirement && (
        <span className={handles.clsReq}>
          Requer <b>{talent.requirement}</b>
        </span>
      )}
      <Description text={talent.description} tables={talent.tables} />
    </article>
  );

  return (
    <>
      {entries.length === 0 && (
        <p className={handles.clsModalEmpty}>Nenhum talento ainda.</p>
      )}
      {loose.length > 0 && (
        <div className={handles.clsTalents}>{loose.map(renderTalent)}</div>
      )}
      {groups.map((group) => (
        <section key={group.name}>
          <div className={handles.clsGroupHead}>
            <h3 className={handles.clsArchName}>{group.name}</h3>
            {group.unlock && (
              <p className={handles.clsFeatMeta}>{group.unlock}</p>
            )}
          </div>
          <div className={handles.clsTalents}>
            {group.entries.map(renderTalent)}
          </div>
        </section>
      ))}
      {canEdit && (
        <div className={handles.clsSecAdd}>
          <button
            type="button"
            className={shared.clsGhostBtn}
            onClick={() => actions.edit.talent(-1)}
          >
            <PlusIcon />
            Talento
          </button>
        </div>
      )}
    </>
  );
};

export default Talents;
