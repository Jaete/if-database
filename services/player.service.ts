'use server';

import PlayerModel from '../db/players/players';
import IPlayer from '../db/players/player';
import {
  PLAYER_PUBLIC_FIELDS,
  type IPublicPlayer,
} from '../db/players/publicFields';
import { createEntityService } from './createEntityService';

const service = createEntityService<IPlayer>(PlayerModel);

export async function createPlayer(data: IPlayer) {
  return service.create(data);
}

export async function getAllPlayers() {
  return service.getAll();
}

export async function getPlayerBySlug(slug: string) {
  return service.getBySlug(slug);
}

// Public projection (whitelist): this feeds the unauthenticated embed.
// 24 hex chars only: `isValidObjectId` also accepts any 12-character string.
export async function getPlayerById(id: string) {
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  return PlayerModel.findById(id)
    .select(PLAYER_PUBLIC_FIELDS.join(' '))
    .lean<IPublicPlayer>();
}

export async function updatePlayer(slug: string, updateData: Partial<IPlayer>) {
  return service.update(slug, updateData);
}

export async function deletePlayer(slug: string) {
  return service.remove(slug);
}
