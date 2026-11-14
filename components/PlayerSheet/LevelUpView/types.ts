import type { ILevelPlan } from '@/lib/levelUp';
import type { IDraft } from './useLevelDraft';

/** O que cada passo recebe: o plano do servidor, o rascunho e como mudá-lo. */
export interface IStepProps {
  plan: ILevelPlan;
  draft: IDraft;
  patch: (next: Partial<IDraft>) => void;
}
