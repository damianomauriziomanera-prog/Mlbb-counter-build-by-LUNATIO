import { Hero, Lane, MetaHero } from '../types';

export const simulateLaneWinRate = (
  hero: Hero, 
  l: Lane, 
  squad: Hero[], 
  opposition: Hero[],
  metaHeroes: MetaHero[]
) => {
    // 1. BASE RATE FROM REAL META DATA
    const metaData = metaHeroes.find(m => m.id === hero.id);
    let baseRate = metaData ? metaData.winRate : 50.0;
    
    let score = baseRate;
    const pros: string[] = [];
    const cons: string[] = [];
    
    // 2. LANE AFFINITY (Penalità e Bonus per ruolo in corsia)
    const roleBaseMap: Record<string, Record<Lane, number>> = {
      'Tank': { 'Roam': 3, 'Jungle': -2, 'Exp': -3, 'Mid': -8, 'Gold': -15 },
      'Fighter': { 'Exp': 4, 'Jungle': 1, 'Roam': -2, 'Mid': -8, 'Gold': -12 },
      'Assassin': { 'Jungle': 5, 'Mid': -2, 'Exp': -5, 'Roam': -8, 'Gold': -12 },
      'Mage': { 'Mid': 4, 'Gold': -5, 'Exp': -8, 'Jungle': -10, 'Roam': -4 },
      'Marksman': { 'Gold': 5, 'Jungle': -5, 'Mid': -10, 'Exp': -12, 'Roam': -15 },
      'Support': { 'Roam': 4, 'Mid': -2, 'Exp': -10, 'Gold': -15, 'Jungle': -15 }
    };
    
    let maxAffinity = -20;
    const rolesList = hero.role.split('/');
    rolesList.forEach(role => {
      const rTrim = role.trim();
      const mapForRole = roleBaseMap[rTrim];
      if (mapForRole && mapForRole[l] > maxAffinity) {
        maxAffinity = mapForRole[l];
      }
    });

    score += maxAffinity;

    if (maxAffinity > 0) {
       pros.push(`Affinità Corsia: Ottima predisposizione naturale per la ${l} Lane (+${maxAffinity}%).`);
    } else if (maxAffinity < -5) {
       cons.push(`Corsia Inadatta: Questo eroe fatica enormemente nella ${l} Lane (${maxAffinity}%).`);
    } else {
       pros.push(`Valutazione Meta: Win Rate base (Globale) stimato al ${baseRate}%.`);
    }

    // 3. TEAM COMPOSITION & SYNERGY
    const fullSquad = [hero, ...squad];
    if (fullSquad.length > 1) {
      const magicDealers = fullSquad.filter(h => h.damageType === 'Magico').length;
      const physicalDealers = fullSquad.filter(h => h.damageType === 'Fisico').length;
      const trueDealers = fullSquad.filter(h => h.damageType === 'Puro').length;
      
      if (magicDealers === 0 && physicalDealers >= 3) {
        score -= 4.5;
        cons.push("Sbilanciamento Danni: Solo danno fisico. I nemici countereranno facilmente con Armatura (es. Antique Cuirass) (-4.5%).");
      } else if (physicalDealers === 0 && magicDealers >= 3) {
        score -= 4.5;
        cons.push("Sbilanciamento Danni: Solo danno magico. Il team subirà la presenza di Athena's Shield/Radiant Armor (-4.5%).");
      } else if (magicDealers >= 1 && physicalDealers >= 1) {
        score += 2;
        pros.push("Danno Misto: Bilanciamento ideale per rendere difficile la difesa avversaria (+2%).");
      }
      if (trueDealers > 0) {
        score += 1.5;
        pros.push("Danno Puro: Capacità di sciogliere le difese tank (+1.5%).");
      }

      const roleCounts: Record<string, number> = {};
      fullSquad.forEach(h => {
        const prim = h.role.split('/')[0].trim();
        roleCounts[prim] = (roleCounts[prim] || 0) + 1;
      });
      if ((roleCounts['Marksman'] || 0) > 1) {
        score -= 5;
        cons.push("Multi-Tiratore: Troppi eroi farm-dipendenti rallentano il powerspike del team (-5%).");
      }
      if ((roleCounts['Mage'] || 0) > 2) {
        score -= 4;
        cons.push("Sovrabbondanza Magica: Manca front-line fisica sostenibile (-4%).");
      }
      if ((roleCounts['Tank'] || 0) + (roleCounts['Fighter'] || 0) + (roleCounts['Support'] || 0) === 0) {
         score -= 6;
         cons.push("Team Fragilissimo: Assenza totale di front-line o peel. Rischio snowball nemico molto alto (-6%).");
      } else if ((roleCounts['Tank'] || 0) + (roleCounts['Support'] || 0) > 0) {
         score += 2.5;
         pros.push("Presenza Peel/Frontline: Formazione che garantisce copertura per i carry (+2.5%).");
      }

      const squadTags = fullSquad.flatMap(h => h.counterTags).join(' ').toLowerCase();
      const hasAoeCC = /groupcc|aoestun|knockupaoe/i.test(squadTags);
      const hasAoeBurst = /aoeburst|artillery/i.test(squadTags);
      if (hasAoeCC && hasAoeBurst) {
         score += 4;
         pros.push("Combo 'Wombo': Eccellente sinergia CC ad area seguito da burst AoE (+4%).");
      }
    }

    // 4. ADVANCED ENEMY MATCHUP ANALYSIS
    if (opposition.length > 0) {
      let laneOpponent: Hero | null = null;
      if (l === 'Gold') laneOpponent = opposition.find(e => e.role.includes('Marksman')) || null;
      else if (l === 'Mid') laneOpponent = opposition.find(e => e.role.includes('Mage')) || null;
      else if (l === 'Jungle') laneOpponent = opposition.find(e => e.role.includes('Assassin') || e.role.includes('Tank') || e.role.includes('Fighter')) || null;
      else if (l === 'Roam') laneOpponent = opposition.find(e => e.role.includes('Support') || e.role.includes('Tank')) || null;
      else if (l === 'Exp') laneOpponent = opposition.find(e => e.role.includes('Fighter') || e.role.includes('Tank')) || null;
      if (!laneOpponent) laneOpponent = opposition[0];

      if (laneOpponent) {
        const heroTags = hero.counterTags.join(' ').toLowerCase();
        const oppTags = laneOpponent.counterTags.join(' ').toLowerCase();
        
        let localMatchBonus = 0;
        
        // Counter logic based on tags
        if (/sustain|heal|regen|lifesteal/i.test(oppTags) && /antiheal|burst/i.test(heroTags)) {
          localMatchBonus += 4;
          pros.push(`Counter Sustain: Riduci efficacemente le cure di ${laneOpponent.name} (+4%).`);
        }
        if (/dash|mobility|chase/i.test(oppTags) && /antidash|suppress|locksingle/i.test(heroTags)) {
          localMatchBonus += 5;
          pros.push(`Blocco Mobilità: Intercetti facilmente gli scatti di ${laneOpponent.name} (+5%).`);
        }
        if (/burst|assassin/i.test(oppTags) && /shield|immortality|tank|damagereduction/i.test(heroTags)) {
          localMatchBonus += 3.5;
          pros.push(`Robustezza: Incassi perfettamente i burst damage di ${laneOpponent.name} (+3.5%).`);
        }
        if (/tank|highpv/i.test(oppTags) && /truedamage|tankmelter|penetration/i.test(heroTags)) {
          localMatchBonus += 4.5;
          pros.push(`Sciogli-Tank: Bypassi facilmente l'armatura di ${laneOpponent.name} (+4.5%).`);
        }

        // Reverse check (we are getting countered)
        if (/sustain|heal|regen|lifesteal/i.test(heroTags) && /antiheal|burst/i.test(oppTags)) {
          localMatchBonus -= 4;
          cons.push(`Sustain Annullato: Le cure del tuo eroe sono gravemente ridotte contro ${laneOpponent.name} (-4%).`);
        }
        if (/dash|mobility/i.test(heroTags) && /antidash|suppress|locksingle/i.test(oppTags)) {
          localMatchBonus -= 5;
          cons.push(`Mobilità Soppressa: Gli scatti sono puniti duramente da ${laneOpponent.name} (-5%).`);
        }
        if (/tank/i.test(hero.role) && /truedamage|tankmelter/i.test(oppTags)) {
          localMatchBonus -= 4.5;
          cons.push(`Eroe Fragile contro ${laneOpponent.name}: Scioglierà le tue difese facilmente (-4.5%).`);
        }

        score += localMatchBonus;
      }

      // General Enemy Team Checks
      const enemyHasLotsOfCC = opposition.filter(e => /cc|stun|knockup|suppress|freeze/i.test(e.counterTags.join(' '))).length >= 3;
      if (enemyHasLotsOfCC && !hero.counterTags.some(t => /immunity|purify/i.test(t))) {
        score -= 4.5;
        cons.push("Sofferenza Controllo: Assenza di immunità naturali contro un team orientato ai CC pesanti (-4.5%).");
      }
      
      const earlyGameVulnerability = /lategame|farm/i.test(hero.counterTags.join(' ').toLowerCase()) || (hero.role.includes('Marksman') && !['clint', 'brody', 'melissa'].includes(hero.id));
      const enemyEarlyAggression = opposition.filter(e => /earlygame|invade|fastpick/i.test(e.counterTags.join(' ').toLowerCase())).length;
      
      if (earlyGameVulnerability && enemyEarlyAggression >= 2) {
        score -= 5;
        cons.push("Debolezza in Early Game: Sei esposto ad invasioni repentine e rotazioni fastidiose (-5%).");
      }
    } else {
      pros.push("Proiezione Blind Pick: Simulazione parziale senza nemici rivelati.");
    }

    const finalRate = Math.min(Math.max(score, 10), 98);
    const roundedRate = Math.round(finalRate * 10) / 10;
    
    return {
      lane: l,
      winRate: roundedRate,
      pros,
      cons
    };
};
