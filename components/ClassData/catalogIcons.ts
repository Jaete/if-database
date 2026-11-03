import type { ComponentType, SVGProps } from 'react';
import {
  CoinIcon,
  DieIcon,
  HaloSwordIcon,
  ListIcon,
  MouseIcon,
  PaperDollIcon,
  ScrollIcon,
  ShieldIcon,
  SpellbookIcon,
  StarIcon,
  SunIcon,
  SwordIcon,
  TableIcon,
  TreeIcon,
} from '../Icons';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** Ícones que o criador de uma lista pode escolher, por slug gravado no banco. */
export const CATALOG_ICONS: Record<string, IconComponent> = {
  scroll: ScrollIcon,
  spellbook: SpellbookIcon,
  sun: SunIcon,
  shield: ShieldIcon,
  star: StarIcon,
  list: ListIcon,
  sword: SwordIcon,
  'halo-sword': HaloSwordIcon,
  die: DieIcon,
  tree: TreeIcon,
  coin: CoinIcon,
  'paper-doll': PaperDollIcon,
  mouse: MouseIcon,
  table: TableIcon,
};

const LABELS: Record<string, string> = {
  scroll: 'Pergaminho',
  spellbook: 'Livro',
  sun: 'Sol',
  shield: 'Escudo',
  star: 'Estrela',
  list: 'Lista',
  sword: 'Espada',
  'halo-sword': 'Espada com halo',
  die: 'Dado',
  tree: 'Árvore',
  coin: 'Moeda',
  'paper-doll': 'Boneco',
  mouse: 'Rato',
  table: 'Tabela',
};

export const CATALOG_ICON_ENTRIES = Object.entries(CATALOG_ICONS).map(
  ([slug, Icon]) => ({ slug, Icon, label: LABELS[slug] ?? slug })
);

/** O ícone do slug, ou `ListIcon` quando ele não existe. */
export function resolveCatalogIcon(slug?: string): IconComponent {
  return (slug && CATALOG_ICONS[slug]) || ListIcon;
}
