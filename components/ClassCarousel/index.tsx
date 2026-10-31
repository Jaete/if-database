'use client';

import type { CSSProperties } from 'react';
import type { IClassOption } from '../ClassGrid/useClassGrid';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import ClassCard from '../ClassCard';
import { ChevronRightIcon } from '../Icons';
import { mod, useClassCarousel } from './useClassCarousel';
import ClassCarouselHandles from './handles';
import '@/styles/components/classCarousel.scss';

interface IProps {
  classes: IClassOption[];
  basePath: string;
  canEdit: boolean;
  onEdit: (klass: IClassOption) => void;
  /** Clique no card em foco: abre a classe por cima do seletor. */
  onOpen: (klass: IClassOption) => void;
}

const pad = (value: number) => String(value).padStart(2, '0');

// Losangos: uma janela fixa de 7 que acompanha o foco (o do meio é o atual,
// os de fora esmaecem). Com menos de 7 classes, um losango por classe.
/** Losangos visíveis de cada lado do atual. A janela mostra 2 × 3 + 1 = 7. */
const PIP_REACH = 3;
const PIP_WINDOW_SIZE = PIP_REACH * 2 + 1;

/**
 * O seletor: uma janela virtualizada de cards, o do centro em foco.
 *
 * Sem scroll nativo nem dependência de carrossel. O estado é `virtual`, um
 * inteiro sem limite; o card da posição `p` é `classes[mod(p, count)]` e só as
 * posições ao redor de `virtual` são renderizadas (`key` é a posição, não o
 * slug: com poucas classes a mesma aparece duas vezes). Cada card se
 * posiciona com `translate` relativo ao central, então avançar só anima os
 * que ficam e monta, já no lugar final e fora da tela, o que entra.
 */
const ClassCarousel = ({
  classes,
  basePath,
  canEdit,
  onEdit,
  onOpen,
}: IProps) => {
  const handles = useCssHandles(ClassCarouselHandles);
  const count = classes.length;
  const {
    trackRef,
    stageRef,
    reach,
    virtual,
    focused,
    dragging,
    goTo,
    go,
    onKeyDown,
    onFocus,
    onClickCapture,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onScroll,
  } = useClassCarousel(count);

  const current = classes[focused];
  const windowed = count >= PIP_WINDOW_SIZE;
  // Com poucas classes o trilho repete cards: só os que cobrem a lista a
  // partir do central são "originais"; os demais ficam fora da árvore de
  // acessibilidade.
  const lowest = -Math.floor((count - 1) / 2);
  const highest = lowest + count - 1;
  const items = Array.from({ length: reach * 2 + 1 }, (_, slot) => {
    const offset = slot - reach;
    const position = virtual + offset;
    return {
      position,
      offset,
      klass: classes[mod(position, count)],
      clone: offset < lowest || offset > highest,
    };
  });
  // Tira dos losangos: a janela de 7 mais um de buffer em cada ponta.
  const pips = Array.from({ length: PIP_WINDOW_SIZE + 2 }, (_, slot) => {
    return virtual - PIP_REACH - 1 + slot;
  });

  return (
    <div className={handles.pick}>
      <div ref={stageRef} className={handles.pickStage}>
        <button
          type="button"
          className={`${handles.pickArrow} ${applyModifiers(handles.pickArrow, 'prev')}`}
          onClick={() => go(-1)}
          disabled={count < 2}
          aria-label="Classe anterior"
        >
          <ChevronRightIcon />
        </button>
        <div
          ref={trackRef}
          className={`${handles.pickTrack}${
            dragging ? ` ${applyModifiers(handles.pickTrack, 'dragging')}` : ''
          }`}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Classes"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onClickCapture={onClickCapture}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onLostPointerCapture={onLostPointerCapture}
          onScroll={onScroll}
        >
          {items.map(({ position, offset, klass, clone }) => (
            <ClassCard
              key={position}
              klass={klass}
              index={mod(position, count)}
              total={count}
              focused={offset === 0}
              clone={clone}
              // Só o central e os vizinhos imediatos entram na ordem do Tab.
              dormant={Math.abs(offset) > 1}
              offset={offset}
              basePath={basePath}
              canEdit={canEdit}
              onEdit={onEdit}
              onCenter={() => goTo(position)}
              onOpen={onOpen}
            />
          ))}
        </div>
        <button
          type="button"
          className={`${handles.pickArrow} ${applyModifiers(handles.pickArrow, 'next')}`}
          onClick={() => go(1)}
          disabled={count < 2}
          aria-label="Próxima classe"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className={handles.pickPager}>
        <span className={handles.pickCount} aria-live="polite">
          <span className={handles.pickCarouselSrOnly}>{current?.name}, </span>
          <b className={handles.pickCountNumber}>{pad(focused + 1)}</b>
          {` / ${pad(count)}`}
        </span>
        <div
          className={`${handles.pickPips}${
            windowed ? ` ${applyModifiers(handles.pickPips, 'window')}` : ''
          }`}
          aria-hidden="true"
        >
          {windowed ? (
            // Uma tira virtual: cada losango fica em `left = posição × passo`
            // e a tira desliza `virtual` passos, sem nunca saltar. O destaque
            // é fixo no centro da janela (`.pickPips--window::after`) e a
            // tira passa por baixo; nenhum losango da tira é "aceso".
            <span
              className={`${handles.pickPipsReel} ${applyModifiers(handles.pickPipsReel, 'virtual')}`}
              style={
                {
                  '--pip-shift': virtual - PIP_REACH,
                } as CSSProperties
              }
            >
              {pips.map((position) => (
                <span
                  key={position}
                  className={`${handles.pickPip} ${applyModifiers(handles.pickPip, 'slide')}`}
                  style={{ '--pip-pos': position } as CSSProperties}
                />
              ))}
            </span>
          ) : (
            classes.map((klass, index) => (
              <span
                key={klass.slug}
                className={`${handles.pickPip}${
                  index === focused
                    ? ` ${applyModifiers(handles.pickPip, 'on')}`
                    : ''
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCarousel;
