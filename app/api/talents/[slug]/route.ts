import TalentModel from '@/db/talents/talents';
import type ITalentDoc from '@/db/talents/talent.d';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';

const handlers = createSlugHandlers({
  service: createEntityService<ITalentDoc>(TalentModel),
  notFoundLabel: 'Talento não encontrado',
  createErrorLabel: 'Falha ao criar talento',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
