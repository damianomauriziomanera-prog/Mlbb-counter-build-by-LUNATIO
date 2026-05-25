import { Spell } from '../types';
import { getWikiaImageUrl } from '../lib/md5';

export const SPELLS: Record<string, Spell> = {
  EXECUTE: {
    id: 'execute',
    name: 'Esecuzione',
    description: 'Infligge Danno Puro pari a 100 (+10 per livello) più il 13% degli HP persi del nemico.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Execute.png')
  },
  RETRIBUTION: {
    id: 'retribution',
    name: 'Retribuzione',
    description: 'Infligge danni ai mostri o minion e riduce i danni subiti dai mostri.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Retribution.png')
  },
  INSPIRE: {
    id: 'inspire',
    name: 'Ispirazione',
    description: "Aumenta drasticamente la velocità d'attacco e ignora parte della difesa nemica.",
    iconUrl: getWikiaImageUrl('Battle_Spell_Inspire.png')
  },
  SPRINT: {
    id: 'sprint',
    name: 'Sprint',
    description: 'Aumenta la velocità di movimento del 50% e fornisce immunità ai rallentamenti.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Sprint.png')
  },
  REVITALIZE: {
    id: 'revitalize',
    name: 'Revitalizza',
    description: 'Crea una zona che cura te e i tuoi alleati vicini.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Revitalize.png')
  },
  AEGIS: {
    id: 'aegis',
    name: 'Egida',
    description: 'Ottieni istantaneamente uno scudo che assorbe danni per 3 secondi.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Aegis.png')
  },
  PETRIFY: {
    id: 'petrify',
    name: 'Pietrifica',
    description: 'Pietrifica i nemici vicini per 0.8 secondi infliggendo danni magici.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Petrify.png')
  },
  PURIFY: {
    id: 'purify',
    name: 'Purifica',
    description: 'Rimuove tutti i debuff e gli effetti di controllo (CC) e fornisce immunità breve.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Purify.png')
  },
  FLAMESHOT: {
    id: 'flameshot',
    name: 'Colpo di Fiamma',
    description: 'Lancia un proiettile di fuoco che infligge danni magici e respinge i nemici vicini.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Flameshot.png')
  },
  FLICKER: {
    id: 'flicker',
    name: 'Flicker',
    description: 'Ti teletrasporta istantaneamente a una breve distanza nella direzione scelta.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Flicker.png')
  },
  ARRIVAL: {
    id: 'arrival',
    name: 'Teletrasporto',
    description: 'Teletrasportati su un minion, una torre o una trappola alleata dopo 3 secondi.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Arrival.png')
  },
  VENGEANCE: {
    id: 'vengeance',
    name: 'Vendetta',
    description: 'Riduce i danni subiti e riflette una parte dei danni da attacco base.',
    iconUrl: getWikiaImageUrl('Battle_Spell_Vengeance.png')
  }
};

export const OFFICIAL_SPELLS = Object.values(SPELLS);
