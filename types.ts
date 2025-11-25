export interface Attribute {
  score: number;
  mod: number;
}

export interface Stats {
  str: Attribute;
  dex: Attribute;
  con: Attribute;
  int: Attribute;
  wis: Attribute;
  cha: Attribute;
  hp: string;
  ac: string;
  proficiencies: string[];
  senses: string[];
  languages: string[];
  resistances: string[];
}

export interface Action {
  name: string;
  desc: string;
  isAttack?: boolean;
  attackBonus?: string;
  damage?: string;
}

export interface Ability {
  name: string;
  desc: string;
}

export interface SpellLevel {
  level: string; // "Cantrip", "1st", etc.
  slots?: number;
  list: string[];
}

export interface Spells {
  castingAbility: string;
  dc: number;
  attackBonus: number;
  spellList: SpellLevel[];
}

export interface Personality {
  behavior: string;
  mannerisms: string;
  combatStyle: string;
  interaction: string;
  appearance: string;
  voice: string;
}

export interface Variants {
  weaker: string;
  stronger: string;
}

export interface Villain {
  identity: {
    name: string;
    race: string;
    class: string;
    alignment: string;
    cr: string; // Challenge Rating / Level
    role: string;
  };
  stats: Stats;
  actions: Action[];
  legendaryActions?: Action[];
  lairActions?: Action[];
  uniqueAbilities: Ability[];
  spells?: Spells;
  personality: Personality;
  hooks: string[];
  variants: Variants;
}