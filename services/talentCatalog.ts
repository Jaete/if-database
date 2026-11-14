import type ICharacterClass from '../db/classes/class.d';
import type ITalentDoc from '../db/talents/talent.d';
import { classSlug } from '../db/l10n/classes';
import { isStackableTalent } from '../lib/stackableTalent';

/**
 * Um talento como o seletor da ficha o vê, venha ele de onde vier.
 *
 * `scope` é o que a regra do jogo distingue: no nível em que ganha um talento,
 * o personagem pode pegar um GERAL ou um DA PRÓPRIA CLASSE — as duas listas se
 * somam. Quem é de classe traz também o grupo e a condição de destrave, porque
 * há conjuntos ("Talentos Avançados de Necromancia") que só abrem em certo
 * nível.
 *
 * Mora fora de `talent.service.ts` porque aquele módulo é 'use server' e só
 * pode exportar funções assíncronas; estas são puras e a ficha também as usa.
 */
export interface ITalentOption {
  /** Identidade estável: o slug do geral, ou `classe:slug` no de classe. */
  key: string;
  name: string;
  scope: 'general' | 'class';
  category?: string;
  prerequisites?: string;
  description?: string;
  /** Só nos de classe: o conjunto a que pertence e a regra que o destrava. */
  group?: string;
  unlock?: string;
  /**
   * Pode ser pego mais de uma vez. No geral, o campo gravado vence; sem ele (ou
   * nos de classe), é lido do texto.
   */
  stackable: boolean;
}

/** Mesma dobra de `classSlug`: nome sem acento, caixa nem pontuação. */
export const talentSlug = classSlug;

/** Junta os campos do talento geral num texto só, para a tela de leitura. */
function describeGeneral(talent: ITalentDoc): string {
  return [
    talent.benefit && `Benefício: ${talent.benefit}`,
    talent.slotIncrease && `Aumento de Slot: ${talent.slotIncrease}`,
    talent.normal && `Normal: ${talent.normal}`,
    talent.special && `Especial: ${talent.special}`,
    talent.description,
  ]
    .filter(Boolean)
    .join('\n\n');
}

export const GENERAL_TALENT_FIELDS =
  'name slug category prerequisites benefit normal special slotIncrease description stackable';

export function generalTalentOption(talent: ITalentDoc): ITalentOption {
  const description = describeGeneral(talent);
  return {
    key: talent.slug,
    name: talent.name,
    scope: 'general',
    category: talent.category,
    prerequisites: talent.prerequisites,
    description,
    stackable:
      typeof talent.stackable === 'boolean'
        ? talent.stackable
        : isStackableTalent(description),
  };
}

const classTalentKey = (slug: string, name: string) =>
  `${slug}:${talentSlug(name)}`;

/**
 * Os talentos de uma classe como opções.
 *
 * O tópico da classe às vezes rende dois itens de mesmo nome (a análise do
 * fórum errou o título); o sufixo mantém a chave única sem depender de o nome
 * ser corrigido, e é estável enquanto a ordem do documento for.
 */
export function classTalentOptions(
  klass: Pick<ICharacterClass, 'slug' | 'name' | 'talents'> | null | undefined
): ITalentOption[] {
  const seen = new Map<string, number>();
  return (klass?.talents ?? []).map((talent) => {
    const base = classTalentKey(klass?.slug ?? 'classe', talent.name);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return {
      key: count > 1 ? `${base}~${count}` : base,
      name: talent.name,
      scope: 'class',
      category: klass?.name,
      prerequisites: talent.requirement,
      description: talent.description,
      group: talent.group,
      unlock: talent.unlock,
      stackable: isStackableTalent(
        [talent.description, talent.requirement].filter(Boolean).join('\n')
      ),
    };
  });
}
