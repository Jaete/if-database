'use client';

import { useCallback, useMemo, useState } from 'react';
import type ISpell from '@/db/spells/spell.d';
import { spellSlug } from '@/db/l10n/spells';

/**
 * Estado do grimório: a lista, a busca e as três escritas (criar, editar,
 * importar).
 *
 * Extraído do componente porque é tudo efeito e rede; o `index.tsx` fica só
 * com a apresentação, como o CLAUDE.md pede para um organismo.
 */
export function useSpellGrid(initialSpells: ISpell[]) {
  // A lista inicial vem da página (servidor), como nas outras listagens deste
  // projeto. Buscá-la num efeito custaria um render a mais e esbarraria na
  // regra `react-hooks/set-state-in-effect`; aqui a rede só é acionada depois
  // de uma escrita, que é um evento.
  const [spells, setSpells] = useState<ISpell[]>(initialSpells);
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/spells');
      if (!res.ok) throw new Error('Falha ao carregar o grimório.');
      setSpells(await res.json());
    } catch (error) {
      setFeedback({
        text: error instanceof Error ? error.message : 'Erro ao carregar.',
        isError: true,
      });
    }
  }, []);

  const report = useCallback(
    async (res: Response, success: string) => {
      if (res.ok) {
        setFeedback({ text: success, isError: false });
        await load();
        return true;
      }
      const body = await res.json().catch(() => ({}));
      setFeedback({ text: body.error ?? 'Não deu certo.', isError: true });
      return false;
    },
    [load]
  );

  const save = useCallback(
    async (data: Partial<ISpell>, existing?: ISpell) => {
      const res = existing
        ? await fetch(`/api/spells/${existing.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            // O slug acompanha o nome: sem isso, renomear descolaria a chave
            // de identidade e a próxima importação criaria uma segunda magia.
            body: JSON.stringify({ ...data, slug: spellSlug(data.name ?? '') }),
          })
        : await fetch('/api/spells', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...data,
              slug: spellSlug(data.name ?? ''),
            }),
          });
      return report(res, existing ? 'Magia atualizada.' : 'Magia criada.');
    },
    [report]
  );

  const remove = useCallback(
    async (spell: ISpell) => {
      const res = await fetch(`/api/spells/${spell.slug}`, {
        method: 'DELETE',
      });
      return report(res, `"${spell.name}" removida do grimório.`);
    },
    [report]
  );

  const importTopic = useCallback(
    async (url: string, circle: number) => {
      setFeedback({ text: 'Lendo o tópico do fórum...', isError: false });
      const res = await fetch('/api/spells/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, circle }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setFeedback({
          text: body.error ?? 'Não consegui importar esse tópico.',
          isError: true,
        });
        return false;
      }
      const body = await res.json();
      setFeedback({
        // Círculo 0 é truque, e "no 0º círculo" não é como ninguém chama isso.
        text: `${body.created} magia(s) nova(s) e ${body.updated} atualizada(s) ${
          circle === 0 ? 'nos truques' : `no ${circle}º círculo`
        }.`,
        isError: false,
      });
      await load();
      return true;
    },
    [load]
  );

  const visible = useMemo(() => {
    const needle = spellSlug(query);
    const found = needle
      ? spells.filter((spell) => spellSlug(spell.name).includes(needle))
      : spells;
    // Sem ordenação por círculo nem categoria, como combinado: só o nome, para
    // a lista não mudar de ordem a cada importação.
    return [...found].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [spells, query]);

  return {
    spells,
    visible,
    query,
    setQuery,
    feedback,
    save,
    remove,
    importTopic,
  };
}
