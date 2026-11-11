/** "1 raça", "2 raças". */
export const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;
