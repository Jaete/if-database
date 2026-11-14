import { OWN_SHEET_EDIT_MESSAGE, SELF_OWNER_MESSAGE } from '@/lib/sheetAccess';
import PlayerModel from '@/db/players/players';
import { redactPlayer } from '@/db/players/redact';
import type IPlayer from '@/db/players/player';
import { createEntityService } from '@/services/createEntityService';
import { createSlugHandlers } from '@/app/api/_entity/handlers';
import { uniqueClassConflict } from '@/services/class.service';
import { uniqueRaceConflict } from '@/services/race.service';
import { updatePlayer } from '@/services/player.service';
import { getAuthorizedSession } from '@/services/auth.service';
import { PlayerSheetError } from '@/services/playerSheetLinks.service';

// Classe ou raça única: a lista do seletor já esconde o que está tomado, mas a
// regra só é regra aqui. (`updatePlayer` repete a conferência da raça ao gravar,
// que é o que também cobre a edição embutida.)
//
// Passar a ficha de outra pessoa para si mesmo também é recusado: a ficha
// própria de quem é staff só nasce em branco (SELF_OWNER_MESSAGE).
const validate = async (
  body: Record<string, unknown>,
  { slug }: { slug?: string }
) => {
  if ('ownerForumUserId' in body) {
    const session = await getAuthorizedSession();
    if (
      typeof session?.forumUserId === 'number' &&
      Number(body.ownerForumUserId) === session.forumUserId
    ) {
      return SELF_OWNER_MESSAGE;
    }
  }
  return (
    (await uniqueClassConflict(body.classId, slug)) ??
    (await uniqueRaceConflict(body.raceId, { slug }))
  );
};

const handlers = createSlugHandlers({
  service: createEntityService<IPlayer>(PlayerModel),
  notFoundLabel: 'Jogador não encontrado',
  // Rascunho e estado de criação não saem na leitura pública.
  redact: (doc, isStaff) => redactPlayer(doc, isStaff),
  validate,
  // Quem é dono da ficha não a edita nem apaga como staff: outro membro da staff
  // precisa fazê-lo (lib/sheetAccess.ts).
  guardWrite: async (slug, session) => {
    if (typeof session.forumUserId !== 'number') return null;
    const sheet = await PlayerModel.findOne({ slug })
      .select('ownerForumUserId')
      .lean<{ ownerForumUserId?: number }>();
    return sheet?.ownerForumUserId === session.forumUserId
      ? OWN_SHEET_EDIT_MESSAGE
      : null;
  },
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
