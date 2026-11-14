import PlayerModel from '@/db/players/players';
import type IPlayer from '@/db/players/player';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';
import { uniqueRaceConflict } from '@/services/race.service';
import { createPlayer } from '@/services/player.service';
import { PlayerSheetError } from '@/services/playerSheetLinks.service';

// Classe ou raça única: nenhuma ficha nova pode nascer com uma que já tem dono.
const validate = async (body: Record<string, unknown>) =>
  (await uniqueClassConflict(body.classId)) ??
  (await uniqueRaceConflict(body.raceId));

const handlers = createCollectionHandlers({
  service: createEntityService<IPlayer>(PlayerModel),
  notFoundLabel: 'Jogador não encontrado',
  validate,
  // Passa pela mesma limpeza e conferência da edição (raça, classe, talentos).
  create: (body) => createPlayer(body as unknown as IPlayer),
  clientError: (error) =>
    error instanceof PlayerSheetError ? error.message : null,
  createErrorLabel: 'Falha ao criar jogador',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
