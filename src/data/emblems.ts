import { Emblem, Talent, TalentTier } from '../types';
import { getWikiaImageUrl } from '../lib/md5';

const getEmblemIcon = (name: string) => getWikiaImageUrl(`${name}.png`);
const getTalentIcon = (name: string) => getWikiaImageUrl(`${name}.png`);

export const EMBLEMS: Record<string, Emblem> = {
  BASIC: {
    id: 'basic',
    name: 'Base Comune',
    iconUrl: getEmblemIcon('Basic_Common_Emblem'),
    stats: ['+12 Rigenerazione Ibrida', '+275 PV', '+22 Attacco Adattivo']
  },
  TANK: {
    id: 'tank',
    name: 'Tank',
    iconUrl: getEmblemIcon('Custom_Tank_Emblem'),
    stats: ['+500 PV', '+10 Difesa Ibrida', '+4 Rigenerazione PV']
  },
  ASSASSIN: {
    id: 'assassin',
    name: 'Assassino',
    iconUrl: getEmblemIcon('Custom_Assassin_Emblem'),
    stats: ['+14 Penetrazione Adattiva', '+10 Attacco Adattivo', '+3% Velocità di Movimento']
  },
  MAGE: {
    id: 'mage',
    name: 'Mago',
    iconUrl: getEmblemIcon('Custom_Mage_Emblem'),
    stats: ['+30 Attacco Magico', '+5% Riduzione CD', '+8 Penetrazione Magica']
  },
  FIGHTER: {
    id: 'fighter',
    name: 'Combattente',
    iconUrl: getEmblemIcon('Custom_Fighter_Emblem'),
    stats: ['+10% Rubavita Ibrido', '+16 Attacco Adattivo', '+8 Difesa Ibrida']
  },
  SUPPORT: {
    id: 'support',
    name: 'Support',
    iconUrl: getEmblemIcon('Custom_Support_Emblem'),
    stats: ['+12% Effetto Guarigione', '+10% Riduzione CD', '+6% Velocità di Movimento']
  },
  MARKSMAN: {
    id: 'marksman',
    name: 'Tiratore',
    iconUrl: getEmblemIcon('Custom_Marksman_Emblem'),
    stats: ['+15% Velocità di Attacco', '+16 Attacco Adattivo', '+10% Penetrazione Adattiva']
  }
};

