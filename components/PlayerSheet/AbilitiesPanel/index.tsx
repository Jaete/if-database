'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { EyeIcon, PencilIcon } from '../../Icons';
import Modal from '@/components/Modal';
import DetailCard from '../DetailCard';
import { useSideReader } from '../useSideReader';
import PromptModal from '@/components/PromptModal';
import { useEditing } from '../EditingContext';
import { useCatalogRequest } from '../CatalogLayerContext';
import { useRaceChoice } from '../useRaceChoice';
import AbilitiesPanelHandles from './handles';

interface IAbility {
  name?: string;
  description?: string;
  /**
   * `'class'` marca o que a classe ligada concede, `'archetype'` o que vem do
   * arquétipo escolhido. Vem resolvido da leitura da ficha, não do documento:
   * aqui é só o que torna a entrada não-editável.
   */
  source?: 'class' | 'archetype' | 'race';
  /** Nível da classe em que foi concedida. Só nas de `source`. */
  level?: number;
  /** Só na racial: de onde veio, a regra do Mestiço e o rótulo da etiqueta. */
  origin?: string;
  via?: 'hybridHeritage' | 'dominantBlood';
  originTag?: string;
}

interface IEntry extends IAbility {
  name: string;
  group: string;
  /** Caminho do array de origem e posição nele, para saber o que regravar. */
  path: string;
  at: number;
}

/**
 * As seis listas que a tela exibe, na ordem, com o rótulo do grupo.
 *
 * `abilities` e `traits` dividem o mesmo rótulo porque sempre foram exibidos
 * juntos; só a gravação precisa distinguir os dois, e é para isso que cada
 * entrada carrega o próprio `path`.
 */
const SOURCES: readonly { path: string; group: string }[] = [
  { path: 'abilities', group: 'Características' },
  { path: 'traits', group: 'Características' },
  { path: 'actions', group: 'Ações' },
  { path: 'bonusActions', group: 'Ações bônus' },
  { path: 'reactions', group: 'Reações' },
  { path: 'legendaryActions', group: 'Ações lendárias' },
];

/** Para onde vai uma entrada nova de cada grupo. */
const ADD_PATH: Record<string, string> = {
  Características: 'abilities',
  Ações: 'actions',
  'Ações bônus': 'bonusActions',
  Reações: 'reactions',
  'Ações lendárias': 'legendaryActions',
};

const GROUPS = [...new Set(SOURCES.map((s) => s.group))];
const RACE_GROUP = 'Raça';

type Editing = { path: string; at: number; entry: IAbility } | null;

