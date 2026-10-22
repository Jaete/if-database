import type {
  IPlayerSpell,
  IPlayerSpellcasting,
  IPlayerSpellLevel,
} from '../db/citizens/citizen';
import type ISpell from '../db/spells/spell.d';
import SpellModel from '../db/spells/spells';

/**
 * Traz para dentro da ficha as magias que ela apenas referencia.
 *
 * A ficha guarda `{ spellId, prepared }`; a magia inteira mora no grimório. A
 * resolução acontece na leitura, e não na gravação, porque é isso que faz uma
 * correção no grimório aparecer em todas as fichas que apontam para ela.
 *
 * O resultado tem exatamente a forma que a ficha já renderizava antes do
 * grimório existir — `spellLevels[].spells[]` —, de propósito: nenhum painel
 * precisou mudar para exibir uma magia ligada.
 */
export async function resolveSpellRefs(
  spellcasting: IPlayerSpellcasting | undefined
): Promise<IPlayerSpellcasting | undefined> {
  const refs = spellcasting?.spellRefs;
  if (!spellcasting || !refs?.length) return spellcasting;

  const ids = refs
    .map((ref) => ref.spellId)
    .filter((id) => /^[0-9a-f]{24}$/i.test(id));
  if (ids.length === 0) return spellcasting;

  const found = await SpellModel.find({ _id: { $in: ids } })
    .select('-__v')
    .lean<ISpell[]>();
  const byId = new Map(found.map((spell) => [String(spell._id), spell]));

  // `spells` é opcional na ficha, mas aqui todo nível tem a lista materializada
  // para o resto da função não precisar checar a cada acesso.
  type Level = IPlayerSpellLevel & { spells: IPlayerSpell[] };

  const levels: Level[] = (spellcasting.spellLevels ?? []).map((level) => ({
    ...level,
    spells: [...(level.spells ?? [])],
  }));

  const levelFor = (circle: number): Level => {
    const existing = levels.find((level) => level.level === circle);
    if (existing) return existing;
    const created: Level = {
      level: circle,
      slotsTotal: 0,
      slotsUsed: 0,
      spells: [],
    };
    levels.push(created);
    return created;
  };

  for (const ref of refs) {
    const spell = byId.get(ref.spellId);
    // Uma magia apagada do grimório deixa o vínculo órfão. Ignorar é melhor
    // que renderizar um buraco: o vínculo continua no documento e volta a
    // funcionar se a magia for reimportada, porque o `_id` é preservado.
    if (!spell) continue;

    const {
      _id,
      slug,
      circle,
      createdAt,
      updatedAt,
      sourceUrl,
      importedAt,
      ...sheet
    } = spell as unknown as Record<string, unknown>;
    void _id;
    void slug;
    void createdAt;
    void updatedAt;
    void sourceUrl;
    void importedAt;

    const target = levelFor(Number(circle) || 0);
    const resolved = {
      ...sheet,
      spellId: ref.spellId,
      prepared: ref.prepared,
    } as IPlayerSpell;

    // Uma cópia embutida de mesmo nome é substituída pela do grimório: é a
    // ficha importada antes do grimório, agora com fonte melhor.
    const at = target.spells.findIndex(
      (existing) => existing.name === resolved.name
    );
    if (at >= 0) target.spells[at] = resolved;
    else target.spells.push(resolved);
  }

  levels.sort((a, b) => a.level - b.level);
  return { ...spellcasting, spellLevels: levels };
}
