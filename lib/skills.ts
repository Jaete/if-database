// Proficiência em perícia: de onde vem e quantas vezes vale. Puro, sem banco:
// o servidor valida com isto e a ficha mostra com isto.
//
// A proficiência pode vir de FONTES diferentes (as escolhas da classe, cada
// concessão da raça, o narrador). A mesma perícia por DUAS fontes vira
// ESPECIALIZAÇÃO (o bônus de proficiência vale duas vezes); três, não: o teto é
// duas aplicações. Repetir a perícia DENTRO da mesma fonte é proibido. Os bônus
// fixos ("+N" do narrador) somam por fora e não entram nesta conta.

export const MAX_PROFICIENCY = 2;

export interface ISkillSource {
  /** 'class', 'race', 'staff', 'background'… */
  source: string;
  /** A concessão específica ("Variedade Genética"). */
  label?: string;
  /** Distingue duas concessões de mesmo rótulo (`race:skills`, `race:versatile`). */
  grant?: string;
}

/** Documento antigo: só `proficient: true`, sem saber de onde. */
export const LEGACY_SOURCE: ISkillSource = { source: 'legacy' };

interface ISkillLike {
  proficient?: boolean;
  proficiencySources?: ISkillSource[];
}

/** A identidade de uma fonte: duas iguais não somam na mesma perícia. */
export const sourceKey = (s: ISkillSource) =>
  `${s.source}|${s.grant ?? ''}|${s.label ?? ''}`;

/** As fontes de uma perícia; o documento antigo vale como uma fonte. */
export function sourcesOf(entry?: ISkillLike | null): ISkillSource[] {
  if (!entry) return [];
  if (Array.isArray(entry.proficiencySources)) {
    return entry.proficiencySources.filter(
      (s) => s && typeof s.source === 'string'
    );
  }
  return entry.proficient ? [LEGACY_SOURCE] : [];
}

/** 0 = nenhuma, 1 = proficiente, 2 = especialização. */
export const proficiencyLevel = (entry?: ISkillLike | null): 0 | 1 | 2 =>
  Math.min(MAX_PROFICIENCY, sourcesOf(entry).length) as 0 | 1 | 2;

/** modificador + bônus de proficiência × nível + bônus fixos. */
export const skillTotal = (
  modifier: number,
  level: number,
  proficiencyBonus = 0,
  bonus = 0
): number =>
  modifier + proficiencyBonus * Math.min(MAX_PROFICIENCY, level) + bonus;

export const DUPLICATE_MESSAGE = (skill: string) =>
  `Você já escolheu ${skill} nesta lista.`;
export const CAP_MESSAGE = (skill: string) =>
  `Proficiência em ${skill} já é especialização — não acumula mais.`;

/** `null` se as fontes são válidas para a perícia; senão a mensagem. */
export function sourcesIssue(
  skill: string,
  sources: readonly ISkillSource[]
): string | null {
  const seen = new Set<string>();
  for (const s of sources) {
    const key = sourceKey(s);
    if (seen.has(key)) return DUPLICATE_MESSAGE(skill);
    seen.add(key);
  }
  if (sources.length > MAX_PROFICIENCY) return CAP_MESSAGE(skill);
  return null;
}

/**
 * O bônus de proficiência mudou (subida de nível): cada perícia proficiente
 * ganha a diferença uma vez por aplicação, então a especialização sobe em dobro.
 * Aplica a diferença sobre o valor gravado, que pode ter bônus fixos e perícias
 * fora da lista padrão.
 */
export function shiftSkills<T extends ISkillLike & { value?: number }>(
  skills: T[],
  from: number,
  to: number
): T[] {
  if (from === to) return skills;
  return skills.map((skill) => {
    const level = proficiencyLevel(skill);
    return level > 0 && typeof skill.value === 'number'
      ? { ...skill, value: skill.value + (to - from) * level }
      : skill;
  });
}

/** Texto das fontes: "Classe · Raça · Variedade Genética · Narrador". */
export function sourceCaption(sources: readonly ISkillSource[]): string {
  const name = (s: ISkillSource) =>
    s.source === 'class'
      ? 'Classe'
      : s.source === 'race'
        ? s.label
          ? `Raça · ${s.label}`
          : 'Raça'
        : s.source === 'staff'
          ? 'Narrador'
          : s.source === 'background'
            ? 'Antecedente'
            : s.source === 'legacy'
              ? 'Ficha'
              : (s.label ?? s.source);
  return sources.map(name).join(' + ');
}

/**
 * O narrador leva a perícia direto ao nível `target` (0, 1 ou 2), venha a
 * proficiência de onde vier: ele pode dar a especialização de uma vez ou tirar a
 * proficiência da classe. Sem restrição de fonte; o teto é o próprio nível 2.
 * Ao subir, completa com fontes `staff` ("Narrador"); ao descer, tira primeiro
 * as dele e as de ficha antiga, depois as outras.
 */
export function setStaffLevel(
  sources: readonly ISkillSource[],
  target: number
): ISkillSource[] {
  const level = Math.max(0, Math.min(MAX_PROFICIENCY, Math.floor(target)));
  const kept = [...sources];
  while (kept.length > level) {
    const at = kept.findLastIndex(
      (s) => s.source === 'staff' || s.source === 'legacy'
    );
    kept.splice(at >= 0 ? at : kept.length - 1, 1);
  }
  while (kept.length < level) kept.push({ source: 'staff' });
  return kept;
}

/**
 * Normaliza as perícias que a staff mandou: as fontes ficam no máximo duas
 * (o nível 2 é o mais alto que existe) e `proficient` acompanha o nível. Aceita
 * qualquer nível: staff não tem restrição de fonte.
 */
export function normalizeStaffSkills<T extends ISkillLike>(skills: T[]): T[] {
  return skills.map((skill) => {
    if (!Array.isArray(skill.proficiencySources)) return skill;
    const proficiencySources = skill.proficiencySources.slice(
      0,
      MAX_PROFICIENCY
    );
    return {
      ...skill,
      proficiencySources,
      proficient: proficiencySources.length > 0,
    };
  });
}
