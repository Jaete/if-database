/**
 * Regras puras da criação de ficha: `npm run test:creation`.
 * Compra de pontos, bônus raciais (as 13 raças), sub-raça, perícias, idiomas,
 * gil, vida do nível 1 e CD de magias. Sem banco.
 */
import assert from 'node:assert/strict';
import {
  attributeTotals,
  castingNumbers,
  checkGrantPicks,
  SKILL_NAMES,
  checkBase,
  creationIssues,
  level1Hp,
  parseGilFormula,
  parseSavingThrows,
  parseSkillChoice,
  pointCost,
  pointsSpent,
  rollAttributeSets,
  rollGil,
  suggestOrder,
} from '../lib/creation';
import {
  addBonus,
  checkRacialPicks,
  parseAbilityIncrease,
  parseCreationGrants,
  parseSpeed,
  raceSpeed,
  racialGrants,
  sumGrants,
  parseBonusOverride,
  parseLanguages,
  raceBonus,
  raceLanguages,
  subraceRule,
  type IRaceRulesInput,
} from '../lib/raceRules';
import racesFixture from './fixtures/races.json';

let passed = 0;
const test = (name: string, fn: () => void) => {
  try {
    fn();
    passed += 1;
    console.log(`  ok  ${name}`);
  } catch (error) {
    console.error(`FAIL  ${name}\n`, error);
    process.exitCode = 1;
  }
};

const races = racesFixture as unknown as (IRaceRulesInput & {
  baseOnlyTraits?: unknown[];
})[];
const race = (slug: string) => races.find((r) => r.slug === slug)!;

// ── Compra de pontos ──
test('point buy costs', () => {
  const costs = [8, 9, 10, 11, 12, 13, 14, 15].map(pointCost);
  assert.deepEqual(costs, [0, 1, 2, 3, 4, 5, 7, 9]);
  assert.equal(pointCost(7), null);
  assert.equal(pointCost(16), null);
});
test('point buy: 27 points complete, less is partial, more is refused', () => {
  const ok = { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 };
  assert.equal(pointsSpent(ok), 27);
  assert.deepEqual(checkBase('pointBuy', ok), { ok: true, complete: true });
  const partial = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
  assert.equal(pointsSpent(partial), 27);
  const short = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  assert.equal(checkBase('pointBuy', short).complete, false);
  assert.equal(checkBase('pointBuy', short).ok, true);
  const over = { str: 15, dex: 15, con: 15, int: 15, wis: 8, cha: 8 };
  assert.equal(checkBase('pointBuy', over).ok, false);
  assert.equal(checkBase('pointBuy', { str: 16 }).ok, false);
});
test('standard array: each value once', () => {
  const ok = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
  assert.equal(checkBase('standardArray', ok).complete, true);
  assert.equal(
    checkBase('standardArray', { ...ok, cha: 15 }).ok,
    false,
    'repeated value'
  );
  assert.equal(checkBase('standardArray', { str: 15 }).complete, false);
});
test('roll: only the rolled totals, and 4d6 drops the lowest', () => {
  const sums = [15, 14, 12, 11, 10, 9];
  const ok = { str: 9, dex: 10, con: 11, int: 12, wis: 14, cha: 15 };
  assert.equal(checkBase('roll', ok, sums).complete, true);
  assert.equal(checkBase('roll', { ...ok, str: 16 }, sums).ok, false);
  assert.equal(checkBase('roll', ok, undefined).ok, false);
  let n = 0;
  const seq = [
    1, 6, 6, 6, 3, 3, 3, 3, 2, 5, 2, 1, 4, 4, 1, 1, 6, 1, 1, 1, 2, 6, 6, 5,
  ];
  const rolled = rollAttributeSets(() => (seq[n++] - 0.5) / 6);
  assert.equal(rolled.sets.length, 6);
  assert.deepEqual(rolled.sets[0], [1, 6, 6, 6]);
  assert.deepEqual(rolled.sums, [18, 9, 9, 9, 8, 17]);
});

