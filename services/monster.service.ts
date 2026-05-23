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
  const monsters = await MonsterModel.find().select('-__v');
  return monsters;
}
export async function getMonsterBySlug(slug: string): Promise<Result> {
  const monster = await MonsterModel.findOne({ slug });
  if (!monster) {
    return { success: false };
  }
  return { success: true, data: monster };
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
  return { success: true };
}

export async function deleteMonster(slug: string): Promise<Result> {
  const monster = await MonsterModel.findOneAndDelete({ slug });
  if (!monster) {
    return { success: false };
  }
  return { success: true };
}
