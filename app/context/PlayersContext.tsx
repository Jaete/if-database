'use client';

import IPlayer from '@/db/players/player';
import { createEntityContext } from './createEntityContext';

const entity = createEntityContext<IPlayer>({
  basePath: '/api/players',
  label: 'jogador',
  providerName: 'PlayersProvider',
});

export const PlayersContext = entity.Context;

interface IProps {
  children: React.ReactNode;
  initialPlayers?: IPlayer[];
}

export default function PlayersProvider({ children, initialPlayers }: IProps) {
  return (
    <entity.Provider initialItems={initialPlayers}>{children}</entity.Provider>
  );
}

interface IPlayersContext {
  players: IPlayer[];
  loading: boolean;
  update: (player: IPlayer) => Promise<IPlayer | undefined>;
  erase: (player: IPlayer) => Promise<void>;
  create: (player: IPlayer) => Promise<IPlayer | undefined>;
}

export function usePlayers(): IPlayersContext {
  const { items, loading, update, erase, create } = entity.useEntities();
  return { players: items, loading, update, erase, create };
}
