import { Item } from '../types';
import { getWikiaImageUrl } from '../lib/md5';

const ITEM_ID_MAP: Record<string, number> = {
  // Movement
  'warrior_boots': 101,
  'tough_boots': 102,
  'magic_shoes': 103,
  'arcane_boots': 104,
  'swift_boots': 105,
  'demon_shoes': 106,
  'rapid_boots': 107,
  // Attack
  'demon_hunter_sword': 201,
  'sea_halberd': 202,
  'malefic_roar': 203,
  'haas_claws': 204,
  'berserkers_fury': 205,
  'endless_battle': 206,
  'windtalker': 207,
  'heptaseas': 209,
  'blade_of_despair': 210,
  'hunter_strike': 211,
  'war_axe': 212,
  'rose_gold_meteor': 213,
  'golden_staff': 214,
  'wind_of_nature': 215,
  'malefic_gun': 216,
  'great_dragon_spear': 217,
  'sky_piercer': 218,
  'corrosion_scythe': 219,
  // Magic
  'enchanted_talisman': 301,
  'holy_crystal': 302,
  'ice_queen_wand': 303,
  'concentrated_energy': 304,
  'glowing_wand': 305,
  'fleeting_time': 308,
  'lightning_truncheon': 309,
  'genius_wand': 310,
  'divine_glaive': 311,
  'blood_wings': 312,
  'winter_crown': 313,
  'starlium_scythe': 314,
  'wishing_lantern': 315,
  'flask_of_the_oasis': 316,
  'feather_of_heaven': 317,
  'clock_of_destiny': 318,
  // Defense
  'athenas_shield': 401,
  'oracle': 402,
  'antique_cuirass': 403,
  'guardian_helmet': 405,
  'twilight_armor': 406,
  'dominance_ice': 407,
  'brute_force_breastplate': 408,
  'immortality': 409,
  'blade_armor': 410,
  'queens_wings': 411,
  'thunder_belt': 412,
  'radiant_armor': 413,
  // Jungler
  'jungle_ice': 601,
  'jungle_flame': 602,
  'jungle_behemoth': 603,
  // Roaming
  'roam_encourage': 501,
  'roam_conceal': 502,
  'roam_dire_hit': 503,
  'roam_favor': 504
};

export const getItemFandomName = (id: string): string => {
  // Fandom requires English names. Since our IDs are mostly English snake_case,
  // we can transform them or use a mapping for special cases.
  const fandomNameMap: Record<string, string> = {
    'sky_piercer': 'Sky_Piercer',
    'malefic_gun': 'Malefic_Gun',
    'great_dragon_spear': 'Great_Dragon_Spear',
    'wishing_lantern': 'Wishing_Lantern',
    'flask_of_the_oasis': 'Flask_of_the_Oasis',
    'winter_crown': 'Winter_Crown',
    'starlium_scythe': 'Starlium_Scythe',
    'blade_of_despair': 'Blade_of_Despair',
    'hunter_strike': 'Hunter_Strike',
    'sea_halberd': 'Sea_Halberd',
    'malefic_roar': 'Malefic_Roar',
    'haas_claws': 'Haas_Claws',
    'berserkers_fury': "Berserker's_Fury",
    'endless_battle': 'Endless_Battle',
    'windtalker': 'Windtalker',
    'heptaseas': 'Blade_of_the_Heptaseas',
    'war_axe': 'War_Axe',
    'rose_gold_meteor': 'Rose_Gold_Meteor',
    'golden_staff': 'Golden_Staff',
    'wind_of_nature': 'Wind_of_Nature',
    'corrosion_scythe': 'Corrosion_Scythe',
    'demon_hunter_sword': 'Demon_Hunter_Sword',
    'rapid_boots': 'Rapid_Boots',
    'warrior_boots': 'Warrior_Boots',
    'tough_boots': 'Tough_Boots',
    'magic_shoes': 'Magic_Shoes',
    'arcane_boots': 'Arcane_Boots',
    'swift_boots': 'Swift_Boots',
    'demon_shoes': 'Demon_Shoes',
    'athenas_shield': "Athena's_Shield",
    'oracle': 'Oracle',
    'antique_cuirass': 'Antique_Cuirass',
    'guardian_helmet': "Guardian_Helmet",
    'dominance_ice': 'Dominance_Ice',
    'brute_force_breastplate': 'Brute_Force_Breastplate',
    'immortality': 'Immortality',
    'blade_armor': 'Blade_Armor',
    'queens_wings': "Queen's_Wings",
    'thunder_belt': 'Thunder_Belt',
    'radiant_armor': 'Radiant_Armor'
  };

  return fandomNameMap[id] || id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_').replace('_Of_', '_of_');
};

