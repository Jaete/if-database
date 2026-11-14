import { attributeKeyOf, modifierOf, spellSaveDC } from '../lib/stats';

/**
 * Normalizações da edição da ficha pela staff, compartilhadas pela edição livre
 * (PUT do embed) e pela aprovação com ajustes.
 */

// `total` e `modifier` de cada atributo são derivados de base + bônus. Recalcular
// aqui em vez de aceitar o que o cliente mandou evita que a ficha guarde um
// modificador que não corresponde aos valores exibidos ao lado dele.
export function normalizeStats(data: Record<string, unknown>) {
  const stats = data.playerStats;
  if (!stats || typeof stats !== 'object') return;

  for (const detail of Object.values(stats as Record<string, unknown>)) {
    if (!detail || typeof detail !== 'object') continue;
    const attr = detail as Record<string, unknown>;
    const base = Number(attr.base);
    if (!Number.isFinite(base)) continue;

    const total =
      base + (Number(attr.raceBonus) || 0) + (Number(attr.classBonus) || 0);
    attr.total = total;
    attr.modifier = modifierOf(total);
  }
}

/**
 * O CD de resistência é 8 + modificador do atributo de conjuração + bônus de
 * proficiência. Recalcular aqui mantém o número gravado coerente mesmo quando
 * o que mudou foi o atributo ou a proficiência, e não a tela de magias.
 *
 * `stored` é a ficha como está hoje: o cliente manda só as subárvores que
 * tocou, então cada parcela da conta pode vir do corpo ou do documento.
 */
export function normalizeSpellDC(
  data: Record<string, unknown>,
  stored: Record<string, unknown> | null
) {
  const casting = (data.playerSpellcasting ?? stored?.playerSpellcasting) as
    Record<string, unknown> | undefined;
  if (!casting || typeof casting !== 'object') return;

  const key = attributeKeyOf(String(casting.ability ?? ''));
  if (!key) return;

  const playerStats = (data.playerStats ?? stored?.playerStats) as
    Record<string, { modifier?: number } | undefined> | undefined;
  const flat = (data.stats ?? stored?.stats) as
    Record<string, number | undefined> | undefined;

  const modifier =
    typeof playerStats?.[key]?.modifier === 'number'
      ? (playerStats[key] as { modifier: number }).modifier
      : typeof flat?.[key] === 'number'
        ? modifierOf(flat[key])
        : undefined;
  if (modifier === undefined) return;

  const proficiency =
    Number(data.proficiencyBonus ?? stored?.proficiencyBonus) || 0;

  // Quando a conjuração não veio no corpo, ela entra agora: o CD mudou por
  // causa de outro campo e precisa ser gravado junto com ele.
  data.playerSpellcasting = {
    ...casting,
    saveDC: spellSaveDC(modifier, proficiency),
  };
}