// Sem props: tudo o que a tela mostra vem do contexto de edição, que já
// sobrepõe o rascunho aos dados do jogador.
const AbilitiesPanel = () => {
  const handles = useCssHandles(AbilitiesPanelHandles);
  const reader = useSideReader<IEntry>();
  const [editing, setEditing] = useState<Editing>(null);
  const { editable, objects, setField, value } = useEditing();
  const catalog = useCatalogRequest();
  const { lineage, abilities: raceAbilities, freeText } = useRaceChoice();
  const className = String(value('class') ?? '').trim();
  const keyOf = (entry: IEntry) => `${entry.path}:${entry.at}`;

  // Lido pelo contexto, e não direto do jogador, para a lista refletir o
  // rascunho enquanto não se salva.
  const listOf = (path: string) => objects<IAbility>(path);

  // O que vem do arquétipo sai das listas comuns: tem grupo próprio, onde é
  // escolhido e removido. Deixá-lo aqui o mostraria duas vezes. O mesmo vale
  // para a raça, que tem o grupo dela no topo (ver `raceEntries`).
  const entries: IEntry[] = SOURCES.flatMap(({ path, group }) =>
    listOf(path)
      .map((a, at): IEntry => ({ ...a, name: a?.name ?? '', group, path, at }))
      .filter((a) => a.name && a.source !== 'archetype' && a.source !== 'race')
  );

  // As habilidades raciais vêm da raça escolhida (o rascunho, em edição) e não
  // se editam aqui: trocar a raça é que as troca.
  const raceEntries: IEntry[] = raceAbilities
    .filter((a) => a?.name)
    .map((a, at): IEntry => ({
      ...(a as IAbility),
      name: a.name ?? '',
      group: RACE_GROUP,
      path: 'race',
      at,
    }));
  const everyEntry = [...raceEntries, ...entries];

  // Em edição todos os grupos aparecem, mesmo vazios: sem a faixa do grupo não
  // haveria onde clicar para criar a primeira entrada dele.
  const groups = GROUPS.map((group) => ({
    group,
    entries: entries.filter((e) => e.group === group),
  })).filter((g) => editable || g.entries.length > 0);

  const shown =
    everyEntry.find((entry) => keyOf(entry) === reader.selectedKey) ??
    everyEntry[0];

  const write = (path: string, at: number, entry: IAbility | null) => {
    const list = listOf(path);
    setField(
      path,
      entry === null
        ? list.filter((_, i) => i !== at)
        : at < 0
          ? [...list, entry]
          : list.map((item, i) => (i === at ? { ...item, ...entry } : item))
    );
  };

  if (everyEntry.length === 0 && !editable) {
    return <p className={handles.sheetEmpty}>Nenhuma habilidade registrada.</p>;
  }

  /** De onde a entrada vem, na voz da ficha: a classe ligada ou o grupo. */
  const kickerOf = (entry: IEntry) =>
    entry.source === 'class'
      ? `${className || 'Classe'}${entry.level ? ` · nível ${entry.level}` : ''}`
      : entry.source === 'race'
        ? entry.via === 'dominantBlood'
          ? `Sangue Forte · ${entry.origin}`
          : entry.via === 'hybridHeritage'
            ? `Herança Híbrida · ${entry.origin}`
            : (entry.origin ?? 'Raça')
        : entry.group;

  const modals = (
    <>
      <Modal
        isOpen={reader.reading !== null}
        onClose={() => reader.setReading(null)}
        title={reader.reading?.name}
      >
        {reader.reading && (
          <div className={handles.sheetReader}>
            <span className={handles.sheetReaderKicker}>
              {kickerOf(reader.reading)}
            </span>
            <p className={handles.sheetReaderText}>
              {reader.reading.description || 'Sem descrição.'}
            </p>
          </div>
        )}
      </Modal>

      <PromptModal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={
          editing && editing.at >= 0 ? 'Editar habilidade' : 'Nova habilidade'
        }
        confirmLabel={editing && editing.at >= 0 ? 'Salvar' : 'Adicionar'}
        onDelete={
          editing && editing.at >= 0
            ? () => write(editing.path, editing.at, null)
            : undefined
        }
        fields={[
          {
            name: 'name',
            label: 'Nome da habilidade',
            initialValue: editing?.entry.name ?? '',
            placeholder: 'ex.: Traço: Olhar Além do Agora',
          },
          {
            name: 'description',
            label: 'Descrição',
            type: 'multiline',
            required: false,
            initialValue: editing?.entry.description ?? '',
            placeholder: 'O que a habilidade faz, e quando.',
          },
        ]}
        onSubmit={(values) => {
          if (!editing) return;
          write(editing.path, editing.at, {
            name: values.name,
            description: values.description || undefined,
          });
        }}
      />
    </>
  );

  const renderRow = (entry: IEntry) => {
    const key = keyOf(entry);
    return (
      <div
        key={key}
        className={handles.sheetMasterRow}
        data-current={key === (shown && keyOf(shown)) || undefined}
        onClick={() => reader.preview(key)}
        onMouseEnter={() => reader.preview(key)}
        onFocus={() => reader.preview(key)}
      >
        <span className={handles.sheetMasterName}>
          <span>
            {entry.name}
            {/* A origem aparece na própria lista: sem isso, a
                            única diferença visível entre o que a classe
                            concede e o que foi digitado seria a ausência do
                            lápis, e só em modo edição. */}
            {(entry.source === 'class' || entry.source === 'race') && (
              <span className={handles.sheetMasterOrigin}>
                {entry.source === 'race'
                  ? (entry.originTag ?? 'raça')
                  : 'classe'}
              </span>
            )}
          </span>
          {entry.description && (
            <span className={handles.sheetMasterSummary}>
              {entry.description}
            </span>
          )}
        </span>
        {/* O botão de ler é quem carrega o `data-opt`: é a ação da
                        linha, e é por ele que as setas do teclado andam pela
                        lista. */}
        <button
          type="button"
          className={handles.sheetMasterRead}
          data-opt
          onClick={() => reader.open(key, entry)}
          aria-label={`Ler ${entry.name}`}
        >
          <EyeIcon />
        </button>
        {editable && entry.source !== 'class' && entry.source !== 'race' && (
          <button
            type="button"
            className={handles.sheetMasterEdit}
            onClick={() =>
              setEditing({ path: entry.path, at: entry.at, entry })
            }
            aria-label={`Editar ${entry.name}`}
          >
            <PencilIcon />
          </button>
        )}
      </div>
    );
  };

  const raceGroup = lineage ? (
    <div className={handles.sheetMasterGroup} role="group" aria-label="Raça">
      <span className={handles.sheetCaption}>
        {`Raça · ${lineage.label} `}
        <a
          className={handles.sheetMasterGroupLink}
          href={`/embed/races/${lineage.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          página ›
        </a>
      </span>
      {raceEntries.map(renderRow)}
      {raceEntries.length === 0 && (
        <p className={handles.sheetEmpty}>
          Nenhuma habilidade ainda: a escolha da raça está incompleta.
        </p>
      )}
      {editable && (
        <div className={handles.sheetMasterNote}>
          <span>Estas vêm da raça e não se editam aqui.</span>
          <button type="button" onClick={() => catalog.open({ kind: 'race' })}>
            Trocar raça
          </button>
        </div>
      )}
    </div>
  ) : editable ? (
    <div className={handles.sheetMasterGroup} role="group" aria-label="Raça">
      <span className={handles.sheetCaption}>Raça</span>
      <div className={handles.sheetMasterNote}>
        <span>
          {freeText
            ? `A raça está em texto livre (${freeText}). Vincule-a ao códice para as habilidades raciais entrarem aqui.`
            : 'Vincule a raça ao códice para as habilidades raciais entrarem aqui.'}
        </span>
        <button type="button" onClick={() => catalog.open({ kind: 'race' })}>
          Vincular raça
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={handles.sheetMasterLayout}>
        <div className={handles.sheetMasterList} data-listnav>
          {raceGroup}
          {groups.map(({ group, entries: list }) => (
            <div
              key={group}
              className={handles.sheetMasterGroup}
              role="group"
              aria-label={group}
            >
              <span className={handles.sheetCaption}>{group}</span>
              {list.map(renderRow)}
              {editable && (
                <button
                  type="button"
                  className={handles.sheetMasterAdd}
                  onClick={() =>
                    setEditing({ path: ADD_PATH[group], at: -1, entry: {} })
                  }
                >
                  + Adicionar
                </button>
              )}
            </div>
          ))}
        </div>
        {shown && (
          <DetailCard
            id={reader.detailId}
            kicker={kickerOf(shown)}
            title={shown.name}
            text={shown.description}
          />
        )}
      </div>
      {modals}
    </>
  );
};

export default AbilitiesPanel;
