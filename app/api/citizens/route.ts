import CitizenModel from '@/db/citizens/citizens';
import type ICitizen from '@/db/citizens/citizen.d';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';

// O service é montado aqui, e não importado de `citizen.service.ts`, porque
// aquele módulo é 'use server': exportar dele um objeto com funções faria o
// Next tratá-lo como server action e falhar ao serializar.
// Classe única: nenhuma ficha nova pode nascer com uma que já tem dono.
const validate = async (body: Record<string, unknown>) =>
  uniqueClassConflict(body.classId);

const handlers = createCollectionHandlers({
  service: createEntityService<ICitizen>(CitizenModel),
  notFoundLabel: 'Cidadão não encontrado',
  validate,
  createErrorLabel: 'Falha ao criar cidadão',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
