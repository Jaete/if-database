import PlayerModel from '@/db/players/players';
import type IPlayer from '@/db/players/player';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';
import { uniqueRaceConflict } from '@/services/race.service';
import { updatePlayer } from '@/services/player.service';
import { PlayerSheetError } from '@/services/playerSheetLinks.service';

// Classe ou raça única: a lista do seletor já esconde o que está tomado, mas a
// regra só é regra aqui. (`updatePlayer` repete a conferência da raça ao gravar,
// que é o que também cobre a edição embutida.)
const validate = async (
  body: Record<string, unknown>,
  { slug }: { slug?: string }
) =>
  (await uniqueClassConflict(body.classId, slug)) ??
  (await uniqueRaceConflict(body.raceId, { slug }));

const handlers = createSlugHandlers({
  service: createEntityService<IPlayer>(PlayerModel),
  notFoundLabel: 'Jogador não encontrado',
  validate,
  // Passa pela limpeza e pela conferência do serviço: sem isso, o editor
  // gravaria raça, talentos e habilidades derivadas sem nenhuma validação.
  update: (slug, body) => updatePlayer(slug, body as Partial<IPlayer>),
  clientError: (error) =>
    error instanceof PlayerSheetError ? error.message : null,
  createErrorLabel: 'Falha ao criar jogador',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
