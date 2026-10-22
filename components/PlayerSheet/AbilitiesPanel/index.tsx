'use client';

import { useState } from 'react';
import { useCssHandles } from '@/hooks/useCssHandles';
import { EyeIcon, PencilIcon } from '../../Icons';
import Modal from '@/components/Modal';
import PromptModal from '@/components/PromptModal';
import { useEditing } from '../EditingContext';
import AbilitiesPanelHandles from './handles';

interface IAbility {
  name?: string;
  description?: string;
  /**
   * `'class'` marca o que a classe ligada concede, `'archetype'` o que vem do
   * arquétipo escolhido. Vem resolvido da leitura da ficha, não do documento:
   * aqui é só o que torna a entrada não-editável.
   */
  source?: 'class' | 'archetype';
  /** Nível da classe em que foi concedida. Só nas de `source`. */
  level?: number;
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

type Editing = { path: string; at: number; entry: IAbility } | null;

// Sem props: tudo o que a tela mostra vem do contexto de edição, que já
// sobrepõe o rascunho aos dados do jogador.
const AbilitiesPanel = () => {
  const handles = useCssHandles(AbilitiesPanelHandles);
  const [reading, setReading] = useState<IEntry | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  const { editable, objects, setField, value } = useEditing();
  const className = String(value('class') ?? '').trim();

  // Lido pelo contexto, e não direto do jogador, para a lista refletir o
  // rascunho enquanto não se salva.
  const listOf = (path: string) => objects<IAbility>(path);

  // O que vem do arquétipo sai das listas comuns: tem grupo próprio, onde é
  // escolhido e removido. Deixá-lo aqui o mostraria duas vezes.
  const entries: IEntry[] = SOURCES.flatMap(({ path, group }) =>
    listOf(path)
      .map((a, at): IEntry => ({ ...a, name: a?.name ?? '', group, path, at }))
      .filter((a) => a.name && a.source !== 'archetype')
  );

  // Em edição todos os grupos aparecem, mesmo vazios: sem a faixa do grupo não
  // haveria onde clicar para criar a primeira entrada dele.
  const groups = GROUPS.map((group) => ({
    group,
    entries: entries.filter((e) => e.group === group),
  })).filter((g) => editable || g.entries.length > 0);

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

  if (entries.length === 0 && !editable) {
    return <p className={handles.sheetEmpty}>Nenhuma habilidade registrada.</p>;
  }

  /** De onde a entrada vem, na voz da ficha: a classe ligada ou o grupo. */
  const kickerOf = (entry: IEntry) =>
    entry.source === 'class'
      ? `${className || 'Classe'}${entry.level ? ` · nível ${entry.level}` : ''}`
      : entry.group;

  const modals = (
    <>
      <Modal
        isOpen={reading !== null}
        onClose={() => setReading(null)}
        title={reading?.name}
      >
        {reading && (
          <div className={handles.sheetReader}>
            <span className={handles.sheetReaderKicker}>
              {kickerOf(reading)}
            </span>
            <p className={handles.sheetReaderText}>
              {reading.description || 'Sem descrição.'}
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

  return (
    <div className={handles.sheetMasterList} data-listnav>
      {groups.map(({ group, entries: list }) => (
        <div
          key={group}
          className={handles.sheetMasterGroup}
          role="group"
          aria-label={group}
        >
          <span className={handles.sheetCaption}>{group}</span>
          {list.map((entry) => (
            <div
              key={`${entry.path}:${entry.at}`}
              className={handles.sheetMasterRow}
            >
              <span className={handles.sheetMasterName}>
                {entry.name}
                {/* A origem aparece na própria lista: sem isso, a única
                    diferença visível entre o que a classe concede e o que foi
                    digitado seria a ausência do lápis, e só em modo edição. */}
                {entry.source === 'class' && (
                  <span className={handles.sheetMasterOrigin}>classe</span>
                )}
              </span>
              {/* O botão de ler é quem carrega o `data-opt`: é a ação da linha,
                  e é por ele que as setas do teclado andam pela lista. */}
              <button
                type="button"
                className={handles.sheetMasterRead}
                data-opt
                onClick={() => setReading(entry)}
                aria-label={`Ler ${entry.name}`}
              >
                <EyeIcon />
              </button>
              {editable && entry.source !== 'class' && (
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
          ))}
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
      {modals}
    </div>
  );
};

export default AbilitiesPanel;