const generateIconUrl = (id: string, name: string): string => {
  const customMap: Record<string, string> = {
    'haas_claws': 'https://liquipedia.net/commons/images/f/fa/Item_Haas%27s_Claws_ML.png',
    'jungle_ice': 'https://liquipedia.net/commons/images/thumb/9/97/Item_Ice_Retribution_ML.png/96px-Item_Ice_Retribution_ML.png',
    'jungle_flame': 'https://liquipedia.net/commons/images/6/63/Item_Flame_Retribution_ML.png',
    'jungle_behemoth': 'https://liquipedia.net/commons/images/d/d0/Item_Bloody_Retribution_ML.png',
    'roam_favor': 'https://liquipedia.net/commons/images/5/56/Item_Favor_ML.png',
    'roam_encourage': 'https://liquipedia.net/commons/images/4/40/Item_Encourage_ML.png',
    'roam_dire_hit': 'https://liquipedia.net/commons/images/1/1e/Item_Dire_Hit_ML.png',
    'roam_conceal': 'https://liquipedia.net/commons/images/a/aa/Item_Conceal_ML.png'
  };

  if (customMap[id]) {
    return customMap[id];
  }

  const nameForFandom = getItemFandomName(id);
  return getWikiaImageUrl(nameForFandom + '.png');
};

