import RaceModel from '@/db/races/races';
import type IRace from '@/db/races/race.d';
import { removeRace, updateRace } from '@/services/race.service';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

const handlers = createSlugHandlers({
  // Atualizar e apagar limpam as imagens enviadas que a raça deixou de usar.
  service: {
    ...createEntityService<IRace>(RaceModel),
    update: updateRace,
    remove: removeRace,
  },
  notFoundLabel: 'Raça não encontrada',
  createErrorLabel: 'Falha ao criar raça',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
