/** O que o X pediu para excluir, com o que dizer e o que fazer. */
export interface IRemoval {
  title: string;
  message: string;
  confirm: () => void;
}

/**
 * Tudo o que as seções do modal podem fazer com a classe. Índice -1 nos
 * `edit` acrescenta, na mesma convenção dos modais de edição.
 */
export interface ISectionActions {
  canEdit: boolean;
  /** Abre a confirmação de exclusão. */
  ask: (removal: IRemoval) => void;
  edit: {
    level: (index: number) => void;
    feature: (index: number) => void;
    archetype: (index: number) => void;
    archetypeFeature: (archetype: number, feature: number) => void;
    catalog: (index: number) => void;
    catalogItem: (catalog: number, item: number) => void;
    talent: (index: number) => void;
  };
  remove: {
    catalog: (index: number) => void;
    level: (index: number) => void;
    feature: (index: number) => void;
    archetype: (index: number) => void;
    archetypeFeature: (archetype: number, feature: number) => void;
    catalogItem: (catalog: number, item: number) => void;
    talent: (index: number) => void;
  };
}
