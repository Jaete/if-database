'use client';

import type { IClassOption } from '../ClassGrid/useClassGrid';
import { applyModifiers, useCssHandles } from '@/hooks/useCssHandles';
import ClassCard from '../ClassCard';
import { ChevronRightIcon } from '../Icons';
import { useClassCarousel } from './useClassCarousel';
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

/**
 * O seletor: um trilho de cards com scroll-snap, o do centro em foco.
 *
 * Sem dependência de carrossel — o snap nativo faz o swipe no toque, e este
 * componente só acrescenta setas, teclado e a noção de "card em foco".
 */
const ClassCarousel = ({
  classes,
  basePath,
  canEdit,
  onEdit,
  onOpen,
}: IProps) => {
  const handles = useCssHandles(ClassCarouselHandles);
  const {
    trackRef,
    focused,
    center,
    onScroll,
    onScrollEnd,
    onKeyDown,
    onFocus,
    onPointerDown,
    onPointerEnd,
  } = useClassCarousel(classes.length);

  const current = classes[focused];

  return (
    <div className={handles.pick}>
      <div className={handles.pickStage}>
        <button
          type="button"
          className={`${handles.pickArrow} ${applyModifiers(handles.pickArrow, 'prev')}`}
          onClick={() => center(focused - 1)}
          disabled={focused <= 0}
          aria-label="Classe anterior"
        >
          <ChevronRightIcon />
        </button>
        <div
          ref={trackRef}
          className={handles.pickTrack}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Classes"
          tabIndex={0}
          onScroll={onScroll}
          onScrollEnd={onScrollEnd}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {classes.map((klass, index) => (
            <ClassCard
              key={klass.slug}
              klass={klass}
              index={index}
              total={classes.length}
              focused={index === focused}
              basePath={basePath}
              canEdit={canEdit}
              onEdit={onEdit}
              onCenter={center}
              onOpen={onOpen}
            />
          ))}
        </div>
        <button
          type="button"
          className={`${handles.pickArrow} ${applyModifiers(handles.pickArrow, 'next')}`}
          onClick={() => center(focused + 1)}
          disabled={focused >= classes.length - 1}
          aria-label="Próxima classe"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className={handles.pickPager}>
        <span className={handles.pickCount} aria-live="polite">
          <span className={handles.pickCarouselSrOnly}>{current?.name}, </span>
          <b className={handles.pickCountNumber}>{pad(focused + 1)}</b>
          {` / ${pad(classes.length)}`}
        </span>
        <div className={handles.pickPips} aria-hidden="true">
          {classes.map((klass, index) => (
            <span
              key={klass.slug}
              className={`${handles.pickPip}${
                index === focused
                  ? ` ${applyModifiers(handles.pickPip, 'on')}`
                  : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassCarousel;
