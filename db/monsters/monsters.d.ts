interface IStats {
  str?: string;
  dex?: string;
  con?: string;
  int?: string;
  wis?: string;
  cha?: string;
}

interface IAbilities {
  name?: string;
  description?: string;
}

interface IActions {
  name?: string;
  description?: string;
}

interface ISenses {
  passivePerception?: string;
  darkvision?: string;
  blindsight?: string;
  tremorsense?: string;
  truesight?: string;
}

interface IDrops {
  range?: string;
  item?: string;
}

interface ICombat {
  type?: string;
  ac?: string;
  hp?: string;
  speed?: string;
}

export default interface IMonster extends Document {
  slug: string;
  name: string;
  rarity: string;
  icon?: string;
  image?: string;
  subtitle?: string;
  description?: string;
  combat?: ICombat;
  stats?: IStats;
  abilities?: Array<IAbilities>;
  actions?: Array<IActions>;
  senses?: ISenses;
  drops?: Array<IDrops>;
  createdAt: Date;
  updatedAt: Date;
}
