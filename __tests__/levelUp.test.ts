/**
 * Regras de XP e de subida de nível, só puras (sem banco). `npm run test:levelup`.
 * As que usam o banco estão em levelUp.db.test.ts, atrás de ALLOW_DB_TESTS=1.
 */
import assert from 'node:assert/strict';
import { canonicalizeChoices } from '../services/levelUp.service';
import {
  MAX_LEVEL,
  XP_TO_NEXT,
  creatureXp,
  earnedLevel,
  xpProgress,
} from '../lib/xp';
import {
  type ILevelPlan,
  hpGainOf,
  parseHitDie,
  spellNeed,
} from '../lib/levelUp';

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

async function pure() {
  console.log('Regras puras');
  await test('tabela: 500 no 1 e 100.000 no 20', () => {
    assert.equal(XP_TO_NEXT[1], 500);
    assert.equal(XP_TO_NEXT[20], 100000);
    assert.equal(XP_TO_NEXT.length, 21);
  });
  await test('sobra passa adiante e uma concessão cobre vários níveis', () => {
    // 6 → 7 custa 2750, 7 → 8 custa 3250: 6.000 cobre os dois.
    assert.equal(earnedLevel(6, 6000), 8);
    assert.equal(xpProgress(6, 6000).into, 6000 - 2750 - 3250);
    assert.equal(earnedLevel(6, 2749), 6);
    assert.equal(earnedLevel(6, 2750), 7);
  });
  await test('no 20 a XP acumula sem limite e o nível não passa de MAX_LEVEL', () => {
    assert.equal(earnedLevel(20, 10_000_000), MAX_LEVEL);
    assert.equal(xpProgress(20, 10_000_000).needed, null);
    assert.equal(xpProgress(20, 10_000_000).into, 10_000_000);
  });
  await test('XP negativa nunca baixa o nível', () => {
    assert.equal(earnedLevel(6, -400), 6);
    assert.equal(earnedLevel(1, -1), 1);
    assert.equal(xpProgress(6, -400).into, -400);
  });
  await test('criatura: 200 ±50 por nível, mínimo 20, pelo nível selado', () => {
    assert.equal(creatureXp(8, 6), 300);
    assert.equal(creatureXp(5, 6), 150);
    assert.equal(creatureXp(1, 20), 20);
  });
  await test('dado de vida lido das grafias do códice', () => {
    assert.deepEqual(parseHitDie('1d8 (ou 5) + modificador de Constituição'), {
      die: 8,
      fixed: 5,
    });
    assert.deepEqual(parseHitDie('1d10(ou 6) + seu modificador'), {
      die: 10,
      fixed: 6,
    });
    assert.deepEqual(parseHitDie('1d12 (ou 8 ) + Modificador'), {
      die: 12,
      fixed: 8,
    });
    assert.deepEqual(parseHitDie('d6 + Modificador de Constituição', 'd6'), {
      die: 6,
      fixed: 4,
    });
    assert.equal(parseHitDie('', ''), null);
  });
  await test('vida do nível: CON só neste nível, mínimo 1', () => {
    assert.equal(hpGainOf(5, 3), 8);
    assert.equal(hpGainOf(1, -3), 1);
  });
  await test('magias: uma por espaço novo, limitada pelo total que cabe e pelo grimório', () => {
    assert.equal(spellNeed({ slotsNew: 2, room: 5, available: 0 }), 0);
    assert.equal(spellNeed({ slotsNew: 2, room: 5, available: 9 }), 2);
    assert.equal(spellNeed({ slotsNew: 2, room: 1, available: 9 }), 1);
    assert.equal(spellNeed({ slotsNew: 0, room: 4, available: 9 }), 0);
  });
}

// ── Escolhas canônicas ───────────────────────────────────

