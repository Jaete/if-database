import type {
  IArchetype,
  IClassCandidate,
  IClassCatalog,
  IContentBlock,
  IFeatureTable,
  IClassFeature,
  IClassLevel,
  ICharacterClass,
  ITalent,
} from '../db/classes/class';
import { classSlug, parseGrants, parseSlotCell } from '../db/l10n/classes';
import { foldKeepingLength } from './spellTopic.service';

/**
 * Lê um tópico de classe do fórum (ex.: "Druida") e devolve a classe inteira.
 *
 * Por que um parser próprio, e não o de magias: um tópico de classe tem cinco
 * estruturas diferentes num documento só — cabeçalho de rótulos, uma tabela de
 * progressão, descrições por nível, arquétipos e talentos — espalhadas por
 * vários posts. O que ele compartilha com o de magias é a ideia de converter o
 * HTML em linhas marcando o que veio de <strong>.
 *
 * Calibrado contra os 20 tópicos de /f25-classes-e-escolas-magicas, não contra
 * um só: foi medindo todos que ficou claro que as colunas da tabela variam de
 * 3 a 6 e mudam de posição entre as classes.
 */

// Marcação de abertura E fechamento do negrito. O parser de magias marca só a
// abertura, mas aqui é preciso saber se a linha é INTEIRAMENTE negrito: é o
// que separa "<strong>Terreno Vantajoso:</strong>" (nome de talento) de
// "<strong>1ª rodada:</strong> Aliados que..." (prosa dentro de um talento).
// Exportados porque o leitor de talentos (services/talentTopic.service.ts)
// consome o mesmo fluxo de linhas: o tópico de talentos usa exatamente a mesma
// diagramação de negrito e spoiler, e reimplementar a marcação lá daria duas
// gramáticas para o mesmo HTML.
export const BOLD_OPEN = '\u0000B';
export const BOLD_CLOSE = '\u0000C';
export const SPOILER_OPEN = '\u0000S';
export const SPOILER_CLOSE = '\u0000s';
/**
 * Fronteira entre mensagens do tópico.
 *
 * O fluxo de linhas junta todos os posts, porque nenhuma seção respeita a
 * divisão entre eles. Mas uma coisa respeita: um arquétipo e as habilidades
 * dele estão SEMPRE na mesma mensagem. O que aparece na seguinte é outra
 * coisa — talento, quase sempre.
 */
export const POST_MARK = '\u0000P';

/** Rótulos da tabela de progressão → campo de `IClassLevel`. */
const COLUMN_ALIASES: { match: (label: string) => boolean; key: string }[] = [
  { match: (l) => l === 'nivel', key: 'level' },
  {
    match: (l) => l === 'bonus de proficiencia' || l === 'proficiencia',
    key: 'proficiencyBonus',
  },
  { match: (l) => l.startsWith('truques'), key: 'cantripsKnown' },
  { match: (l) => l.startsWith('slots de magia'), key: 'spellSlots' },
  // "Habilidades", "Habilidade do Mago", "Habilidade Ganha", "Habilidade do
  // Bardo"... O tópico do druida rotula a coluna como "Habilidade do Mago",
  // resto de copiar-colar entre tópicos — por isso o casamento é por família
  // de rótulo, nunca por igualdade e nunca por posição.
  { match: (l) => l.startsWith('habilidade'), key: 'features' },
  { match: (l) => l === 'aumento de atributo', key: 'abilityScoreIncrease' },
];

/** Rótulos do cabeçalho da classe → campo de `ICharacterClass`. */
const HEADER_ALIASES: { match: (label: string) => boolean; key: string }[] = [
  { match: (l) => l.startsWith('dado de vida'), key: 'hitDie' },
  {
    // Um tópico escreve "1°" com sinal de grau em vez do ordinal "1º", e a
    // dobra de acentos não resolve isso.
    match: (l) => /^pontos? de vida no 1[º°o]/.test(l),
    key: 'hpAtFirstLevel',
  },
  {
    match: (l) => /^pontos? de vida (nos|por)/.test(l),
    key: 'hpPerLevel',
  },
  { match: (l) => l.startsWith('armadura'), key: 'proficiencies.armor' },
  { match: (l) => l.startsWith('arma'), key: 'proficiencies.weapons' },
  { match: (l) => l.startsWith('ferramenta'), key: 'proficiencies.tools' },
  {
    match: (l) => l.startsWith('teste') && l.includes('resistencia'),
    key: 'proficiencies.savingThrows',
  },
  { match: (l) => l.startsWith('pericia'), key: 'proficiencies.skills' },
];

/** Negrito que é cabeçalho de seção, não campo nem item. */
const SECTION_MARKERS = [
  'caracteristicas de classe',
  'caracteristicas da classe',
  'caracteristicas do',
  'proficiencias',
  'proficiencia',
  'equipamento inicial',
  'equipamentos iniciais',
  'equipamento',
  'explicando a progressao',
  'progressao de nivel',
  'tabela de evolucao',
];

/**
 * Cabeçalhos de observação/nota autoral — capturam o OBS do Ladrão e similares
 * como `IContentBlock` de kind `obs` em vez de descartar.
 */
const OBS_MARKERS = ['obs', 'obs.', 'observacao', 'observacoes', 'nota'];

/**
 * Cabeçalhos que só valem por igualdade, nunca por prefixo.
 *
 * "Características" sozinha é o cabeçalho da seção em dois dos vinte e um
 * tópicos (monge e necromante) — os outros escrevem "Características de
 * Classe", que o casamento por prefixo acima já pega. Como aqui a palavra é
 * genérica demais, exigir o nome exato evita engolir uma característica
 * chamada "Características Raciais" no dia em que uma existir.
 *
 * Sem isto, o necromante escrevia "Características:" com dois-pontos — a
 * assinatura de talento — e o cabeçalho inteiro da classe (dado de vida,
 * proficiências, equipamento) virava a descrição de um talento chamado
 * "Características".
 */
const EXACT_SECTION_MARKERS = new Set(['caracteristicas', 'caracteristica']);

// 'Talentos' e 'Arquétipos' NÃO entram acima: o casamento ali é por prefixo, e
// "Talentos Druídicos" é o nome de uma característica do druida — ela sumia da
// ficha por ser confundida com o cabeçalho da seção de talentos.

/** Rótulos de prosa que aparecem em negrito dentro de uma descrição. */
const PROSE_LABELS = new Set([
  'descricao',
  'beneficio',
  'normal',
  'especial',
  'pre-requisito',
  'pre-requisitos',
  'prerequisito',
  'prerequisitos',
  'requisito',
]);

const isProseLabel = (folded: string) =>
  PROSE_LABELS.has(folded) || /^\d+[ªa°º]?\s*(rodada|round)/.test(folded);

/** Rótulo dentro de um item de lista, não um item. "Médio:" é tamanho; "Nível 4:" é faixa. */
const DETAIL_LABELS = new Set([
  'minusculo',
  'pequeno',
  'medio',
  'grande',
  'enorme',
  'colossal',
  'miudo',
  'diminuto',
  'gargantuesco',
]);

/** Cabeça de linha que continua o item aberto. Não inclui "Normal:"/"Especial:". */
const isInlineDetail = (folded: string) =>
  folded === 'pre-requisito' ||
  folded === 'pre-requisitos' ||
  folded === 'prerequisito' ||
  folded === 'prerequisitos' ||
  folded === 'requisito' ||
  DETAIL_LABELS.has(folded) ||
  /^nivel\s+\d+$/.test(folded);

const isDetailLabel = (folded: string) =>
  isProseLabel(folded) || isInlineDetail(folded);

/**
 * Cabeçalho de lista escrito sem negrito. O monge cola a lista do berserker
 * num post só com o título "Habilidades de Fúria (Berserker)". A dançarina
 * titula o post com um h3 "Talentos de Dança", sem negrito.
 */
const PLAIN_CHOICE_HEADINGS = new Set([
  'habilidades de furia (berserker)',
  'talentos de danca',
]);

function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };
  return text
    .replace(/&#(\d+);/g, (_m, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_m, code: string) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => named[name] ?? match);
}

