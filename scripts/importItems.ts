import fs from 'node:fs';
import path from 'node:path';
import { fetchTopicHtml, parseTopicUrl } from '../services/forumSheet.service';
import {
  assignUniqueSlugs,
  decode,
  excerpt,
  parseEffectsTopic,
  parseShopTopic,
  resolveEffectRefs,
  slugify,
  type IEffectsTopicResult,
  type IForumEffect,
  type IItemArmorClass,
  type IItemCategory,
  type IItemDamage,
  type IItemWarning,
  type IParsedItem,
  type ItemEffect,
} from '../services/itemTopic.service';

/**
 * FASE 0 dos itens: lê as lojas do Mercado e o tópico de efeitos e escreve um
 * preview em Markdown. NADA é gravado e não há acesso ao banco.
 *
 *   npx tsx ./scripts/importItems.ts
 *   npx tsx ./scripts/importItems.ts --preview itens-preview.md
 *   npx tsx ./scripts/importItems.ts --fixtures --preview itens-preview.md
 *
 * `--fixtures` lê as páginas salvas em __tests__/fixtures/items em vez de ir
 * ao fórum. Não existe `--apply` nesta fase.
 */

const FORUM_ORIGIN = 'https://isekaifantasy.forumbrasil.net';
const FIXTURES = path.join(__dirname, '..', '__tests__', 'fixtures', 'items');

const SHOPS = [
  { id: 't17', slug: 't17-loja-de-armas', title: 'Loja de Armas' },
  { id: 't18', slug: 't18-loja-de-armaduras', title: 'Armaduras' },
  { id: 't20', slug: 't20-loja-de-itens', title: 'Itens' },
  { id: 't24', slug: 't24-lojas-diversas', title: 'Lojas Diversas' },
  { id: 't53', slug: 't53-livraria', title: 'Livraria' },
] as const;
const EFFECTS_SLUG = 't280-refinamento-e-efeitos-de-equipamentos';

async function load(slug: string, offline: boolean): Promise<string> {
  if (offline)
    return fs.readFileSync(path.join(FIXTURES, `${slug}.html`), 'utf8');
  return fetchTopicHtml(parseTopicUrl(`${FORUM_ORIGIN}/${slug}`));
}

// ─── Item de evento (origem: app) ──────────────────────────────────────────

/**
 * "Dado Oogie Boogie", do ItemDB do app. A imagem é um link do Discord que
 * expira: o item entra marcado para reenvio e a imagem NÃO é baixada aqui.
 */
function eventItems(): { items: IParsedItem[]; warnings: IItemWarning[] } {
  const name = 'Dado Oogie Boogie';
  const description = decode(
    'Um dado verde de 12 lados que é lançado em meio ao campo, seu resultado é um completo mistério até que seu número seja revelado.\n\nEfeito: Uma vez por dia, o jogador pode rolar o Dado do Oogie Boogie. O efeito será um dos mesmos que ocorreu durante o evento, mas todos voltados ao jogador que o utilizou, podendo ser uma sorte grande ou um azar infortuno'
  );
  const item: IParsedItem = {
    name,
    baseSlug: slugify(name),
    slug: slugify(name),
    kind: 'event',
    category: 'Itens de evento',
    categorySlug: 'itens-de-evento',
    topic: 'app',
    source: 'app',
    tier: null,
    tierRaw: null,
    price: null,
    availability: null,
    damage: null,
    armorClass: null,
    target: null,
    twoHanded: false,
    description,
    contentsText: null,
    contents: null,
    extra: {},
    effectText: null,
    effects: [],
    notes: [],
    imageUrl:
      'https://media.discordapp.net/attachments/809553569464320030/1441550953689124874/ChatGPT_Image_21_de_nov._de_2025_19_07_55.png',
    flags: ['needs-image-reupload'],
  };
  return {
    items: [item],
    warnings: [
      {
        type: 'app-item',
        topic: 'app',
        item: name,
        message: `${name}: a imagem é um link do Discord que expira; reenviar para o storage do app (não foi baixada).`,
      },
    ],
  };
}

// ─── Formatação do preview ─────────────────────────────────────────────────

