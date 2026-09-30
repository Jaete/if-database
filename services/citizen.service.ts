'use server';

import CitizenModel from '../db/citizens/citizens';
import ICitizen from '../db/citizens/citizen.d';
import { createEntityService } from './createEntityService';

const service = createEntityService<ICitizen>(CitizenModel);

// Delegações finas: a diretiva 'use server' exige que este módulo exporte
// apenas funções async, então a fábrica não pode ser exposta diretamente.
export async function createCitizen(data: ICitizen) {
  return service.create(data);
}

export async function getAllCitizens() {
  return service.getAll();
}

export async function getCitizenBySlug(slug: string) {
  return service.getBySlug(slug);
}

export async function getCitizensBySlugs(slugs: string[]) {
  return service.getBySlugs(slugs);
}

export async function updateCitizen(
  slug: string,
  updateData: Partial<ICitizen>
) {
  return service.update(slug, updateData);
}

export async function deleteCitizen(slug: string) {
  return service.remove(slug);
}
