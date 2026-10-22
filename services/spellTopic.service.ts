import type ISpell from '../db/spells/spell.d';

/**
 * Lê um tópico de magias do fórum (ex.: "1º Círculo") e devolve uma magia por
 * bloco.
 *
 * Por que um parser próprio, e não o de fichas: um tópico de magias não tem
 * seções nem rótulos de ficha, tem só uma lista longa de blocos repetidos. O
 * que os dois compartilham é a ideia de converter o HTML em linhas marcando o
 * que veio de <strong>, porque é o negrito que separa o nome da magia do corpo
 * dela.
 */

/** O que o parser sabe extrair. Todo o resto fica na descrição. */
const FIELD_LABELS: { label: string; key: keyof ISpell }[] = [
  { label: 'escola', key: 'school' },
  { label: 'classes', key: 'classes' },
  { label: 'tempo de conjuracao', key: 'castingTime' },
  { label: 'alcance', key: 'range' },
  { label: 'componentes', key: 'components' },
  { label: 'duracao', key: 'duration' },
  { label: 'alvo ou area', key: 'target' },
  { label: 'alvos', key: 'target' },
  { label: 'alvo', key: 'target' },
  { label: 'area', key: 'area' },
  { label: 'efeito', key: 'effect' },
  { label: 'teste de resistencia', key: 'save' },
  { label: 'resistencia a magia', key: 'spellResistance' },
  { label: 'resistencia', key: 'save' },
  { label: 'uso', key: 'use' },
];

// Rótulos que, logo abaixo de uma linha em negrito solta, confirmam que aquela
// linha era o nome de uma magia.
const OPENING_LABELS = new Set([
  'escola',
  'classes',
  'tempo de conjuracao',
  'alcance',
]);

const DESCRIPTION_LABEL = 'descricao';

// Marca as linhas (ou trechos) que vieram de <strong>.
const BOLD = '\u0000B';

/**
 * Dobra acentos e caixa preservando o comprimento, um caractere por
 * caractere.
 *
 * O `normalize('NFD').replace(marcas, '')` usual muda os índices da string, e
 * aqui eles são usados para recortar o texto original — que precisa manter os
 * acentos. Como toda decomposição começa pela letra base, pegar o primeiro
 * caractere de cada uma mantém a correspondência 1:1.
 */
export const foldKeepingLength = (text: string): string =>
  Array.from(text)
    .map((char) => char.normalize('NFD')[0].toLowerCase())
    .join('');

/** Converte o HTML do tópico em linhas, preservando a marca de negrito. */
export function spellTopicLines(html: string): string[] {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|dd|dt|li|tr|td|h[1-6])>/gi, '\n');

  const marked = withBreaks.replace(
    /<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi,
    (_match, _tag, inner: string) => BOLD + inner.replace(/<[^>]+>/g, '')
  );

  return marked
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) => decodeEntities(line).replace(/\s+/g, ' ').trim());
}

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

interface Field {
  key: keyof ISpell;
  value: string;
  /**
   * O rótulo vinha seguido de ":".
   *
   * É o que separa um campo de verdade do nome de magia que por acaso é um
   * rótulo — "Resistência" é as duas coisas, e sem o dois-pontos não há como
   * saber qual delas está escrita ali.
   */
  labelled: boolean;
}

/**
 * Lê os pares `Rótulo: valor` de uma linha.
 *
 * Três variações do fórum obrigam a procurar o rótulo pelo texto em vez de
 * confiar no negrito: o `:` às vezes fica fora do <strong> ("<strong>Escola</
 * strong> cronomancia"), o segundo rótulo da linha às vezes não é negrito
 * nenhum ("...anula; Resistência à Magia: sim"), e duas magias por linha vêm
 * separadas por ";".
 */
export function readFields(line: string): Field[] {
  // O marcador de negrito vira espaço em vez de sumir: a dobra precisa manter
  // o mesmo comprimento da linha original, que é de onde os valores são
  // recortados.
  const folded = foldKeepingLength(line).replace(/\u0000b/g, '  ');
  const found: {
    at: number;
    after: number;
    key: keyof ISpell;
    labelled: boolean;
  }[] = [];

  for (const { label, key } of FIELD_LABELS) {
    let from = 0;
    for (;;) {
      const at = folded.indexOf(label, from);
      if (at === -1) break;
      from = at + label.length;

      // Um rótulo só vale no começo de um trecho — início da linha ou logo
      // depois de um ";". Sem isso, "resistência" casaria dentro do valor de
      // outro campo ou no meio da prosa.
      const separator = folded.slice(0, at).match(/(^|[;/])\s*$/);
      if (!separator) continue;
      // Algumas magias usam "/" no lugar do ";" para separar dois campos
      // ("Escola: Aprimoramento / Classes: Mago Negro"). Só que "/" também é
      // legítimo dentro de um valor ("invocação/elemental"), então depois dele
      // o rótulo só conta quando vem acompanhado de dois-pontos.
      if (separator[1] === '/' && folded[from] !== ':') continue;

      const gap = folded.slice(from).match(/^\s*:?\s*/)?.[0] ?? '';
      found.push({
        at,
        after: from + gap.length,
        key,
        labelled: gap.includes(':'),
      });
      break;
    }
  }

  found.sort((a, b) => a.at - b.at);

  // Rótulos contidos em outros ("resistência" dentro de "resistência a
  // magia") caem aqui: a lista está ordenada do mais longo para o mais curto,
  // então o mais específico já ocupou a posição.
  const kept = found.filter(
    (field, i) => i === 0 || field.at >= found[i - 1].after
  );

  return kept.map((field, i) => {
    const end = i + 1 < kept.length ? kept[i + 1].at : line.length;
    const value = line
      .slice(field.after, end)
      .replace(/\u0000B/g, '')
      .replace(/[;/\s]+$/, '')
      .trim();
    return { key: field.key, value, labelled: field.labelled };
  });
}