const clean = (html: string) =>
  decodeEntities(html.replace(/<[^>]+>/g, ''))
    // BBCode que o fórum não converteu, visto dentro de células de tabela.
    .replace(/\[\/?[a-z]{1,10}\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * O que identifica o post do cabeçalho da classe.
 *
 * No template antigo o cabeçalho fica no mesmo post da tabela de progressão, e
 * bastava usar aquele. O template novo — o que condensa a classe num post só,
 * com `.text-block` — separa os dois: o cabeçalho fica no primeiro post e a
 * tabela no segundo. Procurar pelo rótulo resolve os dois casos sem o parser
 * precisar saber qual template está lendo.
 */
const HEADER_HINT = /dado de vida|pontos de vida no 1/;

/** Os corpos de mensagem do tópico, um por post. */
export function classPostBodies(html: string): string[] {
  const marks = [...html.matchAll(/class="content clearfix"/g)].map(
    (m) => m.index ?? 0
  );
  return marks.map((mark, i) => {
    // Começa DEPOIS do fecha-tag da div, senão o resto do atributo
    // ('class="content clearfix">') entra como primeira linha de texto e vaza
    // para a descrição da classe.
    const open = html.indexOf('>', mark);
    const start = open === -1 ? mark : open + 1;
    const end = i + 1 < marks.length ? marks[i + 1] : html.length;
    const body = html.slice(start, end);

    // O corte vai até a mensagem seguinte, e entre uma e outra está o cartão
    // do autor dela — avatar, patente e campos de perfil ("HP : 999#inf+1",
    // "Gil : 99999"). No template antigo isso passava despercebido porque o
    // cabeçalho era cortado na tabela de progressão; no template novo o post
    // do cabeçalho não tem tabela, e os campos do perfil entravam na lista de
    // equipamento inicial.
    const chrome = body.search(/<div[^>]*class="poster[-\w]*"/i);
    return chrome > 0 ? body.slice(0, chrome) : body;
  });
}

/** HTML → linhas, com o negrito marcado nas duas pontas. */
export function classTopicLines(html: string): string[] {
  const withBreaks = html
    // As fronteiras do spoiler são sinal, não ruído: no bloco de arquétipos é
    // o que separa o NOME do arquétipo (fora) das características que ele
    // concede (dentro).
    .replace(/<dl\b[^>]*\bspoiler\b[^>]*>/gi, `\n${SPOILER_OPEN}\n`)
    .replace(/<\/dl>/gi, `\n${SPOILER_CLOSE}\n`)
    .replace(/<dt[\s\S]*?<\/dt>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|dd|li|tr|td|h[1-6])>/gi, '\n');

  const marked = withBreaks.replace(
    /<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    (_m, _tag, inner: string) => BOLD_OPEN + clean(inner) + BOLD_CLOSE
  );

  return marked
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) =>
      decodeEntities(line)
        .replace(/\[\/?[a-z]{1,10}\]/gi, '')
        .replace(/[^\S\n]+/g, ' ')
        .trim()
    );
}

/** A linha é um nome em negrito, e não prosa que começa em negrito. */
const isWholeLineBold = (line: string) =>
  line.startsWith(BOLD_OPEN) && line.endsWith(BOLD_CLOSE);

const unmark = (line: string) =>
  // Os marcadores de spoiler também saem aqui. Eles são NUL + uma letra, e o
  // NUL é invisível: um marcador que escapasse aparecia na tela como um item
  // solto chamado "S" no fim do equipamento inicial.
  line
    .split(BOLD_OPEN)
    .join('')
    .split(BOLD_CLOSE)
    .join('')
    .split(SPOILER_OPEN)
    .join('')
    .split(SPOILER_CLOSE)
    .join('')
    .trim();

const singularOf = (text: string) =>
  foldKeepingLength(text).replace(/\s+/g, ' ').replace(/s\b/g, '').trim();

/**
 * Remove sufixos de versão do nome de uma característica antes de compará-lo.
 *
 * Tabelas escrevem "Sentido de Perigo (+2)*" e "Evasão nv 1", mas as
 * descrições usam só "Sentido de Perigo" e "Evasão". Sem esta normalização
 * o conjunto `announced` nunca casa com `described` e a cobertura cai abaixo
 * do limiar mesmo quando o conteúdo está integralmente descrito.
 *
 * Padrões removidos:
 *   - Parênteses no fim: "(+2)", "(1)", "(3)"
 *   - Indicador de nível: "nv 1", "nv. 2"
 */
export const stripVersion = (name: string) =>
  name
    // Só remove parênteses que contêm um número de versão: (+2), (3), (+4).
    // Parênteses descritivos como "(Padrão)" ou "(corpo a corpo)" são preservados.
    .replace(/\s*\(\s*\+?\d+\s*\)\s*$/, '')
    .replace(/\s+nv\.?\s*\d+\s*$/i, '')
    .trim();

const foldLabel = (text: string) =>
  foldKeepingLength(text).replace(/\s+/g, ' ').replace(/:$/, '').trim();

const isSectionMarker = (folded: string) =>
  EXACT_SECTION_MARKERS.has(folded) ||
  SECTION_MARKERS.some((m) => folded === m || folded.startsWith(m + ' '));

const ARCHETYPE_MARKERS = new Set(['arquetipos', 'arquetipo']);

/**
 * Cabeçalhos que introduzem uma seção de domínios/ordens/extensões de classe.
 *
 * "Domínios" do clérigo, por exemplo, é uma seção de lista de domínios divinos
 * — não são arquétipos (subclasses). Quando o parser encontra esse cabeçalho
 * dentro de uma seção de arquétipos, ele encerra o modo de arquétipos e abre
 * o modo de domínio, para que as entradas sejam coletadas como
 * `IContentBlock` de kind `'domainFeature'` em vez de falsas subclasses.
 */
const DOMAIN_MARKERS = new Set(['dominios', 'dominio']);

/** Cabeçalho da mensagem do fórum, não conteúdo da classe. */
const isPostChrome = (text: string) =>
  /\bpostado\b/i.test(text) || /^re:\s/i.test(text);

/**
 * Todo o texto do tópico num fluxo só de linhas, e o post que traz a tabela.
 *
 * Não há segmentação por seção aqui, de propósito. Tentei três versões disso —
 * por índice de post, pelo primeiro negrito do post, por marcador no fluxo — e
 * todas quebram, porque os cabeçalhos de seção não são confiáveis: o "Talentos"
 * do druida nem sequer é uma linha inteira em negrito (fica colado no título do
 * spoiler), e "Talentos Druídicos" é o nome de uma característica, não de uma
 * seção.
 *
 * O que é confiável é a FORMA de cada bloco: nome terminado em dois-pontos é
 * talento, bloco com "Nível N" acima é característica. A classificação passou a
 * ser feita por isso, em `parseClassTopic`.
 */
export function classStream(html: string): {
  overview?: string;
  header?: string;
  lines: string[];
  tables: IFeatureTable[];
} {
  let overview: string | undefined;
  let header: string | undefined;
  const lines: string[] = [];
  const tables: IFeatureTable[] = [];

  for (const raw of classPostBodies(html)) {
    // O anúncio do fórum é REMOVIDO, não motivo para descartar o post: o corte
    // entre mensagens arrasta o script da seguinte, e descartar por isso
    // eliminava posts de conteúdo inteiros.
    const post = raw.replace(/<script[\s\S]*?<\/script>/gi, ' ');

    // Antes da guarda de negrito: no template novo o cabeçalho é texto puro,
    // e um post inteiro sem <strong> seria descartado aqui.
    if (!header && HEADER_HINT.test(foldKeepingLength(clean(post)))) {
      header = post;
    }

    if (!/<(strong|b)\b/i.test(post)) continue;
    if (!overview && hasProgressionTable(post)) overview = post;
    // As tabelas saem do HTML antes da linearização e deixam um marcador no
    // lugar; a de progressão é a única lida à parte, pelo `overview`.
    lines.push(POST_MARK);
    lines.push(...classTopicLines(extractTables(post, tables)));
  }

  return { overview, header, lines, tables };
}

const TABLE = /<table[\s\S]*?<\/table>/gi;
const ROW = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const CELL = /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;

const TABLE_MARK = '\u0000T';

/**
 * Lê uma tabela em linhas de células.
 *
 * Recupera colunas que o fórum grudou: há tabelas cujo cabeçalho veio como uma
 * célula só com BBCode literal dentro ("Níveis de Druida[/th][th]Tipo de
 * Enxame"). Sem desfazer isso, as colunas saem coladas — e apenas remover o
 * BBCode, como `clean()` faz, perderia a divisão de vez.
 */
