import TalentModel from '@/db/talents/talents';
import type ITalentDoc from '@/db/talents/talent.d';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';

// O service é montado aqui, e não importado de `talent.service.ts`, porque
// aquele módulo é 'use server': exportar dele um objeto com funções faria o
// Next tratá-lo como server action e falhar ao serializar.
const handlers = createCollectionHandlers({
  service: createEntityService<ITalentDoc>(TalentModel),
  notFoundLabel: 'Talento não encontrado',
  createErrorLabel: 'Falha ao criar talento',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
