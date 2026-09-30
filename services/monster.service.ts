'use server';

import MonsterModel from '../db/monsters/monsters';
import IMonster from '../db/monsters/monster';
import { createEntityService } from './createEntityService';

const service = createEntityService<IMonster>(MonsterModel);

// Delegações finas: a diretiva 'use server' exige que este módulo exporte
// apenas funções async, então a fábrica não pode ser exposta diretamente.
export async function createMonster(data: IMonster) {
  return service.create(data);
}

export async function getAllMonsters() {
  return service.getAll();
}

export async function getMonsterBySlug(slug: string) {
  return service.getBySlug(slug);
}

export async function getMonstersBySlugs(slugs: string[]) {
  return service.getBySlugs(slugs);
}

export async function updateMonster(
  slug: string,
  updateData: Partial<IMonster>
) {
  return service.update(slug, updateData);
}

export async function deleteMonster(slug: string) {
  return service.remove(slug);
}

// ===== Só monstros =====

// Everything CreatureCard renders, plus what MonsterSearch and the evolution
// tree need. 34 KB for the whole collection against 1.6 MB for the full
// documents, so the grid never pays for fields only the drawer reads.
const INDEX_FIELDS = 'slug name image icon rarity';

export async function getMonsterIndex(): Promise<IMonster[]> {
  return MonsterModel.find()
    .select(INDEX_FIELDS)
    .sort({ name: 1 })
    .lean<IMonster[]>();
}

export async function getMonstersPage(limit: number): Promise<IMonster[]> {
  return MonsterModel.find()
    .select('-__v')
    .sort({ name: 1 })
    .limit(limit)
    .lean<IMonster[]>();
}
