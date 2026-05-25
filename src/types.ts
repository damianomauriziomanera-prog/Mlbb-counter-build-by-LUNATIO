export type DamageType = 'Fisico' | 'Magico' | 'Puro';

export type Lane = 'Gold' | 'Exp' | 'Mid' | 'Roam' | 'Jungle';

export interface Talent {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}

export interface Emblem {
  id: string;
  name: string;
  iconUrl: string;
  stats: string[];
}

export interface TalentTier {
  tier1: Talent[];
  tier2: Talent[];
  tier3: Talent[];
}

export interface Hero {
  id: string;
  name: string;
  role: string;
  damageType: DamageType;
  counterTags: string[];
  iconUrl: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  attributes: string[];
  passiveName: string;
  passiveDescription: string;
  activeName?: string;
  activeDescription?: string;
  iconUrl: string;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}

export interface BuildSlot {
  item: Item;
  reason: string;
}

export interface RecommendedBuild {
  items: BuildSlot[];
  emblem: {
    id: string;
    name: string;
    iconUrl: string;
    tier1: Talent;
    tier2: Talent;
    tier3: Talent;
  };
  spell: Spell;
  stats?: Record<string, number>;
  statProgression?: Record<string, number>[];
}

export interface MetaHero extends Hero {
  winRate: number;
  pickRate: number;
  banRate: number;
  tier: 'S+' | 'S' | 'A' | 'B' | 'C';
}

export interface SavedBuild {
  id: string;
  timestamp: number;
  userHeroId: string;
  enemyIds: string[];
  lane: string;
  results: RecommendedBuild;
}
