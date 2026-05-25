import { Hero, Item } from '../types';
import { ITEMS } from '../data/items';
import { HEROES } from '../data/heroes';

export type MatchResult = 'Vittoria' | 'Sconfitta';

export interface MatchData {
  id: string;
  heroId: string;
  result: MatchResult;
  kills: number;
  deaths: number;
  assists: number;
  durationInMinutes: number;
  enemyHeroes: Hero[];
  build: Item[];
  mvp: boolean;
  score: number;
}

export function generateSimulatedMatches(hero: Hero | null | undefined, count: number = 5): MatchData[] {
  const matches: MatchData[] = [];
  const heroesList = HEROES;
  const itemsList = Object.values(ITEMS);

  for (let i = 0; i < count; i++) {
    // Determine hero
    const matchHero = hero || heroesList[Math.floor(Math.random() * heroesList.length)];
    
    // Simulate result
    const isWin = Math.random() > 0.45; // 55% win rate base
    
    // Simulate KDA based on role
    let k = 0, d = 0, a = 0;
    if (matchHero.role.includes('Assassin') || matchHero.role.includes('Marksman')) {
      k = Math.floor(Math.random() * 15) + (isWin ? 5 : 0);
      d = Math.floor(Math.random() * 8) + (isWin ? 1 : 4);
      a = Math.floor(Math.random() * 10) + 2;
    } else if (matchHero.role.includes('Tank') || matchHero.role.includes('Support')) {
      k = Math.floor(Math.random() * 4) + 0;
      d = Math.floor(Math.random() * 10) + (isWin ? 2 : 5);
      a = Math.floor(Math.random() * 20) + (isWin ? 10 : 5);
    } else {
      k = Math.floor(Math.random() * 10) + (isWin ? 3 : 1);
      d = Math.floor(Math.random() * 8) + (isWin ? 2 : 4);
      a = Math.floor(Math.random() * 12) + (isWin ? 5 : 2);
    }

    // Ensure no division by zero in KDA calculations later
    if (d === 0) d = 1;

    const kdaRatio = (k + a) / d;
    const isMvp = isWin && kdaRatio > 4;

    // Simulate enemies
    const enemyHeroes: Hero[] = [];
    const availableHeroes = [...heroesList].sort(() => 0.5 - Math.random());
    for (let j = 0; j < 5; j++) {
      enemyHeroes.push(availableHeroes[j]);
    }

    // Simulate build
    const build: Item[] = [];
    const bootItems = itemsList.filter(item => item.category === 'Movement');
    const attackItems = itemsList.filter(item => item.category === 'Attack');
    const magicItems = itemsList.filter(item => item.category === 'Magic');
    const defenseItems = itemsList.filter(item => item.category === 'Defense');

    build.push(bootItems[Math.floor(Math.random() * bootItems.length)]);
    
    let mainCategory = matchHero.damageType === 'Magico' ? magicItems : attackItems;
    if (matchHero.role.includes('Tank') || matchHero.role.includes('Support')) {
        mainCategory = defenseItems;
    }

    // Ensure 5 more items
    for(let j = 0; j < 5; j++) {
        // 20% chance to build a defense item if not a tank
        if (Math.random() < 0.2 && mainCategory !== defenseItems) {
            build.push(defenseItems[Math.floor(Math.random() * defenseItems.length)]);
        } else {
            build.push(mainCategory[Math.floor(Math.random() * mainCategory.length)]);
        }
    }


    matches.push({
      id: `match-${Date.now()}-${i}`,
      heroId: matchHero.id,
      result: isWin ? 'Vittoria' : 'Sconfitta',
      kills: k,
      deaths: d,
      assists: a,
      durationInMinutes: Math.floor(Math.random() * 15) + 10, // 10 to 25 mins
      enemyHeroes,
      build,
      mvp: isMvp,
      score: +(Math.random() * 3 + (isWin ? 7 : 3)).toFixed(1)
    });
  }

  return matches;
}

export function analyzeMatches(matches: MatchData[]): { averageKda: string, winRate: string, suggestion: string } {
    if (matches.length === 0) return { averageKda: '0', winRate: '0%', suggestion: 'Nessun dato disponibile.' };

    let totalKills = 0, totalDeaths = 0, totalAssists = 0;
    let wins = 0;
    let totalDefenseItems = 0;
    
    matches.forEach(m => {
        totalKills += m.kills;
        totalDeaths += m.deaths;
        totalAssists += m.assists;
        if (m.result === 'Vittoria') wins++;
        
        const defCount = m.build.filter(i => i.category === 'Defense').length;
        totalDefenseItems += defCount;
    });

    const averageKills = totalKills / matches.length;
    const averageDeaths = totalDeaths / matches.length;
    const averageAssists = totalAssists / matches.length;
    
    const kda = averageDeaths === 0 ? (averageKills + averageAssists) : ((averageKills + averageAssists) / averageDeaths);
    const winRate = (wins / matches.length) * 100;
    const avgDefItems = totalDefenseItems / matches.length;

    let suggestion = "";

    if (averageDeaths > 6 && avgDefItems < 2) {
         suggestion = "Vieni eliminato spesso. Considera di inserire almeno 2 oggetti difensivi (es. Immortality o Athena's Shield) nelle tue run future.";
    } else if (kda < 2) {
        suggestion = "Il tuo impatto nei teamfight è basso (KDA inferiore a 2.0). Cerca di posizionarti meglio per evitare i danni o concentrati su assistenze sicure.";
    } else if (winRate < 50) {
        suggestion = "Hai una buona KDA ma non porti a casa la vittoria. Concentrati maggiormente sugli obiettivi (Torri, Lord, Tartaruga) piuttosto che sulle sole kill.";
    } else {
        suggestion = "Le tue performance recenti sono ottime! Mantieni i tuoi ritmi e prova a dominare la mappa con counter-build specifiche usando il nostro analizzatore.";
    }

    return {
        averageKda: kda.toFixed(2),
        winRate: winRate.toFixed(0) + '%',
        suggestion
    };
}