const cell = (text: string | null | undefined): string =>
  (text ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim() || '—';

function fmtDamage(d: IItemDamage | null): string {
  if (!d) return '—';
  const base = d.die ? `${d.count}d${d.die}` : String(d.fixed ?? '');
  const abilities = d.abilities.length
    ? ` + ${d.abilities.join(d.abilityMode === 'highest' ? '|' : '+')}${d.abilityMode === 'highest' ? ' (maior)' : ''}`
    : d.abilityMode
      ? ' + *'
      : '';
  const bonus = d.bonus ? ` + ${d.bonus}` : '';
  const type = d.type ? ` ${d.type}` : '';
  const crit = d.critMultiplier ? ` (crít. x${d.critMultiplier})` : '';
  return `${base}${abilities}${bonus}${type}${crit}`;
}

function fmtArmorClass(ac: IItemArmorClass | null): string {
  if (!ac) return '—';
  if (ac.base === null) return `+${ac.bonus}`;
  const dex = ac.addDex
    ? ` + Dex${ac.dexCap ? ` (máx ${ac.dexCap})` : ''}`
    : '';
  return `${ac.base}${dex}${ac.bonus ? ` + ${ac.bonus}` : ''}`;
}

function fmtEffect(
  effect: ItemEffect,
  byId: Map<string, IForumEffect>
): string {
  switch (effect.type) {
    case 'ref': {
      const found = effect.effectId ? byId.get(effect.effectId) : undefined;
      return found
        ? `**${effect.name}** \`${effect.forumKey}\` → ${excerpt(found.description, 80)}`
        : `**${effect.name}** \`${effect.forumKey}\` ⚠ sem correspondência no t280`;
    }
    case 'damage':
      return `dano ${effect.dice}${effect.element ? ` ${effect.element}` : ''}${effect.when ? ` (${effect.when})` : ''}`;
    case 'condition':
      return `${effect.mode === 'cure' ? 'cura' : 'aplica'} ${effect.condition}${effect.touch ? ' (toque)' : ''}`;
    case 'heal':
      return `${effect.alternative ? 'ou ' : ''}restaura ${effect.amount}${effect.resource === 'hp' ? ' HP' : ` slot nv ${effect.slotLevel}`}`;
    case 'modifier':
      return `${effect.value > 0 ? '+' : ''}${effect.value}${effect.unit === 'percent' ? '%' : ''} ${effect.target}`;
    case 'element':
      return `${effect.element} (${effect.mode === 'attack' ? 'ataque' : 'toque'})`;
    case 'custom':
      return `texto: "${effect.text}"`;
  }
}

const fmtTier = (item: IParsedItem): string =>
  item.tier
    ? item.tierRaw !== null
      ? `${item.tier} (${item.tierRaw})`
      : item.tier
    : '—';

function fmtExtra(item: IParsedItem): string {
  const pairs = Object.entries(item.extra).map(([k, v]) => `${k}: ${v}`);
  return pairs.join('; ');
}

function itemTable(
  items: IParsedItem[],
  byId: Map<string, IForumEffect>
): string[] {
  const header = [
    'Nome',
    'Slug',
    'Tipo',
    'Tier (raw)',
    'Preço',
    'Disp.',
    'Dano',
    'CA',
    'Alvo',
    'Duas mãos',
    'Extra',
    'Efeitos',
    'Texto do efeito',
    'Descrição / conteúdo',
  ];
  const rows = items.map((item) => {
    const effects = item.effects.map((e) => fmtEffect(e, byId)).join('; ');
    const notes = item.notes.length ? ` ⟶ nota: ${item.notes.join(' / ')}` : '';
    const body = item.contents
      ? `${item.contents.length} magias`
      : [item.description, item.contentsText].filter(Boolean).join(' — ');
    return [
      item.name,
      `\`${item.slug}\``,
      item.kind,
      fmtTier(item),
      item.price === null ? '—' : String(item.price),
      item.availability === null ? '—' : `${item.availability}%`,
      fmtDamage(item.damage),
      fmtArmorClass(item.armorClass),
      item.target ?? '—',
      item.twoHanded ? 'sim' : 'não',
      fmtExtra(item),
      effects + notes,
      item.effectText ? excerpt(item.effectText, 70) : '',
      body,
    ].map(cell);
  });
  return [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ];
}

function grimoireSections(items: IParsedItem[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (!item.contents) continue;
    out.push(
      `#### ${item.name} — ${item.price ?? '?'} Gil (${item.contents.length} magias)`,
      '',
      '| Magia | Custo de mana | Círculo | Extra | Descrição |',
      '| --- | --- | --- | --- | --- |',
      ...item.contents.map(
        (s) =>
          `| ${cell(s.name)} | ${s.manaCost ?? '—'} | ${s.circle ?? 'null (manual)'} | ${cell(
            Object.entries(s.extra ?? {})
              .map(([k, v]) => `${k}: ${v}`)
              .join('; ')
          )} | ${cell(excerpt(s.description, 90))} |`
      ),
      ''
    );
  }
  return out;
}

interface IShopResult {
  id: string;
  title: string;
  categories: IItemCategory[];
  items: IParsedItem[];
}

function renderPreview(args: {
  shops: IShopResult[];
  events: IParsedItem[];
  effects: IEffectsTopicResult;
  warnings: IItemWarning[];
}): string {
  const { shops, events, effects, warnings } = args;
  const byId = new Map<string, IForumEffect>();
  for (const e of effects.effects) if (!byId.has(e.id)) byId.set(e.id, e);

  const out: string[] = [
    '# Itens — preview da Fase 0',
    '',
    '> Gerado por `scripts/importItems.ts`. **Nada foi gravado no banco.**',
    '',
    '## Resumo',
    '',
    '| Fonte | Categorias | Itens |',
    '| --- | --- | --- |',
    ...shops.map(
      (s) =>
        `| ${s.title} (${s.id}) | ${s.categories.length} | ${s.items.length} |`
    ),
    `| Efeitos (t280) | 5 seções | ${effects.effects.length} entradas, ${new Set(effects.effects.map((e) => e.key)).size} nomes únicos |`,
    `| Itens do app | — | ${events.length} |`,
    `| **Avisos** | | ${warnings.length} |`,
    '',
  ];

  for (const shop of shops) {
    out.push(`## ${shop.title} (${shop.id})`, '');
    for (const category of shop.categories) {
      const items = shop.items.filter(
        (i) => i.categorySlug === category.slug && i.category === category.name
      );
      out.push(
        `### ${category.name} — ${items.length} itens${category.ignored ? ' — IGNORADA por ora' : ''}`,
        ''
      );
      if (category.banner) out.push(`Banner: ${category.banner}`, '');
      if (category.description) {
        out.push(`> ${excerpt(category.description, 400)}`, '');
      }
      const facts = [
        `tipo: ${category.kind}`,
        `duas mãos (ocupa ambos os slots): ${category.twoHanded ? 'sim' : 'não'}`,
      ];
      if (category.properties.length) {
        facts.push(`propriedades: ${category.properties.join('; ')}`);
      }
      out.push(facts.join(' · '), '');
      if (category.notes.length) {
        out.push(
          ...category.notes.map((n) => `- nota: ${excerpt(n, 200)}`),
          ''
        );
      }
      out.push(...itemTable(items, byId), '');
      out.push(...grimoireSections(items));
    }
  }

  out.push('## Itens do app (candidatos)', '');
  for (const item of events) {
    out.push(
      `### ${item.name}`,
      '',
      `- origem: \`${item.source}\` · tipo: ${item.kind} · slug: \`${item.slug}\``,
      `- imagem: ${item.imageUrl} — ⚠ link do Discord, expira: marcado \`needs-image-reupload\` (não baixada)`,
      `- descrição: ${item.description?.replace(/\n+/g, ' ')}`,
      ''
    );
  }

  out.push(
    '## Propriedades (glossário do t280)',
    '',
    ...effects.properties.map(
      (p) => `- **${p.name}** — ${excerpt(p.description, 160)}`
    ),
    '',
    `Refinamento: máximo +${effects.refine.maxLevel ?? '?'}, +${effects.refine.bonusPerLevel ?? '?'} por nível, armas à distância +${effects.refine.rangedRangePerLevelM ?? '?'}m de alcance por nível.`,
    '',
    `## Efeitos (${effects.effects.length})`,
    '',
    '| Escopo | Seção | Nome | Chave | Mecânica estruturada | Observação | Texto |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...effects.effects.map((e) => {
      const flags = [
        e.duplicateInSection ? 'duplicado na seção' : '',
        e.subEntryOf ? `sub-item de ${e.subEntryOf}` : '',
      ]
        .filter(Boolean)
        .join('; ');
      return `| ${e.scope} | ${cell(e.section)} | ${cell(e.name)} | \`${e.key}\` | ${cell(
        e.mechanics.map((m) => fmtEffect(m, byId)).join('; ')
      )} | ${cell(flags)} | ${cell(excerpt(e.description, 140))} |`;
    }),
    ''
  );

  const byType = new Map<string, IItemWarning[]>();
  for (const w of warnings)
    byType.set(w.type, [...(byType.get(w.type) ?? []), w]);
  out.push(`## Avisos (${warnings.length})`, '');
  out.push('| Tipo | Quantidade |', '| --- | --- |');
  for (const [type, list] of byType) out.push(`| ${type} | ${list.length} |`);
  out.push('');
  for (const [type, list] of byType) {
    out.push(`### ${type} (${list.length})`, '');
    out.push(
      ...list.map((w) => `- ${w.topic ? `[${w.topic}] ` : ''}${w.message}`),
      ''
    );
  }

  return out.join('\n');
}

