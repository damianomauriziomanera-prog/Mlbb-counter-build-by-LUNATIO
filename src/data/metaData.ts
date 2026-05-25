import { MetaHero } from '../types';
import { HEROES } from './heroes';

// Importa i dati live aggiornati dallo scraper (se disponibili)
import liveMetaRaw from './liveMeta.json';

const findHero = (id: string) => HEROES.find(h => h.id === id);

// Interfaccia per i dati live
interface LiveMetaEntry {
  winRate: number;
  pickRate: number;
  banRate: number;
}

interface LiveMetaFile {
  lastUpdated?: string;
  source?: string;
  heroCount?: number;
  heroes?: Record<string, LiveMetaEntry>;
}

// Estrai i dati live (se il file è stato popolato dallo scraper)
const liveData: LiveMetaFile = liveMetaRaw as LiveMetaFile;
const liveHeroes: Record<string, LiveMetaEntry> = liveData?.heroes || {};

// Esporta la data dell'ultimo aggiornamento per l'UI
export const META_LAST_UPDATED: string | null = liveData?.lastUpdated || null;
export const META_SOURCE: string | null = liveData?.source || null;

// Dati di fallback: usati SOLO se lo scraper non ha ancora popolato liveMeta.json
const FALLBACK_META_DATA: Record<string, { winRate: number; pickRate: number; banRate: number; tier: string }> = {
  'nolan': { winRate: 54.2, pickRate: 1.2, banRate: 65.4, tier: 'S+' },
  'faramis': { winRate: 53.8, pickRate: 0.8, banRate: 45.2, tier: 'S+' },
  'diggie': { winRate: 53.5, pickRate: 1.5, banRate: 58.1, tier: 'S+' },
  'mathilda': { winRate: 53.1, pickRate: 0.9, banRate: 42.5, tier: 'S+' },
  'harith': { winRate: 52.8, pickRate: 2.1, banRate: 12.4, tier: 'S' },
  'roger': { winRate: 52.5, pickRate: 3.4, banRate: 8.2, tier: 'S' },
  'carmilla': { winRate: 52.2, pickRate: 0.5, banRate: 2.1, tier: 'A' },
  'terizla': { winRate: 52.0, pickRate: 2.8, banRate: 5.4, tier: 'S' },
  'arlott': { winRate: 51.8, pickRate: 1.8, banRate: 25.6, tier: 'A' },
  'yin': { winRate: 51.5, pickRate: 4.2, banRate: 15.2, tier: 'B' },
  'lesley': { winRate: 51.2, pickRate: 5.1, banRate: 3.4, tier: 'B' },
  'nana': { winRate: 50.8, pickRate: 6.2, banRate: 10.1, tier: 'A' }
};

// Funzione helper per calcolo deterministico stabile per eroi senza dati
const getStableHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Calcola il tier basandosi sulle statistiche
function computeTier(winRate: number, pickRate: number, banRate: number): 'S+' | 'S' | 'A' | 'B' | 'C' {
  const score = winRate * 0.35 + banRate * 0.45 + pickRate * 0.2;
  if (score > 32) return 'S+';
  if (score > 26) return 'S';
  if (score > 21) return 'A';
  if (score > 18) return 'B';
  return 'C';
}

export const META_HEROES: MetaHero[] = HEROES.map(hero => {
  // PRIORITÀ 1: Dati LIVE dallo scraper (fonte più aggiornata)
  const live = liveHeroes[hero.id];
  if (live && live.winRate > 0) {
    return {
      ...hero,
      winRate: live.winRate,
      pickRate: live.pickRate,
      banRate: live.banRate,
      tier: computeTier(live.winRate, live.pickRate, live.banRate)
    };
  }

  // PRIORITÀ 2: Dati di fallback hardcoded (eroi chiave)
  const fallback = FALLBACK_META_DATA[hero.id];
  if (fallback) {
    return { ...hero, ...fallback };
  }

  // PRIORITÀ 3: Generazione deterministica per eroi senza dati
  const hash = getStableHash(hero.id);
  
  let baseWinRate = 50.0;
  let basePickRate = 2.0;
  let baseBanRate = 4.0;
  
  const role = hero.role.toLowerCase();
  if (role.includes('assassin')) {
    baseWinRate = 50.4; basePickRate = 2.5; baseBanRate = 18.0;
  } else if (role.includes('marksman')) {
    baseWinRate = 49.5; basePickRate = 4.2; baseBanRate = 6.0;
  } else if (role.includes('fighter')) {
    baseWinRate = 50.1; basePickRate = 3.0; baseBanRate = 5.0;
  } else if (role.includes('mage')) {
    baseWinRate = 50.2; basePickRate = 3.5; baseBanRate = 10.0;
  } else if (role.includes('tank')) {
    baseWinRate = 49.6; basePickRate = 2.2; baseBanRate = 8.5;
  } else if (role.includes('support')) {
    baseWinRate = 50.9; basePickRate = 1.3; baseBanRate = 3.0;
  }

  const winRate = Number((baseWinRate + ((hash % 24) - 12) / 10).toFixed(1));
  const pickRate = Number((basePickRate + ((hash % 30) - 15) / 10).toFixed(1));
  const finalPickRate = Math.max(0.4, Math.min(12, pickRate));
  const banRate = Number((baseBanRate + ((hash % 150) - 75) / 10).toFixed(1));
  const finalBanRate = Math.max(0, Math.min(85, banRate));

  const tier = computeTier(winRate, finalPickRate, finalBanRate);

  return {
    ...hero,
    winRate,
    pickRate: finalPickRate,
    banRate: finalBanRate,
    tier
  };
}).filter(h => h.id !== undefined) as MetaHero[];
