'use client';

import PlayersProvider from '@/app/context/PlayersContext';
import { TabProvider } from '@/app/context/TabContext';
import PlayerGrid from '@/components/PlayerGrid';
import TabBar from '@/components/TabBar';
import IPlayer from '@/db/players/player';
import type { FormDataType } from '@/components/CitizenEditForm';

interface IProps {
  initialPlayers: IPlayer[];
}

export default function PlayersPageClient({ initialPlayers }: IProps) {
  return (
    <main>
      <PlayersProvider initialPlayers={initialPlayers}>
        <TabProvider<FormDataType>>
          <PlayerGrid />
          <TabBar />
        </TabProvider>
      </PlayersProvider>
    </main>
  );
}
