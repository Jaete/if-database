'use client';

import { useEffect, useMemo, useState } from 'react';
import type { IPlayerSpellRef } from '@/db/citizens/citizen.d';
import type ISpell from '@/db/spells/spell.d';
import { spellSlug } from '@/db/l10n/spells';
import { useCssHandles } from '@/hooks/useCssHandles';
import Modal from '../../Modal';
import ArrayItemWrapper from '../../ArrayItemWrapper';
import SpellLinkListHandles from './handles';

interface IProps {
  refs: IPlayerSpellRef[];
  onChange: (refs: IPlayerSpellRef[]) => void;
}

/**
 * Liga magias do grimório à ficha.
 *
 * Diferente de `SpellList`, aqui não se edita nada: a magia pertence ao
 * grimório, e a ficha guarda só o id. Por isso o círculo aparece como
 * informação, e não como campo — ele vem da magia.
 */
const SpellLinkList = ({ refs, onChange }: IProps) => {
  const handles = useCssHandles(SpellLinkListHandles);
  const [catalog, setCatalog] = useState<ISpell[] | null>(null);
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState('');

  // O catálogo só é buscado quando o seletor abre: a maioria das edições de
  // ficha não encosta em magia, e são centenas de documentos.
  useEffect(() => {
    if (!picking || catalog) return;
    let active = true;
    fetch('/api/spells')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setCatalog(data);
      })
      .catch(() => {
        if (active) setCatalog([]);
      });
    return () => {
      active = false;
    };
  }, [picking, catalog]);

  const byId = useMemo(
    () => new Map((catalog ?? []).map((spell) => [String(spell._id), spell])),
    [catalog]
  );

  const linkedIds = useMemo(
    () => new Set(refs.map((ref) => ref.spellId)),
    [refs]
  );

  const options = useMemo(() => {
    const needle = spellSlug(query);
    return (catalog ?? [])
      .filter((spell) => !linkedIds.has(String(spell._id)))
      .filter((spell) => !needle || spellSlug(spell.name).includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      .slice(0, 50);
  }, [catalog, query, linkedIds]);

  const add = (spell: ISpell) => {
    onChange([...refs, { spellId: String(spell._id), prepared: true }]);
    setQuery('');
    setPicking(false);
  };

  const remove = (index: number) =>
    onChange(refs.filter((_, i) => i !== index));

  return (
    <>
      {refs.length === 0 && (
        <p className={handles.linkEmpty}>
          Nenhuma magia do grimório ligada a esta ficha.
        </p>
      )}
      <div className={handles.linkList}>
        {refs.map((ref, i) => {
          const spell = byId.get(ref.spellId);
          return (
            <ArrayItemWrapper key={ref.spellId} onRemove={() => remove(i)}>
              <div className={handles.linkRow}>
                <span className={handles.linkCircle}>
                  {spell ? (spell.circle === 0 ? 'T' : spell.circle) : '?'}
                </span>
                <span className={handles.linkName}>
                  {/* Sem o catálogo carregado só existe o id; o nome aparece
                      assim que o seletor é aberto uma vez. */}
                  {spell?.name ?? 'Magia do grimório'}
                </span>
                {spell?.school && (
                  <span className={handles.linkMeta}>{spell.school}</span>
                )}
              </div>
            </ArrayItemWrapper>
          );
        })}
      </div>

      <button
        type="button"
        className="addButton"
        onClick={() => setPicking(true)}
      >
        Vincular magia do grimório
      </button>

      <Modal
        isOpen={picking}
        onClose={() => setPicking(false)}
        title="Vincular magia do grimório"
      >
        {/* O Modal mantém o conteúdo montado quando fechado, então sem esta
            guarda o campo de busca continua no DOM e tabulável por cima do
            formulário, junto com as 50 opções da lista. */}
        {!picking ? null : (
          <div className={handles.linkPicker}>
            <input
              className={handles.linkSearch}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar magia pelo nome..."
              aria-label="Buscar magia pelo nome"
            />
            {catalog === null ? (
              <p className={handles.linkLoading}>Carregando o grimório...</p>
            ) : (
              <ul className={handles.linkOptions}>
                {options.length === 0 && (
                  <li className={handles.linkLoading}>
                    Nenhuma magia disponível com esse nome.
                  </li>
                )}
                {options.map((spell) => (
                  <li key={String(spell._id)}>
                    <button
                      type="button"
                      className={handles.linkOption}
                      onClick={() => add(spell)}
                    >
                      <span className={handles.linkCircle}>
                        {spell.circle === 0 ? 'T' : spell.circle}
                      </span>
                      <span className={handles.linkName}>{spell.name}</span>
                      <span className={handles.linkOptionMeta}>
                        {[spell.school, spell.classes]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default SpellLinkList;
