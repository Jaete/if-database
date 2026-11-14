'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { IPublicPlayer } from '@/db/players/publicFields';
import type { IDraftBody } from '@/services/creation.service';
import type { getCreation, rollAttributes } from '@/services/creation.service';
import type { CreationStep, PlayerStatus } from '@/lib/creation';

/**
 * A criação da ficha: o rascunho, quem pode mexer nele e a tela aberta por
 * cima da ficha. Local ao organismo, como o LevelUpContext.
 *
 * Os tipos do serviço entram só como TIPO, então nada do servidor chega ao
 * pacote do navegador.
 */

export type CreationPayload = Awaited<ReturnType<typeof getCreation>>;
export type AttributeRoll = Awaited<ReturnType<typeof rollAttributes>>;

export type CreationView = 'sheet' | 'rite' | 'wizard' | 'review';
export type WizardStep = CreationStep | 'revisao';

export interface ICreation {
  status?: PlayerStatus;
  /** A conta é a dona da ficha. */
  isOwner: boolean;
  isStaff: boolean;
  /** Pode mexer no rascunho agora (dona até a aprovação, admin sempre). */
  canEdit: boolean;
  /** O servidor recusou mostrar o rascunho: é visitante. */
  forbidden: boolean;
  loaded: boolean;
  data: CreationPayload | null;
  /** A ficha do rascunho, com o que ainda não voltou do servidor. */
  player: IPublicPlayer | null;
  view: CreationView;
  step: WizardStep;
  setStep: (step: WizardStep) => void;
  openRite: () => void;
  openWizard: (step?: WizardStep) => void;
  openReview: () => void;
  close: () => void;
  /** Salva um passo (debounce); o servidor devolve o rascunho refeito. */
  patch: (body: IDraftBody) => void;
  saving: boolean;
  /** Há alterações que o servidor ainda não confirmou; reenviadas sozinhas. */
  unsaved: boolean;
  /** Falha do último salvamento, ou aviso de regra. */
  error: string;
  clearError: () => void;
  rollAttributes: () => Promise<AttributeRoll | null>;
  rollGil: () => Promise<AttributeRoll | null>;
  submit: () => Promise<boolean>;
  approve: () => Promise<boolean>;
  returnSheet: (notes: string, steps: string[]) => Promise<boolean>;
  busy: boolean;
}

const noop = async () => null;

const CreationContext = createContext<ICreation>({
  isOwner: false,
  isStaff: false,
  canEdit: false,
  forbidden: false,
  loaded: false,
  data: null,
  player: null,
  view: 'sheet',
  step: 'identidade',
  setStep: () => {},
  openRite: () => {},
  openWizard: () => {},
  openReview: () => {},
  close: () => {},
  patch: () => {},
  saving: false,
  unsaved: false,
  error: '',
  clearError: () => {},
  rollAttributes: noop,
  rollGil: noop,
  submit: async () => false,
  approve: async () => false,
  returnSheet: async () => false,
  busy: false,
});

export const useCreation = () => useContext(CreationContext);

export const CreationProvider = ({
  value,
  children,
}: {
  value: ICreation;
  children: ReactNode;
}) => (
  <CreationContext.Provider value={value}>{children}</CreationContext.Provider>
);
