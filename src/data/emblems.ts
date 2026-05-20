import { Emblem, Talent } from '../types';

const getTalentIcon = (name: string) => `https://mobile-legends.fandom.com/wiki/Special:FilePath/Talent_${name.replace(/\s+/g, '_')}.png`;

export const EMBLEMS: Record<string, Emblem> = {
  BASIC: {
    id: 'basic',
    name: 'Base Comune',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Common.png',
    talents: {
      tier1: [
        { id: 'thrill', name: 'Thrill', description: 'Gaudagna 16 Attacco Adattivo.', iconUrl: getTalentIcon('Thrill') },
        { id: 'vitality', name: 'Vitality', description: 'Gaudagna 225 PV extra.', iconUrl: getTalentIcon('Vitality') },
        { id: 'agility', name: 'Agility', description: 'Gaudagna 4% Vel. Movimento.', iconUrl: getTalentIcon('Agility') },
      ],
      tier2: [
        { id: 'life_drain', name: 'Life Drain', description: 'Recupera Mana/HP uccidendo minion.', iconUrl: getTalentIcon('Life Drain') },
        { id: 'seasoned_hunter', name: 'Seasoned Hunter', description: 'Velocizza la giungla (Lord/Turtle).', iconUrl: getTalentIcon('Seasoned Hunter') },
        { id: 'tenacity', name: 'Tenacity', description: 'Aumenta Difesa sotto il 40% HP.', iconUrl: getTalentIcon('Tenacity') },
      ],
      tier3: [
        { id: 'impure_rage', name: 'Impure Rage', description: 'Danni extra con abilità e ripristino Mana.', iconUrl: getTalentIcon('Impure Rage') },
        { id: 'quantum_charge', name: 'Quantum Charge', description: 'Attacchi base aumentano Vel. Movimento e HP.', iconUrl: getTalentIcon('Quantum Charge') },
        { id: 'concussive_blast', name: 'Concussive Blast', description: 'Danno AOE basato sui PV ogni 15s.', iconUrl: getTalentIcon('Concussive Blast') },
      ],
    }
  },
  TANK: {
    id: 'tank',
    name: 'Tank',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Tank.png',
    talents: {
      tier1: [
        { id: 'vitality', name: 'Vitality', description: '+225 PV Extra.', iconUrl: getTalentIcon('Vitality') },
        { id: 'firmness', name: 'Firmness', description: '+12 Difesa Fisica e Magica.', iconUrl: getTalentIcon('Firmness') },
        { id: 'agility', name: 'Agility', description: '+4% Vel. Movimento.', iconUrl: getTalentIcon('Agility') },
      ],
      tier2: [
        { id: 'tenacity', name: 'Tenacity', description: 'Difesa bonus quando HP bassi.', iconUrl: getTalentIcon('Tenacity') },
        { id: 'wilderness_blessing', name: 'Wilderness Blessing', description: 'Velocità extra in Giungla e Fiume.', iconUrl: getTalentIcon('Wilderness Blessing') },
        { id: 'pull_yourself_together', name: 'Pull Yourself Together', description: 'Riduce ricarica incantesimi e item.', iconUrl: getTalentIcon('Pull Yourself Together') },
      ],
      tier3: [
        { id: 'concussive_blast', name: 'Concussive Blast', description: 'Onda d\'urto PV ogni 15s.', iconUrl: getTalentIcon('Concussive Blast') },
        { id: 'brave_smite', name: 'Brave Smite', description: 'Cura colpendo con CC.', iconUrl: getTalentIcon('Brave Smite') },
        { id: 'focusing_mark', name: 'Focusing Mark', description: 'Aumenta danni alleati sul tuo bersaglio.', iconUrl: getTalentIcon('Focusing Mark') },
      ],
    }
  },
  ASSASSIN: {
    id: 'assassin',
    name: 'Assassino',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Assassin.png',
    talents: {
      tier1: [
        { id: 'thrill', name: 'Thrill', description: '+16 Attacco Adattivo.', iconUrl: getTalentIcon('Thrill') },
        { id: 'fatal', name: 'Fatal', description: '+5% Prob. Critico e +10% Danno Critico.', iconUrl: getTalentIcon('Fatal') },
        { id: 'swift', name: 'Swift', description: '+10% Vel. Attacco.', iconUrl: getTalentIcon('Swift') },
      ],
      tier2: [
        { id: 'master_assassin', name: 'Master Assassin', description: 'Danni extra contro nemici isolati.', iconUrl: getTalentIcon('Master Assassin') },
        { id: 'bargain_hunter', name: 'Bargain Hunter', description: 'Sconto del 5% sugli Item.', iconUrl: getTalentIcon('Bargain Hunter') },
        { id: 'seasoned_hunter', name: 'Seasoned Hunter', description: 'Danni extra a Lord/Tartaruga.', iconUrl: getTalentIcon('Seasoned Hunter') },
      ],
      tier3: [
        { id: 'killing_spree', name: 'Killing Spree', description: 'Rigenera 8% HP e +15% Movimento dopo kill.', iconUrl: getTalentIcon('Killing Spree') },
        { id: 'lethal_ignition', name: 'Lethal Ignition', description: 'Danno bruciatura dopo 3 colpi.', iconUrl: getTalentIcon('Lethal Ignition') },
        { id: 'war_cry', name: 'War Cry', description: 'Aumenta i danni dopo 3 attacchi.', iconUrl: getTalentIcon('War Cry') },
      ],
    }
  },
  MAGE: {
    id: 'mage',
    name: 'Mago',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Mage.png',
    talents: {
      tier1: [
        { id: 'inspire', name: 'Inspire', description: '+5% Riduzione Ricarica (CDR).', iconUrl: getTalentIcon('Inspire') },
        { id: 'rupture', name: 'Rupture', description: '+5 Penetrazione Adattiva.', iconUrl: getTalentIcon('Rupture') },
        { id: 'agility', name: 'Agility', description: '+4% Vel. Movimento.', iconUrl: getTalentIcon('Agility') },
      ],
      tier2: [
        { id: 'bargain_hunter', name: 'Bargain Hunter', description: 'Item costano il 5% in meno.', iconUrl: getTalentIcon('Bargain Hunter') },
        { id: 'wilderness_blessing', name: 'Wilderness Blessing', description: 'Velocità fiume/giungla.', iconUrl: getTalentIcon('Wilderness Blessing') },
        { id: 'festival_of_blood', name: 'Festival of Blood', description: '+6% Rubavita Incantesimo extra.', iconUrl: getTalentIcon('Festival of Blood') },
      ],
      tier3: [
        { id: 'impure_rage', name: 'Impure Rage', description: 'Danni extra e ripristino Mana.', iconUrl: getTalentIcon('Impure Rage') },
        { id: 'lethal_ignition', name: 'Lethal Ignition', description: 'Burst combo infligge bruciatura.', iconUrl: getTalentIcon('Lethal Ignition') },
        { id: 'starlium_bravery', name: 'Starlium Bravery', description: 'Aumenta Potere Magico e CDR.', iconUrl: getTalentIcon('Starlium Bravery') },
      ],
    }
  },
  FIGHTER: {
    id: 'fighter',
    name: 'Combattente',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Fighter.png',
    talents: {
      tier1: [
        { id: 'thrill', name: 'Thrill', description: '+16 Attacco Adattivo.', iconUrl: getTalentIcon('Thrill') },
        { id: 'vitality', name: 'Vitality', description: '+225 PV Extra.', iconUrl: getTalentIcon('Vitality') },
        { id: 'rupture', name: 'Rupture', description: '+5 Penetrazione Adattiva.', iconUrl: getTalentIcon('Rupture') },
      ],
      tier2: [
        { id: 'festival_of_blood', name: 'Festival of Blood', description: 'Aumenta Rubavita Incantesimo.', iconUrl: getTalentIcon('Festival of Blood') },
        { id: 'tenacity', name: 'Tenacity', description: 'Difesa bonus quando HP bassi.', iconUrl: getTalentIcon('Tenacity') },
        { id: 'bargain_hunter', name: 'Bargain Hunter', description: 'Sconto del 5% sugli Item.', iconUrl: getTalentIcon('Bargain Hunter') },
      ],
      tier3: [
        { id: 'brave_smite', name: 'Brave Smite', description: 'Cura colpendo con abilità.', iconUrl: getTalentIcon('Brave Smite') },
        { id: 'war_cry', name: 'War Cry', description: 'Danni aumentati dopo attacchi continui.', iconUrl: getTalentIcon('War Cry') },
        { id: 'quantum_charge', name: 'Quantum Charge', description: 'Attacchi base curano e velocizzano.', iconUrl: getTalentIcon('Quantum Charge') },
      ],
    }
  },
  MARKSMAN: {
    id: 'marksman',
    name: 'Tiratore',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Marksman.png',
    talents: {
      tier1: [
        { id: 'fatal', name: 'Fatal', description: '+5% Prob. Critico e +10% Danno Critico.', iconUrl: getTalentIcon('Fatal') },
        { id: 'swift', name: 'Swift', description: '+10% Vel. Attacco.', iconUrl: getTalentIcon('Swift') },
        { id: 'agility', name: 'Agility', description: '+4% Vel. Movimento.', iconUrl: getTalentIcon('Agility') },
      ],
      tier2: [
        { id: 'master_assassin', name: 'Master Assassin', description: 'Danni extra contro nemici isolati.', iconUrl: getTalentIcon('Master Assassin') },
        { id: 'weapon_master', name: 'Weapon Master', description: 'Aumenta Attacco bonus da item e talenti.', iconUrl: getTalentIcon('Weapon Master') },
        { id: 'tenacity', name: 'Tenacity', description: 'Difesa bonus quando HP bassi.', iconUrl: getTalentIcon('Tenacity') },
      ],
      tier3: [
        { id: 'weakness_finder', name: 'Weakness Finder', description: 'Attacchi base rallentano il nemico.', iconUrl: getTalentIcon('Weakness Finder') },
        { id: 'quantum_charge', name: 'Quantum Charge', description: 'Attacchi base curano e velocizzano.', iconUrl: getTalentIcon('Quantum Charge') },
        { id: 'killing_spree', name: 'Killing Spree', description: 'Kill rigenerano HP e velocità.', iconUrl: getTalentIcon('Killing Spree') },
      ],
    }
  },
  SUPPORT: {
    id: 'support',
    name: 'Supporto',
    iconUrl: 'https://mobile-legends.fandom.com/wiki/Special:FilePath/Emblem_Support.png',
    talents: {
      tier1: [
        { id: 'vitality', name: 'Vitality', description: '+225 PV Extra.', iconUrl: getTalentIcon('Vitality') },
        { id: 'inspire', name: 'Inspire', description: '+5% Riduzione Ricarica (CDR).', iconUrl: getTalentIcon('Inspire') },
        { id: 'agility', name: 'Agility', description: '+4% Vel. Movimento.', iconUrl: getTalentIcon('Agility') },
      ],
      tier2: [
        { id: 'pull_yourself_together', name: 'Pull Yourself Together', description: 'Riduce ricarica incantesimi e item.', iconUrl: getTalentIcon('Pull Yourself Together') },
        { id: 'gift', name: 'Gift', description: 'Aumenta effetto di cure e scudi.', iconUrl: getTalentIcon('Gift') },
        { id: 'tenacity', name: 'Tenacity', description: 'Difesa bonus quando HP bassi.', iconUrl: getTalentIcon('Tenacity') },
      ],
      tier3: [
        { id: 'focusing_mark', name: 'Focusing Mark', description: 'Aumenta danni alleati sul bersaglio.', iconUrl: getTalentIcon('Focusing Mark') },
        { id: 'brave_smite', name: 'Brave Smite', description: 'Cura colpendo con abilità.', iconUrl: getTalentIcon('Brave Smite') },
        { id: 'temporal_reign', name: 'Temporal Reign', description: 'Riduce CD abilità dopo l\'Ultimate.', iconUrl: getTalentIcon('Temporal Reign') },
      ],
    }
  }
};
