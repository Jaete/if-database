import ICreature from '../creatures/creatures.d';

export interface IDrop {
  item?: string;
  chance?: number; // ex: 50 (porcentagem de 0 a 100)
}

export type PerkType = 'atributo' | 'habilidade' | 'acao' | 'classe';

export interface ILevelPerk {
  type: PerkType;
  name?: string; // usado por: habilidade, acao, classe
  description?: string; // usado por: habilidade, acao, classe
  attribute?: string; // usado por: atributo (ex: 'str')
  value?: number; // usado por: atributo (ex: +2)
}

export interface IMonsterLevel {
  level: number;
  acquiredPerks: ILevelPerk[];
}

export default interface IMonster extends ICreature {
  cr?: string; // ex: "1", "5", "1/4"
  xp?: number; // ex: 200, 1800
  drops?: IDrop[];
  levels?: IMonsterLevel[];
}
