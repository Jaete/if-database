import type ITalentDoc from '../db/talents/talent.d';
import {
  BOLD_CLOSE,
  BOLD_OPEN,
  SPOILER_OPEN,
  classPostBodies,
  classTopicLines,
} from './classTopic.service';

/**
 * Leitor do tópico de talentos gerais do fórum.
 *
 * O tópico é uma mensagem por CATEGORIA — "Talentos Gerais", "Talento de
 * Combate", "Metacanto", "Talentos de Reserva" —, e dentro de cada uma os
 * talentos vêm num spoiler, com a mesma diagramação do resto do fórum: nome em
 * negrito e `Rótulo: valor` abaixo.
 *
 * Por isso este leitor não usa `classStream`: ela funde as mensagens num fluxo
 * só, e é justamente a fronteira entre elas que carrega a categoria.
 */

/**
 * Os rótulos que o tópico usa, e para onde cada um vai.
 *
 * `oneLine` marca os que terminam na própria linha. Texto solto continua o
 * último rótulo lido — é o que mantém inteiro um benefício de três parágrafos
 * —, mas um pré-requisito nunca transborda: em três das oito categorias o
 * corpo do talento vem logo abaixo dele, sem rótulo nenhum, e sem esta marca
 * o talento inteiro era absorvido pelo pré-requisito.
 */
const FIELDS: readonly {
  label: RegExp;
  key: keyof ITalentDoc;
  oneLine?: boolean;
}[] = [
  { label: /^pre requisitos?$/, key: 'prerequisites', oneLine: true },
  { label: /^beneficios?$/, key: 'benefit' },
  { label: /^normal$/, key: 'normal' },
  { label: /^especial$/, key: 'special' },
  {
    label: /^aumento de (slot|espaco)s?$/,
    key: 'slotIncrease',
    oneLine: true,
  },
];

const ONE_LINE = new Set(
  FIELDS.filter((f) => f.oneLine).map((f) => f.key as string)
);

const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Dobra um rótulo até a forma comparável.
 *
 * O hífen vira espaço porque "pré-requisito" aparece com e sem ele no mesmo
 * tópico; sem isto, o pré-requisito de todas as entradas caía na descrição.
 */
const foldLabel = (text: string) =>
  fold(text)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * A legenda que abre a primeira mensagem.
 *
 * Ela descreve o FORMATO das descrições usando os próprios rótulos
 * ("Nome do Talento:", "Pré-requisito:", "Benefício:"), então, lida como
 * conteúdo, vira um talento fantasma chamado "Nome do Talento". O corte é o
 * primeiro spoiler: toda entrada de verdade está dentro de um.
 */
const LEGEND_LABELS = /^(nome do talento|categoria|tipo|categoria tipo)$/;

const unmark = (line: string) =>
  line.split(BOLD_OPEN).join('').split(BOLD_CLOSE).join('').trim();

/** A linha inteira é negrito — a assinatura de um nome de talento. */
const isBoldLine = (line: string) =>
  line.startsWith(BOLD_OPEN) && line.endsWith(BOLD_CLOSE);

/** Separa "Pré-requisitos: Destreza 13" em rótulo e valor. */
function readLabel(
  line: string
): { key: keyof ITalentDoc; value: string } | null {
  const at = line.indexOf(':');
  if (at <= 0) return null;
  const label = foldLabel(unmark(line.slice(0, at)));
  if (label.length > 24) return null;
  const field = FIELDS.find((f) => f.label.test(label));
  if (!field) return null;

  // Um ")" sem "(" é resto do parêntese que o fórum abriu antes do rótulo
  // ("Pré-requisitos: (Constituição 13, BBA +1)"). Deixá-lo faria toda a
  // categoria de Estilo exibir um fecha-parêntese solto.
  const value = unmark(line.slice(at + 1)).trim();
  const balanced = value.includes('(') ? value : value.replace(/\s*\)\s*$/, '');

  return { key: field.key, value: balanced };
}

/**
 * A linha abre com um `Rótulo:` qualquer, conhecido ou não.
 *
 * Importa porque texto solto continua o último rótulo lido — é assim que um
 * benefício de três parágrafos fica inteiro. Mas um rótulo que este leitor não
 * conhece ("Aumento de PM:", "Benefício secundário:") NÃO é continuação de
 * nada: sem esta distinção ele era anexado ao campo anterior, e o
 * pré-requisito de dezenas de talentos vinha com meio texto grudado.
 */
