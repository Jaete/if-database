'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { IEventView } from '@/services/levelUp.service';
import type { ILevelPlan, ISealChoices } from '@/lib/levelUp';
import type { IPublicPlayer } from '@/db/players/publicFields';

/**
 * A subida de nível e a XP da ficha: quem vê o quê, o histórico, e a tela que
 * está aberta por cima da ficha. Local ao organismo, como o EditingContext.
 *
 * Os tipos do serviço entram só como TIPO (`import type`), então nada do
 * servidor chega ao pacote do navegador.
 */

export type LevelView = 'sheet' | 'grant' | 'rite' | 'level' | 'sealed';

export interface IGrantPayload {
  amount: number;
  reason: string;
  lines: { line: string; value: number }[];
  reversalOf?: string;
}

export interface ISealedInfo {
  level: number;
  got: string[];
  hpGain: number;
}

export interface IHpRollResult {
  rollId: string;
  result: number;
  die: number;
  at: string;
  byUsername: string;
}

export interface ILevelUp {
  access: { isStaff: boolean; isOwner: boolean };
  history: IEventView[];
  /** XP e nível derivados da ficha. */
  progress: {
    level: number;
    earned: number;
    pending: number;
    pool: number;
    into: number;
    needed: number | null;
  };
  view: LevelView;
  plan: ILevelPlan | null;
  sealedInfo: ISealedInfo | null;
  busy: boolean;
  error: string;
  /** Edição de um nível selado pelo admin (o plano é o do nível, sem o efeito dele). */
  editingLevel: number | null;
  openGrant: (prefill?: Partial<IGrantPayload>) => void;
  grantPrefill: Partial<IGrantPayload> | null;
  openRite: () => void;
  startLevel: () => Promise<void>;
  startEdit: (level: number) => Promise<void>;
  close: () => void;
  grant: (payload: IGrantPayload) => Promise<boolean>;
  roll: () => Promise<IHpRollResult | null>;
  seal: (choices: ISealChoices, reason?: string) => Promise<boolean>;
  reopen: (level: number, reason: string) => Promise<boolean>;
  markSeen: (section: string) => void;
  clearError: () => void;
  player: IPublicPlayer;
}

const noop = async () => {};

const LevelUpContext = createContext<ILevelUp>({
  access: { isStaff: false, isOwner: false },
  history: [],
  progress: { level: 1, earned: 1, pending: 0, pool: 0, into: 0, needed: null },
  view: 'sheet',
  plan: null,
  sealedInfo: null,
  busy: false,
  error: '',
  editingLevel: null,
  openGrant: () => {},
  grantPrefill: null,
  openRite: () => {},
  startLevel: noop,
  startEdit: noop,
  close: () => {},
  grant: async () => false,
  roll: async () => null,
  seal: async () => false,
  reopen: async () => false,
  markSeen: () => {},
  clearError: () => {},
  player: {} as IPublicPlayer,
});

export const useLevelUp = () => useContext(LevelUpContext);

export const LevelUpProvider = ({
  value,
  children,
}: {
  value: ILevelUp;
  children: ReactNode;
}) => (
  <LevelUpContext.Provider value={value}>{children}</LevelUpContext.Provider>
);
