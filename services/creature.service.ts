import CreatureModel from '../db/creatures/creatures';
import ICreature from '../db/creatures/creatures.d';

export async function createCreature(data: ICreature) {
  const creature = await CreatureModel.create(data);
  return creature;
}

export async function getAllCreatures() {
  const creatures = await CreatureModel.find().select('-__v');
  return creatures;
}
export async function getCreatureBySlug(slug: string) {
  const creature = await CreatureModel.findOne({ slug });
  return creature;
}

export async function updateCreature(
  slug: string,
  updateData: Partial<ICreature>
) {
  const creature = await CreatureModel.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true,
  });
  return creature;
}

export async function deleteCreature(slug: string) {
  const creature = await CreatureModel.findOneAndDelete({ slug });
  return creature;
}
