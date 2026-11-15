/**
 * Criação de ficha contra o banco REAL, só em fichas temporárias (marcadas com
 * `description: 'zz-creation-test'`). Roda com
 * `ALLOW_DB_TESTS=1 npm run test:creation:db`: sem a variável, recusa. As
 * fichas (e rolagens e eventos) são apagadas antes e depois, e também em
 * SIGINT/SIGTERM. Nunca toca nas fichas de verdade: a dona é uma conta real
 * só lida.
 */
import 'dotenv/config';
import assert from 'node:assert/strict';
import { connectDB } from '../lib/db';

if (process.env.ALLOW_DB_TESTS !== '1') {
  console.error('Recusado: este teste grava no banco. Use ALLOW_DB_TESTS=1.');
  process.exit(1);
}

let passed = 0;
const test = async (name: string, fn: () => unknown | Promise<unknown>) => {
  try {
    await fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (error) {
    console.error(`FAIL  ${name}\n`, error);
    process.exitCode = 1;
  }
};

const MARK = 'zz-creation-test';
const admin = {
  username: 'admin-teste',
  forumUserId: 1,
  isStaff: true,
  isOwner: false,
};
const stranger = {
  username: 'outro',
  forumUserId: 2,
  isStaff: false,
  isOwner: false,
};

async function main() {
  await connectDB();
  const { default: Player } = await import('../db/players/players');
  const { default: Cls } = await import('../db/classes/classes');
  const { default: Race } = await import('../db/races/races');
  const { default: Spell } = await import('../db/spells/spells');
  const { default: User } = await import('../db/users/users');
  const { default: Event } = await import('../db/playerProgress/playerEvents');
  const { default: Roll } = await import('../db/playerProgress/creationRolls');
  const svc = await import('../services/creation.service');
  const { getPlayerById } = await import('../services/player.service');
  const { CreationError } = svc;

  const cleanup = async () => {
    const ps = await Player.find({ description: MARK }).select('_id').lean();
    for (const p of ps) {
      await Event.deleteMany({ playerId: p._id });
      await Roll.deleteMany({ playerId: p._id });
    }
    await Player.deleteMany({ description: MARK });
  };
  for (const sig of ['SIGINT', 'SIGTERM'] as const) {
    process.on(sig, () => {
      void cleanup().finally(() => process.exit(130));
    });
  }
  await cleanup();

  const owner = await User.findOne({ forumUserId: { $exists: true } })
    .select('username forumUserId')
    .lean<{ username: string; forumUserId: number }>();
  assert.ok(owner, 'precisa de uma conta do fórum para ser dona');
  const ownerActor = {
    username: owner.username,
    forumUserId: owner.forumUserId,
    isStaff: false,
    isOwner: true,
  };

  const mark = async (id: string) => {
    await Player.updateOne({ _id: id }, { $set: { description: MARK } });
  };
  const blank = async () => {
    const made = await svc.createBlankSheet(owner.forumUserId, admin);
    await mark(made.id);
    return made.id;
  };
  const raw = async (id: string) =>
    (await Player.findById(id).lean()) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const refuses = async (fn: () => Promise<unknown>, status?: number) => {
    try {
      await fn();
    } catch (error) {
      assert.ok(
        error instanceof CreationError,
        `esperava CreationError: ${error}`
      );
      if (status) assert.equal(error.status, status, error.message);
      return error as InstanceType<typeof CreationError>;
    }
    assert.fail('devia ter sido recusado');
  };

  const klass = async (slug: string) =>
    (await Cls.findOne({ slug }).lean()) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const race = async (slug: string) =>
    (await Race.findOne({ slug }).lean()) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const mage = await klass('mago-branco');
  const dragoon = await klass('dragoon');
  const centauros = await race('centauros');
  const humanos = await race('humanos');
  const anoes = await race('anoes');
  const estelar = await race('elfo-estelar');
  assert.ok(mage && dragoon && centauros && humanos && anoes && estelar);

  // ── Criar ──
  await test('blank sheet: status, level 1, placeholder slug, owner', async () => {
    const id = await blank();
    const s = await raw(id);
    assert.equal(s.status, 'blank');
    assert.equal(s.level, 1);
    assert.match(s.slug, /^ficha-[0-9a-f]{8}$/);
    assert.equal(s.ownerForumUserId, owner.forumUserId);
    assert.equal(s.experience.current, 0);
    const events = await Event.find({ playerId: id }).lean();
    assert.equal(events[0]?.kind, 'create');
  });
  await test('blank sheet needs a real forum account', async () => {
    await refuses(() => svc.createBlankSheet(999999999, admin), 404);
  });

  // ── Permissões ──
  await test('permission matrix: owner / stranger / admin', async () => {
    const id = await blank();
    await refuses(() => svc.getCreation(id, stranger), 403);
    await refuses(
      () => svc.saveDraft(id, { fields: { name: 'Invasor' } }, stranger),
      403
    );
    await refuses(() => svc.rollAttributes(id, stranger), 403);
    await refuses(() => svc.submitSheet(id, stranger), 403);
    await refuses(() => svc.approveSheet(id, ownerActor), 403);
    await refuses(() => svc.returnSheet(id, { notes: 'x' }, ownerActor), 403);
    await refuses(() => svc.approveSheet(id, stranger), 403);
    const ok = await svc.saveDraft(
      id,
      { fields: { name: 'Zz Dona' } },
      ownerActor
    );
    assert.equal(ok.status, 'draft');
    const asAdmin = await svc.saveDraft(
      id,
      { fields: { subtitle: 'Staff' } },
      admin
    );
    assert.equal(asAdmin.player?.subtitle, 'Staff');
  });
  await test('a legacy sheet (no status) is not a creation sheet', async () => {
    const id = await blank();
    await Player.updateOne({ _id: id }, { $unset: { status: '' } });
    await refuses(
      () => svc.saveDraft(id, { fields: { name: 'x' } }, admin),
      409
    );
    await refuses(() => svc.getCreation(id, ownerActor), 409);
  });

  // ── Edições do rascunho ──
  await test('owner draft edits: identity, slug follows the name', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      {
        fields: {
          name: 'Zz Teste Ana',
          subtitle: 'A primeira',
          gender: 'Feminino',
          appearance: 'Alta',
          backstory: 'Nasceu.',
          equipment: { backpack: 'Corda', gil: 99999 },
        },
      },
      ownerActor
    );
    const s = await raw(id);
    assert.equal(s.status, 'draft');
    assert.equal(s.name, 'Zz Teste Ana');
    assert.equal(s.slug, 'zz-teste-ana');
    assert.equal(s.equipment.backpack, 'Corda');
    assert.notEqual(s.equipment.gil, 99999, 'gil só muda pela rolagem');
    assert.equal(s.level, 1);
  });
  await test('draft cannot touch level, xp or status', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      {
        fields: {
          level: 9,
          experience: { current: 9999 },
          status: 'approved',
        } as never,
      },
      ownerActor
    );
    const s = await raw(id);
    assert.equal(s.level, 1);
    assert.equal(s.experience.current, 0);
    assert.notEqual(s.status, 'approved');
  });
  await test('attribute method: point buy accepts 27, refuses 28', async () => {
    const id = await blank();
    await svc.saveDraft(id, { creation: { method: 'pointBuy' } }, ownerActor);
    await refuses(() =>
      svc.saveDraft(
        id,
        {
          creation: {
            base: { str: 15, dex: 15, con: 15, int: 15, wis: 8, cha: 8 },
          },
        },
        ownerActor
      )
    );
    const ok = await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 },
        },
      },
      ownerActor
    );
    assert.equal(ok.creation.base?.str, 15);
  });
  await test('standard array: repeated value refused', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { creation: { method: 'standardArray' } },
      ownerActor
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { creation: { base: { str: 15, dex: 15 } } },
        ownerActor
      )
    );
    const ok = await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
        },
      },
      ownerActor
    );
    assert.equal(ok.creation.base?.cha, 8);
  });

  // ── Rolagem de atributos ──
  await test('attribute roll: persisted, final, not rerollable', async () => {
    const id = await blank();
    const first = await svc.rollAttributes(id, ownerActor);
    assert.equal(first.alreadyRolled, false);
    assert.equal(first.sets.length, 6);
    assert.ok(first.sets.every((row) => row.length === 4));
    assert.equal(first.sums.length, 6);
    first.sets.forEach((row, i) => {
      const sum = row.reduce((a, b) => a + b, 0) - Math.min(...row);
      assert.equal(first.sums[i], sum);
      assert.ok(row.every((d) => d >= 1 && d <= 6));
    });
    const second = await svc.rollAttributes(id, ownerActor);
    assert.equal(second.alreadyRolled, true);
    assert.equal(second.rollId, first.rollId);
    assert.deepEqual(second.sums, first.sums);
    assert.equal(
      await Roll.countDocuments({ playerId: id, kind: 'attributes' }),
      1
    );
    // Recarregar (o admin também) devolve a mesma.
    const again = await svc.rollAttributes(id, admin);
    assert.equal(again.rollId, first.rollId);
    const s = await raw(id);
    assert.equal(s.creation.method, 'roll');
    assert.equal(s.creation.rollId, first.rollId);
    // A rolagem trava os outros métodos.
    await refuses(
      () => svc.saveDraft(id, { creation: { method: 'pointBuy' } }, ownerActor),
      409
    );
    await refuses(
      () =>
        svc.saveDraft(
          id,
          { creation: { method: 'standardArray' } },
          ownerActor
        ),
      409
    );
    // Só valem os seis totais rolados.
    const wrong = first.sums.includes(18) ? 3 : 18;
    await refuses(() =>
      svc.saveDraft(id, { creation: { base: { str: wrong } } }, ownerActor)
    );
    const base = {
      str: first.sums[0],
      dex: first.sums[1],
      con: first.sums[2],
      int: first.sums[3],
      wis: first.sums[4],
      cha: first.sums[5],
    };
    const ok = await svc.saveDraft(id, { creation: { base } }, ownerActor);
    assert.deepEqual(ok.creation.base, base);
  });
  await test('concurrent attribute rolls end up as ONE roll', async () => {
    const id = await blank();
    const results = await Promise.all([
      svc.rollAttributes(id, ownerActor),
      svc.rollAttributes(id, ownerActor),
      svc.rollAttributes(id, admin),
    ]);
    assert.equal(new Set(results.map((r) => r.rollId)).size, 1);
    assert.equal(
      await Roll.countDocuments({ playerId: id, kind: 'attributes' }),
      1
    );
  });
  await test('roll method needs a roll first', async () => {
    const id = await blank();
    await refuses(
      () => svc.saveDraft(id, { creation: { method: 'roll' } }, ownerActor),
      409
    );
  });

  // ── Raça: bônus, sub-raça e únicas ──
  await test('humans: two +1 on DIFFERENT attributes', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: { raceId: String(humanos._id) } },
      ownerActor
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { creation: { racialPicks: ['str', 'str'] } },
        ownerActor
      )
    );
    const ok = await svc.saveDraft(
      id,
      { creation: { racialPicks: ['str', 'dex'] } },
      ownerActor
    );
    assert.deepEqual(ok.creation.racialPicks, ['str', 'dex']);
    // Trocar de raça zera as escolhas.
    const swapped = await svc.saveDraft(
      id,
      { fields: { raceId: String(centauros._id) } },
      ownerActor
    );
    assert.deepEqual(swapped.creation.racialPicks, []);
    await refuses(() =>
      svc.saveDraft(id, { creation: { racialPicks: ['str'] } }, ownerActor)
    );
  });
  await test('required subrace is reported until chosen', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: { raceId: String(anoes._id) } },
      ownerActor
    );
    const r = await svc.getCreation(id, ownerActor);
    assert.ok(
      r.issues.some((i) => i.step === 'raca' && /sub-raça/i.test(i.message))
    );
    const sub = anoes.subraces[0].slug;
    const ok = await svc.saveDraft(
      id,
      { fields: { raceId: String(anoes._id), raceChoice: { subrace: sub } } },
      ownerActor
    );
    assert.ok(!ok.issues.some((i) => i.step === 'raca'));
  });
  await test('unique race blocked as soon as a draft picks it', async () => {
    const a = await blank();
    const b = await blank();
    assert.equal(estelar.unique, true);
    await svc.saveDraft(
      a,
      { fields: { raceId: String(estelar._id) } },
      ownerActor
    );
    const err = await refuses(() =>
      svc.saveDraft(b, { fields: { raceId: String(estelar._id) } }, ownerActor)
    );
    assert.match(err.message, /única/i);
    // Quem já a tem a mantém.
    await svc.saveDraft(
      a,
      { fields: { raceId: String(estelar._id) } },
      ownerActor
    );
  });
  await test('unique class blocked as soon as a draft picks it', async () => {
    const necro = await klass('necromante');
    assert.equal(necro.isUnique, true);
    const id = await blank();
    const err = await refuses(() =>
      svc.saveDraft(id, { fields: { classId: String(necro._id) } }, ownerActor)
    );
    assert.match(err.message, /única/i);
  });

  // ── Gil inicial ──
  await test('starting gil: rolled once, within the formula, recorded', async () => {
    const id = await blank();
    await refuses(() => svc.rollStartingGil(id, ownerActor), 409);
    await svc.saveDraft(
      id,
      { fields: { classId: String(dragoon._id) } },
      ownerActor
    );
    const first = await svc.rollStartingGil(id, ownerActor);
    assert.equal(first.alreadyRolled, false);
    assert.equal(first.formula, '1d100');
    assert.ok(first.sums[0] >= 1 && first.sums[0] <= 100);
    const second = await svc.rollStartingGil(id, ownerActor);
    assert.equal(second.alreadyRolled, true);
    assert.equal(second.sums[0], first.sums[0]);
    assert.equal((await raw(id)).equipment.gil, first.sums[0]);
    assert.equal(await Roll.countDocuments({ playerId: id, kind: 'gil' }), 1);
  });

  // ── Perícias ──
  await test('skills: only the class list, at most N', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: { classId: String(mage._id) } },
      ownerActor
    );
    const info = (await svc.getCreation(id, ownerActor)).context.klass!;
    assert.equal(info.skills.n, 2);
    await refuses(() =>
      svc.saveDraft(id, { skills: ['Acrobacia'] }, ownerActor)
    );
    const [a, b, c] = info.skills.list;
    await refuses(() => svc.saveDraft(id, { skills: [a, b, c] }, ownerActor));
    const ok = await svc.saveDraft(id, { skills: [a, b] }, ownerActor);
    assert.equal(
      (ok.player?.proficiencies?.skills as { name: string }[]).length,
      2
    );
  });

  // ── Ficha completa: derivados, envio, aprovação, devolução ──
  const complete = async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      {
        fields: {
          name: 'Zz Completa',
          raceId: String(centauros._id),
          classId: String(mage._id),
        },
        creation: { method: 'standardArray' },
      },
      ownerActor
    );
    await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 8, dex: 12, con: 14, int: 10, wis: 15, cha: 13 },
          extraLanguage: 'Élfico',
        },
      },
      ownerActor
    );
    const ctx = (await svc.getCreation(id, ownerActor)).context.klass!;
    await svc.saveDraft(
      id,
      { skills: ctx.skills.list.slice(0, 2) },
      ownerActor
    );
    const spells = await Spell.find({ classIds: mage._id })
      .select('circle')
      .lean<{ _id: unknown; circle: number }[]>();
    const cantrips = spells
      .filter((s) => s.circle === 0)
      .slice(0, ctx.cantripsKnown);
    const first = spells
      .filter((s) => s.circle === 1)
      .slice(0, ctx.preparedLimit);
    assert.equal(cantrips.length, ctx.cantripsKnown, 'o grimório tem truques');
    assert.equal(
      first.length,
      ctx.preparedLimit,
      'o grimório tem magias de 1º'
    );
    await svc.saveDraft(
      id,
      {
        fields: {
          playerSpellcasting: {
            spellRefs: [...cantrips, ...first].map((s) => ({
              spellId: String(s._id),
            })),
          },
        },
      },
      ownerActor
    );
    return { id, ctx };
  };

  await test('derived: totals, HP = full die + CON, DC from the class', async () => {
    const { id, ctx } = await complete();
    const s = await raw(id);
    // Centauros: FOR +2, SAB +1.
    assert.equal(s.playerStats.str.total, 10);
    assert.equal(s.playerStats.wis.total, 16);
    assert.equal(s.playerStats.con.total, 14);
    assert.equal(s.playerStats.wis.raceBonus, 1);
    // Mago Branco d6 + CON 14 (+2) = 8.
    assert.equal(ctx.hitDie, 6);
    assert.equal(s.combat.hp.value, 8);
    assert.equal(s.proficiencyBonus, 2);
    // CD = 8 + 2 + SAB (+3) = 13; ataque = 2 + 3 = 5.
    assert.equal(s.playerSpellcasting.saveDC, 13);
    assert.equal(s.playerSpellcasting.attackBonus, 5);
    assert.deepEqual(s.languages, ['Comum', 'Élfico']);
  });
  await test('submit validates the required list on the server', async () => {
    const id = await blank();
    const err = await refuses(() => svc.submitSheet(id, ownerActor), 422);
    assert.ok(err.issues && err.issues.some((i) => i.step === 'identidade'));
    const { id: full } = await complete();
    const done = await svc.submitSheet(full, ownerActor);
    assert.equal(done.status, 'submitted');
    const s = await raw(full);
    assert.equal(s.status, 'submitted');
    assert.equal(s.review.at(-1).kind, 'submit');
    assert.equal(
      (await Event.find({ playerId: full }).lean()).some(
        (e) => e.kind === 'submit'
      ),
      true
    );
  });
  await test('spells: prepared limit and cantrips enforced', async () => {
    const { id, ctx } = await complete();
    const spells = await Spell.find({ classIds: mage._id, circle: 1 })
      .select('_id')
      .lean<{ _id: unknown }[]>();
    await refuses(() =>
      svc.saveDraft(
        id,
        {
          fields: {
            playerSpellcasting: {
              spellRefs: spells
                .slice(0, ctx.preparedLimit + 1)
                .map((s) => ({ spellId: String(s._id) })),
            },
          },
        },
        ownerActor
      )
    );
  });
  await test('after submit the owner can still edit; sheet stays submitted', async () => {
    const { id } = await complete();
    await svc.submitSheet(id, ownerActor);
    const r = await svc.saveDraft(
      id,
      { fields: { backstory: 'Depois do envio' } },
      ownerActor
    );
    assert.equal(r.status, 'submitted');
    assert.equal((await raw(id)).backstory, 'Depois do envio');
  });
  await test('approve: admin only, locks the owner, admin keeps editing', async () => {
    const { id } = await complete();
    await svc.submitSheet(id, ownerActor);
    await refuses(() => svc.approveSheet(id, ownerActor), 403);
    const approved = await svc.approveSheet(id, admin);
    assert.equal(approved.status, 'approved');
    await refuses(
      () => svc.saveDraft(id, { fields: { name: 'Trocado' } }, ownerActor),
      403
    );
    await refuses(
      () =>
        svc
          .rollAttributes(id, ownerActor)
          .then(() => svc.submitSheet(id, ownerActor)),
      403
    );
    await refuses(() => svc.getCreation(id, ownerActor), 403);
    // Aprovada: nem o admin grava pelo rascunho (há o editor completo).
    await refuses(
      () => svc.saveDraft(id, { fields: { subtitle: 'Admin' } }, admin),
      409
    );
    const s = await raw(id);
    assert.equal(s.status, 'approved');
    assert.equal(s.review.at(-1).kind, 'approve');
  });
  await test('approve refuses an incomplete sheet', async () => {
    const id = await blank();
    await refuses(() => svc.approveSheet(id, admin), 422);
  });
  await test('return: notes required, steps flagged, owner can fix and resubmit', async () => {
    const { id } = await complete();
    await svc.submitSheet(id, ownerActor);
    await refuses(() => svc.returnSheet(id, { notes: '  ' }, admin));
    await refuses(() => svc.returnSheet(id, { notes: 'x' }, ownerActor), 403);
    const r = await svc.returnSheet(
      id,
      { notes: 'Falta a história.', steps: ['historia', 'nope'] },
      admin
    );
    assert.equal(r.status, 'returned');
    const s = await raw(id);
    assert.equal(s.status, 'returned');
    assert.equal(s.review.at(-1).notes, 'Falta a história.');
    assert.deepEqual(s.review.at(-1).steps, ['historia']);
    assert.equal(
      (await Event.find({ playerId: id }).lean()).some(
        (e) => e.kind === 'return'
      ),
      true
    );
    await svc.saveDraft(id, { fields: { backstory: 'Pronto.' } }, ownerActor);
    assert.equal((await svc.submitSheet(id, ownerActor)).status, 'submitted');
  });

  // ── Rodada de revisão ──
  await test('return keeps the notes out of playerevents', async () => {
    const { id } = await complete();
    await svc.submitSheet(id, ownerActor);
    await svc.returnSheet(id, { notes: 'Segredo da staff.' }, admin);
    const events = await Event.find({ playerId: id, kind: 'return' }).lean();
    assert.equal(events.length, 1);
    assert.equal(events[0].reason, 'Ficha devolvida');
    assert.ok(!JSON.stringify(events).includes('Segredo'));
    assert.equal((await raw(id)).review.at(-1).notes, 'Segredo da staff.');
    const stale = await Event.countDocuments({
      kind: 'return',
      reason: { $ne: 'Ficha devolvida' },
    });
    assert.equal(stale, 0);
  });

  await test('public readers strip creation/review and hide unsent drafts', async () => {
    const { redactPlayer } = await import('../db/players/redact');
    const base = {
      _id: 'x',
      slug: 's',
      name: 'Nome',
      race: 'R',
      ownerUsername: 'o',
      creation: { base: {} },
      review: [{ notes: 'n' }],
    };
    for (const staff of [true, false]) {
      const approved = redactPlayer(
        { ...base, status: 'approved' },
        staff
      ) as Record<string, unknown>;
      assert.equal(approved.creation, undefined);
      assert.equal(approved.review, undefined);
      assert.equal(approved.name, 'Nome');
    }
    const legacy = redactPlayer({ ...base }, false) as Record<string, unknown>;
    assert.equal(legacy.name, 'Nome');
    for (const status of ['blank', 'draft']) {
      const hidden = redactPlayer({ ...base, status }, false);
      assert.deepEqual(hidden, {
        _id: 'x',
        slug: 's',
        status,
        ownerUsername: 'o',
      });
      const forStaff = redactPlayer({ ...base, status }, true) as Record<
        string,
        unknown
      >;
      assert.equal(forStaff.name, 'Nome');
      assert.equal(forStaff.creation, undefined);
    }
    const sent = redactPlayer(
      { ...base, status: 'submitted' },
      false
    ) as Record<string, unknown>;
    assert.equal(sent.name, 'Nome');
  });
  await test('unique-race holder hides the name of an unsent draft', async () => {
    const { getUniqueRaceHolders } = await import('../services/race.service');
    let holder = (await getUniqueRaceHolders()).get(String(estelar._id));
    if (!holder) {
      const id = await blank();
      await svc.saveDraft(
        id,
        { fields: { name: 'Zz Oculta', raceId: String(estelar._id) } },
        ownerActor
      );
      holder = (await getUniqueRaceHolders()).get(String(estelar._id));
    }
    assert.ok(holder);
    // O dono é uma ficha de teste em rascunho: nome e endereço não saem.
    assert.equal(holder.name, '');
    assert.equal(holder.slug, '');
  });

  await test('transitions are state-checked and not duplicated', async () => {
    const { id } = await complete();
    await refuses(() => svc.returnSheet(id, { notes: 'x' }, admin), 409);
    const [a, b] = await Promise.all([
      svc.submitSheet(id, ownerActor),
      svc.submitSheet(id, ownerActor),
    ]);
    assert.equal(a.status, 'submitted');
    assert.equal(b.status, 'submitted');
    assert.equal((await svc.submitSheet(id, ownerActor)).status, 'submitted');
    const s = await raw(id);
    assert.equal(
      s.review.filter((r: { kind: string }) => r.kind === 'submit').length,
      1
    );
    assert.equal(
      await Event.countDocuments({ playerId: id, kind: 'submit' }),
      1
    );
    await svc.approveSheet(id, admin);
    await refuses(() => svc.approveSheet(id, admin), 409);
    await refuses(() => svc.returnSheet(id, { notes: 'x' }, admin), 409);
    assert.equal(
      (await raw(id)).review.filter(
        (r: { kind: string }) => r.kind === 'approve'
      ).length,
      1
    );
    assert.equal(
      await Event.countDocuments({ playerId: id, kind: 'approve' }),
      1
    );
  });
  await test('the owner write is filtered by status (matchedCount 0 -> 409)', async () => {
    const id = await blank();
    await svc.saveDraft(id, { fields: { name: 'Zz Corrida' } }, ownerActor);
    // O estado muda entre a leitura e a escrita: aprova por baixo, uma vez.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const real = Player.updateOne.bind(Player) as any;
    let first = true;
    (Player as any).updateOne = (filter: any, ...rest: unknown[]) => {
      if (first) {
        first = false;
        return real({ _id: filter._id }, { $set: { status: 'approved' } }).then(
          () => real(filter, ...rest)
        );
      }
      return real(filter, ...rest);
    };
    try {
      await refuses(
        () => svc.saveDraft(id, { fields: { subtitle: 'Tarde' } }, ownerActor),
        409
      );
    } finally {
      (Player as any).updateOne = real;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    assert.equal((await raw(id)).subtitle, undefined);
  });

  await test('draft writes are refused above level 1', async () => {
    const id = await blank();
    await svc.saveDraft(id, { fields: { name: 'Zz Nivel' } }, ownerActor);
    await Player.updateOne({ _id: id }, { $set: { level: 2 } });
    await refuses(
      () => svc.saveDraft(id, { fields: { subtitle: 'x' } }, ownerActor),
      409
    );
    await refuses(
      () => svc.saveDraft(id, { fields: { subtitle: 'x' } }, admin),
      409
    );
    await refuses(() => svc.rollAttributes(id, ownerActor), 409);
    await refuses(() => svc.submitSheet(id, ownerActor), 409);
  });

  await test('attribute roll relinks a lost rollId without wiping the base', async () => {
    const id = await blank();
    const first = await svc.rollAttributes(id, ownerActor);
    const base = {
      str: first.sums[0],
      dex: first.sums[1],
      con: first.sums[2],
      int: first.sums[3],
      wis: first.sums[4],
      cha: first.sums[5],
    };
    await svc.saveDraft(id, { creation: { base } }, ownerActor);
    await Player.updateOne({ _id: id }, { $unset: { 'creation.rollId': '' } });
    const again = await svc.rollAttributes(id, ownerActor);
    assert.equal(again.alreadyRolled, true);
    assert.equal(again.rollId, first.rollId);
    const s = await raw(id);
    assert.equal(s.creation.rollId, first.rollId);
    assert.equal(s.creation.method, 'roll');
    assert.deepEqual(s.creation.base, base);
  });

  await test('image: owner only uploaded URLs, admin may use http(s)', async () => {
    const id = await blank();
    await refuses(() =>
      svc.saveDraft(
        id,
        { fields: { image: 'https://evil.example/x.png' } },
        ownerActor
      )
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { fields: { image: 'javascript:alert(1)' } },
        ownerActor
      )
    );
    await refuses(() =>
      svc.saveDraft(id, { fields: { image: 'javascript:alert(1)' } }, admin)
    );
    const up = '/api/images/' + 'a'.repeat(24);
    await svc.saveDraft(id, { fields: { image: up } }, ownerActor);
    assert.equal((await raw(id)).image, up);
    await svc.saveDraft(
      id,
      { fields: { image: 'https://ok.example/x.png' } },
      admin
    );
    assert.equal((await raw(id)).image, 'https://ok.example/x.png');
  });

  await test('clearing the race also clears the race text; skills are capped', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: { raceId: String(centauros._id) } },
      ownerActor
    );
    assert.ok((await raw(id)).race);
    await svc.saveDraft(id, { fields: { raceId: null } }, ownerActor);
    const s = await raw(id);
    assert.equal(s.raceId ?? null, null);
    assert.equal(s.race, undefined);
    await svc.saveDraft(
      id,
      { fields: { classId: String(mage._id) } },
      ownerActor
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { skills: Array.from({ length: 30 }, (_, i) => `P${i}`) },
        ownerActor
      )
    );
    await refuses(() =>
      svc.saveDraft(id, { skills: ['x'.repeat(41)] }, ownerActor)
    );
  });

  await test('saveDraft keeps what another write put in creation (dot paths)', async () => {
    const id = await blank();
    await svc.saveDraft(id, { creation: { method: 'pointBuy' } }, ownerActor);
    await Player.updateOne(
      { _id: id },
      { $set: { 'creation.startingGil': 77 } }
    );
    await svc.saveDraft(
      id,
      {
        fields: { equipment: { backpack: 'Corda' } },
        creation: { extraLanguage: 'Élfico' },
      },
      ownerActor
    );
    const s = await raw(id);
    assert.equal(s.creation.startingGil, 77);
    assert.equal(s.creation.method, 'pointBuy');
    assert.equal(s.creation.extraLanguage, 'Élfico');
    assert.equal(s.equipment.backpack, 'Corda');
  });

  await test('gil is locked PER CLASS: switch, roll again, come back to the first roll', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: { classId: String(dragoon._id) } },
      ownerActor
    );
    const g1 = await svc.rollStartingGil(id, ownerActor);
    assert.equal(g1.classSlug, 'dragoon');
    assert.equal((await raw(id)).equipment.gil, g1.sums[0]);
    await svc.saveDraft(
      id,
      { fields: { classId: String(mage._id) } },
      ownerActor
    );
    let s = await raw(id);
    assert.equal(s.equipment.gil, undefined);
    assert.equal(s.creation.startingGil, undefined);
    assert.equal(await Roll.countDocuments({ playerId: id, kind: 'gil' }), 1);
    const g2 = await svc.rollStartingGil(id, ownerActor);
    assert.equal(g2.alreadyRolled, false);
    assert.equal(g2.classSlug, 'mago-branco');
    assert.notEqual(g2.rollId, g1.rollId);
    assert.equal((await raw(id)).equipment.gil, g2.sums[0]);
    assert.equal((await svc.rollStartingGil(id, ownerActor)).rollId, g2.rollId);
    await svc.saveDraft(
      id,
      { fields: { classId: String(dragoon._id) } },
      ownerActor
    );
    s = await raw(id);
    assert.equal(s.equipment.gil, g1.sums[0]);
    assert.equal(s.creation.startingGil, g1.sums[0]);
    const back = await svc.rollStartingGil(id, ownerActor);
    assert.equal(back.alreadyRolled, true);
    assert.equal(back.rollId, g1.rollId);
    const view = await svc.getCreation(id, admin);
    assert.equal(view.rolls.filter((r) => r.kind === 'gil').length, 2);
    assert.equal(await Roll.countDocuments({ playerId: id, kind: 'gil' }), 2);
    assert.ok(!view.issues.some((i) => /não confere/.test(i.message)));
    await Player.updateOne({ _id: id }, { $set: { 'equipment.gil': 9999 } });
    const bad = await svc.getCreation(id, admin);
    assert.ok(
      bad.issues.some(
        (i) => i.kind === 'required' && /não confere/.test(i.message)
      )
    );
  });
  await test('submit/approve refuse a gil that does not match the class roll', async () => {
    const { id } = await complete();
    await svc.rollStartingGil(id, ownerActor);
    await Player.updateOne({ _id: id }, { $set: { 'equipment.gil': 123456 } });
    const err = await refuses(() => svc.submitSheet(id, ownerActor), 422);
    assert.ok(err.issues?.some((i) => /não confere/.test(i.message)));
    await refuses(() => svc.approveSheet(id, admin), 422);
  });

  await test('level-up refuses a sheet still in creation', async () => {
    const lv = await import('../services/levelUp.service');
    const { id } = await complete();
    await Player.updateOne(
      { _id: id },
      { $set: { 'experience.current': 900 } }
    );
    await assert.rejects(() => lv.getLevelPlan(id, ownerActor), /em criação/);
    await assert.rejects(() => lv.rollHp(id, ownerActor), /em criação/);
    await assert.rejects(
      () =>
        lv.sealLevel(
          id,
          {
            features: [],
            archetypeFeatures: [],
            classTalentKeys: [],
            spellIds: [],
            hp: { mode: 'fixed' },
          },
          ownerActor
        ),
      /em criação/
    );
    await svc.submitSheet(id, ownerActor);
    await assert.rejects(() => lv.getLevelPlan(id, ownerActor), /em criação/);
    await svc.approveSheet(id, admin);
    assert.equal((await lv.getLevelPlan(id, ownerActor)).level, 2);
  });

  // ── Regra do dono: na própria ficha, só jogadora ──
  await test('owner wins over role: admin/editor own sheet is player-only', async () => {
    const lv = await import('../services/levelUp.service');
    const { sheetFlags } = await import('../lib/sheetAccess');
    const id = await blank();
    const as = async (role: string, forumUserId: number) =>
      lv.getAccess(id, { forumUserId, role });
    // Não-dona: admin e editor moderam; viewer não.
    assert.deepEqual(await as('admin', 999001), {
      isOwner: false,
      isStaff: true,
      hasStaffRole: true,
    });
    assert.equal((await as('editor', 999001)).isStaff, true);
    assert.equal((await as('viewer', 999001)).isStaff, false);
    // Dona: o papel não vale.
    const ownAdmin = await as('admin', owner.forumUserId);
    assert.deepEqual(ownAdmin, {
      isOwner: true,
      isStaff: false,
      hasStaffRole: true,
    });
    const ownEditor = await as('editor', owner.forumUserId);
    assert.deepEqual(ownEditor, {
      isOwner: true,
      isStaff: false,
      hasStaffRole: true,
    });
    assert.deepEqual(sheetFlags('editor', true), ownEditor);
  });

  const asOwnerWithRole = (role: string) => ({
    username: owner.username,
    forumUserId: owner.forumUserId,
    ...({ isOwner: true, isStaff: false, hasStaffRole: true } as const),
    role,
  });

  for (const role of ['admin', 'editor']) {
    await test(`${role}-owner: wizard and submit as a player, but no approve/return of own sheet`, async () => {
      const actor = asOwnerWithRole(role);
      const { id } = await complete();
      // O wizard funciona como jogadora.
      await svc.saveDraft(id, { fields: { subtitle: 'Eu mesma' } }, actor);
      // A imagem segue a regra da dona (nada de link externo).
      await refuses(() =>
        svc.saveDraft(
          id,
          { fields: { image: 'https://x.example/a.png' } },
          actor
        )
      );
      await svc.submitSheet(id, actor);
      // Aprovar e devolver a própria ficha: recusado, com a mensagem clara.
      const a = await refuses(() => svc.approveSheet(id, actor), 403);
      assert.match(a.message, /Outro membro da staff/);
      const r = await refuses(
        () => svc.returnSheet(id, { notes: 'x' }, actor),
        403
      );
      assert.match(r.message, /Outro membro da staff/);
      assert.equal((await raw(id)).status, 'submitted');
      // Outro membro da staff modera.
      const other = {
        username: 'moderador',
        forumUserId: 999002,
        isOwner: false,
        isStaff: true,
        hasStaffRole: true,
      };
      assert.equal(
        (await svc.returnSheet(id, { notes: 'Ajuste.' }, other)).status,
        'returned'
      );
      await svc.saveDraft(id, { fields: { subtitle: 'Ajustei' } }, actor);
      await svc.submitSheet(id, actor);
      assert.equal((await svc.approveSheet(id, other)).status, 'approved');
    });

    await test(`${role}-owner: no XP, reopen or edit of own sealed levels; level-up as player`, async () => {
      const lv = await import('../services/levelUp.service');
      const actor = asOwnerWithRole(role);
      const other = {
        username: 'moderador',
        forumUserId: 999002,
        isOwner: false,
        isStaff: true,
        hasStaffRole: true,
      };
      const { id } = await complete();
      await svc.submitSheet(
        id,
        other.isStaff ? { ...actor, isOwner: true, isStaff: false } : actor
      );
      await svc.approveSheet(id, other);
      const grant = {
        amount: 600,
        reason: 'Teste',
        lines: [{ line: 'x', value: 600 }],
      };
      const g = await assert.rejects(
        () => lv.grantXp(id, grant, actor),
        /Outro membro da staff/
      );
      void g;
      assert.equal((await raw(id)).experience.current, 0);
      // A staff de fora concede (editor ou admin).
      await lv.grantXp(id, grant, other);
      // Como jogadora, sobe de nível com os limites de dona (vida manual limitada).
      const plan = await lv.getLevelPlan(id, actor);
      assert.equal(plan.level, 2);
      const choices = {
        features: plan.featureChoices.map((g2) => g2.options[0].name),
        archetypeFeatures: [],
        classTalentKeys: [],
        spellIds: [],
        hp: { mode: 'fixed' as const },
      };
      void choices;
      await assert.rejects(
        () => lv.reopenLevel(id, 2, 'x', actor),
        /Outro membro da staff/
      );
      await assert.rejects(
        () => lv.editSealedLevel(id, 2, {} as never, 'x', actor),
        /Outro membro da staff/
      );
    });
  }

  await test('editor on someone else’s sheet is staff: approve, return, XP', async () => {
    const lv = await import('../services/levelUp.service');
    const { sheetFlags } = await import('../lib/sheetAccess');
    const editor = {
      username: 'editor-teste',
      forumUserId: 999003,
      ...sheetFlags('editor', false),
    };
    const { id } = await complete();
    await svc.submitSheet(id, ownerActor);
    assert.equal(
      (await svc.returnSheet(id, { notes: 'Do editor.' }, editor)).status,
      'returned'
    );
    await svc.saveDraft(id, { fields: { subtitle: 'ok' } }, ownerActor);
    await svc.submitSheet(id, ownerActor);
    assert.equal((await svc.approveSheet(id, editor)).status, 'approved');
    await lv.grantXp(
      id,
      { amount: 100, reason: 'Editor', lines: [{ line: 'x', value: 100 }] },
      editor
    );
    assert.equal((await raw(id)).experience.current, 100);
    // O viewer nunca modera.
    const viewer = {
      username: 'v',
      forumUserId: 999004,
      ...sheetFlags('viewer', false),
    };
    await refuses(() => svc.approveSheet(id, viewer), 403);
  });

  await test('staff can create a blank sheet for themselves and fill it as a player', async () => {
    const made = await svc.createBlankSheet(owner.forumUserId, admin);
    await mark(made.id);
    const actor = asOwnerWithRole('admin');
    const r = await svc.saveDraft(
      made.id,
      { fields: { name: 'Zz Minha' } },
      actor
    );
    assert.equal(r.status, 'draft');
    await refuses(() => svc.approveSheet(made.id, actor), 403);
  });

  // ── Mestiço dominante e concessões raciais ──
  const mesticos = await race('mesticos');
  const elfos = await race('elfos');
  assert.ok(mesticos && elfos);
  const { default: TalentM } = await import('../db/talents/talents');
  const { requiredLevel } = await import('../lib/talentPrerequisite');
  const freeTalents = (
    await TalentM.find()
      .select('slug prerequisites')
      .limit(80)
      .lean<{ slug: string; prerequisites?: string }[]>()
  ).filter((t) => requiredLevel(t.prerequisites, undefined) <= 1);
  assert.ok(freeTalents.length >= 2, 'precisa de talentos gerais de nível 1');
  const gated = (
    await TalentM.find()
      .select('slug prerequisites')
      .lean<{ slug: string; prerequisites?: string }[]>()
  ).find((t) => requiredLevel(t.prerequisites, undefined) > 1);

  const mixed = (dominant: string) => ({
    raceId: String(mesticos._id),
    raceChoice: { parents: ['elfos', 'humanos'], dominantParent: dominant },
  });

  await test('mestiço, Elfos dominant: DEX+2 only, no free picks', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: mixed('elfos'), creation: { method: 'standardArray' } },
      ownerActor
    );
    await refuses(() =>
      svc.saveDraft(id, { creation: { racialPicks: ['str'] } }, ownerActor)
    );
    await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
        },
      },
      ownerActor
    );
    const s = await raw(id);
    assert.equal(s.playerStats.dex.raceBonus, 2);
    assert.equal(s.playerStats.dex.total, 16);
    assert.equal(s.playerStats.wis.raceBonus, 0, 'sem o +1 da sub-raça');
  });
  await test('mestiço, Humanos dominant: two free +1 on different attributes; changing the dominant clears them', async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      { fields: mixed('humanos'), creation: { method: 'standardArray' } },
      ownerActor
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { creation: { racialPicks: ['str', 'str'] } },
        ownerActor
      )
    );
    await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
          racialPicks: ['str', 'cha'],
        },
      },
      ownerActor
    );
    let s = await raw(id);
    assert.equal(s.playerStats.str.total, 16);
    assert.equal(s.playerStats.cha.total, 9);
    const issues = (await svc.getCreation(id, ownerActor)).issues;
    assert.ok(!issues.some((i) => i.step === 'atributos'));
    // Sem concessão própria: nada de talento/versátil vindo dos pais.
    assert.ok(!issues.some((i) => /racial|versátil/i.test(i.message)));
    await svc.saveDraft(id, { fields: mixed('elfos') }, ownerActor);
    s = await raw(id);
    assert.deepEqual(s.creation.racialPicks, []);
    assert.equal(s.playerStats.dex.raceBonus, 2);
  });

  const humano = async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      {
        fields: {
          name: 'Zz Humana',
          raceId: String(humanos._id),
          classId: String(mage._id),
        },
        creation: { method: 'standardArray' },
      },
      ownerActor
    );
    await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 8, dex: 12, con: 14, int: 10, wis: 15, cha: 13 },
          racialPicks: ['dex', 'wis'],
        },
      },
      ownerActor
    );
    const info = (await svc.getCreation(id, ownerActor)).context.klass!;
    await svc.saveDraft(
      id,
      { skills: info.skills.list.slice(0, 2) },
      ownerActor
    );
    const spells = await Spell.find({ classIds: mage._id })
      .select('circle')
      .lean<{ _id: unknown; circle: number }[]>();
    await svc.saveDraft(
      id,
      {
        fields: {
          playerSpellcasting: {
            spellRefs: [
              ...spells
                .filter((s) => s.circle === 0)
                .slice(0, info.cantripsKnown),
              ...spells
                .filter((s) => s.circle === 1)
                .slice(0, info.preparedLimit),
            ].map((s) => ({ spellId: String(s._id) })),
          },
        },
      },
      ownerActor
    );
    return { id, info };
  };

  await test('humano comum: 1 versátil + 1 talento + 1 perícia extra, required to submit', async () => {
    const { id, info } = await humano();
    const view = await svc.getCreation(id, ownerActor);
    const req = view.issues
      .filter((i) => i.kind === 'required')
      .map((i) => i.message);
    assert.ok(
      req.some((m) => /perícia\(s\) racial/.test(m)),
      req.join('|')
    );
    assert.ok(req.some((m) => /versátil/.test(m)));
    assert.ok(req.some((m) => /talento racial/.test(m)));
    await refuses(() => svc.submitSheet(id, ownerActor), 422);
    // Validações do servidor.
    // A perícia da classe também pela raça vira especialização (aceita).
    const dupe = info.skills.list[0];
    await svc.saveDraft(id, { grants: { skills: [dupe] } }, ownerActor);
    await svc.saveDraft(id, { grants: { skills: [] } }, ownerActor);
    await refuses(() =>
      svc.saveDraft(id, { grants: { skills: ['Ofício'] } }, ownerActor)
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { grants: { skills: ['Furtividade', 'Natureza'] } },
        ownerActor
      )
    );
    await refuses(() =>
      svc.saveDraft(id, { grants: { talents: ['nao-existe'] } }, ownerActor)
    );
    if (gated)
      await refuses(() =>
        svc.saveDraft(id, { grants: { talents: [gated.slug] } }, ownerActor)
      );
    await refuses(() =>
      svc.saveDraft(
        id,
        { grants: { talents: [freeTalents[0].slug, freeTalents[1].slug] } },
        ownerActor
      )
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { grants: { versatile: [{ kind: 'weapon' as never, value: 'x' }] } },
        ownerActor
      )
    );
    await svc.saveDraft(
      id,
      {
        grants: {
          skills: ['Furtividade'],
          talents: [freeTalents[0].slug],
          versatile: [{ kind: 'tool', value: 'Kit de herbalismo' }],
        },
      },
      ownerActor
    );
    // Uma perícia da classe não pode repetir a racial.
    await refuses(() =>
      svc.saveDraft(
        id,
        { skills: ['Furtividade', info.skills.list[0]] },
        ownerActor
      )
    );
    const s = await raw(id);
    const skills = s.proficiencies.skills as {
      name: string;
      proficiencySources?: { source: string }[];
    }[];
    assert.ok(
      skills.some(
        (x) =>
          x.name === 'Furtividade' &&
          x.proficiencySources?.[0]?.source === 'race'
      )
    );
    assert.equal(skills.length, 3);
    assert.deepEqual(s.proficiencies.tools, ['Kit de herbalismo']);
    assert.equal(s.talents.length, 1);
    assert.equal(s.talents[0].source, 'race');
    assert.equal(s.talents[0].level, 1);
    const after = await svc.getCreation(id, ownerActor);
    assert.ok(!after.issues.some((i) => i.kind === 'required'));
    assert.equal((await svc.submitSheet(id, ownerActor)).status, 'submitted');
    assert.equal((await svc.approveSheet(id, admin)).status, 'approved');
  });
  await test('versatile language and instrument feed languages/tools; Nórdicos lose the skill grant', async () => {
    const { id } = await humano();
    await svc.saveDraft(
      id,
      {
        grants: {
          skills: ['Furtividade'],
          talents: [freeTalents[0].slug],
          versatile: [{ kind: 'language', value: 'Élfico' }],
        },
      },
      ownerActor
    );
    let s = await raw(id);
    assert.ok((s.languages as string[]).includes('Élfico'));
    // Trocar a sub-raça tira a concessão de perícia (e o que passa do total).
    await svc.saveDraft(
      id,
      {
        fields: {
          raceId: String(humanos._id),
          raceChoice: { subrace: 'nordicos' },
        },
      },
      ownerActor
    );
    s = await raw(id);
    assert.deepEqual(s.creation.grants.skills, []);
    assert.equal(
      s.proficiencies.skills.filter(
        (x: { source?: string }) => x.source === 'race'
      ).length,
      0
    );
    const view = await svc.getCreation(id, ownerActor);
    assert.ok(!view.issues.some((i) => /perícia\(s\) racial/.test(i.message)));
  });

  // ── Deslocamento da raça ──
  await test('speed is derived from the race: Fada walk 6/fly 9, Aquavista walk 7/swim 12, Lapinara empty+recommended', async () => {
    const fadas = await race('fadas');
    const yokais = await race('yokais');
    const lapinara = await race('lapinara');
    const a = await blank();
    await svc.saveDraft(
      a,
      { fields: { raceId: String(fadas._id) } },
      ownerActor
    );
    assert.deepEqual((await raw(a)).combat.speed, { walk: 6, fly: 9 });
    const b = await blank();
    await svc.saveDraft(
      b,
      {
        fields: {
          raceId: String(yokais._id),
          raceChoice: { subrace: 'aquavista' },
        },
      },
      ownerActor
    );
    assert.deepEqual((await raw(b)).combat.speed, { walk: 7, swim: 12 });
    // Trocar a sub-raça troca o deslocamento (a sub-raça sem texto herda o da raça).
    await svc.saveDraft(
      b,
      {
        fields: {
          raceId: String(yokais._id),
          raceChoice: { subrace: 'yokai-caninos' },
        },
      },
      ownerActor
    );
    assert.deepEqual((await raw(b)).combat.speed, { walk: 9 });
    const c = await blank();
    await svc.saveDraft(
      c,
      {
        fields: {
          raceId: String(lapinara._id),
          raceChoice: { subrace: lapinara.subraces[0].slug },
        },
      },
      ownerActor
    );
    assert.equal((await raw(c)).combat?.speed, undefined);
    const view = await svc.getCreation(c, ownerActor);
    assert.ok(
      view.issues.some(
        (i) => i.kind === 'recommended' && /Deslocamento/.test(i.message)
      )
    );
    assert.ok(
      !view.issues.some(
        (i) => i.kind === 'required' && /Deslocamento/.test(i.message)
      )
    );
    // Mestiço: o texto dele, não o dos pais.
    const d = await blank();
    await svc.saveDraft(d, { fields: mixed('elfos') }, ownerActor);
    assert.deepEqual((await raw(d)).combat.speed, { walk: 9 });
  });

  // ── Aprovar com ajustes ──
  const submittedSheet = async () => {
    const { id } = await complete();
    await svc.rollStartingGil(id, ownerActor);
    await svc.submitSheet(id, ownerActor);
    return id;
  };
  const otherStaff = {
    username: 'narrador',
    forumUserId: 999010,
    isOwner: false,
    isStaff: true,
    hasStaffRole: true,
  };

  await test('approve with adjustments: extra gil, skill and free-text item persist, labels (not values) in history', async () => {
    const id = await submittedSheet();
    const before = await raw(id);
    const fields = {
      equipment: {
        ...before.equipment,
        gil: 4321,
        backpack: 'Corda + Lâmina Lendária do Reino',
      },
      proficiencies: {
        ...before.proficiencies,
        skills: [
          ...before.proficiencies.skills,
          { name: 'Ofício (ferreiro)', proficient: true, value: 2 },
        ],
      },
    };
    const res = await svc.approveSheet(id, otherStaff, { fields });
    assert.equal(res.status, 'approved');
    const s = await raw(id);
    assert.equal(s.status, 'approved');
    assert.equal(s.equipment.gil, 4321);
    assert.equal(s.equipment.backpack, 'Corda + Lâmina Lendária do Reino');
    assert.ok(
      s.proficiencies.skills.some(
        (k: { name: string }) => k.name === 'Ofício (ferreiro)'
      )
    );
    // Os derivados que a staff não tocou seguem como estavam.
    assert.deepEqual(s.playerStats, before.playerStats);
    assert.equal(s.combat.hp.value, before.combat.hp.value);
    assert.deepEqual(s.languages, before.languages);
    const last = s.review.at(-1);
    assert.equal(last.kind, 'approve');
    assert.match(last.notes, /Aprovada com ajustes/);
    assert.match(last.notes, /Equipamento e gil/);
    assert.match(last.notes, /Perícias/);
    assert.ok(!/4321|Lâmina/.test(last.notes), 'só rótulos, nunca valores');
    const ev = (await Event.find({ playerId: id, kind: 'approve' }).lean())[0];
    assert.match(ev.reason, /Aprovada com ajustes: .*Equipamento e gil/);
    assert.ok(!/4321|Lâmina/.test(ev.reason));
  });

  await test('after the adjusted approval nothing re-derives over the staff extras', async () => {
    const id = await submittedSheet();
    const before = await raw(id);
    await svc.approveSheet(id, otherStaff, {
      fields: { equipment: { ...before.equipment, gil: 5555 } },
    });
    // O rascunho e as rolagens recusam ficha aprovada: o recompute não roda.
    await refuses(
      () => svc.saveDraft(id, { fields: { subtitle: 'x' } }, otherStaff),
      409
    );
    await refuses(() => svc.rollStartingGil(id, otherStaff), 409);
    const view = await svc.getCreation(id, otherStaff);
    assert.ok(
      !view.issues.some((i) => /não confere/.test(i.message)),
      'o gil de staff não vira pendência'
    );
    assert.equal((await raw(id)).equipment.gil, 5555);
    const read = await getPlayerById(id);
    assert.equal(read?.equipment?.gil, 5555);
  });

  await test('adjusted approval: owner and non-staff are refused, only submitted/returned allowed', async () => {
    const id = await submittedSheet();
    const fields = { subtitle: 'Ajuste' };
    const own = await refuses(
      () =>
        svc.approveSheet(id, { ...ownerActor, hasStaffRole: true }, { fields }),
      403
    );
    assert.match(own.message, /Outro membro da staff/);
    await refuses(() => svc.approveSheet(id, stranger, { fields }), 403);
    assert.equal((await raw(id)).status, 'submitted');
    const draftId = await blank();
    await Player.updateOne({ _id: draftId }, { $set: { status: 'draft' } });
    await refuses(() => svc.approveSheet(draftId, otherStaff, { fields }), 409);
    await refuses(() => svc.approveSheet(id, otherStaff, { fields: {} }), 400);
    // Devolvida também vale.
    await svc.returnSheet(id, { notes: 'Ajuste.' }, otherStaff);
    assert.equal(
      (await svc.approveSheet(id, otherStaff, { fields })).status,
      'approved'
    );
  });

  await test('adjusted approval: required issues still block, and nothing is written', async () => {
    const id = await blank();
    await svc.saveDraft(id, { fields: { name: 'Zz Incompleta' } }, ownerActor);
    await Player.updateOne({ _id: id }, { $set: { status: 'submitted' } });
    const err = await refuses(
      () => svc.approveSheet(id, otherStaff, { fields: { subtitle: 'x' } }),
      422
    );
    assert.ok(err.issues?.some((i) => i.kind === 'required'));
    const s = await raw(id);
    assert.equal(s.status, 'submitted');
    assert.equal(s.subtitle, undefined);
  });

  await test('adjusted approval: updatedAt in the filter, and a lost unique-race reverts status and review', async () => {
    // Um dono antigo da raça única de outros testes não pode atrapalhar.
    await Player.deleteMany({ raceId: estelar._id, description: MARK });
    // updatedAt velho: o filtro não casa (409), nada muda.
    const stale = await submittedSheet();
    await refuses(
      () =>
        svc.approveSheet(stale, otherStaff, {
          fields: { subtitle: 'x' },
          updatedAt: new Date(2000, 1, 1).toISOString(),
        }),
      409
    );
    assert.equal((await raw(stale)).status, 'submitted');

    const id = await submittedSheet();
    const before = await raw(id);
    // Perde a corrida da raça única: a guarda de depois da escrita vê duas fichas.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const real = Player.countDocuments.bind(Player) as any;
    (Player as any).countDocuments = (filter: any, ...rest: unknown[]) =>
      filter && 'raceId' in filter ? Promise.resolve(2) : real(filter, ...rest);
    try {
      await refuses(
        () =>
          svc.approveSheet(id, otherStaff, {
            fields: { raceId: String(estelar._id), raceChoice: {} },
          }),
        409
      );
    } finally {
      (Player as any).countDocuments = real;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const s = await raw(id);
    assert.equal(s.status, 'submitted', 'a ficha segue enviada, não aprovada');
    assert.equal(String(s.raceId), String(before.raceId), 'a raça voltou');
    assert.equal(
      s.review.filter((r: { kind: string }) => r.kind === 'approve').length,
      0
    );
    assert.equal(
      await Event.countDocuments({ playerId: id, kind: 'approve' }),
      0
    );
  });

  await test('adjusted approval: the status filter is in the write (state changed meanwhile -> 409)', async () => {
    const id = await submittedSheet();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const real = Player.findOneAndUpdate.bind(Player) as any;
    let first = true;
    (Player as any).findOneAndUpdate = (filter: any, ...rest: unknown[]) => {
      if (!first) return real(filter, ...rest);
      first = false;
      // Outro admin devolve a ficha entre a leitura e a escrita.
      return {
        select: (fieldsList: string) => ({
          lean: async () => {
            await Player.updateOne({ _id: id }, { $set: { status: 'draft' } });
            return real(filter, ...rest)
              .select(fieldsList)
              .lean();
          },
        }),
      };
    };
    try {
      await refuses(
        () =>
          svc.approveSheet(id, otherStaff, { fields: { subtitle: 'Corrida' } }),
        409
      );
    } finally {
      (Player as any).findOneAndUpdate = real;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const s = await raw(id);
    assert.equal(s.status, 'draft');
    assert.equal(s.subtitle, undefined);
    assert.equal(
      s.review.filter((r: { kind: string }) => r.kind === 'approve').length,
      0
    );
  });

  // ── Proficiência por fontes e especialização ──
  const espadachim = await klass('espadachim');
  const skillsOf = async (id: string) =>
    (await raw(id)).proficiencies.skills as {
      name: string;
      proficient?: boolean;
      value?: number;
      proficiencySources?: { source: string; label?: string }[];
    }[];

  const swordHuman = async () => {
    const id = await blank();
    await svc.saveDraft(
      id,
      {
        fields: {
          name: 'Zz Espadachim',
          raceId: String(humanos._id),
          classId: String(espadachim._id),
        },
        creation: { method: 'standardArray' },
      },
      ownerActor
    );
    await svc.saveDraft(
      id,
      {
        creation: {
          base: { str: 8, dex: 12, con: 14, int: 10, wis: 13, cha: 15 },
          racialPicks: ['dex', 'wis'],
        },
      },
      ownerActor
    );
    return id;
  };

  await test('Humano comum Espadachim: class Persuasão + racial Persuasão = expertise (mod + 2·PB)', async () => {
    const id = await swordHuman();
    await svc.saveDraft(
      id,
      { skills: ['Persuasão', 'Atletismo', 'Furtividade'] },
      ownerActor
    );
    await svc.saveDraft(id, { grants: { skills: ['Persuasão'] } }, ownerActor);
    const s = await raw(id);
    const persuasao = (await skillsOf(id)).find((k) => k.name === 'Persuasão')!;
    assert.deepEqual(
      persuasao.proficiencySources!.map((x) => x.source),
      ['class', 'race']
    );
    assert.equal(persuasao.proficiencySources![1].label, 'Variedade Genética');
    // CAR 15 (+2), PB 2: 2 + 2·2 = 6.
    assert.equal(persuasao.value, 2 + 2 * s.proficiencyBonus);
    const atletismo = (await skillsOf(id)).find((k) => k.name === 'Atletismo')!;
    assert.equal(atletismo.proficiencySources!.length, 1);
    assert.equal(atletismo.value, -1 + s.proficiencyBonus);
  });
  await test('skills: the class cannot repeat a skill in its own list; a third source is refused', async () => {
    const id = await swordHuman();
    const dup = await refuses(() =>
      svc.saveDraft(
        id,
        { skills: ['Persuasão', 'Persuasão', 'Atletismo'] },
        ownerActor
      )
    );
    assert.equal(dup.message, 'Você já escolheu Persuasão nesta lista.');
    await svc.saveDraft(
      id,
      { skills: ['Persuasão', 'Atletismo', 'Furtividade'] },
      ownerActor
    );
    await svc.saveDraft(id, { grants: { skills: ['Persuasão'] } }, ownerActor);
    const third = await refuses(() =>
      svc.saveDraft(
        id,
        { grants: { versatile: [{ kind: 'skill', value: 'Persuasão' }] } },
        ownerActor
      )
    );
    assert.equal(
      third.message,
      'Proficiência em Persuasão já é especialização — não acumula mais.'
    );
    // A classe também não passa de duas fontes por baixo.
    await svc.saveDraft(
      id,
      { grants: { versatile: [{ kind: 'skill', value: 'Atletismo' }] } },
      ownerActor
    );
    const lvl = (await skillsOf(id)).find((k) => k.name === 'Atletismo')!;
    assert.equal(lvl.proficiencySources!.length, 2);
  });
  await test('the two racial grants on one skill = expertise (different sources)', async () => {
    const id = await swordHuman();
    await svc.saveDraft(
      id,
      { skills: ['Persuasão', 'Atletismo', 'Furtividade'] },
      ownerActor
    );
    await svc.saveDraft(
      id,
      {
        grants: {
          skills: ['Natureza'],
          versatile: [{ kind: 'skill', value: 'Natureza' }],
        },
      },
      ownerActor
    );
    const nat = (await skillsOf(id)).find((k) => k.name === 'Natureza')!;
    assert.deepEqual(
      nat.proficiencySources!.map((x) => x.label),
      ['Versatilidade Adaptativa', 'Variedade Genética']
    );
  });

  await test('staff sets expertise directly (no other source), removes a class proficiency, keeps flat bonuses', async () => {
    const lv = await import('../services/levelUp.service');
    void lv;
    const { updatePlayerById } = await import('../services/player.service');
    const { normalizeSkills } = await import('../services/sheetEdit');
    const { id } = await complete();
    await svc.submitSheet(id, ownerActor);
    await svc.approveSheet(id, admin);
    const before = await raw(id);
    const pb = before.proficiencyBonus;
    const edited = {
      proficiencies: {
        ...before.proficiencies,
        skills: [
          // Sem outra fonte: o narrador dá a especialização de uma vez (e mais, que é cortado em 2).
          {
            name: 'Furtividade',
            proficient: true,
            proficiencySources: [
              { source: 'staff' },
              { source: 'staff' },
              { source: 'staff' },
            ],
            bonus: 2,
            bonuses: [{ value: 2, source: 'Presente do reino' }],
            value: 3 + 2 * pb + 2,
          },
          // Tira a proficiência da classe.
          ...before.proficiencies.skills
            .slice(1)
            .map((k: Record<string, unknown>) => ({ ...k })),
        ],
      },
    };
    normalizeSkills(edited as never);
    await updatePlayerById(id, edited as never);
    const s = (await skillsOf(id)).find(
      (k) => k.name === 'Furtividade'
    )! as never as {
      proficiencySources: unknown[];
      bonus: number;
      value: number;
    };
    assert.equal(s.proficiencySources.length, 2, 'o teto é o nível 2');
    assert.equal(s.bonus, 2);
    assert.equal(s.value, 3 + 2 * pb + 2, 'o bônus fixo soma por fora');
    const gone = before.proficiencies.skills[0].name;
    assert.ok(!(await skillsOf(id)).some((k) => k.name === gone));
  });
  await test('adjusted approval accepts staff expertise directly', async () => {
    const id = await submittedSheet();
    const before = await raw(id);
    await svc.approveSheet(id, otherStaff, {
      fields: {
        proficiencies: {
          ...before.proficiencies,
          skills: [
            ...before.proficiencies.skills,
            {
              name: 'Natureza',
              proficient: true,
              proficiencySources: [{ source: 'staff' }, { source: 'staff' }],
              value: 9,
            },
          ],
        },
      },
    });
    const nat = (await skillsOf(id)).find((k) => k.name === 'Natureza')!;
    assert.equal(nat.proficiencySources!.length, 2);
    assert.equal(nat.value, 9);
  });

  await test('creation: staff applies expertise directly, outside any source; the player cannot', async () => {
    const id = await swordHuman();
    await svc.saveDraft(
      id,
      { skills: ['Persuasão', 'Atletismo', 'Furtividade'] },
      ownerActor
    );
    // A jogadora (e a dona com papel de staff) não aplica direto.
    await refuses(
      () =>
        svc.saveDraft(
          id,
          { staffSkills: [{ name: 'Natureza', level: 2 }] },
          ownerActor
        ),
      403
    );
    await refuses(
      () =>
        svc.saveDraft(
          id,
          { staffSkills: [{ name: 'Natureza', level: 2 }] },
          { ...ownerActor, hasStaffRole: true }
        ),
      403
    );
    // A staff: especialização numa perícia sem nenhuma fonte.
    await svc.saveDraft(
      id,
      {
        staffSkills: [
          { name: 'Natureza', level: 2 },
          // Sobe a da classe para 2 (classe + narrador) e tira outra da classe.
          { name: 'Persuasão', level: 2 },
          { name: 'Atletismo', level: 0 },
        ],
      },
      admin
    );
    const s = await raw(id);
    const by = (n: string) =>
      (
        s.proficiencies.skills as {
          name: string;
          value: number;
          proficiencySources: { source: string }[];
        }[]
      ).find((k) => k.name === n);
    assert.deepEqual(
      by('Natureza')!.proficiencySources.map((x) => x.source),
      ['staff', 'staff']
    );
    assert.equal(by('Natureza')!.value, 0 + 2 * s.proficiencyBonus); // INT 10 (+0)
    assert.deepEqual(
      by('Persuasão')!.proficiencySources.map((x) => x.source),
      ['class', 'staff']
    );
    assert.equal(
      (by('Atletismo') as { proficient?: boolean }).proficient,
      false,
      'a staff tirou a proficiência da classe'
    );
    assert.equal(
      (by('Atletismo') as { staffOverride?: boolean }).staffOverride,
      true,
      'a remoção fica marcada'
    );
    assert.deepEqual(by('Atletismo')!.proficiencySources, []);
    assert.equal(by('Furtividade')!.proficiencySources.length, 1);
    // O ajuste não conta como pendência nem bloqueia o envio.
    const view = await svc.getCreation(id, admin);
    assert.ok(
      !view.issues.some(
        (i) =>
          i.step === 'pericias' &&
          i.kind === 'required' &&
          /especializa/.test(i.message)
      )
    );
    assert.deepEqual(view.creation.staffSkills!.map((x) => x.name).sort(), [
      'Atletismo',
      'Natureza',
      'Persuasão',
    ]);
    // Nível inválido ou perícia fora das 18: recusado.
    await refuses(() =>
      svc.saveDraft(
        id,
        { staffSkills: [{ name: 'Natureza', level: 3 }] },
        admin
      )
    );
    await refuses(() =>
      svc.saveDraft(
        id,
        { staffSkills: [{ name: 'Inventada', level: 1 }] },
        admin
      )
    );
    // A dona segue com a regra dela: a classe não repete na própria lista.
    await refuses(() =>
      svc.saveDraft(
        id,
        { skills: ['Persuasão', 'Persuasão', 'Atletismo'] },
        ownerActor
      )
    );
    // E o teto: por cima de duas fontes, o narrador fica em 2.
    await svc.saveDraft(id, { grants: { skills: ['Persuasão'] } }, ownerActor);
    const capped = (await raw(id)).proficiencies.skills.find(
      (k: { name: string }) => k.name === 'Persuasão'
    );
    assert.equal(capped.proficiencySources.length, 2);
  });

  await test('staff zeroing is definitive: the player changes picks and class, the skill stays zero; staff expertise stays', async () => {
    const id = await swordHuman();
    await svc.saveDraft(
      id,
      { skills: ['Persuasão', 'Atletismo', 'Furtividade'] },
      ownerActor
    );
    await svc.saveDraft(
      id,
      {
        staffSkills: [
          { name: 'Persuasão', level: 0 },
          { name: 'Acrobacia', level: 2 },
        ],
      },
      admin
    );
    const get = async (n: string) =>
      (
        (await raw(id)).proficiencies.skills as {
          name: string;
          proficient: boolean;
          staffOverride?: boolean;
          proficiencySources: unknown[];
        }[]
      ).find((k) => k.name === n);
    assert.equal((await get('Persuasão'))!.proficient, false);
    // A dona troca as escolhas e continua pedindo Persuasão: segue zerada.
    await svc.saveDraft(
      id,
      { skills: ['Persuasão', 'Intimidação', 'Percepção'] },
      ownerActor
    );
    assert.equal((await get('Persuasão'))!.proficient, false);
    assert.equal((await get('Persuasão'))!.staffOverride, true);
    assert.equal((await get('Intimidação'))!.proficiencySources.length, 1);
    // Troca de classe (que zera as escolhas dela) e volta: o ajuste fica.
    const cav = await klass('cavaleiro');
    await svc.saveDraft(
      id,
      { fields: { classId: String(cav._id) } },
      ownerActor
    );
    await svc.saveDraft(id, { skills: ['Persuasão', 'Atletismo'] }, ownerActor);
    assert.equal(
      (await get('Persuasão'))!.proficient,
      false,
      'a classe nova dá Persuasão, a staff zerou'
    );
    assert.equal(
      (await get('Acrobacia'))!.proficiencySources.length,
      2,
      'a especialização da staff fica'
    );
    assert.equal((await raw(id)).creation.staffSkills.length, 2);
  });

  await cleanup();
  const left = await Player.countDocuments({ description: MARK });
  assert.equal(left, 0, 'sobraram fichas de teste');
  console.log(`\n${passed} ok`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
