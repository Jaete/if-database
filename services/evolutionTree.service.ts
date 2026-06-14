'use server';

import EvolutionTreeModel from '../db/evolutionTrees/evolutionTrees';
import IEvolutionTree from '../db/evolutionTrees/evolutionTree';

interface Result {
  success: boolean;
  data?: IEvolutionTree;
}

export async function createEvolutionTree(
  data: IEvolutionTree
): Promise<Result> {
  const tree = await EvolutionTreeModel.create(data);
  if (!tree) {
    return { success: false };
  }
  return { success: true, data: tree };
}

export async function getAllEvolutionTrees(): Promise<IEvolutionTree[]> {
  const trees = await EvolutionTreeModel.find().select('-__v');
  return trees;
}

export async function getEvolutionTreeBySlug(slug: string): Promise<Result> {
  const tree = await EvolutionTreeModel.findOne({ slug });
  if (!tree) {
    return { success: false };
  }
  return { success: true, data: tree };
}

export async function updateEvolutionTree(
  slug: string,
  updateData: Partial<IEvolutionTree>
): Promise<Result> {
  const tree = await EvolutionTreeModel.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!tree) {
    return { success: false };
  }
  return { success: true, data: tree };
}

export async function deleteEvolutionTree(slug: string): Promise<Result> {
  const tree = await EvolutionTreeModel.findOneAndDelete({ slug });
  if (!tree) {
    return { success: false };
  }
  return { success: true };
}