const _RAW_ITEMS: Omit<Item, 'iconUrl'>[] = [
  // --- CALZATURE ---
  {
    id: 'warrior_boots',
    name: 'Stivali del Guerriero',
    category: 'Movement',
    attributes: ['+40 Velocità di Movimento', '+22 Difesa Fisica'],
    passiveName: 'Valore',
    passiveDescription: 'Aumenta la Difesa Fisica di 5 per 3 secondi ogni volta che ricevi un attacco base (massimo 25).'
  },
  {
    id: 'tough_boots',
    name: 'Stivali Potenti',
    category: 'Movement',
    attributes: ['+40 Velocità di Movimento', '+22 Difesa Magica'],
    passiveName: 'Fortezza',
    passiveDescription: 'Riduce la durata degli effetti di controllo subiti del 30%.'
  },
  {
    id: 'arcane_boots',
    name: 'Stivali Arcani',
    category: 'Movement',
    attributes: ['+40 Velocità di Movimento', '+10 Penetrazione Magica'],
    passiveName: 'Nessuna',
    passiveDescription: 'Aumenta significativamente il danno magico iniziale.'
  },
  {
    id: 'swift_boots',
    name: 'Stivali Veloci',
    category: 'Movement',
    attributes: ['+40 Velocità di Movimento', '+15% Velocità d\'Attacco'],
    passiveName: 'Nessuna',
    passiveDescription: 'Ideale per tiratori che dipendono dagli attacchi base.'
  },
  {
    id: 'demon_shoes',
    name: 'Stivali Demoniaci',
    category: 'Movement',
    attributes: ['+40 Velocità di Movimento', '+10 Rigenerazione Mana'],
    passiveName: 'Misticismo',
    passiveDescription: 'Ottenere un\'uccisione o un assist su un eroe nemico o un minion rigenera il Mana.'
  },
  {
    id: 'rapid_boots',
    name: 'Stivali Rapidi',
    category: 'Movement',
    attributes: ['+65 Velocità di Movimento'],
    passiveName: 'Purificazione',
    passiveDescription: 'Riduce l\'effetto di rallentamento subito del 35%.'
  },
  {
    id: 'magic_shoes',
    name: 'Stivali Magici',
    category: 'Movement',
    attributes: ['+40 Velocità di Movimento', '+10% Riduzione Ricarica'],
    passiveName: 'Nessuna',
    passiveDescription: 'Riduce il tempo di ricarica di tutte le abilità.'
  },

  // --- ATTACCO FISICO ---
  {
    id: 'sky_piercer',
    name: 'Frantuma Cieli',
    category: 'Attack',
    attributes: ['+60 Attacco Adattivo', '+15 Velocità di Movimento'],
    passiveName: 'Annientamento',
    passiveDescription: 'Giustizia gli eroi nemici con meno del 6% di HP (aumenta con le uccisioni).'
  },
  {
    id: 'sea_halberd',
    name: 'Alabarda Marina',
    category: 'Attack',
    attributes: ['+80 Attacco Fisico', '+20% Velocità d\'Attacco'],
    passiveName: 'Punizione',
    passiveDescription: 'Riduce scudi e rigenerazione HP del nemico del 50%. Infligge danni bonus contro nemici con più HP massimi.'
  },
  {
    id: 'malefic_gun',
    name: 'Pistola Malefica',
    category: 'Attack',
    attributes: ['+40 Attacco Fisico', '+20% Velocità d\'Attacco'],
    passiveName: 'Malefic Energy',
    passiveDescription: 'Aumenta il raggio degli attacchi base e la velocità di movimento dopo un colpo.'
  },
  {
    id: 'great_dragon_spear',
    name: 'Grande Lancia Draconica',
    category: 'Attack',
    attributes: ['+70 Attacco Fisico', '+10% Riduzione Ricarica', '+20% Probabilità Critico'],
    passiveName: 'Guerriero',
    passiveDescription: 'Dopo aver lanciato un ultimate aumenta la velocita di movimento del 30% per 7.5 s.'
  },
  {
    id: 'blade_of_despair',
    name: 'Lama della Disperazione',
    category: 'Attack',
    attributes: ['+160 Attacco Fisico', '+5% Velocità di Movimento'],
    passiveName: 'Disperazione',
    passiveDescription: 'Attaccare nemici con meno del 50% di HP aumenta l\'Attacco Fisico del 25%.'
  },
  {
    id: 'endless_battle',
    name: 'Battaglia Infinita',
    category: 'Attack',
    attributes: ['+60 Attacco Fisico', '+250 PV', '+10% Riduzione Ricarica', '+5% Velocità Movimento', '+5 Rigenerazione Mana'],
    passiveName: 'Giustizia Divina',
    passiveDescription: 'Dopo un\'abilità, il prossimo attacco base infligge il 60% dell\'Attacco Fisico come Danno Puro.'
  },
  {
    id: 'berserkers_fury',
    name: 'Furia del Berserker',
    category: 'Attack',
    attributes: ['+65 Attacco Fisico', '+25% Probabilità Critico'],
    passiveName: 'Destino',
    passiveDescription: '+40% Danni Critici (Unico). I colpi critici aumentano l\'attacco fisico dell\'eroe del 5% per 2 secondi.'
  },
  {
    id: 'malefic_roar',
    name: 'Ruggito Malefico',
    category: 'Attack',
    attributes: ['+60 Attacco Fisico'],
    passiveName: 'Armor Buster',
    passiveDescription: 'La penetrazione fisica aumenta in base alla difesa fisica del nemico (max 40%).'
  },
  {
    id: 'demon_hunter_sword',
    name: 'Spada del Cacciatore di Demoni',
    category: 'Attack',
    attributes: ['+35 Attacco Fisico', '+20% Velocità d\'Attacco'],
    passiveName: 'Divorare',
    passiveDescription: 'Attacchi base infliggono l\'8% degli HP correnti del nemico come danno bonus. Fornisce rubavita.'
  },
  {
    id: 'corrosion_scythe',
    name: 'Falce della Corrosione',
    category: 'Attack',
    attributes: ['+30 Attacco Fisico', '+5% Velocità Movimento', '+30% Velocità d\'Attacco'],
    passiveName: 'Corrosione',
    passiveDescription: 'Attacchi base rallentano il nemico e aumentano la propria velocità d\'attacco.'
  },
  {
    id: 'golden_staff',
    name: 'Scettro Dorato',
    category: 'Attack',
    attributes: ['+55 Attacco Fisico', '+15% Velocità d\'Attacco'],
    passiveName: 'Swift',
    passiveDescription: 'Converte il critico in velocità d\'attacco. Ogni 3° attacco base attiva gli effetti sul colpo 3 volte.'
  },
  {
    id: 'wind_of_nature',
    name: 'Venti della Natura',
    category: 'Attack',
    attributes: ['+30 Attacco Fisico', '+20% Velocità d\'Attacco', '+10% Rubavita Fisico'],
    passiveName: 'Nessuna',
    passiveDescription: 'Indispensabile per i Tiratori contro gli assassini fisici.',
    activeName: 'Vento della Natura',
    activeDescription: 'Immunità a tutti i danni fisici per 2 secondi (1 secondo per non-Tiratori).'
  },
  {
    id: 'hunter_strike',
    name: 'Colpo del Cacciatore',
    category: 'Attack',
    attributes: ['+80 Attacco Fisico', '+10% Riduzione Ricarica', '+15 Penetrazione Fisica (Unica)'],
    passiveName: 'Castigo',
    passiveDescription: 'Infligge danni per 5 volte di fila agli eroi nemici o ai mostri e aumenta la velocità di movimento del 50% che cala rapidamente entro 3 s. Tale effetto ha un tempo di ricarica di 8 s.'
  },
  {
    id: 'heptaseas',
    name: 'Lama dei 7 Mari',
    category: 'Attack',
    attributes: ['+70 Attacco Fisico', '+250 PV'],
    passiveName: 'Imboscata',
    passiveDescription: 'Se non subisci/infliggi danni per 5s, il prossimo attacco base infligge danni bonus e rallenta.'
  },
  {
    id: 'war_axe',
    name: 'Ascia da Guerra',
    category: 'Attack',
    attributes: ['+35 Attacco Fisico', '+400 PV', '+10% Riduzione Ricarica', '+8% Rubavita Incantesimo'],
    passiveName: 'Fighting Spirit',
    passiveDescription: 'Rimanere in combattimento aumenta attacco e penetrazione. Al massimo delle cariche infligge danni puri.'
  },
  {
    id: 'rose_gold_meteor',
    name: 'Meteora d\'Oro Rosa',
    category: 'Attack',
    attributes: ['+30 Attacco Fisico', '+20% Velocità d\'Attacco', '+10% Rubavita Fisico'],
    passiveName: 'Life Line',
    passiveDescription: 'Ottieni uno scudo magico quando i tuoi HP scendono sotto il 30%.'
  },
  {
    id: 'haas_claws',
    name: 'Artigli di Haas',
    category: 'Attack',
    attributes: ['+40 Attacco Fisico', '+15% Probabilità Critico', '+20% Rubavita Fisico'],
    passiveName: 'Insanity',
    passiveDescription: 'Aumenta drasticamente il rubavita e fornisce velocità d\'attacco sui colpi critici.'
  },
  {
    id: 'windtalker',
    name: 'Sussurratore del Vento',
    category: 'Attack',
    attributes: ['+35% Velocità d\'Attacco', '+20% Probabilità Critico', '+20 Velocità di Movimento'],
    passiveName: 'Tifone',
    passiveDescription: 'Ogni 3-5 secondi, il prossimo attacco base colpisce 3 nemici infliggendo danni magici e aumentando la velocità.'
  },

  // --- MAGIA ---
  {
    id: 'wishing_lantern',
    name: 'Lanterna dei Desideri',
    category: 'Magic',
    attributes: ['+75 Potere Magico', '+400 Mana', '+10% Riduzione Ricarica'],
    passiveName: 'Butterfly Goddess',
    passiveDescription: 'Ogni 800 danni magici inflitti, lancia una farfalla che infligge danni pari al 10% degli HP correnti del nemico.'
  },
  {
    id: 'holy_crystal',
    name: 'Cristallo Sacro',
    category: 'Magic',
    attributes: ['+165 Potere Magico'],
    passiveName: 'Mistero',
    passiveDescription: 'Aumenta il Potere Magico totale del 21%-35% (scala con il livello).'
  },
  {
    id: 'divine_glaive',
    name: 'Spada Divina',
    category: 'Magic',
    attributes: ['+60 Potere Magico'],
    passiveName: 'Spellbreaker',
    passiveDescription: 'Aumenta la penetrazione magica in base alla difesa magica del nemico.'
  },
  {
    id: 'lightning_truncheon',
    name: 'Manganello di fulmini',
    category: 'Magic',
    attributes: ['+75 Potere Magico', '+400 Mana', '+10% Riduzione Ricarica'],
    passiveName: 'Risonanza',
    passiveDescription: 'Ogni 6 secondi, la prossima abilità rimbalza sui nemici infliggendo danni magici scalati col Mana.'
  },
  {
    id: 'clock_of_destiny',
    name: 'Orologio del Destino',
    category: 'Magic',
    attributes: ['+45 Potere Magico', '+400 PV', '+400 Mana', '+10% Riduzione Ricarica'],
    passiveName: 'Destino',
    passiveDescription: 'Colpire un eroe nemico con un\'abilità magica fornisce 1 carica di Destino ogni 0.4s (fino a 10 cariche). Ogni carica aumenta la Difesa Ibrida di 2-4 per 5s.'
  },
  {
    id: 'glowing_wand',
    name: 'Bacchetta Scintillante',
    category: 'Magic',
    attributes: ['+60 Potere Magico', '+300 PV', '+5% Velocità di Movimento'],
    passiveName: 'Scorch',
    passiveDescription: 'Brucia il nemico per 3 secondi infliggendo danni costanti pari all\'1.5% dei PS massimi e riducendo le cure ricevute.'
  },
  {
    id: 'starlium_scythe',
    name: 'Falce Starlium',
    category: 'Magic',
    attributes: ['+75 Potere Magico', '+10% Riduzione Ricarica', '+8% Rubavita Ibrido', '+6 Rigenerazione Mana'],
    passiveName: 'Crisis Management',
    passiveDescription: 'Dopo un\'abilità, il prossimo attacco base infligge Danno Puro pari al 100% del Potere Magico.'
  },
  {
    id: 'genius_wand',
    name: 'Bacchetta del Genio',
    category: 'Magic',
    attributes: ['+75 Potere Magico', '+5% Velocità di Movimento'],
    passiveName: 'Magic',
    passiveDescription: 'Infliggere danno magico riduce la difesa magica del nemico per 2 secondi.'
  },
  {
    id: 'concentrated_energy',
    name: 'Energia Concentrata',
    category: 'Magic',
    attributes: ['+75 Potere Magico', '+400 PV'],
    passiveName: 'Recharge',
    passiveDescription: 'Uccidere un eroe rigenera il 10% degli HP. Aumenta il danno magico stando in combattimento.'
  },
  {
    id: 'ice_queen_wand',
    name: 'Bacchetta della Regina di Ghiaccio',
    category: 'Magic',
    attributes: ['+60 Potere Magico', '+10% Rubavita Magico', '+300 PV', '+7% Velocità Movimento'],
    passiveName: 'Ice Bound',
    passiveDescription: 'Le abilità rallentano il nemico del 15% (fino a 2 cariche) per 3 secondi.'
  },
  {
    id: 'enchanted_talisman',
    name: 'Talismano Incantato',
    category: 'Magic',
    attributes: ['+75 Potere Magico', '+300 PV', '+15% Riduzione Ricarica'],
    passiveName: 'Mana Spring',
    passiveDescription: 'Rigenera il 15% del Mana massimo ogni 10 secondi.'
  },
  {
    id: 'fleeting_time',
    name: 'Tempo Fugace',
    category: 'Defense',
    attributes: ['+30 Attacco Adattivo', '+600 PV', '+15% Riduzione CD'],
    passiveName: 'Flusso Temporale',
    passiveDescription: 'Uccisioni e assist riducono la ricarica dell\'Ultimate del 30%.'
  },
  {
    id: 'blood_wings',
    name: 'Ali di Sangue',
    category: 'Magic',
    attributes: ['+90 Potere Magico'],
    passiveName: 'Guardia',
    passiveDescription: 'Fornisce un enorme scudo basato sul potere magico. Aumenta la velocità quando lo scudo è attivo.'
  },
  {
    id: 'winter_crown',
    name: 'Diadema Invernale',
    category: 'Magic',
    attributes: ['+45 Attacco Adattivo', '+400 PV', '+5% Riduzione CD'],
    passiveName: 'Nessuna',
    passiveDescription: 'Fondamentale per sopravvivere alle combo nemiche.',
    activeName: 'Congelamento',
    activeDescription: 'Diventa immune a tutto per 2 secondi. Non puoi muoverti.'
  },
  {
    id: 'feather_of_heaven',
    name: 'Piuma del Paradiso',
    category: 'Magic',
    attributes: ['+60 Potere Magico', '+20% Velocità d\'Attacco', '+10% Rubavita Magico', '+5% Riduzione Ricarica'],
    passiveName: 'Afflizione',
    passiveDescription: 'Attacchi base infliggono danni magici extra pari al 50% del Potere Magico.'
  },

  // --- DIFESA ---
  {
    id: 'dominance_ice',
    name: 'Ghiaccio Dominante',
    category: 'Defense',
    attributes: ['+500 Mana', '+70 Difesa Fisica', '+5% Velocità Movimento'],
    passiveName: 'Arctic Cold',
    passiveDescription: 'Riduce velocità d\'attacco (70%), scudi e rigenerazione HP (50%) dei nemici vicini.'
  },
  {
    id: 'athenas_shield',
    name: 'Scudo di Atena',
    category: 'Defense',
    attributes: ['+900 PV', '+62 Difesa Magica', '+4 Rigenerazione HP'],
    passiveName: 'Shield',
    passiveDescription: 'Riduce il danno magico subito del 25% per 3s dopo averlo ricevuto. Si ricarica fuori combattimento.'
  },
  {
    id: 'radiant_armor',
    name: 'Armatura Splendente',
    category: 'Defense',
    attributes: ['+950 PV', '+52 Difesa Magica', '+12 Rigenerazione HP'],
    passiveName: 'Holy Blessing',
    passiveDescription: 'Riduce il danno magico continuo subito (ottimo contro Chang\'e o Valir).'
  },
  {
    id: 'antique_cuirass',
    name: 'Armatura Antica',
    category: 'Defense',
    attributes: ['+920 PV', '+54 Difesa Fisica', '+4 Rigenerazione HP'],
    passiveName: 'Deterrente',
    passiveDescription: 'Essere colpiti da abilità riduce l\'attacco fisico del nemico dell\'8% (fino a 3 cariche).'
  },
  {
    id: 'immortality',
    name: 'Immortalità',
    category: 'Defense',
    attributes: ['+800 PV', '+20 Difesa Fisica'],
    passiveName: 'Immortal',
    passiveDescription: 'Resuscita dopo 2.5 secondi con una porzione di HP e uno scudo.'
  },
  {
    id: 'blade_armor',
    name: 'Armatura di Lame',
    category: 'Defense',
    attributes: ['+90 Difesa Fisica', '+20% Riduzione Danno Critico'],
    passiveName: 'Vendetta',
    passiveDescription: 'Riflette una parte dei danni da attacco base ricevuti e rallenta l\'attaccante.'
  },
  {
    id: 'guardian_helmet',
    name: 'Elmo del Guardiano',
    category: 'Defense',
    attributes: ['+1550 PV', '+20 Rigenerazione HP'],
    passiveName: 'Recovery',
    passiveDescription: 'Rigenera HP massimi al secondo fuori dal combattimento.'
  },
  {
    id: 'twilight_armor',
    name: 'Corazza del Crepuscolo',
    category: 'Defense',
    attributes: ['+1200 PV', '+20 Difesa Fisica'],
    passiveName: 'Twilight',
    passiveDescription: 'Riduce il danno subito dai colpi esplosivi (Burst) sopra una certa soglia.'
  },
  {
    id: 'oracle',
    name: 'Oracolo',
    category: 'Defense',
    attributes: ['+850 PV', '+25 Difesa Fisica', '+25 Difesa Magica', '+10% Riduzione Ricarica'],
    passiveName: 'Blessing',
    passiveDescription: 'Aumenta l\'efficacia di scudi e rigenerazione HP ricevuti del 30%.'
  },
  {
    id: 'brute_force_breastplate',
    name: 'Corazza della Forza Bruta',
    category: 'Defense',
    attributes: ['+600 PV', '+30 Difesa Fisica', '+10% Riduzione Ricarica'],
    passiveName: 'Brute Force',
    passiveDescription: 'Attacchi e abilità aumentano difesa e velocità di movimento. Fornisce riduzione CC.'
  },
  {
    id: 'thunder_belt',
    name: 'Cintura di Fulmini',
    category: 'Defense',
    attributes: ['+800 PV', '+15 Difesa Fisica', '+15 Difesa Magica', '+5% Velocità di Movimento'],
    passiveName: 'Thunderbolt',
    passiveDescription: 'Dopo un\'abilità, il prossimo attacco base infligge danni puri e rallenta. Aumenta difesa permanentemente.'
  },
  {
    id: 'queens_wings',
    name: 'Ali della Regina',
    category: 'Defense',
    attributes: ['+750 PV', '+30 Attacco Adattivo', '+10% Riduzione Ricarica', '+10% Rubavita Abilità'],
    passiveName: 'Demonize',
    passiveDescription: 'Riduce il danno subito del 30% quando gli HP scendono sotto il 40% e aumenta il rubavita incantesimo.'
  },
  {
    id: 'steel_legplates',
    name: 'Gambali d\'Acciaio',
    category: 'Defense',
    attributes: ['+45 Difesa Fisica'],
    passiveName: 'Nessuna',
    passiveDescription: 'Ottimo componente di difesa fisica da inizio partita.'
  },

  // --- SUPPORT / ROAMING / JUNGLE ---
  {
    id: 'flask_of_the_oasis',
    name: 'Fiaschetta dell\'Oasi',
    category: 'Magic',
    attributes: ['+60 Potere Magico', '+300 PV', '+10% Riduzione Ricarica'],
    passiveName: 'Blessing',
    passiveDescription: 'Curare o fornire scudo a un alleato a bassa salute gli fornisce uno scudo extra.'
  },
  {
    id: 'jungle_ice',
    name: 'Retribuzione Glaciale',
    category: 'Jungler',
    attributes: [],
    passiveName: 'Cacciatore',
    passiveDescription: 'Ruba velocità di movimento al bersaglio.'
  },
  {
    id: 'jungle_flame',
    name: 'Retribuzione Incandescente',
    category: 'Jungler',
    attributes: [],
    passiveName: 'Cacciatore',
    passiveDescription: 'Ruba attacco fisico e magico al bersaglio.'
  },
  {
    id: 'jungle_behemoth',
    name: 'Retribuzione Sanguinaria',
    category: 'Jungler',
    attributes: [],
    passiveName: 'Cacciatore',
    passiveDescription: 'Ruba HP massimi al bersaglio.'
  },
  {
    id: 'roam_encourage',
    name: 'Incoraggia',
    category: 'Roaming',
    attributes: [],
    passiveName: 'Passiva',
    passiveDescription: 'Aumenta Attacco e Velocità d\'Attacco degli alleati vicini.'
  },
  {
    id: 'roam_conceal',
    name: 'Occultamento',
    category: 'Roaming',
    attributes: [],
    passiveName: 'Attiva',
    passiveDescription: 'Rende gli alleati vicini invisibili e aumenta la velocità di movimento.'
  },
  {
    id: 'roam_dire_hit',
    name: 'Colpo Catastrofico',
    category: 'Roaming',
    attributes: [],
    passiveName: 'Passiva',
    passiveDescription: 'Infligge danni bonus pesanti quando colpisci nemici con HP bassi.'
  },
  {
    id: 'roam_favor',
    name: 'Favore',
    category: 'Roaming',
    attributes: [],
    passiveName: 'Passiva',
    passiveDescription: 'Curare o fornire scudo cura anche l\'alleato con meno HP vicino.'
  }
];

