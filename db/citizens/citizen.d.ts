import ICreature from '../creatures/creatures';
import { IItem } from '../items/item.d';

// ============================================================
// Atributos com Breakdown (Valor / +Raça / +Classe / Total / Mod)
// ============================================================

export interface IStatDetail {
  base: number;
  raceBonus?: number;
  classBonus?: number;
  total: number;
  modifier: number;
}

export interface IPlayerStats {
  str?: IStatDetail;
  dex?: IStatDetail;
  con?: IStatDetail;
  int?: IStatDetail;
  wis?: IStatDetail;
  cha?: IStatDetail;
}

// ============================================================
// Experiência
// ============================================================

export interface IExperience {
  current: number;
  nextLevel: number;
}

// ============================================================
// Chi (recurso homebrew — espécie de mana/ki)
// ============================================================

export interface IChi {
  current: number;
  max: number;
}

// ============================================================
// Profissões
// ============================================================

export interface ISubProfession {
  name: string;
}

export interface IProfession {
  name: string;
  subProfessions?: ISubProfession[];
}

// ============================================================
// Conjuração de Magias (foco em jogador)
// ============================================================

export interface IPlayerSpell {
  /**
   * Presente só nas magias que vieram do grimório, resolvidas na leitura a
   * partir de `spellRefs`. É o que permite removê-las de novo antes de gravar,
   * para que o vínculo não se transforme numa cópia embutida.
   */
  spellId?: string;
  name: string;
  prepared: boolean; // true = preparada, false = conhecida mas não preparada

  // Ficha da magia. Tudo texto livre, como vem das fontes do sistema: as
  // classes chegam como "bardo, mago" e os componentes como "V, S, M (uma
  // pena)", e dividir isso em listas perderia as observações entre parênteses.
  school?: string; // ex: "Transmutação"
  classes?: string; // ex: "bardo"
  castingTime?: string; // ex: "1 ação"
  range?: string; // ex: "Pessoal"
  components?: string; // ex: "V, S"
  duration?: string; // ex: "Instantânea; veja o texto"
  target?: string; // ex: "1 criatura viva"
  area?: string; // ex: "linha de 9 metros"
  effect?: string; // ex: "2 raios"
  save?: string; // ex: "Vontade anula (inofensivo)"
  spellResistance?: string; // ex: "sim (inofensivo)"
  use?: string; // ex: "1/dia", "À vontade"
  description?: string;
}

export interface IPlayerSpellLevel {
  level: number; // 0 para truques, 1-9 para círculos
  slotsTotal: number;
  slotsUsed: number;
  spells?: IPlayerSpell[];
}

/**
 * Vínculo entre uma ficha e uma magia do grimório.
 *
 * Guarda só o id e o que é estado de quem conjura. O resto da magia mora na
 * coleção `spells` e é resolvido na leitura — corrigir a descrição no grimório
 * corrige em todas as fichas que a têm, que é a razão de existir a entidade
 * separada. O círculo também vem de lá, não daqui.
 */
export interface IPlayerSpellRef {
  spellId: string;
  prepared: boolean;
}

export interface IPlayerSpellcasting {
  ability: string; // ex: "Inteligência", "Sabedoria", "Carisma"
  saveDC: number;
  attackBonus: number;
  casterLevel: number;
  cantripsKnown?: number;
  spellsKnown?: number;
  spellLevels?: IPlayerSpellLevel[];

  /**
   * Magias ligadas ao grimório. Convivem com as de `spellLevels`, que são as
   * cópias embutidas das fichas importadas antes do grimório existir: na
   * leitura, as duas origens são fundidas por círculo.
   *
   * Numa ficha ligada a uma classe, são elas as magias PREPARADAS — as
   * conhecidas não se guardam, porque são todas as da classe até `maxCircle`.
   */
  spellRefs?: IPlayerSpellRef[];

  // ── Derivados da tabela da classe, nunca gravados ──
  //
  // Só existem quando a ficha tem `classId`. Ver
  // services/classSpells.service.ts.

  /** Quantas magias podem ficar preparadas: a soma dos espaços de todos os círculos. */
  preparedLimit?: number;
  /** Maior círculo conjurável. É até ele que o personagem conhece as magias da classe. */
  maxCircle?: number;
}

