import MonsterModel from '../db/monsters/monsters';
import IMonster from '../db/monsters/monsters.d';

interface ServiceError {
  success: false;
  error: string;
}

interface ServiceSuccess<T> {
  success: true;
  data: T;
}

type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export async function createMonster(
  data: IMonster
): Promise<ServiceResult<IMonster>> {
  try {
    const monster = await MonsterModel.create(data);
    return { success: true, data: monster };
  } catch (error) {
    console.error('[createMonster] Error:', error);
    return {
      success: false,
      error: 'Failed to create monster',
    };
  }
}

export async function getAllMonsters(): Promise<ServiceResult<IMonster[]>> {
  try {
    const monsters = await MonsterModel.find().select('-__v').lean();
    return { success: true, data: monsters };
  } catch (error) {
    console.error('[getAllMonsters] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch monsters',
    };
  }
}

export async function getMonsterBySlug(
  slug: string
): Promise<ServiceResult<IMonster | null>> {
  try {
    const monster = await MonsterModel.findOne({ slug }).lean();
    return { success: true, data: monster };
  } catch (error) {
    console.error('[getMonsterBySlug] Error:', error);
    return {
      success: false,
      error: 'Failed to fetch monster',
    };
  }
}

export async function updateMonster(
  slug: string,
  updateData: Partial<IMonster>
): Promise<ServiceResult<IMonster | null>> {
  try {
    const monster = await MonsterModel.findOneAndUpdate(
      { slug },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();
    return { success: true, data: monster };
  } catch (error) {
    console.error('[updateMonster] Error:', error);
    return {
      success: false,
      error: 'Failed to update monster',
    };
  }
}

export async function deleteMonster(
  slug: string
): Promise<ServiceResult<IMonster | null>> {
  try {
    const monster = await MonsterModel.findOneAndDelete({ slug }).lean();
    return { success: true, data: monster };
  } catch (error) {
    console.error('[deleteMonster] Error:', error);
    return {
      success: false,
      error: 'Failed to delete monster',
    };
  }
}
