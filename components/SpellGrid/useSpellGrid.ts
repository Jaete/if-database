'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type ISpell from '@/db/spells/spell.d';
import { spellSlug } from '@/db/l10n/spells';

// Quão abaixo do topo um grupo conta como "o que está à vista" no índice.
const SPY_OFFSET = 120;

const CIRCLES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export interface ISpellGroup {
  circle: number;
  spells: ISpell[];
}

/**
 * Estado do grimório: a lista agrupada por círculo, a busca, o índice, a magia
 * aberta no detalhe e as escritas (criar, editar, importar).
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
  // A magia aberta por cima da lista e a última que foi aberta (fica marcada
  // ao voltar). Guardar o slug, e não o documento, mantém o detalhe em dia
  // depois de uma edição.
  const [viewingSlug, setViewingSlug] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [classNames, setClassNames] = useState<Record<string, string> | null>(
    null
  );
  const [scrolledCircle, setScrolledCircle] = useState<number | null>(null);
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
      const ok = await report(
        res,
        existing ? 'Magia atualizada.' : 'Magia criada.'
      );
      // O slug acompanha o nome: sem isto, renomear fecharia o detalhe aberto.
      if (ok && existing && data.name) {
        const next = spellSlug(data.name);
        setViewingSlug((slug) => (slug === existing.slug ? next : slug));
        setCurrentSlug((slug) => (slug === existing.slug ? next : slug));
      }
      return ok;
    },
    [report]
  );

  const remove = useCallback(
    async (spell: ISpell) => {
      const res = await fetch(`/api/spells/${spell.slug}`, {
        method: 'DELETE',
      });
      const ok = await report(res, `"${spell.name}" removida do grimório.`);
      if (ok) {
        setViewingSlug((slug) => (slug === spell.slug ? null : slug));
        setCurrentSlug((slug) => (slug === spell.slug ? null : slug));
      }
      return ok;
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

  // Círculo e depois nome: o círculo é o que o jogador escolhe primeiro.
  const visible = useMemo(() => {
    const needle = spellSlug(query);
    const found = needle
      ? spells.filter((spell) => spellSlug(spell.name).includes(needle))
      : spells;
    return [...found].sort(
      (a, b) => a.circle - b.circle || a.name.localeCompare(b.name, 'pt-BR')
    );
  }, [spells, query]);

  // Só os círculos com resultado; durante a busca, a contagem é a filtrada.
  const groups = useMemo<ISpellGroup[]>(
    () =>
      CIRCLES.map((circle) => ({
        circle,
        spells: visible.filter((spell) => spell.circle === circle),
      })).filter((group) => group.spells.length > 0),
    [visible]
  );

  const viewing = useMemo(
    () => spells.find((spell) => spell.slug === viewingSlug) ?? null,
    [spells, viewingSlug]
  );

  // O grupo à vista é o último cujo topo já passou do limite; o índice marca
  // esse. Vale o primeiro quando a busca tirou o que estava marcado.
  const activeCircle =
    groups.find((group) => group.circle === scrolledCircle)?.circle ??
    groups[0]?.circle ??
    null;

  useEffect(() => {
    const update = () => {
      let active: number | null = null;
      for (const circle of CIRCLES) {
        const el = document.getElementById(`spellbook-group-${circle}`);
        if (el && el.getBoundingClientRect().top <= SPY_OFFSET) active = circle;
      }
      setScrolledCircle(active);
    };
    // Depois do render da busca, para medir a lista nova.
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, [groups]);

  const jumpToCircle = useCallback((circle: number) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.getElementById(`spellbook-group-${circle}`)?.scrollIntoView({
      behavior: reduced.matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  // O vínculo guarda ids; os chips precisam dos nomes. Busca uma vez, na
  // primeira abertura, e não no carregamento: a maioria das visitas à lista
  // nunca abre um detalhe.
  const loadClassNames = useCallback(async () => {
    try {
      const res = await fetch('/api/classes/options');
      if (!res.ok) return;
      const options: { _id: string; name: string }[] = await res.json();
      setClassNames(Object.fromEntries(options.map((o) => [o._id, o.name])));
    } catch {
      // Sem os nomes, o detalhe cai no texto do fórum.
    }
  }, []);

  const openSpell = useCallback(
    (spell: ISpell) => {
      setViewingSlug(spell.slug);
      setCurrentSlug(spell.slug);
      if (!classNames) void loadClassNames();
    },
    [classNames, loadClassNames]
  );

  const closeSpell = useCallback(() => {
    setViewingSlug(null);
    // A linha continua montada por baixo do detalhe: devolve o foco a ela.
    if (viewingSlug) {
      document
        .querySelector<HTMLElement>(`[data-slug="${CSS.escape(viewingSlug)}"]`)
        ?.focus({ preventScroll: true });
    }
  }, [viewingSlug]);

  // Enquanto a magia está aberta: a página atrás não rola, e o Esc fecha.
  useEffect(() => {
    if (!viewingSlug) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // O modal de edição fica com o Esc.
      if (document.querySelector('.modal--open')) return;
      // Consumido aqui: no embed, o Esc não chega a fechar o modal do fórum.
      event.preventDefault();
      closeSpell();
    };
    // Na captura, para rodar antes da ponte do embed.
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previous;
    };
  }, [viewingSlug, closeSpell]);

  return {
    spells,
    visible,
    groups,
    query,
    setQuery,
    activeCircle,
    jumpToCircle,
    viewing,
    currentSlug,
    classNames,
    openSpell,
    closeSpell,
    feedback,
    save,
    remove,
    importTopic,
  };
}