// ============================================================
// Equipamento Expandido (slots equipados + mochila + gil)
// ============================================================

export interface IEquipment {
  head?: IItem;
  torso?: IItem;
  legs?: IItem;
  feet?: IItem;
  hand?: IItem;
  offhand?: IItem;
  accessory1?: IItem;
  accessory2?: IItem;
  gil?: number;
  backpack?: string;
}

// ============================================================
// Habilidade de Cidadão (classe/raça/antecedente)
// ============================================================

export interface ICitizenAbility {
  name?: string;
  description?: string;

  /**
   * De onde a habilidade veio. Ausente = digitada à mão na ficha.
   *
   * `'class'` marca o que a classe ligada concede no nível do personagem;
   * `'archetype'`, a habilidade do arquétipo escolhido (ver `ICitizenArchetype`).
   * Essas entradas são resolvidas na leitura, nunca gravadas: a descrição mora
   * na classe, e corrigi-la lá corrige em todas as fichas daquela classe — a
   * mesma razão de `spellRefs` não embutir a magia.
   */
  source?: 'class' | 'archetype';
  /** Nível da classe em que a habilidade foi concedida. Só com `source`. */
  level?: number;
}

/**
 * O arquétipo do personagem — a subclasse que ele escolhe ao chegar no nível
 * que a tabela da classe marca, e as habilidades dela que ele foi pegando.
 *
 * Guarda só a ESCOLHA, pelos mesmos motivos de `spellRefs`: o arquétipo oferece
 * muito mais habilidades do que o personagem chega a ter — é com elas que se
 * monta a build — e embutir as escolhidas congelaria a descrição no estado em
 * que o códice estava no dia.
 *
 * Quantas cabem não é escolha de ninguém: é a contagem das linhas
 * "Habilidade de Arquétipo" da tabela até o nível da ficha.
 */
export interface ICitizenArchetype {
  /** Slug do arquétipo dentro da classe ligada. */
  slug?: string;
  /** Nomes das habilidades escolhidas, na ordem em que foram pegas. */
  features?: string[];

  // ── Derivados na leitura, nunca gravados ──
  // Mesma divisão de `IPlayerSpellcasting`: saem da tabela da classe, e gravá-los
  // deixaria um número que a próxima leitura contradiz.

  /** Nome do arquétipo escolhido, para a ficha não precisar do códice. */
  name?: string;
  /** Nível em que a classe manda escolher o arquétipo. */
  pickLevel?: number;
  /** Quantas habilidades de arquétipo o nível atual já concede. */
  featureSlots?: number;
}

// ============================================================
// Interface Principal — ICitizen
// ============================================================

export default interface ICitizen extends ICreature {
  // ── Identidade ──
  race: string;
  gender: string;
  class: string;
  age?: string;
  height?: string; // altura em metros, ex: "1.75m"
  family?: string;
  kingdom?: string;
  clan?: string;
  deity?: string; // adoração / deus seguido

  // ── Progressão ──
  level?: number;
  experience?: IExperience;

  // ── Recursos Principais ──
  chi?: IChi;
  proficiencyBonus?: number;

  // ── Atributos com breakdown (Valor / +Raça / +Classe / Total / Mod) ──
  playerStats?: IPlayerStats;

  // ── Habilidades (classe, raciais, antecedente) ──
  abilities?: ICitizenAbility[];

  // ── Profissões ──
  professions?: IProfession[];

  // ── Conjuração (foco em jogador) ──
  /**
   * Classe do personagem no códice. O campo `class` continua existindo e passa
   * a ser o nome desnormalizado da classe ligada — a ficha mostra só o nome, e
   * desnormalizar evita resolver a referência em toda leitura.
   */
  classId?: string;

  playerSpellcasting?: IPlayerSpellcasting;

  /** A escolha de arquétipo. Só faz sentido com `classId`. */
  archetype?: ICitizenArchetype;

  // ── Equipamento (slots + mochila + moedas) ──
  equipment?: IEquipment;

  // ── Aparência e História ──
  appearance?: string;
  backstory?: string;

  /**
   * Preferências de narração que a pessoa quer que o mestre respeite: tom,
   * temas que ela gosta e temas que não podem aparecer. É texto livre e longo,
   * fora da ficha em si — por isso a ficha o exibe num modal, não no corpo.
   */
  narrationStyle?: string;
}
