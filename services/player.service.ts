'use server';

import PlayerModel from '../db/players/players';
import IPlayer from '../db/players/player';
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

export async function updatePlayer(slug: string, updateData: Partial<IPlayer>) {
  return service.update(slug, updateData);
}

export async function deletePlayer(slug: string) {
  return service.remove(slug);
}
