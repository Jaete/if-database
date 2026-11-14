/**
 * Subida de nível contra o banco REAL, só em fichas temporárias (slug
 * `zz-test-*`). Roda com `ALLOW_DB_TESTS=1 npm run test:levelup:db`: sem a
 * variável, recusa. As fichas são apagadas antes e depois, e também em
 * SIGINT/SIGTERM. Usa classes que ninguém tem (`playerCount` 0), e nunca toca
 * nas fichas de verdade.
 */
import 'dotenv/config';
import assert from 'node:assert/strict';
import type { Types } from 'mongoose';
import { connectDB } from '../lib/db';
import type { ILevelPlan, ISealChoices } from '../lib/levelUp';
import { earnedLevel } from '../lib/xp';

if (process.env.ALLOW_DB_TESTS !== '1') {
  console.error('Recusado: este teste grava no banco. Use ALLOW_DB_TESTS=1.');
  process.exit(1);
}

type Doc = Record<string, unknown> & {
  level: number;
  proficiencyBonus?: number;
  experience: { current: number };
  combat: { hp: { value: number } };
  featureChoices?: { level: number; name: string }[];
  playerSpellcasting?: { spellRefs?: { spellId: string }[] };
  levelLocks?: { level: number; status: string }[];
};

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

const OWNER = 987654321;
const admin = {
  username: 'admin-teste',
  forumUserId: 1,
  isStaff: true,
  isOwner: false,
};
const owner = {
  username: 'dono-teste',
  forumUserId: OWNER,
  isStaff: false,
  isOwner: true,
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
  const { default: Event } = await import('../db/playerProgress/playerEvents');
  const { default: Roll } = await import('../db/playerProgress/hpRolls');
  const svc = await import('../services/levelUp.service');
  const { parseHitDie } = await import('../lib/levelUp');

  const cleanup = async () => {
    const ps = await Player.find({ slug: /^zz-test-/ })
      .select('_id')
      .lean();
    for (const p of ps) {
      await Event.deleteMany({ playerId: p._id });
      await Roll.deleteMany({ playerId: p._id });
    }
    await Player.deleteMany({ slug: /^zz-test-/ });
  };
  for (const sig of ['SIGINT', 'SIGTERM'] as const) {
    process.on(sig, () => {
      void cleanup().finally(() => process.exit(130));
    });
  }
  await cleanup();

  const stats = (v: number) => ({
    base: v,
    raceBonus: 0,
    classBonus: 0,
    total: v,
    modifier: Math.floor((v - 10) / 2),
  });
  const create = async (
    classId: unknown,
    level: number,
    extra: Record<string, unknown> = {}
  ) => {
    const p = (await Player.create({
      slug: `zz-test-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      name: 'Teste Temporário',
      race: 'Humano',
      gender: 'x',
      class: 'Teste',
      classId: String(classId),
      level,
      experience: { current: 0, nextLevel: 0 },
      proficiencyBonus: 2,
      combat: { hp: { value: 40, formula: '' }, ac: { value: 15 } },
      playerStats: {
        str: stats(12),
        dex: stats(12),
        con: stats(14),
        int: stats(12),
        wis: stats(12),
        cha: stats(12),
      },
      ownerForumUserId: OWNER,
      ownerUsername: 'dono-teste',
      talents: [],
      archetype: { features: [] },
      ...extra,
    })) as unknown as { _id: Types.ObjectId };
    return String(p._id);
  };
  const fresh = (id: string) =>
    Player.findById(id)
      .lean<Doc>()
      .then((d) => d!);
  const reject = (fn: () => Promise<unknown>, status: number, label: string) =>
    assert.rejects(fn, (e: { status?: number }) => e.status === status, label);

  /** Escolhas válidas para um plano, sem ligar para o que significam. */
  const auto = (plan: ILevelPlan, hp?: ISealChoices['hp']): ISealChoices => {
    const arch = plan.archetype;
    const slug = arch?.pickSlug ? arch.archetypes[0]?.slug : arch?.currentSlug;
    const pool = (
      arch?.archetypes.find((a) => a.slug === slug)?.features ?? []
    ).filter((f) => !arch?.taken.includes(f.name));
    const classTalents = plan.talentOptions.filter(
      (t) => t.scope === 'class' && t.ok
    );
    const spellIds = plan.spells.options
      .slice(0, plan.spells.need)
      .map((o) => o.id);
    const attr = (['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).find(
      (k) => plan.attributes[k].total <= 18
    )!;
    return {
      features: plan.featureChoices.map((g) => g.options[0].name),
      ...(arch?.pickSlug && slug ? { archetypeSlug: slug } : {}),
      archetypeFeatures: arch
        ? pool
            .slice(0, Math.min(arch.featureSlots, pool.length))
            .map((f) => f.name)
        : [],
      classTalentKeys: classTalents.length
        ? classTalents.slice(0, plan.classTalentSlots).map((t) => t.key)
        : [],
      ...(plan.milestone
        ? { milestone: { use: 'attribute' as const, points: { [attr]: 2 } } }
        : {}),
      spellIds,
      cantripIds: plan.cantrips.options
        .slice(0, plan.cantrips.need)
        .map((o) => o.id),
      hp:
        hp ??
        (plan.hp.mode === 'manual'
          ? { mode: 'manual', manual: 1 }
          : plan.hp.roll
            ? { mode: 'roll' }
            : { mode: 'fixed' }),
    };
  };
  const give = async (id: string, amount: number) =>
    svc.grantXp(id, { amount, reason: 'teste' }, admin);

  // Classes que ninguém tem.
  const free = await Cls.find({
    $or: [{ playerCount: 0 }, { playerCount: { $exists: false } }],
  })
    .select('name levels hpPerLevel hitDie')
    .lean<
      {
        _id: Types.ObjectId;
        name: string;
        hpPerLevel?: string;
        hitDie?: string;
        levels?: {
          level: number;
          proficiencyBonus?: number;
          cantripsKnown?: number;
        }[];
      }[]
    >();
  const row = (c: (typeof free)[number], l: number) =>
    c.levels?.find((r) => r.level === l);
  console.log(`classes sem jogador: ${free.map((c) => c.name).join(', ')}`);

  // Um nível a ser selado, do zero: o personagem fica em `level - 1` com XP de sobra.
  const seed = async (classId: unknown, level: number) => {
    const id = await create(classId, level - 1);
    await give(id, 100_000);
    return id;
  };
  const sealAuto = async (id: string, actor = owner) => {
    const plan = await svc.getLevelPlan(id, actor);
    return svc.sealLevel(id, auto(plan), actor);
  };

  try {
    // ── 1. característica injetada ──
    await test('o selo recusa característica injetada e campo ausente (400, nunca 500)', async () => {
      const c = free.find((k) => row(k, 3))!;
      const id = await seed(c._id, 3);
      const plan = await svc.getLevelPlan(id, owner);
      const ok = auto(plan);
      await reject(
        () =>
          svc.sealLevel(
            id,
            { ...ok, features: [...ok.features, 'Poder Supremo'] },
            owner
          ),
        400,
        'extra'
      );
      await reject(
        () => svc.sealLevel(id, { ...ok, hp: { mode: 'nope' } }, owner),
        400,
        'vida inválida'
      );
      await reject(() => svc.sealLevel(id, null, owner), 400, 'nulo');
      assert.equal((await fresh(id)).level, 2, 'nada foi gravado');
    });

    // ── 2. vida manual ──
    const noDie = free.find(
      (k) => !parseHitDie(k.hpPerLevel, k.hitDie) && row(k, 2)
    );
    if (noDie) {
      await test(`vida manual (${noDie.name}): o dono só informa o ganho, limitado; o admin não`, async () => {
        const id = await seed(noDie._id, 2);
        const plan = await svc.getLevelPlan(id, owner);
        assert.equal(plan.hp.mode, 'manual');
        const withHp = (manual: number) => ({
          ...auto(plan),
          hp: { mode: 'manual' as const, manual },
        });
        await reject(
          () => svc.sealLevel(id, withHp(plan.hp.manualMax + 1), owner),
          400,
          'acima do teto'
        );
        await reject(() => svc.sealLevel(id, withHp(0), owner), 400, 'zero');
        await svc.sealLevel(id, withHp(plan.hp.manualMax), owner);
        assert.equal((await fresh(id)).combat.hp.value, 40 + plan.hp.manualMax);
        const events = await svc.getHistory(id);
        assert.ok(
          events.some((e) => e.kind === 'seal' && /informada/.test(e.reason))
        );
        const id2 = await seed(noDie._id, 2);
        await svc.sealLevel(id2, withHp(500), admin);
        assert.equal((await fresh(id2)).combat.hp.value, 540);
      });
    } else
      console.log(
        '  --  sem classe livre sem dado de vida: vida manual testada só no teste puro'
      );

    // ── 3. editar um nível mais baixo com um mais alto selado ──
    const edit = free.find((k) => {
      for (let l = 2; l < 20; l += 1) {
        const a = row(k, l),
          b = row(k, l + 1);
        if (
          a &&
          b &&
          a.proficiencyBonus !== undefined &&
          a.proficiencyBonus !== b.proficiencyBonus
        )
          return true;
      }
      return false;
    });
    await test(`editar o nível mais baixo mantém a proficiência do nível atual (${edit?.name})`, async () => {
      assert.ok(
        edit,
        'precisa de uma classe livre cuja proficiência mude entre dois níveis'
      );
      let lower = 2;
      for (let l = 2; l < 20; l += 1) {
        const a = row(edit, l),
          b = row(edit, l + 1);
        if (a && b && a.proficiencyBonus !== b.proficiencyBonus) {
          lower = l;
          break;
        }
      }
      const id = await seed(edit._id, lower);
      await sealAuto(id);
      await sealAuto(id);
      const before = await fresh(id);
      assert.equal(before.level, lower + 1);
      assert.equal(
        before.proficiencyBonus,
        row(edit, lower + 1)!.proficiencyBonus
      );
      const plan = await svc.getSealedPlan(id, lower, admin);
      await svc.editSealedLevel(
        id,
        lower,
        auto(plan),
        'teste de edição',
        admin
      );
      const after = await fresh(id);
      assert.equal(after.level, lower + 1, 'o nível selado não muda');
      assert.equal(
        after.proficiencyBonus,
        row(edit, lower + 1)!.proficiencyBonus,
        'proficiência do nível atual'
      );
      assert.equal(
        after.experience.current,
        before.experience.current,
        'XP intacta'
      );
    });

    // ── 4. corrida de selos ──
    await test('dois selos ao mesmo tempo: um passa, o outro é recusado', async () => {
      const c = free.find((k) => row(k, 2))!;
      const id = await seed(c._id, 2);
      const plan = await svc.getLevelPlan(id, owner);
      const choices = auto(plan);
      const out = await Promise.allSettled([
        svc.sealLevel(id, choices, owner),
        svc.sealLevel(id, choices, owner),
      ]);
      assert.equal(
        out.filter((o) => o.status === 'fulfilled').length,
        1,
        JSON.stringify(out.map((o) => o.status))
      );
      const lost = out.find(
        (o) => o.status === 'rejected'
      ) as PromiseRejectedResult;
      assert.ok(
        [409, 400].includes((lost.reason as { status?: number }).status ?? 0)
      );
      assert.equal((await fresh(id)).level, 2);
      assert.equal(
        (await fresh(id)).levelLocks!.filter((l) => l.level === 2).length,
        1
      );
    });

    await test('selo com ficha alterada no meio (updatedAt) devolve 409 e não deixa evento', async () => {
      const c = free.find((k) => row(k, 2))!;
      const id = await seed(c._id, 2);
      const plan = await svc.getLevelPlan(id, owner);
      const choices = auto(plan);
      // Uma concessão chega entre a leitura e a gravação do selo.
      const original = Player.findOneAndUpdate.bind(Player);
      let hit = false;
      (Player as unknown as { findOneAndUpdate: unknown }).findOneAndUpdate = (
        ...args: Parameters<typeof original>
      ) => ({
        lean: async () => {
          if (!hit) {
            hit = true;
            await Player.updateOne(
              { _id: id },
              { $inc: { 'experience.current': 1 } }
            );
          }
          return original(...args).lean();
        },
      });
      try {
        await reject(
          () => svc.sealLevel(id, choices, owner),
          409,
          'ficha mudou'
        );
      } finally {
        (Player as unknown as { findOneAndUpdate: unknown }).findOneAndUpdate =
          original;
      }
      assert.equal((await fresh(id)).level, 1);
      assert.ok(
        !(await svc.getHistory(id)).some((e) => e.kind === 'seal'),
        'sem evento órfão'
      );
    });

    // ── 5. truques ──
    const cantripClass = free.find((k) => {
      for (let l = 2; l <= 20; l += 1) {
        if (
          (row(k, l)?.cantripsKnown ?? 0) > (row(k, l - 1)?.cantripsKnown ?? 0)
        )
          return true;
      }
      return false;
    });
    await test(`o passo de truques aparece quando cantripsKnown cresce (${cantripClass?.name})`, async () => {
      assert.ok(
        cantripClass,
        'precisa de uma classe livre com ganho de truque'
      );
      let at = 2;
      for (let l = 2; l <= 20; l += 1) {
        if (
          (row(cantripClass, l)?.cantripsKnown ?? 0) >
          (row(cantripClass, l - 1)?.cantripsKnown ?? 0)
        ) {
          at = l;
          break;
        }
      }
      const id = await seed(cantripClass._id, at);
      const plan = await svc.getLevelPlan(id, owner);
      assert.ok(plan.cantrips.need > 0, 'need > 0');
      assert.ok(plan.cantrips.options.every((o) => o.circle === 0));
      const ok = auto(plan);
      await reject(
        () => svc.sealLevel(id, { ...ok, cantripIds: [] }, owner),
        400,
        'sem truque'
      );
      await reject(
        () => svc.sealLevel(id, { ...ok, cantripIds: ['0'.repeat(24)] }, owner),
        400,
        'truque inexistente'
      );
      await svc.sealLevel(id, ok, owner);
      const refs = (await fresh(id)).playerSpellcasting?.spellRefs ?? [];
      for (const c of ok.cantripIds ?? [])
        assert.ok(refs.some((r) => String(r.spellId) === c));
    });

    // ── 6. um nível sem aumento de truques não mostra o passo ──
    await test('sem aumento de truques, o plano não pede truque', async () => {
      const c = free.find(
        (k) =>
          row(k, 2) &&
          (row(k, 2)?.cantripsKnown ?? 0) === (row(k, 1)?.cantripsKnown ?? 0)
      )!;
      const id = await seed(c._id, 2);
      assert.equal((await svc.getLevelPlan(id, owner)).cantrips.need, 0);
    });

    // ── 7. permissões ──
    await test('estranho não vê plano nem sela', async () => {
      const c = free.find((k) => row(k, 2))!;
      const id = await seed(c._id, 2);
      await reject(() => svc.getLevelPlan(id, stranger), 403, 'plano');
      await reject(() => svc.sealLevel(id, {}, stranger), 403, 'selo');
    });

    await test('permissões, rolagem sem rerrolar e reabertura mantêm a rolagem e a XP', async () => {
      const c = free.find(
        (k) => row(k, 2) && parseHitDie(k.hpPerLevel, k.hitDie)
      )!;
      const id = await create(c._id, 1);
      await reject(
        () => svc.grantXp(id, { amount: 100, reason: 'x' }, owner),
        403,
        'dono não concede'
      );
      await reject(
        () => svc.grantXp(id, { amount: 100, reason: 'x' }, stranger),
        403,
        'estranho não concede'
      );
      await give(id, 600);
      assert.equal((await fresh(id)).experience.current, 600);
      const a = await svc.rollHp(id, owner);
      const b = await svc.rollHp(id, owner);
      assert.equal(a.rollId, b.rollId);
      assert.equal(a.result, b.result);
      await reject(() => svc.rollHp(id, stranger), 403, 'estranho não rola');
      const plan = await svc.getLevelPlan(id, owner);
      await reject(
        () =>
          svc.sealLevel(id, { ...auto(plan), hp: { mode: 'fixed' } }, owner),
        400,
        'fixo depois de rolar'
      );
      await svc.sealLevel(id, { ...auto(plan), hp: { mode: 'roll' } }, owner);
      const sealed = await fresh(id);
      assert.equal(sealed.level, 2);
      assert.equal(
        sealed.experience.current,
        100,
        '600 - 500: a sobra passa adiante'
      );
      await reject(
        () => svc.reopenLevel(id, 2, 'x', owner),
        403,
        'dono não reabre'
      );
      await svc.reopenLevel(id, 2, 'teste', admin);
      const reopened = await fresh(id);
      assert.equal(reopened.level, 1);
      assert.equal(reopened.experience.current, 600);
      assert.equal(reopened.combat.hp.value, 40);
      assert.equal(
        (await svc.getLevelPlan(id, owner)).hp.roll?.rollId,
        a.rollId
      );
    });

    await test('preparadas: o limite é o TOTAL de espaços, de qualquer círculo (assertSpellLimits)', async () => {
      const { updatePlayerById } = await import('../services/player.service');
      const { default: Spell } = await import('../db/spells/spells');
      const { getClassCasting } =
        await import('../services/classSpells.service');
      let found: { c: (typeof free)[number]; level: number } | undefined;
      for (const c of free) {
        for (const level of [3, 5]) {
          if (row(c, level)) {
            const casting = await getClassCasting(String(c._id), level);
            const n = casting
              ? await Spell.countDocuments({ classIds: c._id, circle: 1 })
              : 0;
            if (casting && n > casting.preparedLimit) {
              found = { c, level };
              break;
            }
          }
        }
        if (found) break;
      }
      assert.ok(
        found,
        'precisa de uma classe com mais magias de 1º círculo que espaços'
      );
      const id = await create(found.c._id, found.level);
      const casting = (await getClassCasting(
        String(found.c._id),
        found.level
      ))!;
      const docs = await Spell.find({ classIds: found.c._id, circle: 1 })
        .limit(casting.preparedLimit + 1)
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>();
      const refs = (n: number) => ({
        playerSpellcasting: {
          spellRefs: docs
            .slice(0, n)
            .map((d) => ({ spellId: String(d._id), prepared: true })),
        },
      });
      // Todas do 1º círculo, até o total: vale (o limite não é por círculo).
      await updatePlayerById(id, refs(casting.preparedLimit));
      // Um acima do total: recusado.
      await assert.rejects(
        () => updatePlayerById(id, refs(casting.preparedLimit + 1)),
        /preparadas demais/
      );
    });

    await test('o histórico lê o estorno de páginas antigas e pagina por cursor', async () => {
      const c = free.find((k) => row(k, 2))!;
      const id = await create(c._id, 1);
      await give(id, 10);
      const first = (await svc.getHistory(id))[0];
      await svc.grantXp(
        id,
        { amount: -10, reason: 'estorno', reversalOf: first.id },
        admin
      );
      for (let i = 0; i < 3; i += 1) await give(id, 1);
      const page = await svc.getHistory(id, 2);
      assert.equal(page.length, 2);
      const older = await svc.getHistory(id, 10, page[1].at);
      assert.ok(
        older.find((e) => e.id === first.id)?.reversed,
        'estornada mesmo fora da 1ª página'
      );
      assert.equal(earnedLevel(1, (await fresh(id)).experience.current), 1);
    });
  } finally {
    await cleanup();
  }
}

main()
  .then(() => {
    console.log(`${passed} testes`);
    process.exit(process.exitCode ?? 0);
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
