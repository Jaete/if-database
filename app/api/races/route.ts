import RaceModel from '@/db/races/races';
import type IRace from '@/db/races/race.d';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';

// O service é montado aqui, e não importado de `race.service.ts`, porque
// aquele módulo é 'use server': exportar dele um objeto faria o Next tratá-lo
// como server action e falhar ao serializar.
const handlers = createCollectionHandlers({
  service: createEntityService<IRace>(RaceModel),
  notFoundLabel: 'Raça não encontrada',
  createErrorLabel: 'Falha ao criar raça',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