// ── Bônus raciais: as 13 raças ──
type Case = [string, string | undefined, Record<string, number>, number[]];
const CASES: Case[] = [
  ['anoes', undefined, { con: 2, str: 1 }, []],
  ['centauros', undefined, { str: 2, wis: 1 }, []],
  ['draconatos', undefined, { str: 2, cha: 1 }, []],
  ['elfo-estelar', undefined, { wis: 2, cha: 1 }, []],
  ['elfos', 'elfos-comuns', { dex: 2, wis: 1 }, []],
  ['elfos', 'drows', { dex: 2, int: 1 }, []],
  ['elfos', 'aerinthalas', { dex: 2, str: 1 }, []],
  ['fadas', undefined, { dex: 2, cha: 1 }, []],
  ['humanos', undefined, {}, [1, 1]],
  ['lapinara', undefined, { dex: 2 }, []],
  ['mesticos', undefined, {}, []],
  ['moogles', undefined, { dex: 2, cha: 1 }, []],
  ['ninfas', undefined, { wis: 2, cha: 1 }, []],
  ['orcs', undefined, { str: 2, con: 1 }, []],
  ['yokais', 'yokai-caninos', { dex: 1 }, [1, 1]],
  ['yokais', 'nagascale', { con: 1 }, [1, 1]],
  ['yokais', 'aquavista', { wis: 1 }, [1, 1]],
];
for (const [slug, sub, fixed, free] of CASES) {
  test(`race bonus: ${slug}${sub ? ` / ${sub}` : ''}`, () => {
    const spec = raceBonus(race(slug), sub);
    assert.deepEqual(spec.fixed, fixed);
    assert.deepEqual(spec.free, free);
  });
}
test('the 13 races are all covered', () => {
  assert.equal(races.length, 13);
  assert.equal(new Set(CASES.map((c) => c[0])).size, 13);
});
test('lapinara: the +1 agility is not an attribute bonus', () => {
  assert.deepEqual(
    parseAbilityIncrease(race('lapinara').abilityScoreIncrease).fixed,
    { dex: 2 }
  );
});
test('yokais: chosen +1 may stack with the subrace fixed +1', () => {
  const spec = raceBonus(race('yokais'), 'yokai-caninos');
  assert.equal(checkRacialPicks(spec, ['dex', 'str']).ok, true);
  const totals = attributeTotals(
    { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    race('yokais'),
    'yokai-caninos',
    ['dex', 'str']
  );
  assert.equal(totals.dex.race, 2);
  assert.equal(totals.str.race, 1);
});
test('racial picks go on different attributes', () => {
  const spec = raceBonus(race('humanos'), undefined);
  assert.equal(checkRacialPicks(spec, ['str', 'str']).ok, false);
  assert.equal(checkRacialPicks(spec, ['str']).complete, false);
  assert.equal(checkRacialPicks(spec, ['str', 'dex']).complete, true);
  assert.equal(checkRacialPicks(raceBonus(race('orcs')), ['str']).ok, false);
});
test('admin override replaces the parsed text', () => {
  const fixed = { ...race('orcs'), abilityBonusOverride: 'FOR+2, CON+2' };
  assert.deepEqual(raceBonus(fixed).fixed, { str: 2, con: 2 });
  assert.deepEqual(parseBonusOverride('NENHUM'), { fixed: {}, free: [] });
  assert.deepEqual(parseBonusOverride('LIVRE+1, LIVRE+1')?.free, [1, 1]);
  assert.equal(parseBonusOverride('  '), null);
  assert.deepEqual(
    addBonus({ fixed: { str: 1 }, free: [] }, { fixed: { str: 1 }, free: [1] }),
    { fixed: { str: 2 }, free: [1] }
  );
});

// ── Sub-raça ──
test('subrace rule', () => {
  assert.equal(subraceRule(race('centauros')).mode, 'none');
  assert.equal(subraceRule(race('mesticos')).mode, 'mixed');
  assert.deepEqual(subraceRule(race('humanos')), {
    mode: 'auto',
    commonSlug: 'humanos-comuns',
  });
  assert.deepEqual(subraceRule(race('elfos')), {
    mode: 'auto',
    commonSlug: 'elfos-comuns',
  });
  assert.equal(subraceRule(race('anoes')).mode, 'required');
  assert.equal(subraceRule(race('orcs')).mode, 'required');
  assert.equal(subraceRule(race('yokais')).mode, 'required');
  const fadas = { ...race('fadas'), baseOnlyTraits: [{ name: 'x' }] };
  assert.deepEqual(subraceRule(fadas), {
    mode: 'optional',
    label: 'Fada comum',
  });
});

// ── Idiomas ──
test('languages', () => {
  assert.deepEqual(
    parseLanguages('Você pode falar, ler e escrever Comum e Anão.'),
    ['Comum', 'Anão']
  );
  assert.deepEqual(parseLanguages(''), []);
  assert.deepEqual(raceLanguages(race('anoes'), 'fornbardun'), [
    'Comum',
    'Anão',
  ]);
  assert.deepEqual(raceLanguages(race('elfos'), undefined), ['Comum']);
  assert.deepEqual(
    raceLanguages(
      { ...race('elfos'), languagesOverride: 'Comum, Élfico' },
      undefined
    ),
    ['Comum', 'Élfico']
  );
  assert.deepEqual(
    raceLanguages(race('mesticos'), undefined, [race('anoes'), race('elfos')]),
    ['Comum', 'Anão']
  );
});

// ── Perícias ──
test('skills parse', () => {
  const a = parseSkillChoice(
    'Escolha duas entre Acrobacia, Atletismo, Furtividade, Intuição, Percepção'
  );
  assert.equal(a.n, 2);
  assert.equal(a.list.length, 5);
  const b = parseSkillChoice(
    'Escolha quatro entre: Acrobacia, Atletismo e Furtividade.'
  );
  assert.equal(b.n, 4);
  assert.deepEqual(b.list, ['Acrobacia', 'Atletismo', 'Furtividade']);
  assert.equal(
    parseSkillChoice('Escolha três dentre Adestrar Animais, Natureza').n,
    3
  );
  assert.deepEqual(
    parseSkillChoice('Escolha três dentre Adestrar Animais, Natureza').list,
    ['Lidar com Animais', 'Natureza']
  );
  assert.deepEqual(parseSkillChoice(''), { n: null, list: [] });
  assert.deepEqual(parseSkillChoice('qualquer'), { n: null, list: [] });
});

// ── Gil ──
test('gil formulas', () => {
  assert.deepEqual(parseGilFormula('4d6 × 10'), {
    count: 4,
    sides: 6,
    mult: 10,
    add: 0,
  });
  assert.deepEqual(parseGilFormula('1d100'), {
    count: 1,
    sides: 100,
    mult: 1,
    add: 0,
  });
  assert.deepEqual(parseGilFormula('2d100 + 50'), {
    count: 2,
    sides: 100,
    mult: 1,
    add: 50,
  });
  assert.deepEqual(parseGilFormula('10d6'), {
    count: 10,
    sides: 6,
    mult: 1,
    add: 0,
  });
  assert.equal(parseGilFormula('muito'), null);
  const low = rollGil(parseGilFormula('4d6 × 10')!, () => 0);
  assert.equal(low.total, 40);
  const high = rollGil(parseGilFormula('4d6 × 10')!, () => 0.999);
  assert.equal(high.total, 240);
  assert.equal(rollGil(parseGilFormula('2d100 + 50')!, () => 0).total, 52);
  assert.equal(rollGil(parseGilFormula('2d100 + 50')!, () => 0.999).total, 250);
  assert.equal(rollGil(parseGilFormula('10d6')!, () => 0.999).total, 60);
});

// ── Vida e conjuração ──
test('level 1 HP = full die + CON modifier (min 1)', () => {
  assert.equal(level1Hp(12, 14), 14);
  assert.equal(level1Hp(10, 10), 10);
  assert.equal(level1Hp(6, 8), 5);
  assert.equal(level1Hp(6, 3), 2);
  assert.equal(level1Hp(4, 1), 1);
});
test('spell DC and attack from the class', () => {
  assert.deepEqual(castingNumbers(16, 2), { saveDC: 13, attackBonus: 5 });
  assert.deepEqual(castingNumbers(8, 2), { saveDC: 9, attackBonus: 1 });
});
test('suggest order: casting, then saves, then CON, then DEX', () => {
  assert.deepEqual(suggestOrder('wis', ['wis', 'cha']), [
    'wis',
    'cha',
    'con',
    'dex',
    'str',
    'int',
  ]);
  assert.deepEqual(suggestOrder(undefined, ['str', 'dex']).slice(0, 4), [
    'str',
    'dex',
    'con',
    'int',
  ]);
});

// ── O que falta para enviar ──
test('issues: required vs recommended', () => {
  const none = creationIssues({
    base: {},
    racialPicks: [],
    featureChoices: [],
    skills: [],
    cantrips: 0,
    prepared: 0,
    soft: {},
  });
  assert.ok(none.some((i) => i.step === 'identidade' && i.kind === 'required'));
  assert.ok(none.some((i) => i.step === 'raca'));
  assert.ok(none.some((i) => i.step === 'classe'));
  assert.ok(
    none.some((i) => i.kind === 'recommended' && i.step === 'equipamento')
  );
  const ready = creationIssues({
    name: 'Ana',
    race: race('centauros'),
    klass: {
      skills: parseSkillChoice('Escolha duas entre Acrobacia, Atletismo'),
      featureChoiceCount: 0,
      cantripsKnown: 2,
      preparedLimit: 2,
      caster: true,
    },
    method: 'standardArray',
    base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    racialPicks: [],
    featureChoices: [],
    skills: ['Acrobacia', 'Atletismo'],
    cantrips: 2,
    prepared: 2,
    soft: {
      equipment: true,
      history: true,
      portrait: true,
      extraLanguage: true,
    },
  });
  assert.deepEqual(ready, []);
  const noSpells = creationIssues({
    name: 'Ana',
    race: race('centauros'),
    klass: {
      skills: parseSkillChoice('Escolha duas entre Acrobacia, Atletismo'),
      featureChoiceCount: 0,
      cantripsKnown: 2,
      preparedLimit: 2,
      caster: true,
    },
    method: 'standardArray',
    base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    racialPicks: [],
    featureChoices: [],
    skills: ['Acrobacia', 'Atletismo'],
    cantrips: 0,
    prepared: 0,
    soft: {},
  });
  assert.equal(noSpells.filter((i) => i.step === 'magias').length, 2);
});

test('saving throws parse', () => {
  assert.deepEqual(parseSavingThrows('Destreza, Carisma'), ['dex', 'cha']);
  assert.deepEqual(parseSavingThrows('for, carisma'), ['str', 'cha']);
  assert.deepEqual(parseSavingThrows('Destreza, Con'), ['dex', 'con']);
  assert.deepEqual(parseSavingThrows('Int, Dex'), ['int', 'dex']);
});

// ── Mestiço: o bônus vem da raça DOMINANTE (só a base, sem a sub-raça) ──
test('mestiço: dominant Elfos -> DEX+2 only (not the subrace +1)', () => {
  const spec = raceBonus(race('mesticos'), undefined, race('elfos'));
  assert.deepEqual(spec.fixed, { dex: 2 });
  assert.deepEqual(spec.free, []);
});
test('mestiço: dominant Humanos -> two free +1; dominant Yokais -> two free +1, no subrace +1', () => {
  assert.deepEqual(raceBonus(race('mesticos'), undefined, race('humanos')), {
    fixed: {},
    free: [1, 1],
  });
  assert.deepEqual(raceBonus(race('mesticos'), undefined, race('yokais')), {
    fixed: {},
    free: [1, 1],
  });
});
test('mestiço: no dominant, no bonus; a non-mixed race ignores the dominant', () => {
  assert.deepEqual(raceBonus(race('mesticos')), { fixed: {}, free: [] });
  assert.deepEqual(raceBonus(race('orcs'), undefined, race('elfos')).fixed, {
    str: 2,
    con: 1,
  });
});
test('mestiço: the override of the dominant race counts', () => {
  const orcs = { ...race('orcs'), abilityBonusOverride: 'FOR+1, CAR+1' };
  assert.deepEqual(raceBonus(race('mesticos'), undefined, orcs).fixed, {
    str: 1,
    cha: 1,
  });
  const totals = attributeTotals(
    { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    race('mesticos'),
    undefined,
    [],
    race('elfos')
  );
  assert.equal(totals.dex.race, 2);
  assert.equal(totals.dex.total, 12);
});
test('mestiço: picks for the dominant Humanos must differ', () => {
  const spec = raceBonus(race('mesticos'), undefined, race('humanos'));
  assert.equal(checkRacialPicks(spec, ['str', 'str']).ok, false);
  assert.equal(checkRacialPicks(spec, ['str', 'dex']).complete, true);
  const issues = creationIssues({
    name: 'A',
    race: race('mesticos'),
    raceChoice: {
      parents: ['elfos', 'humanos'],
      dominantParent: 'humanos',
      hybridTraits: [1, 2],
    },
    dominantRace: race('humanos'),
    method: 'standardArray',
    base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    racialPicks: [],
    featureChoices: [],
    skills: [],
    cantrips: 0,
    prepared: 0,
    soft: {},
  });
  assert.ok(
    issues.some((i) => i.step === 'atributos' && i.kind === 'required')
  );
});

// ── "Concede na criação" ──
test('creation grants: parsing and totals', () => {
  const entries = parseCreationGrants(
    'versatil:1=Versatilidade Adaptativa, talentos:1=Talentosos, pericias:2, idiomas:1, lixo, :3, pericias:0'
  );
  assert.deepEqual(entries, [
    { kind: 'versatile', n: 1, label: 'Versatilidade Adaptativa' },
    { kind: 'talents', n: 1, label: 'Talentosos' },
    { kind: 'skills', n: 2 },
    { kind: 'languages', n: 1 },
  ]);
  assert.deepEqual(sumGrants(entries), {
    skills: 2,
    talents: 1,
    languages: 1,
    versatile: 1,
  });
  assert.deepEqual(parseCreationGrants(''), []);
});
test('creation grants: race + subrace add; the mestiço only has its own block', () => {
  const humanos = {
    ...race('humanos'),
    creationGrants: 'versatil:1, talentos:1',
    subraces: race('humanos').subraces.map((s) =>
      s.slug === 'humanos-comuns'
        ? { ...s, creationGrants: 'pericias:1=Variedade Genética' }
        : s
    ),
  };
  assert.deepEqual(sumGrants(racialGrants(humanos, 'humanos-comuns')), {
    skills: 1,
    talents: 1,
    languages: 0,
    versatile: 1,
  });
  assert.deepEqual(sumGrants(racialGrants(humanos, 'nordicos')), {
    skills: 0,
    talents: 1,
    languages: 0,
    versatile: 1,
  });
  assert.deepEqual(racialGrants(race('mesticos'), undefined), []);
});
test('creation grants: picks are counted, deduplicated and bounded', () => {
  const totals = { skills: 1, talents: 1, languages: 0, versatile: 1 };
  const ok = {
    skills: ['Furtividade'],
    talents: ['alerta'],
    languages: [],
    versatile: [{ kind: 'tool' as const, value: 'Kit de ladrão' }],
  };
  assert.equal(checkGrantPicks(totals, ok, ['Atletismo']).complete, true);
  assert.equal(
    checkGrantPicks(totals, { ...ok, skills: ['Atletismo'] }, ['Atletismo']).ok,
    false,
    'duplicates a class pick'
  );
  assert.equal(
    checkGrantPicks(totals, { ...ok, skills: ['Ofício'] }, []).ok,
    false,
    'not one of the 18'
  );
  assert.equal(
    checkGrantPicks(totals, { ...ok, skills: ['Furtividade', 'Atletismo'] }, [])
      .ok,
    false,
    'too many'
  );
  assert.equal(
    checkGrantPicks(
      totals,
      { ...ok, versatile: [{ kind: 'skill', value: 'Furtividade' }] },
      []
    ).ok,
    false,
    'versatile skill repeats the racial one'
  );
  assert.equal(
    checkGrantPicks(
      totals,
      { ...ok, versatile: [{ kind: 'x' as never, value: 'a' }] },
      []
    ).ok,
    false
  );
  assert.equal(
    checkGrantPicks(
      totals,
      { ...ok, versatile: [{ kind: 'tool', value: 'x'.repeat(61) }] },
      []
    ).ok,
    false
  );
  assert.equal(
    checkGrantPicks(totals, { ...ok, talents: [] }, []).complete,
    false
  );
  assert.equal(SKILL_NAMES.length, 18);
  assert.equal(
    checkGrantPicks(
      { ...totals, languages: 1 },
      { ...ok, languages: ['Comum'] },
      [],
      ['Comum']
    ).ok,
    false,
    'already a sheet language'
  );
});
test('creation grants: required to submit', () => {
  const base = {
    name: 'A',
    race: race('centauros'),
    klass: {
      skills: parseSkillChoice('Escolha duas entre Acrobacia, Atletismo'),
      featureChoiceCount: 0,
      cantripsKnown: 0,
      preparedLimit: 0,
      caster: false,
    },
    method: 'standardArray' as const,
    base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    racialPicks: [],
    featureChoices: [],
    skills: ['Acrobacia', 'Atletismo'],
    cantrips: 0,
    prepared: 0,
    soft: {},
  };
  const need = creationIssues({
    ...base,
    grantTotals: { skills: 1, talents: 1, languages: 1, versatile: 1 },
  });
  assert.equal(need.filter((i) => i.kind === 'required').length, 4);
  const done = creationIssues({
    ...base,
    grantTotals: { skills: 1, talents: 1, languages: 1, versatile: 1 },
    grants: {
      skills: ['Furtividade'],
      talents: ['alerta'],
      languages: ['Élfico'],
      versatile: [{ kind: 'instrument', value: 'Alaúde' }],
    },
  });
  assert.equal(done.filter((i) => i.kind === 'required').length, 0);
});

// ── Deslocamento ──
test('speed parsing: the real race texts', () => {
  const cases: [string | undefined, Record<string, unknown>][] = [
    [
      'Seres de pernas curtas e braços largos, são pesados por natureza, os anãos possuem um deslocamento de 7 metros.',
      { walk: 7 },
    ],
    [
      'Seu deslocamento base de caminhada é 7 metros. Seu deslocamento não é reduzido por uso de armadura pesada.',
      {
        walk: 7,
        note: 'Seu deslocamento não é reduzido por uso de armadura pesada.',
      },
    ],
    ['Seu deslocamento base é de 12 metros.', { walk: 12 }],
    ['Seu deslocamento base é de 9 metros.', { walk: 9 }],
    [
      'Seu deslocamento base é de 6 metros em terra e 9 metros em voo.',
      { walk: 6, fly: 9 },
    ],
    [
      'Seu deslocamento base de caminhada é 7 metros. Você também tem um deslocamento de natação de 12 metros.',
      { walk: 7, swim: 12 },
    ],
    ['Seu deslocamento base é de 6 metros.', { walk: 6 }],
    [undefined, {}],
    ['', {}],
    ['9 metros de natação e 4,5 metros de escalada', { swim: 9, climb: 4.5 }],
  ];
  for (const [text, want] of cases)
    assert.deepEqual(parseSpeed(text), want, String(text));
});
test('speed: the subrace text wins; the mestiço uses its own text', () => {
  const aqua = {
    ...race('yokais'),
    speed: 'Seu deslocamento base é de 9 metros.',
    subraces: race('yokais').subraces.map((s) =>
      s.slug === 'aquavista'
        ? {
            ...s,
            speed:
              'Seu deslocamento base de caminhada é 7 metros. Você também tem um deslocamento de natação de 12 metros.',
          }
        : s
    ),
  };
  assert.deepEqual(raceSpeed(aqua, 'aquavista'), { walk: 7, swim: 12 });
  assert.deepEqual(raceSpeed(aqua, 'yokai-caninos'), { walk: 9 });
  const mest = {
    ...race('mesticos'),
    speed: 'Seu deslocamento base de caminhada é 9 metros.',
  };
  assert.deepEqual(raceSpeed(mest), { walk: 9 });
  assert.deepEqual(raceSpeed(race('lapinara')), {});
});

console.log(`\n${passed} ok`);
