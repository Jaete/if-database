/**
 * Resume o texto de incremento de atributo de uma raça em chips curtos.
 *
 * O banco guarda a frase do tópico ("Seu valor de Constituição aumenta em +2
 * e sua força aumenta em 1."), e a listagem precisa de "CON +2 · FOR +1".
 * Função pura: roda no servidor e no cliente.
 */

export interface IAbilityChip {
  label: string;
  /** `fixed` é um atributo certo ("CON +2"); `free` é texto ("+1 em 2 à escolha"). */
  kind: 'fixed' | 'free';
}

const ABILITIES: readonly { code: string; pattern: string }[] = [
  { code: 'FOR', pattern: 'forca|for' },
  { code: 'DES', pattern: 'destreza|dex' },
  { code: 'CON', pattern: 'constituicao|con' },
  { code: 'INT', pattern: 'inteligencia|int' },
  { code: 'SAB', pattern: 'sabedoria|sab' },
  { code: 'CAR', pattern: 'carisma|car' },
];

const COUNT_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
};

const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const NUMBER = '\\+?(\\d+)';

export function abilityChips(text: string | undefined): IAbilityChip[] {
  if (!text?.trim()) return [];
  const source = normalize(text);
  const found = new Map<string, { value: number; at: number }>();

  // "+2 em dex": o número vem antes do atributo.
  for (const { code, pattern } of ABILITIES) {
    const before = new RegExp(
      `${NUMBER}\\s+(?:pontos?\\s+)?em\\s+(?:${pattern})\\b`
    );
    const match = source.match(before);
    if (match) {
      found.set(code, { value: Number(match[1]), at: match.index ?? 0 });
    }
  }

  // "Constituição aumenta em +2": o número vem depois do verbo.
  for (const { code, pattern } of ABILITIES) {
    if (found.has(code)) continue;
    const after = new RegExp(
      `\\b(?:${pattern})\\b(?:\\s+\\w+){0,3}?\\s+aument\\w+\\s+em\\s+${NUMBER}`
    );
    const match = source.match(after);
    if (match) {
      found.set(code, { value: Number(match[1]), at: match.index ?? 0 });
    }
  }

  if (found.size > 0) {
    // Na ordem em que o texto cita: é a ordem de importância que o tópico deu.
    return [...found.entries()]
      .sort(([, a], [, b]) => a.at - b.at)
      .map(([code, { value }]) => ({
        label: `${code} +${value}`,
        kind: 'fixed',
      }));
  }

  // Sem atributo fixo: "escolha dois valores…", "Dois de seus valores…".
  const countMatch = source.match(
    /\b(um|uma|dois|duas|tres|quatro|\d)\b[^.]*?\b(valor|valores|atributo|atributos|habilidade|habilidades)\b/
  );
  if (!countMatch) return [];
  const count = COUNT_WORDS[countMatch[1]] ?? Number(countMatch[1]);
  const amountMatch = source.match(/(?:aument\w+\s+em|adicione|\+)\s*(\d+)/);
  const amount = amountMatch ? Number(amountMatch[1]) : 1;
  return [{ label: `+${amount} em ${count} à escolha`, kind: 'free' }];
}
