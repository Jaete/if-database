/**
 * Apaga SÓ as fichas que carregam a marca `description: 'zz-creation-test'` (e
 * o que elas geraram). Ids extras valem apenas para fichas em branco recém-
 * criadas pelo app no smoke, que ganham a marca antes.
 *
 *   ALLOW_DB_TESTS=1 npx tsx __tests__/e2e/teardown.ts [id ...]
 */
import 'dotenv/config';
import { connectDB } from '../../lib/db';
import Player from '../../db/players/players';
import Event from '../../db/playerProgress/playerEvents';
import Roll from '../../db/playerProgress/creationRolls';

const MARK = 'zz-creation-test';

if (process.env.ALLOW_DB_TESTS !== '1') {
  console.error('Recusado: use ALLOW_DB_TESTS=1.');
  process.exit(1);
}

(async () => {
  await connectDB();
  const extra = process.argv
    .slice(2)
    .filter((id) => /^[0-9a-f]{24}$/i.test(id));
  // As fichas criadas pelo app durante o smoke não têm a marca: as ids passadas
  // só a recebem se forem fichas em branco sem nome. O resto exige a marca.
  await Player.updateMany(
    {
      _id: { $in: extra },
      status: 'blank',
      name: { $exists: false },
      description: { $exists: false },
    },
    { $set: { description: MARK } }
  );
  const found = await Player.find({ description: MARK }).select('_id').lean();
  for (const p of found) {
    await Event.deleteMany({ playerId: p._id });
    await Roll.deleteMany({ playerId: p._id });
  }
  const res = await Player.deleteMany({
    _id: { $in: found.map((p) => p._id) },
  });
  console.log(`apagadas: ${res.deletedCount}`);
  process.exit(0);
})();
