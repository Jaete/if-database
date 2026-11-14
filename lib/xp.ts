// Tabela de experiência e contas de nível, num módulo só: o servidor valida com
// ela e a ficha mostra a prévia com a mesma. Sem banco, sem React.

/**
 * XP para o PRÓXIMO nível, pelo nível atual (tópico "Evolução de Personagem").
 * Índice = nível atual; o 0 existe só para alinhar.
 */
export const XP_TO_NEXT: readonly number[] = [
  0, 500, 1000, 1500, 1750, 2250, 2750, 3250, 3750, 4250, 5000, 6000, 7000,
  9500, 12500, 16000, 20000, 25000, 50000, 70000, 100000,
];

/**
 * Último nível que existe. Acima dele a XP continua acumulando: quando um dia
 * houver nível 21, basta subir este número e a tabela, e quem já tiver XP
 * suficiente sobe sozinho.
 */
export const MAX_LEVEL = 20;

/** XP de `level` para `level + 1`; `null` quando não há próximo nível. */
export const xpToNext = (level: number): number | null =>
  level >= MAX_LEVEL || !XP_TO_NEXT[level] ? null : XP_TO_NEXT[level];

/**
 * O nível ALCANÇADO. `pool` é a XP contada a partir do início do nível
 * SELADO (`level`), e por isso pode ser maior que a do próximo nível: a sobra
 * de uma concessão passa adiante e uma concessão pode cobrir vários níveis.
 * XP negativa nunca baixa o nível.
 */
export function earnedLevel(level: number, pool: number): number {
  let l = Math.max(1, Math.floor(level));
  let rest = pool;
  while (l < MAX_LEVEL) {
    const need = xpToNext(l);
    if (need === null || rest < need) break;
    rest -= need;
    l += 1;
  }
  return l;
}

/**
 * Onde a barra está: XP dentro do nível alcançado e quanto ele pede.
 * `needed` é `null` no teto. No teto, `into` é toda a XP acumulada.
 */
export function xpProgress(level: number, pool: number) {
  const earned = earnedLevel(level, pool);
  let into = pool;
  for (let l = level; l < earned; l += 1) into -= xpToNext(l) ?? 0;
  return { earned, into, needed: xpToNext(earned), pending: earned - level };
}

/** XP de uma criatura: 200, ±50 por nível de diferença, mínimo 20. */
export const creatureXp = (creatureLevel: number, sealedLevel: number) =>
  Math.max(20, 200 + 50 * (creatureLevel - sealedLevel));

/** Raide: 5.000 divididos entre os participantes, mais 500 por dia no jogo. */
export const raidXp = (participants: number, days: number) =>
  Math.round(5000 / Math.max(1, participants)) + 500 * Math.max(0, days);

/** Torneio: 250 por rodada vencida, mais 1.000 ao campeão. */
export const tournamentXp = (rounds: number, champion: boolean) =>
  250 * Math.max(0, rounds) + (champion ? 1000 : 0);

export interface IXpPreset {
  kind: string;
  name: string;
  value: number;
  line: string;
  /** Rótulo grande do cartão (o rank da missão). */
  big?: string;
}

const preset = (
  kind: string,
  name: string,
  value: number,
  line: string,
  big?: string
): IXpPreset => ({ kind, name, value, line, ...(big ? { big } : {}) });

/** As fontes rápidas das tabelas do fórum, por aba do recibo. */
export const XP_PRESETS: Record<string, IXpPreset[]> = {
  missoes: (
    [
      ['S', 3000],
      ['A', 1500],
      ['B', 1000],
      ['C', 750],
      ['D', 500],
      ['E', 250],
      ['F', 100],
    ] as const
  ).map(([r, v]) => preset('Missão', `Rank ${r}`, v, `Missão rank ${r}`, r)),
  exploracao: [
    preset('Exploração', 'Simples', 100, 'Exploração simples'),
    preset('Exploração', 'Perigosa', 500, 'Exploração perigosa'),
    preset('Trama', 'Mini-missão', 250, 'Trama / mini-missão'),
    preset('Ruínas', 'Ruínas', 750, 'Ruínas'),
  ],
  masmorra: [
    preset('Masmorra', 'Base', 500, 'Masmorra (base)'),
    preset('Masmorra', 'Mini-chefe', 1000, 'Mini-chefe de masmorra'),
    preset('Masmorra', 'Chefe', 2000, 'Chefe de masmorra'),
  ],
  portais: [
    preset('Portal', 'Fácil', 500, 'Portal fácil'),
    preset('Portal', 'Médio', 1500, 'Portal médio'),
    preset('Portal', 'Difícil', 3000, 'Portal difícil'),
    preset('Portal', 'Estratégico', 2000, 'Portal estratégico'),
  ],
  eventos: [
    preset('Evento menor', '100', 100, 'Evento menor'),
    preset('Evento menor', '250', 250, 'Evento menor'),
    preset('Evento menor', '500', 500, 'Evento menor'),
    preset('Evento grande', '1.000', 1000, 'Evento grande'),
    preset('Evento grande', '2.500', 2500, 'Evento grande'),
    preset('Evento grande', '5.000', 5000, 'Evento grande'),
  ],
};

export const XP_CATEGORIES: readonly (readonly [string, string])[] = [
  ['missoes', 'Missões'],
  ['criaturas', 'Criaturas'],
  ['exploracao', 'Exploração'],
  ['masmorra', 'Masmorra'],
  ['raide', 'Raide'],
  ['portais', 'Portais'],
  ['eventos', 'Eventos'],
  ['correcao', 'Correção'],
];

/** Formata com separador de milhar pt-BR; negativo com o sinal de menos. */
export const formatXp = (n: number): string =>
  n < 0
    ? `−${Math.round(-n).toLocaleString('pt-BR')}`
    : Math.round(n).toLocaleString('pt-BR');