export function readTable(table: string): IFeatureTable | null {
  const rows = [...table.matchAll(ROW)]
    .map((row) =>
      [...row[1].matchAll(CELL)].flatMap((cell) =>
        cell[1]
          .split(/\[\/t[dh]\]\s*\[t[dh][^\]]*\]/i)
          .map((part) => clean(part))
      )
    )
    .filter((cells) => cells.some(Boolean));

  if (rows.length === 0) return null;

  // Linha de título com uma célula só (colspan) não é cabeçalho de coluna.
  const headerIsLabels =
    rows.length > 1 && rows[0].length > 1 && rows[0].length === rows[1].length;

  return headerIsLabels ? { headers: rows[0], rows: rows.slice(1) } : { rows };
}

/**
 * Troca cada tabela do HTML por um marcador, devolvendo-as à parte.
 *
 * O marcador guarda a POSIÇÃO: a tabela costuma ter texto antes e depois, e
 * jogá-la para o fim da descrição mudaria o sentido do que está escrito.
 */
function extractTables(html: string, tables: IFeatureTable[]): string {
  return html.replace(TABLE, (table) => {
    const parsed = readTable(table);
    if (!parsed) return ' ';
    tables.push(parsed);
    return `\n${TABLE_MARK}${tables.length - 1}\n`;
  });
}

function tableRows(table: string): string[][] {
  return [...table.matchAll(ROW)].map((row) =>
    [...row[1].matchAll(CELL)].map((cell) => clean(cell[1]))
  );
}

/** A tabela de progressão é a que tem uma linha de níveis inteiros. */
function progressionTableOf(html: string): string[][] | null {
  let best: string[][] | null = null;
  for (const table of html.match(TABLE) ?? []) {
    const rows = tableRows(table);
    const levels = rows.filter((r) => /^\d{1,2}$/.test(r[0] ?? ''));
    if (levels.length < 5) continue;
    if (!best || levels.length > best.length) best = rows;
  }
  return best;
}

const hasProgressionTable = (html: string) => progressionTableOf(html) !== null;

const ASI = /em (um|dois) atributos?/i;

/**
 * Fração mínima do que a tabela anuncia que precisa aparecer descrita para o
 * texto extraído entrar direto na classe. Abaixo disso ele vira candidato.
 */
const TRUST_THRESHOLD = 0.7;

/**
 * Lê a tabela de progressão.
 *
 * As colunas são casadas pelo CABEÇALHO normalizado, nunca pela posição: a
 * coluna de características é a 3ª no espadachim e a 6ª no bardo, e o monge só
 * tem 3 colunas. Coluna não reconhecida vai para `columns`, preservada.
 */
export function parseProgressionTable(html: string): IClassLevel[] {
  const rows = progressionTableOf(html);
  if (!rows) return [];

  // A linha de cabeçalho é PROCURADA: o monge tem uma linha de título com
  // colspan antes dela.
  const headerIndex = rows.findIndex((r) => foldLabel(r[0] ?? '') === 'nivel');
  if (headerIndex === -1) return [];
  const header = rows[headerIndex].map(foldLabel);

  const levels: IClassLevel[] = [];
  for (const row of rows.slice(headerIndex + 1)) {
    if (!/^\d{1,2}$/.test(row[0] ?? '')) continue;

    const level: IClassLevel = { level: Number(row[0]) };
    const columns: Record<string, string> = {};

    header.forEach((label, i) => {
      const value = row[i] ?? '';
      if (!value || value === '-' || value === '—') return;
      const alias = COLUMN_ALIASES.find((a) => a.match(label));

      switch (alias?.key) {
        case 'level':
          break;
        case 'proficiencyBonus': {
          const n = Number(value.replace(/[^\d-]/g, ''));
          if (Number.isFinite(n)) level.proficiencyBonus = n;
          break;
        }
        case 'cantripsKnown': {
          const n = Number(value.replace(/[^\d]/g, ''));
          if (Number.isFinite(n) && value.trim() !== '') {
            level.cantripsKnown = n;
          }
          break;
        }
        case 'spellSlots':
          level.spellSlotsRaw = value;
          level.spellSlots = parseSlotCell(value);
          break;
        case 'features': {
          const grants = parseGrants(value);
          level.grants = grants;
          // `features` é a lista plana dos NOMES de característica, usada para
          // casar com as descrições e para busca. O aumento de atributo fica
          // de fora: é escolha de ficha, não característica nomeada, e
          // poluiria a reconciliação com "+1 em dois atributos".
          level.features = grants
            .flatMap((g) => g.options.map((o) => o.name))
            .filter((name) => !ASI.test(name));
          if (ASI.test(value)) level.abilityScoreIncrease = value;
          break;
        }
        case 'abilityScoreIncrease':
          level.abilityScoreIncrease = value;
          break;
        default: {
          // Ignora colunas com cabeçalho vazio (artefato de formatação do fórum
          // que às vezes adiciona uma 5ª coluna sem rótulo).
          const colLabel = rows[headerIndex][i];
          if (colLabel) columns[colLabel] = value;
          break;
        }
      }
    });

    if (Object.keys(columns).length > 0) level.columns = columns;
    levels.push(level);
  }

  return levels;
}

interface IBlock {
  name: string;
  level?: number;
  description: string;
  /** O nome vinha terminado em dois-pontos — a assinatura de um talento. */
  hadColon: boolean;
  /** O bloco apareceu depois do cabeçalho "Arquétipos". */
  inArchetypes: boolean;
  /** O bloco estava dentro de um spoiler. */
  inSpoiler: boolean;
  /**
   * Profundidade de spoiler no momento em que o bloco foi aberto (0 = fora de
   * todo spoiler). Usado para identificar progressões de entidades aninhadas
   * (avatares de invocador, fichas de espectro…) que vivem em spoilers de
   * segundo nível e não devem ser confundidas com características da classe.
   */
  spoilerDepth: number;
  /**
   * O bloco apareceu dentro da seção de domínios/ordens introduzida por um
   * cabeçalho em `DOMAIN_MARKERS`. Vai para `contentBlocks` com
   * `kind: 'domainFeature'` em vez de para features/archetypes.
   */
  inDomains: boolean;
  /**
   * O bloco está dentro de um spoiler de entidade aninhada, identificada pelo
   * cabeçalho "Evolução de X" imediatamente antes do spoiler. Usado para
   * separar as evoluções de avatar do Invocador (e similares) das
   * características da classe. Vai para `contentBlocks` com
   * `kind: 'nestedProgression'` sem precisar estar em `spoilerDepth >= 2`.
   */
  inNestedEntity: boolean;
  /**
   * O bloco é uma nota/observação autoral (OBS, Nota…). Vai para
   * `contentBlocks` com `kind: 'obs'` em vez de para features/talents.
   */
  isObs: boolean;
  /**
   * Em qual mensagem do tópico o bloco apareceu, contada de 0.
   */
  post: number;
  /**
   * Qual spoiler, contado de 0 na ordem do tópico. `-1` fora de todos.
   *
   * É a fronteira de um arquétipo: as habilidades dele terminam onde fecha o
   * `dl.codebox.spoiler` que as contém. Sem isto, só a profundidade era
   * conhecida, e um spoiler seguinte parecia a continuação do anterior.
   */
  spoiler: number;
  /** Índices das tabelas que apareceram dentro deste bloco. */
  tables: number[];
}

/**
 * Lê blocos "Nível N" / "**Nome**" / prosa.
 *
 * `known` traz os nomes anunciados pela tabela: algumas classes escrevem uma
 * característica em texto puro (o druida faz isso com "Mente Clara"), e sem
 * esse cruzamento ela desapareceria dentro do parágrafo anterior.
 */
