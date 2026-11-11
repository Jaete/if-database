'use client';

import type { IRaceActions } from '../types';
import type { Editing } from '../useRaceEditor';
import type { useRaceData } from '../useRaceData';
import IdentityEditor from '../IdentityEditor';
import ReimportModal from '../ReimportModal';
import RuleEditor from '../RuleEditor';
import SummaryEditor from '../SummaryEditor';
import SubraceEditor from '../SubraceEditor';
import TextEditor from '../TextEditor';
import TraitEditor from '../TraitEditor';
import { LORE_FIELDS, TRAIT_FIELDS, paragraphs } from '../fields';
import { plural } from '@/lib/plural';
import type { IRemoval } from '../useRaceEditor';
import type { TraitScope } from '../types';

interface IProps {
  editing: Editing | null;
  data: ReturnType<typeof useRaceData>;
  actions: IRaceActions;
  onClose: () => void;
  onAskRemoval: (removal: IRemoval) => void;
  /** A arte do topo volta à primeira depois de editar as imagens. */
  onImagesSaved: () => void;
}

const WHERE: Record<TraitScope, (sub?: string) => string> = {
  race: () => 'comum a todas as sub-raças',
  base: () => 'só da raça base',
  sub: (sub) => `de ${sub ?? 'sub-raça'}`,
};

