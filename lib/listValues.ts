/**
 * Quebra um texto de lista em itens. Vírgula e ponto-e-vírgula valem como
 * separador: fichas antigas foram cadastradas com os dois, às vezes na mesma
 * linha ("Ácido; Concussão, Perfurante"). Nada mais separa — "Perfurante e
 * Cortante de armas não mágicas" é um item só.
 */
export function splitList(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Normaliza uma lista já armazenada, onde cada entrada pode conter vários itens
 * concatenados por ter sido salva antes de `splitList` existir.
 */
export function normalizeList(items: string[] | undefined): string[] {
  return (items ?? []).flatMap(splitList);
}
