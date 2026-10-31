'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import type { ClassRole, IClassProficiencies } from '@/db/classes/class.d';
import { classSlug, type IClassFormSource } from '@/db/l10n/classes';

export interface IClassOption {
  _id: string;
  name: string;
  slug: string;
  hitDie?: string;
  isSpellcaster?: boolean;
  isUnique?: boolean;
  /** O que o card do seletor mostra. Todos vêm da projeção magra. */
  shortDescription?: string;
  roles?: ClassRole[];
  image?: string;
  hpAtFirstLevel?: string;
  hpPerLevel?: string;
  proficiencies?: IClassProficiencies;
  /** Quantas fichas de jogador estão vinculadas à classe. */
  playerCount?: number;
  /** Quem está com a classe única. Derivado do vínculo das fichas. */
  takenBy?: { id: string; name: string; slug: string };
}

/** A classe aberta no modal de edição: a linha da lista mais o documento. */
export type IClassEditTarget = IClassOption & IClassFormSource;

/**
 * Estado do códice de classes: a lista, a busca e as três escritas (criar,
 * importar, vincular magias).
 */
export function useClassGrid(initial: IClassOption[]) {
  // A lista inicial vem da página (servidor), como nas outras listagens deste
  // projeto: buscá-la num efeito custaria um render a mais e esbarraria na
  // regra `react-hooks/set-state-in-effect`.
  const [classes, setClasses] = useState<IClassOption[]>(initial);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // A barra de ferramentas encolhe assim que a página sai do topo: com ela
  // fixa, os rótulos dos três botões comem a largura que a busca precisa em
  // tela estreita. Começa sempre expandida para o HTML do servidor e o da
  // hidratação baterem — o primeiro evento de rolagem corrige.
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const reload = useCallback(async () => {
    const res = await fetch('/api/classes/options');
    if (res.ok) setClasses(await res.json());
  }, []);

  const fail = async (res: Response, fallback: string) => {
    const body = await res.json().catch(() => ({}));
    setFeedback({ text: body.error ?? fallback, isError: true });
  };

  const save = useCallback(
    async (data: Partial<ICharacterClass>, existing?: IClassOption) => {
      const slug = classSlug(data.name ?? '');
      const res = existing
        ? await fetch(`/api/classes/${existing.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, slug }),
          })
        : await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, slug }),
          });
      if (!res.ok) return fail(res, 'Não deu certo.');
      setFeedback({
        text: existing ? 'Classe atualizada.' : 'Classe criada.',
        isError: false,
      });
      await reload();
    },
    [reload]
  );

  /**
   * Busca a classe inteira antes de abrir o modal.
   *
   * A lista vem da projeção magra, sem descrição, PV nem variantes do nome —
   * abrir o modal só com ela mostrava esses campos vazios, e salvar apagava as
   * variantes.
   */
  const loadForEdit = useCallback(
    async (klass: IClassOption): Promise<IClassEditTarget | null> => {
      const res = await fetch(`/api/classes/${klass.slug}`);
      if (!res.ok) {
        await fail(res, 'Não consegui carregar a classe.');
        return null;
      }
      return { ...klass, ...(await res.json()) };
    },
    []
  );

  // A classe aberta por cima do seletor (clique no card em foco).
  const [viewing, setViewing] = useState<ICharacterClass | null>(null);

  const openClass = useCallback(async (klass: IClassOption) => {
    const res = await fetch(`/api/classes/${klass.slug}`);
    if (!res.ok) return fail(res, 'Não consegui abrir a classe.');
    setViewing(await res.json());
  }, []);

  const closeClass = useCallback(() => setViewing(null), []);

  // Enquanto a classe está aberta: a página atrás não rola, e o Esc fecha.
  useEffect(() => {
    if (!viewing) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // Um modal da própria classe (a roda, um editor) fica com o Esc.
      if (document.querySelector('.modal--open')) return;
      // Consumido aqui: no embed, o Esc não chega a fechar o modal do fórum.
      event.preventDefault();
      setViewing(null);
    };
    // Na captura, para rodar antes da ponte do embed.
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previous;
    };
  }, [viewing]);

  const remove = useCallback(
    async (klass: IClassOption) => {
      const res = await fetch(`/api/classes/${klass.slug}`, {
        method: 'DELETE',
      });
      if (!res.ok) return fail(res, 'Não deu certo.');
      setFeedback({ text: `"${klass.name}" removida.`, isError: false });
      await reload();
    },
    [reload]
  );

  const importTopic = useCallback(
    async (url: string) => {
      setBusy(true);
      setFeedback({ text: 'Lendo o tópico do fórum...', isError: false });
      const res = await fetch('/api/classes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      setBusy(false);
      if (!res.ok) return fail(res, 'Não consegui importar esse tópico.');
      const body = await res.json();
      const warn = body.warnings?.length ? ` — ${body.warnings[0]}` : '';
      setFeedback({
        text: `${body.name}: ${body.levels} níveis, ${body.features} características, ${body.talents} talentos.${warn}`,
        isError: false,
      });
      await reload();
    },
    [reload]
  );

  const linkSpells = useCallback(async () => {
    setBusy(true);
    const res = await fetch('/api/classes/link-spells', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    setBusy(false);
    if (!res.ok) return fail(res, 'Não consegui vincular.');
    const body = await res.json();
    const miss = body.unmatched
      ?.slice(0, 3)
      .map((u: { token: string; count: number }) => `${u.token} (${u.count})`)
      .join(', ');
    setFeedback({
      text: `${body.updated} magia(s) revinculada(s) de ${body.scanned}.${
        miss ? ` Sem classe: ${miss}.` : ''
      }`,
      isError: false,
    });
  }, []);

  const visible = useMemo(() => {
    const needle = classSlug(query);
    const found = needle
      ? classes.filter((k) => classSlug(k.name).includes(needle))
      : classes;
    return [...found].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [classes, query]);

  return {
    classes,
    visible,
    isCompact,
    query,
    setQuery,
    feedback,
    busy,
    save,
    loadForEdit,
    viewing,
    openClass,
    closeClass,
    remove,
    importTopic,
    linkSpells,
    reload,
  };
}
