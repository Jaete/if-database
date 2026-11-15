import { normalizeStaffSkills } from '../lib/skills';
import { pickWritablePlayerFields } from '../db/players/publicFields';
import type { IAuditActor } from '../db/sheetAudit/sheetAudit.d';
import { getPlayerById, updatePlayerById } from './player.service';
import { PlayerSheetError } from './playerSheetLinks.service';
import { rawSheet, recordAudit } from './sheetAudit';
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

/**
 * As perícias que a staff mandou: sem restrição de fonte (ela pode dar a
 * especialização direto ou tirar a proficiência da classe). O único teto é o
 * nível 2, o mais alto que existe; `proficient` acompanha as fontes.
 */
export function normalizeSkills(data: Record<string, unknown>) {
  const prof = data.proficiencies;
  if (!prof || typeof prof !== 'object') return;
  const skills = (prof as Record<string, unknown>).skills;
  if (!Array.isArray(skills)) return;
  (prof as Record<string, unknown>).skills = normalizeStaffSkills(
    skills.filter((s) => s && typeof s === 'object')
  );
}

export class SheetEditError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'SheetEditError';
    this.status = status;
  }
}

/**
 * A edição livre da ficha pela staff (o PUT do embed): grava os campos
 * graváveis, confere raça, classe, magias e talentos, e audita o antes → depois.
 * A permissão (staff, nunca a dona) é conferida por quem chama.
 */
export async function staffEditSheet(
  id: string,
  body: { fields?: unknown; updatedAt?: unknown },
  actor: IAuditActor
) {
  const data = pickWritablePlayerFields(body?.fields);
  normalizeStats(data);
  normalizeSkills(data);
  if (Object.keys(data).length === 0) {
    throw new SheetEditError('Nada para salvar', 400);
  }
  const current = await getPlayerById(id);
  if (!current) throw new SheetEditError('Ficha não encontrada', 404);

  // Em criação a edição livre não existe (o assistente e a revisão a
  // substituem); ela é para ficha aprovada ou antiga.
  if (current.status && current.status !== 'approved') {
    throw new SheetEditError(
      'A ficha ainda está em criação: use o assistente ou a revisão.',
      409
    );
  }

  // Edição concorrente: o cliente manda o `updatedAt` que carregou; se o
  // documento já mudou desde então, recusa em vez de sobrescrever em silêncio.
  if (body?.updatedAt) {
    const storedAt = current.updatedAt
      ? new Date(current.updatedAt).getTime()
      : 0;
    if (storedAt && storedAt !== new Date(String(body.updatedAt)).getTime()) {
      throw new SheetEditError('Esta ficha foi alterada em outro lugar.', 409);
    }
  }

  normalizeSpellDC(data, current as unknown as Record<string, unknown>);

  // Raça e talentos recusados com a mensagem de quem os conferiu (400): é o
  // cliente que mandou uma escolha inválida.
  const before = await rawSheet(id);
  let updated;
  try {
    updated = await updatePlayerById(id, data);
  } catch (error) {
    if (error instanceof PlayerSheetError) {
      throw new SheetEditError(
        error.message,
        error.name === 'UniqueConflictError' ? 409 : 400
      );
    }
    throw error;
  }
  if (!updated) throw new SheetEditError('Ficha não encontrada', 404);
  await recordAudit(id, before, () => rawSheet(id), actor, 'embed-edit');
  return updated;
}
