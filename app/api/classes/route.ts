import CharacterClassModel from '@/db/classes/classes';
import type ICharacterClass from '@/db/classes/class.d';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';

// O service é montado aqui, e não importado de `class.service.ts`, porque
// aquele módulo é 'use server': exportar dele um objeto faria o Next tratá-lo
// como server action e falhar ao serializar.
const handlers = createCollectionHandlers({
  service: createEntityService<ICharacterClass>(CharacterClassModel),
  notFoundLabel: 'Classe não encontrada',
  createErrorLabel: 'Falha ao criar classe',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