export function parseBlocks(
  lines: string[],
  known: Set<string> = new Set()
): IBlock[] {
  const blocks: IBlock[] = [];
  // Um porta-valor em vez de uma variável solta: `current` é atribuído dentro
  // de closures, e o TypeScript não acompanha isso no fluxo — a variável
  // acabaria estreitada para `never`.
  const state: { current: IBlock | null } = { current: null };
  let level: number | undefined;
  let inArchetypes = false;
  let inDomains = false;
  let spoilerDepth = 0;
  // Só os spoilers de primeiro nível são numerados: um spoiler aninhado é
  // parte do mesmo bloco de conteúdo que o de fora.
  let spoilerIndex = -1;
  let spoilerCount = 0;
  let post = -1;
  const body: string[] = [];
  // Spoilers abertos logo depois de um cabeçalho "Evolução de X" (avatares do
  // Invocador, etc.) são marcados aqui pelo seu índice, para que os blocos
  // dentro sejam classificados como `inNestedEntity = true`.
  const nestedEntitySpoilers = new Set<number>();

  const flush = () => {
    if (state.current) {
      state.current.description = body.join('\n').trim();
      blocks.push(state.current);
    }
    body.length = 0;
    state.current = null;
  };

  const openBlock = (name: string, hadColon: boolean, isObs = false) => {
    flush();
    state.current = {
      name,
      level,
      description: '',
      hadColon,
      inArchetypes,
      inSpoiler: spoilerDepth > 0,
      spoilerDepth,
      inDomains,
      inNestedEntity:
        spoilerDepth > 0 && nestedEntitySpoilers.has(spoilerIndex),
      isObs,
      post,
      spoiler: spoilerDepth > 0 ? spoilerIndex : -1,
      tables: [],
    };
  };

  const singular = (text: string) => foldLabel(text).replace(/s\b/g, '');

  for (const raw of lines) {
    const line = raw.trim();

    if (line === POST_MARK) {
      // Uma mensagem nunca continua um bloco da anterior: o corte entre elas
      // arrasta rodapé e script, que não são corpo de nada.
      flush();
      level = undefined;
      spoilerDepth = 0;
      spoilerIndex = -1;
      post++;
      continue;
    }

    if (line === SPOILER_OPEN) {
      if (spoilerDepth === 0) spoilerIndex = spoilerCount++;
      spoilerDepth++;
      // Cada spoiler recomeça a contagem de níveis. Sem isto, o nome do
      // segundo arquétipo herdava o "Nível 18" do primeiro e virava
      // característica dele.
      const flushingName = state.current?.name;
      // Só marca o spoiler como entidade aninhada quando o bloco que estava
      // aberto NÃO tinha corpo (cabeçalho puro, ex.: "Evolução de Carbuncle"
      // do Invocador). Se o bloco tinha texto antes do spoiler (ex.: "Evolução
      // de Ki" do Monge com uma descrição), é uma característica de classe
      // real — não deve contaminar os blocos do spoiler como nestedEntity.
      const flushingBodyEmpty =
        body.length === 0 || body.every((l) => !l.trim());
      flush();
      // Spoiler aberto logo depois de um cabeçalho "Evolução de X" SEM corpo
      // é uma progressão de entidade aninhada (ex.: "Evolução de Carbuncle"
      // do Invocador). Blocos abertos dentro dele recebem `inNestedEntity=true`.
      if (
        flushingName &&
        flushingBodyEmpty &&
        /^evolu[cç][aã]/i.test(foldLabel(flushingName)) &&
        foldLabel(flushingName) !== 'evolucao de classe'
      ) {
        nestedEntitySpoilers.add(spoilerIndex);
      }
      level = undefined;
      continue;
    }
    if (line === SPOILER_CLOSE) {
      spoilerDepth = Math.max(0, spoilerDepth - 1);
      if (spoilerDepth === 0) spoilerIndex = -1;
      flush();
      level = undefined;
      continue;
    }

    if (line.startsWith(TABLE_MARK)) {
      // A tabela fica onde estava: o marcador entra no corpo, e a descrição
      // final o carrega para o renderizador saber onde desenhá-la.
      if (state.current) {
        const index = Number(line.slice(TABLE_MARK.length));
        if (Number.isFinite(index)) {
          body.push(`[[tabela:${state.current.tables.length}]]`);
          state.current.tables.push(index);
        }
      }
      continue;
    }

    if (!line) {
      if (state.current) body.push('');
      continue;
    }

    const text = unmark(line);

    // "Nível N" só com casamento total: existe prosa como "No 12º nível: ...".
    const header = /^N[íi]vel\s+(\d{1,2})$/i.exec(text);
    if (header && !isWholeLineBold(line)) {
      level = Number(header[1]);
      continue;
    }

    // O cabeçalho "Arquétipos" é testado FORA do bloco de negrito: em 5 dos 20
    // tópicos (arqueiro, atirador, cavaleiro das trevas, dragoon, ladrão) ele
    // é texto puro. Onde o marcador se perdia, as características de todos os
    // arquétipos caíam na lista da classe — é de lá que vinham as 224
    // "características" do invocador.
    //
    // O casamento é com a linha INTEIRA, então uma frase que mencione
    // arquétipos não dispara nada.
    // Cabeçalhos de seção só são reconhecidos no nível raiz do tópico (fora de
    // todos os spoilers). Dentro de uma descrição, "Arquétipos" ou "Domínios"
    // podem aparecer como sub-títulos de prosa (ex.: o "Domínios" dentro da
    // descrição de "Ordem Deífica" do Clérigo) — eles não devem mudar o modo
    // global do parser.
    if (spoilerDepth === 0 && ARCHETYPE_MARKERS.has(foldLabel(text))) {
      inArchetypes = true;
      inDomains = false;
      flush();
      level = undefined;
      continue;
    }

    // "Domínios", "Domínio" etc. — seção de domínios/extensões que vem DEPOIS
    // dos arquétipos de verdade (clérigo, druida…). Sem esta detecção,
    // `inArchetypes` continua `true` e cada entrada "Domínio do Ar" vira um
    // falso arquétipo.
    if (spoilerDepth === 0 && DOMAIN_MARKERS.has(foldLabel(text))) {
      inArchetypes = false;
      inDomains = true;
      flush();
      level = undefined;
      continue;
    }

    if (isWholeLineBold(line)) {
      const folded = foldLabel(text);
      const endsWithColon = text.trim().endsWith(':');

      if (!text || isSectionMarker(folded) || isProseLabel(folded)) continue;
      // "Pré-requisitos: Berserker 8" e "Médio: 1d10" são detalhe do item
      // aberto, não o próximo poder da lista.
      const detailHead = foldLabel((text.split(':')[0] ?? '').trim());
      if (isInlineDetail(detailHead)) {
        if (state.current) body.push(text);
        continue;
      }
      if (isPostChrome(text)) continue;

      // O "*" no nome é convenção do fórum para "requer pré-requisito" — já
      // está semanticamente resolvido no campo `requiresPrerequisite` de
      // `IClassGrant`; deixá-lo no nome impede o casamento com `announced`.
      const name = text
        .replace(/:$/, '')
        .replace(/\s*\*\s*$/, '')
        .trim();
      // Nome longo é prosa que por acaso veio toda em negrito.
      if (!name || name.length > 70) continue;

      // OBS / Nota autoral: capturada como contentBlock em vez de feature/talent.
      if (OBS_MARKERS.includes(folded)) {
        openBlock(name, false, true);
        continue;
      }

      // Sub-cabeçalho plural dentro da própria característica
      // ("Terrenos Favorecidos" dentro de "Terreno Favorecido"). O nome igual
      // é outro item: a dançarina lista duas "Dança da Lâmina" diferentes.
      if (
        state.current &&
        foldLabel(name) !== foldLabel(state.current.name) &&
        singular(name) === singular(state.current.name)
      ) {
        body.push(name);
        continue;
      }

      openBlock(name, endsWithColon);
      continue;
    }

    // Linha que começa em negrito mas não termina: o símbolo ou o dois-pontos
    // ficou fora da tag — ex.: "<strong>MARCA</strong>:" ou
    // "<strong>SENTIDO DE PERIGO</strong>*". Extrai a parte em negrito como
    // nome do bloco e o restante como primeira linha do corpo.
    // Não há restrição de profundidade: blocos em spoilerDepth >= 2 são
    // filtrados mais tarde pelas regras de features/talents, e os que estão
    // em nestedEntity vão para contentBlocks[nestedProgression].
    if (line.startsWith(BOLD_OPEN)) {
      const closeIdx = line.indexOf(BOLD_CLOSE);
      if (closeIdx > BOLD_OPEN.length) {
        const boldPart = line.slice(BOLD_OPEN.length, closeIdx).trim();
        const restPart = line.slice(closeIdx + BOLD_CLOSE.length).trim();
        if (
          boldPart &&
          boldPart.length <= 70 &&
          !isSectionMarker(foldLabel(boldPart)) &&
          !isDetailLabel(foldLabel(boldPart)) &&
          !isPostChrome(boldPart) &&
          !/^N[íi]vel\s+\d/i.test(boldPart)
        ) {
          const endsWithColon = boldPart.endsWith(':');
          const partialName = boldPart
            .replace(/:$/, '')
            .replace(/\s*\*\s*$/, '')
            .trim();
          if (
            partialName &&
            (inArchetypes || known.has(singular(partialName)))
          ) {
            // Apenas cria bloco se o nome é uma feature anunciada pela tabela
            // de progressão (known) OU se estamos dentro de uma seção de
            // arquétipos (onde os nomes não aparecem no known, mas são válidos).
            // Sem esta guarda, rótulos internos como "Frequência:", "Uso:",
            // "Alcance:" etc. viram falsas características/talentos.
            openBlock(partialName, endsWithColon);
            if (restPart) body.push(restPart);
            continue;
          }
        }
      }
    }

    if (spoilerDepth === 0 && PLAIN_CHOICE_HEADINGS.has(foldLabel(text))) {
      openBlock(text, false);
      continue;
    }

    // Característica anunciada pela tabela mas escrita sem negrito.
    if (known.size > 0 && text.split(' ').length <= 6) {
      const folded = singular(text);
      const sameAsCurrent =
        state.current && singular(state.current.name) === folded;
      if (known.has(folded) && !sameAsCurrent) {
        openBlock(text, false);
        continue;
      }
    }

    if (state.current) body.push(text);
  }

  flush();
  return blocks;
}

