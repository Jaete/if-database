import PlayerModel from '@/db/players/players';
import type IPlayer from '@/db/players/player';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';

// Classe única: nenhuma ficha nova pode nascer com uma que já tem dono.
const validate = async (body: Record<string, unknown>) =>
  uniqueClassConflict(body.classId);

const handlers = createCollectionHandlers({
  service: createEntityService<IPlayer>(PlayerModel),
  notFoundLabel: 'Jogador não encontrado',
  validate,
  createErrorLabel: 'Falha ao criar jogador',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
