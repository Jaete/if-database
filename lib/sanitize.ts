/**
 * Remoção de chaves que o MongoDB interpretaria como instrução em vez de dado.
 *
 * Uma chave iniciada por `$` vira operador (`$rename`, `$unset`) e uma que
 * contém `.` vira caminho ao chegar no driver. Um corpo de requisição que
 * caminhe direto para `findOneAndUpdate` carrega as duas coisas, então a
 * limpeza precisa valer em TODO nível: `{ combat: { $rename: ... } }` é tão
 * perigoso quanto `{ $rename: ... }`.
 *
 * Isto é ortogonal a whitelist de campos. A whitelist decide QUAIS campos
 * aquele chamador pode gravar e varia por rota; isto decide o que nunca é
 * dado, e vale para todas.
 */

const isUnsafeKey = (key: string) => key.startsWith('$') || key.includes('.');

export function stripUnsafeKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUnsafeKeys(item)) as T;
  }
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return value;

  const out: Record<string, unknown> = {};
  for (const [key, inner] of Object.entries(value)) {
    if (isUnsafeKey(key)) continue;
    out[key] = stripUnsafeKeys(inner);
  }
  return out as T;
}
