import { applyModifiers } from '@/hooks/useCssHandles';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Rola até um item da seção e o destaca com um brilho rápido.
 *
 * É o que a régua lateral faz ao clicar num nome: as seções com régua
 * (características, arquétipos) dividem o mesmo gesto. `itemClass` é o handle
 * do item; o brilho é o modificador `--flash` dele.
 */
export function flashTarget(
  container: HTMLElement | null,
  selector: string,
  itemClass: string
) {
  const target = container?.querySelector<HTMLElement>(selector);
  if (!target) return;
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  });
  const flashClass = applyModifiers(itemClass, 'flash');
  target.classList.remove(flashClass);
  // Força o reflow: sem ele, remover e readicionar no mesmo quadro não
  // reinicia a animação.
  void target.offsetWidth;
  target.classList.add(flashClass);
  target.addEventListener(
    'animationend',
    () => target.classList.remove(flashClass),
    { once: true }
  );
}
