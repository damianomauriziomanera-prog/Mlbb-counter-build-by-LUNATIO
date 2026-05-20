import { Hero, Item, BuildSlot, RecommendedBuild, Lane } from '../types';
import { ITEMS } from '../data/items';
import { EMBLEMS } from '../data/emblems';
import { SPELLS } from '../data/spells';

export function calculateBuild(userHero: Hero, lane: Lane, enemies: Hero[]): RecommendedBuild {
  const finalBuild: BuildSlot[] = [];
  const isJungle = lane === 'Jungle';
  const isRoam = lane === 'Roam';

  // --- 1. Enemy Analysis & Threat Detection ---
  const tags = enemies.flatMap(e => e.counterTags.join(' ').toLowerCase());
  const enemyCount = enemies.length;
  const physDamageSource = enemies.filter(e => e.damageType === 'Fisico').length;
  const magDamageSource = enemies.filter(e => e.damageType === 'Magico').length;
  
  const highRegenEnemies = enemies.filter(e => e.counterTags.some(t => /regen(?:pv)?|heal|vamp/i.test(t)) || ['estes', 'rafaela', 'angela', 'floryn', 'uranus', 'yu_zhong', 'ruby', 'alucard', 'alpha'].includes(e.id)).length;
  const tankyEnemies = enemies.filter(e => e.role.includes('Tank') || e.counterTags.some(t => /heavytank|highpv/i.test(t))).length;
  const ccEnemies = enemies.filter(e => e.counterTags.some(t => /cc|stun|suppress|knockup/i.test(t))).length;
  const burstPhysEnemies = enemies.filter(e => e.counterTags.some(t => /burstfisico|burstphysical/i.test(t)) || (e.role.includes('Assassin') && e.damageType === 'Fisico')).length;
  const burstMagEnemies = enemies.filter(e => e.counterTags.some(t => /burstmagico|burstmagic/i.test(t)) || (e.role.includes('Mage') && e.counterTags.some(t => /burst/i.test(t)))).length;
  const autoAttackers = enemies.filter(e => e.role.includes('Marksman') || e.counterTags.some(t => /attackspeed|autoattack/i.test(t))).length;
  const highMobilityEnemies = enemies.filter(e => e.counterTags.some(t => /mobility|dash/i.test(t))).length;

  // --- 2. Hero Archetype Identification ---
  const myTags = userHero.counterTags.join(' ').toLowerCase();
  const isMagicDamage = userHero.damageType === 'Magico';
  const isCritHero = /crit/i.test(myTags) || ['lesley', 'bruno', 'ling', 'irithel', 'layla', 'miya'].includes(userHero.id);
  const isAttackSpeedHero = /attackspeed/i.test(myTags) || ['claude', 'wanwan', 'karrie', 'moskov', 'hanabi', 'melissa', 'sun', 'argus', 'zilong'].includes(userHero.id);
  const isSkillCasterPhys = !isAttackSpeedHero && !isCritHero && userHero.damageType === 'Fisico' && (userHero.role.includes('Assassin') || userHero.role.includes('Fighter'));
  const isBurstMage = /burst/i.test(myTags) && isMagicDamage;
  const isDpsMage = /dps|continuous/i.test(myTags) && isMagicDamage;
  const isSustainFighter = /regen|lifesteal|spellvamp/i.test(myTags) || ['ruby', 'yu_zhong', 'alucard', 'alpha', 'terizla', 'lapu-lapu', 'thamuz'].includes(userHero.id);
  const isTrueTank = userHero.role.includes('Tank') && !userHero.role.includes('Fighter') && !userHero.role.includes('Marksman');
  const isSupport = userHero.role.includes('Support');

  // --- 3. Boots Selection ---
  let boots = isMagicDamage ? ITEMS.MAGIC_SHOES : ITEMS.WARRIOR_BOOTS;
  let bootsReason = "Calzature base per ottimizzare le tue performance.";

  if (ccEnemies >= 2 || magDamageSource > physDamageSource + 1) {
    boots = ITEMS.TOUGH_BOOTS;
    bootsReason = "La Tenacia offerta dai Tough Boots è cruciale contro i numerosi CC e danni magici nemici.";
  } else if (autoAttackers >= 2 && !isTrueTank && !isSupport) {
    boots = ITEMS.WARRIOR_BOOTS;
    bootsReason = "L'armatura fisica accumulabile contrasta pesantemente i tiratori e gli attaccanti veloci avversari.";
  } else if (isAttackSpeedHero) {
    boots = ITEMS.SWIFT_BOOTS;
    bootsReason = "Necessari per raggiungere velocemente i breakpoint di velocità d'attacco ottimali.";
  } else if (isMagicDamage && !isSupport && !isTrueTank) {
    boots = ITEMS.ARCANE_BOOTS;
    if (userHero.counterTags.some(t => /cd|spam/i.test(t))) boots = ITEMS.MAGIC_SHOES;
    bootsReason = "Apportano la Penetrazione Magica necessaria (o CDR se l'eroe spamma abilità) per impattare in Early Game.";
  } else if (isSupport || isTrueTank) {
    boots = ITEMS.TOUGH_BOOTS; 
    if (physDamageSource >= 3) boots = ITEMS.WARRIOR_BOOTS;
    bootsReason = "Protezione base adattata alle fonti di danno nemiche dominanti.";
  }

  if (isJungle) {
    let jungleSpell = ITEMS.JUNGLE_ICE;
    if (isTrueTank || isSupport || isSustainFighter) jungleSpell = ITEMS.JUNGLE_BEHEMOTH;
    else if (isBurstMage || isSkillCasterPhys || isCritHero) jungleSpell = ITEMS.JUNGLE_FLAME;
    
    finalBuild.push({
      item: { ...boots, name: `${boots.name} (${jungleSpell.name})` },
      reason: `${bootsReason} Equipaggiamento da Jungler: ${jungleSpell.passiveDescription}`
    });
  } else if (isRoam) {
    let roamBlessing = ITEMS.ROAM_ENCOURAGE;
    if (highMobilityEnemies >= 2 || ['tigreal', 'atlas', 'khufra', 'franco'].includes(userHero.id)) {
      roamBlessing = ITEMS.ROAM_CONCEAL;
    } else if (isSupport && ['estes', 'rafaela', 'angela'].includes(userHero.id)) {
      roamBlessing = ITEMS.ROAM_FAVOR;
    } else if (isSkillCasterPhys && userHero.role.includes('Assassin')) { // Dire Hit Roamers (Selena, Natalia, Saber, Kadita)
      roamBlessing = ITEMS.ROAM_DIRE_HIT;
    } else if (['kadita', 'selena', 'natalia', 'hilda', 'mathilda'].includes(userHero.id)) {
      roamBlessing = ITEMS.ROAM_DIRE_HIT;
    }

    finalBuild.push({
      item: { ...boots, name: `${boots.name} (${roamBlessing.name})` },
      reason: `${bootsReason} Equipaggiamento da Roamer: ${roamBlessing.passiveDescription}`
    });
  } else {
    finalBuild.push({ item: boots, reason: `${bootsReason}` });
  }

  // Helper per inserimento oggetti unici
  const buildPool: Record<string, BuildSlot> = {};
  const add = (item: Item, reason: string, priority: number = 0) => {
    if (!item) return;
    if (!buildPool[item.id]) {
      buildPool[item.id] = { item, reason };
    }
  };

  // --- 4. Core Item Logic (Archetype Specific) ---
  if (isTrueTank || isSupport) {
    if (isSupport && highRegenEnemies === 0) add(ITEMS.FLASK_OF_THE_OASIS, "Fornisce scudi vitali agli alleati quando curati sotto il 35% HP.");
    if (physDamageSource >= 1) add(ITEMS.DOMINANCE_ICE, "Contrasto assoluto contro DPS e Rigenerazione, riduce velocità d'attacco e cure nemiche nel raggio d'azione.");
    if (magDamageSource >= 1) {
      if (burstMagEnemies >= 1) add(ITEMS.ATHENAS_SHIELD, "Fondamentale per assorbire efficacemente la combo a raffica magica iniziale.");
      if (isDpsMage || magDamageSource >= 2) add(ITEMS.RADIANT_ARMOR, "Riesce a sopportare danni magici continuati (DPS), accumulando riduzione del danno.");
    }
    if (autoAttackers >= 1) add(ITEMS.BLADE_ARMOR, "Restituisce il danno ai tiratori nemici rallentandoli ed è l'armatura fisica con i valori più alti.");
    if (burstPhysEnemies >= 1) add(ITEMS.ANTIQUE_CUIRASS, "Attenua permanentemente l'Attacco Fisico degli eroi nemici che si basano sulle abilità (Assassini fisici/Combattenti).");
    if (!buildPool['dominance_ice'] && highRegenEnemies >= 1) add(ITEMS.DOMINANCE_ICE, "Anti-Heal vitale contro i nemici con alta rigenerazione o scudi.");
    
    // Fillers if missing slots
    add(ITEMS.IMMORTALITY, "Assicura un'ancora di salvezza in fase avanzata rianimandoti con scudo e salute limitata nel mezzo dei teamfight cruciali.");
    add(ITEMS.BRUTE_FORCE_BREASTPLATE, "Offre mobilità crescente e potenziamento della difesa scalando nel tempo durante le ingaggi.");
    add(ITEMS.ORACLE, "Sinsergizza ottimamente con scudi e cure per un notevole self-sustain, oltre ad offrire CDR e tenacia magica.");
  } 
  else if (userHero.role.includes('Marksman')) {
    if (isCritHero) {
      add(ITEMS.BERSERKERS_FURY, "Il motore centrale per gli eroi critici: aumenta vertiginosamente probabilità e danno del colpo critico.");
      add(ITEMS.WINDTALKER, "Diffonde il danno base ai nemici vicini, garantendo mobilità eccezionale e potenziale di critico.");
      add(ITEMS.HAAS_CLAWS, "Sostentamento indispensabile; garantisce enormi capacità di Rubavita tramite danni critici.");
      if (tankyEnemies >= 1) add(ITEMS.MALEFIC_ROAR, "Distrugge la prima linea e i tank squarciando pesantemente la loro armatura fisica accumulata.");
      else add(ITEMS.BOD, "Incremento folle di Attacco Fisico in grado di polverizzare i bersagli vulnerabili con pochi colpi.");
    } else if (isAttackSpeedHero) {
      add(ITEMS.CORROSION_SCYTHE, "Aumenta la frequenza di colpi e rallenta drammaticamente il bersaglio, ottimizzando i danni nel tempo.");
      add(ITEMS.DEMON_HUNTER_SWORD, "L'Anti-Tank per eccellenza: divora grosse porzioni della salute nemica con ogni attacco base inflitto.");
      add(ITEMS.GOLDEN_STAFF, "Converte probabilità di critico in pura furia d'attacco, triplicando la rapida esecuzione degli effetti 'on-hit'.");
      if (tankyEnemies >= 2) add(ITEMS.MALEFIC_ROAR, "Affonda le corazze nemiche per garantire che gli attacchi 'on-hit' pungano anche attraverso armature pesanti.");
      else if (highRegenEnemies >= 1) add(ITEMS.SEA_HALBERD, "Infligge danni extra incrementali in base alla soglia di HP del nemico (punisce i tank) arrestando parallelamente rigenerazioni folli.");
    } else { // E.g. Brody, Clint
      add(ITEMS.BOD, "Amplifica spaventosamente i danni base ad alto scalamento, eliminando in un attimo bersagli con poca vita.");
      add(ITEMS.MALEFIC_ROAR, "Assicura penetrazione pura in ogni fase di gioco per scavalcare ogni genere di riduzione danni fisica.");
      add(ITEMS.ENDLESS_BATTLE, "Genera Danno Puro dopo ogni uso di abilità: una potente iniezione letale fra un'auto e un'altra.");
      add(ITEMS.HEPTASEAS, "Permette raffiche improvvise da zone non visibili (es. cespugli), garantendo supremazia nel pockear il nemico.");
    }
  } 
  else if (isMagicDamage) {
    if (isBurstMage) {
      add(ITEMS.LIGHTNING_TRUNCHEON, "Sfrutta l'abbondanza di mana per concatenare colpi letali istantanei ad area (Burst esplosivo improvviso).");
      add(ITEMS.GENIUS_WAND, "Strappa via la magro difesa magica naturale nei bersagli deboli, riducendo l'Armor Magica e punendoli.");
      add(ITEMS.HOLY_CRYSTAL, "Scalamento massiccio percentuale per un enorme picco in Potere Magico puro da usare verso il late game.");
      if (tankyEnemies >= 1) add(ITEMS.DIVINE_GLAIVE, "Trancia il muro delle difese magiche avversarie, superando Athena's Shield e armatura per preservare letalità.");
      add(ITEMS.BLOOD_WINGS, "Aggiunge sopravvivenza grazie allo scudo scalabile con potere magico ed incrementa in maniera brutale tutti i danni inflitti.");
    } else { // DPS, Poke, Sustained Mages (e.g., Lylia, Yve, Valir)
      add(ITEMS.ENCHANTED_TALISMAN, "Cuore pulsante del Mago-DPS: Ricarica insaziabile e riserva illimitata di mana per non terminare mai gli incantesimi.");
      add(ITEMS.ICE_QUEEN_WAND, "Effetti di congelamento e paralisi: rallenta progressivamente rendendo quasi impossibile la fuga alle vittime e i nemici.");
      add(ITEMS.GLOWING_WAND, "Il costante danno percentuale per usura indebolisce progressivamente la barra della salute, frenando anche il recupero.");
      if (tankyEnemies >= 1) add(ITEMS.DIVINE_GLAIVE, "Fessurizza i setup difensivi nemici che andrebbero altrimenti ad attutire i colpi continuati.");
      else add(ITEMS.WISHING_LANTERN, "Eccellente contro team con grossi lotti di HP o composizioni doppie tank, lanciando raffiche proporzionate max-HP.");
    }
  } 
  else if (isSkillCasterPhys) { // Saber, Lancelot, Arlott, X.Borg, Benedetta
    add(ITEMS.HUNTER_STRIKE, "MIGLIOR STRUMENTO DI FLANK: Dona estrema fluidità post-ingaggio offrendo incremento esplosivo per muoversi dopo un set di colpi.");
    add(ITEMS.WAR_AXE, "Vince gli scambi prolungati generando tenacia, scudi (tramite sustain) e persino Danno Puro ad alti stack in combattimento.");
    add(ITEMS.HEPTASEAS, "Perfetto per Assassini / Incursori fisici. Potenzia il colpo successivo al raggiungimento del target uscendo dai cespugli.");
    if (highRegenEnemies >= 1) add(ITEMS.SEA_HALBERD, "Disturba brutalmente chi fa uso di elevate cure ostacolando pesantemente il reset di vita nel fitto della battaglia.");
    add(ITEMS.MALEFIC_ROAR, "Neutralizza con superbia le difese robuste o le corrazze avversarie offrendo una letale componente d'Ignoranza sull'armatura.");
    add(ITEMS.BOD, "Sinergizza pesantemente col fattore giustiziere: i bersagli fragili o con bassi livelli di HP non avranno quasi nessuno scampo.");
  }
  else if (isSustainFighter) { // Yu Zhong, Ruby, Alpha
    add(ITEMS.WAR_AXE, "Ottimizza il sustain duraturo nel conflitto ed è la risorsa base per aumentare in penetrazione senza disporre di difese basse.");
    if (highRegenEnemies >= 1) add(ITEMS.SEA_HALBERD, "Mentre tu rigeneri attivamente, vieta al team nemico di compensare negando la metà dei loro cure.");
    add(ITEMS.HUNTER_STRIKE, "Colma la carenza di mobilità per non essere kited e garantire ingaggio. Include Penetrazione vitale per infliggere danni.");
    add(ITEMS.ORACLE, "Peculiare potenziamento al proprio Rubavita/Scudi: amplia sostanzialmente le quote di auto-cura per restare immortali nei combattimenti ad oltranza.");
    add(ITEMS.BRUTE_FORCE_BREASTPLATE, "Offre l'equilibrio ideale di riduzione tempi ricarica e mitigazione crescente dai danni nemici ogni volta che usi abilità o colpisci.");
  }
  else {
    // Generic Physical Fill
    add(ITEMS.ENDLESS_BATTLE, "Versatilità eccellente su ogni attributo necessario per scontri fisici e produce Danni Puri di precisione.");
    add(ITEMS.MALEFIC_ROAR, "Standard d'eccellenza per neutralizzare la progressione corazzata naturale del late game nemico.");
    add(ITEMS.BOD, "Avere un potenziale di impatto violento per ripulire rapidamente i nemici indeboliti non deve mai mancare.");
  }

  // --- 5. Defensive & Tactical Counters (Overrides) ---
  if (!isTrueTank && !isSupport) {
    // If squishy, add survivability
    const isSquishy = userHero.role.includes('Marksman') || userHero.role.includes('Mage') || userHero.role.includes('Assassin');
    if (isSquishy) {
      if (burstPhysEnemies >= 1) {
        if (userHero.role.includes('Marksman')) add(ITEMS.WIND_OF_NATURE, "SALVAVITA CONTRO BURST FISICI: L'invulnerabilità attiva di due secondi ti consente di schivare agguati improvvisi (es. Assassini).");
        else add(ITEMS.ANTIQUE_CUIRASS, "Assorbe colpi abilità pesanti da assassini riducendone la letalità base a cascata (ideale per ridurre l'input esplosivo).");
      }
      if (burstMagEnemies >= 1) {
         if (isMagicDamage) add(ITEMS.WINTER_CROWN, "Sospende forzatamente l'effetto fatale degli agganci nemici o raffiche AoE offrendoti l'invulnerabilità magica di congelamento attiva.");
         else add(ITEMS.ROSE_GOLD_METEOR, "Attiva un provvidenziale e vigoroso scudo magico d'emergenza che assorbe la fiammata letale avversaria mantenendoti operativo, specie nel contrattacco.");
      }
      
      // Assicuriamoci che un mago non finisca con WoN e Rose Gold
      if (isMagicDamage && burstMagEnemies >= 1 && burstPhysEnemies >= 1) {
         add(ITEMS.WINTER_CROWN, "STRUMENTO TATTICO DIFENSIVO IBRIDO: Utilissimo congelamento reattivo per disperdere qualsivoglia forma di burst fisico e magico ostile imminente.");
      }
    } else { // Fighters/Bruisers
      if (burstMagEnemies >= 1) add(ITEMS.ATHENAS_SHIELD, "Argina drasticamente il potenziale da 'one-shot' magico mitigandone i danni critici all'impatto.");
      if (autoAttackers >= 2) add(ITEMS.DOMINANCE_ICE, "Ostacola l'offensiva dei tiratori abbattendo non solo HP ma anche drasticamente i ritmi dei loro click base in prossimità.");
    }
  }

  // --- 6. Final Core Assemblage ---
  const generatedItems = Object.values(buildPool);
  let sortedItems = generatedItems;

  // Priotize core/anti-heal items
  sortedItems.sort((a, b) => {
    let scoreA = 0; let scoreB = 0;
    if (a.item.id === 'dominance_ice' || a.item.id === 'sea_halberd' || a.item.id === 'glowing_wand') scoreA += 10;
    if (b.item.id === 'dominance_ice' || b.item.id === 'sea_halberd' || b.item.id === 'glowing_wand') scoreB += 10;
    return scoreB - scoreA;
  });

  const slotsToAdd = Math.min(5, sortedItems.length); // 1 boot + 5 items = 6
  for (let i = 0; i < slotsToAdd; i++) {
    finalBuild.push(sortedItems[i]);
  }

  // Ensure exactly 6 items if possible
  const genericFillers = isMagicDamage 
    ? [ITEMS.BLOOD_WINGS, ITEMS.HOLY_CRYSTAL, ITEMS.IMMORTALITY] 
    : [ITEMS.IMMORTALITY, ITEMS.BOD, ITEMS.MALEFIC_ROAR];
  let fillerIdx = 0;
  while (finalBuild.length < 6 && fillerIdx < genericFillers.length) {
    const filler = genericFillers[fillerIdx];
    if (!finalBuild.some(b => b.item && b.item.id === filler.id)) {
      finalBuild.push({ item: filler, reason: "Riempitivo eccellente: Garantisce statistiche core essenziali in carenza di precise richieste nemiche." });
    }
    fillerIdx++;
  }

  // --- 7. EMBLEM LOGIC ---
  let selectedEmblem = EMBLEMS.BASIC;
  if (isTrueTank) selectedEmblem = EMBLEMS.TANK;
  else if (isSupport) selectedEmblem = EMBLEMS.SUPPORT;
  else if (isMagicDamage) selectedEmblem = EMBLEMS.MAGE;
  else if (userHero.role.includes('Marksman')) selectedEmblem = EMBLEMS.MARKSMAN;
  else if (userHero.role.includes('Assassin')) selectedEmblem = EMBLEMS.ASSASSIN;
  else if (userHero.role.includes('Fighter')) selectedEmblem = EMBLEMS.FIGHTER;
  
  // Scelta automatica Talenti Intelligente in base al ruolo e danni
  const getTalent = (tier: 1 | 2 | 3, targetId1: string, targetId2?: string) => {
    let t;
    Object.values(EMBLEMS).forEach(e => {
      const arr = e.talents[`tier${tier}`];
      if (arr) {
        const found = arr.find(x => x.id === targetId1 || x.id === targetId2);
        if (found) t = found;
      }
    });
    return t || selectedEmblem.talents[`tier${tier}`][0];
  };

  const emblemSug = {
    id: selectedEmblem.id,
    name: selectedEmblem.name,
    iconUrl: selectedEmblem.iconUrl,
    tier1: selectedEmblem.talents.tier1[0],
    tier2: selectedEmblem.talents.tier2[0],
    tier3: selectedEmblem.talents.tier3[0],
  };

  // Tier 1 mapping
  if (isMagicDamage) emblemSug.tier1 = getTalent(1, 'rupture', 'inspire');
  else if (isAttackSpeedHero || isCritHero) emblemSug.tier1 = getTalent(1, 'fatal', 'swift');
  else if (isTrueTank || isSupport) emblemSug.tier1 = getTalent(1, 'vitality', 'firmness');
  else emblemSug.tier1 = getTalent(1, 'rupture', 'thrill');

  // Tier 2 mapping
  if (isJungle) emblemSug.tier2 = getTalent(2, 'seasoned_hunter');
  else if (isSustainFighter) emblemSug.tier2 = getTalent(2, 'festival_of_blood');
  else if (isSupport) emblemSug.tier2 = getTalent(2, 'pull_yourself_together', 'gift');
  else emblemSug.tier2 = getTalent(2, 'master_assassin', 'bargain_hunter');

  // Tier 3 mapping
  if (isTrueTank) emblemSug.tier3 = getTalent(3, 'concussive_blast');
  else if (isSupport) emblemSug.tier3 = getTalent(3, 'focusing_mark', 'brave_smite');
  else if (isJungle || isSkillCasterPhys) emblemSug.tier3 = getTalent(3, 'killing_spree', 'lethal_ignition');
  else if (isAttackSpeedHero || isCritHero) emblemSug.tier3 = getTalent(3, 'quantum_charge', 'weakness_finder');
  else if (isMagicDamage) emblemSug.tier3 = getTalent(3, 'impure_rage', 'lethal_ignition');
  else emblemSug.tier3 = getTalent(3, 'quantum_charge', 'brave_smite');

  // --- 8. SPELL LOGIC ---
  let recommendedSpell = SPELLS.FLICKER;
  if (isJungle) {
    recommendedSpell = SPELLS.RETRIBUTION;
  } else if (isRoam) {
    if (isTrueTank) recommendedSpell = ccEnemies >= 3 && highMobilityEnemies <= 1 ? SPELLS.PURIFY : (highMobilityEnemies >= 2 && !userHero.counterTags.some(t => /dash/i.test(t)) ? SPELLS.FLICKER : SPELLS.VENGEANCE);
    else if (isSupport) recommendedSpell = SPELLS.FLICKER; // Default saftey
  } else {
    if (userHero.role.includes('Marksman')) {
      recommendedSpell = SPELLS.INSPIRE;
      if (ccEnemies >= 3) recommendedSpell = SPELLS.PURIFY;
      else if (burstPhysEnemies >= 1 || burstMagEnemies >= 1) {
        if (!userHero.counterTags.some(t => /dash|mobility/i.test(t))) recommendedSpell = SPELLS.FLICKER;
        else recommendedSpell = SPELLS.AEGIS;
      }
    } else if (userHero.role.includes('Mage')) {
       recommendedSpell = ccEnemies >= 2 ? SPELLS.PURIFY : (userHero.counterTags.some(t => /dash/i.test(t)) ? SPELLS.FLAMESHOT : SPELLS.FLICKER);
    } else if (userHero.role.includes('Fighter')) {
       recommendedSpell = SPELLS.VENGEANCE;
       if (!userHero.counterTags.some(t => /dash|mobility/i.test(t))) recommendedSpell = SPELLS.FLICKER;
       else if (isSkillCasterPhys) recommendedSpell = SPELLS.PETRIFY;
    } else if (userHero.role.includes('Assassin')) {
       recommendedSpell = SPELLS.EXECUTE;
    }
    
    // Global cc override per saftey if highly vulnerable
    if (ccEnemies >= 4 && !isJungle && !isTrueTank) recommendedSpell = SPELLS.PURIFY;
  }

  // --- 9. STATS CALCULATION ---
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
        else if (key.includes('Attacco Magico') || key.includes('Potere Magico') || key.includes('Attacco Adattivo')) key = 'Attacco Adattivo';
        else if (key.includes('PV') || key.includes('HP')) key = 'PV';
        else if (key.includes('Difesa Fisica')) key = 'Difesa Fisica';
        else if (key.includes('Difesa Magica')) key = 'Difesa Magica';
        else if (key.includes('Riduzione Ricarica') || key.includes('Riduzione CD')) key = 'Riduzione CD';
        else if (key.includes('Velocità d\'Attacco')) key = 'Velocità d\'Attacco';
        else if (key.includes('Penetrazione Fisica')) key = 'Penetrazione Fisica';
        else if (key.includes('Penetrazione Magica')) key = 'Penetrazione Magica';
        else if (key.includes('Rubavita Fisico')) key = 'Rubavita Fisico';
        else if (key.includes('Rubavita Magico') || key.includes('Rubavita Incantesimo')) key = 'Rubavita Magico';
        else if (key.includes('Probabilità Critico')) key = 'Critico';

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
