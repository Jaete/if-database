/**
 * Em que nível uma habilidade de arquétipo fica disponível.
 *
 * O nível gravado (`level`, vindo da tabela do arquétipo no tópico) vence. Sem
 * ele, vale o que a PRIMEIRA FRASE da descrição diz — "No 5º nível, …",
 * "A partir do 18º nível, …", "Um gladiador de pelo menos 5º nível …",
 * "… de 15º nível ou superior …", "Nos níveis 15 e 17, …". Só a primeira
 * frase, porque o resto do texto costuma citar outros níveis que não são o de
 * destrave ("aumenta em 1 a cada cinco níveis após o 5º").
 *
 * `null` = sem nível: habilidades de lista livre (os truques do Caçador, por
 * exemplo), que valem desde que o arquétipo é escolhido.
 */
export function archetypeFeatureLevel(feature: {
  level?: number | null;
  description?: string | null;
}): number | null {
  if (typeof feature.level === 'number' && feature.level > 0) {
    return feature.level;
  }
  const first = (feature.description ?? '').split(/(?<=[.!?:])\s/)[0] ?? '';
  const match =
    first.match(/(\d{1,2})\s*[ºo°]?\s*n[íi]vel/i) ??
    first.match(/n[íi]veis\s+(\d{1,2})/i);
  const level = match ? Number(match[1]) : NaN;
  return Number.isInteger(level) && level >= 1 && level <= 30 ? level : null;
}

/** A habilidade já pode ser escolhida por um personagem deste nível? */
export const archetypeFeatureOpen = (
  feature: { level?: number | null; description?: string | null },
  characterLevel: number
) => (archetypeFeatureLevel(feature) ?? 0) <= characterLevel;
