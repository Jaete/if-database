'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { CatalogRequest } from './types';
import { useCssHandles } from '@/hooks/useCssHandles';
import ClassData from '../../ClassData';
import ClassGrid from '../../ClassGrid';
import RaceData from '../../RaceData';
import RaceGrid from '../../RaceGrid';
import SpellGrid from '../../SpellGrid';
import TalentGrid from '../../TalentGrid';
import ChoiceBar from './ChoiceBar';
import Tray from './Tray';
import { useCatalogLayerState } from './useCatalogLayer';
import CatalogLayerHandles from './handles';
import '@/styles/components/sheetCodex.scss';

interface IProps {
  request: CatalogRequest;
  onClose: () => void;
}

/**
 * A camada de escolha: um quadro cheio, por cima da ficha e dentro do iframe,
 * que monta o catálogo de verdade (raças, classes, grimório, talentos) em modo
 * escolha. Não é um modal: o Esc volta uma tela e, na raiz, volta à ficha.
 *
 * O corpo é um bloco de contenção (`contain`), de modo que as camadas
 * `position: fixed` dos catálogos (a classe aberta, o detalhe da magia, os
 * modais) ficam presas a ele, entre a barra e a bandeja.
 */
const CatalogLayer = ({ request, onClose }: IProps) => {
  const handles = useCssHandles(CatalogLayerHandles);
  const state = useCatalogLayerState(request, onClose);
  const { stack, tray } = state;
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const leave = () => (tray.changed ? setLeaving(true) : onClose());
  const back = () => {
    if (stack.length > 1) state.pop();
    else leave();
  };

  // O foco entra na camada e volta para a ficha ao sair. O Esc volta uma tela.
  const backRef = useRef(back);
  useEffect(() => {
    backRef.current = back;
  });
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = rootRef.current;
    root?.focus({ preventScroll: true });
    // Armadilha de foco: o resto da ficha (menu, painel, cabeçalho) fica inerte
    // enquanto a camada está aberta, e volta ao fechar.
    const inerted = Array.from(root?.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el !== root && el instanceof HTMLElement
    );
    for (const el of inerted) {
      el.inert = true;
      el.setAttribute('aria-hidden', 'true');
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      // Um modal ou um detalhe do próprio catálogo (a roda da classe, um
      // aviso) fica com o Esc.
      if (document.querySelector('.modal--open')) return;
      event.preventDefault();
      backRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      for (const el of inerted) {
        el.inert = false;
        el.removeAttribute('aria-hidden');
      }
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  const renderBody = () => {
    if (state.failed) {
      return (
        <p className={handles.sheetCodexLoading}>
          Não foi possível carregar o catálogo. Volte à ficha e tente de novo.
        </p>
      );
    }
    const loading = (
      <p className={handles.sheetCodexLoading}>Carregando o catálogo...</p>
    );

    if (request.kind === 'race') {
      if (!state.raceCatalog || !state.raceChoice) return loading;
      const options = state.raceCatalog.map((r) => ({
        name: r.name,
        slug: r.slug,
        unique: r.unique,
        images: r.images,
        abilityScoreIncrease: r.abilityScoreIncrease,
        subraces: r.subraces.map((s) => ({ name: s.name })),
      }));
      if (state.top.slug) {
        const view = state.raceViews[state.top.slug];
        if (!view) return loading;
        return (
          <RaceData
            key={state.top.id}
            race={view}
            readOnly
            choice={state.raceChoice}
          />
        );
      }
      return <RaceGrid races={options} readOnly choice={state.raceChoice} />;
    }

    if (request.kind === 'class') {
      if (!state.classOptions) return loading;
      return (
        <ClassGrid
          initialClasses={state.classOptions}
          readOnly
          choice={state.classChoice}
        />
      );
    }

    if (request.kind === 'archetype') {
      if (!state.classDoc) return loading;
      return (
        <ClassData
          characterClass={state.classDoc}
          readOnly
          choice={state.archetypeChoice}
          onBack={back}
        />
      );
    }

    if (request.kind === 'spells') {
      if (!state.spellsReady || !state.spells) return loading;
      return (
        <SpellGrid
          initialSpells={state.spells}
          readOnly
          choice={state.spellChoice}
        />
      );
    }

    if (!state.talentChoice) return loading;
    return (
      <TalentGrid initialTalents={[]} readOnly choice={state.talentChoice} />
    );
  };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className={handles.sheetCodex}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      // Lido pelo EmbedCloseBridge: com a camada aberta o Esc não fecha o
      // modal do fórum, e o X dele dá lugar à barra da camada.
      data-inner-open
    >
      <ChoiceBar
        labelId={labelId}
        playerName={state.playerName}
        title={state.title}
        stack={stack}
        onBack={back}
        onLeave={leave}
      />
      <div className={handles.sheetCodexBody}>{renderBody()}</div>
      <Tray
        tray={tray}
        leaving={leaving}
        onUndo={state.undo}
        onApply={state.apply}
        onConfirmRemoval={state.confirmRemoval}
        onKeep={() => setLeaving(false)}
        onDiscardAndLeave={onClose}
      />
    </div>
  );
};

export default CatalogLayer;
