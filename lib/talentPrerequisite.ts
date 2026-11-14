const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

/**
 * O nível de personagem que o pré-requisito pede, ou 0 se não pede nenhum.
 *
 * Só "Nível N" e "<Classe> N" contam: "Nível de Conjurador 2" é outra grandeza
 * e a ficha não a sabe. Um talento que pede um nível acima do personagem nem aparece na escolha;
 * pré-requisito em texto livre só avisa.
 */
export const requiredLevel = (prereq?: string, className?: string): number => {
  if (!prereq) return 0;
  const text = normalize(prereq);
  const own = className ? normalize(className) : '';
  const match =
    text.match(
      /\bnivel(?!\s+de\s+(?:conjurador|classe))\s+(?:de\s+personagem\s+)?(\d+)/
    ) ??
    (own
      ? text.match(
          new RegExp(`\\b${own.replace(/[^a-z0-9 ]/g, '\\$&')}\\s+(\\d+)`)
        )
      : null);
  return match ? Number(match[1]) : 0;
};
