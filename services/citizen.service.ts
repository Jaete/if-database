'use server';

import CitizenModel from '../db/citizens/citizens';
import ICitizen from '../db/citizens/citizen.d';

interface Result {
  success: boolean;
  data?: ICitizen;
}

export async function createCitizen(data: ICitizen): Promise<Result> {
  const citizen = await CitizenModel.create(data);
  if (!citizen) {
    return { success: false };
  }
  return { success: true, data: citizen };
}

export async function getAllCitizens(): Promise<ICitizen[]> {
  const citizens = await CitizenModel.find().select('-__v');
  return citizens;
}

export async function getCitizenBySlug(slug: string): Promise<Result> {
  const citizen = await CitizenModel.findOne({ slug });
  if (!citizen) {
    return { success: false };
  }
  return { success: true, data: citizen };
}

export async function getCitizensBySlugs(slugs: string[]): Promise<ICitizen[]> {
  const citizens = await CitizenModel.find({
    slug: { $in: slugs },
  }).select('-__v');
  return citizens;
}

export async function updateCitizen(
  slug: string,
  updateData: Partial<ICitizen>
): Promise<Result> {
  const citizen = await CitizenModel.findOneAndUpdate({ slug }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!citizen) {
    return { success: false };
  }
  return { success: true, data: citizen };
}

export async function deleteCitizen(slug: string): Promise<Result> {
  const citizen = await CitizenModel.findOneAndDelete({ slug });
  if (!citizen) {
    return { success: false };
  }
  return { success: true };
}
