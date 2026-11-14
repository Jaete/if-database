import type {
  IClassFeature,
  IClassLevel,
  ITalent,
} from '../db/classes/class.d';
import type { ITalentSlots } from '../db/citizens/citizen.d';

/**
 * Os marcos de talento de uma classe.
 *
 * Sem banco: recebe a classe já carregada, para a ficha usar o mesmo cálculo no
 * cliente enquanto o jogador edita o nível.
 *
 * Há dois tipos de vaga, e a regra do jogo os separa:
 *
 *   - `general`: o nível em que a tabela diz "+2 em um atributo ou +1 em dois
 *     atributos ou um Talento", e as células que são só "Talento". Ali o
 *     personagem escolhe um talento GERAL ou da própria classe (ou, no caso do
 *     marco de atributos, atributos — a ficha grava qual dos dois em
 *     `talentMilestones`).
 *   - `classOnly`: o nível em que a classe, por conta própria, concede um
 *     talento só dela ("Talentos de Necromancia", "Talento de Monge"). A fonte
 *     da verdade é o TEXTO da característica ("No 2º nível e a cada dois níveis
 *     subsequentes…"); a tabela só traz o primeiro nível. Sem texto legível,
 *     valem os níveis da tabela. `talentLevels` na classe vence os dois.
 *
 * Uma concessão com mais de uma opção em que o talento é UMA delas ("Habilidade
 * de Arquétipo ou Talento", "Talento de Ladrão ou Evasão") é escolha do jogador
 * contra outra coisa, e a ficha não sabe o que ele pegou: não vira vaga.
 */

const MAX_LEVEL = 20;

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const TALENT = /talent/i;
const ATTRIBUTE = /atributo/i;

/** "Talentos de Necromancia", "Talento de canção", "Talentos" — mas não "Talento". */
const CLASS_TALENT_GRANT = /^talentos(\s|$)|^talento\s+(de|do|da|dos|das)\s/i;

/** Uma opção que é só "Talento"/"um Talento", sem dizer de quê: vaga geral. */
const PLAIN_TALENT = /^(um\s+)?talento\.?$/i;

const NUMBER_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
};

const toNumber = (word: string) => {
  const n = Number(word);
  return Number.isFinite(n) ? n : NUMBER_WORDS[word];
};

/** A característica que descreve a concessão de talentos da classe. */
export function classTalentFeature(
  features: IClassFeature[] | undefined
): IClassFeature | undefined {
  return (features ?? []).find(
    (f) => /^talentos?\b/i.test(fold(f.name).trim()) && f.description
  );
}

/**
 * Os níveis em que a característica concede um talento, lidos do texto.
 * `undefined` quando o texto não deixa claro (o chamador cai na tabela).
 *
 * Reconhece:
 *   - "No 2º nível e a cada dois níveis (subsequentes|seguintes|thereafter|…)"
 *   - "A partir do 6º nível e a cada dois níveis de druida subsequentes"
 *   - "A partir do 2º nível … a cada 2 níveis de arqueiro após o 2º"
 *   - "nos níveis 2, 5 e 8"
 *   - "No 5º nível, … recebe um talento" (um só)
 * e o teto "(máximo 9 talentos)".
 */
export function scheduleFromText(
  text: string,
  fallbackStart?: number
): number[] | undefined {
  const s = fold(text);

  const list = s.match(/niveis\s+(\d+(?:\s*(?:,|e)\s*\d+)+)/);
  if (list) {
    const levels = list[1].match(/\d+/g)?.map(Number) ?? [];
    return levels.filter((l) => l >= 1 && l <= MAX_LEVEL);
  }

  const start =
    s.match(
      /(?:\bno|a partir do|a partir de|ao atingir o)\s+(\d+)\s*[ºo°]?\s*nivel/
    )?.[1] ??
    s.match(/apos o\s+(\d+)\s*[ºo°]?/)?.[1] ??
    (fallbackStart ? String(fallbackStart) : undefined);
  if (!start) return undefined;
  const first = Number(start);

  const everyMatch = s.match(
    /a cada\s+(\d+|um|uma|dois|duas|tres|quatro|cinco|seis)\s+nive(?:l|is)/
  );
  const every = everyMatch ? toNumber(everyMatch[1]) : undefined;
  if (!everyMatch) return [first];
  if (!every || every < 1) return undefined;

  const cap = s.match(/maximo\s+(?:de\s+)?(\d+)\s+talentos?/);
  const max = cap ? Number(cap[1]) : Infinity;

  const levels: number[] = [];
  for (let l = first; l <= MAX_LEVEL && levels.length < max; l += every) {
    levels.push(l);
  }
  return levels;
}

