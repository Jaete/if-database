import CitizenModel from '@/db/citizens/citizens';
import type ICitizen from '@/db/citizens/citizen.d';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';

// Classe única: a lista do seletor já esconde o que está tomado, mas a regra
// só é regra aqui.
const validate = async (
  body: Record<string, unknown>,
  { slug }: { slug?: string }
) => uniqueClassConflict(body.classId, slug);

const handlers = createSlugHandlers({
  service: createEntityService<ICitizen>(CitizenModel),
  notFoundLabel: 'Cidadão não encontrado',
  validate,
  createErrorLabel: 'Falha ao criar cidadão',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
