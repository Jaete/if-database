import { Document } from 'mongoose';

// === Combate ===

export interface IAC {
  value?: number;
  formula?: string; // ex: "15 (armadura de couro batido, escudo)"
}

export interface IHP {
  value?: number;
  formula?: string; // ex: "45 (6d8 + 18)"
}

export interface ISpeed {
  walk?: number;
  fly?: number;
  swim?: number;
  climb?: number;
  burrow?: number;
  note?: string; // ex: "voa 60 pés (paira)"
}

export interface ICombat {
  ac?: IAC;
  hp?: IHP;
  speed?: ISpeed;
}

// === Atributos ===

export interface IStats {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
}

// === Proficiências ===

export interface ISavingThrow {
  attribute?: string; // ex: "Destreza"
  value?: number; // valor base de 0 a 30
}

export interface ISkill {
  name?: string; // ex: "Percepção"
  value?: number; // valor base de 0 a 30
}

export interface IProficiencies {
  savingThrows?: ISavingThrow[];
  skills?: ISkill[];
  weapons?: string[]; // ex: ["armas simples", "espadas longas"]
  armor?: string[]; // ex: ["armaduras leves", "escudos"]
  tools?: string[]; // ex: ["ferramentas de ladrão", "kit de alquimia"]
}

// === Defesas ===

export interface IDefenses {
  vulnerabilities?: string[]; // ex: ["fogo", "cortante"]
  resistances?: string[]; // ex: ["frio", "veneno"]
  damageImmunities?: string[]; // ex: ["fogo", "necrótico"]
  conditionImmunities?: string[]; // ex: ["envenenado", "atordoado"]
}

// === Sentidos ===

export interface ISenses {
  passivePerception?: number;
  darkvision?: number;
  blindsight?: number;
  tremorsense?: number;
  truesight?: number;
}

// === Traços / Habilidades Passivas ===

export interface ITrait {
  name?: string;
  description?: string;
}

// === Ações (ações, bônus, reações, lendárias) ===

export interface IAction {
  name?: string;
  description?: string;
}

// === Conjuração de Magias ===

export interface ISpell {
  name?: string;
  description?: string;
  usage?: string; // ex: "à vontade", "3/dia", "Recarga 5-6"
}

export interface ISpellLevel {
  level?: number; // 0 para cantrips, 1-9 para magias
  slots?: number; // espaços de magia disponíveis
  spells?: ISpell[];
}

export interface ISpellcasting {
  ability?: string; // ex: "Inteligência"
  saveDC?: number; // ex: 13
  attackBonus?: number; // ex: +5
  casterLevel?: number; // ex: 9
  spellLevels?: ISpellLevel[];
}

// === Fonte ===

export interface ISource {
  book?: string; // ex: "Monster Manual"
  page?: number; // ex: 166
}

// === Interface Principal ===

export default interface ICreature extends Document {
  slug: string;
  name: string;
  size?: string;
  type?: string; // Tipo da criatura (Humanoide, Dragão, etc.)
  alignment?: string;
  rarity?: string;
  icon?: string;
  image?: string;
  subtitle?: string;
  description?: string;
  combat?: ICombat;
  stats?: IStats;
  proficiencies?: IProficiencies;
  defenses?: IDefenses;
  senses?: ISenses;
  languages?: string[];
  traits?: ITrait[];
  spellcasting?: ISpellcasting;
  actions?: IAction[];
  bonusActions?: IAction[];
  reactions?: IAction[];
  legendaryActions?: IAction[];
  source?: ISource;
  createdAt: Date;
  updatedAt: Date;
}
