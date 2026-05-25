import { Hero, Item, BuildSlot, RecommendedBuild, Lane } from '../types';
import { ITEMS } from '../data/items';
import { EMBLEMS, GLOBAL_TALENTS } from '../data/emblems';
import { SPELLS } from '../data/spells';

interface ScoredItem {
  item: Item;
  score: number;
  reason: string;
  isDefense: boolean;
  isAntiHeal: boolean;
  isPhysical: boolean;
  isMagic: boolean;
}

export function calculateBuild(userHero: Hero, lane: Lane, enemies: Hero[]): RecommendedBuild {
  const finalBuild: BuildSlot[] = [];
  const isJungle = lane === 'Jungle';
  const isRoam = lane === 'Roam';

  // --- 1. THREAT ASSESSMENT (Enemy Profiling) ---
  const enemyCount = enemies.length;
  const physDamageThreat = enemies.filter(e => e.damageType === 'Fisico').length;
  const magDamageThreat = enemies.filter(e => e.damageType === 'Magico').length;
  
  const highRegenThreat = enemies.filter(e => e.counterTags.some(t => /regen(?:pv)?|heal|vamp|lifesteal/i.test(t)) || ['estes', 'rafaela', 'angela', 'floryn', 'uranus', 'yu_zhong', 'ruby', 'alucard', 'alpha', 'alice', 'esmeralda'].includes(e.id)).length;
  const tankyThreat = enemies.filter(e => e.role.includes('Tank') || e.role.includes('Fighter') || e.counterTags.some(t => /heavytank|highpv/i.test(t))).length;
  const ccThreat = enemies.filter(e => e.counterTags.some(t => /cc|stun|suppress|knockup|freeze|immobilize/i.test(t))).length;
  const burstPhysThreat = enemies.filter(e => e.counterTags.some(t => /burstfisico|burstphysical/i.test(t)) || (e.role.includes('Assassin') && e.damageType === 'Fisico')).length;
  const burstMagThreat = enemies.filter(e => e.counterTags.some(t => /burstmagico|burstmagic/i.test(t)) || (e.role.includes('Mage') && e.counterTags.some(t => /burst/i.test(t)))).length;
  const autoAttackThreat = enemies.filter(e => e.role.includes('Marksman') || e.counterTags.some(t => /attackspeed|autoattack|dps/i.test(t) && e.damageType === 'Fisico')).length;

  // --- 2. HERO NEED ASSESSMENT ---
  const myTags = userHero.counterTags.join(' ').toLowerCase();
  const isMagicHero = userHero.damageType === 'Magico';
  const isPhysicalHero = userHero.damageType === 'Fisico';
  const isCritHero = /crit/i.test(myTags) || ['lesley', 'bruno', 'ling', 'irithel', 'layla', 'miya'].includes(userHero.id);
  const isAttackSpeedHero = /attackspeed/i.test(myTags) || ['claude', 'wanwan', 'karrie', 'moskov', 'hanabi', 'melissa', 'sun', 'argus', 'zilong', 'natan', 'miya'].includes(userHero.id);
  const isBurstMage = /burst/i.test(myTags) && isMagicHero;
  const isDpsMage = /dps|continuous/i.test(myTags) && isMagicHero && !isBurstMage;
  const isSustainFighter = /regen|lifesteal|spellvamp|sustain/i.test(myTags) && isPhysicalHero;
  const isTrueTank = userHero.role.includes('Tank') && !userHero.role.includes('Fighter') && !userHero.role.includes('Marksman');
  const isSupport = userHero.role.includes('Support');
  const isSquishy = userHero.role.includes('Marksman') || userHero.role.includes('Mage') || userHero.role.includes('Assassin');
  const isPureAssassin = userHero.role.includes('Assassin') && !userHero.role.includes('Fighter');

  // --- 3. BOOTS SELECTION ---
  let boots = isMagicHero ? ITEMS.MAGIC_SHOES : ITEMS.WARRIOR_BOOTS;
  let bootsReason = "Calzature base per ottimizzare le tue performance.";

  if (isSquishy) {
    if (isMagicHero) {
      boots = ITEMS.ARCANE_BOOTS;
      if (/cd|spam/i.test(myTags)) boots = ITEMS.MAGIC_SHOES;
      bootsReason = "Penetrazione Magica (o CDR) per massimizzare l'impatto offensivo in Early Game.";
    } else if (isAttackSpeedHero) {
      boots = ITEMS.SWIFT_BOOTS;
      bootsReason = "Raggiungi prima i breakpoint di velocità d'attacco ottimali.";
    } else {
      // Assassini o Tiratori Burst (Granger, Brody, Clint, Saber)
      boots = ITEMS.MAGIC_SHOES;
      bootsReason = "Riduzione Ricarica per poter spammare le tue abilità letali più spesso.";
    }
    // Solo in situazioni estreme diamo scarpe difensive agli squishy
    if (ccThreat >= 3) {
      boots = ITEMS.TOUGH_BOOTS;
      bootsReason = "I troppi CC nemici rendono vitale la Tenacia per non essere shottati senza poter reagire.";
    }
  } else {
    // Tank, Support, Fighter
    boots = ITEMS.TOUGH_BOOTS; 
    bootsReason = "La Tenacia offerta dai Tough Boots è vitale contro i CC e i danni magici avversari.";
    if (physDamageThreat > magDamageThreat + 1 || (autoAttackThreat >= 2 && ccThreat < 2)) {
      boots = ITEMS.WARRIOR_BOOTS;
      bootsReason = "Contrasta pesantemente i danni fisici e i tiratori avversari.";
    }
  }

  if (isJungle) {
    let jungleSpell = ITEMS.JUNGLE_ICE;
    if (isTrueTank || isSupport || isSustainFighter) jungleSpell = ITEMS.JUNGLE_BEHEMOTH;
    else if (isBurstMage || isPureAssassin || isCritHero) jungleSpell = ITEMS.JUNGLE_FLAME; 
    finalBuild.push({ item: { ...boots, name: `${boots.name} (${jungleSpell.name})` }, reason: `${bootsReason} Include potenziamento per Jungler.` });
  } else if (isRoam) {
    let roamBlessing = ITEMS.ROAM_ENCOURAGE;
    if (ccThreat >= 2 || ['tigreal', 'atlas', 'khufra', 'franco', 'minotaur'].includes(userHero.id)) roamBlessing = ITEMS.ROAM_CONCEAL;
    else if (isSupport && ['estes', 'rafaela', 'angela', 'floryn', 'mathilda'].includes(userHero.id)) roamBlessing = ITEMS.ROAM_FAVOR;
    else if (['kadita', 'selena', 'natalia', 'hilda', 'saber'].includes(userHero.id)) roamBlessing = ITEMS.ROAM_DIRE_HIT;
    finalBuild.push({ item: { ...boots, name: `${boots.name} (${roamBlessing.name})` }, reason: `${bootsReason} Include benedizione per il Roaming.` });
  } else {
    finalBuild.push({ item: boots, reason: bootsReason });
  }

  // --- 4. SCORING ENGINE (Dynamic Evaluation) ---
  let scoredItems: ScoredItem[] = [];

  Object.values(ITEMS).forEach(item => {
    // Skip shoes/blessings in standard rotation
    if (item.category === 'Movement' || item.category === 'Jungle' || item.category === 'Roam') return;

    let score = 0;
    let reason = "Potenziamento utile per le tue statistiche.";
    let isDefense = item.category === 'Defense' || item.attributes.some(a => /Difesa|PV|Tenacia/i.test(a)) && !item.attributes.some(a => /Attacco/i.test(a));
    let isAntiHeal = item.id === 'sea_halberd' || item.id === 'necklace_of_durance' || item.id === 'dominance_ice';
    let isPhysical = item.category === 'Attack' || item.attributes.some(a => /Attacco Fisico|Penetrazione Fisica/i.test(a));
    let isMagic = item.category === 'Magic' || item.attributes.some(a => /Potere Magico|Penetrazione Magica/i.test(a));

    // Hard Mismatch Filters (-1000 points)
    if (isPhysical && isMagicHero) score -= 1000;
    if (isMagic && isPhysicalHero) score -= 1000;
    
    // Evita oggetti da Tank puro se non si ha bisogno di difesa pesante e non si è tank
    // Aumentato da -50 a -200 per bloccare del tutto i tank item sugli squishy, eccezione per Immortality
    if (isDefense && isSquishy && !['immortality'].includes(item.id)) score -= 200;

    // Se non ci sono tank avversari, penalizziamo la penetrazione e danni basati sugli HP
    if (tankyThreat === 0) {
      if (['malefic_roar', 'divine_glaive', 'demon_hunter_sword', 'wishing_lantern'].includes(item.id)) {
        score -= 150;
      }
    }

    // SCORING LOGIC
    // =============
    
    // Core Identity Bonuses
    if (isCritHero) {
      if (item.id === 'berserkers_fury') { score += 100; reason = "Core assoluto per massimizzare i danni critici."; }
      if (item.id === 'windtalker') { score += 80; reason = "Mobilità e diffusione del danno critico ad area."; }
      if (item.id === 'haas_claws') { score += 70; reason = "Fornisce sustain vitale sfruttando i colpi critici."; }
    }
    
    if (isAttackSpeedHero) {
      if (item.id === 'corrosion_scythe') { score += 100; reason = "Rallenta il nemico e scala pesantemente la tua Attack Speed."; }
      if (item.id === 'demon_hunter_sword') { score += 90; reason = "Divora gli HP nemici a ogni colpo, eccellente contro chiunque."; }
      if (item.id === 'golden_staff') { score += 80; reason = "Massimizza gli effetti sul colpo triplicandone l'efficacia."; }
      if (item.id === 'malefic_gun') { score += 85; reason = "Aumenta la tua gittata permettendoti di colpire da distanze di sicurezza letali."; }
    }
    
    if (userHero.role.includes('Marksman') && !isAttackSpeedHero && !isCritHero) {
      // Skill-based marksmen (Brody, Clint)
      if (item.id === 'blade_of_despair') { score += 100; reason = "Massimizza il danno grezzo delle tue abilità."; }
      if (item.id === 'endless_battle') { score += 90; reason = "Danno puro passivo perfetto dopo aver usato una skill."; }
    }

    if (isBurstMage) {
      if (item.id === 'lightning_truncheon') { score += 100; reason = "Danno ad area esplosivo che scala col tuo mana."; }
      if (item.id === 'genius_wand') { score += 90; reason = "Riduce la difesa magica nemica, vitale per shottare i fragili."; }
      if (item.id === 'holy_crystal') { score += 85; reason = "Massiccio incremento in % del tuo potere magico totale."; }
      if (item.id === 'blood_wings') { score += 80; reason = "Picco di danni late-game e uno scudo salvavita."; }
      if (item.id === 'sky_piercer') { score += 95; reason = "Ti garantisce l'uccisione immediata sui nemici a cui hai tolto quasi tutta la vita col tuo burst."; }
    }

    if (isDpsMage) {
      if (item.id === 'enchanted_talisman') { score += 100; reason = "Mana infinito e riduzione ricarica per spammare abilità."; }
      if (item.id === 'ice_queen_wand') { score += 90; reason = "Rallentamento costante per mantenere i nemici sotto il tuo DPS."; }
      if (item.id === 'glowing_wand') { score += 85; reason = "Danno percentuale continuato basato sugli HP massimi del bersaglio."; }
      if (item.id === 'starlium_scythe') { score += 80; reason = "Fornisce danni puri costanti se usi gli attacchi base tra una skill e l'altra."; }
    }

    if (isPureAssassin || (isPhysicalHero && userHero.role.includes('Assassin'))) {
      if (item.id === 'hunter_strike') { score += 100; reason = "Velocità di movimento e penetrazione fisica per assalti fulminei."; }
      if (item.id === 'heptaseas') { score += 90; reason = "Danno extra vitale per il primo colpo da un'imboscata."; }
      if (item.id === 'blade_of_despair') { score += 80; reason = "Assicura letalità assoluta sui bersagli con HP dimezzati."; }
      if (item.id === 'sky_piercer') { score += 110; reason = "L'arma definitiva per gli assassini: esegue infallibilmente i bersagli con HP bassi."; }
    }

    if (isSustainFighter) {
      if (item.id === 'war_axe') { score += 100; reason = "Eccelle negli scontri prolungati fornendo danni puri e sustain."; }
      if (item.id === 'oracle') { score += 90; reason = "Amplifica enormemente ogni tua fonte di cura o scudo."; }
      if (item.id === 'hunter_strike') { score += 80; reason = "Mantiene l'avversario a portata durante gli inseguimenti."; }
      if (item.id === 'great_dragon_spear' && userHero.counterTags.some(t => /dash|mobility|jump/i.test(t))) { score += 85; reason = "Aumenta vertiginosamente la tua mobilità dopo aver usato l'Ultimate."; }
    }

    if (isSupport) {
      if (item.id === 'flask_of_the_oasis') { score += 100; reason = "Applica uno scudo d'emergenza vitale quando curi alleati in fin di vita."; }
      if (item.id === 'oracle') { score += 80; reason = "Migliora l'efficacia delle tue stesse cure/scudi."; }
      if (item.id === 'fleeting_time') { score += 85; reason = "Ricarica la tua mossa finale rapidamente dopo un assist."; }
    }

    // Threat Adjustments (Dynamic Context)
    if (highRegenThreat >= 1 && isAntiHeal) {
      if (item.id === 'dominance_ice' && !isSquishy) {
        score += 180; reason = "Priorità assoluta: countera totalmente la rigenerazione e velocità d'attacco nemica da vicino.";
      } else if (item.id === 'necklace_of_durance' && isMagicHero) {
        score += 150; reason = "Taglia le cure nemiche del 50% applicando danni magici ad area.";
      } else if (item.id === 'sea_halberd' && isPhysicalHero) {
        score += 150; reason = "Anti-cura letale e danni extra contro bersagli con HP alti.";
      } else {
        score -= 500; // Penalità severa se un mago cerca Sea Halberd o uno squishy cerca Dominance
      }
    }

    if (tankyThreat >= 1) {
      if (item.id === 'malefic_roar' && isPhysicalHero) { score += 85; reason = "Squarcia le corazze nemiche accumulate dai Tank."; }
      if (item.id === 'divine_glaive' && isMagicHero) { score += 85; reason = "Penetrazione estrema per ignorare le difese magiche avversarie."; }
      if (item.id === 'demon_hunter_sword' && isAttackSpeedHero) { score += 100; }
      if (item.id === 'wishing_lantern' && isMagicHero) { score += 80; reason = "Punisce severamente gli avversari che possiedono troppi HP massimi."; }
    }

    // TANK / SUPPORT GENERAL DEFENSES
    if ((isTrueTank || isSupport) && magDamageThreat >= 1 && isDefense) {
       if (item.id === 'athenas_shield') { score += 75; reason = "Aumenta la resistenza generale ai danni magici avversari."; }
       if (item.id === 'radiant_armor') { score += 70; reason = "Scudo difensivo contro i danni magici prolungati."; }
    }
    
    if ((isTrueTank || isSupport) && physDamageThreat >= 1 && isDefense) {
       if (item.id === 'antique_cuirass') { score += 75; reason = "Armatura base essenziale per reggere i danni fisici nemici."; }
       if (item.id === 'blade_armor' && autoAttackThreat >= 1) { score += 80; reason = "Fondamentale per riflettere i colpi dei tiratori fisici."; }
    }

    if (burstMagThreat >= 1 && isDefense) {
      if (item.id === 'athenas_shield' && !isSquishy) { score += 120; reason = "Protezione salvavita contro il burst e l'oneshot magico."; }
      if (item.id === 'rose_gold_meteor' && isPhysicalHero && isSquishy) { score += 120; reason = "Fornisce uno scudo magico d'emergenza mantenendo il massimo output offensivo contro il burst."; }
      if (item.id === 'winter_crown' && isMagicHero && isSquishy) { score += 120; reason = "Ti rende intoccabile annullando completamente il burst magico letale."; }
    }
    
    if (magDamageThreat >= 2 && isDefense) {
      if (item.id === 'radiant_armor' && !isSquishy) { score += 110; reason = "Riduce costantemente i danni magici continuati (DPS)."; }
    }

    if (burstPhysThreat >= 1 && isDefense) {
      if (item.id === 'antique_cuirass' && !isSquishy) { score += 110; reason = "Riduce il potere d'attacco degli eroi fisici basati sulle abilità."; }
      if (item.id === 'wind_of_nature' && userHero.role.includes('Marksman')) { score += 120; reason = "L'immunità fisica temporanea è l'unica via per sopravvivere agli Assassini fisici."; }
      if (item.id === 'winter_crown' && isMagicHero && isSquishy) { score += 120; reason = "Blocca completamente gli assalti fulminei degli Assassini o Combattenti."; }
    }

    if (autoAttackThreat >= 1 && isDefense) {
      if (item.id === 'blade_armor' && !isSquishy) { score += 110; reason = "Riflette il danno dei tiratori avversari rallentandoli."; }
      if (item.id === 'dominance_ice' && !isSquishy) { score += 110; reason = "Rallenta drammaticamente la velocità d'attacco di chi ti sta vicino."; }
    }

    // Generic fallback scores to ensure 5 items are always picked
    if (score === 0) {
      if (item.id === 'immortality' || (item.id === 'brute_force_breastplate' && !isSquishy)) score += 10;
      if (isMagicHero && (item.id === 'holy_crystal' || item.id === 'blood_wings')) score += 25; // Aumentato fallback offensivo
      if (isPhysicalHero && (item.id === 'blade_of_despair' || item.id === 'endless_battle' || item.id === 'hunter_strike')) score += 25; // Aumentato fallback offensivo
    }

    if (score > 0) {
      scoredItems.push({ item, score, reason, isDefense, isAntiHeal, isPhysical, isMagic });
    }
  });

  // --- 5. CONFLICT RESOLUTION (Anti-Hallucination) ---
  scoredItems.sort((a, b) => b.score - a.score); // Ordina per punteggio

  const selectedItems: ScoredItem[] = [];
  let hasAntiHealSelected = false;
  let defenseItemCount = 0;
  // Hard cap limit per squishies: 1 solo item di difesa puro. (Come richiesto dall'utente)
  const MAX_DEFENSE_SQUISHY = 1;

  for (const candidate of scoredItems) {
    if (selectedItems.length >= 5) break;

    // Prevenzione Allucinazioni
    if (candidate.isAntiHeal && hasAntiHealSelected) continue; // No doppi anti-cura
    
    if (isSquishy && candidate.isDefense && defenseItemCount >= MAX_DEFENSE_SQUISHY) {
      // Skips adding another pure defense item to a squishy
      if (!['rose_gold_meteor', 'wind_of_nature', 'winter_crown'].includes(candidate.item.id)) {
         continue; 
      }
    }

    // Se passa i controlli, lo aggiungiamo
    selectedItems.push(candidate);
    
    if (candidate.isAntiHeal) hasAntiHealSelected = true;
    if (candidate.isDefense) defenseItemCount++;
  }

  // Aggiungiamo i top 5 item selezionati alla build finale
  selectedItems.forEach(si => finalBuild.push({ item: si.item, reason: si.reason }));

  // --- 6. EMBLEM LOGIC (Invariata ma ottimizzata) ---
  let selectedEmblem = EMBLEMS.BASIC;
  if (isTrueTank) selectedEmblem = EMBLEMS.TANK;
  else if (isSupport) selectedEmblem = EMBLEMS.SUPPORT;
  else if (isMagicHero) selectedEmblem = EMBLEMS.MAGE;
  else if (userHero.role.includes('Marksman')) selectedEmblem = EMBLEMS.MARKSMAN;
  else if (userHero.role.includes('Assassin')) selectedEmblem = EMBLEMS.ASSASSIN;
  else if (userHero.role.includes('Fighter')) selectedEmblem = EMBLEMS.FIGHTER;
  
  const getTalent = (tier: 1 | 2 | 3, targetId1: string, targetId2?: string) => {
    const arr = GLOBAL_TALENTS[`tier${tier}`];
    return arr.find(x => x.id === targetId1 || x.id === targetId2) || arr[0];
  };

  const emblemSug = {
    id: selectedEmblem.id,
    name: selectedEmblem.name,
    iconUrl: selectedEmblem.iconUrl,
    tier1: GLOBAL_TALENTS.tier1[0],
    tier2: GLOBAL_TALENTS.tier2[0],
    tier3: GLOBAL_TALENTS.tier3[0],
  };

  if (isMagicHero) emblemSug.tier1 = getTalent(1, 'rupture', 'inspire');
  else if (isAttackSpeedHero || isCritHero) emblemSug.tier1 = getTalent(1, 'fatal', 'swift');
  else if (isTrueTank || isSupport) emblemSug.tier1 = getTalent(1, 'vitality', 'firmness');
  else emblemSug.tier1 = getTalent(1, 'rupture', 'thrill');

  if (isJungle) emblemSug.tier2 = getTalent(2, 'seasoned_hunter');
  else if (isSustainFighter) emblemSug.tier2 = getTalent(2, 'festival_of_blood');
  else if (isSupport || isTrueTank) emblemSug.tier2 = getTalent(2, 'pull_yourself_together', 'tenacity');
  else emblemSug.tier2 = getTalent(2, 'master_assassin', 'bargain_hunter');

  if (isTrueTank) emblemSug.tier3 = getTalent(3, 'concussive_blast');
  else if (isSupport) emblemSug.tier3 = getTalent(3, 'focusing_mark', 'brave_smite');
  else if (isJungle) {
    if (isMagicHero) emblemSug.tier3 = getTalent(3, 'lethal_ignition', 'killing_spree');
    else emblemSug.tier3 = getTalent(3, 'killing_spree', 'lethal_ignition');
  }
  else if (isPureAssassin || (isAttackSpeedHero && userHero.role.includes('Assassin'))) emblemSug.tier3 = getTalent(3, 'killing_spree', 'lethal_ignition');
  else if (isAttackSpeedHero || isCritHero) emblemSug.tier3 = getTalent(3, 'quantum_charge', 'weakness_finder');
  else if (isMagicHero) emblemSug.tier3 = getTalent(3, 'impure_rage', 'lethal_ignition');
  else emblemSug.tier3 = getTalent(3, 'quantum_charge', 'brave_smite');

  // --- 7. SPELL LOGIC (Invariata ma ottimizzata) ---
  let recommendedSpell = SPELLS.FLICKER;
  if (isJungle) {
    recommendedSpell = SPELLS.RETRIBUTION;
  } else if (isRoam) {
    if (isTrueTank) recommendedSpell = ccThreat >= 3 ? SPELLS.PURIFY : SPELLS.VENGEANCE;
    else if (isPureAssassin) recommendedSpell = SPELLS.EXECUTE;
  } else {
    if (userHero.role.includes('Marksman')) {
      recommendedSpell = SPELLS.INSPIRE;
      if (ccThreat >= 3) recommendedSpell = SPELLS.PURIFY;
      else if (burstPhysThreat >= 1 || burstMagThreat >= 1) recommendedSpell = SPELLS.FLICKER;
    } else if (userHero.role.includes('Mage')) {
       recommendedSpell = ccThreat >= 2 ? SPELLS.PURIFY : (userHero.counterTags.some(t => /dash/i.test(t)) ? SPELLS.FLAMESHOT : SPELLS.FLICKER);
    } else if (userHero.role.includes('Fighter')) {
       recommendedSpell = SPELLS.VENGEANCE;
       if (!userHero.counterTags.some(t => /dash|mobility|jump/i.test(t))) recommendedSpell = SPELLS.FLICKER;
    } else if (userHero.role.includes('Assassin')) {
       recommendedSpell = SPELLS.EXECUTE;
       if (ccThreat >= 3) recommendedSpell = SPELLS.PURIFY;
    }
  }

  // --- 8. STATS CALCULATION ---
  const stats: Record<string, number> = {};
  const statProgression: Record<string, number>[] = [];
  
  finalBuild.forEach(slot => {
    slot.item.attributes.forEach(attr => {
      const match = attr.match(/\+([\d.]+)(%?)\s+(.*)/);
      if (match) {
        const value = parseFloat(match[1]);
        const isPercentage = match[2] === '%';
        let key = match[3].trim();
        
        if (key.includes('Attacco Fisico')) key = 'Attacco Fisico';
        else if (key.includes('Attacco Magico') || key.includes('Potere Magico') || key.includes('Attacco Adattivo')) key = 'Potere Magico';
        else if (key.includes('PV') || key.includes('HP') || key.includes('PS')) key = 'PV';
        else if (key.includes('Difesa Fisica')) key = 'Difesa Fisica';
        else if (key.includes('Difesa Magica')) key = 'Difesa Magica';
        else if (key.includes('Riduzione Ricarica') || key.includes('Riduzione CD')) key = 'Riduzione CD';
        else if (key.includes('Velocità d\'Attacco') || key.includes('Velocità di Attacco') || key.includes('Velocità Di Attacco')) key = 'Velocità d\'Attacco';
        else if (key.includes('Penetrazione Fisica')) key = 'Penetrazione Fisica';
        else if (key.includes('Penetrazione Magica')) key = 'Penetrazione Magica';
        else if (key.includes('Rubavita Fisico')) key = 'Rubavita Fisico';
        else if (key.includes('Rubavita Magico') || key.includes('Rubavita Incantesimo')) key = 'Rubavita Magico';
        else if (key.includes('Rubavita Ibrido')) key = 'Rubavita Ibrido';
        else if (key.includes('Probabilità Critico') || key.includes('Probabilita Critico')) key = 'Critico';

        const finalKey = isPercentage ? key + ' %' : key;
        stats[finalKey] = (stats[finalKey] || 0) + value;
      }
    });
    statProgression.push({ ...stats });
  });

  return {
    items: finalBuild,
    emblem: emblemSug,
    spell: recommendedSpell,
    stats,
    statProgression
  };
}
