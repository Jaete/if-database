/**
 * Cronograma das listas de escolha da classe, lido do texto das listas reais
 * (fixtures/catalogs.json, do banco): `npm run test:catalogs`. Sem banco.
 */
import assert from 'node:assert/strict';
import catalogs from './fixtures/catalogs.json';
import {
  describeSchedule,
  isPickable,
  parsePickSchedule,
  picksDueAt,
  pickLevelsOf,
} from '../lib/catalogPicks';

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

type Cat = (typeof catalogs)[number];
const cat = (cls: string, slug: string): Cat => {
  const found = catalogs.find((c) => c.class === cls && c.slug === slug);
  assert.ok(found, `${cls}/${slug}`);
  return found;
};
const every = (from: number, step: number) => {
  const out: number[] = [];
  for (let l = from; l <= 20; l += step) out.push(l);
  return out;
};

test('Espadachim / Técnicas de Investida: 2 e a cada dois níveis', () => {
  assert.deepEqual(
    pickLevelsOf(cat('espadachim', 'tecnicas-de-investida')),
    every(2, 2)
  );
});
test('Berserker / Formas de Fúria: 2, 5, 10, 15, 20', () => {
  assert.deepEqual(
    pickLevelsOf(cat('berserker', 'formas-de-furia')),
    [2, 5, 10, 15, 20]
  );
});
test('Berserker / Poderes de Fúria: 2 e a cada 2 níveis', () => {
  assert.deepEqual(
    pickLevelsOf(cat('berserker', 'poderes-de-furia')),
    every(2, 2)
  );
});
test('Dançarino / Talentos de Dança: 2 e a cada 2 (os avançados não somam)', () => {
  assert.deepEqual(
    pickLevelsOf(cat('dancarino', 'talentos-de-danca')),
    every(2, 2)
  );
});
test('Dançarino / Danças Místicas: 6 e a cada três', () => {
  assert.deepEqual(
    pickLevelsOf(cat('dancarino', 'dancas-misticas')),
    [6, 9, 12, 15, 18]
  );
});
test('Bardo / Performances Versáteis Avançadas: 6 e a cada quatro', () => {
  assert.deepEqual(
    pickLevelsOf(cat('bardo', 'performances-versateis-avancadas')),
    [6, 10, 14, 18]
  );
});
test('Paladino / Artes Divinas: duas no 7º, mais uma a cada três', () => {
  assert.deepEqual(
    pickLevelsOf(cat('paladino', 'artes-divinas')),
    [7, 7, 10, 13, 16, 19]
  );
  assert.equal(picksDueAt(cat('paladino', 'artes-divinas'), 7), 2);
  assert.equal(picksDueAt(cat('paladino', 'artes-divinas'), 8), 0);
});
test('Monge / Habilidades de Fúria: do 5º, a cada dois níveis', () => {
  assert.deepEqual(
    pickLevelsOf(cat('monge', 'habilidades-de-furia-berserker')),
    every(5, 2)
  );
});
test('Monge / Técnicas Blitz: o texto não diz o início, a correção da lista diz', () => {
  const blitz = cat('monge', 'tecnicas-blitz');
  assert.deepEqual(parsePickSchedule(blitz.description), []);
  assert.equal(isPickable(blitz), false);
  const fixed = { ...blitz, pickLevels: [7, 9, 11, 13, 15, 17, 19] };
  assert.equal(isPickable(fixed), true);
  assert.equal(picksDueAt(fixed, 7), 1);
  assert.equal(picksDueAt(fixed, 8), 0);
});
test('not pick-lists: spell lists, Manobras, Performances Bárdicas, Ordens', () => {
  const pickable = catalogs
    .filter((c) => isPickable(c))
    .map((c) => `${c.class}/${c.slug}`);
  assert.deepEqual(pickable.sort(), [
    'bardo/performances-versateis-avancadas',
    'berserker/formas-de-furia',
    'berserker/poderes-de-furia',
    'dancarino/dancas-misticas',
    'dancarino/talentos-de-danca',
    'espadachim/tecnicas-de-investida',
    'monge/habilidades-de-furia-berserker',
    'paladino/artes-divinas',
  ]);
  for (const c of catalogs.filter((c) =>
    ['magias', 'truques', 'musicas', 'jingles'].includes(c.slug)
  )) {
    assert.equal(isPickable(c), false, c.slug);
  }
});
test('overrides: pickable false, picksPerLevel and levels', () => {
  const inv = cat('espadachim', 'tecnicas-de-investida');
  assert.equal(isPickable({ ...inv, pickable: false }), false);
  assert.equal(picksDueAt({ ...inv, picksPerLevel: 2 }, 2), 2);
  assert.equal(isPickable({ description: 'qualquer', pickLevels: [3] }), true);
  assert.equal(
    isPickable({ description: 'qualquer', kind: 'relacao', pickLevels: [3] }),
    false
  );
  assert.equal(
    describeSchedule({ description: '', pickLevels: [7, 7, 10] }),
    '7×2, 10'
  );
});
test('parser: explicit lists, counts and bad input', () => {
  assert.deepEqual(
    parsePickSchedule('No 3º nível e nos níveis 6 e 9, escolhe.'),
    [3, 6, 9]
  );
  assert.deepEqual(
    parsePickSchedule('Ganha duas coisas no 1º nível. Depois a cada 5 níveis.'),
    [1, 1, 6, 11, 16]
  );
  assert.deepEqual(parsePickSchedule(''), []);
  assert.deepEqual(parsePickSchedule(undefined), []);
  assert.deepEqual(parsePickSchedule('A cada dois níveis subsequentes.'), []);
  assert.deepEqual(parsePickSchedule('No 99º nível a cada dois níveis'), []);
});

console.log(`\n${passed} ok`);
