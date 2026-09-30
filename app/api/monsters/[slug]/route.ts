import MonsterModel from '@/db/monsters/monsters';
import type IMonster from '@/db/monsters/monster';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

// Antes esta rota não tinha GET e respondia 500 quando o slug não existia,
// enquanto a de cidadão respondia 404. Os chamadores só checam `res.ok`, então
// unificar no handler compartilhado não muda nada para eles e corrige o status.
const handlers = createSlugHandlers({
  service: createEntityService<IMonster>(MonsterModel),
  notFoundLabel: 'Monstro não encontrado',
  createErrorLabel: 'Falha ao criar monstro',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