/**
 * Separa a assinatura de um talento em nome, requisito e marcadores.
 *
 * Quatro grafias convivem nos tópicos, todas na mesma linha em negrito:
 *   "Terreno Adaptável – Requer nível 8 de druida"
 *   "Zona de Profanação – Requisito: característica de classe Aura do Medo"
 *   "Aprimorar Magia * —"
 *   "Cura Enfraquecida [Necromante 8, Toque de Dano]"
 *
 * A âncora do requisito é o verbo ("Requer"/"Requisito"), nunca o travessão
 * sozinho: aceitar hífen solto partiria "Esconder-se à Vista" ao meio.
 *
 * O travessão final é a grafia de "sem pré-requisito" e vira ausência, não
 * um requisito escrito "—". O asterisco é a convenção do fórum para talento
 * que altera a conjuração ("Talentos marcados com um asterisco (*) adicionam
 * efeitos à habilidade de conjuração"), e vira um campo em vez de sujeira no
 * nome.
 */
export function splitTalentName(raw: string): {
  name: string;
  requirement?: string;
  affectsSpellcasting?: boolean;
} {
  // "Requer" e "Requisito" só compartilham "Requ": a alternância precisa
  // começar ali, ou a segunda grafia nunca casa.
  const m = /^(.*?)\s*[–—-]\s*Requ(?:er|erimento|isito)s?\s*:?\s+(.*)$/i.exec(
    raw
  );
  // O colchete terminal é a quarta grafia, e dispensa o verbo: ali dentro só
  // vai requisito. "[—]" é a forma de "nenhum" e some junto com o colchete.
  const bracket = m ? null : /^(.*?)\s*\[([^\]]*)\]\s*$/.exec(raw);

  let name = (m?.[1] ?? bracket?.[1] ?? raw).trim();
  const requirement = (m?.[2] ?? bracket?.[2])?.trim();

  // Primeiro o travessão terminal, depois o asterisco: eles aparecem nesta
  // ordem ("Aprimorar Magia * —") e tirar o de fora destrava o de dentro.
  name = name.replace(/\s*[–—]\s*$/, '').trim();
  const affectsSpellcasting = /\*\s*$/.test(name);
  name = name.replace(/\s*\*\s*$/, '').trim();

  return {
    name,
    ...(requirement && !/^[\s–—-]+$/.test(requirement) ? { requirement } : {}),
    ...(affectsSpellcasting ? { affectsSpellcasting } : {}),
  };
}

/**
 * Diagnóstico por post/seção, emitido no dry-run e nos warnings.
 *
 * Separado do warning genérico para que o front-end possa mostrar exatamente
 * qual post ou seção não foi reconhecida, facilitando a edição manual.
 */
export interface IPostDiagnostic {
  /** Índice do post no tópico (0-indexed). */
  post: number;
  /** Blocos cujo conteúdo foi extraído com sucesso deste post. */
  extractedBlocks: number;
  /** Blocos que não foram classificados e caíram em `contentBlocks`. */
  unclassifiedBlocks: number;
  warnings: string[];
}

export interface IParsedClass extends Partial<ICharacterClass> {
  warnings: string[];
  /** Diagnóstico por post, para o relatório de importação. */
  postDiagnostics?: IPostDiagnostic[];
}

/** Lê o cabeçalho da classe — só a região anterior à tabela de progressão. */
function parseOverview(html: string): {
  data: Record<string, unknown>;
  description: string;
  equipment: string[];
} {
  // Delimitado de propósito: varrer o tópico inteiro colheria nomes de
  // características que parecem rótulos ("Armadura da Natureza", "Foco em
  // Arma", "Armadilha de Ki").
  const cut = html.search(TABLE);
  const lines = classTopicLines(cut > 0 ? html.slice(0, cut) : html);

  const data: Record<string, unknown> = {};
  const proficiencies: Record<string, string> = {};
  const equipment: string[] = [];
  const intro: string[] = [];
  let inEquipment = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const text = unmark(line);
    if (/\bpostado\b/i.test(text)) continue;

    if (line.includes(BOLD_OPEN)) {
      const label = line.slice(
        line.indexOf(BOLD_OPEN) + BOLD_OPEN.length,
        line.indexOf(BOLD_CLOSE)
      );
      const value = line.slice(line.indexOf(BOLD_CLOSE) + BOLD_CLOSE.length);
      const folded = foldLabel(label);

      if (/^equipamentos? inicia/.test(folded) || folded === 'equipamento') {
        inEquipment = true;
        continue;
      }
      inEquipment = false;

      const alias = HEADER_ALIASES.find((a) => a.match(folded));
      const clean = value.replace(/^[\s:]+/, '').trim();
      if (alias && clean) {
        if (alias.key.startsWith('proficiencies.')) {
          proficiencies[alias.key.split('.')[1]] = clean;
        } else {
          data[alias.key] = clean;
        }
      }
      continue;
    }

    // Rótulo sem negrito: no template novo a linha inteira é texto puro
    // ("Dado de Vida: 1d8 por nível"). Só vale quando o que vem antes do
    // dois-pontos é um rótulo conhecido — a lista é fechada, então uma frase
    // qualquer terminada em dois-pontos continua sendo prosa.
    const folded = foldLabel(text);
    if (/^equipamentos? inicia/.test(folded) || folded === 'equipamento') {
      inEquipment = true;
      continue;
    }

    const colon = text.indexOf(':');
    if (colon > 0) {
      const alias = HEADER_ALIASES.find((a) =>
        a.match(foldLabel(text.slice(0, colon)))
      );
      const value = text.slice(colon + 1).trim();
      if (alias && value) {
        inEquipment = false;
        if (alias.key.startsWith('proficiencies.')) {
          proficiencies[alias.key.split('.')[1]] = value;
        } else {
          data[alias.key] = value;
        }
        continue;
      }
    }

    if (inEquipment && text) equipment.push(text);
    else if (text.length > 80) intro.push(text);
  }

  if (Object.keys(proficiencies).length > 0) data.proficiencies = proficiencies;
  return { data, description: intro.join('\n\n'), equipment };
}

/**
 * Extrai a classe de um tópico já baixado.
 *
 * Toda seção de texto é opcional — medido nos 20 tópicos: a tabela de
 * progressão existe em 20/20, mas "Talentos" em 18, "Dado de Vida" em 17 e
 * "Arquétipos" em 14. O que não for reconhecido é relatado, nunca descartado
 * em silêncio.
 */
