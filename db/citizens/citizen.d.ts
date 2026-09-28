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
  name: string;
  prepared: boolean; // true = preparada, false = conhecida mas não preparada
}

export interface IPlayerSpellLevel {
  level: number; // 0 para truques, 1-9 para círculos
  slotsTotal: number;
  slotsUsed: number;
  spells?: IPlayerSpell[];
}

export interface IPlayerSpellcasting {
  ability: string; // ex: "Inteligência", "Sabedoria", "Carisma"
  saveDC: number;
  attackBonus: number;
  casterLevel: number;
  cantripsKnown?: number;
  spellsKnown?: number;
  spellLevels?: IPlayerSpellLevel[];
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
  playerSpellcasting?: IPlayerSpellcasting;

  // ── Equipamento (slots + mochila + moedas) ──
  equipment?: IEquipment;

  // ── Aparência e História ──
  appearance?: string;
  backstory?: string;
}
