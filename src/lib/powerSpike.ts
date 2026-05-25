import { Hero } from '../types';

export interface PowerSpikeResult {
  early: number; // 0-100
  mid: number;   // 0-100
  late: number;  // 0-100
  earlyMessage: string;
  midMessage: string;
  lateMessage: string;
  overallStrategy: string;
}

const getHeroPhaseScore = (hero: Hero) => {
  let early = 50;
  let mid = 50;
  let late = 50;

  const role = hero.role.toLowerCase();
  const id = hero.id.toLowerCase();
  const tags = hero.counterTags.map(t => t.toLowerCase());

  // Base role scoring
  if (role.includes('marksman')) {
    early -= 20; mid += 10; late += 40;
  }
  if (role.includes('assassin')) {
    early += 30; mid += 20; late -= 15;
  }
  if (role.includes('fighter')) {
    early += 10; mid += 30; late += 10;
  }
  if (role.includes('mage')) {
    early += 10; mid += 25; late += 20;
  }
  if (role.includes('tank') || role.includes('support')) {
    early += 20; mid += 20; late += 10; // Tanks fall off slightly late compared to MM
  }

  // Tag adjustments
  if (tags.some(t => t.includes('early'))) { early += 30; late -= 10; }
  if (tags.some(t => t.includes('late'))) { early -= 20; late += 40; }
  if (tags.some(t => t.includes('stack'))) { early -= 25; mid += 10; late += 50; }
  if (tags.some(t => t.includes('burst'))) { early += 15; mid += 20; }
  if (tags.some(t => t.includes('dps'))) { early -= 10; late += 25; }

  // Specific hardcoded exceptions for MLBB meta
  if (['aldous', 'cecilion', 'alice', 'layla', 'miya'].includes(id)) {
    early -= 25; mid += 10; late += 60;
  }
  if (['selena', 'lancelot', 'fanny', 'nolan', 'julian'].includes(id)) {
    early += 45; mid += 10; late -= 25;
  }

  return { early, mid, late };
};

export const calculatePowerSpike = (myHero: Hero, enemies: Hero[]): PowerSpikeResult => {
  if (enemies.length === 0) {
    return {
      early: 50, mid: 50, late: 50,
      earlyMessage: "In attesa di nemici", midMessage: "", lateMessage: "", overallStrategy: ""
    };
  }

  const myScores = getHeroPhaseScore(myHero);
  
  let enemyEarly = 0, enemyMid = 0, enemyLate = 0;
  enemies.forEach(e => {
    const scores = getHeroPhaseScore(e);
    enemyEarly += scores.early;
    enemyMid += scores.mid;
    enemyLate += scores.late;
  });

  enemyEarly /= enemies.length;
  enemyMid /= enemies.length;
  enemyLate /= enemies.length;

  // Normalize scores to percentages indicating MY advantage (0 to 100)
  // 50 means perfectly even. >50 means my hero has advantage.
  const calcAdvantage = (my: number, enemy: number) => {
    let diff = my - enemy;
    // Map -50 to 50 difference into 20 to 80 range smoothly
    let advantage = 50 + (diff * 0.8);
    return Math.max(15, Math.min(85, advantage)); // Cap between 15% and 85% visually
  };

  const earlyAdv = Math.round(calcAdvantage(myScores.early, enemyEarly));
  const midAdv = Math.round(calcAdvantage(myScores.mid, enemyMid));
  const lateAdv = Math.round(calcAdvantage(myScores.late, enemyLate));

  let earlyMessage = "Scambi alla pari.";
  if (earlyAdv > 60) earlyMessage = "Sei molto più forte. Cerca lo scontro (First Blood)!";
  else if (earlyAdv < 40) earlyMessage = "Giochi in difesa. Sotto torre, pulisci e non morire.";

  let midMessage = "Vantaggio equilibrato.";
  if (midAdv > 60) midMessage = "Il tuo momento d'oro. Prendi gli obiettivi (Tartaruga/Torri).";
  else if (midAdv < 40) midMessage = "Evita i teamfight diretti, farma in corsie sicure.";

  let lateMessage = "Chi sbaglia, perde.";
  if (lateAdv > 65) lateMessage = "Sei Inarrestabile. Fai il Lord e chiudi la partita.";
  else if (lateAdv < 35) lateMessage = "Attento, un loro colpo ti scioglie. Non girare da solo.";

  // Overall strategy
  let overallStrategy = "Partita equilibrata in tutte le fasi. La bravura individuale deciderà il match.";
  if (earlyAdv < 40 && lateAdv > 60) {
    overallStrategy = "⚠️ LORO SONO EARLY, TU SEI LATE. Se non muori nei primi 10 minuti, la vittoria è letteralmente tua.";
  } else if (earlyAdv > 60 && lateAdv < 40) {
    overallStrategy = "⚠️ TU SEI EARLY, LORO SONO LATE. Devi vincere in 12 minuti o distruggerli psicologicamente. Se la partita si allunga, perdi.";
  } else if (midAdv > earlyAdv && midAdv > lateAdv) {
    overallStrategy = "Il tuo picco di potere è al centro della partita. Non esagerare all'inizio e sfrutta il Mid Game per prendere un vantaggio incolmabile.";
  } else if (lateAdv < 40 && earlyAdv < 40) {
     overallStrategy = "Matchup sfavorevole. Gioca per il team, usa le abilità di controllo e fai proteggere i tuoi errori dal Roamer.";
  }

  return {
    early: earlyAdv,
    mid: midAdv,
    late: lateAdv,
    earlyMessage,
    midMessage,
    lateMessage,
    overallStrategy
  };
};