// ─── Execução ──────────────────────────────────────────────────────────────

async function main() {
  const offline = process.argv.includes('--fixtures');
  const previewIndex = process.argv.indexOf('--preview');
  const previewFile =
    previewIndex !== -1 ? process.argv[previewIndex + 1] : undefined;
  if (previewIndex !== -1 && !previewFile) {
    throw new Error('--preview precisa do caminho do arquivo .md.');
  }
  if (process.argv.includes('--apply')) {
    throw new Error('Esta fase não grava nada: --apply chega na fase 1.');
  }

  const shops: IShopResult[] = [];
  const warnings: IItemWarning[] = [];

  for (const shop of SHOPS) {
    const html = await load(shop.slug, offline);
    const result = parseShopTopic(html, `${FORUM_ORIGIN}/${shop.slug}`);
    shops.push({ ...shop, categories: result.categories, items: result.items });
    // Colisões de slug são recalculadas sobre todas as lojas juntas, abaixo.
    warnings.push(
      ...result.warnings.filter(
        (w) => w.type !== 'duplicate-name' && w.type !== 'slug-collision'
      )
    );
  }

  const effects = parseEffectsTopic(
    await load(EFFECTS_SLUG, offline),
    `${FORUM_ORIGIN}/${EFFECTS_SLUG}`
  );
  warnings.push(...effects.warnings);

  const events = eventItems();
  warnings.push(...events.warnings);

  const everything = [...shops.flatMap((s) => s.items), ...events.items];
  warnings.push(...assignUniqueSlugs(everything));
  warnings.push(...resolveEffectRefs(everything, effects.effects));

  // Contagens
  for (const shop of shops) {
    console.log(`${shop.title} (${shop.id}): ${shop.items.length} itens`);
    for (const c of shop.categories) {
      console.log(
        `  ${c.name}: ${c.itemCount}${c.ignored ? ' (ignorada)' : ''}`
      );
    }
  }
  console.log(
    `Efeitos t280: ${effects.effects.length} entradas, ${new Set(effects.effects.map((e) => e.key)).size} chaves únicas, ${effects.properties.length} propriedades`
  );
  const byType = new Map<string, number>();
  for (const w of warnings) byType.set(w.type, (byType.get(w.type) ?? 0) + 1);
  console.log(`\nAvisos: ${warnings.length}`);
  for (const [type, n] of byType) console.log(`  ${type}: ${n}`);

  if (previewFile) {
    const target = path.resolve(previewFile);
    fs.writeFileSync(
      target,
      renderPreview({ shops, events: events.items, effects, warnings })
    );
    console.log(`\nPreview escrito em ${target}`);
  }
  console.log('\nNada gravado. (Fase 0: sem banco.)');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
