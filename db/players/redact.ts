import type IPlayer from './player';

/**
 * O que a leitura pública de uma ficha pode devolver.
 *
 * `creation` (método, rolagens) e `review` (observações da staff) nunca saem
 * por aqui. Uma ficha em branco ou em rascunho ainda não é de ninguém além da
 * dona e da staff: quem não é staff do app recebe só a identificação e o
 * estado, sem nome, raça ou classe.
 */
export function redactPlayer<T extends object>(doc: T, isStaff: boolean): T {
  const copy = { ...(doc as Record<string, unknown>) };
  delete copy.creation;
  delete copy.review;
  const status = (copy as { status?: string }).status;
  if (!isStaff && (status === 'blank' || status === 'draft')) {
    return {
      _id: copy._id,
      slug: copy.slug,
      status,
      ownerUsername: copy.ownerUsername,
    } as unknown as T;
  }
  return copy as T;
}

export type { IPlayer };
