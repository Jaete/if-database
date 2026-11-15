/**
 * Listas de escolha da classe (Técnicas de Investida, Formas de Fúria, Artes
 * Divinas…) no selo de nível, contra o banco REAL, só em fichas temporárias
 * (slug `zz-cat-*`). Roda com `ALLOW_DB_TESTS=1 npm run test:catalogs:db`.
 */
import 'dotenv/config';
import assert from 'node:assert/strict';
import { connectDB } from '../lib/db';
import type { ILevelPlan, ISealChoices } from '../lib/levelUp';

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

const OWNER = 987654322;
const staff = {
  username: 'staff-teste',
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

async function main() {
  await connectDB();
  const { default: Player } = await import('../db/players/players');
  const { default: Cls } = await import('../db/classes/classes');
  const { default: Event } = await import('../db/playerProgress/playerEvents');
  const { default: HpRoll } = await import('../db/playerProgress/hpRolls');
  const svc = await import('../services/levelUp.service');
  const { getPlayerById, updatePlayerById } =
    await import('../services/player.service');
  const { pickWritablePlayerFields } =
    await import('../db/players/publicFields');

  const cleanup = async () => {
    const ps = await Player.find({ slug: /^zz-cat-/ })
      .select('_id')
      .lean();
    for (const p of ps) {
      await Event.deleteMany({ playerId: p._id });
      await HpRoll.deleteMany({ playerId: p._id });
    }
    await Player.deleteMany({ slug: /^zz-cat-/ });
  };
  for (const sig of ['SIGINT', 'SIGTERM'] as const) {
    process.on(sig, () => void cleanup().finally(() => process.exit(130)));
  }
  await cleanup();

  const stat = (v: number) => ({
    base: v,
    raceBonus: 0,
    classBonus: 0,
    total: v,
    modifier: Math.floor((v - 10) / 2),
  });
  const classOf = async (slug: string) =>
    (await Cls.findOne({ slug }).select('_id').lean<{ _id: unknown }>())!._id;
  const make = async (
    slug: string,
    level: number,
    extra: Record<string, unknown> = {}
  ) => {
    const p = await Player.create({
      slug: `zz-cat-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      name: 'Teste Temporário',
      race: 'Humano',
      gender: 'x',
      class: 'Teste',
      classId: String(await classOf(slug)),
      level: level - 1,
      experience: { current: 100_000, nextLevel: 0 },
      proficiencyBonus: 2,
      combat: { hp: { value: 40, formula: '' } },
      playerStats: {
        str: stat(12),
        dex: stat(12),
        con: stat(14),
        int: stat(12),
        wis: stat(12),
        cha: stat(12),
      },
      ownerForumUserId: OWNER,
      ownerUsername: 'dono-teste',
      talents: [],
      archetype: { features: [] },
      ...extra,
    } as never);
    return String((p as unknown as { _id: unknown })._id);
  };
  const fresh = async (id: string) =>
    (await Player.findById(id).lean()) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  /** Escolhas válidas para o plano, com `pick` itens de cada lista. */
  const auto = (
    plan: ILevelPlan,
    take: Record<string, number> = {}
  ): ISealChoices => {
    const arch = plan.archetype;
    const slug = arch?.pickSlug ? arch.archetypes[0]?.slug : arch?.currentSlug;
    const pool = (
      arch?.archetypes.find((a) => a.slug === slug)?.features ?? []
    ).filter((f) => !arch?.taken.includes(f.name));
    const classTalents = plan.talentOptions.filter(
      (t) => t.scope === 'class' && t.ok
    );
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
      spellIds: plan.spells.options.slice(0, plan.spells.need).map((o) => o.id),
      cantripIds: plan.cantrips.options
        .slice(0, plan.cantrips.need)
        .map((o) => o.id),
      catalogPicks: plan.catalogPicks.flatMap((c) =>
        c.options
          .slice(0, take[c.slug] ?? c.need)
          .map((o) => ({ catalog: c.slug, item: o.name }))
      ),
      hp:
        plan.hp.mode === 'manual'
          ? { mode: 'manual', manual: 1 }
          : { mode: 'fixed' },
    };
  };
  const reject = (fn: () => Promise<unknown>, status: number, label: string) =>
    assert.rejects(fn, (e: { status?: number }) => e.status === status, label);

  try {
    await test('Espadachim 1→2 offers 1 Técnica de Investida and the seal requires it', async () => {
      const id = await make('espadachim', 2);
      const plan = await svc.getLevelPlan(id, owner);
      const cat = plan.catalogPicks.find(
        (c) => c.slug === 'tecnicas-de-investida'
      );
      assert.ok(cat, 'a lista aparece no plano');
      assert.equal(cat.need, 1);
      assert.equal(cat.options.length, 16);
      await reject(
        () =>
          svc.sealLevel(id, auto(plan, { 'tecnicas-de-investida': 0 }), owner),
        400,
        'sem a escolha'
      );
      await reject(
        () =>
          svc.sealLevel(id, auto(plan, { 'tecnicas-de-investida': 2 }), owner),
        400,
        'a mais'
      );
      const choices = auto(plan);
      await reject(
        () =>
          svc.sealLevel(
            id,
            {
              ...choices,
              catalogPicks: [
                { catalog: 'tecnicas-de-investida', item: 'Inventada' },
              ],
            },
            owner
          ),
        400,
        'item fora da lista'
      );
      await reject(
        () =>
          svc.sealLevel(
            id,
            {
              ...choices,
              catalogPicks: [
                ...choices.catalogPicks!,
                { catalog: 'poderes-de-furia', item: 'x' },
              ],
            },
            owner
          ),
        400,
        'lista que o nível não pede'
      );
      await svc.sealLevel(id, choices, owner);
      const sheet = await fresh(id);
      assert.equal(sheet.catalogPicks.length, 1);
      assert.equal(sheet.catalogPicks[0].level, 2);
      assert.match(
        sheet.levelLocks[0].summary,
        new RegExp(choices.catalogPicks![0].item)
      );
      // A leitura resolve a escolha em habilidade da classe, com a lista como origem.
      const read = await getPlayerById(id);
      const ability = read?.abilities?.find(
        (a) => a.name === choices.catalogPicks![0].item
      );
      assert.ok(ability);
      assert.equal(ability.source, 'class');
      assert.equal(ability.origin, 'Técnicas de Investida');
      assert.ok((ability.description ?? '').length > 0);
    });

    await test('level 3 asks nothing; level 4 asks again and hides what was picked', async () => {
      const id = await make('espadachim', 2);
      const first = await svc.getLevelPlan(id, owner);
      const picked = auto(first).catalogPicks![0].item;
      await svc.sealLevel(id, auto(first), owner);
      const three = await svc.getLevelPlan(id, owner);
      assert.equal(three.level, 3);
      assert.equal(three.catalogPicks.length, 0);
      await svc.sealLevel(id, auto(three), owner);
      const four = await svc.getLevelPlan(id, owner);
      const cat = four.catalogPicks.find(
        (c) => c.slug === 'tecnicas-de-investida'
      )!;
      assert.equal(cat.need, 1);
      assert.equal(cat.options.length, 15);
      assert.ok(!cat.options.some((o) => o.name === picked));
      await reject(
        () =>
          svc.sealLevel(
            id,
            {
              ...auto(four),
              catalogPicks: [{ catalog: cat.slug, item: picked }],
            },
            owner
          ),
        400,
        'repetir'
      );
    });

    await test('Berserker level 2: 1 Forma de Fúria + 1 Poder de Fúria', async () => {
      const id = await make('berserker', 2);
      const plan = await svc.getLevelPlan(id, owner);
      assert.equal(
        plan.catalogPicks.find((c) => c.slug === 'formas-de-furia')?.need,
        1
      );
      assert.equal(
        plan.catalogPicks.find((c) => c.slug === 'poderes-de-furia')?.need,
        1
      );
      await reject(
        () => svc.sealLevel(id, auto(plan, { 'poderes-de-furia': 0 }), owner),
        400,
        'falta o poder'
      );
      await svc.sealLevel(id, auto(plan), owner);
      assert.equal((await fresh(id)).catalogPicks.length, 2);
    });

    await test('Paladino level 7 asks for TWO Artes Divinas', async () => {
      const id = await make('paladino', 7);
      const plan = await svc.getLevelPlan(id, owner);
      const cat = plan.catalogPicks.find((c) => c.slug === 'artes-divinas');
      assert.equal(cat?.need, 2);
      await reject(
        () => svc.sealLevel(id, auto(plan, { 'artes-divinas': 1 }), owner),
        400,
        'só uma'
      );
      await svc.sealLevel(id, auto(plan), owner);
      assert.equal(
        (await fresh(id)).catalogPicks.filter(
          (p: { catalog: string }) => p.catalog === 'artes-divinas'
        ).length,
        2
      );
    });

    await test('Bardo level 6: Performances Versáteis Avançadas accept free text', async () => {
      const id = await make('bardo', 6);
      const plan = await svc.getLevelPlan(id, owner);
      const cat = plan.catalogPicks.find(
        (c) => c.slug === 'performances-versateis-avancadas'
      );
      assert.equal(cat?.need, 1);
      assert.equal(cat?.freeTextLabel, 'Outro tipo de Atuação');
      const base = auto(plan, { 'performances-versateis-avancadas': 0 });
      await reject(
        () =>
          svc.sealLevel(
            id,
            {
              ...base,
              catalogPicks: [
                { catalog: cat!.slug, item: 'Outro tipo de Atuação: ' },
              ],
            },
            owner
          ),
        400,
        'texto vazio'
      );
      await svc.sealLevel(
        id,
        {
          ...base,
          catalogPicks: [
            { catalog: cat!.slug, item: 'Outro tipo de Atuação: Dança' },
          ],
        },
        owner
      );
      assert.equal(
        (await fresh(id)).catalogPicks[0].item,
        'Outro tipo de Atuação: Dança'
      );
    });

    await test('free text is not repeated across levels (case and spaces ignored)', async () => {
      const id = await make('bardo', 10, {
        catalogPicks: [
          {
            catalog: 'performances-versateis-avancadas',
            item: 'Outro tipo de Atuação: Dança',
            level: 6,
          },
        ],
      });
      const plan = await svc.getLevelPlan(id, owner);
      const cat = plan.catalogPicks.find(
        (c) => c.slug === 'performances-versateis-avancadas'
      )!;
      assert.equal(cat.need, 1);
      assert.deepEqual(cat.taken, ['Outro tipo de Atuação: Dança']);
      const base = auto(plan, { 'performances-versateis-avancadas': 0 });
      for (const again of [' dança ', 'DANÇA', 'D a n ç a']) {
        await reject(
          () =>
            svc.sealLevel(
              id,
              {
                ...base,
                catalogPicks: [
                  {
                    catalog: cat.slug,
                    item: `Outro tipo de Atuação: ${again}`,
                  },
                ],
              },
              owner
            ),
          400,
          again
        );
      }
      await svc.sealLevel(
        id,
        {
          ...base,
          catalogPicks: [
            { catalog: cat.slug, item: 'Outro tipo de Atuação: Canto' },
          ],
        },
        owner
      );
      assert.equal((await fresh(id)).catalogPicks.length, 2);
    });

    await test('Monge: Habilidades de Fúria exige o monge selvagem; Blitz começa no 7', async () => {
      const wild = await make('monge', 5, {
        archetype: { slug: 'monge-selvagem', features: [] },
      });
      const planWild = await svc.getLevelPlan(wild, owner);
      const cat = planWild.catalogPicks.find(
        (c) => c.slug === 'habilidades-de-furia-berserker'
      );
      assert.equal(cat?.requiresArchetype, 'monge-selvagem');
      assert.equal(cat?.need, 1);
      await reject(
        () =>
          svc.sealLevel(
            wild,
            auto(planWild, { 'habilidades-de-furia-berserker': 0 }),
            owner
          ),
        400,
        'selvagem precisa escolher'
      );
      await svc.sealLevel(wild, auto(planWild), owner);
      const iron = await make('monge', 5, {
        archetype: { slug: 'monge-pele-de-ferro', features: [] },
      });
      const planIron = await svc.getLevelPlan(iron, owner);
      const ok = auto(planIron, { 'habilidades-de-furia-berserker': 0 });
      await svc.sealLevel(iron, ok, owner);
      assert.equal(((await fresh(iron)).catalogPicks ?? []).length, 0);
      const iron2 = await make('monge', 5, {
        archetype: { slug: 'monge-pele-de-ferro', features: [] },
      });
      const p2 = await svc.getLevelPlan(iron2, owner);
      await reject(
        () =>
          svc.sealLevel(
            iron2,
            {
              ...auto(p2, { 'habilidades-de-furia-berserker': 0 }),
              catalogPicks: [
                {
                  catalog: 'habilidades-de-furia-berserker',
                  item: cat!.options[0].name,
                },
              ],
            },
            owner
          ),
        400,
        'outro arquétipo não escolhe'
      );
      const blitz = await svc.getLevelPlan(
        await make('monge', 7, {
          archetype: { slug: 'monge-pele-de-ferro', features: [] },
        }),
        owner
      );
      assert.equal(
        blitz.catalogPicks.find((c) => c.slug === 'tecnicas-blitz')?.need,
        1
      );
      const six = await svc.getLevelPlan(
        await make('monge', 6, {
          archetype: { slug: 'monge-pele-de-ferro', features: [] },
        }),
        owner
      );
      assert.equal(
        six.catalogPicks.find((c) => c.slug === 'tecnicas-blitz'),
        undefined
      );
    });

    await test('a sealed level without the pick can be fixed by a staff edit', async () => {
      const id = await make('espadachim', 2);
      const plan = await svc.getLevelPlan(id, owner);
      await svc.sealLevel(id, auto(plan), owner);
      // Selo de antes desta função: sem escolha de lista.
      await Player.updateOne(
        { _id: id },
        {
          $unset: { catalogPicks: '', 'levelLocks.0.choices.catalogPicks': '' },
        }
      );
      assert.equal(((await fresh(id)).catalogPicks ?? []).length, 0);
      const sealed = await svc.getSealedPlan(id, 2, staff);
      assert.equal(
        sealed.catalogPicks.find((c) => c.slug === 'tecnicas-de-investida')
          ?.need,
        1,
        'o plano do nível selado oferece a escolha que falta'
      );
      const choices = auto(sealed);
      await reject(
        () =>
          svc.editSealedLevel(
            id,
            2,
            { ...choices, catalogPicks: [] },
            'corrigir',
            staff
          ),
        400,
        'a edição também exige'
      );
      await svc.editSealedLevel(id, 2, choices, 'corrigir', staff);
      const after = await fresh(id);
      assert.equal(after.catalogPicks.length, 1);
      assert.equal(after.catalogPicks[0].level, 2);
      // Reabrir desfaz a escolha do nível.
      await svc.reopenLevel(id, 2, 'teste', staff);
      assert.equal(((await fresh(id)).catalogPicks ?? []).length, 0);
    });

    await test('level-up PB change shifts skills (expertise x2, legacy x1, bonuses kept); reopen undoes it; old docs read fine', async () => {
      const klass = (await Cls.findOne({ slug: 'espadachim' })
        .select('levels')
        .lean()) as unknown as {
        levels: { level: number; proficiencyBonus?: number }[];
      };
      const pbAt = (l: number) =>
        klass.levels.find((r) => r.level === l)!.proficiencyBonus!;
      const target = [3, 4, 5, 6, 7, 8, 9].find((l) => pbAt(l) > pbAt(l - 1))!;
      const from = pbAt(target - 1);
      const to = pbAt(target);
      const skills = [
        {
          name: 'Persuasão',
          proficient: true,
          proficiencySources: [
            { source: 'class' },
            { source: 'race', label: 'x' },
          ],
          value: 7,
          bonus: 1,
          bonuses: [{ value: 1, source: 'narrador' }],
        },
        { name: 'Atletismo', proficient: true, value: 4 },
        { name: 'Furtividade', value: 1 },
      ];
      const id = await make('espadachim', target, {
        proficiencyBonus: from,
        proficiencies: { skills },
      });
      // Documento antigo (só `proficient: true`) lê normalmente.
      const read = await getPlayerById(id);
      assert.equal(
        (read?.proficiencies?.skills as { name: string }[]).length,
        3
      );
      const plan = await svc.getLevelPlan(id, owner);
      await svc.sealLevel(id, auto(plan), owner);
      const after = (await fresh(id)).proficiencies.skills as {
        name: string;
        value: number;
        bonus?: number;
      }[];
      const by = (n: string) => after.find((k) => k.name === n)!;
      assert.equal((await fresh(id)).proficiencyBonus, to);
      assert.equal(by('Persuasão').value, 7 + 2 * (to - from));
      assert.equal(by('Persuasão').bonus, 1, 'o bônus fixo segue por fora');
      assert.equal(by('Atletismo').value, 4 + (to - from));
      assert.equal(by('Furtividade').value, 1);
      await svc.reopenLevel(id, target, 'teste', staff);
      const back = (await fresh(id)).proficiencies.skills as {
        name: string;
        value: number;
      }[];
      assert.equal(back.find((k) => k.name === 'Persuasão')!.value, 7);
      assert.equal(back.find((k) => k.name === 'Atletismo')!.value, 4);
    });

    await test('staff expertise survives a level-up with PB change (only the value moves)', async () => {
      const klass = (await Cls.findOne({ slug: 'espadachim' })
        .select('levels')
        .lean()) as unknown as {
        levels: { level: number; proficiencyBonus?: number }[];
      };
      const pbAt = (l: number) =>
        klass.levels.find((r) => r.level === l)!.proficiencyBonus!;
      const target = [3, 4, 5, 6, 7, 8, 9].find((l) => pbAt(l) > pbAt(l - 1))!;
      const from = pbAt(target - 1);
      const to = pbAt(target);
      const staffEntry = {
        name: 'Natureza',
        proficient: true,
        proficiencySources: [{ source: 'staff' }, { source: 'staff' }],
        staffOverride: true,
        value: 2 * from,
      };
      const zeroed = {
        name: 'Persuasão',
        proficient: false,
        proficiencySources: [],
        staffOverride: true,
        value: 0,
      };
      const id = await make('espadachim', target, {
        proficiencyBonus: from,
        proficiencies: { skills: [staffEntry, zeroed] },
      });
      await svc.sealLevel(id, auto(await svc.getLevelPlan(id, owner)), owner);
      const skills = (await fresh(id)).proficiencies.skills as {
        name: string;
        value: number;
        proficiencySources: unknown[];
        staffOverride?: boolean;
        proficient: boolean;
      }[];
      const nat = skills.find((k) => k.name === 'Natureza')!;
      assert.equal(nat.proficiencySources.length, 2, 'segue especialização');
      assert.equal(nat.value, 2 * to);
      assert.equal(nat.staffOverride, true);
      const per = skills.find((k) => k.name === 'Persuasão')!;
      assert.equal(per.proficient, false);
      assert.equal(per.value, 0, 'zerada segue zerada');
      await svc.reopenLevel(id, target, 'teste', staff);
      const back = (await fresh(id)).proficiencies.skills as {
        name: string;
        value: number;
        proficiencySources: unknown[];
      }[];
      assert.equal(back.find((k) => k.name === 'Natureza')!.value, 2 * from);
      assert.equal(
        back.find((k) => k.name === 'Natureza')!.proficiencySources.length,
        2
      );
    });

    await test('generic writes cannot set catalogPicks', async () => {
      const id = await make('espadachim', 2);
      const plan = await svc.getLevelPlan(id, owner);
      await svc.sealLevel(id, auto(plan), owner);
      const before = (await fresh(id)).catalogPicks;
      const forged = [
        { catalog: 'tecnicas-de-investida', item: 'Forjada', level: 2 },
      ];
      assert.deepEqual(
        pickWritablePlayerFields({ catalogPicks: forged, subtitle: 'x' }),
        { subtitle: 'x' }
      );
      await updatePlayerById(id, { catalogPicks: forged, subtitle: 'ok' });
      const after = await fresh(id);
      assert.deepEqual(after.catalogPicks, before);
      assert.equal(after.subtitle, 'ok');
    });
  } finally {
    await cleanup();
  }
  console.log(`\n${passed} ok`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
