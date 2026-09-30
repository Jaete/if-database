'use client';

import IPlayer from '@/db/players/player';
import { createEntityUtils } from './createEntityUtils';

const api = createEntityUtils<IPlayer>({
  basePath: '/api/players',
  label: 'jogador',
});

export const fetchPlayers = api.fetchAll;
export const createPlayer = api.create;
export const updatePlayer = api.update;
export const deletePlayer = api.remove;
