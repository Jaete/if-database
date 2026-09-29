'use server';

import MonsterModel from '../db/monsters/monsters';
import IMonster from '../db/monsters/monster';

interface Result {
  success: boolean;
  data?: IMonster;
}

export async function createMonster(data: IMonster): Promise<Result> {
  const monster = await MonsterModel.create(data);
  if (!monster) {
    return { success: false };
  }
  return { success: true, data: monster };
}

export async function getAllMonsters(): Promise<IMonster[]> {
  const monsters = await MonsterModel.find().select('-__v').lean<IMonster[]>();
  return monsters;
}

// Everything CreatureCard renders, plus what MonsterSearch and the evolution
// tree need. 34 KB for the whole collection against 1.6 MB for the full
// documents, so the grid never pays for fields only the drawer reads.
const INDEX_FIELDS = 'slug name image icon rarity';

export async function getMonsterIndex(): Promise<IMonster[]> {
  const monsters = await MonsterModel.find()
    .select(INDEX_FIELDS)
    .sort({ name: 1 })
    .lean<IMonster[]>();
  return monsters;
}

export async function getMonstersPage(limit: number): Promise<IMonster[]> {
  const monsters = await MonsterModel.find()
    .select('-__v')
    .sort({ name: 1 })
    .limit(limit)
    .lean<IMonster[]>();
  return monsters;
}
export async function getMonsterBySlug(slug: string): Promise<Result> {
  const monster = await MonsterModel.findOne({ slug });
  if (!monster) {
    return { success: false };
  }
  return { success: true, data: monster };
}

export async function getMonstersBySlugs(slugs: string[]): Promise<IMonster[]> {
  const monsters = await MonsterModel.find({ slug: { $in: slugs } })
    .select('-__v')
    .lean<IMonster[]>();
  return monsters;
}

export async function updateMonster(
  slug: string,
  updateData: Partial<IMonster>
): Promise<Result> {
  const monster = await MonsterModel.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!monster) {
    return { success: false };
  }

  return { success: true, data: monster };
}

export async function deleteMonster(slug: string): Promise<Result> {
  const monster = await MonsterModel.findOneAndDelete({ slug });
  if (!monster) {
    return { success: false };
  }
  return { success: true };
}
