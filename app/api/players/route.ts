import { SELF_OWNER_MESSAGE } from '@/lib/sheetAccess';
import PlayerModel from '@/db/players/players';
import { redactPlayer } from '@/db/players/redact';
import type IPlayer from '@/db/players/player';
import { createEntityService } from '@/services/createEntityService';
import { createCollectionHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';
import { uniqueRaceConflict } from '@/services/race.service';
import { createPlayer } from '@/services/player.service';
import { getAuthorizedSession } from '@/services/auth.service';
import { PlayerSheetError } from '@/services/playerSheetLinks.service';

// Classe ou raça única: nenhuma ficha nova pode nascer com uma que já tem dono.
// E ninguém da staff cria uma ficha pronta em nome próprio (SELF_OWNER_MESSAGE).
const validate = async (body: Record<string, unknown>) => {
  const session = await getAuthorizedSession();
  if (
    typeof session?.forumUserId === 'number' &&
    Number(body.ownerForumUserId) === session.forumUserId
  ) {
    return SELF_OWNER_MESSAGE;
  }
  return (
    (await uniqueClassConflict(body.classId)) ??
    (await uniqueRaceConflict(body.raceId))
  );
};

const handlers = createCollectionHandlers({
  service: createEntityService<IPlayer>(PlayerModel),
  notFoundLabel: 'Jogador não encontrado',
  // Rascunho e estado de criação não saem na leitura pública.
  redact: (doc, isStaff) => redactPlayer(doc, isStaff),
  validate,
  // Passa pela mesma limpeza e conferência da edição (raça, classe, talentos).
  create: (body) => createPlayer(body as unknown as IPlayer),
  clientError: (error) =>
    error instanceof PlayerSheetError ? error.message : null,
  createErrorLabel: 'Falha ao criar jogador',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
