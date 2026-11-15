import { getEmbedSession } from './embedAuth.service';
import { getAccess, type IActor } from './levelUp.service';

/** Quem está chamando, em relação a ESTA ficha. `null` = sem sessão do embed. */
export async function resolveActor(playerId: string): Promise<IActor | null> {
  const session = await getEmbedSession();
  if (!session) return null;
  const access = await getAccess(playerId, session);
  return {
    username: session.username,
    forumUserId: session.forumUserId,
    role: session.role,
    ...access,
  };
}
