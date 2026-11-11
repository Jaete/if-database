import RaceModel from '@/db/races/races';
import type IRace from '@/db/races/race.d';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

const handlers = createSlugHandlers({
  service: createEntityService<IRace>(RaceModel),
  notFoundLabel: 'Raça não encontrada',
  createErrorLabel: 'Falha ao criar raça',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
