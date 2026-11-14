import type { IClassLevel } from '../db/classes/class.d';
import type { ITalentSlots } from '../db/citizens/citizen.d';

/**
 * Os marcos de talento de uma classe, lidos da tabela de progressão.
 *
 * Sem banco: recebe as linhas da tabela, para a ficha usar o mesmo cálculo no
 * cliente enquanto o jogador edita o nível.
 *
 * Há dois tipos de vaga, e a regra do jogo os separa:
 *
 *   - `general`: o nível em que a tabela diz "+2 em um atributo ou +1 em dois
 *     atributos ou um Talento". Ali o personagem escolhe entre atributos e um
 *     talento — geral OU da própria classe.
 *   - `classOnly`: o nível em que a classe, por conta própria, concede um
 *     talento só dela, como uma característica ("Talentos de Necromancia" no
 *     nível 2, "Talentos Druídicos", "Talento de Monge"). Vale só a lista da
 *     classe.
 *
 * Uma concessão com mais de uma opção em que o talento é UMA delas ("Habilidade
 * de Arquétipo ou Talento", "Talento de Ladrão ou Evasão") é escolha do jogador
 * contra outra coisa, e a ficha não sabe o que ele pegou: não vira vaga.
 */

const TALENT = /talent/i;
const ATTRIBUTE = /atributo/i;

/** "Talentos de Necromancia", "Talento de canção", "Talentos" — e só isso. */
const CLASS_TALENT_GRANT = /^talentos?(\s|$)/i;

/** Uma opção que é só "Talento"/"um Talento", sem dizer de quê. */
const PLAIN_TALENT = /^(um\s+)?talentos?\.?$/i;

export function talentSlotsOf(
  levels: IClassLevel[] | undefined,
  hasClassTalents: boolean
): Pick<ITalentSlots, 'general' | 'classOnly'> {
  const general: number[] = [];
  const classOnly: number[] = [];

  const rows = [...(levels ?? [])].sort((a, b) => a.level - b.level);

  for (const row of rows) {
    // O marco geral pode vir da coluna de atributos ou, quando a tabela não a
    // tem (Monge), da célula de características: "+2 em Atributo | Talento".
    const fromColumn = TALENT.test(row.abilityScoreIncrease ?? '');
    const fromGrants = (row.grants ?? []).some(
      (grant) =>
        grant.options.length > 1 &&
        grant.options.some((o) => ATTRIBUTE.test(o.name)) &&
        grant.options.some((o) => TALENT.test(o.name))
    );
    if (fromColumn || fromGrants) general.push(row.level);

    for (const grant of row.grants ?? []) {
      if (grant.options.length !== 1) continue;
      const [option] = grant.options;
      if (option.requiresPrerequisite) continue;
      const name = option.name.trim();
      if (ATTRIBUTE.test(name) || !CLASS_TALENT_GRANT.test(name)) continue;
      // "Talento" sozinho só é talento DA CLASSE se ela tem lista própria; sem
      // lista, é um talento qualquer e conta como vaga geral.
      if (PLAIN_TALENT.test(name) && !hasClassTalents) {
        general.push(row.level);
      } else {
        classOnly.push(row.level);
      }
    }
  }

  return { general, classOnly };
}
