'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type UIEvent,
} from 'react';

/** Cards renderizados de cada lado do central, antes de medir o palco. */
const DEFAULT_REACH = 3;
/** Teto: com poucas classes o trilho repete cards, e mais que isso é desperdício. */
const MAX_REACH = 6;
/** Arrasto mínimo (px) para decidir o eixo, e para o toque virar arrasto. */
const AXIS_SLOP = 8;
/** Soltar além disto (px ou fração do passo, o maior) avança um card. */
const FLICK_MIN_DISTANCE = 40;
const FLICK_STEP_FRACTION = 0.15;
/** Ou soltar com esta velocidade (px/ms), mesmo com pouca distância. */
const FLICK_MIN_VELOCITY = 0.4;
/** Roda horizontal: deslocamento acumulado para um passo, e a pausa que encerra o gesto. */
const WHEEL_THRESHOLD = 40;
const WHEEL_QUIET_MS = 250;
/** Saltos de mais de 1 card viram um voo de passos de 1, até este teto. */
const STEPPER_INTERVAL_MS = 80;
const STEPPER_MAX_STEPS = 8;
/** O clique que sobra de um arrasto só é suprimido durante esta janela. */
const SUPPRESS_CLICK_MS = 100;

export const mod = (value: number, size: number) =>
  ((value % size) + size) % size;

interface IDrag {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  active: boolean;
}

/**
 * O trilho do seletor: uma janela virtualizada movida por transform.
 *
 * `virtual` é um inteiro sem limite (pode ser negativo) e o card da posição
 * `p` é `classes[mod(p, count)]`. Só as posições de `virtual - reach` a
 * `virtual + reach` existem no DOM; o resto da lista nunca é renderizado. Não
 * há scroll nativo: setas, teclado, roda e arrasto só mudam `virtual` (cada
 * gesto, em exatamente 1), e o CSS anima o `translate` de cada card.
 */