export const GLOBAL_TALENTS: TalentTier = {
  tier1: [
    { id: 'thrill', name: 'Fremito', description: 'Guadagna 16 Attacco Adattivo.', iconUrl: getTalentIcon('Thrill') },
    { id: 'swift', name: 'Rapido', description: 'Ottieni il 10% di Velocità di Attacco extra.', iconUrl: getTalentIcon('Swift') },
    { id: 'vitality', name: 'Vitalità', description: 'Ottieni 225 PV Massimi extra.', iconUrl: getTalentIcon('Vitality') },
    { id: 'rupture', name: 'Rottura', description: 'Ottieni 5 Penetrazione Adattiva.', iconUrl: getTalentIcon('Rupture') },
    { id: 'inspire', name: 'Ispirazione', description: 'La Riduzione del Cooldown aumenta del 5% e la Rigenerazione Mana del 2%.', iconUrl: getTalentIcon('Inspire') },
    { id: 'firmness', name: 'Fermezza', description: 'Ottieni 8 Difesa Fisica e Magica extra.', iconUrl: getTalentIcon('Firmness') },
    { id: 'agility', name: 'Agilità', description: 'Guadagna il 4% di Velocità di Movimento extra.', iconUrl: getTalentIcon('Agility') },
    { id: 'fatal', name: 'Letale', description: 'Ottieni il 5% di Possibilità di Critico extra e il 5% di Danni Critici extra.', iconUrl: getTalentIcon('Fatal') },
  ],
  tier2: [
    { id: 'wilderness_blessing', name: 'Benedizione del Deserto', description: 'Velocità di Movimento extra nella giungla e nel fiume.', iconUrl: getTalentIcon('Wilderness_Blessing') },
    { id: 'seasoned_hunter', name: 'Cacciatore Esperto', description: 'Aumenta la velocità nel giunglare. +15% danni contro Lord e Tartaruga.', iconUrl: getTalentIcon('Seasoned_Hunter') },
    { id: 'tenacity', name: 'Tenacia', description: 'Aumenta la difesa con PV bassi. Quando i PV sono sotto il 50%, la riduzione danni aumenta del 5%.', iconUrl: getTalentIcon('Tenacity') },
    { id: 'master_assassin', name: 'Maestro Assassino', description: 'Aumenta i danni contro eroi soli. +7% aumento danno contro eroe solo.', iconUrl: getTalentIcon('Master_Assassin') },
    { id: 'bargain_hunter', name: 'A Caccia d\'Affari', description: 'Riduce il costo dell\'equipaggiamento. L\'equipaggiamento può essere acquistato al 95% del costo base.', iconUrl: getTalentIcon('Bargain_Hunter') },
    { id: 'festival_of_blood', name: 'Festival di Sangue', description: 'Ottieni il 6% di Rubavita Abilità. Ogni uccisione o assist garantisce un ulteriore 0.5% di Rubavita Abilità fino ad un massimo di 12 cariche.', iconUrl: getTalentIcon('Festival_of_Blood') },
    { id: 'pull_yourself_together', name: 'Datti una Calmata!', description: 'I cooldown degli incantesimi di battaglia e delle abilità attive dell\'equipaggiamento sono ridotti del 12% inizialmente. Ogni uccisione o assist fornisce una riduzione aggiuntiva del 1% accumulabile fino a 8 cariche.', iconUrl: getTalentIcon('Pull_Yourself_Together') },
    { id: 'weapons_master', name: 'Maestro delle Armi', description: 'L\'attacco bonus fisico e magico conferiti dall\'equipaggiamento, emblemi e abilità sono aumentati dell\'8%.', iconUrl: getTalentIcon('Weapons_Master') },
  ],
  tier3: [
    { id: 'impure_rage', name: 'Furia Impura', description: 'Infliggere danni con le abilità infligge il 4% dei PV massimi del bersaglio come danni adattivi extra e ripristina il 2% di Mana per colpo.', iconUrl: getTalentIcon('Impure_Rage') },
    { id: 'quantum_charge', name: 'Carica Quantistica', description: 'Infliggere danni con attacco base aumenta la Velocità di Movimento del 30% per 1.5s e ripristina 75-180 PV (scala con il livello).', iconUrl: getTalentIcon('Quantum_Charge') },
    { id: 'war_cry', name: 'Grido di Guerra', description: 'Dopo ogni 3 attacchi base o abilità che colpiscono il nemico, tutti i danni inflitti aumentano dell\'8% per 6 secondi.', iconUrl: getTalentIcon('War_Cry') },
    { id: 'temporal_reign', name: 'Regno Temporale', description: 'Lanciare una Ultimate riduce il cooldown residuo delle abilità attive di 1.5 volte entro 4s. Questo effetto viene esteso di 2s dopo aver ottenuto uccisioni o assist.', iconUrl: getTalentIcon('Temporal_Reign') },
    { id: 'concussive_blast', name: 'Esplosione Violenta', description: 'L\'attacco base successivo infligge 100 (+7% PV Totali) danni magici extra ai nemici vicini.', iconUrl: getTalentIcon('Concussive_Blast') },
    { id: 'killing_spree', name: 'Serie di Uccisioni', description: 'Quando infliggi danni ad un eroe con meno del 30% di PV, recupera istantaneamente il 15% dei PV persi e ottieni il 20% di Velocità di Movimento.', iconUrl: getTalentIcon('Killing_Spree') },
    { id: 'lethal_ignition', name: 'Ignizione Letale', description: 'Infliggere danni superiori al 7% dei PV massimi dell\'eroe nemico per 3 volte entro 5s farà sì che il bersaglio subisca altri 162-750 danni adattivi come bruciatura (scala con il livello).', iconUrl: getTalentIcon('Lethal_Ignition') },
    { id: 'brave_smite', name: 'Punizione Coraggiosa', description: 'Infliggere danni da abilità su un eroe nemico ripristina il 5% dei PV massimi.', iconUrl: getTalentIcon('Brave_Smite') },
    { id: 'focusing_mark', name: 'Marchio sul Bersaglio', description: 'Dopo aver inflitto danni ad un eroe nemico, gli eroi alleati infliggono un ulteriore 6% di danni e ottengono il 10% di Velocità di Movimento.', iconUrl: getTalentIcon('Focusing_Mark') },
    { id: 'weakness_finder', name: 'Cercatore di Debolezze', description: 'Gli attacchi base rallentano i nemici del 50% e riducono la loro Velocità di Attacco del 30%.', iconUrl: getTalentIcon('Weakness_Finder') },
  ],
};
