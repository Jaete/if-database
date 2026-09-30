import PlayerModel from '@/db/players/players';
import type IPlayer from '@/db/players/player';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';

const handlers = createCollectionHandlers({
  service: createEntityService<IPlayer>(PlayerModel),
  notFoundLabel: 'Jogador não encontrado',
  createErrorLabel: 'Falha ao criar jogador',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