type ClassForSlots = {
  levels?: IClassLevel[];
  features?: IClassFeature[];
  talents?: ITalent[];
  talentLevels?: number[];
};

export interface ITalentSchedule {
  general: number[];
  classOnly: number[];
  /** De onde saíram os níveis da classe: útil na conferência e no relatório. */
  source: 'override' | 'text' | 'table' | 'none';
}

const TABLE_ROWS = (levels: IClassLevel[] | undefined) =>
  [...(levels ?? [])].sort((a, b) => a.level - b.level);

/** Os níveis de vaga geral, lidos da tabela. */
function generalLevels(rows: IClassLevel[]): number[] {
  const general: number[] = [];
  for (const row of rows) {
    // O marco geral pode vir da coluna de atributos ou, quando a tabela não a
    // tem (Monge), da célula de características: "+2 em Atributo | Talento".
    const fromColumn = TALENT.test(row.abilityScoreIncrease ?? '');
    const fromGrants = (row.grants ?? []).some(
      (grant) =>
        grant.options.length > 1 &&
        grant.options.some((o) => ATTRIBUTE.test(o.name)) &&
        grant.options.some((o) => TALENT.test(o.name))
    );
    // "Talento" sozinho na tabela (Bardo 10, 18, 20): vaga geral, não da classe.
    const plain = (row.grants ?? []).some(
      (grant) =>
        grant.options.length === 1 &&
        !grant.options[0].requiresPrerequisite &&
        PLAIN_TALENT.test(grant.options[0].name.trim())
    );
    if (fromColumn || fromGrants) general.push(row.level);
    if (plain) general.push(row.level);
  }
  return general;
}

/** Os níveis de vaga da classe pelas concessões da tabela (plano B). */
function classLevelsFromTable(rows: IClassLevel[]): number[] {
  const levels: number[] = [];
  for (const row of rows) {
    for (const grant of row.grants ?? []) {
      if (grant.options.length !== 1) continue;
      const [option] = grant.options;
      if (option.requiresPrerequisite) continue;
      const name = option.name.trim();
      if (ATTRIBUTE.test(name) || !CLASS_TALENT_GRANT.test(name)) continue;
      levels.push(row.level);
    }
  }
  return levels;
}

export function talentScheduleOf(klass: ClassForSlots): ITalentSchedule {
  const rows = TABLE_ROWS(klass.levels);
  const general = generalLevels(rows);
  const hasList = (klass.talents ?? []).length > 0;

  const override = (klass.talentLevels ?? []).filter(
    (n) => Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL
  );
  if (override.length > 0) {
    return {
      general,
      classOnly: [...override].sort((a, b) => a - b),
      source: 'override',
    };
  }

  // Uma classe sem lista de talentos não tem o que oferecer numa vaga só dela.
  if (!hasList) return { general, classOnly: [], source: 'none' };

  const feature = classTalentFeature(klass.features);
  const tableLevels = classLevelsFromTable(rows);
  if (feature?.description) {
    const fromText = scheduleFromText(
      feature.description,
      feature.level ?? tableLevels[0]
    );
    if (fromText && fromText.length > 0) {
      return { general, classOnly: fromText, source: 'text' };
    }
  }
  return {
    general,
    classOnly: tableLevels,
    source: tableLevels.length > 0 ? 'table' : 'none',
  };
}

export function talentSlotsOf(
  klass: ClassForSlots
): Pick<ITalentSlots, 'general' | 'classOnly'> {
  const { general, classOnly } = talentScheduleOf(klass);
  return { general, classOnly };
}

/**
 * A característica de talentos da classe proíbe repetir? "Um bardo não pode
 * selecionar o mesmo talento mais de uma vez", "cada talento só pode ser
 * escolhido uma vez". O texto do próprio talento e o campo `stackable` dele
 * vencem esta regra (quem a usa decide a ordem).
 */
const NO_REPEAT = [
  /nao pode (?:escolher|selecionar|pegar|adquirir) o mesmo talento(?: individual)? mais de uma vez/,
  /nao pode (?:escolher|selecionar) o mesmo talento/,
  /cada talento so pode ser escolhido uma vez/,
  /um talento individual nao pode ser escolhido mais de uma vez/,
];

export function classForbidsRepeatedTalent(
  features: IClassFeature[] | undefined
): boolean {
  const feature = classTalentFeature(features);
  if (!feature?.description) return false;
  const text = fold(feature.description);
  return NO_REPEAT.some((re) => re.test(text));
}
