import SpellModel from '@/db/spells/spells';
import type ISpell from '@/db/spells/spell.d';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';

// O service é montado aqui, e não importado de `spell.service.ts`, porque
// aquele módulo é 'use server': exportar dele um objeto com funções faria o
// Next tratá-lo como server action e falhar ao serializar.
const handlers = createCollectionHandlers({
  service: createEntityService<ISpell>(SpellModel),
  notFoundLabel: 'Magia não encontrada',
  createErrorLabel: 'Falha ao criar magia',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
