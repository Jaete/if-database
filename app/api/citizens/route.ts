import CitizenModel from '@/db/citizens/citizens';
import type ICitizen from '@/db/citizens/citizen.d';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';

// O service é montado aqui, e não importado de `citizen.service.ts`, porque
// aquele módulo é 'use server': exportar dele um objeto com funções faria o
// Next tratá-lo como server action e falhar ao serializar.
const handlers = createCollectionHandlers({
  service: createEntityService<ICitizen>(CitizenModel),
  notFoundLabel: 'Cidadão não encontrado',
  createErrorLabel: 'Falha ao criar cidadão',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
