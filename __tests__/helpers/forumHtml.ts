/**
 * Constrói HTML mínimo com a estrutura esperada pelo parser de classes.
 *
 * Os fixtures de teste usam esta função para gerar HTML sintético a partir de
 * dados tabulares, sem depender de um servidor do fórum.
 *
 * A estrutura mínima que o parser necessita:
 *   - `class="content clearfix"` para delimitar cada post
 *   - `<strong>` para negrito
 *   - `<table>` para tabelas de progressão
 *   - `<dl class="codebox spoiler">` para spoilers
 *   - `<h3>Nível N</h3>` para cabeçalhos de nível
 */

/** Uma linha da tabela de progressão. */
export interface ProgressionRow {
  level: number;
  proficiencyBonus: string;
  features: string;
  [extra: string]: string | number;
}

/** Opções para `buildForumHtml`. */
export interface ForumHtmlOptions {
  title: string;
  /** Conteúdo do post de cabeçalho (proficiências, HP etc.) */
  headerContent?: string;
  /** Linhas da tabela de progressão. */
  progressionRows?: ProgressionRow[];
  /** Colunas extras da tabela (além de Nível, Proficiência e Habilidades). */
  extraColumns?: string[];
  /** Posts adicionais como strings de HTML cru. */
  extraPosts?: string[];
  /** Truques mágicos por nível (se spellcaster). */
  cantripColumn?: boolean;
  /** Slots de magia por nível (se spellcaster). */
  slotsColumn?: boolean;
}

function escHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildProgressionTable(
  rows: ProgressionRow[],
  extras: string[] = [],
  cantrips = false,
  slots = false
): string {
  const headers = ['Nível', 'Bônus de Proficiência'];
  if (cantrips) headers.push('Truques Mágicos');
  if (slots) headers.push('Slots de Magia (por círculo)');
  headers.push('Habilidade Ganha');
  headers.push(...extras);

  const headerRow = `<tr>${headers.map((h) => `<th>${escHtml(h)}</th>`).join('')}</tr>`;

  const dataRows = rows
    .map((r) => {
      const cells = [String(r.level), escHtml(String(r.proficiencyBonus))];
      if (cantrips) cells.push(escHtml(String(r.cantripsKnown ?? '')));
      if (slots) cells.push(escHtml(String(r.spellSlots ?? '')));
      cells.push(escHtml(r.features));
      for (const col of extras) {
        cells.push(escHtml(String(r[col] ?? '')));
      }
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`;
    })
    .join('\n');

  return `<table>${headerRow}${dataRows}</table>`;
}

function wrapPost(content: string): string {
  return `<div class="content clearfix">${content}</div>`;
}

/**
 * Monta um HTML de tópico de classe sintético compatível com o parser.
 *
 * O HTML gerado tem a estrutura esperada por `classPostBodies`,
 * `classTopicLines` e `parseProgressionTable`.
 */
export function buildForumHtml(opts: ForumHtmlOptions): string {
  const parts: string[] = [];

  // Título da página (lido por `classNameFromTopic`).
  parts.push(`<title>${escHtml(opts.title)} | Isekai Fantasy</title>`);

  // Post 1: cabeçalho (HP, proficiências etc.)
  const headerPost = opts.headerContent
    ? opts.headerContent
    : `<strong>Dado de Vida:</strong> d8<br/>
       <strong>Pontos de Vida no 1º Nível:</strong> 8 + Constituição<br/>
       <strong>Pontos de Vida nos Níveis Seguintes:</strong> 1d8 + Constituição`;

  parts.push(wrapPost(headerPost));

  // Post 2: tabela de progressão (dentro de spoiler, como no fórum).
  if (opts.progressionRows && opts.progressionRows.length > 0) {
    const table = buildProgressionTable(
      opts.progressionRows,
      opts.extraColumns,
      opts.cantripColumn,
      opts.slotsColumn
    );
    parts.push(
      wrapPost(
        `<strong>Progressão</strong><dl class="codebox spoiler"><dd>${table}</dd></dl>`
      )
    );
  }

  // Posts adicionais (características, arquétipos, talentos).
  for (const extra of opts.extraPosts ?? []) {
    parts.push(wrapPost(extra));
  }

  return parts.join('\n');
}

/**
 * Wrap de um bloco de texto dentro de um spoiler de arquétipo.
 *
 * Simula a estrutura `<nome-fora-do-spoiler> + <dl spoiler> ... </dl>` que o
 * parser espera para arquétipos.
 */
export function archetypePost(name: string, contentHtml: string): string {
  return `<strong>${escHtml(name)}</strong>
<dl class="codebox spoiler"><dd>${contentHtml}</dd></dl>`;
}

/**
 * Bloco de característica simples: nível + negrito + descrição.
 */
export function featureBlock(
  level: number,
  name: string,
  description: string
): string {
  return `<h3>Nível ${level}</h3>\n<strong>${escHtml(name)}</strong>\n<p>${escHtml(description)}</p>`;
}

/**
 * Bloco de talento: negrito com dois-pontos + descrição.
 */
export function talentBlock(
  name: string,
  description: string,
  requirement?: string
): string {
  const fullName = requirement ? `${name} – Requer ${requirement}` : name;
  return `<strong>${escHtml(fullName)}:</strong>\n<p>${escHtml(description)}</p>`;
}
