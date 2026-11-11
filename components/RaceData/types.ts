import type { IRaceData } from '@/db/races/race.d';

/** A raça como a página a recebe: o documento sem os avisos do parser. */
export type IRaceView = Omit<IRaceData, 'warnings'>;

/** De onde vem a lista de habilidades que um editor mexe. */
export type TraitScope = 'race' | 'base' | 'sub';

/** Tudo o que a edição pede aos componentes de apresentação. */
export interface IRaceActions {
  canEdit: boolean;
  editIdentity: () => void;
  editTraits: () => void;
  editLore: () => void;
  editNotes: () => void;
  editSummary: () => void;
  addTrait: (scope: TraitScope) => void;
  editTrait: (scope: TraitScope, index: number) => void;
  deleteTrait: (scope: TraitScope, index: number) => void;
  moveTrait: (scope: TraitScope, index: number, step: -1 | 1) => void;
  addRule: () => void;
  editRule: (index: number) => void;
  deleteRule: (index: number) => void;
  addSub: () => void;
  editSubIdentity: () => void;
  editSubTraits: () => void;
  editSubLore: () => void;
  moveSub: (step: -1 | 1) => void;
  reimport: () => void;
  deleteRace: () => void;
}