export function useClassCarousel(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const dragRef = useRef<IDrag | null>(null);
  const pointerRef = useRef(false);
  const skipFocusRef = useRef(false);
  const focusAfterRef = useRef(false);
  const suppressClickRef = useRef(false);
  const wheelRef = useRef({ accum: 0, locked: false, timer: 0 });
  // A posição virtual como verdade síncrona: o stepper e os gestos rápidos
  // precisam do valor mais recente, não do último render.
  const virtualRef = useRef(0);
  const stepperRef = useRef(0);
  const steppingRef = useRef(false);
  const suppressTimerRef = useRef(0);

  const [virtual, setVirtual] = useState(0);
  const [measuredReach, setMeasuredReach] = useState(DEFAULT_REACH);
  const [dragging, setDragging] = useState(false);

  const reach = count > 1 ? measuredReach : 0;
  const focused = count > 0 ? mod(virtual, count) : 0;

  const apply = (next: number) => {
    virtualRef.current = next;
    setVirtual(next);
  };

  const cancelStepper = () => {
    window.clearTimeout(stepperRef.current);
    steppingRef.current = false;
  };

  // Anda `delta` cards. Mais de 1 vira um voo de passos de 1 (a transição
  // re-mira a cada passo, sem pop-in), cancelável por qualquer novo input;
  // acima do teto, ou com movimento reduzido, a troca é direta.
  const move = (delta: number) => {
    cancelStepper();
    if (count < 2 || delta === 0) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (
      Math.abs(delta) === 1 ||
      Math.abs(delta) > STEPPER_MAX_STEPS ||
      reduced
    ) {
      apply(virtualRef.current + delta);
      return;
    }
    const direction = Math.sign(delta);
    let remaining = Math.abs(delta);
    steppingRef.current = true;
    const tick = () => {
      remaining -= 1;
      if (remaining === 0) steppingRef.current = false;
      apply(virtualRef.current + direction);
      if (remaining > 0) {
        stepperRef.current = window.setTimeout(tick, STEPPER_INTERVAL_MS);
      }
    };
    tick();
  };

  const go = (delta: number) => move(delta);

  // Vai para a posição virtual `position` (clique num vizinho, Tab).
  const goTo = (position: number) => move(position - virtualRef.current);

  // Para um índice da lista, pelo caminho mais curto. Devolve o delta.
  const goToIndex = (index: number) => {
    if (count < 2) return 0;
    let delta = mod(index - mod(virtualRef.current, count), count);
    if (delta > count / 2) delta -= count;
    move(delta);
    return delta;
  };

  // Mede o palco: quantos cards cabem de cada lado do central, mais um de
  // buffer fora da tela. O passo (card + vão) é lido do DOM, já resolvido em px.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const measure = () => {
      const card = track.firstElementChild as HTMLElement | null;
      if (!card) return;
      const width = card.offsetWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      if (!width) return;
      stepRef.current = width + gap;
      const visibleSide = Math.ceil(
        (stage.clientWidth / 2 - width / 2) / (width + gap)
      );
      setMeasuredReach(Math.min(MAX_REACH, Math.max(1, visibleSide + 1)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count]);

  // O foco do teclado acompanha o card central, depois que ele chega ao DOM.
  useEffect(() => {
    // Num voo de vários passos o foco só vai no último.
    if (!focusAfterRef.current || steppingRef.current) return;
    focusAfterRef.current = false;
    const center = trackRef.current?.children[reach];
    skipFocusRef.current = true;
    center?.querySelector('a')?.focus({ preventScroll: true });
    skipFocusRef.current = false;
  }, [virtual, reach]);

  // Soltar fora do trilho (ou um cancelamento) também encerra o toque.
  useEffect(() => {
    const release = () => {
      pointerRef.current = false;
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.clearTimeout(stepperRef.current);
      window.clearTimeout(suppressTimerRef.current);
    };
  }, []);

  // Roda/trackpad horizontal: 1 passo por gesto. Precisa de ouvinte nativo
  // não passivo para poder impedir o "voltar" do navegador.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;
    const wheel = wheelRef.current;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.clearTimeout(wheel.timer);
      wheel.timer = window.setTimeout(() => {
        wheel.accum = 0;
        wheel.locked = false;
      }, WHEEL_QUIET_MS);
      if (wheel.locked) return;
      // Firefox manda linhas (1) ou páginas (2), não pixels.
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? track.clientWidth
            : 1;
      wheel.accum += event.deltaX * unit;
      if (Math.abs(wheel.accum) >= WHEEL_THRESHOLD) {
        cancelStepper();
        apply(virtualRef.current + Math.sign(wheel.accum));
        wheel.locked = true;
      }
    };
    track.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      track.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheel.timer);
    };
  }, [count]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (count < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
    let moved = true;
    switch (event.key) {
      case 'ArrowLeft':
        go(-1);
        break;
      case 'ArrowRight':
        go(1);
        break;
      case 'Home':
        moved = goToIndex(0) !== 0;
        break;
      case 'End':
        moved = goToIndex(count - 1) !== 0;
        break;
      default:
        return;
    }
    event.preventDefault();
    if (moved) focusAfterRef.current = true;
  };

  // Tab para um card fora do centro o centraliza, senão o foco cairia num
  // card meio cortado pela máscara.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || pointerRef.current || skipFocusRef.current) return;
    const card = (event.target as HTMLElement).closest('article');
    if (!card) return;
    const offset = Array.prototype.indexOf.call(track.children, card) - reach;
    if (offset !== 0) goTo(virtual + offset);
  };

  // Um arrasto não é clique: não abre o overlay nem navega.
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const setDrag = (dx: number) =>
    trackRef.current?.style.setProperty('--pick-drag', `${dx}px`);

  const endDrag = () => {
    dragRef.current = null;
    setDrag(0);
    setDragging(false);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerRef.current = true;
    suppressClickRef.current = false;
    // Um segundo dedo não reinicia o arrasto em curso.
    if (!event.isPrimary || dragRef.current) return;
    // Só toque e caneta arrastam: o mouse mantém a seleção de texto do card.
    if (count < 2 || event.pointerType === 'mouse') return;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      active: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_SLOP) return;
      // Movimento inicial vertical: a página rola, o gesto não é nosso.
      if (Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }
      drag.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    const elapsed = event.timeStamp - drag.lastTime;
    if (elapsed > 0) {
      drag.velocity = (event.clientX - drag.lastX) / elapsed;
      drag.lastX = event.clientX;
      drag.lastTime = event.timeStamp;
    }
    // O trilho segue o dedo, no máximo um passo para cada lado.
    const limit = stepRef.current || Infinity;
    setDrag(Math.max(-limit, Math.min(limit, dx)));
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointerRef.current = false;
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    if (!drag.active) {
      dragRef.current = null;
      return;
    }
    const dx = event.clientX - drag.startX;
    const threshold = Math.max(
      FLICK_MIN_DISTANCE,
      stepRef.current * FLICK_STEP_FRACTION
    );
    const fast = Math.abs(drag.velocity) > FLICK_MIN_VELOCITY;
    const direction = Math.sign(
      fast && Math.abs(dx) < threshold ? drag.velocity : dx
    );
    suppressClickRef.current = Math.abs(dx) > AXIS_SLOP;
    window.clearTimeout(suppressTimerRef.current);
    suppressTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
    }, SUPPRESS_CLICK_MS);
    endDrag();
    if (direction !== 0 && (Math.abs(dx) > threshold || fast)) {
      // Arrastar para a esquerda traz o próximo.
      go(-direction);
    }
  };

  // A captura se perdeu sem soltar (o navegador tomou o gesto): volta ao atual.
  // No toque, o ponteiro já nasce capturado pelo elemento sob o dedo; ao
  // capturá-lo no trilho, esse `lostpointercapture` borbulha até aqui e
  // encerrava o arrasto no primeiro movimento. Só vale o evento do próprio
  // trilho.
  const onLostPointerCapture = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (dragRef.current?.active) endDrag();
  };

  // Rede contra o scroll do trilho (foco, script): ele nunca deve rolar.
  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    if (event.currentTarget.scrollLeft !== 0)
      event.currentTarget.scrollLeft = 0;
  };

  const onPointerCancel = () => {
    pointerRef.current = false;
    if (dragRef.current?.active) endDrag();
    else dragRef.current = null;
  };

  return {
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
  };
}
