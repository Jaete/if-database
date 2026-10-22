'use client';

import { useCallback, useMemo, useState } from 'react';
import type ITalentDoc from '@/db/talents/talent.d';
import { classSlug } from '@/db/l10n/classes';

/**
 * Estado da página de talentos: a lista, a busca, o filtro de categoria e as
 * três escritas (criar, editar, importar).
 *
 * Mesma forma de `useSpellGrid`, pelo mesmo motivo: o `index.tsx` fica só com
 * a apresentação. O que muda é o filtro por categoria, que o grimório não tem.
 */
export function useTalentGrid(initialTalents: ITalentDoc[]) {
  // A lista inicial vem da página (servidor); a rede só é acionada depois de
  // uma escrita, que é um evento — e não dentro de um efeito.
  const [talents, setTalents] = useState<ITalentDoc[]>(initialTalents);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/talents');
      if (!res.ok) throw new Error('Falha ao carregar os talentos.');
      setTalents(await res.json());
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
    async (data: Partial<ITalentDoc>, existing?: ITalentDoc) => {
      // O slug acompanha o nome: sem isso, renomear descolaria a chave de
      // identidade e a próxima importação criaria um segundo talento.
      const body = JSON.stringify({
        ...data,
        slug: classSlug(data.name ?? ''),
      });
      const res = existing
        ? await fetch(`/api/talents/${existing.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body,
          })
        : await fetch('/api/talents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
      return report(res, existing ? 'Talento atualizado.' : 'Talento criado.');
    },
    [report]
  );

  const remove = useCallback(
    async (talent: ITalentDoc) => {
      const res = await fetch(`/api/talents/${talent.slug}`, {
        method: 'DELETE',
      });
      return report(res, `"${talent.name}" removido do catálogo.`);
    },
    [report]
  );

  const importTopic = useCallback(
    async (url: string) => {
      setFeedback({ text: 'Lendo o tópico do fórum...', isError: false });
      const res = await fetch('/api/talents/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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
        text: `${body.created} talento(s) novo(s) e ${body.updated} atualizado(s).`,
        isError: false,
      });
      await load();
      return true;
    },
    [load]
  );

  const categories = useMemo(
    () =>
      [...new Set(talents.map((t) => t.category).filter(Boolean))].sort(
        (a, b) => String(a).localeCompare(String(b), 'pt-BR')
      ) as string[],
    [talents]
  );

  const visible = useMemo(() => {
    const needle = classSlug(query);
    const found = talents.filter(
      (talent) =>
        (!needle || classSlug(talent.name).includes(needle)) &&
        (!category || talent.category === category)
    );
    // Só pelo nome, para a lista não mudar de ordem a cada importação.
    return [...found].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [talents, query, category]);

  return {
    talents,
    visible,
    categories,
    query,
    setQuery,
    category,
    setCategory,
    feedback,
    save,
    remove,
    importTopic,
  };
}