const basePlan = (over: Partial<ILevelPlan> = {}): ILevelPlan => ({
  level: 8,
  earned: 8,
  className: 'Teste',
  playerName: 'x',
  proficiency: { from: 3, to: 3 },
  autoFeatures: [],
  featureChoices: [],
  archetype: null,
  classTalentSlots: 0,
  milestone: null,
  talentOptions: [],
  attributes: {
    str: { total: 10, base: 10 },
    dex: { total: 10, base: 10 },
    con: { total: 14, base: 14 },
    int: { total: 10, base: 10 },
    wis: { total: 10, base: 10 },
    cha: { total: 10, base: 10 },
  },
  spells: {
    slots: [],
    prevSlots: [],
    adds: [],
    maxCircle: 0,
    need: 0,
    room: 0,
    options: [],
  },
  cantrips: { need: 0, capacity: 0, options: [] },
  hp: {
    mode: 'dice',
    manualMax: 15,
    die: 8,
    fixed: 5,
    formula: '',
    conMod: 2,
    current: 40,
    roll: null,
  },
  sealed: null,
  ...over,
});
const talent = (key: string, stackable = false) => ({
  key,
  name: key,
  scope: 'class' as const,
  description: '',
  prerequisites: '',
  ok: true,
  missing: [],
  stackable,
});
const admin = { isStaff: true };
const owner = { isStaff: false };

