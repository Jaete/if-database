'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { spellSlug } from '@/db/l10n/spells';
import Modal from '@/components/Modal';
import SpellPickerHandles from './handles';

/** O que o seletor precisa de uma magia. A ficha inteira vem só ao preparar. */
export interface ISpellOption {
  _id: string;
  name: string;
  circle: number;
  school?: string;
  classes?: string;
}

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  /** Classe do personagem: é dela que sai o que ele conhece. */
  classId: string;
  /** Círculo sendo preenchido. */
  circle: number;
  label: string;
  /** Ids já preparados, que aparecem marcados em vez de some da lista. */
  taken: ReadonlySet<string>;
  /** Quantas ainda cabem. Zero fecha a escolha, sem esconder o catálogo. */
  remaining: number;
  onPick: (spell: ISpellOption) => void;
}

/**
 * Escolhe uma magia preparada entre as que a classe conhece naquele círculo.
 *
 * Não existe "digitar o nome": numa ficha ligada à classe, o conjunto do que
 * se conhece é o grimório filtrado pela classe e pelo círculo, e deixar
 * escrever à mão produziria magia que não existe no sistema — exatamente o que
 * o vínculo com o grimório veio resolver.
 */
const SpellPicker = ({
  isOpen,
  onClose,
  classId,
  circle,
  label,
  taken,
  remaining,
  onPick,
}: IProps) => {
  const handles = useCssHandles(SpellPickerHandles);
  // Um catálogo por círculo, guardado por chave em vez de recarregado a cada
  // abertura: trocar de círculo e voltar é comum, e a lista não muda enquanto
  // a ficha está aberta.
  const [catalogs, setCatalogs] = useState<Record<string, ISpellOption[]>>({});
  const [query, setQuery] = useState('');

  const key = `${classId}:${circle}`;
  const catalog = catalogs[key] ?? null;

  // Buscado só quando o seletor abre: a maioria das visitas à ficha nem
  // encosta nas magias.
  useEffect(() => {
    if (!isOpen || catalogs[key]) return;
    let active = true;
    fetch(`/api/spells/options?classId=${classId}&circle=${circle}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setCatalogs((prev) => ({ ...prev, [key]: data }));
      })
      .catch(() => {
        if (active) setCatalogs((prev) => ({ ...prev, [key]: [] }));
      });
    return () => {
      active = false;
    };
  }, [isOpen, classId, circle, key, catalogs]);

  const close = () => {
    setQuery('');
    onClose();
  };

  const options = useMemo(() => {
    const needle = spellSlug(query);
    return (catalog ?? []).filter(
      (spell) => !needle || spellSlug(spell.name).includes(needle)
    );
  }, [catalog, query]);

  return (
    <Modal isOpen={isOpen} onClose={close} title={`Preparar — ${label}`}>
      {/* O Modal mantém o conteúdo montado quando fechado; sem esta guarda a
          busca e as opções continuariam tabuláveis por cima da ficha. */}
      {!isOpen ? null : (
        <div className={handles.sheetPicker}>
          <p className={handles.sheetPickerNote}>
            {remaining > 0
              ? `Você conhece todas estas. Ainda cabem ${remaining}.`
              : 'Nenhum espaço livre: desmarque uma magia para trocar.'}
          </p>
          <input
            className={handles.sheetPickerSearch}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pelo nome..."
            aria-label="Buscar magia pelo nome"
          />
          {catalog === null ? (
            <p className={handles.sheetPickerNote}>Carregando o grimório...</p>
          ) : (
            <ul className={handles.sheetPickerList}>
              {options.length === 0 && (
                <li className={handles.sheetPickerNote}>
                  {catalog.length === 0
                    ? 'A classe não tem nenhuma magia deste círculo no grimório.'
                    : 'Nenhuma magia com esse nome.'}
                </li>
              )}
              {options.map((spell) => {
                const already = taken.has(String(spell._id));
                return (
                  <li key={String(spell._id)}>
                    <button
                      type="button"
                      className={handles.sheetPickerOption}
                      disabled={already || remaining <= 0}
                      onClick={() => {
                        setQuery('');
                        onPick(spell);
                      }}
                    >
                      <span className={handles.sheetPickerName}>
                        {spell.name}
                      </span>
                      {already ? (
                        <span className={handles.sheetPickerTaken}>
                          preparada
                        </span>
                      ) : (
                        <span className={handles.sheetPickerMeta}>
                          {[spell.school, spell.classes]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SpellPicker;
