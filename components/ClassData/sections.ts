import type { ComponentType, SVGProps } from 'react';
import type ICharacterClass from '@/db/classes/class.d';
import { resolveCatalogIcon } from './catalogIcons';
import {
  HaloSwordIcon,
  ListIcon,
  ScrollIcon,
  ShieldIcon,
  SpellbookIcon,
  StarIcon,
  SunIcon,
  TableIcon,
} from '../Icons';

export interface ISectionNode {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  count: number;
  /** Plural do que `count` conta, para o rótulo acessível. */
  unit: string;
}

export const CATALOG_PREFIX = 'catalog:';

/**
 * As seções da classe: os nós da roda e, no modal, a linha de troca.
 *
 * Seção vazia só aparece para quem edita — é o que permite criar o primeiro
 * item. "Dados" saiu daqui: o que ele mostrava vive na própria página.
 */
export function buildSections(
  k: ICharacterClass,
  canEdit: boolean
): ISectionNode[] {
  const nodes: ISectionNode[] = [
    {
      id: 'progressao',
      label: 'Progressão',
      icon: TableIcon,
      count: k.levels?.length ?? 0,
      unit: 'níveis',
    },
  ];
  if ((k.features?.length ?? 0) > 0 || canEdit) {
    nodes.push({
      id: 'caracteristicas',
      label: 'Características',
      icon: ScrollIcon,
      count: k.features?.length ?? 0,
      unit: 'características',
    });
  }
  if ((k.archetypes?.length ?? 0) > 0 || canEdit) {
    nodes.push({
      id: 'arquetipos',
      label: 'Arquétipos',
      icon: ShieldIcon,
      count: k.archetypes?.length ?? 0,
      unit: 'arquétipos',
    });
  }
  if ((k.talents?.length ?? 0) > 0 || canEdit) {
    nodes.push({
      id: 'talentos',
      label: 'Talentos',
      icon: StarIcon,
      count: k.talents?.length ?? 0,
      unit: 'talentos',
    });
  }
  if ((k.divineOrders?.length ?? 0) > 0 || (k.domains?.length ?? 0) > 0) {
    nodes.push({
      id: 'dominios',
      label: 'Ordens & Domínios',
      icon: HaloSwordIcon,
      count: k.divineOrders?.length ?? 0,
      unit: 'ordens deíficas',
    });
  }
  for (const catalog of k.catalogs ?? []) {
    nodes.push({
      id: `${CATALOG_PREFIX}${catalog.slug}`,
      label: catalog.name,
      // O ícone escolhido vence; a heurística só cobre listas sem `icon`.
      icon: catalog.icon
        ? resolveCatalogIcon(catalog.icon)
        : catalog.slug === 'artes-divinas'
          ? SunIcon
          : // Lista de magias do grimório: todo item aponta para uma magia.
            (catalog.items?.length ?? 0) > 0 &&
              catalog.items!.every((item) => item.spell)
            ? SpellbookIcon
            : ListIcon,
      count:
        catalog.kind === 'relacao'
          ? (catalog.groupA?.entities?.length ?? 0) +
            (catalog.groupB?.entities?.length ?? 0)
          : (catalog.items?.length ?? 0),
      unit: catalog.kind === 'relacao' ? 'entidades' : 'itens',
    });
  }
  return nodes;
}
