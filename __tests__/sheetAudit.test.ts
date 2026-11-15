/**
 * O diff da auditoria da ficha: `npm run test:audit`. Sem banco.
 */
import assert from 'node:assert/strict';
import { diffSheet, labelOf, mergeChanges } from '../lib/sheetDiff';

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

test('scalar and nested fields: path, label, before → after', () => {
  const changes = diffSheet(
    { name: 'Ana', equipment: { gil: 10, backpack: 'Corda' } },
    { name: 'Ana B', equipment: { gil: 99, backpack: 'Corda' } }
  );
  assert.deepEqual(
    changes.map((c) => [c.path, c.label, c.before, c.after]),
    [
      ['name', 'Nome', 'Ana', 'Ana B'],
      ['equipment.gil', 'Gil', 10, 99],
    ]
  );
});
test('lists with names are diffed item by item (skills, spells)', () => {
  const changes = diffSheet(
    {
      proficiencies: {
        skills: [
          { name: 'Atletismo', value: 3 },
          { name: 'Furtividade', value: 1 },
        ],
      },
    },
    {
      proficiencies: {
        skills: [
          { name: 'Atletismo', value: 5 },
          { name: 'Natureza', value: 2 },
        ],
      },
    }
  );
  const byPath = Object.fromEntries(changes.map((c) => [c.path, c]));
  assert.equal(
    byPath['proficiencies.skills[Atletismo]'].label,
    'Perícia · Atletismo'
  );
  assert.equal(
    (byPath['proficiencies.skills[Atletismo]'].after as { value: number })
      .value,
    5
  );
  assert.equal(byPath['proficiencies.skills[Furtividade]'].after, null);
  assert.equal(byPath['proficiencies.skills[Natureza]'].before, null);
});
test('derived and control fields are ignored', () => {
  assert.deepEqual(
    diffSheet(
      {
        name: 'A',
        updatedAt: 1,
        __v: 0,
        levelLocks: [],
        novelties: [],
        abilitiesResolved: [],
        lineage: { a: 1 },
        creation: { base: { str: 8 } },
      },
      {
        name: 'A',
        updatedAt: 2,
        __v: 1,
        levelLocks: [{ level: 2 }],
        novelties: [{}],
        abilitiesResolved: [1],
        lineage: { a: 2 },
        creation: { base: { str: 15 }, method: 'roll' },
      }
    ),
    []
  );
});
test('creation is never logged; review notes only as "Observações enviadas"', () => {
  const changes = diffSheet(
    { status: 'submitted', review: [{ kind: 'submit' }] },
    {
      status: 'returned',
      creation: { secret: true },
      review: [
        { kind: 'submit' },
        {
          kind: 'return',
          notes: 'Texto privado da staff',
          steps: ['historia'],
        },
      ],
    }
  );
  assert.deepEqual(changes.map((c) => c.path).sort(), ['review', 'status']);
  const review = changes.find((c) => c.path === 'review')!;
  assert.equal(review.label, 'Observações enviadas');
  assert.ok(!JSON.stringify(changes).includes('privado'));
  // Aprovar (nota só de rótulos) não vira "Observações enviadas".
  assert.deepEqual(
    diffSheet(
      { review: [] },
      { review: [{ kind: 'approve', notes: 'Aprovada com ajustes: Gil' }] }
    ),
    []
  );
});
test('creation of a sheet shows what was born; ObjectIds compare by value', () => {
  const created = diffSheet(null, { name: 'Nova', level: 1, classId: 'abc' });
  assert.deepEqual(created.map((c) => c.path).sort(), [
    'classId',
    'level',
    'name',
  ]);
  assert.equal(created.find((c) => c.path === 'name')!.before, undefined);
  const id = { _bsontype: 'ObjectId', toString: () => 'abc' };
  assert.deepEqual(diffSheet({ classId: id }, { classId: 'abc' }), []);
});
test('long text is clipped at 4000 characters', () => {
  const [c] = diffSheet({ backstory: '' }, { backstory: 'x'.repeat(5000) });
  assert.equal((c.after as string).length, 4001);
});
test('labels for finer paths', () => {
  assert.equal(labelOf('equipment.gil'), 'Gil');
  assert.equal(labelOf('combat.hp.value'), 'Vida');
  assert.equal(labelOf('playerStats.str.base'), 'Atributo · Força');
  assert.equal(labelOf('backstory'), 'História');
});
test('merge keeps the FIRST before and the LAST after; a reverted field leaves', () => {
  const prev = [
    { path: 'name', label: 'Nome', before: 'A', after: 'B' },
    { path: 'age', label: 'Idade', before: '1', after: '2' },
  ];
  const next = [
    { path: 'name', label: 'Nome', before: 'B', after: 'C' },
    { path: 'age', label: 'Idade', before: '2', after: '1' },
    { path: 'height', label: 'Altura', before: undefined, after: '2m' },
  ];
  assert.deepEqual(mergeChanges(prev, next), [
    { path: 'name', label: 'Nome', before: 'A', after: 'C' },
    { path: 'height', label: 'Altura', before: undefined, after: '2m' },
  ]);
});
test('ownerForumUserId and description are never part of the diff', () => {
  const out = diffSheet(
    { name: 'A', ownerForumUserId: 1, description: 'x', ownerUsername: 'u' },
    { name: 'B', ownerForumUserId: 2, description: 'y', ownerUsername: 'v' }
  );
  assert.deepEqual(out.map((c) => c.path).sort(), ['name', 'ownerUsername']);
});

console.log(`\n${passed} ok`);
