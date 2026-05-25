import { Hero } from '../types';
import { HERO_COUNTERS } from '../data/counters';
import { META_HEROES } from '../data/metaData';

export interface DraftAnalysis {
  winRate: number; // 0 to 100
  synergyScore: number;
  counterScore: number;
  warnings: string[];
  suggestions: Hero[];
  detailedCounters: { allyId: string; enemyId: string; reason: string }[];
}

// Funzione principale che analizza il Draft
export function analyzeDraft(alliedTeam: Hero[], enemyTeam: Hero[]): DraftAnalysis {
  let winRate = 50;
  let synergyScore = 0;
  let counterScore = 0;
  const warnings: string[] = [];
  const detailedCounters: { allyId: string; enemyId: string; reason: string }[] = [];

  // --- 1. Calcolo Sinergia (Bilanciamento Ruoli Alleati) ---
  const roles = alliedTeam.map(h => h.role);
  const hasTank = roles.some(r => r.includes('Tank') || r.includes('Support'));
  const hasMage = roles.some(r => r.includes('Mage'));
  const hasMarksman = roles.some(r => r.includes('Marksman'));
  const hasAssassin = roles.some(r => r.includes('Assassin'));
  const hasFighter = roles.some(r => r.includes('Fighter'));

  if (alliedTeam.length > 0) {
    if (!hasTank) warnings.push("⚠️ Manca un Tank/Support (Frontline o utility assente).");
    if (!hasMage) warnings.push("⚠️ Manca un Mago (Pochi danni magici, i nemici builderanno solo armatura fisica).");
    if (!hasMarksman) warnings.push("⚠️ Manca un Marksman (DPS a lungo raggio debole a fine partita).");
    
    // Check danni
    const damageTypes = alliedTeam.map(h => h.damageType);
    const magicCount = damageTypes.filter(d => d === 'Magico').length;
    const physCount = damageTypes.filter(d => d === 'Fisico').length;

    if (magicCount >= 4) warnings.push("⚠️ Troppi eroi magici! Il team nemico vincerà facilmente con Scudi di Atena/Radiant.");
    if (physCount >= 4 && !hasMage) warnings.push("⚠️ Team quasi full fisico! Un Tank nemico con Antique Cuirass e Blade Armor vi distruggerà.");
  }

  // Bonus sinergia
  if (hasTank) synergyScore += 2;
  if (hasMage) synergyScore += 2;
  if (hasMarksman) synergyScore += 2;
  if (hasAssassin || hasFighter) synergyScore += 2;
  if (alliedTeam.length === 5 && warnings.length === 0) {
    synergyScore += 4; // Perfect composition
  }

  // --- 2. Calcolo Counter (Alleati vs Nemici) ---
  alliedTeam.forEach(ally => {
    enemyTeam.forEach(enemy => {
      // Se l'alleato countera il nemico
      const enemyCounters = HERO_COUNTERS[enemy.id] || [];
      const counterData = enemyCounters.find(c => c.counterId === ally.id);
      
      if (counterData) {
        counterScore += 5; // Fortissimo vantaggio
        detailedCounters.push({
          allyId: ally.id,
          enemyId: enemy.id,
          reason: counterData.reason
        });
      }

      // Se il nemico countera l'alleato
      const allyCounters = HERO_COUNTERS[ally.id] || [];
      const enemyCounterData = allyCounters.find(c => c.counterId === enemy.id);
      
      if (enemyCounterData) {
        counterScore -= 5; // Svantaggio critico
      }
    });
  });

  // --- 3. Previsione Win Rate ---
  // Partiamo da 50, aggiungiamo sinergia (max +10), aggiungiamo counter (max illimitato ma cappato)
  winRate = 50 + synergyScore + counterScore;
  
  // Aggiustamento per la dimensione del team (se mancano giocatori, scaliamo in base a chi è presente)
  if (enemyTeam.length > alliedTeam.length) {
    winRate -= (enemyTeam.length - alliedTeam.length) * 5; 
  } else if (alliedTeam.length > enemyTeam.length) {
    winRate += (alliedTeam.length - enemyTeam.length) * 5;
  }

  // Cap tra 10% e 90% per realismo
  if (winRate > 95) winRate = 95;
  if (winRate < 5) winRate = 5;

  // Se entrambi i team sono vuoti
  if (alliedTeam.length === 0 && enemyTeam.length === 0) {
    winRate = 50;
  }

  // --- 4. Suggerimenti (Chi piccare/bannare) ---
  const suggestions: Hero[] = [];
  if (enemyTeam.length > 0 && alliedTeam.length < 5) {
    // Suggerisci eroi meta che counterano i nemici scelti e che riempiono ruoli mancanti
    const potentialPicks = META_HEROES.filter(meta => 
      !alliedTeam.some(a => a.id === meta.id) && 
      !enemyTeam.some(e => e.id === meta.id)
    );

    // Diamo un punteggio ai pick potenziali
    const pickScores = potentialPicks.map(p => {
      let score = 0;
      if (p.tier === 'S+') score += 10;
      if (p.tier === 'S') score += 5;

      // Bonus ruolo
      if (!hasTank && (p.role.includes('Tank') || p.role.includes('Support'))) score += 15;
      if (!hasMage && p.role.includes('Mage')) score += 15;
      if (!hasMarksman && p.role.includes('Marksman')) score += 15;

      // Bonus Counter
      enemyTeam.forEach(enemy => {
        const enemyCounters = HERO_COUNTERS[enemy.id] || [];
        if (enemyCounters.some(c => c.counterId === p.id)) {
          score += 20; // Countera un nemico = pick fortissimo
        }
      });

      return { hero: p, score };
    });

    pickScores.sort((a, b) => b.score - a.score);
    suggestions.push(...pickScores.slice(0, 3).map(p => p.hero));
  }

  return {
    winRate: Math.round(winRate),
    synergyScore,
    counterScore,
    warnings,
    detailedCounters,
    suggestions
  };
}
