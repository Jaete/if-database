import type { IRaceImage } from '@/db/races/race.d';

/**
 * Sorteia, entre as raças que têm capa, a que forra o topo da listagem.
 *
 * Fica fora do componente de página para o sorteio não contar como render
 * impuro: a página é dinâmica e sorteia uma vez por requisição.
 */
export function pickRandomCoverSlug(
  races: readonly { slug: string; images?: IRaceImage[] }[]
): string | undefined {
  const covered = races.filter((race) => race.images?.[0]?.url);
  if (covered.length === 0) return undefined;
  return covered[Math.floor(Math.random() * covered.length)].slug;
}
