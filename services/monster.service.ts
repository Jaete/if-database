import MonsterModel from "../db/monsters/monsters";
import IMonster from "../db/monsters/monsters.d";

export async function createMonster(data: IMonster) {
  const monster = await MonsterModel.create(data);
  return monster;
}

export async function getAllMonsters() {
  const monsters = await MonsterModel.find().select("-__v");
  return monsters;
}
export async function getMonsterBySlug(slug: string) {
  const monster = await MonsterModel.findOne({ slug });
  return monster;
}

export async function updateMonster(slug: string, updateData: Partial<IMonster>) {
  const monster = await MonsterModel.findOneAndUpdate(
    { slug }, 
    updateData, 
    { new: true, runValidators: true }
  );
  return monster;
}

export async function deleteMonster(slug: string) {
  const monster = await MonsterModel.findOneAndDelete({ slug });
  return monster;
}