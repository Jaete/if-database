import type { IPublicPlayer } from '@/db/players/publicFields';
import {
  emptyGrantPicks,
  type ICreationGrantPicks,
  ATTRIBUTES,
  attributeTotals,
  castingNumbers,
  checkBase,
  level1Hp,
  type Base,
  type IAttrLine,
  type WizardStepId,
} from '@/lib/creation';
import {
  checkRacialPicks,
  effectiveSubrace,
  isMixed,
  raceBonus,
  raceLanguages,
  racialGrants,
  subraceRule,
  sumGrants,
  type IBonusSpec,
  type IGrantEntry,
  type IGrantTotals,
  type SubraceRule,
} from '@/lib/raceRules';
import type { AttributeKey } from '@/lib/stats';
import { modifierOf } from '@/lib/stats';
import type { CreationPayload } from '../CreationContext';

export interface IDerived {
  race: CreationPayload['context']['race'];
  klass: CreationPayload['context']['klass'];
  rule: SubraceRule | null;
  subrace?: string;
  spec: IBonusSpec;
  picksOk: boolean;
  base: Base;
  totals: Record<AttributeKey, IAttrLine>;
  /** Todos os seis atributos têm valor. */
  placed: boolean;
  baseComplete: boolean;
  locked: string[];
  hp: number | null;
  casting: { saveDC: number; attackBonus: number } | null;
  rollSums: number[] | null;
  /** O que a raça concede na criação, o total e o que já foi escolhido. */
  grantEntries: IGrantEntry[];
  grantTotals: IGrantTotals;
  grants: ICreationGrantPicks;
  /** As perícias da classe escolhidas. */
  classSkills: string[];
}

/** Tudo o que a tela mostra ao vivo, com as MESMAS regras do servidor. */
export function derive(data: CreationPayload, player: IPublicPlayer): IDerived {
  const { race, klass, parents } = data.context;
  const creation = data.creation;
  const base: Base = creation.base ?? {};
  const choice = player.raceChoice as
    | { subrace?: string; parents?: string[]; dominantParent?: string }
    | undefined;
  // Mestiço: o bônus de atributo vem da raça dominante (Sangue Forte).
  const dominant =
    race && isMixed(race)
      ? parents.find((p) => p.slug === choice?.dominantParent)
      : undefined;
  const subrace = race ? effectiveSubrace(race, choice?.subrace) : undefined;
  const spec = raceBonus(race ?? undefined, subrace, dominant);
  const picks = creation.racialPicks ?? [];
  const totals = attributeTotals(
    base,
    race ?? undefined,
    subrace,
    picks,
    dominant
  );
  const grantEntries = racialGrants(race ?? undefined, subrace);
  const placed = ATTRIBUTES.every((k) => base[k] !== undefined);
  const roll = data.rolls.find((r) => r.kind === 'attributes');
  const rollSums = roll ? roll.sums : null;
  const check = checkBase(creation.method, base, rollSums ?? undefined);
  const hp =
    klass?.hitDie && placed ? level1Hp(klass.hitDie, totals.con.total) : null;
  const ability = klass?.spellcastingAbility;
  return {
    race,
    klass,
    rule: race ? subraceRule(race) : null,
    subrace,
    spec,
    picksOk: checkRacialPicks(spec, picks).complete,
    base,
    totals,
    placed,
    baseComplete: check.complete,
    locked: race ? raceLanguages(race, subrace, parents) : [],
    hp,
    casting:
      klass?.caster && ability && placed
        ? castingNumbers(totals[ability].total, klass.proficiencyBonus)
        : null,
    rollSums,
    grantEntries,
    grantTotals: sumGrants(grantEntries),
    grants: { ...emptyGrantPicks(), ...(creation.grants ?? {}) },
    classSkills: creation.classSkills ?? [],
  };
}

export { modifierOf };
export type { WizardStepId };
