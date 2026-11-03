import type { CatalogKind, IClassCatalog } from '@/db/classes/class.d';

/**
 * O tipo da lista, derivado para listas anteriores ao campo `kind`: se toda
 * item aponta para uma magia, ela é de magias. Sem itens e sem `kind`, fica
 * indefinida e se comporta como habilidades.
 */
export function effectiveKind(
  catalog?: IClassCatalog
): CatalogKind | undefined {
  if (!catalog) return undefined;
  if (catalog.kind) return catalog.kind;
  const items = catalog.items ?? [];
  return items.length > 0 && items.every((item) => item.spell)
    ? 'magias'
    : undefined;
}