const isBold = (line: string) => line.startsWith(BOLD);

/**
 * A linha abre a ficha de uma magia, mesmo sem dois-pontos.
 *
 * Existe porque o fórum às vezes deixa o ":" fora do <strong>, e às vezes não
 * o escreve — "Escola cronomancia". Sem isto, uma linha dessas passaria pelo
 * teste de nome de magia e viraria uma magia chamada "Escola".
 */
const startsWithOpeningLabel = (text: string) => {
  const folded = foldKeepingLength(text);
  return FIELD_LABELS.some(
    ({ label }) => OPENING_LABELS.has(label) && folded.startsWith(label)
  );
};
const unmark = (line: string) => line.replace(/\u0000B/g, '').trim();

/** Linha em negrito que é só um divisor ("EFEITO", "DESCRIÇÃO"). */
const isDivider = (text: string) =>
  text.length < 24 && text === text.toUpperCase() && /[A-ZÀ-Ü]/.test(text);

/**
 * Extrai as magias de um tópico já baixado.
 *
 * O limite entre uma magia e a seguinte é o ponto mais frágil daqui: nomes são
 * só texto em negrito, e as descrições também têm negrito no meio. O que
 * desempata é a vizinhança — um nome é seguido, em poucas linhas, por Escola,
 * Classes, Tempo de Conjuração ou Alcance. Testado contra o tópico do 1º
 * círculo, isso encontra exatamente as 198 magias que o tópico tem.
 */
export function parseSpellTopic(
  html: string,
  circle: number,
  sourceUrl?: string
): Partial<ISpell>[] {
  const lines = spellTopicLines(html);
  const spells: Partial<ISpell>[] = [];

  let current: Partial<ISpell> | null = null;
  let description: string[] = [];
  let inDescription = false;

  const flush = () => {
    if (current) {
      const text = description
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (text) current.description = text;
      spells.push(current);
    }
    // Zerado mesmo sem magia corrente: um bloco não reconhecido no começo do
    // tópico deixava `inDescription` ligado, e a magia seguinte engolia os
    // próprios campos como se fossem texto.
    current = null;
    description = [];
    inDescription = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      if (inDescription) description.push('');
      continue;
    }

    const plain = unmark(line);
    const fields = readFields(line);
    const foldedHead = foldKeepingLength(plain)
      .replace(/\s*:.*$/, '')
      .trim();

    // Começo da descrição: tudo daqui até a próxima magia é texto corrido.
    if (foldedHead === DESCRIPTION_LABEL) {
      inDescription = true;
      const after = plain.replace(/^[^:]*:?\s*/, '').trim();
      if (after) description.push(after);
      continue;
    }

    // Nome de magia: negrito solto, sem campo escrito, confirmado pela
    // vizinhança.
    //
    // O que desqualifica a linha é o campo ROTULADO ("Escola: ..."), e não o
    // rótulo reconhecido dentro dela: há magias cujo nome é um rótulo —
    // "Resistência" é também o rótulo do teste de resistência —, e exigir
    // `fields.length === 0` fazia o tópico inteiro perdê-las, com os campos e
    // a descrição caindo dentro da magia anterior.
    const looksLikeField =
      fields.some((field) => field.labelled) || startsWithOpeningLabel(plain);

    if (isBold(line) && !looksLikeField && !isDivider(plain)) {
      // Só a PRIMEIRA linha não vazia vale como confirmação. Olhar algumas
      // linhas adiante parece mais tolerante, mas passa por cima do nome
      // verdadeiro e enxerga o "Escola:" da magia seguinte — o que promovia a
      // parágrafos em negrito dentro da descrição ("Nota:", "Usado como
      // terceiro slot:") a magias próprias.
      const next = lines.slice(i + 1).find(Boolean);
      const key = next ? readFields(next)[0]?.key : undefined;
      const opens =
        !!key &&
        FIELD_LABELS.some((f) => f.key === key && OPENING_LABELS.has(f.label));
      if (opens) {
        flush();
        current = { name: plain, circle, sourceUrl };
        continue;
      }
    }

    if (!current) continue;

    if (fields.length > 0 && !inDescription) {
      for (const { key, value } of fields) {
        // O primeiro valor vence: um rótulo repetido mais abaixo costuma ser
        // uma variante do mesmo campo, não uma correção.
        if (value && current[key] === undefined) {
          (current as Record<string, unknown>)[key] = value;
        }
      }
      continue;
    }

    if (inDescription) description.push(plain);
  }

  flush();
  return spells.filter((spell) => spell.name);
}
