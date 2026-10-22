import SpellModel from '@/db/spells/spells';
import type ISpell from '@/db/spells/spell.d';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

const handlers = createSlugHandlers({
  service: createEntityService<ISpell>(SpellModel),
  notFoundLabel: 'Magia não encontrada',
  createErrorLabel: 'Falha ao criar magia',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