export function parseClassTopic(
  html: string,
  name: string,
  sourceUrl?: string
): IParsedClass {
  const warnings: string[] = [];
  const stream = classStream(html);

  const levels = stream.overview ? parseProgressionTable(stream.overview) : [];
  if (levels.length !== 20) {
    warnings.push(`A tabela de progressão rendeu ${levels.length} níveis.`);
  }

  // Os nomes já chegam separados: a vírgula é tratada como o "+" lá em
  // `parseGrants`, que é onde a gramática da célula mora. Quebrar de novo aqui
  // seria a mesma regra escrita em dois lugares.
  //
  // `stripVersion` remove sufixos de versão como "(+2)" e "nv 1" antes de
  // normalizar: "Sentido de Perigo (+2)*" e "Sentido de Perigo" ficam ambos
  // como "entido de perigo" no conjunto, e o dedup elimina duplicatas.
  const announced = new Set<string>();
  for (const level of levels) {
    for (const feature of level.features ?? []) {
      announced.add(singularOf(stripVersion(feature)));
    }
  }

  // O cabeçalho pode estar num post diferente do da tabela (template novo).
  const headerPost = stream.header ?? stream.overview;
  const overview = headerPost
    ? parseOverview(headerPost)
    : { data: {}, description: '', equipment: [] };

  // Um passe só sobre o tópico inteiro; a classificação é pela FORMA do bloco.
  // Só entra o que tem corpo: o fórum usa negrito para tudo, e exigir
  // descrição é o que separa um item de verdade de um rótulo solto.
  const allBlocks = parseBlocks(stream.lines, announced);
  const blocks = allBlocks.filter(
    (b) =>
      b.description.length > 20 ||
      b.tables.length > 0 ||
      // Cabeçalho da seção de arquétipos: o corpo dele é o spoiler que vem
      // logo abaixo, não texto próprio. O "Talentos" do necromante é assim, e
      // descartá-lo por não ter descrição fazia os dezoito talentos que ele
      // abre caírem dentro do arquétipo anterior.
      (b.inArchetypes && !b.inSpoiler && !b.hadColon)
  );

  // Resolve os índices globais para as tabelas do próprio bloco, na ordem em
  // que os marcadores `[[tabela:N]]` aparecem na descrição.
  const tablesOf = (block: IBlock): IFeatureTable[] | undefined => {
    const own = block.tables
      .map((index) => stream.tables[index])
      .filter(Boolean);
    return own.length > 0 ? own : undefined;
  };

  // Dois-pontos no nome é a assinatura de um talento ("Exploradora Hábil:") —
  // mas só FORA da seção de arquétipos. Dentro dela o fórum usa a mesma
  // grafia para o detalhe de uma habilidade ("Incorpóreo:", "Estatísticas do
  // Espectro:"), e tomar isso por talento tirava do arquétipo o texto que o
  // explica para jogá-lo no catálogo de talentos.
  //
  // Mutável: a varredura dos arquétipos, logo abaixo, acrescenta os talentos
  // que o fórum diagrama dentro daquela seção.
  const isAnnouncedFeature = (block: IBlock) =>
    announced.has(singularOf(stripVersion(block.name)));

  const talents: ITalent[] = blocks
    .filter(
      (b) =>
        b.hadColon &&
        !isAnnouncedFeature(b) &&
        !b.inArchetypes &&
        !b.inDomains &&
        b.spoilerDepth < 2 &&
        !b.inNestedEntity
    )
    .map((b) => {
      const { name: talentName, ...signature } = splitTalentName(b.name);
      return {
        name: talentName,
        ...signature,
        description: b.description,
        tables: tablesOf(b),
      };
    });

  const featureBlocks = blocks.filter(
    (b) => !b.hadColon || isAnnouncedFeature(b)
  );

  // Uma característica precisa estar ancorada: ou veio sob um "Nível N", ou é
  // um nome que a tabela anuncia. Sem essa âncora entra todo bloco em negrito
  // do tópico — o clérigo rendia 312 "características".
  // Nomes que a tabela usa como marcador, não como característica: apontam
  // para o arquétipo escolhido ou para a escolha de atributo.
  const isGhostName = (name: string) =>
    /^(arquetipo|habilidade de arquetipo|skill de arquetipo|aumento de atributo|um talento)/.test(
      foldLabel(name)
    );

  // O tópico do paladino escreve "no 77º nível". Confirmado como erro de
  // digitação: a escolha começa no 7º.
  const correctKnownTypos = (name: string, description: string) =>
    foldLabel(name) === 'artes divinas'
      ? description.replaceAll('no 77º nível', 'no 7º nível')
      : description;

  const features: IClassFeature[] = featureBlocks
    .filter((b) => !b.inArchetypes)
    // Blocos de domínio/extensão já vão para contentBlocks['domainFeature'].
    .filter((b) => !b.inDomains)
    // Blocos em spoiler de segundo nível (avatar, espectro…) são progressões
    // de entidade aninhada, não características da classe. Sem este filtro, o
    // Invocador renderia 224 "características" pelos 19 avatares × suas evoluções.
    .filter((b) => b.spoilerDepth < 2)
    // Blocos dentro de spoilers de entidade aninhada identificados pelo padrão
    // "Evolução de X" (ex.: avatares do Invocador a D1, não a D2).
    .filter((b) => !b.inNestedEntity)
    .filter((b) => !isGhostName(b.name))
    // O casamento com `announced` usa `stripVersion` porque a tabela escreve
    // "Evasão nv 1" e o texto descreve "Evasão (1)" — sem normalizar, o nome
    // do bloco jamais bateria com o conjunto de anunciados.
    .filter(
      (b) =>
        b.level !== undefined || announced.has(singularOf(stripVersion(b.name)))
    )
    .map((b) => ({
      name: b.name,
      level: b.level,
      description: correctKnownTypos(b.name, b.description),
      tables: tablesOf(b),
    }));

  /**
   * Uma lista de talentos avançados escrita DENTRO da seção de arquétipos.
   *
   * "Talentos Avançados de Necromancia" não é um arquétipo: é um conjunto de
   * talentos que só destrava sob condição ("a partir do nível 12, e a cada
   * dois níveis seguintes, no lugar de um talento normal"). Elas estão sob o
   * cabeçalho "Arquétipos" por diagramação, não por serem subclasses — e
   * tratá-las como tal punha na ficha um "arquétipo" que ninguém escolhe e
   * escondia dezenas de talentos de verdade.
   *
   * Cinco classes têm uma: necromante, maga branca, mago do tempo, cavaleiro
   * (duas) e arqueiro ("Talentos com Asterisco"). A da dançarina não entra
   * aqui: "Talentos de Dança" é lista de escolha, e o avançado vai na mesma.
   */
  const isTalentList = (name: string) => /talento/.test(foldLabel(name));

  /**
   * Listas de escolha que o tópico diagrama como arquétipo.
   *
   * Não são subclasses. "Artes Divinas" o paladino escolhe a partir do 7º
   * nível. "Poderes de Fúria" o berserker ganha a partir do 2º, um a cada dois
   * níveis, inclusive os ramos da árvore e as posturas. "Formas de Fúria"
   * está num spoiler dentro do spoiler da progressão. "Técnicas Blitz" o
   * monge escolhe a partir do 7º. "Habilidades de Fúria (Berserker)" é a
   * lista que o monge selvagem escolhe; o texto foi colado do berserker.
   * "Danças Místicas" a dançarina aprende a partir do 6º, uma a cada três
   * níveis. As outras listas parecidas ficam de fora até cada uma ser
   * confirmada.
   */
  const CHOICE_LISTS = new Set([
    'artes divinas',
    'poderes de furia',
    'formas de furia',
    'tecnicas blitz',
    'habilidades de furia (berserker)',
    'dancas misticas',
  ]);
  /**
   * Os dois títulos do mesmo post da dançarina. O avançado não é outra lista:
   * são os talentos de nível mais alto, escolhidos no lugar de um comum.
   */
  const DANCE_TALENT_HEADINGS = new Set([
    'talentos de danca',
    'talento de danca avancado',
  ]);
  const isDanceTalentHeading = (name: string) =>
    DANCE_TALENT_HEADINGS.has(foldLabel(name));
  const isChoiceList = (name: string) => CHOICE_LISTS.has(foldLabel(name));
  // O cabeçalho do tópico omite o "de" que a característica usa.
  const CHOICE_LIST_RULES: Record<string, string> = {
    'tecnicas blitz': 'tecnicas de blitz',
  };

  const absorbedCatalogBlocks = new Set<IBlock>();
  const archetypes: IArchetype[] = [];
  const catalogs: IClassCatalog[] = [];
  {
    // A fronteira de um arquétipo é o SPOILER, não o fim da seção.
    //
    // O tópico escreve o nome do arquétipo fora do spoiler e as habilidades
    // que ele concede dentro de UM `dl.codebox.spoiler`. Onde esse spoiler
    // fecha, o arquétipo acabou: o que vier depois — e sobretudo o que vier
    // em outra mensagem — é talento, não habilidade de arquétipo.
    //
    // Enquanto isso não era respeitado, bastava um cabeçalho intermediário se
    // perder para o resto do tópico inteiro ser engolido pelo último
    // arquétipo aberto: o necromante ganhava 18 talentos dentro da Invocadora
    // de Espectros.
    const inside = blocks.filter((b) => b.inArchetypes);

    // Formas de Fúria não é cabeçalho de arquétipo: o nome é a característica
    // e os itens estão no spoiler aninhado logo abaixo. A profundidade maior
    // é o que separa a lista do resto da progressão.
    for (let index = 0; index < allBlocks.length; index++) {
      const block = allBlocks[index];
      if (foldLabel(block.name) !== 'formas de furia') continue;
      if (block.inArchetypes && block.spoiler < 0) continue;
      const rule = features.find(
        (feature) => foldLabel(feature.name) === 'formas de furia'
      );
      const description = block.description || rule?.description;
      const items: NonNullable<IClassCatalog['items']> = [];
      for (let next = index + 1; next < allBlocks.length; next++) {
        const candidate = allBlocks[next];
        if (candidate.post !== block.post) break;
        if (candidate.spoilerDepth <= block.spoilerDepth) break;
        absorbedCatalogBlocks.add(candidate);
        if (isInlineDetail(foldLabel(candidate.name))) {
          const previous = items[items.length - 1];
          if (previous) {
            previous.description = [
              previous.description,
              `${candidate.name}: ${candidate.description}`,
            ]
              .filter(Boolean)
              .join('\n\n');
          }
          continue;
        }
        items.push({
          name: candidate.name,
          description: candidate.description,
          tables: tablesOf(candidate),
        });
      }
      if (items.length === 0) continue;
      catalogs.push({
        name: block.name,
        slug: classSlug(block.name),
        ...(description ? { description } : {}),
        items,
      });
    }

    // O cabeçalho aberto e o spoiler que ele reivindicou. `spoiler` só é
    // conhecido quando o primeiro bloco de dentro aparece — o cabeçalho vem
    // antes da abertura.
    type Owner = {
      archetype: IArchetype | null;
      list: { group: string; unlock?: string } | null;
      catalog: IClassCatalog | null;
      spoiler: number | null;
      post: number;
    };
    let owner: Owner | null = null;
    // O item aberto nasceu sem dois-pontos. O que vier com dois-pontos é
    // passo dele ("Guardião:", "O dado aumenta:"), não o próximo da lista.
    // Item que já nasce com dois-pontos é irmão, como em Artes Divinas.
    let openItemHadColon = false;

    const asTalent = (
      block: IBlock,
      from?: { group: string; unlock?: string }
    ) => {
      const { name: talentName, ...signature } = splitTalentName(block.name);
      talents.push({
        name: talentName,
        ...signature,
        description: block.description,
        tables: tablesOf(block),
        ...(from?.group ? { group: from.group } : {}),
        ...(from?.unlock ? { unlock: from.unlock } : {}),
      });
    };

    for (const block of inside) {
      // ── Cabeçalho (fora de qualquer spoiler) ──
      if (block.spoiler < 0) {
        openItemHadColon = false;
        if (isDanceTalentHeading(block.name)) {
          let catalog = catalogs.find(
            (entry) => foldLabel(entry.name) === 'talentos de danca'
          );
          if (!catalog) {
            const rule = features.find(
              (feature) => foldLabel(feature.name) === 'talentos de danca'
            );
            const description = block.description || rule?.description;
            catalog = {
              name: 'Talentos de Dança',
              slug: classSlug('Talentos de Dança'),
              ...(description ? { description } : {}),
              items: [],
            };
            catalogs.push(catalog);
          } else if (block.description) {
            catalog.description = [catalog.description, block.description]
              .filter(Boolean)
              .join('\n\n');
          }
          owner = {
            archetype: null,
            list: null,
            catalog,
            spoiler: null,
            post: block.post,
          };
          continue;
        }

        // Uma lista de talentos é reconhecida pelo nome: "Talentos",
        // "Talentos Avançados de Necromancia", "Talentos com Asterisco". Não
        // são arquétipos — ninguém as escolhe como subclasse —, e o que a
        // descrição do cabeçalho traz é a regra de destrave do conjunto.
        if (isChoiceList(block.name)) {
          // A regra pode estar na característica de mesmo nome, não no
          // cabeçalho. "Artes Divinas" é assim: o cabeçalho só abre o
          // spoiler, e o texto está na progressão.
          const foldedName = foldLabel(block.name);
          const ruleName = CHOICE_LIST_RULES[foldedName];
          const rule = features.find((feature) => {
            const folded = foldLabel(feature.name);
            return folded === foldedName || folded === ruleName;
          });
          const archetypeRule =
            foldedName === 'habilidades de furia (berserker)'
              ? archetypes
                  .flatMap((archetype) => archetype.features ?? [])
                  .find(
                    (feature) => foldLabel(feature.name) === 'poderes de furia'
                  )
              : undefined;
          const description =
            block.description ||
            rule?.description ||
            archetypeRule?.description;
          const catalog: IClassCatalog = {
            name: block.name,
            slug: classSlug(block.name),
            ...(description ? { description } : {}),
            items: [],
          };
          catalogs.push(catalog);
          owner = {
            archetype: null,
            list: null,
            catalog,
            spoiler: null,
            post: block.post,
          };
          continue;
        }

        if (isTalentList(block.name)) {
          const unlock = block.description;
          owner = {
            archetype: null,
            catalog: null,
            // Sem descrição é a lista comum de talentos da classe; com
            // descrição é um conjunto condicional, e aí o grupo importa.
            list: unlock ? { group: block.name, unlock } : { group: '' },
            spoiler: null,
            post: block.post,
          };
          continue;
        }

        const archetype: IArchetype = {
          name: block.name,
          slug: classSlug(block.name),
          description: block.description,
          features: [],
        };
        archetypes.push(archetype);
        owner = {
          archetype,
          list: null,
          catalog: null,
          spoiler: null,
          post: block.post,
        };
        continue;
      }

      // ── Dentro de um spoiler ──
      // Um arquétipo e as habilidades dele estão sempre na mesma mensagem.
      // Virou a página, o cabeçalho anterior não manda mais em nada.
      if (owner && owner.post !== block.post) owner = null;
      // O primeiro bloco de dentro define qual spoiler pertence ao cabeçalho.
      if (owner && owner.spoiler === null) owner.spoiler = block.spoiler;

      // Spoiler que não é o do cabeçalho aberto: já saiu do arquétipo.
      // Posturas é o spoiler seguinte, no mesmo post de Poderes de Fúria.
      if (!owner || owner.spoiler !== block.spoiler) {
        const continuesPowers =
          owner?.catalog &&
          owner.post === block.post &&
          foldLabel(owner.catalog.name) === 'poderes de furia';
        if (continuesPowers && owner) {
          owner.spoiler = block.spoiler;
        } else {
          asTalent(block);
          owner = null;
          continue;
        }
      }

      // Habilidade de arquétipo sem nome em negrito não existe: ali dentro o
      // fórum sempre marca. Prosa solta que virou bloco é resto.

      if (owner.catalog) {
        const items = owner.catalog.items ?? [];
        const previous = items[items.length - 1];
        if (
          previous &&
          (isInlineDetail(foldLabel(block.name)) ||
            (block.hadColon && !openItemHadColon))
        ) {
          previous.description = [
            previous.description,
            `${block.name}: ${block.description}`,
          ]
            .filter(Boolean)
            .join('\n\n');
          continue;
        }
        items.push({
          name: block.name,
          description: block.description,
          tables: tablesOf(block),
        });
        openItemHadColon = block.hadColon;
        owner.catalog.items = items;
        continue;
      }

      if (owner.list) {
        asTalent(block, owner.list.group ? owner.list : undefined);
        continue;
      }

      // Dentro do spoiler do arquétipo tudo é habilidade dele, inclusive o
      // que vem com dois-pontos: ali a grafia marca o detalhe de uma
      // habilidade ("Incorpóreo:", "Estatísticas do Espectro:"), não um
      // talento. Um detalhe desses é anexado à habilidade anterior em vez de
      // virar irmã dela — senão o seletor da ficha ofereceria como escolha um
      // parágrafo explicativo.
      const archetypeFeatures = owner.archetype?.features;
      const previous = archetypeFeatures?.[archetypeFeatures.length - 1];
      if (block.hadColon && previous) {
        previous.description = [
          previous.description,
          `${block.name}: ${block.description}`,
        ]
          .filter(Boolean)
          .join('\n\n');
        continue;
      }

      archetypeFeatures?.push({
        name: block.name,
        level: block.level,
        description: block.description,
        tables: tablesOf(block),
      });
    }
  }

  // Reconciliação: dos nomes que a TABELA anuncia, quantos têm descrição?
  //
  // É a única medida objetiva da qualidade do texto extraído, e ela varia
  // enormemente entre os 20 tópicos — de 25/25 no ilusionista a 2/9 no
  // espadachim —, porque foram escritos por pessoas diferentes ao longo de
  // anos e o fórum usa negrito+dois-pontos para tudo. Abaixo do limite, o
  // texto extraído é ruído, e gravá-lo seria pior que não ter nada: a tabela,
  // que é exata, continua entrando de qualquer forma.
  const ghost = /arquetipo|aumento de atributo|talento/;
  // Descrito é descrito, em qualquer um dos três baldes. A pergunta que a
  // medida faz é se o texto do tópico descreve o que a tabela anuncia — e o
  // balde em que o bloco caiu é decisão do parser, não do tópico.
  //
  // O arqueiro é o caso: a tabela anuncia "Movimento Rápido" como
  // característica de nível, e o corpo escreve "Movimento Rápido:" com
  // dois-pontos, que é a assinatura de talento. Contando só `features`, seis
  // características descritas contavam como ausentes.
  // Ambos os lados da comparação usam `stripVersion` para que "EVASÃO (1)"
  // (como o texto o nomeia) case com "Evasão" (como a tabela o anuncia).
  const described = new Set([
    ...features.map((f) => singularOf(stripVersion(f.name))),
    ...talents.map((t) => singularOf(stripVersion(t.name))),
    ...archetypes.flatMap((a) =>
      (a.features ?? []).map((f) => singularOf(stripVersion(f.name)))
    ),
    ...catalogs.flatMap((catalog) => [
      singularOf(stripVersion(catalog.name)),
      ...(catalog.items ?? []).map((item) =>
        singularOf(stripVersion(item.name))
      ),
    ]),
  ]);
  const announcedReal = [...announced].filter((a) => !ghost.test(a));
  const matched = announcedReal.filter((a) => described.has(a)).length;
  const coverage = announcedReal.length ? matched / announcedReal.length : 0;

  const trusted = coverage >= TRUST_THRESHOLD;
  if (!trusted) {
    warnings.push(
      `Texto descartado: só ${matched} de ${announcedReal.length} características anunciadas na tabela foram descritas. A progressão por nível foi importada.`
    );
  }

  if (features.length === 0) warnings.push('Nenhuma característica descrita.');

  // Blocos OBS/nota autoral → contentBlocks['obs'].
  // Blocos de domínio/extensão → contentBlocks['domainFeature'].
  // Blocos em profundidade de spoiler >= 2 fora de arquétipos (progressões de
  // entidade aninhada: avatares, espectros) → contentBlocks['nestedProgression'].
  // Blocos com conteúdo mas sem classificação semântica → contentBlocks['unknown'].
  //
  // Nenhum dado editorial é descartado em silêncio.
  const classifiedNames = new Set([
    ...features.map((f) => f.name),
    ...talents.map((t) => t.name),
    ...archetypes.flatMap((a) => [
      a.name,
      ...(a.features ?? []).map((f) => f.name),
    ]),
    ...catalogs.flatMap((catalog) => [
      catalog.name,
      ...(catalog.items ?? []).map((item) => item.name),
    ]),
  ]);
  const contentBlocks: IContentBlock[] = [];
  for (const b of blocks) {
    if (b.isObs) {
      contentBlocks.push({
        kind: 'obs',
        title: b.name,
        content: b.description,
        post: b.post,
        sourceHint: `post ${b.post}`,
        tables: tablesOf(b),
      });
      continue;
    }
    // Domínios/ordens/extensões de classe: figuram como seção separada no
    // tópico mas não são subclasses (arquétipos). Preservados integralmente.
    if (b.inDomains) {
      contentBlocks.push({
        kind: 'domainFeature',
        title: b.name,
        content: b.description,
        post: b.post,
        sourceHint: `post ${b.post}${b.inSpoiler ? `, spoiler ${b.spoiler}` : ''}`,
        tables: tablesOf(b),
      });
      continue;
    }
    // Progressões de entidade aninhada (avatares do invocador, espectros da
    // Invocadora de Espectros…). São blocos de características que vivem em
    // spoilers de segundo nível OU em spoilers de primeiro nível marcados com
    // "Evolução de X" (o Invocador usa D1, não D2).
    if (
      !b.inArchetypes &&
      (b.spoilerDepth >= 2 || b.inNestedEntity) &&
      !absorbedCatalogBlocks.has(b)
    ) {
      contentBlocks.push({
        kind: 'nestedProgression',
        title: b.name,
        content: b.description,
        post: b.post,
        sourceHint: `post ${b.post}, spoiler depth ${b.spoilerDepth}`,
        tables: tablesOf(b),
      });
      continue;
    }
    // Blocos que não caíram em nenhum balde semântico mas têm conteúdo real.
    if (
      !b.inArchetypes &&
      !classifiedNames.has(b.name) &&
      b.description.length > 40
    ) {
      contentBlocks.push({
        kind: 'unknown',
        title: b.name,
        content: b.description,
        post: b.post,
        sourceHint: `post ${b.post}${b.inSpoiler ? `, spoiler ${b.spoiler}` : ''}`,
        tables: tablesOf(b),
      });
    }
  }

  // Diagnóstico por post: quantos blocos cada post gerou e quais foram classificados.
  const postDiagnostics: IPostDiagnostic[] = [];
  {
    const byPost = new Map<
      number,
      { classified: number; unclassified: number }
    >();
    for (const b of blocks) {
      if (!byPost.has(b.post))
        byPost.set(b.post, { classified: 0, unclassified: 0 });
      const entry = byPost.get(b.post)!;
      if (classifiedNames.has(b.name) || b.isObs) entry.classified++;
      else entry.unclassified++;
    }
    for (const [postIdx, counts] of byPost) {
      postDiagnostics.push({
        post: postIdx,
        extractedBlocks: counts.classified,
        unclassifiedBlocks: counts.unclassified,
        warnings:
          counts.unclassified > 0
            ? [
                `${counts.unclassified} bloco(s) não classificado(s) neste post.`,
              ]
            : [],
      });
    }
    postDiagnostics.sort((a, b) => a.post - b.post);
  }

  // O que não passou na conferência não é mais descartado: fica como
  // candidato, estruturado, para alguém olhar e aceitar ou jogar fora. O texto
  // cru continua junto, porque é ele que permite conferir o que o parser
  // entendeu contra o que o tópico diz.
  const candidate: IClassCandidate | undefined = trusted
    ? undefined
    : {
        reason: `${matched} de ${announcedReal.length} características anunciadas na tabela foram descritas — abaixo do limite de ${Math.round(TRUST_THRESHOLD * 100)}%.`,
        coverage,
        features: features.length ? features : undefined,
        archetypes: archetypes.length ? archetypes : undefined,
        talents: talents.length ? talents : undefined,
        parsedAt: new Date(),
      };

  return {
    name,
    slug: classSlug(name),
    description: overview.description || undefined,
    ...overview.data,
    startingEquipment: overview.equipment.length
      ? overview.equipment
      : undefined,
    levels,
    features: trusted ? features : [],
    archetypes: trusted ? archetypes : [],
    talents: trusted ? talents : [],
    catalogs: trusted ? catalogs : [],
    isSpellcaster: levels.some(
      (l) => l.cantripsKnown !== undefined || (l.spellSlots?.length ?? 0) > 0
    ),
    sourceUrl,
    contentBlocks: contentBlocks.length ? contentBlocks : undefined,
    candidate,
    // O texto que não passou na reconciliação não é jogado fora em silêncio:
    // fica aqui para conferência e para completar a classe pela interface.
    unparsedSections: trusted
      ? undefined
      : [stream.lines.map(unmark).filter(Boolean).join('\n')],
    warnings,
    postDiagnostics: postDiagnostics.length ? postDiagnostics : undefined,
  };
}