/** Abre o editor certo para o que `useRaceEditor` marcou como em edição. */
const EditorHost = ({
  editing,
  data,
  actions,
  onClose: close,
  onAskRemoval: setRemoving,
  onImagesSaved,
}: IProps) => {
  const { race, sub } = data;
  const toValues = (source: object, names: readonly string[]) =>
    Object.fromEntries(
      names.map((n) => [
        n,
        (source as Record<string, string | undefined>)[n] ?? '',
      ])
    );

  /** O patch de um bloco de texto; vazio vira campo ausente na sub-raça. */
  const textPatch = (
    names: readonly string[],
    values: Record<string, string>
  ) => Object.fromEntries(names.map((n) => [n, values[n] ?? '']));

  const saveSubText = (
    names: readonly string[],
    values: Record<string, string>,
    message: string
  ) => {
    if (!sub) return Promise.resolve(false);
    const next = { ...sub } as Record<string, unknown>;
    for (const n of names) {
      if (values[n]) next[n] = values[n];
      else delete next[n];
    }
    return data.replaceSub(next as unknown as typeof sub, message);
  };

  const traitNames = TRAIT_FIELDS.map((f) => f.name);
  const loreNames = LORE_FIELDS.map((f) => f.name);

  if (!editing) return null;
  switch (editing.kind) {
    case 'identity':
      return (
        <IdentityEditor
          race={race}
          error={data.error}
          onClose={close}
          onSave={(patch) => {
            onImagesSaved();
            return data.save(patch, 'Identidade e arte salvas.');
          }}
        />
      );
    case 'summary':
      return (
        <SummaryEditor
          race={race}
          error={data.error}
          onClose={close}
          onSave={(summary) => data.save({ summary }, 'Resumo salvo.')}
        />
      );
    case 'traits':
      return (
        <TextEditor
          title="Traços da raça"
          fields={TRAIT_FIELDS.map((f) => ({
            ...f,
            placeholder: 'Frase inteira, como no tópico',
          }))}
          values={toValues(race, traitNames)}
          error={data.error}
          onClose={close}
          onSave={(values) =>
            data.save(textPatch(traitNames, values), 'Traços salvos.')
          }
        />
      );
    case 'lore':
      return (
        <TextEditor
          title="Crônica da raça"
          fields={LORE_FIELDS.map((f) => ({
            ...f,
            rows: 6,
            hint: 'Uma linha em branco separa os parágrafos.',
          }))}
          values={toValues(race, loreNames)}
          error={data.error}
          onClose={close}
          onSave={(values) =>
            data.save(textPatch(loreNames, values), 'Crônica salva.')
          }
        />
      );
    case 'notes':
      return (
        <TextEditor
          title="Notas de introdução"
          wide={false}
          fields={[
            {
              name: 'notes',
              label: 'Notas',
              rows: 6,
              hint: 'Texto solto que abre a seção de habilidades. Uma linha em branco separa as notas.',
            },
          ]}
          values={{ notes: (race.notes ?? []).join('\n\n') }}
          error={data.error}
          onClose={close}
          onSave={(values) =>
            data.save({ notes: paragraphs(values.notes) }, 'Notas salvas.')
          }
        />
      );
    case 'trait': {
      const list = data.traitsOf(editing.scope);
      const index = editing.index;
      return (
        <TraitEditor
          trait={index === null ? null : (list[index] ?? null)}
          where={WHERE[editing.scope](sub?.name)}
          error={data.error}
          onClose={close}
          onSave={(trait) =>
            data.saveTraits(
              editing.scope,
              index === null
                ? [...list, trait]
                : list.map((t, i) => (i === index ? trait : t)),
              index === null ? 'Habilidade adicionada.' : 'Habilidade salva.'
            )
          }
          onDelete={
            index === null
              ? undefined
              : () => {
                  close();
                  actions.deleteTrait(editing.scope, index);
                }
          }
        />
      );
    }
    case 'rule': {
      const rules = race.choiceRules ?? [];
      const index = editing.index;
      return (
        <RuleEditor
          rule={index === null ? null : (rules[index] ?? null)}
          error={data.error}
          onClose={close}
          onSave={(rule) =>
            data.saveRules(
              index === null
                ? [...rules, rule]
                : rules.map((r, i) => (i === index ? rule : r)),
              'Regra salva.'
            )
          }
          onDelete={
            index === null
              ? undefined
              : () => {
                  close();
                  actions.deleteRule(index);
                }
          }
        />
      );
    }
    case 'sub': {
      const target = editing.isNew ? null : (sub ?? null);
      return (
        <SubraceEditor
          sub={target}
          groups={[
            ...new Set(
              race.subraces.map((s) => s.group).filter((g): g is string => !!g)
            ),
          ]}
          takenSlugs={race.subraces.map((s) => s.slug)}
          error={data.error}
          onClose={close}
          onSave={(next) =>
            target
              ? data.replaceSub(next, 'Sub-raça salva.')
              : data.addSub(next)
          }
          onDelete={
            target
              ? () => {
                  close();
                  setRemoving({
                    title: 'Excluir sub-raça',
                    message: `Excluir ${target.name} e ${plural(target.traits.length, 'habilidade', 'habilidades')} dela? Não dá para desfazer.`,
                    confirmLabel: 'Excluir sub-raça',
                    confirm: () => data.removeSub(),
                  });
                }
              : undefined
          }
        />
      );
    }
    case 'subTraits':
      if (!sub) return null;
      return (
        <TextEditor
          title={`Traços de ${sub.name}`}
          lead="Preencha só o que esta sub-raça muda. Campo vazio herda o da raça."
          fields={TRAIT_FIELDS}
          values={toValues(sub, traitNames)}
          inheritFrom={toValues(race, traitNames)}
          error={data.error}
          onClose={close}
          onSave={(values) => saveSubText(traitNames, values, 'Traços salvos.')}
        />
      );
    case 'subLore':
      if (!sub) return null;
      return (
        <TextEditor
          title={`Crônica de ${sub.name}`}
          lead="A crônica da sub-raça não herda: vazio só esconde o bloco."
          fields={LORE_FIELDS.map((f) => ({
            ...f,
            rows: 6,
            hint: 'Uma linha em branco separa os parágrafos.',
          }))}
          values={toValues(sub, loreNames)}
          error={data.error}
          onClose={close}
          onSave={(values) => saveSubText(loreNames, values, 'Crônica salva.')}
        />
      );
    case 'reimport':
      return (
        <ReimportModal
          race={race}
          onClose={close}
          onDone={(warnings) => data.reload(warnings)}
        />
      );
  }
};

export default EditorHost;