export const OFFICIAL_ITEMS: Item[] = _RAW_ITEMS.map(item => ({
  ...item,
  iconUrl: generateIconUrl(item.id, item.name)
}));

const getItem = (id: string) => OFFICIAL_ITEMS.find(i => i.id === id)!;

export const ITEMS: Record<string, Item> = {
  MAGIC_SHOES: getItem('magic_shoes'),
  WARRIOR_BOOTS: getItem('warrior_boots'),
  TOUGH_BOOTS: getItem('tough_boots'),
  SWIFT_BOOTS: getItem('swift_boots'),
  ARCANE_BOOTS: getItem('arcane_boots'),
  RAPID_BOOTS: getItem('rapid_boots'),
  DEMON_SHOES: getItem('demon_shoes'),
  
  JUNGLE_ICE: getItem('jungle_ice'),
  JUNGLE_FLAME: getItem('jungle_flame'),
  JUNGLE_BEHEMOTH: getItem('jungle_behemoth'),

  ROAM_ENCOURAGE: getItem('roam_encourage'),
  ROAM_CONCEAL: getItem('roam_conceal'),
  ROAM_DIRE_HIT: getItem('roam_dire_hit'),
  ROAM_FAVOR: getItem('roam_favor'),

  SKY_PIERCER: getItem('sky_piercer'),
  MALEFIC_GUN: getItem('malefic_gun'),
  GREAT_DRAGON_SPEAR: getItem('great_dragon_spear'),
  BLADE_OF_DESPAIR: getItem('blade_of_despair'),
  ENDLESS_BATTLE: getItem('endless_battle'),
  BERSERKERS_FURY: getItem('berserkers_fury'),
  MALEFIC_ROAR: getItem('malefic_roar'),
  DEMON_HUNTER_SWORD: getItem('demon_hunter_sword'),
  CORROSION_SCYTHE: getItem('corrosion_scythe'),
  GOLDEN_STAFF: getItem('golden_staff'),
  WIND_OF_NATURE: getItem('wind_of_nature'),
  HUNTER_STRIKE: getItem('hunter_strike'),
  HEPTASEAS: getItem('heptaseas'),
  WAR_AXE: getItem('war_axe'),
  ROSE_GOLD_METEOR: getItem('rose_gold_meteor'),
  HAAS_CLAWS: getItem('haas_claws'),
  SEA_HALBERD: getItem('sea_halberd'),

  WISHING_LANTERN: getItem('wishing_lantern'),
  HOLY_CRYSTAL: getItem('holy_crystal'),
  DIVINE_GLAIVE: getItem('divine_glaive'),
  LIGHTNING_TRUNCHEON: getItem('lightning_truncheon'),
  CLOCK_OF_DESTINY: getItem('clock_of_destiny'),
  GLOWING_WAND: getItem('glowing_wand'),
  STARLIUM_SCYTHE: getItem('starlium_scythe'),
  GENIUS_WAND: getItem('genius_wand'),
  CONCENTRATED_ENERGY: getItem('concentrated_energy'),
  ICE_QUEEN_WAND: getItem('ice_queen_wand'),
  ENCHANTED_TALISMAN: getItem('enchanted_talisman'),
  FLEETING_TIME: getItem('fleeting_time'),
  BLOOD_WINGS: getItem('blood_wings'),
  WINTER_CROWN: getItem('winter_crown'),
  FLASK_OF_THE_OASIS: getItem('flask_of_the_oasis'),
  WINDTALKER: getItem('windtalker'),
  FEATHER_OF_HEAVEN: getItem('feather_of_heaven'),

  DOMINANCE_ICE: getItem('dominance_ice'),
  ATHENAS_SHIELD: getItem('athenas_shield'),
  RADIANT_ARMOR: getItem('radiant_armor'),
  ANTIQUE_CUIRASS: getItem('antique_cuirass'),
  IMMORTALITY: getItem('immortality'),
  BLADE_ARMOR: getItem('blade_armor'),
  GUARDIAN_HELMET: getItem('guardian_helmet'),
  TWILIGHT_ARMOR: getItem('twilight_armor'),
  ORACLE: getItem('oracle'),
  BRUTE_FORCE_BREASTPLATE: getItem('brute_force_breastplate'),
  THUNDER_BELT: getItem('thunder_belt'),
  QUEENS_WINGS: getItem('queens_wings'),
  STEEL_LEGPLATES: getItem('steel_legplates')
};
