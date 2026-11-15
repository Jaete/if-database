/**
 * Proficiência em perícia (fontes, especialização, teto): `npm run test:skills`.
 * Sem banco.
 */
import assert from 'node:assert/strict';
import {
  CAP_MESSAGE,
  DUPLICATE_MESSAGE,
  normalizeStaffSkills,
  proficiencyLevel,
  setStaffLevel,
  shiftSkills,
  skillTotal,
  sourceCaption,
  sourcesIssue,
  sourcesOf,
} from '../lib/skills';
import {
  checkGrantPicks,
  skillSources,
  skillSourcesIssue,
} from '../lib/creation';

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

const klass = { source: 'class' };
const race = (label: string, grant = 'skills:0') => ({
  source: 'race',
  label,
  grant,
});

test('level: none, legacy proficient, one source, two sources, capped at 2', () => {
  assert.equal(proficiencyLevel(undefined), 0);
  assert.equal(proficiencyLevel({}), 0);
  assert.equal(proficiencyLevel({ proficient: true }), 1);
  assert.equal(proficiencyLevel({ proficiencySources: [klass] }), 1);
  assert.equal(proficiencyLevel({ proficiencySources: [klass, race('x')] }), 2);
  assert.equal(
    proficiencyLevel({
      proficiencySources: [klass, race('x'), { source: 'staff' }],
    }),
    2
  );
  assert.equal(
    proficiencyLevel({ proficient: true, proficiencySources: [] }),
    0
  );
  assert.deepEqual(sourcesOf({ proficient: true }), [{ source: 'legacy' }]);
});
test('value = modifier + PB × level + flat bonuses (bonuses outside the cap)', () => {
  assert.equal(skillTotal(2, 0, 3), 2);
  assert.equal(skillTotal(2, 1, 3), 5);
  assert.equal(skillTotal(2, 2, 3), 8);
  assert.equal(skillTotal(2, 2, 3, 4), 12);
  assert.equal(skillTotal(2, 9, 3), 8, 'nunca mais de duas aplicações');
  assert.equal(skillTotal(-1, 1, 2, 5), 6);
});
test('sources: duplicates in the SAME source are refused, a third source is capped', () => {
  assert.equal(
    sourcesIssue('Persuasão', [klass, race('Variedade Genética')]),
    null
  );
  assert.equal(
    sourcesIssue('Persuasão', [klass, klass]),
    'Você já escolheu Persuasão nesta lista.'
  );
  assert.equal(
    sourcesIssue('Persuasão', [klass, race('A'), race('B', 'versatile:1')]),
    CAP_MESSAGE('Persuasão')
  );
  assert.equal(
    CAP_MESSAGE('Persuasão'),
    'Proficiência em Persuasão já é especialização — não acumula mais.'
  );
  assert.equal(
    DUPLICATE_MESSAGE('Persuasão'),
    'Você já escolheu Persuasão nesta lista.'
  );
});
test('creation: class + racial grant = expertise; the two racial grants differ; a third is refused', () => {
  const entries = [
    { kind: 'versatile' as const, n: 1, label: 'Versatilidade Adaptativa' },
    { kind: 'skills' as const, n: 1, label: 'Variedade Genética' },
  ];
  const picks = (skills: string[], versatile: string[]) => ({
    skills,
    talents: [],
    languages: [],
    versatile: versatile.map((value) => ({ kind: 'skill' as const, value })),
  });
  // Classe + Variedade Genética na mesma perícia: especialização.
  const two = skillSources(['Persuasão'], entries, picks(['Persuasão'], []));
  assert.equal(two.get('Persuasão')?.length, 2);
  assert.equal(skillSourcesIssue(two), null);
  // As duas concessões da raça (fontes diferentes) também somam.
  const racial = skillSources(
    [],
    entries,
    picks(['Furtividade'], ['Furtividade'])
  );
  assert.equal(racial.get('Furtividade')?.length, 2);
  assert.equal(skillSourcesIssue(racial), null);
  // Classe + as duas da raça: a terceira é recusada.
  const three = skillSources(
    ['Furtividade'],
    entries,
    picks(['Furtividade'], ['Furtividade'])
  );
  assert.equal(skillSourcesIssue(three), CAP_MESSAGE('Furtividade'));
  const totals = { skills: 1, talents: 0, languages: 0, versatile: 1 };
  assert.equal(
    checkGrantPicks(
      totals,
      picks(['Furtividade'], ['Furtividade']),
      ['Furtividade'],
      [],
      entries
    ).message,
    CAP_MESSAGE('Furtividade')
  );
  assert.equal(
    checkGrantPicks(
      totals,
      picks(['Furtividade'], ['Furtividade']),
      [],
      [],
      entries
    ).ok,
    true
  );
  // Duas escolhas na MESMA concessão repetindo a perícia: erro de lista.
  const same = checkGrantPicks(
    { skills: 2, talents: 0, languages: 0, versatile: 0 },
    picks(['Furtividade', 'Furtividade'], []),
    [],
    [],
    [{ kind: 'skills', n: 2, label: 'X' }]
  );
  assert.equal(same.message, DUPLICATE_MESSAGE('Furtividade'));
  // A classe repetindo na própria lista.
  assert.equal(
    skillSourcesIssue(
      skillSources(['Persuasão', 'Persuasão'], [], picks([], []))
    ),
    DUPLICATE_MESSAGE('Persuasão')
  );
});
test('staff: any level straight, no source restriction; ceiling is level 2', () => {
  assert.deepEqual(setStaffLevel([], 2), [
    { source: 'staff' },
    { source: 'staff' },
  ]);
  assert.deepEqual(setStaffLevel([], 1), [{ source: 'staff' }]);
  assert.deepEqual(setStaffLevel([klass], 2), [klass, { source: 'staff' }]);
  assert.deepEqual(setStaffLevel([klass, race('x')], 2), [klass, race('x')]);
  // Sobe e desce: tira primeiro a fonte do narrador, depois as outras.
  assert.deepEqual(setStaffLevel([klass, { source: 'staff' }], 1), [klass]);
  assert.deepEqual(setStaffLevel([klass], 0), []);
  assert.deepEqual(setStaffLevel([klass, race('x')], 0), []);
  assert.deepEqual(setStaffLevel([{ source: 'legacy' }], 0), []);
  assert.equal(setStaffLevel([], 9).length, 2);
  assert.deepEqual(
    normalizeStaffSkills([
      {
        proficient: false,
        proficiencySources: [klass, race('x'), { source: 'staff' }],
      },
      { proficient: true },
      { proficient: true, proficiencySources: [] },
    ]),
    [
      { proficient: true, proficiencySources: [klass, race('x')] },
      { proficient: true },
      { proficient: false, proficiencySources: [] },
    ]
  );
});
test('caption names the sources', () => {
  assert.equal(
    sourceCaption([klass, race('Variedade Genética'), { source: 'staff' }]),
    'Classe + Raça · Variedade Genética + Narrador'
  );
});
test('proficiency bonus change shifts proficient skills once per application', () => {
  const skills = [
    {
      name: 'Persuasão',
      proficient: true,
      proficiencySources: [klass, race('x')],
      value: 7,
    },
    { name: 'Atletismo', proficient: true, value: 4 },
    { name: 'Furtividade', value: 1 },
    { name: 'Sem valor', proficient: true },
  ];
  const up = shiftSkills(skills, 2, 3);
  assert.equal(up[0].value, 9);
  assert.equal(up[1].value, 5);
  assert.equal(up[2].value, 1);
  assert.equal(up[3].value, undefined);
  assert.deepEqual(shiftSkills(up, 3, 2), skills);
  assert.equal(shiftSkills(skills, 2, 2), skills);
});

console.log(`\n${passed} ok`);
