'use client';

import { useMemo, useState } from 'react';
import type { ITalentChoice } from '@/lib/catalogChoice';
import { classSlug } from '@/db/l10n/classes';
import { requiredLevel } from '@/lib/talentPrerequisite';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import ChoiceTag from '../../ChoiceTag';
import TalentChoiceListHandles from './handles';
import '@/styles/components/talentChoiceList.scss';

interface IProps {
  choice: ITalentChoice;
}

const CLASS_FILTER = '__classe';

/**
 * A lista de talentos do catálogo quando a ficha está escolhendo um.
 *
 * Mostra os gerais e os da classe juntos (é o que a regra do jogo soma numa
 * vaga). Um talento que pede nível acima do personagem não aparece: a ficha
 * sabe o nível, então não há o que avisar, só o que esconder. Pré-requisito em
 * texto livre fica na descrição, como aviso.
 */
const TalentChoiceList = ({ choice }: IProps) => {
  const handles = useCssHandles(TalentChoiceListHandles);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const eligible = useMemo(
    () =>
      choice.options.filter(
        (o) => requiredLevel(o.prerequisites, choice.className) <= choice.level
      ),
    [choice.options, choice.className, choice.level]
  );

  const categories = useMemo(
    () =>
      [
        ...new Set(
          eligible
            .filter((o) => o.scope === 'general')
            .map((o) => o.category)
            .filter(Boolean)
        ),
      ].sort((a, b) => String(a).localeCompare(String(b), 'pt-BR')) as string[],
    [eligible]
  );

  const visible = useMemo(() => {
    const needle = classSlug(query);
    return eligible
      .filter((o) => !needle || classSlug(o.name).includes(needle))
      .filter((o) =>
        category === CLASS_FILTER
          ? o.scope === 'class'
          : !category || o.category === category
      )
      .sort(
        (a, b) =>
          Number(b.scope === 'class') - Number(a.scope === 'class') ||
          a.name.localeCompare(b.name, 'pt-BR')
      );
  }, [eligible, query, category]);

  const { open } = choice;
  // As vagas são as do nível `at`: o talento geral pede vaga geral; o da
  // classe serve nas duas.
  const noSlot = open.general + open.class === 0;
  const fits = (scope: 'general' | 'class') =>
    scope === 'general' ? open.general > 0 : open.general + open.class > 0;

  return (
    <div className={handles.talentPick}>
      <header className={handles.talentPickHead}>
        <h2 className={handles.talentPickTitle}>Talentos</h2>
        <p className={handles.talentPickLead}>
          {noSlot
            ? `Não há vaga livre no nível ${choice.at}: remova um talento na ficha para trocar.`
            : `Vaga do nível ${choice.at}: ${open.general} geral, ${open.class} só da classe. Um talento de ${choice.className || 'classe'} serve nas duas.`}
        </p>
      </header>

      <div className={handles.talentPickTools}>
        <input
          className={handles.talentPickSearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar talento pelo nome..."
          aria-label="Buscar talento pelo nome"
        />
        <select
          className={handles.talentPickSelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="">Todas as categorias</option>
          <option value={CLASS_FILTER}>Da classe</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <p className={handles.talentPickCount}>
        {`${visible.length} de ${eligible.length} talentos disponíveis para o nível ${choice.level}`}
      </p>

      <ul className={handles.talentPickList}>
        {visible.length === 0 && (
          <li className={handles.talentPickEmpty}>
            Nenhum talento encontrado.
          </li>
        )}
        {visible.map((option) => {
          const times = choice.taken[option.key] ?? 0;
          const repeated = times > 0 && !option.stackable;
          const blocked = repeated || !fits(option.scope);
          const isOpen = openKey === option.key;
          return (
            <li
              key={option.key}
              className={`${handles.talentPickItem}${
                isOpen
                  ? ` ${applyModifiers(handles.talentPickItem, 'open')}`
                  : ''
              }`}
            >
              <button
                type="button"
                className={handles.talentPickRow}
                aria-expanded={isOpen}
                onClick={() => setOpenKey(isOpen ? null : option.key)}
              >
                <span
                  className={`${handles.talentPickScope}${
                    option.scope === 'class'
                      ? ` ${applyModifiers(handles.talentPickScope, 'class')}`
                      : ''
                  }`}
                >
                  {option.scope === 'class' ? 'classe' : 'geral'}
                </span>
                <span className={handles.talentPickName}>{option.name}</span>
                <span className={handles.talentPickMeta}>
                  {option.scope === 'class'
                    ? (option.group ?? choice.className)
                    : option.category}
                </span>
                {times > 0 && (
                  <ChoiceTag kind="chosen">
                    {times > 1 ? `Escolhido ×${times}` : 'Escolhido'}
                  </ChoiceTag>
                )}
              </button>
              {isOpen && (
                <div className={handles.talentPickBody}>
                  {option.prerequisites && (
                    <p className={handles.talentPickPrereq}>
                      <b>Pré-requisito:</b> {option.prerequisites}
                    </p>
                  )}
                  <p className={handles.talentPickText}>
                    {option.description || 'Sem descrição.'}
                  </p>
                  <div className={handles.talentPickAct}>
                    <button
                      type="button"
                      disabled={blocked}
                      onClick={() => choice.onPick(option)}
                    >
                      {repeated
                        ? option.repeatForbiddenByClass
                          ? 'A classe não deixa repetir este talento'
                          : 'Este talento não se repete'
                        : !fits(option.scope)
                          ? `Sem vaga geral livre no nível ${choice.at}`
                          : `Escolher para o nível ${choice.at}`}
                    </button>
                    {option.stackable && times > 0 && (
                      <ChoiceTag kind="warn">pode se repetir</ChoiceTag>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TalentChoiceList;
