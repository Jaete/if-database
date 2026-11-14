/**
 * ATENÇÃO: assina tokens REAIS (o admin e a dona são contas de verdade do banco,
 * com o segredo do .env). Uso local apenas: nunca contra produção, nunca
 * commitar o JSON gerado.
 *
 * Prepara o smoke de criação de ficha (Playwright): cria 3 fichas vazias
 * TEMPORÁRIAS (`description: 'zz-creation-test'`) e assina os cookies de teste
 * (sessão do embed da dona e de um admin, e a sessão do app). Escreve tudo em
 * um JSON. Só roda com `ALLOW_DB_TESTS=1`. Limpeza: `teardown.ts`.
 *
 *   ALLOW_DB_TESTS=1 npx tsx __tests__/e2e/setup.ts /tmp/ctx.json
 */
import 'dotenv/config';
import fs from 'node:fs';
import { connectDB } from '../../lib/db';
import { signEmbedToken } from '../../services/forumAuth.service';
import { signToken } from '../../services/auth.service';
import { createBlankSheet } from '../../services/creation.service';
import User from '../../db/users/users';
import Player from '../../db/players/players';

if (process.env.ALLOW_DB_TESTS !== '1') {
  console.error('Recusado: este setup grava no banco. Use ALLOW_DB_TESTS=1.');
  process.exit(1);
}

(async () => {
  await connectDB();
  const users = await User.find({ forumUserId: { $exists: true } })
    .select('username role forumUserId')
    .lean();
  const admin = users.find((u) => u.role === 'admin');
  if (!admin) throw new Error('precisa de um admin ligado ao fórum');
  const owner = users.find((u) => u.role !== 'admin') ?? admin;
  const ids: string[] = [];
  for (let i = 0; i < 3; i += 1) {
    const made = await createBlankSheet(owner.forumUserId!, {
      username: admin.username,
      forumUserId: admin.forumUserId,
    });
    await Player.updateOne(
      { _id: made.id },
      { $set: { description: 'zz-creation-test' } }
    );
    ids.push(made.id);
  }
  const embed = (u: { forumUserId?: number; username: string }) => ({
    id: u.forumUserId,
    name: u.username,
    token: signEmbedToken({
      forumUserId: u.forumUserId!,
      username: u.username,
    }),
  });
  fs.writeFileSync(
    process.argv[2],
    JSON.stringify({
      ids,
      admin: embed(admin),
      owner: embed(owner),
      appToken: signToken({
        username: admin.username,
        role: 'admin',
        provider: 'forum',
      } as never),
    })
  );
  process.exit(0);
})();
