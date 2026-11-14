// Listas de escolha da classe ("Técnicas de Investida", "Formas de Fúria"…):
// o cronograma de quantas escolhas cada nível dá. Puro, sem banco: o servidor
// valida o selo com ele e o editor da classe o mostra.
//
// O cronograma vem do TEXTO da lista (ela escreve "No 2º nível e a cada dois
// níveis subsequentes…") e pode ser corrigido na lista: `pickLevels`,
// `picksPerLevel`, `requiresArchetype` e `pickable` valem no lugar da leitura.

export const MAX_CLASS_LEVEL = 20;

const fold = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
};
const num = (word: string) => WORDS[word] ?? (Number(word) || 0);

/**
 * Os níveis em que a lista dá escolhas; um nível repetido dá mais de uma
 * ("duas Artes Divinas no 7º" → `[7, 7, …]`). Texto sem cronograma devolve `[]`.
 *
 * Frases lidas:
 *   - "No 2º nível e a cada dois níveis" / "A partir do 6º nível, e a cada
 *     três níveis" / "…outro a cada 2 níveis após o 2º": início e passo;
 *   - "…nos níveis 5, 10, 15 e 20" depois de um início: lista explícita;
 *   - "ganha duas … no 7º nível e mais uma a cada três níveis": o início
 *     rende mais de uma.
 * "A cada dois níveis" SEM início fica sem cronograma (a classe corrige).
 */
export function parsePickSchedule(description?: string | null): number[] {
  const text = fold(description ?? '');
  const start = /\b(?:a partir d[oa]|no|na)\s+(\d{1,2})\S{0,2}\s+nivel/.exec(
    text
  );
  if (!start) return [];
  const first = Number(start[1]);
  if (first < 1 || first > MAX_CLASS_LEVEL) return [];

  // O início pode render mais de uma escolha: "ganha duas Artes Divinas no 7º".
  const many = new RegExp(
    `\\b(duas|dois|tres|\\d+)\\b[^.]{0,40}?\\bno\\s+${first}\\S{0,2}\\s+nivel`
  ).exec(text);
  const startCount = many ? Math.max(1, num(many[1])) : 1;

  const list =
    /\bnos?\s+niveis?\s+(\d{1,2}(?:\s*,\s*\d{1,2})*(?:\s+e\s+\d{1,2})?)/.exec(
      text
    );
  const step = /\ba cada\s+(\w+)\s+niveis?/.exec(text);

  const levels: number[] = Array(startCount).fill(first);
  if (list) {
    for (const n of list[1].split(/\s*,\s*|\s+e\s+/)) {
      const level = Number(n);
      if (level > first && level <= MAX_CLASS_LEVEL) levels.push(level);
    }
  } else if (step && num(step[1]) > 0) {
    for (
      let l = first + num(step[1]);
      l <= MAX_CLASS_LEVEL;
      l += num(step[1])
    ) {
      levels.push(l);
    }
  }
  return levels;
}

export interface ICatalogPickConfig {
  description?: string;
  kind?: string;
  pickable?: boolean;
  pickLevels?: number[];
  picksPerLevel?: number;
  requiresArchetype?: string;
}

/** O cronograma que vale: a correção da lista, ou a leitura do texto. */
export function pickLevelsOf(catalog: ICatalogPickConfig): number[] {
  if (catalog.kind === 'relacao') return [];
  const base =
    catalog.pickLevels && catalog.pickLevels.length > 0
      ? catalog.pickLevels.filter((l) => l >= 1 && l <= MAX_CLASS_LEVEL)
      : parsePickSchedule(catalog.description);
  const per = Math.max(1, Math.floor(catalog.picksPerLevel ?? 1));
  return base.flatMap((l) => Array<number>(per).fill(l));
}

/** A lista é de escolha? `pickable` explícito vence; senão, se há cronograma. */
export function isPickable(catalog: ICatalogPickConfig): boolean {
  if (catalog.pickable !== undefined) {
    return catalog.pickable && pickLevelsOf(catalog).length > 0;
  }
  return pickLevelsOf(catalog).length > 0;
}

/** Quantas escolhas a lista dá NESTE nível. */
export const picksDueAt = (catalog: ICatalogPickConfig, level: number) =>
  isPickable(catalog)
    ? pickLevelsOf(catalog).filter((l) => l === level).length
    : 0;

/** Uma linha por nível, para o editor da classe e o relatório. */
export const describeSchedule = (catalog: ICatalogPickConfig): string => {
  const counts = new Map<number, number>();
  for (const l of pickLevelsOf(catalog))
    counts.set(l, (counts.get(l) ?? 0) + 1);
  return [...counts]
    .map(([l, c]) => (c > 1 ? `${l}×${c}` : String(l)))
    .join(', ');
};

/** O que o jogador escolheu: guardado na ficha. */
export interface ICatalogPick {
  catalog: string;
  item: string;
  level: number;
}

/** Prefixo do item de texto livre ("Outro tipo de Atuação: Dança"). */
export const FREE_TEXT_MAX = 60;
