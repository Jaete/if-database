import CharacterClassModel from '@/db/classes/classes';
import type ICharacterClass from '@/db/classes/class.d';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

const handlers = createSlugHandlers({
  service: createEntityService<ICharacterClass>(CharacterClassModel),
  notFoundLabel: 'Classe não encontrada',
  createErrorLabel: 'Falha ao criar classe',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
