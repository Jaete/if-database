/**
 * Testes de regressão do parser de itens (fase 0: sem banco).
 *
 * Rodado via: npm run test:items
 *
 * Roda contra as páginas reais do fórum salvas em __tests__/fixtures/items:
 * contagens por loja, linhas de referência (Killer Bow), formatos de preço, de
 * CA, tiers numéricos, slugs, o alias do t280 e os efeitos de consumíveis.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { extractPostBodies } from '../services/forumSheet.service';
import {
  assignUniqueSlugs,
  parseArmorClass,
  parseDamage,
  parseEffectText,
  parseEffectsTopic,
  parsePrice,
  parseShopTopic,
  parseTier,
  resolveEffectRefs,
  starAbilitiesOf,
  type IParsedItem,
} from '../services/itemTopic.service';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    const msg =
      err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  ✗ ${name}`);
    console.error(`    ${msg}`);
    failed++;
  }
}

function describe(suite: string, fn: () => void) {
  console.log(`\n${suite}`);
  fn();
}

const FIXTURES = path.join(__dirname, 'fixtures', 'items');
const ORIGIN = 'https://isekaifantasy.forumbrasil.net';
const read = (slug: string) =>
  fs.readFileSync(path.join(FIXTURES, `${slug}.html`), 'utf8');

const shop = (id: string, slug: string) =>
  parseShopTopic(read(slug), `${ORIGIN}/${slug}`);

const weapons = shop('t17', 't17-loja-de-armas');
const armors = shop('t18', 't18-loja-de-armaduras');
const goods = shop('t20', 't20-loja-de-itens');
const misc = shop('t24', 't24-lojas-diversas');
const books = shop('t53', 't53-livraria');
const effects = parseEffectsTopic(
  read('t280-refinamento-e-efeitos-de-equipamentos'),
  `${ORIGIN}/t280-refinamento-e-efeitos-de-equipamentos`
);

const find = (items: IParsedItem[], name: string, category?: string) => {
  const item = items.find(
    (i) => i.name === name && (!category || i.category === category)
  );
  assert.ok(item, `item "${name}" não encontrado`);
  return item;
};

// ─── Contagens ─────────────────────────────────────────────────────────────

describe('contagens', () => {
  test('lojas: 155 / 32 / 75 / 102 / 6', () => {
    assert.equal(weapons.items.length, 155);
    assert.equal(armors.items.length, 32);
    assert.equal(goods.items.length, 75);
    assert.equal(misc.items.length, 102);
    assert.equal(books.items.length, 6);
  });

  test('armas: 18 tipos x 8 tiers + tabela de armas de fogo com 11', () => {
    const byCategory = new Map<string, number>();
    for (const c of weapons.categories) byCategory.set(c.name, c.itemCount);
    assert.equal(weapons.categories.length, 19);
    assert.equal(byCategory.get('Armas de fogo antigas e modernas'), 11);
    const eights = [...byCategory.values()].filter((n) => n === 8);
    assert.equal(eights.length, 18);
  });

  test('t280: 282 entradas, 226 nomes únicos, 13 propriedades', () => {
    assert.equal(effects.effects.length, 282);
    const unique = new Set(
      effects.effects.map((e) =>
        e.name
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, ' ')
          .trim()
      )
    );
    assert.equal(unique.size, 226);
    assert.equal(effects.properties.length, 13);
  });

  test('regras de refinamento: +9, +1 por nível, +1m à distância', () => {
    assert.deepEqual(effects.refine, {
      maxLevel: 9,
      bonusPerLevel: 1,
      rangedRangePerLevelM: 1,
    });
  });

  test('os blocos de publicidade ficam de fora', () => {
    const html = read('t18-loja-de-armaduras');
    const raw = (html.match(/class="postbody"/g) ?? []).length;
    const bodies = extractPostBodies(html);
    assert.equal(raw, 6);
    assert.equal(bodies.length, 4);
    assert.ok(bodies.every((b) => !/slmadshb/.test(b)));
  });
});

// ─── Linha de referência ───────────────────────────────────────────────────

describe('Killer Bow', () => {
  const bow = find(weapons.items, 'Killer Bow');

  test('tier, preço e disponibilidade', () => {
    assert.equal(bow.tier, 'S');
    assert.equal(bow.price, 6600);
    assert.equal(bow.availability, 44);
  });

  test('dano d12 + dex + 6', () => {
    assert.equal(bow.damage?.die, 12);
    assert.deepEqual(bow.damage?.abilities, ['dex']);
    assert.equal(bow.damage?.bonus, 6);
  });

  test('alcance extra e efeito ref perseguidora', () => {
    assert.equal(bow.extra.alcanceExtra, '+6m');
    assert.equal(bow.effects.length, 1);
    const [effect] = bow.effects;
    assert.equal(effect.type, 'ref');
    assert.equal(
      effect.type === 'ref' && effect.forumKey,
      'efeitosRanged.perseguidora'
    );
  });

  test('arcos ocupam ambos os slots', () => {
    assert.equal(bow.twoHanded, true);
    const bowCategory = weapons.categories.find((c) => c.name === 'Arcos');
    assert.deepEqual(bowCategory?.properties, [
      'Distância: 45m a 182m',
      'Acuidade',
    ]);
  });
});

// ─── Campos ────────────────────────────────────────────────────────────────

describe('preço', () => {
  test('"6,600" "13.500" "150 Gil" "1100"', () => {
    assert.equal(parsePrice('6,600'), 6600);
    assert.equal(parsePrice('13.500'), 13500);
    assert.equal(parsePrice('150 Gil'), 150);
    assert.equal(parsePrice('1100'), 1100);
    assert.equal(parsePrice('---'), null);
  });

  test('nas lojas', () => {
    assert.equal(find(weapons.items, 'Phantom Scythe').price, 13500);
    assert.equal(find(weapons.items, 'Thorn Bow').price, 1100);
    assert.equal(find(weapons.items, 'Bacamarte').price, 400);
    assert.equal(find(misc.items, 'Kit de Aventureiro').price, 50);
  });
});

describe('tier', () => {
  test('letras ficam, números viram letra (menor = pior)', () => {
    assert.deepEqual(parseTier('S'), { tier: 'S', tierRaw: null });
    const letters = [1, 2, 3, 4, 5, 6, 7, 8].map(
      (n) => parseTier(String(n))?.tier
    );
    assert.deepEqual(letters, ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'S']);
    assert.equal(parseTier('9'), null);
  });

  test('o número original fica em tierRaw', () => {
    const ether = find(goods.items, 'Ether');
    assert.equal(ether.tier, 'D');
    assert.equal(ether.tierRaw, 3);
    const superBall = find(goods.items, 'Super Ball');
    assert.equal(superBall.tier, 'S');
    assert.equal(superBall.tierRaw, 8);
  });
});

describe('dano', () => {
  test('"*" é o maior dos atributos da descrição da categoria', () => {
    const dirk = find(weapons.items, 'Dirk');
    assert.equal(dirk.damage?.abilityMode, 'highest');
    assert.deepEqual(dirk.damage?.abilities, ['str', 'dex']);
    const staff = find(weapons.items, 'Battle Staff');
    assert.deepEqual(staff.damage?.abilities, ['str', 'wis']);
    assert.equal(staff.damage?.bonus, 1);
  });

  test('descrição de Facas', () => {
    assert.deepEqual(
      starAbilitiesOf(
        'usa-se o valor de FOR ou DEX, aquele que for mais alto.'
      ),
      ['str', 'dex']
    );
  });

  test('dano fixo "12 + 3"', () => {
    const d = parseDamage('12 + 3');
    assert.equal(d?.fixed, 12);
    assert.equal(d?.die, null);
    assert.equal(d?.bonus, 3);
    assert.equal(find(weapons.items, 'Hellfire').damage?.bonus, 3);
  });

  test('dano com tipo e crítico', () => {
    const d = parseDamage('d8 perfurante (crítico x4)');
    assert.equal(d?.count, 1);
    assert.equal(d?.die, 8);
    assert.equal(d?.type, 'perfurante');
    assert.equal(d?.critMultiplier, 4);
    const flame = find(weapons.items, 'Lança-Chamas');
    assert.equal(flame.damage?.critMultiplier, 4);
    assert.equal(
      find(weapons.items, 'Mosquete Híbrido').damage?.type,
      'perfurante/contundente'
    );
  });

  test('lixo não lança: devolve null', () => {
    assert.equal(parseDamage('???'), null);
    assert.equal(parseDamage('--'), null);
  });
});

describe('CA', () => {
  test('"+2" escudo', () => {
    assert.deepEqual(
      { ...parseArmorClass('+2'), raw: '' },
      { base: null, addDex: false, dexCap: null, bonus: 2, raw: '' }
    );
    assert.equal(find(armors.items, 'Buckler').armorClass?.bonus, 2);
  });

  test('"16+N"', () => {
    const ac = find(armors.items, 'Plate Mail').armorClass;
    assert.equal(ac?.base, 16);
    assert.equal(ac?.bonus, 2);
    assert.equal(ac?.addDex, false);
  });

  test('"12 + Dex (max 2) + N"', () => {
    const ac = find(armors.items, 'Chain Vest').armorClass;
    assert.equal(ac?.base, 12);
    assert.equal(ac?.addDex, true);
    assert.equal(ac?.dexCap, 2);
    assert.equal(ac?.bonus, 2);
  });

  test('"10 + Dex + N"', () => {
    const ac = find(armors.items, 'Silk Robe').armorClass;
    assert.equal(ac?.base, 10);
    assert.equal(ac?.addDex, true);
    assert.equal(ac?.dexCap, null);
    assert.equal(ac?.bonus, 3);
  });

  test('"14 + Dex (max 2) +5"', () => {
    const ac = find(armors.items, 'Brigadine').armorClass;
    assert.equal(ac?.base, 14);
    assert.equal(ac?.dexCap, 2);
    assert.equal(ac?.bonus, 5);
  });

  test('"16" sem bônus', () => {
    assert.equal(parseArmorClass('16')?.bonus, 0);
    assert.equal(parseArmorClass('abc'), null);
  });
});

// ─── Efeitos ───────────────────────────────────────────────────────────────

describe('efeitos de consumíveis', () => {
  const fx = (text: string) => parseEffectText(text);

  test('"<Elemento> Ataque"', () => {
    assert.deepEqual(fx('Fogo Ataque'), [
      { type: 'element', element: 'fogo', mode: 'attack' },
    ]);
    assert.deepEqual(fx('Água Ataque')[0], {
      type: 'element',
      element: 'agua',
      mode: 'attack',
    });
  });

  test('bônus: "+2 de Dano", "+2 Acerto", "Ignora 2 DEF"', () => {
    assert.deepEqual(fx('+2 de Dano'), [
      { type: 'modifier', target: 'damage', value: 2 },
    ]);
    assert.deepEqual(fx('+2 Acerto'), [
      { type: 'modifier', target: 'attack', value: 2 },
    ]);
    assert.deepEqual(fx('Ignora 2 DEF'), [
      { type: 'modifier', target: 'ignoreDef', value: 2 },
    ]);
  });

  test('condição e "X Toque"', () => {
    assert.deepEqual(fx('Poison'), [
      { type: 'condition', condition: 'poison', mode: 'apply' },
    ]);
    assert.deepEqual(fx('Zombie Toque'), [
      { type: 'condition', condition: 'zombie', mode: 'apply', touch: true },
    ]);
    assert.deepEqual(fx('Terra Toque'), [
      { type: 'element', element: 'terra', mode: 'touch' },
    ]);
  });

  test('"Cancela a Condição de Status X"', () => {
    assert.deepEqual(fx('Cancela a Condição de Status Poison'), [
      { type: 'condition', condition: 'poison', mode: 'cure' },
    ]);
    assert.deepEqual(fx('Cancela as Condições de Status Slow e Stop.'), [
      { type: 'condition', condition: 'slow', mode: 'cure' },
      { type: 'condition', condition: 'stop', mode: 'cure' },
    ]);
  });

  test('"Restaura NdM HP / slot"', () => {
    assert.deepEqual(fx('Restaura 2d3HP'), [
      { type: 'heal', amount: '2d3', resource: 'hp' },
    ]);
    assert.deepEqual(fx('Restaura 1 slot nivel 1'), [
      { type: 'heal', amount: '1', resource: 'spellSlot', slotLevel: 1 },
    ]);
    const ether = fx('Restaura 1 slot nivel 2 ou 2 nivel 1');
    assert.equal(ether.length, 2);
    assert.equal(ether[1].type === 'heal' && ether[1].alternative, true);
  });

  test('o que não casa vira custom', () => {
    assert.deepEqual(fx('Veja notas abaixo'), [
      { type: 'custom', text: 'Veja notas abaixo' },
    ]);
    const shotgun = fx('-25% Dano e Alvo: cone 3m');
    assert.deepEqual(shotgun[0], {
      type: 'modifier',
      target: 'damage',
      value: -25,
      unit: 'percent',
    });
    assert.deepEqual(shotgun[1], { type: 'custom', text: 'Alvo: cone 3m' });
  });

  test('itens reais e notas de asterisco', () => {
    const venom = find(goods.items, 'Venom Darts');
    assert.equal(venom.effects[0].type, 'condition');
    assert.match(venom.notes[0], /Venom causa 2d6/);
    const fast = find(goods.items, 'Fast Ammo');
    assert.match(fast.notes[0], /Iniciativa/);
    assert.ok(
      goods.warnings.some(
        (w) => w.type === 'asterisk-note' && w.item === 'Sleep Arrow'
      )
    );
  });
});

describe('tabela de armas de fogo', () => {
  test('categoria sem título e colunas extras', () => {
    const category = weapons.categories.find(
      (c) => c.name === 'Armas de fogo antigas e modernas'
    );
    assert.ok(category);
    assert.equal(category.itemCount, 11);
    const musket = find(weapons.items, 'Mosquete');
    assert.equal(musket.category, 'Armas de fogo antigas e modernas');
    assert.equal(musket.extra.categoria, 'Rifle (Antigo)');
    assert.equal(musket.extra.alcance, '18m');
    assert.equal(musket.extra.tiros, '1');
    assert.equal(musket.price, 750);
    assert.equal(musket.tier, null);
    assert.ok(weapons.warnings.some((w) => w.type === 'untitled-category'));
  });
});

// ─── Slugs e ligação com t280 ──────────────────────────────────────────────

describe('slugs', () => {
  test('colisão entre categorias leva a categoria no fim', () => {
    const rifle = find(weapons.items, 'Valiant', 'Rifles');
    const pistol = find(weapons.items, 'Valiant', 'Pistolas');
    assert.equal(rifle.slug, 'valiant-rifle');
    assert.equal(pistol.slug, 'valiant-pistola');
    assert.ok(weapons.warnings.some((w) => w.type === 'slug-collision'));
  });

  test('duplicado na mesma categoria: aviso e sufixo -2', () => {
    const protections = misc.items.filter(
      (i) => i.name === 'Roupas de Proteção'
    );
    assert.equal(protections.length, 2);
    assert.equal(protections[0].slug, 'roupas-de-protecao');
    assert.equal(protections[1].slug, 'roupas-de-protecao-2');
    assert.ok(
      misc.warnings.some(
        (w) => w.type === 'duplicate-name' && w.item === 'Roupas de Proteção'
      )
    );
  });

  test('slugs únicos entre todas as lojas', () => {
    const all = [
      ...weapons.items,
      ...armors.items,
      ...goods.items,
      ...misc.items,
      ...books.items,
    ];
    assignUniqueSlugs(all);
    assert.equal(new Set(all.map((i) => i.slug)).size, all.length);
  });
});

describe('ligação com o t280', () => {
  const all = [...weapons.items, ...armors.items];
  const warnings = resolveEffectRefs(all, effects.effects);

  test('toda ref de armas e armaduras tem efeito no t280', () => {
    assert.deepEqual(
      warnings.filter((w) => w.type === 'unresolved-effect'),
      []
    );
  });

  test('alias jatoDagua ↔ "Jaete d’Água"', () => {
    const rod = find(weapons.items, 'Water Rod');
    const [ref] = rod.effects;
    assert.equal(ref.type === 'ref' && ref.forumKey, 'efeitosRanged.jatoDagua');
    assert.equal(
      ref.type === 'ref' && ref.effectId,
      'efeitosRanged.jaeteDAgua'
    );
    assert.ok(warnings.some((w) => w.type === 'effect-alias'));
  });

  test('o grupo da chave decide o escopo, não o tipo da arma', () => {
    const marduk = find(weapons.items, 'Marduk');
    const ref = marduk.effects[0];
    assert.equal(ref.type === 'ref' && ref.scope, 'efeitosRanged');
    const shield = find(armors.items, 'Mythril Shield').effects[0];
    assert.equal(shield.type === 'ref' && shield.scope, 'efeitosEscudos');
    const armor = find(armors.items, 'Mythril Armor').effects[0];
    assert.equal(armor.type === 'ref' && armor.scope, 'efeitosEscudos');
    const kheten = find(weapons.items, 'Celestial Greaves').effects[0];
    assert.equal(kheten.type === 'ref' && kheten.scope, 'efeitosMelee');
  });

  test('mecânicas seguras do t280', () => {
    const flaming = effects.effects.find(
      (e) => e.scope === 'efeitosRanged' && e.name === 'Flamejante'
    );
    assert.deepEqual(flaming?.mechanics, [
      { type: 'damage', dice: '1d6', element: 'fogo' },
    ]);
    const blast = effects.effects.find(
      (e) => e.scope === 'efeitosRanged' && e.name === 'Explosão Flamejante'
    );
    assert.deepEqual(blast?.mechanics[1], {
      type: 'damage',
      dice: '1d10',
      element: 'fogo',
      when: 'crit',
    });
    const dominant = effects.effects.find((e) => e.name === 'Dominadora');
    assert.deepEqual(dominant?.mechanics, []);
  });

  test('"Sagrada" repetida na mesma seção é avisada', () => {
    assert.ok(
      effects.warnings.some(
        (w) => w.type === 'duplicate-effect' && w.item === 'Sagrada'
      )
    );
  });
});

describe('irregularidades das lojas', () => {
  const types = (r: { warnings: { type: string; item?: string }[] }) =>
    r.warnings.map((w) => `${w.type}:${w.item ?? ''}`);

  test('Bone Axe 2d12, Hellfire e Bastões', () => {
    const w = types(weapons);
    assert.ok(w.includes('die-anomaly:Bone Axe'));
    assert.ok(w.includes('price-anomaly:Hellfire'));
    assert.ok(weapons.warnings.some((x) => x.type === 'hands-conflict'));
  });

  test('Rapieras e Caneleiras sem +N; Caneleiras ignoradas', () => {
    const missing = weapons.warnings
      .filter((w) => w.type === 'missing-bonus')
      .map((w) => w.category);
    assert.deepEqual(missing.sort(), ['Caneleiras', 'Rapieras']);
    const greaves = weapons.categories.find((c) => c.name === 'Caneleiras');
    assert.equal(greaves?.ignored, true);
  });

  test('instrumentos "[x]"', () => {
    assert.ok(weapons.warnings.some((w) => w.type === 'placeholder-name'));
  });
});

describe('livraria', () => {
  test('6 grimórios com preço e magias', () => {
    assert.equal(books.items.length, 6);
    for (const book of books.items) {
      assert.equal(book.price, 500);
      assert.ok((book.contents?.length ?? 0) >= 10, book.name);
    }
  });

  test('custo de mana cru e círculo nulo', () => {
    const [first] = books.items;
    const rope = first.contents?.[0];
    assert.equal(rope?.name, 'Corda Mágica');
    assert.equal(rope?.manaCost, 5);
    assert.equal(rope?.circle, null);
  });

  test('formatos sem <table> são lidos e avisados', () => {
    const spirit = find(books.items, 'Grimório do Espiritualista Iniciante');
    assert.equal(spirit.contents?.[0].name, 'Oráculo de Almas');
    assert.equal(spirit.contents?.[0].manaCost, 8);
    const summoner = find(books.items, 'Grimório do Invocador Iniciante');
    assert.equal(summoner.contents?.[0].extra?.dano, '2d6 de dano espectral');
    assert.equal(
      books.warnings.filter((w) => w.type === 'grimoire-format').length,
      2
    );
  });
});

// ─── Resultado final ─────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Resultado: ${passed} passou, ${failed} falhou`);
if (failed > 0) {
  process.exit(1);
}