function looksLabelled(line: string): boolean {
  const at = line.indexOf(':');
  if (at <= 0) return false;
  const label = unmark(line.slice(0, at));
  // Um rótulo é curto e não tem pontuação de frase dentro.
  return label.length <= 28 && !/[.!?;]/.test(label);
}

/**
 * O nome de um talento costuma trazer o tipo entre parênteses — "Canção
 * Autoritária (Metacanto)", "Corrida de Batalha Aérea (Combate)". O parêntese
 * faz parte do nome no fórum e é mantido: é como o jogador procura por ele.
 */
function isTalentName(line: string): boolean {
  if (!isBoldLine(line)) return false;
  const text = unmark(line);
  if (!text || text.length > 80) return false;
  // Um rótulo em negrito não é nome: "Benefício:" abre a linha de muitos
  // talentos já em negrito.
  if (text.endsWith(':')) return false;
  if (LEGEND_LABELS.test(foldLabel(text))) return false;
  return true;
}

export interface IParsedTalent extends Partial<ITalentDoc> {
  name: string;
}

/**
 * Lê uma mensagem do tópico: a categoria e os talentos dela.
 *
 * Tudo antes do primeiro spoiler é descartado — é a prosa de abertura da
 * categoria, que explica a regra do grupo, e a legenda de formato na primeira
 * mensagem. O que ficaria dela é texto sem dono.
 */
function parsePost(lines: string[]): {
  category?: string;
  talents: IParsedTalent[];
} {
  const category = lines.map(unmark).find(Boolean);

  const start = lines.findIndex((line) => line.includes(SPOILER_OPEN));
  if (start < 0) return { category, talents: [] };

  const talents: IParsedTalent[] = [];
  let current: IParsedTalent | null = null;
  // Onde cai texto solto: a continuação do último rótulo lido, ou, antes de
  // qualquer rótulo, a descrição do talento.
  let field: keyof ITalentDoc = 'description';

  const push = (text: string) => {
    if (!current || !text) return;
    const previous = current[field];
    (current as unknown as Record<string, unknown>)[field] =
      typeof previous === 'string' && previous ? `${previous}\n${text}` : text;
  };

  for (const raw of lines.slice(start)) {
    const line = raw.trim();
    if (!line) continue;

    if (isTalentName(line)) {
      current = { name: unmark(line) };
      field = 'description';
      talents.push(current);
      continue;
    }

    if (!current) continue;

    const labelled = readLabel(line);
    if (labelled) {
      field = labelled.key;
      // "Pré-requisitos: —" é a grafia de "nenhum"; guardá-la deixaria um
      // travessão onde a tela espera texto ou nada.
      if (!/^[–—-]+$/.test(labelled.value)) push(labelled.value);
      continue;
    }

    // Rótulo desconhecido: fecha o campo aberto e vai inteiro para a
    // descrição, com o próprio rótulo, que é informação.
    if (looksLabelled(line)) field = 'description';
    // Texto solto depois de um campo de uma linha é o corpo do talento, que
    // naquelas categorias vem sem o rótulo "Benefício:".
    else if (ONE_LINE.has(field))
      field = current.benefit ? 'description' : 'benefit';

    push(unmark(line));
  }

  return { category, talents };
}

/**
 * Todos os talentos gerais de um tópico do fórum.
 *
 * Mensagens sem spoiler nenhum não rendem talento e saem de graça: são a
 * abertura do tópico e os blocos de anúncio que o fórum injeta entre as
 * mensagens.
 */
export function parseTalentTopic(
  html: string,
  sourceUrl: string
): IParsedTalent[] {
  const out: IParsedTalent[] = [];

  for (const raw of classPostBodies(html)) {
    const post = raw.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    if (!/<(strong|b)\b/i.test(post)) continue;

    const { category, talents } = parsePost(classTopicLines(post));
    for (const talent of talents) {
      // Um nome sozinho é cabeçalho mal lido, não talento: entrar assim
      // sujaria o catálogo. Qualquer campo preenchido basta — há categorias
      // inteiras escritas sem o rótulo "Benefício:", em prosa corrida.
      const hasBody = Object.entries(talent).some(
        ([key, value]) => key !== 'name' && typeof value === 'string' && value
      );
      if (!hasBody) continue;
      out.push({ ...talent, category, sourceUrl });
    }
  }

  return out;
}
