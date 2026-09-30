import CitizenModel from '@/db/citizens/citizens';
import type ICitizen from '@/db/citizens/citizen.d';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

const handlers = createSlugHandlers({
  service: createEntityService<ICitizen>(CitizenModel),
  notFoundLabel: 'Cidadão não encontrado',
  createErrorLabel: 'Falha ao criar cidadão',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