async function canonical() {
  console.log('Escolhas canônicas');
  await test('característica injetada é recusada quando o nível não tem escolha', () => {
    const r = canonicalizeChoices(
      basePlan(),
      { features: ['Poder Supremo'], hp: { mode: 'fixed' } },
      owner
    );
    assert.ok('error' in r);
  });
  await test('característica fora das opções é recusada; campo ausente é erro, não exceção', () => {
    const plan = basePlan({
      featureChoices: [
        {
          raw: 'A | B',
          options: [
            { name: 'A', description: '' },
            { name: 'B', description: '' },
          ],
        },
      ],
    });
    assert.ok(
      'error' in
        canonicalizeChoices(
          plan,
          { features: ['C'], hp: { mode: 'fixed' } },
          owner
        )
    );
    assert.ok(
      'error' in canonicalizeChoices(plan, { hp: { mode: 'fixed' } }, owner)
    );
    assert.ok('error' in canonicalizeChoices(plan, null, owner));
    assert.ok(
      'error' in
        canonicalizeChoices(
          plan,
          { features: 'A', hp: { mode: 'fixed' } },
          owner
        )
    );
  });
  await test('o resultado só leva campos validados (nada do corpo cru)', () => {
    const r = canonicalizeChoices(
      basePlan(),
      {
        features: [],
        hp: { mode: 'fixed', extra: 1 },
        foo: 'bar',
        archetypeFeatures: ['x'],
      },
      owner
    );
    assert.ok('error' in r, 'arquétipo sem plano é recusado');
    const ok = canonicalizeChoices(
      basePlan(),
      { foo: 'bar', hp: { mode: 'fixed', extra: 1 } },
      owner
    );
    assert.ok('choices' in ok);
    if ('choices' in ok) {
      assert.deepEqual(Object.keys(ok.choices).sort(), [
        'archetypeFeatures',
        'cantripIds',
        'classTalentKeys',
        'features',
        'hp',
        'spellIds',
      ]);
      assert.deepEqual(ok.choices.hp, { mode: 'fixed' });
    }
  });
  await test('vida manual: o dono só informa o ganho, de 1 a 12 + CON; o admin não tem teto', () => {
    const plan = basePlan({
      hp: { ...basePlan().hp, mode: 'manual', die: null, fixed: null },
    });
    const hp = (v: number) => ({ hp: { mode: 'manual', manual: v } });
    assert.ok('error' in canonicalizeChoices(plan, hp(0), owner));
    assert.ok(
      'error' in canonicalizeChoices(plan, hp(15), owner),
      '12 + CON 2 = 14'
    );
    assert.ok('choices' in canonicalizeChoices(plan, hp(14), owner));
    assert.ok('error' in canonicalizeChoices(plan, hp(1.5), owner));
    assert.ok('choices' in canonicalizeChoices(plan, hp(500), admin));
  });
  await test('talentos de classe repetidos são recusados, salvo os que se repetem', () => {
    const base = { hp: { mode: 'fixed' } };
    const one = basePlan({
      classTalentSlots: 2,
      talentOptions: [talent('a'), talent('b')],
    });
    assert.ok(
      'error' in
        canonicalizeChoices(
          one,
          { ...base, classTalentKeys: ['a', 'a'] },
          owner
        )
    );
    assert.ok(
      'choices' in
        canonicalizeChoices(
          one,
          { ...base, classTalentKeys: ['a', 'b'] },
          owner
        )
    );
    const stack = basePlan({
      classTalentSlots: 2,
      talentOptions: [talent('a', true)],
    });
    assert.ok(
      'choices' in
        canonicalizeChoices(
          stack,
          { ...base, classTalentKeys: ['a', 'a'] },
          owner
        )
    );
  });
  await test('o talento do marco não repete um já escolhido na vaga da classe', () => {
    const plan = basePlan({
      classTalentSlots: 1,
      milestone: { text: 'x' },
      talentOptions: [talent('a'), talent('b')],
    });
    const mk = (key: string) => ({
      classTalentKeys: ['a'],
      milestone: { use: 'talent', talentKey: key },
      hp: { mode: 'fixed' },
    });
    assert.ok('error' in canonicalizeChoices(plan, mk('a'), owner));
    assert.ok('choices' in canonicalizeChoices(plan, mk('b'), owner));
  });
  await test('magias: qualquer círculo até o máximo vale, sem limite por círculo', () => {
    const sp = (id: string, circle: number) => ({
      id,
      name: id,
      circle,
      school: '',
      castingTime: '',
      range: '',
      duration: '',
      description: '',
    });
    const plan = basePlan({
      spells: {
        slots: [4, 3],
        prevSlots: [4, 2],
        adds: [
          { circle: 2, add: 1 },
          { circle: 1, add: 1 },
        ],
        maxCircle: 2,
        need: 2,
        room: 2,
        options: [sp('a', 1), sp('b', 1), sp('c', 2)],
      },
    });
    const hp = { hp: { mode: 'fixed' } };
    // As duas do 1º círculo: não é mais um limite por círculo.
    assert.ok(
      'choices' in
        canonicalizeChoices(plan, { ...hp, spellIds: ['a', 'b'] }, owner)
    );
    assert.ok(
      'error' in canonicalizeChoices(plan, { ...hp, spellIds: ['a'] }, owner)
    );
    assert.ok(
      'error' in
        canonicalizeChoices(plan, { ...hp, spellIds: ['a', 'a'] }, owner)
    );
    assert.ok(
      'error' in
        canonicalizeChoices(plan, { ...hp, spellIds: ['a', 'zz'] }, owner)
    );
  });
  await test('truques: exige exatamente o número do nível, dentro do limite', () => {
    const sp = (id: string) => ({
      id,
      name: id,
      circle: 0,
      school: '',
      castingTime: '',
      range: '',
      duration: '',
      description: '',
    });
    const plan = basePlan({
      cantrips: { need: 1, capacity: 1, options: [sp('c1'), sp('c2')] },
    });
    const hp = { hp: { mode: 'fixed' } };
    assert.ok('error' in canonicalizeChoices(plan, hp, owner));
    assert.ok(
      'error' in
        canonicalizeChoices(plan, { ...hp, cantripIds: ['c1', 'c2'] }, owner)
    );
    assert.ok(
      'error' in canonicalizeChoices(plan, { ...hp, cantripIds: ['zz'] }, owner)
    );
    assert.ok(
      'choices' in
        canonicalizeChoices(plan, { ...hp, cantripIds: ['c2'] }, owner)
    );
  });
}

(async () => {
  await pure();
  await canonical();
  console.log(`${passed} testes`);
  process.exit(process.exitCode ?? 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
