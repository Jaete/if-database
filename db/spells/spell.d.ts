import { Document } from 'mongoose';

/**
 * Uma magia do grimório — entidade própria, não mais um subdocumento da ficha.
 *
 * Os campos repetem os de `IPlayerSpell` porque são a mesma ficha de magia; a
 * diferença é de dono. `IPlayerSpell` descrevia a cópia que vivia dentro de um
 * jogador, e por isso carregava `prepared`, que é estado de quem conjura e não
 * da magia. Aqui esse campo não existe: ele ficou no vínculo (`IPlayerSpellRef`).
 *
 * `area` e `effect` não existiam na versão embutida. Aparecem nos tópicos do
 * fórum ("Área: linha de 9 metros", "Efeito: 2 raios") e eram perdidos na
 * importação.
 */
export interface ISpell extends Document {
  name: string;
  slug: string;
  /** Círculo, de 0 (truques) a 9. Vem do formulário de importação. */
  circle: number;

  school?: string;
  classes?: string;
  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
  target?: string;
  area?: string;
  effect?: string;
  save?: string;
  spellResistance?: string;
  use?: string;
  description?: string;

  /**
   * Classes a que a magia pertence (N:N). Derivado do texto livre de
   * `classes`, que permanece como procedência — a seta é sempre
   * `classes` → `classIds`.
   */
  classIds?: string[];

  /** Tópico de onde veio, para reimportar e para citar a fonte. */
  sourceUrl?: string;
  importedAt?: Date;
}

export default ISpell;
