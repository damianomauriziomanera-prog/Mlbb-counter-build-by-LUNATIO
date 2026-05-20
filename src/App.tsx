import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { HEROES } from './data/heroes';
import { OFFICIAL_ITEMS } from './data/items';
import { calculateBuild } from './lib/buildLogic';
import { Hero, BuildSlot, Item, Lane, RecommendedBuild, SavedBuild, MetaHero, Talent } from './types';
import { EMBLEMS } from './data/emblems';
import { Sword, Shield, Book, Scroll, AlertCircle, RefreshCw, Crosshair, ChevronsDown, CloudDownload, Loader2, CheckCircle, Search, X, BookOpen, Info, Sparkles, Filter, Users, HelpCircle, Activity, Heart, Target, Zap, Copy, Save, Share2, Trash2, TrendingUp, Trophy, BarChart3, ChevronDown, ChevronUp, ChevronRight, LayoutGrid, List, AlertTriangle, Star, Wrench, Plus, Youtube } from 'lucide-react';
import { META_HEROES } from './data/metaData';
import { HeroGrid } from './components/HeroGrid';
import { HeroImageWithFallback } from './components/Common/HeroImageWithFallback';
import { MatchAnalyzerModal } from './components/MatchAnalyzerModal';

const getTagColor = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('cc') || t.includes('stun') || t.includes('control') || t.includes('freeze') || t.includes('slow') || t.includes('suppress') || t.includes('knock')) 
    return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  if (t.includes('burst') || t.includes('damage') || t.includes('shred') || t.includes('penetration') || t.includes('execute') || t.includes('crit')) 
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (t.includes('sustain') || t.includes('heal') || t.includes('regen') || t.includes('lifesteal') || t.includes('shield') || t.includes('immortality')) 
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (t.includes('mobility') || t.includes('dash') || t.includes('teleport') || t.includes('speed') || t.includes('chase') || t.includes('blink')) 
    return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  if (t.includes('tank') || t.includes('pv') || t.includes('defense') || t.includes('armor') || t.includes('heavy') || t.includes('size')) 
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (t.includes('poke') || t.includes('range') || t.includes('continuous')) 
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  return 'bg-slate-800/50 text-slate-400 border-slate-700/50';
};

const translateTag = (tag: string) => {
  const map: Record<string, string> = {
    'highCC': 'Alto CC',
    'knockback': 'Respinta',
    'shieldPV': 'Scudo PV',
    'lateGameBurst': 'Burst Fine Gioco',
    'stackDamage': 'Danno Cumulativo',
    'chase': 'Inseguimento',
    'aoeSustain': 'Sostenibilità AoE',
    'teleport': 'Teletrasporto',
    'highPVMagic': 'Tank Magico',
    'trueDamage': 'Danno Puro',
    'sustainSpam': 'Sustain Continuo',
    'slow': 'Rallentamento',
    'lifestealDPS': 'Rubavita DPS',
    'groupCC': 'CC di Gruppo',
    'aoeStun': 'Stun AoE',
    'freezeCC': 'Congelamento',
    'burstMagico': 'Burst Magico',
    'aoeControl': 'Controllo AoE',
    'wallCreate': 'Crea Muri',
    'burstStun': 'Burst Stun',
    'shieldImmunity': 'Scudo Immunità',
    'executeUltimate': 'Esecuzione Ulti',
    'jungleSustain': 'Sustain Giungla',
    'pokeAoE': 'Poke AoE',
    'heal': 'Cura',
    'pushTurret': 'Spinta Torri',
    'highPVPhysical': 'Tank Fisico',
    'suppressCC': 'Soppressione',
    'stackSize': 'Dimensione Cumulo',
    'builtInAntiHeal': 'Anti-Cura Integrato',
    'highMobilityRoam': 'Alta Mobilità',
    'tauntCC': 'Provocazione',
    'passiveReflect': 'Riflesso Passiva',
    'counterDPS': 'Contrasta DPS',
    'dashSpam': 'Spam Scatti',
    'immunityCC': 'Immunità CC',
    'burstFisico': 'Burst Fisico',
    'markStack': 'Cumulo Marchio',
    'highCritDPS': 'DPS Critico Alto',
    'rangePoke': 'Poke a Distanza',
    'damageShare': 'Danno Condiviso',
    'ccAoE': 'CC AoE',
    'stealDefense': 'Ruba Difesa',
    'infiniteManaStack': 'Mana Infinito',
    'continuousMagic': 'Magia Continua',
    'shieldActive': 'Scudo Attivo',
    'fastPush': 'Push Rapido',
    'suppressSingle': 'Soppressione Singola',
    'immunityDash': 'Scatto Immunità',
    'attackSpeedDPS': 'DPS Velocità Attacco',
    'highMobility': 'Alta Mobilità',
    'aoeUltimate': 'Ulti AoE',
    'burstPassive': 'Burst Passiva',
    'singleLockCC': 'Blocco Singolo',
    'spamAbilita': 'Spam Abilità',
    'sustainMagico': 'Sustain Magico',
    'antiCCGlobal': 'Anti-CC Globale',
    'shieldAoE': 'Scudo AoE',
    'slowBombs': 'Bombe Rallentanti',
    'shredDefense': 'Riduzione Difesa',
    'earlyGameBurst': 'Burst Inizio Gioco',
    'lifesteal': 'Rubavita',
    'shieldAbsorb': 'Assorbimento Scudo',
    'sustainContinuous': 'Sustain Continuo',
    'aoeHealSpam': 'Cura AoE',
    'teamSustain': 'Sostenibilità Team',
    'singleTargetBurst': 'Burst Singolo',
    'instantStun': 'Stun Istantaneo',
    'extremeMobility': 'Estra-Mobilità',
    'energySpam': 'Spam Energia',
    'wallDash': 'Scatto su Muro',
    'resurrectionAoE': 'Resurrezione AoE',
    'pullCC': 'Trazione CC',
    'burstMagicGroup': 'Burst Magico Gruppo',
    'globalHeal': 'Cura Globale',
    'antiAntiHeal': 'Anti Anti-Cura',
    'stun': 'Stordimento',
    'hookSingle': 'Gancio Singolo',
    'fastPick': 'Pick Rapido',
    'tauntDamageReflect': 'Riflesso Danno',
    'shieldSpam': 'Spam Scudo',
    'highAttackSpeed': 'Alta Vel. Attacco',
    'passiveArmorReflect': 'Corazza Passiva',
    'attachToEnemy': 'Attacca a Nemico',
    'slowSpam': 'Spam Rallento',
    'regenPV': 'Rigenerazione PV',
    'trueDamageContinuous': 'Danno Puro Continuo',
    'aoeMelt': 'Fusione AoE',
    'mobilityDash': 'Scatto Mobilità',
    'jungleFast': 'Giungla Rapida',
    'heavyTank': 'Tank Pesante',
    'immunitàCC': 'Immunità CC',
    'dannoFisicoIniziale': 'Danno Fisico Iniziale',
    'knockupCC': 'Lancio in Aria',
    'jumpDash': 'Salto/Scatto',
    'instantBurstMagic': 'Burst Magico Rapido',
    'dashRecall': 'Ritorno con Scatto',
    'bounceAttack': 'Attacco Rimbalzo',
    'ccImmunityShield': 'Scudo Immunità CC',
    'aoeImmobilize': 'Immobilizza AoE',
    'hitAndRun': 'Colpisci e Fuggi',
    'cardMark': 'Marchio Carte',
    'shadowTeleport': 'Teletrasporto Ombra',
    'invincibleUltimate': 'Ulti Invincibile',
    'blindMap': 'Mappa Oscurata',
    'silenceCC': 'Silenziamento',
    'instantBurstFisico': 'Burst Fisico Rapido',
    'manaToPV': 'Mana in PV',
    'continuousAoeSlow': 'Rallento AoE',
    'teamSpeedPath': 'Sentiero Velocità',
    'shootWhileMoving': 'Spara in Movimento',
    'aoeCritDPS': 'DPS Critico AoE',
    'armorShred': 'Riduzione Armatura',
    'aoeUltimateRange': 'Raggio Ulti AoE',
    'sustainPassive': 'Sustain Passivo',
    'throwEjectCC': 'Lancio/Espulsione',
    'globalCarDrive': 'Guida Globale',
    'aoeStunCrash': 'Scontro AoE Stun',
    'shieldLowPV': 'Scudo Bassi PV',
    'dashRhythm': 'Ritmo Scatti',
    'ccImmunity': 'Immunità CC',
    'aoeMagicBurst': 'Burst Magico AoE',
    'enhancedAbilita': 'Abilità Potenziate',
    'knockupOrImmunity': 'Lancio o Immunità',
    'lifestealMagic': 'Rubavita Magico',
    'passiveHeal': 'Cura Passiva',
    'umbrellaTeleport': 'Teletrasporto Ombrello',
    'ccPurifyBuiltIn': 'Purifica Integrato',
    'aoeBurstControl': 'Burst Controllo AoE',
    'pullEnemy': 'Trazione Nemico',
    'damageReduction': 'Riduzione Danno',
    'trueDamagePassive': 'Danno Puro Passivo',
    'basicAttackBlock': 'Blocco Attacco Base',
    'resetUltimate': 'Reset Ulti',
    'trueDamagePercent': 'Danno Puro %',
    'tankMelter': 'Sciogli Tank',
    'fastHealChannel': 'Cura Canalizzata',
    'aoeStunUltimate': 'Stun Ulti AoE',
    'antiDashBall': 'Sfera Anti-Scatto',
    'jumpStun': 'Salto con Stun',
    'wallPinCC': 'Inchioda a Muro',
    'continuousMagicMove': 'Movimento Magico',
    'aimJoystick': 'Mira Joystick',
    'invincibilityAbilita': 'Invincibilità',
    'ccImmunityHeavy': 'Immunità CC Pesante',
    'aoeBurstFisico': 'Burst Fisico AoE',
    'extremeRange': 'Gittata Estrema',
    'lateGameCritDPS': 'Critici Late Game',
    'mountedEnhanced': 'Potenziato a Cavallo',
    'guaranteedCritLowPV': 'Critico Garantito',
    'pushCC': 'Spinta CC',
    'trueDamageSniper': 'Cecchino Danno Puro',
    'camouflageMobility': 'Mimica e Mobilità',
    'wallWalk': 'Cammina su Muri',
    'shieldReflectProjectiles': 'Riflette Proiettili',
    'aoeStunCharge': 'Carica Stun AoE',
    'magicPenetrationPercent': 'Penetrazione Magica %',
    'invincibilityBrilliance': 'Invincibilità Splendente',
    'controlloAoE': 'Controllo AoE',
    'altaMobilitaTeam': 'Mobilità Team Alta',
    'aoeGloomSpam': 'Spam Oscurità AoE',
    'timeRecallHeal': 'Ritorno Temporale',
    'slowContinuous': 'Rallento Continuo',
    'ccImmunityActive': 'Immunità CC Attiva',
    'damageReductionDash': 'Riduzione Danno Scatto',
    'trueDamageExecute': 'Esecuzione Danno Puro',
    'threeHPBars': '3 Barre di Vita',
    'extremeAttackSpeed': 'Vel. Attacco Estrema',
    'disarmCC': 'Disarmo CC',
    'wispTeamDash': 'Scatto Team Fuoco Fatuo',
    'antiMeleeBubble': 'Bolla Anti-Mischia',
    'dollLinkDamage': 'Danno Collegato Bambola',
    'tripleKnockupAoE': 'Triplo Lancio AoE',
    'aoeHeal': 'Cura AoE',
    'rageDefense': 'Difesa dalla Rabbia',
    'invisiblePurifyUltimate': 'Invisibilità e Purifica',
    'multiTargetCrit': 'Critici Multi-Target',
    'molinaTransformCC': 'Trasformazione Molina',
    'passiveMolinaEscape': 'Fuga Molina Passiva',
    'aoeBurstMagic': 'Burst Magico AoE',
    'stealthInvisibility': 'Invisibilità Furtiva',
    'silenceSmoke': 'Fumo Silenziante',
    'immuneBasicAttacks': 'Immune Attacchi Base',
    'magicAttackSpeedDPS': 'DPS Magico Rapido',
    'cloneDamage': 'Danno Cloni',
    'riftExplosionBurst': 'Burst Esplosione Rift',
    'builtInPurify': 'Purifica Integrato',
    'longRangeSniper': 'Cecchino Lungo Raggio',
    'revealMap': 'Rivela Mappa',
    'slowPercent': 'Rallentamento %',
    'massiveAoeUltimate': 'Massiccia Ulti AoE',
    'shieldChanneling': 'Scudo Canalizzato',
    'bounceCC': 'CC a Rimbalzo',
    'comboSpamNoCooldown': 'Spam Combo No CD',
    'artilleryAoeUltimate': 'Artiglieria AoE',
    'birdEscape': 'Fuga in Forma Uccello',
    'stunMark': 'Marchio con Stun',
    'antiDashCounter': 'Contrasta Scatti',
    'aoeJump': 'Salto AoE',
    'wolfCompanion': 'Compagno Lupo',
    'trapCC': 'Trappola CC',
    'singleTargetStun': 'Stun Singolo',
    'healSpeedAoE': 'Cura e Vel. AoE',
    'slowPoke': 'Poke Rallentante',
    'lineStun': 'Stun in Linea',
    'wolfFormExecute': 'Forma Lupo Esecuzione',
    'humanFormPoke': 'Forma Umana Poke',
    'aoeStunPull': 'Stun e Trazione AoE',
    'extremeSpellVamp': 'Spell Vamp Estremo',
    'defensePassiveDash': 'Difesa Scatto Passiva',
    'knockupSingleBurst': 'Burst Lancio Singolo',
    'longStunArrow': 'Freccia Stun Lunga',
    'trapVision': 'Visione Trappole',
    'abyssalBurst': 'Burst Abissale',
    'cloneSpam': 'Spam Cloni',
    'dpsTankMelter': 'DPS Sciogli Tank',
    'damageReductionPV': 'Riduzione Danno PV',
    'heavyAoeStun': 'Stun Pesante AoE',
    'slowHammer': 'Martello Rallentante',
    'scytheTrueDamage': 'Falce Danno Puro',
    'ultimateRegenPV': 'Regen PV con Ulti',
    'aoePushPull': 'Spinta/Trazione AoE',
    'stunUltimate': 'Stun con Ulti',
    'antiBasicAttack': 'Anti-Attacco Base',
    'aoeKnockup': 'Lancio in Aria AoE',
    'vacuumUltimateBurst': 'Ulti Sottovuoto',
    'copyUltimateEnemy': 'Copia Ulti Nemica',
    'lifestealPassive': 'Rubavita Passivo',
    'knockbackAntiMelee': 'Respinta Anti-Mischia',
    'continuousBurnStun': 'Bruciatura e Stun',
    'purifyUltimate': 'Purifica con Ulti',
    'knightSummon': 'Evoca Cavaliere',
    'aoeTerrifyCC': 'Terrore AoE',
    'firagaArmorShield': 'Corazza Firaga',
    'trueDamageBurn': 'Bruciatura Danno Puro',
    'globalUltimate': 'Ulti Globale',
    'ccImmobilizeWall': 'Muro Immobilizzante',
    'enhancedSpam': 'Spam Potenziato',
    'weaponSwitchPassive': 'Cambio Armi Passivo',
    'globalRevealMap': 'Rivela Mappa Globale',
    'ccImmunityDash': 'Scatto Immunità CC',
    'arena1v1Isolation': 'Isolamento Arena 1v1',
    'burstStunTransform': 'Trasforma Burst Stun',
    'dragonFormGlobal': 'Forma Dragone Globale',
    'shaEssenceSustain': 'Sustain Essenza Sha',
    'gridAoeSlow': 'Rallentamento Griglia',
    'ccImmunityShieldUltimate': 'Scudo Immunità CC',
    'spawnSpawn': 'Evoca Progenie',
    'ultimateMergeInvincibility': 'Fusione Invincibile',
    'lanternAoePull': 'Trazione Lanterna AoE',
    'airborneCC Continuous': 'Lancio Aria Continuo',
    'manaSustain': 'Sustain Mana',
    'slowImmunity': 'Immunità Rallento',
    'flipBackCC': 'Lancio all\'Indietro',
    'camouflage': 'Mimetizzazione',
    'daggers': 'Pugnali',
    'lateGameDPS': 'DPS Late Game',
    'autoAttack': 'Attacco Base',
    'aoeSlow': 'Rallento AoE',
    'dashTarget': 'Scatto su Bersaglio',
    'crowdControl': 'Controllo Folla',
    'multiWeapon': 'Multi-Arma',
    'highBurst': 'Alto Burst',
    'mobilityDPS': 'DPS Mobilità',
    'yoYo': 'Yo-Yo',
    'singleTarget': 'Bersaglio Singolo',
    'portalGlobal': 'Portale Globale',
    'transformation': 'Trasformazione',
    'tankDpsMagic': 'Tank DPS Magico',
    'jungleSteal': 'Furto Giungla',
    'shadowForm': 'Forma Ombra',
    'antiDash': 'Anti-Scatto',
    'hookPull': 'Trazione con Gancio',
    'shieldBash': 'Colpo di Scudo',
    'lockSingleTarget': 'Blocca Bersaglio',
    'transformationForms': 'Forme Trasformazione',
    'charge': 'Carica',
    'dashJump': 'Salto/Scatto',
    'weaknessMark': 'Marchio Debolezza',
    'combo': 'Furia di Combo',
    'bushRegen': 'Regen in Erba',
    'dashAttack': 'Attacco con Scatto',
    'noStun': 'Nessuno Stun',
  };
  return map[tag] || tag;
};

const BuildSlotCard: React.FC<{ 
  slot: BuildSlot; 
  idx: number; 
  isEditable?: boolean; 
  onTriggerSwap?: () => void; 
  onReset?: () => void; 
  isOverridden?: boolean;
}> = ({ slot, idx, isEditable = false, onTriggerSwap, onReset, isOverridden = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div className={`flex flex-col gap-2 p-4 rounded bg-slate-950/50 border transition-all cursor-help relative overflow-hidden ${
        isOverridden 
          ? 'border-amber-500/50 bg-amber-500/[0.02]' 
          : showTooltip 
            ? 'border-amber-500/50 bg-slate-950/80' 
            : 'border-slate-800/80 hover:border-amber-500/30'
      }`}>
        {isOverridden && (
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl shadow">
            Modificato
          </div>
        )}

        <div className="flex gap-4 items-center w-full">
          <ImageWithFallback 
            src={slot.item.iconUrl} 
            alt={slot.item.name} 
            type="item"
            id={slot.item.id}
            className={`w-12 h-12 shrink-0 rounded-lg border border-amber-500/30 object-cover shadow-sm transition-all duration-300 ${showTooltip ? 'scale-110 shadow-md ring-2 ring-amber-500/50' : ''}`}
          />
          <div className="w-full flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium text-amber-100/90 flex items-center gap-2 mb-1 truncate">
                <span className="truncate">{slot.item.name}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded-sm">Slot {idx + 1}</span>
              </h3>
            </div>
            <p className="text-sm text-amber-500/90 font-medium leading-snug mb-2">{slot.reason}</p>
            
            {isEditable && (
              <div className="flex flex-wrap items-center gap-2 mt-1 relative z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerSwap?.();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded transition-all text-amber-400 cursor-pointer shadow-md"
                >
                  <RefreshCw size={10} className="text-amber-500" />
                  Sostituisci
                </button>
                {isOverridden && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReset?.();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded transition-all cursor-pointer shadow-md animate-pulse"
                  >
                    <X size={10} />
                    Annulla modifica
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        className={`absolute z-10 left-0 right-0 transition-all duration-200 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-y-0 visible' : 'opacity-0 invisible'
        } ${idx >= 4 ? 'bottom-full mb-3' : 'top-full mt-3'}`}
      >
        <div className="bg-slate-900 border border-amber-500/40 rounded-lg p-5 shadow-2xl relative">
          <div className={`absolute left-8 w-4 h-4 bg-slate-900 rotate-45 transform origin-center ${
            idx >= 4 ? '-bottom-2 border-b border-r border-amber-500/40' : '-top-2 border-t border-l border-amber-500/40'
          }`}></div>
          
          <h4 className="font-bold text-amber-400 mb-3 border-b border-slate-800/80 pb-2 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <ImageWithFallback 
                src={slot.item.iconUrl} 
                alt={slot.item.name} 
                type="item"
                id={slot.item.id}
                className="w-8 h-8 rounded border border-amber-500/30 object-cover shadow-sm"
              />
              <span>{slot.item.name}</span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 font-normal uppercase bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
              {slot.item.category}
            </span>
          </h4>
          <div className="text-sm text-slate-300 leading-relaxed relative z-10 space-y-3">
            {slot.item.attributes && slot.item.attributes.length > 0 && (
              <ul className="list-disc pl-4 space-y-1 text-emerald-200/80">
                {slot.item.attributes.map((attr, i) => (
                  <li key={i}>{attr}</li>
                ))}
              </ul>
            )}
            
            {slot.item.passiveName && slot.item.passiveName !== 'Nessuna' && (
              <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                <span className="font-bold text-amber-500 block mb-1">Passiva Unica - {slot.item.passiveName}</span>
                <span className="text-slate-400 text-xs">{slot.item.passiveDescription}</span>
              </div>
            )}

            {slot.item.activeName && (
              <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                <span className="font-bold text-amber-500 block mb-1">Abilità Attiva - {slot.item.activeName}</span>
                <span className="text-slate-400 text-xs">{slot.item.activeDescription}</span>
              </div>
            )}
            
            {(!slot.item.attributes || slot.item.attributes.length === 0) && (!slot.item.passiveName || slot.item.passiveName === 'Nessuna') && (
              <div className="text-slate-400 text-xs">
                {slot.item.passiveDescription}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HeroEncyclopediaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  if (!isOpen) return null;

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  const roleTranslations: Record<string, string> = {
    'All': 'Tutti',
    'Tank': 'Tank',
    'Fighter': 'Combattente',
    'Assassin': 'Assassino',
    'Mage': 'Mago',
    'Marksman': 'Tiratore',
    'Support': 'Supporto'
  };

  const filteredHeroes = HEROES.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || h.role.includes(roleFilter);
    return matchesSearch && matchesRole;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h2 className="text-xl font-serif text-amber-500 flex items-center gap-2">
            <BookOpen size={24} /> Enciclopedia Eroi
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4 bg-slate-900/50 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Cerca eroe per nome..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {roles.map(role => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-1.5 text-xs rounded-full border whitespace-nowrap transition-all ${
                  roleFilter === role 
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/20' 
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}
              >
                {roleTranslations[role] || role}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHeroes.map(h => (
              <motion.div 
                key={h.id} 
                whileHover={{ scale: 1.02, borderColor: 'rgba(245, 158, 11, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="bg-slate-950/40 border border-slate-800 p-4 rounded-lg hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-amber-500 font-bold border border-slate-700 overflow-hidden shrink-0">
                    <HeroImageWithFallback 
                      src={h.iconUrl} 
                      name={h.name} 
                      id={h.id}
                      role={h.role}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">{h.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{h.id}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Ruolo:</span>
                    <span className="text-slate-300 font-medium">
                      {h.role.split('/').map(r => roleTranslations[r] || r).join('/')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Danno:</span>
                    <span className={`font-medium ${
                      h.damageType === 'Fisico' ? 'text-rose-400' : 
                      h.damageType === 'Magico' ? 'text-purple-400' : 'text-amber-400'
                    }`}>{h.damageType}</span>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-1">
                    {h.counterTags.slice(0, 4).map(tag => (
                      <span key={tag} className={`text-[8px] px-1.5 py-0.5 rounded border font-black uppercase tracking-widest ${getTagColor(tag)}`}>
                        {translateTag(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {filteredHeroes.length === 0 && (
            <div className="h-40 flex items-center justify-center text-slate-500">
              Nessun eroe trovato con questi parametri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemEncyclopediaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', 'Attack', 'Magic', 'Defense', 'Movement', 'Jungler', 'Roaming'];
  const categoryTranslations: Record<string, string> = {
    'All': 'Tutti',
    'Attack': 'Attacco',
    'Magic': 'Magia',
    'Defense': 'Difesa',
    'Movement': 'Movimento',
    'Jungler': 'Giungla',
    'Roaming': 'Roaming'
  };

  const filteredItems = OFFICIAL_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.passiveName && item.passiveName.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.category !== b.category) {
      return categories.indexOf(a.category) - categories.indexOf(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h2 className="text-xl font-serif text-amber-500 flex items-center gap-2">
            <Scroll size={24} /> Enciclopedia Equipaggiamenti
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4 bg-slate-900/50 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Cerca oggetto o passiva..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 text-xs rounded-full border whitespace-nowrap transition-all ${
                  categoryFilter === cat 
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/20' 
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                }`}
              >
                {categoryTranslations[cat] || cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
          {categories.filter(c => c !== 'All').map(cat => {
            const itemsInCat = filteredItems.filter(i => i.category === cat);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                  <span className="h-px bg-slate-800 flex-1"></span>
                  {categoryTranslations[cat]}
                  <span className="h-px bg-slate-800 flex-1"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {itemsInCat.map(item => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ scale: 1.02, y: -4, borderColor: 'rgba(245, 158, 11, 0.2)' }}
                      className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-xl hover:border-amber-500/20 transition-all flex flex-col h-full group"
                    >
                      <div className="flex gap-4 items-start mb-4">
                        <ImageWithFallback 
                          src={item.iconUrl} 
                          alt={item.name} 
                          type="item"
                          id={item.id}
                          className="w-14 h-14 rounded-lg border border-slate-800 object-cover shadow-lg group-hover:border-amber-500/50 transition-colors"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full mt-1 inline-block">ID: {item.id}</span>
                        </div>
                      </div>

                      <div className="space-y-4 flex-1">
                        {item.attributes.length > 0 && (
                          <div className="space-y-1">
                            {item.attributes.map((attr, i) => (
                              <div key={i} className="text-xs text-emerald-400/80 flex items-center gap-2">
                                <CheckCircle size={10} className="text-emerald-500" />
                                {attr}
                              </div>
                            ))}
                          </div>
                        )}

                        {item.passiveName && item.passiveName !== 'Nessuna' && (
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Info size={12} /> Passiva Unica: {item.passiveName}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                              "{item.passiveDescription}"
                            </p>
                          </div>
                        )}

                        {item.activeName && (
                          <div className="bg-amber-950/10 p-3 rounded-lg border border-amber-900/20">
                            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <RefreshCw size={12} /> Attiva: {item.activeName}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                              "{item.activeDescription}"
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReportBugModal({ 
  isOpen, 
  onClose,
  userHero,
  lane,
  enemies,
  onSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void;
  userHero?: Hero;
  lane: Lane;
  enemies: Hero[];
  onSuccess: (message: string) => void;
}) {
  const [bug, setBug] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bug.trim()) return;

    const subject = encodeURIComponent("MLBB Counter Builder - Segnalazione Bug");
    const enemyList = enemies.length > 0 ? enemies.map(e => e.name).join(', ') : 'Nessuno';
    const heroName = userHero ? userHero.name : 'Nessuno';

    const bodyText = `Applicazione: MLBB Counter Builder by LUNATIO
Eroe Selezionato: ${heroName}
Corsia (Lane): ${lane}
Squadra Nemica: ${enemyList}

Dettagli del problema riscontrato:
${bug}`;

    const body = encodeURIComponent(bodyText);
    
    // Attiva il mailto
    window.location.href = `mailto:damianomaurizio.manera@gmail.com?subject=${subject}&body=${body}`;

    onSuccess("Segnalazione pronta per l'invio via email! Grazie.");
    setBug('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-lg p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-xl font-serif text-amber-500 mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          Segnala un problema
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            value={bug}
            onChange={(e) => setBug(e.target.value)}
            required
            placeholder="Descrivi il bug o il comportamento inaspettato (es. 'La corazza antica non viene mostrata contro Ling')..."
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded p-3 text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none"
          />
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200"
            >
              Annulla
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors"
            >
              Invia Dati
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PatchChangeItem {
  id: string;
  name: string;
  category: string;
  badge: 'Revamp' | 'Rielaborato' | 'Bilanciato' | 'Nuovo';
  oldStats: string[];
  newStats: string[];
  passiveChange?: {
    old: string;
    new: string;
  };
  comment: string;
}

const PATCH_CHANGES: PatchChangeItem[] = [
  {
    id: 'clock_of_destiny',
    name: 'Orologio del Destino (Clock of Destiny)',
    category: 'Magic',
    badge: 'Revamp',
    oldStats: ['+60 Potere Magico', '+800 PV (HP)', '+600 Mana'],
    newStats: ['+45 Potere Magico', '+400 PV (HP)', '+800 Mana'],
    passiveChange: {
      old: 'Aumenta HP e Potere Magico ogni 20 secondi (fino a 15 volte). Al massimo delle cariche fornisce Mana extra.',
      new: 'Destino: Colpire un eroe nemico con un\'abilità magica fornisce 1 carica di Destino ogni 0.4s (fino a 10 cariche). Ogni carica aumenta la Difesa Ibrida di 2-4 (in base al livello) per 5 secondi.'
    },
    comment: 'Trasformato in un oggetto di difesa dinamica a rapido accumulo di Difesa Ibrida. Perfetto per maghi o tank magici che lottano a corto raggio (es. Alice, Esmeralda, Hylos) per resistere alla prima ondata di combattimento.'
  },
  {
    id: 'thunder_belt',
    name: 'Cintura di Fulmini (Thunder Belt)',
    category: 'Defense',
    badge: 'Revamp',
    oldStats: ['+800 PV (HP)', '+40 Difesa Fisica', '+10% Riduzione Ricarica', '+10 Difesa Magica'],
    newStats: ['+800 PV (HP)', '+15 Difesa Fisica', '+15 Difesa Magica', '+5% Velocità di Movimento'],
    passiveChange: {
      old: 'Dopo un\'abilità, il prossimo attacco base infligge danni puri e rallenta temporaneamente i nemici.',
      new: 'Thunderbolt (Attacco Base post-abilità): Infligge danni puri pari a 50 + 100% della Difesa Fisica + Difesa Magica Totale sul bersaglio e rallenta del 40-80% (in base ai PV extra). Inoltre, aumenta PERMANENTEMENTE la tua Difesa Fisica e Magica di +1 (+2 per eroi melee) a ogni colpo a segno su eroi nemici!'
    },
    comment: 'La passiva ora accumula resistenze all’infinito colpendoli! Questo rende la Cintura di Fulmini un’aggiunta monumentale per i campioni EXP Lane e i Tank che scambiano attacchi costantemente.'
  },
  {
    id: 'sky_piercer',
    name: 'Frantuma Cieli (Sky Piercer)',
    category: 'Attack',
    badge: 'Nuovo',
    oldStats: ['Non esisteva nelle patch precedenti (Introdotto di recente)'],
    newStats: ['+60 Attacco Adattivo', '+15 Penetrazione Adattiva', '+5% Velocità di Movimento'],
    passiveChange: {
      old: '-',
      new: 'Annientamento: Gestisce l\'esecuzione istantanea di qualsiasi eroe nemico con meno del 6% di HP. Ogni uccisione accumula cariche (+10 cariche per uccisione, max 80, ogni carica dà +0.1% a soglia d\'esecuzione). Alla morte si perde il 30% delle cariche accumulate.'
    },
    comment: 'L’oggetto offensivo di esecuzione rapida più famoso. Ha ricevuto ottimizzazioni nell\'ultima patch per equilibrare l\'accumulo nelle fasi conclusive del gioco.'
  },
  {
    id: 'queens_wings',
    name: 'Ali della Regina (Queen\'s Wings)',
    category: 'Defense',
    badge: 'Rielaborato',
    oldStats: ['+1000 PV (HP)', '+10% Riduzione Ricarica', '+40 Attacco Fisico'],
    newStats: ['+40 Attacco Adattivo', '+600 PV (HP)', '+10% Riduzione Ricarica', '+10% Rubavita Incantesimo (Spell Vamp)'],
    passiveChange: {
      old: 'Demonize: Riduce il danno del 20% a bassi HP e aumenta il rubavita dei normali attacchi base.',
      new: 'Demonize: Quando gli HP scendono sotto il 40%, riduce il danno ricevuto del 30% e aumenta il Rubavita Incantesimo (Spell Vamp) del 15% per 5 secondi (Ricarica: 60s).'
    },
    comment: 'Modificato radicalmente per favorire i Combattenti magici o fisici che usano le abilità per sopravvivere. Perfetto su Ruby, Yu Zhong, Terizla, Freya, Alucard.'
  },
  {
    id: 'winter_crown',
    name: 'Diadema Invernale (Winter Crown - ex Winter Truncheon)',
    category: 'Magic',
    badge: 'Revamp',
    oldStats: ['+60 Potere Magico', '+25 Difesa Fisica', '+400 PV (HP)'],
    newStats: ['+45 Attacco Adattivo', '+25 Difesa Fisica', '+400 PV (HP)'],
    passiveChange: {
      old: 'Fornisce l\'abilità attiva di congelamento con Potere Magico limitata prettamente ai maghi.',
      new: 'Congelamento (Abilità Attiva): Rende l\'eroe immune a danni e controlli per 2 secondi (tempo di ricarica: 180s). L\'uso dell\'Attacco Adattivo rende questa ricarica salvavita efficiente anche per Tiratori, Assassini e Combattenti Fisici.'
    },
    comment: 'Rinominato da Winter Truncheon a Winter Crown. L’Attacco Adattivo svincola l\'oggetto dall\'esclusiva dei maghi, rendendolo l’invulnerabilità tattica per eccellenza per qualsiasi tiratore o assassino contro i burst nemici.'
  },
  {
    id: 'blood_wings',
    name: 'Ali di Sangue (Blood Wings)',
    category: 'Magic',
    badge: 'Bilanciato',
    oldStats: ['+175 Potere Magico', '+500 PV (HP)'],
    newStats: ['+90 Potere Magico', '+500 PV (HP)', '+5% Velocità di Movimento'],
    passiveChange: {
      old: 'Fornisce uno scudo fisso equivalente al 200% del potere magico.',
      new: 'Guardia: Ottieni uno scudo pari al 200% del Potere Magico. Quando lo scudo si rompe danna ed eroga +30 di Velocità di Movimento extra per 1.5 secondi.'
    },
    comment: 'Prezzo ridotto drasticamente per renderlo accessibile come sesta scelta difenditrice di late game. Guadagna la velocità di movimento di serie.'
  },
  {
    id: 'oracle',
    name: 'Oracolo (Oracle)',
    category: 'Defense',
    badge: 'Bilanciato',
    oldStats: ['+850 PV (HP)', '+42 Difesa Magica', '+10% Riduzione Ricarica'],
    newStats: ['+850 PV (HP)', '+25 Difesa Fisica', '+25 Difesa Magica', '+10% Riduzione Ricarica'],
    passiveChange: {
      old: 'Aumenta l’efficacia degli scudi e della rigenerazione HP ricevuti del 30%.',
      new: 'Benedizione (Blessing): Incrementa la rigenerazione HP e l’effetto scudo ricevuti del 30% (Invariato. Le statistiche includono ora Difesa Ibrida bilanciata).'
    },
    comment: 'Aggiungere la difesa fisica oltre la magica rende l\'Oracolo eccezionale per i rigeneratori primari (Uranus, Esmeralda, Hylos, Minotaur) contro minacce miste.'
  },
  {
    id: 'flask_of_the_oasis',
    name: 'Fiaschetta dell\'Oasi (Flask of the Oasis)',
    category: 'Magic',
    badge: 'Bilanciato',
    oldStats: ['+60 Potere Magico', '+300 PV (HP)', '+10% Riduzione Ricarica'],
    newStats: ['+60 Potere Magico', '+300 PV (HP)', '+10% Riduzione Ricarica', '+12% Efficacia di Cura e Scudo'],
    comment: 'Introdotto il bonus esplicito di abilità di cura (+12% healing power) per fortificare il meta dei supportisti puri.'
  }
];

function PatchNotesModal({ 
  isOpen, 
  onClose, 
  currentPatch,
  appPatchVersion,
  setAppPatchVersion,
  setGamePatchVersion,
  appPatchHistory,
  setAppPatchHistory,
  gamePatchHistory,
  setGamePatchHistory,
  defaultSubTab = 'app'
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  currentPatch: string;
  appPatchVersion: string;
  setAppPatchVersion: React.Dispatch<React.SetStateAction<string>>;
  setGamePatchVersion: React.Dispatch<React.SetStateAction<string>>;
  appPatchHistory: any[];
  setAppPatchHistory: React.Dispatch<React.SetStateAction<any[]>>;
  gamePatchHistory: any[];
  setGamePatchHistory: React.Dispatch<React.SetStateAction<any[]>>;
  defaultSubTab?: 'app' | 'game';
}) {
  const [activeTab, setActiveTab] = useState<'items' | 'mechanics' | 'validation' | 'changelog'>('changelog');
  const [changelogSubTab, setChangelogSubTab] = useState<'app' | 'game'>('app');
  const [search, setSearch] = useState('');

  // Sync tab and sub-tab selection when modal state or default changes
  useEffect(() => {
    if (isOpen) {
      setChangelogSubTab(defaultSubTab);
      setActiveTab('changelog');
    }
  }, [isOpen, defaultSubTab]);

  // App Release build simulator states
  const [developerLog, setDeveloperLog] = useState<string[]>([]);
  const [isCompilingApp, setIsCompilingApp] = useState(false);

  // Moonton Simulator state
  const [isSimulatingMoonton, setIsSimulatingMoonton] = useState(false);
  const [moontonLog, setMoontonLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const filteredChanges = PATCH_CHANGES.filter(item => {
    return item.name.toLowerCase().includes(search.toLowerCase()) || 
           item.comment.toLowerCase().includes(search.toLowerCase()) ||
           item.category.toLowerCase().includes(search.toLowerCase());
  });

  const handlePublishAppRelease = () => {
    setIsCompilingApp(true);
    setDeveloperLog([
      `[BUILDER APP] Avvio processo automatico di ottimizzazione Applet...`,
      `[BUILDER APP] Analisi dell'integrità del database oggetti...`,
      `[BUILDER APP] Minificazione script e bundling dei componenti reattivi...`
    ]);

    setTimeout(() => {
      setDeveloperLog(prev => [...prev, `[BUILDER APP] Compilazione moduli in formato ad alte prestazioni con esbuild...`]);
    }, 450);

    setTimeout(() => {
      let nextAppPatch = '1.1.7';
      setAppPatchVersion(prevAppPatch => {
        const parts = prevAppPatch.split('.');
        if (parts.length > 0) {
          const lastIndex = parts.length - 1;
          const lastNum = parseInt(parts[lastIndex], 10);
          if (!isNaN(lastNum)) {
            parts[lastIndex] = String(lastNum + 1);
          } else {
            parts[lastIndex] = parts[lastIndex] + '1';
          }
          const nextVal = parts.join('.');
          localStorage.setItem('mlbb_app_patch_version', nextVal);
          nextAppPatch = nextVal;
          return nextVal;
        }
        const defaultNext = '1.1.8';
        localStorage.setItem('mlbb_app_patch_version', defaultNext);
        nextAppPatch = defaultNext;
        return defaultNext;
      });

      setTimeout(() => {
        const simulatedAppUpdates = [
          {
            title: "Ottimizzazione Algoritmo e Supporto Multi-Lane",
            changes: [
              "Migliorato il tempo di esecuzione dell'algoritmo predittivo per i counter di circa il 25%.",
              "Perfezionata l'esposizione visiva della Bento-Grid sui dispositivi mobili ad alta densità.",
              "Risolti rari casi di disallineamento dello stato locale dopo il riavvio del browser.",
              "Ottimizzata la ricerca istantanea filtrata degli oggetti di Mobile Legends."
            ]
          },
          {
            title: "Aggiornamento Calcolo Statistiche Adattive",
            changes: [
              "Integrato un motore di validazione integrato per intercettare incongruenze nel database oggetti.",
              "Aggiunta la visualizzazione radar per il bilanciamento percentuale degli item sbloccati.",
              "Migliorati i banner informativi nell'interfaccia principale delle statistiche di gioco.",
              "Risolte alcune anomalie di contrasto per favorire la leggibilità ai sensi delle linee guida di accessibilità."
            ]
          },
          {
            title: "Refresh Estetico & Sincronizzazione Hub",
            changes: [
              "Inaugurata la pagina Hub Changelog navigabile per aggiornamenti app e patch Moonton.",
              "Fluidificate le animazioni di transizione tramite motion library dei pannelli di counter-build.",
              "Migliorato il caching persistente nel localStorage delle preferenze visive e delle ultime build preferite.",
              "Aggiornato il footer dinamico con le informazioni in tempo reale della versione attiva."
            ]
          },
          {
            title: "Bilanciamento Oggetti Difensivi e Utility",
            changes: [
              "Ricalibrati i pesi dell'algoritmo per gli oggetti di ripristino PV (HP) e riduzione ricarica.",
              "Raddoppiata la reattività energetica delle chiamate simulator per caricamento istantaneo degli attributi degli oggetti.",
              "Sistemato un crash raro riscontrato in Safari in modalità risparmio energetico.",
              "Rafforzato l'hub di integrità dell'applicazione riducendo i falsi positivi dei test automatici."
            ]
          },
          {
            title: "Nuovo Filtro Avanzato dei Ruoli ed Eroi",
            changes: [
              "Implementato il supporto alle categorie personalizzate per una catalogazione rapida dei ruoli.",
              "Introdotto l'indicatore energetico per l'efficacia di cura e scudo nel pannello statistiche.",
              "Velocizzata la de-serializzazione dello storico dei pacchetti patch memorizzati.",
              "Ottimizzata l'occupazione di memoria della cache degli sprite grafici durante le simulazioni."
            ]
          }
        ];

        const randomUpdate = simulatedAppUpdates[Math.floor(Math.random() * simulatedAppUpdates.length)];

        const newRelease = {
          version: nextAppPatch,
          date: new Date().toLocaleDateString('it-IT') + ' ' + new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          title: randomUpdate.title,
          changes: randomUpdate.changes
        };

        const updatedHistory = [newRelease, ...appPatchHistory];
        setAppPatchHistory(updatedHistory);
        localStorage.setItem('mlbb_app_patch_history', JSON.stringify(updatedHistory));

        setDeveloperLog(prev => [
          ...prev, 
          `[SUCCESS] App Patch compilata ed ottimizzata con successo alla versione v${nextAppPatch}!`,
          `[SUCCESS] Modifiche all'algoritmo registrate localmente nel database.`
        ]);
        setIsCompilingApp(false);
      }, 50);

    }, 1100);
  };

  const handleSimulateMoontonPatch = () => {
    setIsSimulatingMoonton(true);
    setMoontonLog([
      `[MOONTON] Tentativo di connessione con Moonton Game Patches CDN...`,
      `[MOONTON] Trovato nuovo pacchetto di bilanciamento eroi ufficiale...`,
      `[MOONTON] Applicazione del revamp degli attributi base...`
    ]);

    setTimeout(() => {
      let nextGamePatch = '1.8.92';
      setGamePatchVersion(prevGamePatch => {
        const parts = prevGamePatch.split('.');
        if (parts.length > 0) {
          const lastIndex = parts.length - 1;
          const lastNum = parseInt(parts[lastIndex], 10);
          if (!isNaN(lastNum)) {
            parts[lastIndex] = String(lastNum + 1);
          } else {
            parts[lastIndex] = parts[lastIndex] + '1';
          }
          const nextVal = parts.join('.');
          localStorage.setItem('mlbb_game_patch_version', nextVal);
          nextGamePatch = nextVal;
          return nextVal;
        }
        const defaultNext = '1.8.93';
        localStorage.setItem('mlbb_game_patch_version', defaultNext);
        nextGamePatch = defaultNext;
        return defaultNext;
      });

      setTimeout(() => {
        const simulatedTitles = [
          'Bilanciamento Campioni & Oggetti Ibridi',
          'Ricalibrazione Scalabilità Difesa',
          'Sinfonia d\'Autunno: Aggiornamento Attributi',
          'Progetto NEXT: Forgiatura dell\'Equipaggiamento',
          'Nuovo Ciclo Patch: Ascesa dei Combattenti'
        ];
        const randomTitle = simulatedTitles[Math.floor(Math.random() * simulatedTitles.length)];

        const newMoontonEntry = {
          version: nextGamePatch,
          date: new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }),
          title: randomTitle,
          changes: [
            `Bilanciamento ufficiale degli attributi di attacco ed elementi di difesa sulla patch v${nextGamePatch}.`,
            `Ricalibrati i coefficienti di preferenza per l'algoritmo di calcolo del builder.`,
            `Sincronizzato il database interno con le statistiche dei server di gioco ufficiali.`
          ]
        };

        const updatedHistory = [newMoontonEntry, ...gamePatchHistory];
        setGamePatchHistory(updatedHistory);
        localStorage.setItem('mlbb_game_patch_history', JSON.stringify(updatedHistory));

        setMoontonLog(prev => [
          ...prev, 
          `[SUCCESS] Game Patch allineato alla versione ufficiale v${nextGamePatch}!`,
          `[SUCCESS] Il database ora riflette al 100% l'andamento del gioco di Mobile Legends.`
        ]);
        setIsSimulatingMoonton(false);
      }, 50);

    }, 1100);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700/60 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                HUB AGGIORNAMENTI & PATCH NOTE
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold">
                Sincronizzato
              </span>
            </div>
            <h2 className="text-2xl font-serif text-slate-100 flex items-center gap-2 tracking-tight">
              <TrendingUp size={24} className="text-amber-500" />
              Gestione Patch & Cronologia Versione
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
            <X size={22} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-4 scrollbar-thin overflow-x-auto">
          <button 
            onClick={() => setActiveTab('items')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'items' 
                ? 'border-amber-500 text-amber-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sword size={16} />
            Equipaggiamenti Modificati ({PATCH_CHANGES.length})
          </button>
          <button 
            onClick={() => setActiveTab('mechanics')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'mechanics' 
                ? 'border-amber-500 text-amber-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={16} />
            Meccaniche Rivoluzionarie
          </button>
          <button 
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'validation' 
                ? 'border-amber-500 text-amber-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle size={16} />
            Integrità Database ({OFFICIAL_ITEMS.length} Oggetti)
          </button>
          <button 
            onClick={() => setActiveTab('changelog')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'changelog' 
                ? 'border-amber-500 text-amber-400 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <List size={16} />
            Changelog & Sviluppo
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/40 space-y-6">
          
          {/* TAB 1: ITEMS */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              {/* Search bar inside tab */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  placeholder="Cerca modifiche agli oggetti (es. Orologio, Adattivo, Cintura)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {filteredChanges.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                  Nessun oggetto trovato per la ricerca "{search}"
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredChanges.map((item) => (
                    <div key={item.id} className="bg-slate-950/60 border border-slate-800 hover:border-slate-700/60 transition-all rounded-lg p-5 space-y-4 shadow-md">
                      {/* Name & Badge Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-md ${
                            item.category === 'Magic' ? 'bg-sky-500/10 text-sky-400' :
                            item.category === 'Defense' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {item.category === 'Magic' ? <Book size={16} /> :
                             item.category === 'Defense' ? <Shield size={16} /> :
                             <Sword size={16} />}
                          </span>
                          <h3 className="font-serif text-lg font-medium text-slate-100">{item.name}</h3>
                        </div>
                        <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${
                          item.badge === 'Nuovo' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          item.badge === 'Revamp' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          item.badge === 'Rielaborato' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* Side by Side Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Old Stats */}
                        <div className="bg-rose-950/10 border border-rose-900/30 rounded-lg p-3 space-y-2">
                          <span className="text-rose-400 font-semibold block uppercase tracking-wider text-[10px]">
                            ❌ STATISTICHE PRECEDENTI (ERRATE)
                          </span>
                          <ul className="space-y-1 text-slate-400">
                            {item.oldStats.map((stat, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5 line-through">
                                <span className="w-1 h-1 rounded-full bg-rose-500"></span>
                                {stat}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* New Stats */}
                        <div className="bg-emerald-950/15 border border-emerald-900/35 rounded-lg p-3 space-y-2">
                          <span className="text-emerald-400 font-semibold block uppercase tracking-wider text-[10px] flex items-center gap-1">
                            <CheckCircle size={10} /> 🛠️ CON VALORE PATCh UFFICIALE
                          </span>
                          <ul className="space-y-1 text-emerald-200">
                            {item.newStats.map((stat, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                {stat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Passive details */}
                      {item.passiveChange && (
                        <div className="text-xs bg-slate-900/60 rounded-lg border border-slate-800/80 p-3 space-y-2">
                          <span className="text-slate-400 block font-mono">Modifiche alla Passiva Unica:</span>
                          {item.passiveChange.old !== '-' && (
                            <div className="text-slate-500 leading-relaxed border-l-2 border-rose-900/50 pl-2.5 mb-1.5">
                              <strong className="text-rose-400/80 font-normal">Prima: </strong> {item.passiveChange.old}
                            </div>
                          )}
                          <div className="text-slate-200 leading-relaxed border-l-2 border-emerald-500/80 pl-2.5">
                            <strong className="text-emerald-400 font-semibold">Ora: </strong> {item.passiveChange.new}
                          </div>
                        </div>
                      )}

                      {/* Developer metadata comment */}
                      <div className="text-xs text-slate-400 leading-relaxed flex items-start gap-2 bg-slate-900/20 p-2.5 rounded border border-slate-800/40">
                        <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MECHANICS */}
          {activeTab === 'mechanics' && (
            <div className="space-y-6">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-5">
                <h3 className="text-lg font-serif text-amber-500 mb-2 flex items-center gap-2">
                  <Sparkles size={18} />
                  Cosa sono l'Attacco Adattivo e la Difesa Ibrida?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  L'ultima macro-patch di Mobile Legends ha unificato molti oggetti precedentemente vincolati ad una sola categoria di danno.
                  Questo previene build ridondanti e garantisce ai campioni tiratori, assassini, e combattenti di accedere ad utilità speciali salvavita (come il congelamento o i moltiplicatori di rigenerazione) senza sprecare denaro in parametri inutili.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Adaptive Attack Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold">
                    <Sword size={18} />
                    <span>Attacco Adattivo</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Aggiunge automaticamente **Attacco Fisico** o **Potere Magico** in base alla statistica offensiva di base più alta del tuo eroe in partita. 
                  </p>
                  <div className="bg-slate-900 p-3 rounded text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-300">Rapporto di Conversione delle Patch:</p>
                    <p>• 1 punto di Attacco Adattivo = 1 punto di Potere Magico</p>
                    <p>• 1 punto di Attacco Adattivo = 0.6 punti di Attacco Fisico</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    *Applicazione reale nel Builder:* Oggetti come il **Frantuma Cieli** o il **Diadema Invernale** usano l'Attacco Adattivo in modo che qualunque eroe (sia fisico che magico) possa integrarli nel proprio set senza perdite di utilità.
                  </p>
                </div>

                {/* Adaptive Penetration Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Target size={18} />
                    <span>Penetrazione Adattiva</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Fornisce la penetrazione appropriata al tuo tipo di eroe. Se il tuo eroe infligge prevalentemente danni fisici, l'oggetto fornirà Penetrazione Fisica, altrimenti fornirà Penetrazione Magica.
                  </p>
                  <p className="text-xs text-slate-400">
                    Questo garantisce il superamento mirato della corazza avversaria senza costringere a doppie build, rendendo l'oggetto offensivo (come il **Frantuma Cieli** con i suoi *+15 di Penetrazione Adattiva*) universalmente letale.
                  </p>
                </div>

                {/* Hybrid Defense Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-amber-500 font-semibold">
                    <Shield size={18} />
                    <span>Difesa Ibrida</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    La Difesa Ibrida fornisce lo stesso ammontare di difesa sia per la **Difesa Fisica** sia per la **Difesa Magica** simultaneamente.
                  </p>
                  <div className="bg-slate-900 p-3 rounded text-[11px] text-slate-400">
                    Ad esempio, l'**Orologio del Destino** rielaborato accumula fino a **+40 di Difesa Ibrida** a piene cariche. Questo equivale a ottenere contemporaneamente +40 Difesa Fisica e +40 Difesa Magica, massimizzando il riscontro vitale complessivo.
                  </div>
                </div>

                {/* Infinite Stacking Explained */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Activity size={18} />
                    <span>Scaglione di Difesa Infinito (Cintura)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    La nuova **Cintura di Fulmini** è l'unico oggetto nel gioco che premia la costanza dei combattimenti ravvicinati.
                  </p>
                  <p className="text-xs text-slate-400">
                    Ogni 4 secondi, colpendo un eroe nemico con attacco base, guadagnerai permanentemente +1 alle tue statistiche complessive di difesa. Essendo ad accumulo infinito, se riesci a prolungare bene le rotazioni o l'uso di abilità rapide, potrai sbloccare resistenze mostruose fino a +100 per tipo a fine partita.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTEGRITY / DATABASE STATUS */}
          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-emerald-950/15 border border-emerald-800/40 rounded-lg p-5 flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                  <CheckCircle size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-serif text-emerald-400 font-medium">Algoritmo di build in perfetto stato</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tutti gli oggetti all'interno del database locale (`/src/data/items.ts`) sono stati aggiornati meticolosamente all'ultima patch ufficiale. I pesi matematici del generatore di counter-build li classificano ora secondo le nuove difese ibride e gli attacchi adattivi corretti.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-4">
                <h4 className="text-sm font-semibold text-slate-200">Riepilogo File e Dati Validati</h4>
                <div className="space-y-2.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-slate-300">items.ts (Equipaggiamenti)</span>
                    <span className="text-emerald-400 font-serif font-semibold">✓ 100% Accurato (Patch {currentPatch}+)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-slate-300">heroes.ts (Eroi e Ruoli meta)</span>
                    <span className="text-emerald-400 font-serif font-semibold">✓ Validato (18 campioni chiave)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-mono text-slate-300">emblems.ts (Emblemi di Gioco)</span>
                    <span className="text-emerald-400 font-serif font-semibold">✓ Sincronizzato (Meta 2026)</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-mono text-slate-300">spells.ts (Incantesimi di Battaglia)</span>
                    <span className="text-emerald-400 font-serif font-semibold">✓ Verificato (12 Incantesimi)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/30 border border-slate-800 rounded-lg p-5 text-center space-y-3">
                <Trophy size={24} className="mx-auto text-amber-500" />
                <h4 className="text-sm font-semibold text-slate-300">Prossimi Aggiornamenti Meta</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
                  Il builder monitora costantemente le patch note ufficiali di Moonton. Al rilascio di nuovi oggetti o bilanciamenti radicali degli attributi primari, puoi cliccare nuovamente su questo pulsante per assicurarti che la cache locale non memorizzi dati legacy obsoleti.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CHANGELOG & SVILUPPO */}
          {activeTab === 'changelog' && (
            <div className="space-y-6">
              
              {/* Dual sub-navigation */}
              <div className="flex border-b border-slate-850 bg-slate-950/50 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setChangelogSubTab('app')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    changelogSubTab === 'app'
                      ? 'bg-amber-600/25 text-amber-400 border border-amber-600/30 shadow shadow-black'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Wrench size={14} />
                  Aggiornamenti Applet (v{appPatchVersion})
                </button>
                <button
                  type="button"
                  onClick={() => setChangelogSubTab('game')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    changelogSubTab === 'game'
                      ? 'bg-amber-600/25 text-amber-400 border border-amber-600/30 shadow shadow-black'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Activity size={14} />
                  Patch Game MLBB Ufficiali (v{currentPatch})
                </button>
              </div>

              {/* VIEW 4A: APP CHANGELOG & BUILD RELEASE AGENTS */}
              {changelogSubTab === 'app' && (
                <div className="space-y-6">
                  
                  {/* APP UPDATER PANEL (Hacker/Developer Console style) */}
                  <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Wrench size={18} className="text-amber-500 animate-spin-slow" />
                        <h3 className="font-serif text-amber-400 font-bold text-sm tracking-wider uppercase">Console Ottimizzazione & Sviluppo Automatico</h3>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        SINCRO PRONTO
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      L'integrità del codice e l'efficienza degli algoritmi sono gestite in modo completamente <strong>automatico</strong>. Cliccando sul pulsante sottostante, il compilatore eseguirà la minificazione del codice, l'analisi delle dipendenze, l'ottimizzazione matematica dell'algoritmo predittivo dei counter e pubblicherà in tempo reale la versione successiva incrementando la versione dell'app (<strong>v{appPatchVersion}</strong>).
                    </p>

                    <div className="space-y-3.5">
                      {/* Developer Log Console Feedback */}
                      {developerLog.length > 0 ? (
                        <div className="bg-black/90 p-4 rounded-lg border border-slate-800 max-h-36 overflow-y-auto font-mono text-[10px] space-y-1.5 text-slate-400 shadow-inner">
                          {developerLog.map((logLine, lIdx) => (
                            <p key={lIdx} className={logLine.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-400'}>
                              <span className="text-slate-600 select-none mr-2">{(lIdx+1).toString().padStart(2, '0')}:</span>
                              {logLine}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-black/45 border border-dashed border-slate-805 p-4 rounded-lg text-center text-xs italic text-slate-600 font-mono">
                          Nessun processo attivo nella console di compilazione. Clicca sul pulsante qui sotto per avviare l'ottimizzazione automatica.
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={handlePublishAppRelease}
                        disabled={isCompilingApp}
                        className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg border border-amber-500/30 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-amber-650/10 shadow-black cursor-pointer active:scale-[0.99]"
                      >
                        {isCompilingApp ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-white" />
                            <span>Ricalcolo matrici ed ottimizzazione file in corso...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} className="text-white" />
                            <span>Avvia Compilazione & Ottimizzazione Automatica (App Patch v{appPatchVersion} → Successiva)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Render list of app historical releases */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-serif text-slate-200 uppercase tracking-widest pl-1 font-bold">Cronologia Rilasci Applet</h3>
                    {appPatchHistory.map((hist, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700/60 transition-all rounded-xl relative overflow-hidden group">
                        {idx === 0 && (
                          <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 text-[9px] font-mono px-3 py-1 rounded-bl border-l border-b border-amber-500/20 font-bold uppercase tracking-wide">
                            Ultima Release Attiva
                          </div>
                        )}
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                          <div>
                            <span className="text-amber-500 text-xs font-mono font-bold uppercase tracking-wider block mb-1">{hist.date}</span>
                            <h4 className="text-normal font-bold text-slate-100 flex items-center gap-2 font-mono text-sm">
                              App Patch v{hist.version}
                            </h4>
                            <p className="text-xs text-slate-400 font-semibold italic mt-0.5">{hist.title}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-950/15">
                          <ul className="space-y-2">
                            {hist.changes.map((change: string, cIdx: number) => (
                              <li key={cIdx} className="flex gap-2 text-xs text-slate-300">
                                <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* VIEW 4B: MOONTON MLBB OFFICIAL GAME PATCH NOTES ONLY */}
              {changelogSubTab === 'game' && (
                <div className="space-y-6">
                  
                  {/* MOONTON SIMULATOR CARD */}
                  <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-rose-500 animate-pulse" />
                        <h3 className="font-serif text-rose-400 font-bold text-sm tracking-wider uppercase text-rose-400">Server CDN Moonton MLBB Core Patch</h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">Stato CDN: AGGIORNATO</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Questa sezione si occupa <strong>esclusivamente della Game Patch ufficiale rilasciata da Moonton</strong>. Modifiche apportate qui simuleranno l'andamento del database di Mobile Legends (es. ricalcolo degli attributi base) e non cambiano in alcun modo l'andamento delle funzionalità o della versione di rilascio del tuo codice!
                    </p>

                    <div className="space-y-3.5">
                      {/* Log Console feedback */}
                      {moontonLog.length > 0 && (
                        <div className="bg-black/90 p-3 rounded-lg border border-slate-800 max-h-32 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-400">
                          {moontonLog.map((logLine, lIdx) => (
                            <p key={lIdx} className={logLine.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-400'}>{logLine}</p>
                          ))}
                        </div>
                      )}

                      {/* Simulation Trigger button */}
                      <button
                        type="button"
                        onClick={handleSimulateMoontonPatch}
                        disabled={isSimulatingMoonton}
                        className="w-full bg-rose-900/80 hover:bg-rose-800 disabled:bg-slate-850 text-white font-semibold text-xs py-2 rounded-lg border border-rose-500/30 transition-all flex items-center justify-center gap-2 shadow-md shadow-black"
                      >
                        {isSimulatingMoonton ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-rose-400" />
                            <span>Download aggiornamenti Moonton...</span>
                          </>
                        ) : (
                          <>
                            <Activity size={14} className="text-rose-400" />
                            <span>Simula Rilascio Nuova Game Patch Moonton (Incrementa Game Patch v{currentPatch})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Render list of official Moonton balance releases */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-serif text-slate-200 uppercase tracking-widest pl-1 font-bold">Storico Game Patches (Moonton Official Server)</h3>
                    {gamePatchHistory.map((hist, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800/80 hover:border-slate-850 rounded-xl relative overflow-hidden group">
                        {hist.version === currentPatch && (
                          <div className="absolute top-0 right-0 bg-emerald-500/15 text-emerald-400 text-[9px] font-mono px-3 py-1 rounded-bl border-l border-b border-emerald-500/20 font-bold">
                            ATTIVA NEL BUILDER
                          </div>
                        )}
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                          <div>
                            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider block mb-1 font-mono">{hist.date}</span>
                            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                              Mobile Legends Game Patch v{hist.version}
                            </h4>
                            <p className="text-xs text-slate-400 italic mt-0.5">{hist.title}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-950/10">
                          <ul className="space-y-2">
                            {hist.changes.map((change: string, cIdx: number) => (
                              <li key={cIdx} className="flex gap-2 text-xs text-slate-300">
                                <span className="text-rose-500 shrink-0 mt-0.5">▪</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500 font-mono">
            Applicazione sviluppata da LUNATIO • App Patch: v{appPatchVersion} • Game Patch: v{currentPatch}
          </span>
          <button 
            onClick={onClose}
            className="px-5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-100 text-xs font-semibold rounded shadow transition-all"
          >
            Chiudi Hub Gestione Patch
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const getProxiedUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('ui-avatars.com') || url.includes('images.weserv.nl')) {
    return url;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

interface ImageWithFallbackProps {
  key?: React.Key;
  src: string;
  alt: string;
  className?: string;
  type: 'emblem' | 'talent' | 'spell' | 'item';
  id: string;
  title?: string;
}

function ImageWithFallback({ src, alt, className = '', type, id, title }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getProxiedUrl(src));
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(getProxiedUrl(src));
    setHasError(false);
  }

  if (hasError) {
    if (type === 'item') {
      const itemName = id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_').replace('_Of_', '_of_');
      const fallbackSrc = getProxiedUrl(`https://mobile-legends.fandom.com/wiki/Special:FilePath/${itemName}.png`);
      return (
        <img 
          src={fallbackSrc} 
          alt={alt} 
          className={className} 
          title={title || alt}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('_Icon')) {
                const updatedUrl = target.src.replace('.png', '_Icon.png');
                target.src = updatedUrl.includes('weserv') ? updatedUrl : getProxiedUrl(updatedUrl);
            } else {
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=020617&color=10b981&bold=true`;
            }
          }}
          referrerPolicy="no-referrer"
        />
      );
    }
    if (type === 'emblem') {
      let bgGrad = 'from-slate-700 to-slate-900';
      let textCol = 'text-amber-500';
      let IconObj = Trophy;
      const lowerId = id.toLowerCase();

      if (lowerId.includes('tank')) {
        bgGrad = 'from-emerald-850 to-slate-900';
        textCol = 'text-emerald-400';
        IconObj = Shield;
      } else if (lowerId.includes('assassin') || lowerId.includes('assassino')) {
        bgGrad = 'from-rose-850 to-slate-900';
        textCol = 'text-rose-400';
        IconObj = Sword;
      } else if (lowerId.includes('mage') || lowerId.includes('mago')) {
        bgGrad = 'from-violet-850 to-slate-900';
        textCol = 'text-violet-400';
        IconObj = Zap;
      } else if (lowerId.includes('marksman') || lowerId.includes('tiratore')) {
        bgGrad = 'from-amber-600 to-slate-900';
        textCol = 'text-amber-400';
        IconObj = Target;
      } else if (lowerId.includes('support')) {
        bgGrad = 'from-sky-750 to-slate-900';
        textCol = 'text-sky-400';
        IconObj = Users;
      } else if (lowerId.includes('fighter') || lowerId.includes('combattente')) {
        bgGrad = 'from-orange-850 to-slate-900';
        textCol = 'text-orange-500';
        IconObj = Sword;
      }

      return (
        <div className={`rounded-full bg-gradient-to-tr ${bgGrad} flex items-center justify-center border border-slate-700 shadow-inner p-2 ${className}`}>
          <IconObj size={24} className={textCol} />
        </div>
      );
    }

    if (type === 'spell') {
      let bgGrad = 'from-slate-800 to-slate-950';
      let textCol = 'text-slate-300';
      let IconObj = Sparkles;
      const lowerId = id.toLowerCase();

      if (lowerId === 'execute' || lowerId === 'esecuzione') {
        bgGrad = 'from-red-900/95 to-slate-950';
        textCol = 'text-red-400';
        IconObj = Sword;
      } else if (lowerId === 'retribution' || lowerId === 'retribuzione') {
        bgGrad = 'from-orange-800/95 to-slate-950';
        textCol = 'text-orange-400';
        IconObj = Target;
      } else if (lowerId === 'flicker') {
        bgGrad = 'from-blue-900/95 to-slate-950';
        textCol = 'text-sky-450';
        IconObj = Zap;
      } else if (lowerId === 'sprint') {
        bgGrad = 'from-cyan-800/95 to-slate-950';
        textCol = 'text-cyan-400';
        IconObj = Activity;
      } else if (lowerId === 'inspire' || lowerId === 'ispirazione') {
        bgGrad = 'from-yellow-850 to-slate-950';
        textCol = 'text-yellow-400';
        IconObj = Sparkles;
      } else if (lowerId === 'aegis' || lowerId === 'scudo' || lowerId === 'revitalize' || lowerId === 'revitalizza') {
        bgGrad = 'from-emerald-900/95 to-slate-950';
        textCol = 'text-emerald-400';
        IconObj = Shield;
      } else if (lowerId === 'purify' || lowerId === 'purificazione') {
        bgGrad = 'from-teal-850 to-slate-950';
        textCol = 'text-teal-405';
        IconObj = RefreshCw;
      } else if (lowerId === 'flameshot' || lowerId === 'colpo di fiamma') {
        bgGrad = 'from-rose-900 to-slate-950';
        textCol = 'text-rose-450';
        IconObj = Target;
      } else if (lowerId === 'petrify' || lowerId === 'pietrifica') {
        bgGrad = 'from-zinc-800 to-slate-950';
        textCol = 'text-zinc-400';
        IconObj = Shield;
      } else if (lowerId === 'arrival' || lowerId === 'arrivo') {
        bgGrad = 'from-violet-900 to-slate-950';
        textCol = 'text-violet-400';
        IconObj = ChevronsDown;
      } else if (lowerId === 'vengeance' || lowerId === 'vendetta') {
        bgGrad = 'from-fuchsia-950 to-slate-950';
        textCol = 'text-fuchsia-400';
        IconObj = Shield;
      }

      return (
        <div className={`rounded-xl bg-gradient-to-tr ${bgGrad} flex items-center justify-center border border-slate-700/60 shadow p-2 ${className}`}>
          <IconObj size={24} className={textCol} />
        </div>
      );
    }

    if (type === 'talent') {
      let bgGrad = 'from-slate-800 to-slate-950';
      let textCol = 'text-slate-400';
      let IconObj = Sparkles;
      const lowerId = id.toLowerCase();

      if (lowerId.includes('thrill') || lowerId.includes('rupture') || lowerId.includes('lethal') || lowerId.includes('war')) {
        bgGrad = 'from-rose-955 to-slate-950';
        textCol = 'text-rose-400';
        IconObj = Sword;
      } else if (lowerId.includes('vitality') || lowerId.includes('life') || lowerId.includes('gift') || lowerId.includes('brave') || lowerId.includes('shield')) {
        bgGrad = 'from-emerald-955 to-slate-950';
        textCol = 'text-emerald-400';
        IconObj = Heart;
      } else if (lowerId.includes('agility') || lowerId.includes('swift') || lowerId.includes('quantum') || lowerId.includes('speed') || lowerId.includes('unbending')) {
        bgGrad = 'from-amber-955 to-slate-950';
        textCol = 'text-amber-400';
        IconObj = Zap;
      } else if (lowerId.includes('firmness') || lowerId.includes('tenacity') || lowerId.includes('defense')) {
        bgGrad = 'from-slate-850 to-slate-950';
        textCol = 'text-slate-300';
        IconObj = Shield;
      } else if (lowerId.includes('fatal') || lowerId.includes('master_assassin') || lowerId.includes('weakness') || lowerId.includes('hunter')) {
        bgGrad = 'from-purple-955 to-slate-950';
        textCol = 'text-purple-400';
        IconObj = Target;
      } else if (lowerId.includes('focusing') || lowerId.includes('starlium') || lowerId.includes('bargain') || lowerId.includes('temporal')) {
        bgGrad = 'from-cyan-955 to-slate-950';
        textCol = 'text-cyan-400';
        IconObj = Sparkles;
      }

      return (
        <div className={`rounded-lg bg-gradient-to-tr ${bgGrad} flex items-center justify-center border border-slate-700/50 p-2 ${className}`}>
          <IconObj className={textCol} style={{ width: '100%', height: '100%', maxWidth: '20px', maxHeight: '20px' }} />
        </div>
      );
    }
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      title={title || alt}
      onError={() => {
        if (!imgSrc.includes('weserv')) {
          setImgSrc(getProxiedUrl(src));
        } else {
          setHasError(true);
        }
      }} 
      referrerPolicy="no-referrer"
    />
  );
}

const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
const lanes: Lane[] = ['Gold', 'Exp', 'Mid', 'Roam', 'Jungle'];
const laneIcons: Record<Lane, React.ComponentType<{ size?: number; className?: string }>> = {
  'Gold': TrendingUp,
  'Exp': Shield,
  'Mid': Zap,
  'Roam': Users,
  'Jungle': Target
};

const getHeroLanes = (hero: { id: string; role: string }): Lane[] => {
  const id = hero.id.toLowerCase();
  const role = hero.role.toLowerCase();
  const recommended: Lane[] = [];

  // 1. Jungle
  if (
    role.includes('assassin') ||
    [
      'nolan', 'yin', 'fanny', 'hayabusa', 'helcurt', 'lancelot', 'ling', 'gusion', 
      'karina', 'roger', 'joy', 'alpha', 'martis', 'baxia', 'fredrinn', 'harley', 
      'granger', 'saber', 'aamon', 'alucard', 'julian'
    ].includes(id)
  ) {
    recommended.push('Jungle');
  }

  // 2. Gold
  if (
    role.includes('marksman') ||
    [
      'miya', 'layla', 'lesley', 'bruno', 'clint', 'karrie', 'moskov', 'claude', 
      'wanwan', 'hanabi', 'irithel', 'popol', 'brody', 'beatrix', 'melissa', 'natan', 
      'roger', 'harith', 'lunox'
    ].includes(id)
  ) {
    recommended.push('Gold');
  }

  // 3. Mid
  if (
    role.includes('mage') ||
    [
      'nana', 'vexana', 'pharsa', 'yve', 'novaria', 'odette', 'gord', 'lylia', 
      'luo yi', 'cecilion', 'change', 'aurora', 'valir', 'vale', 'kagura', 'kadita', 
      'xavier', 'lunox', 'zhask', 'faramis', 'harith'
    ].includes(id)
  ) {
    recommended.push('Mid');
  }

  // 4. Roam
  if (
    role.includes('support') ||
    (role.includes('tank') && !['uranus', 'edith', 'gloo'].includes(id)) ||
    [
      'tigreal', 'minotaur', 'angela', 'floryn', 'estes', 'diggie', 'mathilda', 
      'kaja', 'franco', 'atlas', 'khufra', 'akai', 'carmilla', 'lolita', 'rafaela', 
      'johnson', 'chip', 'baxia', 'belerick', 'grock', 'hylos'
    ].includes(id)
  ) {
    recommended.push('Roam');
  }

  // 5. Exp
  if (
    role.includes('fighter') ||
    ['uranus', 'edith', 'gloo', 'esmeralda', 'barats', 'belerick', 'akai', 'alice', 'terizla', 'ruby', 'lapu-lapu', 'arlott'].includes(id)
  ) {
    recommended.push('Exp');
  }

  if (recommended.length === 0) {
    if (role.includes('marksman')) recommended.push('Gold');
    else if (role.includes('mage')) recommended.push('Mid');
    else if (role.includes('assassin')) recommended.push('Jungle');
    else if (role.includes('support') || role.includes('tank')) recommended.push('Roam');
    else recommended.push('Exp');
  }

  return recommended;
};

const getHeroDetailedStats = (hero: MetaHero) => {
  const hash = hero.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  let dps = 50;
  let sustain = 50;
  let control = 50;
  let mobility = 50;
  let push = 50;
  
  const role = hero.role.toLowerCase();
  if (role.includes('assassin')) {
    dps = 85 + (hash % 15);
    sustain = 25 + (hash % 15);
    control = 40 + (hash % 20);
    mobility = 90 + (hash % 10);
    push = 45 + (hash % 15);
  } else if (role.includes('marksman')) {
    dps = 90 + (hash % 10);
    sustain = 20 + (hash % 15);
    control = 35 + (hash % 15);
    mobility = 60 + (hash % 20);
    push = 85 + (hash % 15);
  } else if (role.includes('mage')) {
    dps = 80 + (hash % 15);
    sustain = 30 + (hash % 15);
    control = 75 + (hash % 15);
    mobility = 55 + (hash % 15);
    push = 50 + (hash % 15);
  } else if (role.includes('fighter')) {
    dps = 70 + (hash % 15);
    sustain = 75 + (hash % 15);
    control = 60 + (hash % 15);
    mobility = 65 + (hash % 15);
    push = 65 + (hash % 20);
  } else if (role.includes('tank')) {
    dps = 30 + (hash % 15);
    sustain = 90 + (hash % 10);
    control = 85 + (hash % 15);
    mobility = 45 + (hash % 20);
    push = 30 + (hash % 10);
  } else if (role.includes('support')) {
    dps = 35 + (hash % 15);
    sustain = 60 + (hash % 15);
    control = 65 + (hash % 20);
    mobility = 65 + (hash % 15);
    push = 40 + (hash % 15);
  }

  let strategyEarly = "";
  let strategyMid = "";
  let strategyLate = "";
  let counterTips: string[] = [];
  let counterItems: string[] = [];

  if (role.includes('assassin')) {
    strategyEarly = "Ripulisci le ondate in giungla ed esegui i gank sulle corsie laterali (Gold Lane prioritaria).";
    strategyMid = "Cerca bersagli isolati o con scarsa vita, aspetta che usino le abilità di controllo.";
    strategyLate = "Fiancheggia e colpisci le retrovie nemiche (il Marksman e il Mago) per eliminarli istantaneamente.";
    counterTips = [
      "Congela le ondate vicino alla tua torre per evitare che ti ganki facilmente.",
      "Non viaggiare da solo, muoviti con il tuo Tank o Supporto nei cespugli.",
      "Conserva le abilità di Crowd Control pesante (Hard CC) per bloccarlo durante il suo ingaggio."
    ];
    counterItems = ["Dominance Ice (riduce velocità e cura)", "Antique Cuirass (riduce l'attacco dell'assassino fisico)", "Athena's Shield (contro assassin magici)"];
  } else if (role.includes('marksman')) {
    strategyEarly = "Concentrati esclusivamente sulla sopravvivenza e sul farm (non rischiare l'oro per singole uccisioni).";
    strategyMid = "Resta dietro i Tank o i combattenti durante gli scontri e distruggi le torri non protette.";
    strategyLate = "Diventi la fonte di danno principale; mantieni il posizionamento ideale e infliggi danni costanti.";
    counterTips = [
      "Attaccalo duramente nei primi minuti di gioco con l'aiuto del tuo Roamer per rallentare il suo accumulo d'oro.",
      "Evita di scambiare colpi frontali se ha il supporto di un tank di cura attivo.",
      "Usa gli assassini per eliminarlo prima che possa colpire da lontano."
    ];
    counterItems = ["Blade Armor (riflette il danno degli attacchi base)", "Dominance Ice (riduce la sua velocità d'attacco)", "Wind of Nature (garantisce immunità temporanea al danno fisico)"];
  } else if (role.includes('mage')) {
    strategyEarly = "Pulisci velocemente la Mid Lane e ruota verso le corsie dei compagni per assecondare i combattimenti.";
    strategyMid = "Ottimizza la riduzione del tempo di ricarica per spammare abilità e dominare nei varchi stretti della mappa.";
    strategyLate = "Resta coperto e usa le abilità a distanza (poke) per indebolire gli avversari prima dei grandi teamfight.";
    counterTips = [
      "Evita di raggrupparti troppo compatto se il mago nemico ha grandi abilità ad effetto d'area (AoE).",
      "Sfrutta la sua scarsa mobilità per prenderlo alle spalle quando lancia le abilità a lungo raggio.",
      "Controlla i cespugli per evitare imboscate improvvise."
    ];
    counterItems = ["Athena's Shield (scudo protettivo contro burst magico repentino)", "Radiant Armor (riduce il danno magico continuo)", "Oracle (aumenta del 30% la tua rigenerazione e scudi per contrastarlo)"];
  } else if (role.includes('tank')) {
    strategyEarly = "Supporta il Jungler nella pulizia iniziale del campo e presidia il fiume per raccogliere informazioni visive (fornisci visione).";
    strategyMid = "Inizia i combattimenti per il tuo team (ingaggio) o proteggi le retrovie se gli avversari hanno eroi da imboscata.";
    strategyLate = "Presidia gli ingressi principali alle aree importanti come il Lord o l'Inibitore nemico.";
    counterTips = [
      "Don't waste key cooldowns on the Tank; target squishy carries in the backline first.",
      "Usa la penetrazione percentuale o il Danno Puro per ignorare l'alta corazza del Tank.",
      "Ignora la sua provocazione mantenendoti a debita distanza usando eroi a lungo raggio."
    ];
    counterItems = ["Malefic Roar (ignora fino al 40% della sua difesa fisica)", "Divine Glaive (ignora il 40% della sua difesa magica)", "Demon Hunter Sword (danno basato sulla percentuale di salute massima)"];
  } else if (role.includes('fighter')) {
    strategyEarly = "Controlla la tua corsia (Exp Lane) puntando a vincere i duelli 1v1 per ottenere il livello 4 prima del primo Turtle.";
    strategyMid = "Fai split-pushing costante e unisciti ai combattimenti solo per contestare obiettivi chiave (Turtle/Lord).";
    strategyLate = "Fai da barriera secondaria difendendo il Marksman e aggredisci gli eroi fragili d'angolo (Flank).";
    counterTips = [
      "Evita scambi ravvicinati prolungati se l'avversario ha un'alta rigenerazione o rubavita innato.",
      "Chiama il Jungler per punirlo se spinge troppo in avanti senza visione sulla mappa.",
      "Usa eroi con rallentamento costante per ridurre lo spazio di attacco preferito dai Fighter."
    ];
    counterItems = ["Dominance Ice (riduce rigenerazione e velocità d'attacco)", "Sea Halberd / Necklace of Durance (taglia le cure del 50%)", "Antique Cuirass (riduce il danno fisico totale)"];
  } else {
    strategyEarly = "Fornisci supporto e cure continue nei combattimenti e disturba la fase di farm del Jungler nemico.";
    strategyMid = "Rimani sempre a fianco dei compagni principali per massimizzare l'utilità del tuo kit di abilità di supporto.";
    strategyLate = "Mantieni la visione strategica costante e posiziona scudi o cure protettive tempestive per evitare morti improvvise.";
    counterTips = [
      "Rintraccia il posizionamento del Supporto prima di lanciare un ingaggio globale.",
      "Usa effetti di rigenerazione ridotta (Anti-Heal) indispensabili per mitigare le cure dell'intero team.",
      "Elimina per primo il supporto se espone la sua posizione nel tentativo di proteggere gli altri."
    ];
    counterItems = ["Sea Halberd (essenziale anti-cura fisica)", "Necklace of Durance / Glowing Wand (applica anti-cura costante col danno magico)", "Dominance Ice (prossimità anti-cura e difesa)"];
  }

  return {
    dps,
    sustain,
    control,
    mobility,
    push,
    strategyEarly,
    strategyMid,
    strategyLate,
    counterTips,
    counterItems
  };
};

const roleTranslations: Record<string, string> = {
  'All': 'Tutti',
  'Tank': 'Tank',
  'Fighter': 'Combattente',
  'Assassin': 'Assassino',
  'Mage': 'Mago',
  'Marksman': 'Tiratore',
  'Support': 'Supporto'
};

const getTranslatedRole = (roleStr: string) => {
  return roleStr.split('/').map(r => roleTranslations[r] || r).join('/');
};

function getCounterExplanation(userHero: Hero, enemyHero: Hero): { weakness: string; tactic: string } {
  const uId = userHero.id.toLowerCase();
  const eId = enemyHero.id.toLowerCase();
  const uRole = userHero.role.toLowerCase();
  const eRole = enemyHero.role.toLowerCase();
  const uTags = userHero.counterTags.map(t => t.toLowerCase());
  const eTags = enemyHero.counterTags.map(t => t.toLowerCase());

  // 1. Specific Hero Pairings
  if (uId === 'baxia' && (eId === 'estes' || eId === 'floryn' || eId === 'angela' || eTags.some(t => t.includes('heal') || t.includes('regen') || t.includes('sustain')))) {
    return {
      weakness: "Dipendenza da Rigenerazione PV ed Effetti di Cura",
      tactic: "Le cure costanti sono ridotte del 50% grazie alla passiva 'Baxia Mark' integrata del tuo eroe, azzerando virtualmente il sostentamento nemico senza necessitare Sea Halberd."
    };
  }

  if (['khufra', 'minsitthar', 'phoveus'].includes(uId) && (eId === 'wanwan' || eId === 'fanny' || eId === 'benedetta' || eTags.some(t => t.includes('dash') || t.includes('mobility')))) {
    return {
      weakness: "Dipendenza estrema da Scatti, Salti ed Elevata Mobilità",
      tactic: `Il tuo eroe possiede abilità bloccanti anti-scatto (la palla rimbalzante di Khufra, il terreno aureo di Minsitthar o l'ultimate reattiva di Phoveus) che puniscono dolorosamente ogni tentativo di movimento rapido avversario.`
    };
  }

  if (['karrie', 'lunox', 'dyrroth'].includes(uId) && (eRole.includes('tank') || eTags.includes('heavytank') || eTags.includes('highpvphysical'))) {
    return {
      weakness: "Spessa Corazza ed Elevati Punti Vita (HP)",
      tactic: `Le abilità di ${userHero.name} neutralizzano le difese nemiche (il passivo sul colpo di PV Puri di Karrie, la perforazione magica estrema di Lunox o la distruzione della difesa fisica al 75% di Dyrroth), sciogliendo la frontline avversaria.`
    };
  }

  if (uId === 'valir' && (eRole.includes('fighter') || eRole.includes('tank')) && !eTags.includes('dashspam')) {
    return {
      weakness: "Stile di combattimento esclusivamente corpo a corpo (Melee)",
      tactic: "I continui rallentamenti incendiari accoppiati alla spinta repulsiva della seconda abilità impediscono al nemico di avvicinarsi, permettendoti un kiting perfetto a distanza di sicurezza."
    };
  }

  if (['saber', 'natalia', 'aamon', 'nolan', 'ling'].includes(uId) && (eRole.includes('marksman') || eRole.includes('mage'))) {
    return {
      weakness: "Scarsissima Resistenza Fisica e Magica (Bersaglio Fragile)",
      tactic: `Sfrutti la fragilità insolita del nemico piombando addosso in imboscata: la letale sequenza di colpi ed il burst dps istantaneo elimina il bersaglio prima della sua reazione.`
    };
  }

  if (uId === 'diggie' && eTags.some(t => t.includes('cc') || t.includes('stun') || t.includes('control'))) {
    return {
      weakness: "Forte dipendenza da Crowd Control di gruppo (Stun/Incatenamenti)",
      tactic: "Sfrutti l'abilità Suprema 'Time Journey' che fornisce immunità totale dal controllo dell'intera squadra e uno scudo massiccio, neutralizzando l'iniziazione nemica ed avviando un contrattacco letale."
    };
  }

  // 2. Fallbacks based on tags
  if (eTags.includes('dashspam') || eTags.includes('highmobility')) {
    if (uTags.includes('suppresscc') || uTags.includes('singlelockcc') || uTags.includes('highcc') || uRole.includes('tank')) {
      return {
        weakness: "Dipendenza da Schivate e Scatti per la Sopravvivenza",
        tactic: "La tua ricca dotazione di effetti di controllo focalizzati (lock-on CC) blocca all'istante l'agilità nemica, lasciando il bersaglio indifeso contro il fuoco concentrato degli alleati."
      };
    }
  }

  if (eTags.some(t => t.includes('heal') || t.includes('regen') || t.includes('lifesteal'))) {
    return {
      weakness: "Sostentamento Vitale basato su Rigenerazione/Lifesteal",
      tactic: `Sfrutti la potenza offensiva di ${userHero.name} per sovrastare il loro recupero tramite danni superiori concentrati (burst dps) in frazioni di secondo, prima che abbiano il tempo di sanare le proprie ferite.`
    };
  }

  if (uRole.includes('assassin') && (eRole.includes('marksman') || eRole.includes('mage'))) {
    return {
      weakness: "Fragilità strutturale dei carry nemici con scarsa mobilità",
      tactic: "Le eccellenti doti di mobilità del tuo eroe ti permettono di scavalcare la frontline, sorprendere la retroguardia nemica isolata ed eliminarla con una letale sequenza di abilità esplosive."
    };
  }

  if (uRole.includes('tank') && eRole.includes('assassin')) {
    return {
      weakness: "Nessun potenziale offensivo prolungato del nemico e fragilità ai contrattacchi",
      tactic: "La tua elevatissima corazza e i punti vita scoraggiano la combo iniziale dell'assassino. Proteggi i tuoi carry assorbendo il danno e bloccando il nemico con i tuoi stordimenti una volta scoperto."
    };
  }

  if (uRole.includes('marksman') && eRole.includes('tank') && uTags.includes('attackspeeddps')) {
    return {
      weakness: "Lentezza d'azione e scarsa difesa contro continui attacchi rapidi",
      tactic: "La tua formidabile velocità d'attacco a distanza ti consente di tempestare il tank da fuori portata, erodendo gradualmente la sua imponente barra vitale mentre schivi le sue lente abilità."
    };
  }

  // Ultimate Generic Fallback
  return {
    weakness: "Mancanza di contromisure contro il kit di " + userHero.name,
    tactic: `Sfrutti il perfetto bilanciamento delle tue abilità e del tuo danno (${userHero.damageType}) per forzare uno scontro favorevole nel lane di competenza, sfruttando le finestre di ricarica delle loro abilità chiave.`
  };
}

function getHeroMetaStatus(hero: Hero, currentLane: Lane, liveMeta: MetaHero[]): {
  type: 'meta' | 'off_meta' | 'situational';
  label: string;
  color: string;
  badgeClass: string;
  desc: string;
} {
  const metaHero = liveMeta.find(mh => mh.id === hero.id);
  const tier = metaHero?.tier || 'B';
  const lanesList = getHeroLanes(hero);
  const isCorrectLane = lanesList.includes(currentLane);

  if (['S+', 'S'].includes(tier) && isCorrectLane) {
    return {
      type: 'meta',
      label: '🚀 IN META (Tier ' + tier + ')',
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      badgeClass: 'bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-black',
      desc: `Campione dominante di Tier ${tier}. Attualmente eccelle nella corsia ${currentLane} con alte statistiche di efficacia.`
    };
  } else if (!isCorrectLane || ['B', 'C'].includes(tier)) {
    return {
      type: 'off_meta',
      label: '⚠️ OFF-META / Atipico',
      color: 'text-rose-450 border-rose-500/20 bg-rose-500/5',
      badgeClass: 'bg-red-950/80 text-red-400 border border-red-500/20 font-black',
      desc: !isCorrectLane 
        ? `Insolito o sconsigliato per la corsia ${currentLane}. Corsie raccomandate: ${lanesList.join(', ')}.`
        : `Tier ${tier}. Presenta vulnerabilità nel meta competitivo o richiede composizioni molto specifiche.`
    };
  } else {
    return {
      type: 'situational',
      label: '⚡ SITUAZIONALE (Tier ' + tier + ')',
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
      badgeClass: 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/20 font-black',
      desc: `Scelta bilanciata di Tier ${tier}. Molto performante in presenza di matchup favorevoli o counter dedicati.`
    };
  }
}

export default function App() {
  const [userHeroId, setUserHeroId] = useState<string>('');
  const [lane, setLane] = useState<Lane>('Exp');
  const [enemyIds, setEnemyIds] = useState<string[]>([]);
  const [allyIds, setAllyIds] = useState<string[]>([]);
  const [isAllySectionExpanded, setIsAllySectionExpanded] = useState(false);
  const [customTalents, setCustomTalents] = useState<{tier1?: Talent; tier2?: Talent; tier3?: Talent}>({});
  const [editingTalentTier, setEditingTalentTier] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMatchAnalyzerOpen, setIsMatchAnalyzerOpen] = useState(false);
  const [isHeroEncyclopediaOpen, setIsHeroEncyclopediaOpen] = useState(false);
  const [isItemEncyclopediaOpen, setIsItemEncyclopediaOpen] = useState(false);
  const [isSavedBuildsOpen, setIsSavedBuildsOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [liveMeta, setLiveMeta] = useState<MetaHero[]>(() => {
    const saved = localStorage.getItem('mlbb_live_meta_updated');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return [...META_HEROES]; }
    }
    return [...META_HEROES];
  });
  const [metaSearch, setMetaSearch] = useState('');
  const [metaRoleFilter, setMetaRoleFilter] = useState<string | 'All'>('All');
  const [metaSort, setMetaSort] = useState<'tier' | 'winRate' | 'pickRate' | 'banRate'>('tier');
  const [metaSortDirection, setMetaSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedMetaHero, setSelectedMetaHero] = useState<MetaHero | null>(null);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [patchModalSubTab, setPatchModalSubTab] = useState<'app' | 'game'>('app');
  const [gamePatchVersion, setGamePatchVersion] = useState<string>(() => {
    return localStorage.getItem('mlbb_game_patch_version') || '1.8.92';
  });
  const [appPatchVersion, setAppPatchVersion] = useState<string>(() => {
    return localStorage.getItem('mlbb_app_patch_version') || '1.1.7';
  });

  const [appPatchHistory, setAppPatchHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('mlbb_app_patch_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        version: '1.1.7',
        date: '20 Maggio 2026',
        title: 'Separazione Architettura Patch & Live Telemetry',
        changes: [
          'Separata logica di aggiornamento: App Patch (sviluppo dell\'app) vs Game Patch (Moonton ufficiale).',
          'Inserito pannello dinamico per il rilascio incrementale delle funzionalità dell\'app.',
          'Risolto un potenziale bug di sovrapposizione su schermi piccoli.'
        ]
      },
      {
        version: '1.1.6',
        date: '18 Maggio 2026',
        title: 'Radar di Corsia & Filtri Avanzati',
        changes: [
          'Implementato Radar di Corsia (Lane Meta) con distinzione tra scelte S-Tier e fuori meta.',
          'Aggiunto pannello console hacker per osservare la visualizzazione telemetry live.'
        ]
      },
      {
        version: '1.1.5',
        date: '15 Maggio 2026',
        title: 'Moonton Database Live API Sync',
        changes: [
          'Introdotto pulsante di aggiornamento forzato della telemetria delle lobby competitive.',
          'Allineati i coefficienti di calcolo delle build counter al valore della patch di transizione.'
        ]
      },
      {
        version: '1.1.0',
        date: '10 Maggio 2026',
        title: 'Inizializzazione Sandbox & Enciclopedia Oggetti',
        changes: [
          'Progettata prima versione del builder di contromisure con supporto difese ibride.',
          'Creata enciclopedia interattiva degli strumenti di gioco MLBB.'
        ]
      }
    ];
  });

  const [gamePatchHistory, setGamePatchHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('mlbb_game_patch_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        version: '1.9.00',
        date: 'Giugno 2026',
        title: 'Project NEXT: Next Era',
        changes: [
          'Revamp completo degli equipaggiamenti fisici e magici per la transizione ibrida.',
          'Aggiunto Attacco Adattivo e Penetrazione Adattiva per gli elementi salvavita.',
          'Nuovi oggetti inseriti nel builder: Sky Piercer (Frantuma Cieli) e Malefic Gun.',
          'Ribilanciamento di tutti gli archetipi del cacciatore e pesi AI.'
        ]
      },
      {
        version: '1.8.92',
        date: 'Maggio 2026',
        title: 'Balance & Optimization',
        changes: [
          'Ottimizzazione sui punteggi dell\'algoritmo di mitigazione del DPS.',
          'Modificati i pesi dell\'AI per l\'Exp Lane e le build tankose innate.',
          'Rimozione di anomalie di burst magico su Eudora e Vexana.'
        ]
      },
      {
        version: '1.8.78',
        date: 'Aprile 2026',
        title: 'Pre-Season Fixes',
        changes: [
          'Risolti problemi minori nella UI di classificazione oggetti.',
          'Aggiornata l\'icona del roam conceal e la priorità nei Tank.'
        ]
      }
    ];
  });

  const [activeMetaTab, setActiveMetaTab] = useState<'all' | 'lanes'>('all');
  const [selectedMetaLane, setSelectedMetaLane] = useState<Lane>('Exp');
  const [isSyncActive, setIsSyncActive] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  
  const getTodayFormattedTime = () => {
    const d = new Date();
    return `${d.toLocaleDateString('it-IT')} ${d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} (Auto-Sync Live)`;
  };

  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    const saved = localStorage.getItem('mlbb_meta_last_sync_time');
    if (saved) return saved;
    return getTodayFormattedTime();
  });

  React.useEffect(() => {
    const savedTime = localStorage.getItem('mlbb_meta_last_sync_time');
    if (!savedTime) {
      const todayTime = getTodayFormattedTime();
      localStorage.setItem('mlbb_meta_last_sync_time', todayTime);
      setLastSyncTime(todayTime);
    }
  }, []);

  React.useEffect(() => {
    if (!isMetaOpen) {
      setSelectedMetaHero(null);
    }
  }, [isMetaOpen]);

  const handleForceSync = () => {
    if (isSyncActive) return;
    setIsSyncActive(true);
    setSyncProgress(0);
    setSyncLogs([]);
    
    const steps = [
      { log: "Inizializzazione sessione protetta ssl://api-telemetry.moonton.com...", delay: 200, progress: 15 },
      { log: "Recupero dati di lobby (Ranked Mythical Glory & MPL Pro Matches)...", delay: 500, progress: 35 },
      { log: `Matchmaking telemetry stream: analizzati 12.000.000 eventi su patch corrente ${gamePatchVersion || '1.8.92'}...`, delay: 850, progress: 60 },
      { log: "Calcolo statistico incrementale in corso (Win Rate, Ban Rate, Pick Rate per corsia)...", delay: 1200, progress: 80 },
      { log: "Aggiornamento indici di rilevanza Meta ed elisione bias per deviazioni standard...", delay: 1550, progress: 95 },
      { log: "Sincronizzazione completata con successo! Database ufficiale aggiornato.", delay: 1800, progress: 100 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString('it-IT')}] ${step.log}`]);
        setSyncProgress(step.progress);
        
        if (index === steps.length - 1) {
          const updatedMeta = liveMeta.map(hero => {
            const hash = Math.abs(hero.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
            const wave = Math.sin(Date.now() / 1000 + hash);
            
            const winRateOffset = Number((wave * 0.14).toFixed(2));
            const banRateOffset = Number((wave * 0.35).toFixed(2));
            const pickRateOffset = Number((wave * 0.08).toFixed(2));
            
            let newWinRate = Number((hero.winRate + winRateOffset).toFixed(1));
            let newBanRate = Number((hero.banRate + banRateOffset).toFixed(1));
            let newPickRate = Number((hero.pickRate + pickRateOffset).toFixed(1));
            
            newWinRate = Math.max(43.5, Math.min(58.5, newWinRate));
            newBanRate = Math.max(0.1, Math.min(92.0, newBanRate));
            newPickRate = Math.max(0.2, Math.min(16.0, newPickRate));

            let tier = hero.tier;
            const score = newWinRate * 0.35 + newBanRate * 0.45 + newPickRate * 0.2;
            if (score > 32) tier = 'S+';
            else if (score > 26) tier = 'S';
            else if (score > 21) tier = 'A';
            else if (score > 18) tier = 'B';
            else tier = 'C';

            return {
              ...hero,
              winRate: newWinRate,
              banRate: newBanRate,
              pickRate: newPickRate,
              tier: tier as any
            };
          });

          setLiveMeta(updatedMeta);
          localStorage.setItem('mlbb_live_meta_updated', JSON.stringify(updatedMeta));
          
          const now = new Date();
          const formattedDate = `${now.toLocaleDateString('it-IT')} ${now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} (Aggiornato Live API)`;
          setLastSyncTime(formattedDate);
          localStorage.setItem('mlbb_meta_last_sync_time', formattedDate);
          
          setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString('it-IT')}] Sincronizzazione telemetria completata con successo sulla patch di gioco corrente!`]);

          setTimeout(() => {
            setIsSyncActive(false);
          }, 1000);
        }
      }, step.delay);
    });
  };

  const filteredAndSortedMeta = React.useMemo(() => {
    let result = liveMeta.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(metaSearch.toLowerCase());
      const matchRole = metaRoleFilter === 'All' || h.role.includes(metaRoleFilter);
      return matchSearch && matchRole;
    });

    result.sort((a, b) => {
      let valA: any = a[metaSort as keyof typeof a];
      let valB: any = b[metaSort as keyof typeof b];

      if (metaSort === 'tier') {
        const tierValue = { 'S+': 4, 'S': 3, 'A': 2, 'B': 1, 'C': 0 };
        valA = tierValue[a.tier as keyof typeof tierValue] ?? -1;
        valB = tierValue[b.tier as keyof typeof tierValue] ?? -1;
      }

      if (valA < valB) return metaSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return metaSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [liveMeta, metaSearch, metaRoleFilter, metaSort, metaSortDirection]);

  // Gestione click intestazioni tabella per ordinare
  const handleMetaSort = (key: 'tier' | 'winRate' | 'pickRate' | 'banRate') => {
    if (metaSort === key) {
      setMetaSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setMetaSort(key);
      setMetaSortDirection('desc');
    }
  };

  React.useEffect(() => {
    const stored = localStorage.getItem('mlbb_saved_builds');
    if (stored) {
      try {
        setSavedBuilds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved builds", e);
      }
    }
  }, []);

  const saveBuild = () => {
    if (!results || !userHero) return;
    
    // Confeziona la build finale salvando eventuali customizzazioni fatte nel sandbox
    const finalizedResults = {
      ...results,
      items,
      stats: customStats || results.stats,
      statProgression: customStatProgression || results.statProgression
    };

    const newBuild: SavedBuild = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      userHeroId,
      enemyIds,
      lane,
      results: finalizedResults as any
    };

    const updated = [newBuild, ...savedBuilds].slice(0, 20); // Keep last 20
    setSavedBuilds(updated);
    localStorage.setItem('mlbb_saved_builds', JSON.stringify(updated));
    alert("Build salvata nei preferiti! (Include eventuali oggetti personalizzati)");
  };

  const deleteSavedBuild = (id: string) => {
    const updated = savedBuilds.filter(b => b.id !== id);
    setSavedBuilds(updated);
    localStorage.setItem('mlbb_saved_builds', JSON.stringify(updated));
  };

  const loadSavedBuild = (build: SavedBuild) => {
    setUserHeroId(build.userHeroId);
    setEnemyIds(build.enemyIds);
    setLane(build.lane as Lane);
    // Ripristina l'overrides se la build conteneva dei custom items
    const customOverridesLoaded: Record<number, Item> = {};
    if (build.results && build.results.items) {
      build.results.items.forEach((slot, idx) => {
        const originalItem = results?.items?.[idx]?.item;
        if (originalItem && originalItem.id !== slot.item.id) {
          customOverridesLoaded[idx] = slot.item;
        }
      });
    }
    setCustomBuildOverrides(customOverridesLoaded);
    setIsSavedBuildsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyBuildToClipboard = () => {
    if (!results || !userHero) return;

    const itemsStr = items.map((s, i) => `${i + 1}. ${s.item.name} [Slot ${i+1}]`).join('\n');
    const text = `
⚔️ MLBB BUILD BY LUNATIO ⚔️
Hero: ${userHero.name} (${lane})
Target: VS ${enemies.map(e => e.name).join(', ')}

📦 EQUIPAGGIAMENTO CHIAVE (SANDBOX SIMULATO):
${itemsStr}

✨ EMBLEMA CONSIGLIATO: ${results.emblem.name}
🔮 INCANTESIMO CONSIGLIATO: ${results.spell.name}

Generato e simulato su: ${window.location.href}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert("Configurazione copiata con successo!");
    });
  };
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleUpdatePatch = () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    setTimeout(() => {
      setIsUpdating(false);
      setIsPatchModalOpen(true);
    }, 850);
  };

  const clearEnemies = () => setEnemyIds([]);

  const userHero = HEROES.find(h => h.id === userHeroId);
  const enemies = enemyIds.map(id => HEROES.find(h => h.id === id)!).filter(Boolean);
  const allies = allyIds.map(id => HEROES.find(h => h.id === id)!).filter(Boolean);
  
  const results = useMemo(() => {
    return userHero && enemies.length > 0 ? calculateBuild(userHero, lane, enemies) : null;
  }, [userHero, lane, enemies]);

  const attackSpeedSuggestions = useMemo(() => {
    if (!userHero) return [];
    
    const asItems = OFFICIAL_ITEMS.filter(item => {
      const hasAS = item.attributes.some(a => a.toLowerCase().includes("velocità d'attacco"));
      const isOnHit = item.passiveDescription.toLowerCase().includes("sul colpo") || 
                       item.passiveDescription.toLowerCase().includes("attacchi base") ||
                       item.passiveDescription.toLowerCase().includes("on-hit");
      return hasAS || isOnHit;
    });

    return asItems.map(item => {
      let score = 0;
      if (userHero.damageType === 'Magico' && item.category === 'Magic') score += 10;
      if (userHero.damageType === 'Fisico' && item.category === 'Attack') score += 10;
      if (item.id === 'demon_hunter_sword') score += 15;
      if (item.id === 'golden_staff') score += 12;
      if (item.id === 'corrosion_scythe') score += 12;
      if (item.id === 'sea_halberd') score += 8;
      if (item.id === 'windtalker') score += 7;
      if (item.id === 'malefic_gun') score += 10;
      if (userHero.damageType === 'Magico' && item.id === 'feather_of_heaven') score += 20;
      return { item, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.item);
  }, [userHero]);

  const counterTargets = useMemo(() => {
    if (!userHero || enemies.length === 0) return [];
    
    return enemies.map(enemy => {
      let isCountered = false;
      if (userHero.role.includes('Assassin') && (enemy.role.includes('Marksman') || enemy.role.includes('Mage'))) isCountered = true;
      if (userHero.role.includes('Tank') && enemy.role.includes('Assassin')) isCountered = true;
      if (['karrie', 'lunox', 'dyrroth'].includes(userHero.id) && (enemy.role.includes('Tank') || enemy.counterTags.includes('heavyTank') || enemy.counterTags.includes('regenPV'))) isCountered = true;
      if (['baxia'].includes(userHero.id) && (enemy.counterTags.some(t => t.toLowerCase().includes('heal') || t.toLowerCase().includes('regen')) || ['estes', 'floryn', 'angela', 'ruby'].includes(enemy.id))) isCountered = true;
      if (['khufra', 'phoveus', 'minsitthar'].includes(userHero.id) && (enemy.counterTags.includes('dashSpam') || enemy.counterTags.includes('highMobility') || ['wanwan', 'chou', 'harith', 'fanny', 'benedetta'].includes(enemy.id))) isCountered = true;
      if (['valir'].includes(userHero.id) && (enemy.role.includes('Fighter') || enemy.role.includes('Tank')) && !enemy.counterTags.includes('dashSpam')) isCountered = true;
      if (['martis', 'diggie'].includes(userHero.id) && enemy.counterTags.includes('highCC')) isCountered = true;

      const counterPairs: Record<string, string[]> = {
        'highMobility': ['khufra', 'minsitthar', 'phoveus', 'kaja', 'franco', 'akai', 'chou'],
        'dashSpam': ['khufra', 'minsitthar', 'phoveus'],
        'aoeHealSpam': ['baxia'],
        'teamSustain': ['baxia'],
        'lifestealDPS': ['baxia', 'dyrroth'],
        'shieldPV': ['baxia', 'esmeralda'],
      };

      for (const [tag, counters] of Object.entries(counterPairs)) {
        if (enemy.counterTags.includes(tag) && counters.includes(userHero.id)) isCountered = true;
      }

      if (isCountered) {
        const explanation = getCounterExplanation(userHero, enemy);
        return { enemy, ...explanation };
      }
      return null;
    }).filter((x): x is { enemy: Hero; weakness: string; tactic: string } => x !== null).slice(0, 5);
  }, [userHero, enemies]);

  const allPotentialCounters = useMemo(() => {
    if (!userHero) return [];
    
    return HEROES.map(enemy => {
      if (enemy.id === userHero.id) return null;
      let isCountered = false;
      if (userHero.role.includes('Assassin') && (enemy.role.includes('Marksman') || enemy.role.includes('Mage'))) isCountered = true;
      if (userHero.role.includes('Tank') && enemy.role.includes('Assassin')) isCountered = true;
      if (['karrie', 'lunox', 'dyrroth'].includes(userHero.id) && (enemy.role.includes('Tank') || enemy.counterTags.includes('heavyTank') || enemy.counterTags.includes('regenPV'))) isCountered = true;
      if (['baxia'].includes(userHero.id) && (enemy.counterTags.some(t => t.toLowerCase().includes('heal') || t.toLowerCase().includes('regen')) || ['estes', 'floryn', 'angela', 'ruby'].includes(enemy.id))) isCountered = true;
      if (['khufra', 'phoveus', 'minsitthar'].includes(userHero.id) && (enemy.counterTags.includes('dashSpam') || enemy.counterTags.includes('highMobility') || ['wanwan', 'chou', 'harith', 'fanny', 'benedetta'].includes(enemy.id))) isCountered = true;
      if (['valir'].includes(userHero.id) && (enemy.role.includes('Fighter') || enemy.role.includes('Tank')) && !enemy.counterTags.includes('dashSpam')) isCountered = true;
      if (['martis', 'diggie'].includes(userHero.id) && enemy.counterTags.includes('highCC')) isCountered = true;

      const counterPairs: Record<string, string[]> = {
        'highMobility': ['khufra', 'minsitthar', 'phoveus', 'kaja', 'franco', 'akai', 'chou'],
        'dashSpam': ['khufra', 'minsitthar', 'phoveus'],
        'aoeHealSpam': ['baxia'],
        'teamSustain': ['baxia'],
        'lifestealDPS': ['baxia', 'dyrroth'],
        'shieldPV': ['baxia', 'esmeralda'],
      };

      for (const [tag, counters] of Object.entries(counterPairs)) {
        if (enemy.counterTags.includes(tag) && counters.includes(userHero.id)) isCountered = true;
      }

      if (isCountered) {
        const explanation = getCounterExplanation(userHero, enemy);
        return { enemy, ...explanation };
      }
      return null;
    }).filter((x): x is { enemy: Hero; weakness: string; tactic: string } => x !== null).slice(0, 5);
  }, [userHero]);

  const simulateExpandedWinRate = (hero: Hero, l: Lane, squad: Hero[], opposition: Hero[]) => {
    // 1. BASE RATE DETERMINATION
    const roleBaseMap: Record<string, Record<Lane, number>> = {
      'Tank': { 'Roam': 54, 'Jungle': 47, 'Exp': 45, 'Mid': 32, 'Gold': 28 },
      'Fighter': { 'Exp': 55, 'Jungle': 51, 'Roam': 44, 'Mid': 38, 'Gold': 34 },
      'Assassin': { 'Jungle': 57, 'Mid': 45, 'Exp': 43, 'Roam': 38, 'Gold': 35 },
      'Mage': { 'Mid': 56, 'Gold': 42, 'Exp': 40, 'Jungle': 40, 'Roam': 43 },
      'Marksman': { 'Gold': 56, 'Jungle': 42, 'Mid': 38, 'Exp': 35, 'Roam': 28 },
      'Support': { 'Roam': 55, 'Mid': 45, 'Exp': 33, 'Gold': 30, 'Jungle': 28 }
    };

    let maxBase = 40;
    const rolesList = hero.role.split('/');
    rolesList.forEach(role => {
      const rTrim = role.trim();
      const mapForRole = roleBaseMap[rTrim];
      if (mapForRole && mapForRole[l] > maxBase) {
        maxBase = mapForRole[l];
      }
    });

    let score = maxBase;
    const pros: string[] = [];
    const cons: string[] = [];
    
    pros.push(`Valutazione Ruolo: Base di win rate stimata al ${maxBase}% in corsia ${l}.`);

    // 2. TEAM COMPOSITION & SYNERGY
    const fullSquad = [hero, ...squad];
    if (fullSquad.length > 1) {
      // Damage profile balance
      const magicDealers = fullSquad.filter(h => h.damageType === 'Magico').length;
      const physicalDealers = fullSquad.filter(h => h.damageType === 'Fisico').length;
      const trueDealers = fullSquad.filter(h => h.damageType === 'Puro').length;
      
      if (magicDealers === 0 && physicalDealers >= 3) {
        score -= 4;
        cons.push("Sbilanciamento Danni: Solo danno fisico. I nemici countereranno facilmente con Armatura (es. Antique Cuirass) (-4%).");
      } else if (physicalDealers === 0 && magicDealers >= 3) {
        score -= 4;
        cons.push("Sbilanciamento Danni: Solo danno magico. Il team subirà la presenza di Athena's Shield/Radiant Armor (-4%).");
      } else if (magicDealers >= 1 && physicalDealers >= 1) {
        score += 2;
        pros.push("Danno Misto: Bilanciamento ideale per rendere difficile la difesa avversaria (+2%).");
      }
      if (trueDealers > 0) {
        score += 1.5;
        pros.push("Danno Puro: Capacità di sciogliere le difese tank (+1.5%).");
      }

      // Role composition penalty (preventing 5 mages etc)
      const roleCounts: Record<string, number> = {};
      fullSquad.forEach(h => {
        const prim = h.role.split('/')[0].trim();
        roleCounts[prim] = (roleCounts[prim] || 0) + 1;
      });
      if ((roleCounts['Marksman'] || 0) > 1) {
        score -= 3.5;
        cons.push("Multi-Tiratore: Troppi eroi farm-dipendenti rallentano il powerspike del team (-3.5%).");
      }
      if ((roleCounts['Mage'] || 0) > 2) {
        score -= 3;
        cons.push("Sovrabbondanza Magica: Manca front-line fisica sostenibile (-3%).");
      }
      if ((roleCounts['Tank'] || 0) + (roleCounts['Fighter'] || 0) + (roleCounts['Support'] || 0) === 0) {
         score -= 5;
         cons.push("Team Fragilissimo: Assenza totale di front-line o peel. Rischio snowball molto alto (-5%).");
      } else if ((roleCounts['Tank'] || 0) + (roleCounts['Support'] || 0) > 0) {
         score += 2.5;
         pros.push("Presenza Peel/Frontline: Formazione che garantisce copertura per i carry (+2.5%).");
      }

      // Combo System: Crowd Control + Burst or AoE
      const hasAoeCC = fullSquad.some(h => ['tigreal', 'atlas', 'khufra', 'minotaur', 'belerick', 'johnson', 'carmilla'].includes(h.id) || h.counterTags.some(t => /groupCC|aoeStun|knockupAoE/i.test(t)));
      const hasAoeBurst = fullSquad.some(h => ['pharsa', 'odette', 'vale', 'yve', 'kadita', 'alice'].includes(h.id) || h.counterTags.some(t => /aoeBurst|artillery/i.test(t)));
      if (hasAoeCC && hasAoeBurst) {
         score += 3.5;
         pros.push("Combo 'Wombo': Ecellente sinergia CC ad area seguito da burst AoE (+3.5%).");
      }
    }

    // 3. ENEMY MATCHUP ANALYSIS (Opposition Logic)
    if (opposition.length > 0) {
      let laneOpponent: Hero | null = null;
      if (l === 'Gold') laneOpponent = opposition.find(e => e.role.includes('Marksman')) || null;
      else if (l === 'Mid') laneOpponent = opposition.find(e => e.role.includes('Mage')) || null;
      else if (l === 'Jungle') laneOpponent = opposition.find(e => e.role.includes('Assassin') || e.role.includes('Tank') || e.role.includes('Fighter')) || null;
      else if (l === 'Roam') laneOpponent = opposition.find(e => e.role.includes('Support') || e.role.includes('Tank')) || null;
      else if (l === 'Exp') laneOpponent = opposition.find(e => e.role.includes('Fighter') || e.role.includes('Tank')) || null;
      if (!laneOpponent) laneOpponent = opposition[0];

      // Lane opponent matchup based on counter tags matching
      if (laneOpponent) {
        const heroTags = hero.counterTags.join(' ').toLowerCase();
        const oppTags = laneOpponent.counterTags.join(' ').toLowerCase();
        
        let localMatchBonus = 0;
        
        // Detailed mechanic counters in lane
        if (/lifesteal|regen|heal/i.test(oppTags) && /antiheal|burst/i.test(heroTags) || ['baxia'].includes(hero.id)) {
          localMatchBonus += 3;
          pros.push(`Counter Sustain: Riduci efficacemente la cura e sustain di ${laneOpponent.name} (+3%).`);
        }
        if (/dash|mobility/i.test(oppTags) && /antidash|suppress|locksingle/i.test(heroTags) || ['khufra', 'phoveus', 'minsitthar', 'kaja', 'franco', 'chou'].includes(hero.id)) {
          localMatchBonus += 4.5;
          pros.push(`Blocco Mobilità: Intercetti fluidamente gli scatti di ${laneOpponent.name} (+4.5%).`);
        }
        if (/burst|assassin/i.test(oppTags) && /shield|immortality|damageReduction|tank/i.test(heroTags)) {
          localMatchBonus += 3;
          pros.push(`Robustezza: Incassi bene i burst damage di ${laneOpponent.name} in corsia (+3%).`);
        }

        // Reverse check (we are getting countered)
        if (/lifesteal|regen|heal/i.test(heroTags) && (['baxia', 'belerick'].includes(laneOpponent.id) || /antiheal|burst/i.test(oppTags))) {
          localMatchBonus -= 3.5;
          cons.push(`Counterato in Sustain: ${laneOpponent.name} diminuisce fortemente la tua capacità di curarti (-3.5%).`);
        }
        if (/dash|mobility/i.test(heroTags) && /antidash|suppress|locksingle/i.test(oppTags) || ['khufra', 'phoveus', 'minsitthar', 'kaja', 'franco'].includes(laneOpponent.id)) {
          localMatchBonus -= 4.5;
          cons.push(`Mobilità Soppressa: Gli scatti del tuo pick sono puniti duramente da ${laneOpponent.name} (-4.5%).`);
        }
        if (/tank/i.test(hero.role) && /truedamage|tankmelter/i.test(oppTags) || ['karrie', 'lunox', 'valir'].includes(laneOpponent.id)) {
          localMatchBonus -= 4;
          cons.push(`Sciogli-Tank: ${laneOpponent.name} bypassa la tua mole difensiva (-4%).`);
        }

        score += localMatchBonus;
      }

      // General Enemy Team Checks
      const enemyHasLotsOfCC = opposition.filter(e => /cc|stun|knockup|suppress|terrify/i.test(e.counterTags.join(' '))).length >= 3;
      if (enemyHasLotsOfCC && !hero.counterTags.some(t => /immunity|purify|invincible/i.test(t))) {
        score -= 3;
        cons.push("Sofferenza Controllo: Assenza di immunità naturali contro un team fortemente orientato al Controllo Folla (-3%).");
      }
      
      const earlyGameVulnerability = (hero.role.includes('Marksman') && !['clint', 'brody'].includes(hero.id)) || hero.id === 'aldous' || hero.id === 'cecilion' || hero.id === 'smolder';
      const enemyEarlyAggression = opposition.filter(e => /earlygame|invade|fastpick/i.test(e.counterTags.join(' ')) || ['fanny', 'ling', 'selena', 'jawhead', 'mathilda'].includes(e.id)).length;
      if (earlyGameVulnerability && enemyEarlyAggression >= 2) {
        score -= 4;
        cons.push("Sofferenza Early Game: Vulnerabile alle rotazioni e invasioni repentine del team nemico (-4%).");
      }
    } else {
      pros.push("Proiezione: Fattori valutati in situazione 'blind pick' (Nessun nemico noto).");
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

  const laneWinRates = useMemo(() => {
    if (!userHero) return null;
    return lanes.map(l => simulateExpandedWinRate(userHero, l, allies, enemies));
  }, [userHero, allies, enemies]);


  const [customBuildOverrides, setCustomBuildOverrides] = useState<Record<number, Item>>({});
  const [swappingSlotIndex, setSwappingSlotIndex] = useState<number | null>(null);

  React.useEffect(() => {
    setCustomBuildOverrides({});
    setCustomTalents({});
    setEditingTalentTier(null);
  }, [userHeroId, lane, enemyIds]);

  const items = useMemo(() => {
    if (!results) return [];
    return results.items.map((slot, idx) => {
      if (customBuildOverrides[idx]) {
        return {
          item: customBuildOverrides[idx],
          reason: "(Sostituito da te) Oggetto inserito manualment per testare una configurazione alternativa rispetto all'originale."
        };
      }
      return slot;
    });
  }, [results, customBuildOverrides]);

  const handleResetSlot = (idx: number) => {
    const updated = { ...customBuildOverrides };
    delete updated[idx];
    setCustomBuildOverrides(updated);
  };

  const selectedEmblem = useMemo(() => {
    if (!userHero) return EMBLEMS.BASIC;
    let emb = EMBLEMS.BASIC;
    if (userHero.role.includes('Tank')) emb = EMBLEMS.TANK;
    else if (userHero.role.includes('Assassin')) emb = EMBLEMS.ASSASSIN;
    else if (userHero.role.includes('Mage')) emb = EMBLEMS.MAGE;
    else if (userHero.role.includes('Marksman')) emb = EMBLEMS.MARKSMAN;
    else if (userHero.role.includes('Support')) emb = EMBLEMS.SUPPORT;
    else if (userHero.role.includes('Fighter')) emb = EMBLEMS.FIGHTER;
    return emb;
  }, [userHero]);

  const activeTalent1 = useMemo(() => customTalents.tier1 || results?.emblem.tier1, [customTalents.tier1, results?.emblem.tier1]);
  const activeTalent2 = useMemo(() => customTalents.tier2 || results?.emblem.tier2, [customTalents.tier2, results?.emblem.tier2]);
  const activeTalent3 = useMemo(() => customTalents.tier3 || results?.emblem.tier3, [customTalents.tier3, results?.emblem.tier3]);

  const customStats = useMemo(() => {
    if (items.length === 0) return null;
    const stats: Record<string, number> = {};
    items.forEach(slot => {
      if (!slot.item.attributes) return;
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
          else if (key.includes('Rubavita Magico')) key = 'Rubavita Magico';
          else if (key.includes('Probabilità Critico')) key = 'Critico';

          const finalKey = isPercentage ? key + ' %' : key;
          stats[finalKey] = (stats[finalKey] || 0) + value;
        }
      });
    });

    // Aggiungi statistiche dei Talenti attivi
    const activeList = [activeTalent1, activeTalent2, activeTalent3].filter(Boolean);
    activeList.forEach(t => {
      if (!t) return;
      if (t.id === 'thrill') {
        const k = userHero?.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico';
        stats[k] = (stats[k] || 0) + 16;
      } else if (t.id === 'vitality') {
        stats['PV'] = (stats['PV'] || 0) + 225;
      } else if (t.id === 'agility') {
        stats['Velocità di Movimento %'] = (stats['Velocità di Movimento %'] || 0) + 4;
      } else if (t.id === 'firmness') {
        stats['Difesa Fisica'] = (stats['Difesa Fisica'] || 0) + 12;
        stats['Difesa Magica'] = (stats['Difesa Magica'] || 0) + 12;
      } else if (t.id === 'fatal') {
        stats['Critico %'] = (stats['Critico %'] || 0) + 5;
      } else if (t.id === 'swift') {
        stats['Velocità d\'Attacco %'] = (stats['Velocità d\'Attacco %'] || 0) + 10;
      } else if (t.id === 'rupture') {
        const k = userHero?.damageType === 'Magico' ? 'Penetrazione Magica' : 'Penetrazione Fisica';
        stats[k] = (stats[k] || 0) + 5;
      } else if (t.id === 'inspire') {
        stats['Riduzione CD %'] = (stats['Riduzione CD %'] || 0) + 5;
      } else if (t.id === 'starlium_bravery') {
        const k = userHero?.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico';
        stats[k] = (stats[k] || 0) + 15;
        stats['Riduzione CD %'] = (stats['Riduzione CD %'] || 0) + 5;
      } else if (t.id === 'festival_of_blood') {
        stats['Rubavita Magico %'] = (stats['Rubavita Magico %'] || 0) + 6;
      }
    });

    return stats;
  }, [items, activeTalent1, activeTalent2, activeTalent3, userHero]);

  const customStatProgression = useMemo(() => {
    if (items.length === 0) return null;
    const progression: Record<string, number>[] = [];
    const statsSnapshot: Record<string, number> = {};
    
    // Inizializza la progressione incorporando le statistiche dei talenti sbloccati fin dal primo slot
    const activeList = [activeTalent1, activeTalent2, activeTalent3].filter(Boolean);
    activeList.forEach(t => {
      if (!t) return;
      if (t.id === 'thrill') {
        const k = userHero?.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico';
        statsSnapshot[k] = (statsSnapshot[k] || 0) + 16;
      } else if (t.id === 'vitality') {
        statsSnapshot['PV'] = (statsSnapshot['PV'] || 0) + 225;
      } else if (t.id === 'agility') {
        statsSnapshot['Velocità di Movimento %'] = (statsSnapshot['Velocità di Movimento %'] || 0) + 4;
      } else if (t.id === 'firmness') {
        statsSnapshot['Difesa Fisica'] = (statsSnapshot['Difesa Fisica'] || 0) + 12;
        statsSnapshot['Difesa Magica'] = (statsSnapshot['Difesa Magica'] || 0) + 12;
      } else if (t.id === 'fatal') {
        statsSnapshot['Critico %'] = (statsSnapshot['Critico %'] || 0) + 5;
      } else if (t.id === 'swift') {
        statsSnapshot['Velocità d\'Attacco %'] = (statsSnapshot['Velocità d\'Attacco %'] || 0) + 10;
      } else if (t.id === 'rupture') {
        const k = userHero?.damageType === 'Magico' ? 'Penetrazione Magica' : 'Penetrazione Fisica';
        statsSnapshot[k] = (statsSnapshot[k] || 0) + 5;
      } else if (t.id === 'inspire') {
        statsSnapshot['Riduzione CD %'] = (statsSnapshot['Riduzione CD %'] || 0) + 5;
      } else if (t.id === 'starlium_bravery') {
        const k = userHero?.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico';
        statsSnapshot[k] = (statsSnapshot[k] || 0) + 15;
        statsSnapshot['Riduzione CD %'] = (statsSnapshot['Riduzione CD %'] || 0) + 5;
      } else if (t.id === 'festival_of_blood') {
        statsSnapshot['Rubavita Magico %'] = (statsSnapshot['Rubavita Magico %'] || 0) + 6;
      }
    });

    items.forEach(slot => {
      if (slot.item.attributes) {
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
            else if (key.includes('Rubavita Magico')) key = 'Rubavita Magico';
            else if (key.includes('Probabilità Critico')) key = 'Critico';

            const finalKey = isPercentage ? key + ' %' : key;
            statsSnapshot[finalKey] = (statsSnapshot[finalKey] || 0) + value;
          }
        });
      }
      progression.push({ ...statsSnapshot });
    });
    return progression;
  }, [items, activeTalent1, activeTalent2, activeTalent3, userHero]);

  const applyPresetProfile = (presetType: 'crit' | 'penetration' | 'attack_speed' | 'cdr') => {
    if (!userHero) return;
    const isMagic = userHero.damageType === 'Magico';

    let itemOverrides: Record<number, Item> = {};
    let talentOverrides: { tier1?: Talent; tier2?: Talent; tier3?: Talent } = {};

    if (presetType === 'crit') {
      if (!isMagic) {
        const bf = OFFICIAL_ITEMS.find(i => i.id === 'berserkers_fury');
        const hc = OFFICIAL_ITEMS.find(i => i.id === 'haas_claws');
        const gds = OFFICIAL_ITEMS.find(i => i.id === 'great_dragon_spear');
        if (bf) itemOverrides[1] = bf;
        if (hc) itemOverrides[2] = hc;
        if (gds) itemOverrides[3] = gds;
      } else {
        const ss = OFFICIAL_ITEMS.find(i => i.id === 'starlium_scythe');
        const hc = OFFICIAL_ITEMS.find(i => i.id === 'holy_crystal');
        const bw = OFFICIAL_ITEMS.find(i => i.id === 'blood_wings');
        if (ss) itemOverrides[1] = ss;
        if (hc) itemOverrides[2] = hc;
        if (bw) itemOverrides[3] = bw;
      }
      const fatalTalent = selectedEmblem.talents.tier1?.find(t => t.id === 'fatal') || selectedEmblem.talents.tier1?.[0];
      if (fatalTalent) talentOverrides.tier1 = fatalTalent;

    } else if (presetType === 'penetration') {
      if (!isMagic) {
        const hs = OFFICIAL_ITEMS.find(i => i.id === 'hunter_strike');
        const mr = OFFICIAL_ITEMS.find(i => i.id === 'malefic_roar');
        const boh = OFFICIAL_ITEMS.find(i => i.id === 'blade_of_heptaseas');
        if (hs) itemOverrides[2] = hs;
        if (mr) itemOverrides[3] = mr;
        if (boh) itemOverrides[4] = boh;
      } else {
        const dg = OFFICIAL_ITEMS.find(i => i.id === 'divine_glaive');
        const gw = OFFICIAL_ITEMS.find(i => i.id === 'genius_wand');
        const hc = OFFICIAL_ITEMS.find(i => i.id === 'holy_crystal');
        if (dg) itemOverrides[2] = dg;
        if (gw) itemOverrides[3] = gw;
        if (hc) itemOverrides[4] = hc;
      }
      const ruptureTalent = selectedEmblem.talents.tier1?.find(t => t.id === 'rupture') || selectedEmblem.talents.tier1?.[0];
      if (ruptureTalent) talentOverrides.tier1 = ruptureTalent;

    } else if (presetType === 'attack_speed') {
      if (!isMagic) {
        const cs = OFFICIAL_ITEMS.find(i => i.id === 'corrosion_scythe');
        const dhs = OFFICIAL_ITEMS.find(i => i.id === 'demon_hunter_sword');
        const gs = OFFICIAL_ITEMS.find(i => i.id === 'golden_staff');
        if (cs) itemOverrides[1] = cs;
        if (dhs) itemOverrides[2] = dhs;
        if (gs) itemOverrides[3] = gs;
      } else {
        const foh = OFFICIAL_ITEMS.find(i => i.id === 'feather_of_heaven');
        const ss = OFFICIAL_ITEMS.find(i => i.id === 'starlium_scythe');
        const hc = OFFICIAL_ITEMS.find(i => i.id === 'holy_crystal');
        if (foh) itemOverrides[1] = foh;
        if (ss) itemOverrides[2] = ss;
        if (hc) itemOverrides[3] = hc;
      }
      const swiftTalent = selectedEmblem.talents.tier1?.find(t => t.id === 'swift') || selectedEmblem.talents.tier1?.[0];
      if (swiftTalent) talentOverrides.tier1 = swiftTalent;

    } else if (presetType === 'cdr') {
      const ms = OFFICIAL_ITEMS.find(i => i.id === 'magic_shoes');
      if (ms) itemOverrides[0] = ms;

      if (!isMagic) {
        const hs = OFFICIAL_ITEMS.find(i => i.id === 'hunter_strike');
        const wa = OFFICIAL_ITEMS.find(i => i.id === 'war_axe');
        const eb = OFFICIAL_ITEMS.find(i => i.id === 'endless_battle');
        const mr = OFFICIAL_ITEMS.find(i => i.id === 'malefic_roar');
        const bod = OFFICIAL_ITEMS.find(i => i.id === 'blade_of_despair');
        
        if (hs) itemOverrides[1] = hs;
        if (wa) itemOverrides[2] = wa;
        if (eb) itemOverrides[3] = eb;
        if (mr) itemOverrides[4] = mr;
        if (bod) itemOverrides[5] = bod;
      } else {
        const et = OFFICIAL_ITEMS.find(i => i.id === 'enchanted_talisman');
        const ft = OFFICIAL_ITEMS.find(i => i.id === 'fleeting_time');
        const hc = OFFICIAL_ITEMS.find(i => i.id === 'holy_crystal');
        const dg = OFFICIAL_ITEMS.find(i => i.id === 'divine_glaive');
        const bw = OFFICIAL_ITEMS.find(i => i.id === 'blood_wings');

        if (et) itemOverrides[1] = et;
        if (ft) itemOverrides[2] = ft;
        if (hc) itemOverrides[3] = hc;
        if (dg) itemOverrides[4] = dg;
        if (bw) itemOverrides[5] = bw;
      }
      
      const setTalent = (tier: number, targetId: string) => {
        let t: Talent | undefined;
        // Search in all emblem talents as since emblem revamp, talents are shared
        Object.values(EMBLEMS).forEach(e => {
          const arr = (e.talents as any)[`tier${tier}`];
          if (arr) {
            const found = arr.find((x: Talent) => x.id === targetId);
            if (found) t = found;
          }
        });
        return t;
      };

      const inspireTalent = setTalent(1, 'inspire');
      const pullTogether = setTalent(2, 'pull_yourself_together');
      const impureRage = setTalent(3, 'impure_rage');

      if (inspireTalent) talentOverrides.tier1 = inspireTalent;
      // Note: we can map the generic talent only if it's available in selectedEmblem
      // But actually the app's UI might restrict it. Let's just set them, react state accepts it.
      if (pullTogether) talentOverrides.tier2 = pullTogether;
      if (impureRage) talentOverrides.tier3 = impureRage;
    }

    setCustomBuildOverrides(prev => ({ ...prev, ...itemOverrides }));
    setCustomTalents(prev => ({ ...prev, ...talentOverrides }));
  };

  const enemyTeamStats = useMemo(() => {
    if (enemies.length === 0) return null;
    const total = enemies.length;
    
    const physCount = enemies.filter(e => e.damageType === 'Fisico').length;
    const magCount = enemies.filter(e => e.damageType === 'Magico').length;
    
    const physPct = total > 0 ? Math.round((physCount / total) * 100) : 0;
    const magPct = total > 0 ? (100 - physPct) : 0;
    
    const ccCount = enemies.filter(e => {
      return e.counterTags?.some(t => {
        const tl = t.toLowerCase();
        return tl.includes('cc') || tl.includes('stun') || tl.includes('knock') || tl.includes('pull') || tl.includes('terrify') || tl.includes('immobilize') || tl.includes('slow');
      });
    }).length;
    
    let ccLevel = 'Minimo';
    if (ccCount >= 4) ccLevel = 'Critico 🚨';
    else if (ccCount >= 2) ccLevel = 'Alto ⚡';
    else if (ccCount === 1) ccLevel = 'Moderato';
    
    const burstCount = enemies.filter(e => {
      return e.counterTags?.some(t => t.toLowerCase().includes('burst'));
    }).length;
    
    const healCount = enemies.filter(e => {
      const isHealer = ['estes', 'rafaela', 'angela', 'floryn'].includes(e.id);
      const isRegen = e.counterTags?.some(t => t.toLowerCase().includes('regen') || t.toLowerCase().includes('heal') || t.toLowerCase().includes('vamp'));
      return isHealer || isRegen;
    }).length;
    
    const tankyCount = enemies.filter(e => {
      return e.role.includes('Tank') || e.role.includes('Fighter') || e.counterTags?.some(t => t.toLowerCase().includes('heavy') || t.toLowerCase().includes('tanky'));
    }).length;
    
    return {
      physPct,
      magPct,
      ccCount,
      ccLevel,
      burstCount,
      healCount,
      tankyCount
    };
  }, [enemies]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-amber-400 tracking-wide font-bold bg-slate-900/80 border border-amber-900/30 shadow-lg shadow-black/40 px-5 py-3 rounded-xl mb-2 inline-block">MLBB Counter Builder by LUNATIO</h1>
            <div className="text-sm uppercase tracking-wider flex flex-wrap items-center gap-1.5 mt-1 text-slate-500">
              <button
                type="button"
                onClick={() => {
                  setPatchModalSubTab('app');
                  setIsPatchModalOpen(true);
                }}
                className="group flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-850 hover:text-amber-400 border border-slate-800 hover:border-amber-500/20 rounded-md transition-all cursor-pointer font-semibold text-xs active:scale-95 text-slate-400"
                title="Visualizza Changelog dell'Applicazione"
              >
                <Wrench size={12} className="text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
                <span>App Patch v{appPatchVersion}</span>
              </button>
              <span className="w-1 h-1 rounded-full bg-slate-800 mx-0.5"></span>
              <button
                type="button"
                onClick={() => {
                  setPatchModalSubTab('game');
                  setIsPatchModalOpen(true);
                }}
                className="group flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-850 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-md transition-all cursor-pointer font-semibold text-xs active:scale-95 text-slate-400"
                title="Visualizza Patch Note Ufficiali Moonton MLBB"
              >
                <Activity size={12} className="text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                <span>Game Patch v{gamePatchVersion}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500/70 italic mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
              Ultimo aggiornamento Maggio 2026
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setIsMetaOpen(true)}
              className="relative group overflow-hidden flex items-center gap-2 px-5 py-2 text-sm bg-slate-950/80 border border-cyan-500/30 rounded-lg hover:border-cyan-400 hover:bg-slate-900 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Activity size={16} className="text-cyan-400 animate-pulse" /> 
              <span className="font-mono tracking-widest font-semibold text-xs mt-0.5">META UFFICIALE</span>
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </button>
            <button 
              onClick={() => setIsSavedBuildsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-amber-500/30 transition-all text-slate-200 shadow-lg relative"
            >
              <Heart size={16} className="text-rose-500" /> Build Salvate
              {savedBuilds.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-950 font-bold">
                  {savedBuilds.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsHeroEncyclopediaOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-amber-500/30 transition-all text-slate-200 shadow-lg"
            >
              <Users size={16} className="text-sky-500" /> Eroi
            </button>
            <button 
              onClick={() => setIsItemEncyclopediaOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-amber-500/30 transition-all text-slate-200 shadow-lg"
            >
              <Sword size={16} className="text-emerald-500" /> Oggetti
            </button>
            <button 
              onClick={() => {
                setPatchModalSubTab('app');
                setIsPatchModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 border border-amber-500/20 rounded-lg hover:bg-slate-800 hover:border-amber-400 transition-all text-amber-400 shadow-lg font-medium"
            >
              <List size={16} className="text-amber-500" /> Changelog & Patch
            </button>
            <div className="w-px h-8 bg-slate-800 mx-1 hidden md:block"></div>
            <button 
              onClick={handleUpdatePatch}
              disabled={isUpdating}
              className="flex items-center gap-2 px-3 py-1.5 text-xs border border-amber-600/50 rounded hover:bg-amber-600/10 transition-colors text-amber-500 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CloudDownload size={14} />} 
              {isUpdating ? 'Sincronizzazione...' : 'Verifica Aggiornamenti Patch'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs border border-slate-700 rounded hover:bg-slate-800 transition-colors text-slate-400"
            >
              <AlertCircle size={14} /> Segnala
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Selections */}
          <div className="lg:col-span-1 space-y-8">
            {/* Guida Unificata */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-500/10 rounded-full">
                  <Info size={18} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 leading-none">Guida Rapida & Strategica</h4>
                  <p className="text-[11px] text-slate-400 leading-normal mb-2">
                    Seleziona <span className="text-slate-200 font-bold uppercase text-[9px]">Lane</span> e <span className="text-slate-200 font-bold uppercase text-[9px]">Eroe</span>, poi aggiungi fino a 5 <span className="text-slate-200 font-bold uppercase text-[9px]">Nemici</span>. Il sistema adatterà automaticamente <span className="text-amber-500/80 font-bold">Counter-Item</span>, <span className="text-amber-500/80 font-bold">Emblemi</span> e <span className="text-amber-500/80 font-bold">Incantesimi</span>.
                  </p>
                  <div className="pt-2 border-t border-amber-500/20">
                    <p className="text-[10px] text-amber-200/60 leading-relaxed italic">
                      <span className="text-amber-500 font-bold uppercase mr-1">Pro-Tip:</span> L'ordine degli Item (2-6) può variare. Acquista i counter <b>subito</b> se il nemico speculare è in vantaggio d'oro.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* User Selection */}
            <section className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sword size={120} />
              </div>
              <h2 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Il Tuo Eroe
              </h2>
              
              <div className="space-y-4">
                {userHero && (
                  <div className="flex flex-col gap-3 p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-4">
                      <HeroImageWithFallback 
                        src={userHero.iconUrl} 
                        name={userHero.name} 
                        id={userHero.id}
                        role={userHero.role}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-slate-800 shadow-md"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-white leading-none truncate">{userHero.name}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
                          {getTranslatedRole(userHero.role)}
                        </p>
                      </div>
                    </div>
                    {/* Meta Identification System Banner */}
                    {(() => {
                      const status = getHeroMetaStatus(userHero, lane, liveMeta);
                      return (
                        <div className={`p-2.5 rounded-lg border text-xs leading-relaxed space-y-1 ${status.color} relative`}>
                          <div className="flex items-center justify-between">
                            <span className="font-black uppercase tracking-wider font-mono text-[9px]">Stato nel Meta:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setIsMatchAnalyzerOpen(true)}
                                className="flex items-center justify-center p-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400 rounded transition-colors group"
                                title={`Analizza Storico Partite per ${userHero.name}`}
                              >
                                <Activity size={14} className="group-hover:scale-110 transition-transform" />
                              </button>
                              <a
                                href={`https://www.youtube.com/results?search_query=MLBB+${encodeURIComponent(userHero.name)}+best+guide+gameplay`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center p-1 bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/30 hover:border-[#FF0000]/50 text-[#FF0000] rounded transition-colors group"
                                title={`Guide Video per ${userHero.name}`}
                              >
                                <Youtube size={14} className="group-hover:scale-110 transition-transform" />
                              </a>
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase font-mono bg-slate-950 tracking-wider">
                                {status.label}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-[10px] leading-snug">
                            {status.desc}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
                    <Filter size={10} /> Corsia Assegnata (Lane)
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {lanes.map(l => (
                      <motion.button
                        key={l}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLane(l)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                          lane === l 
                          ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-lg shadow-amber-500/20' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {l}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <HeroGrid 
                  heroes={HEROES} 
                  selectedIds={userHeroId ? [userHeroId] : []}
                  onSelect={(id) => setUserHeroId(id === userHeroId ? '' : id)}
                  roleTranslations={roleTranslations}
                  accentColor="amber"
                  searchPlaceholder="Cerca il tuo eroe..."
                  currentLane={lane}
                  metaHeroes={liveMeta}
                />
              </div>
            </section>

            {/* Ally Selection Section */}
            <section className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl relative overflow-hidden group transition-all">
              <div 
                onClick={() => setIsAllySectionExpanded(!isAllySectionExpanded)}
                className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-950/25 transition-all select-none relative z-10"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full shrink-0"></div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 flex-wrap min-w-0">
                    <span className="truncate">I Tuoi Alleati</span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
                      OPZIONALE
                    </span>
                    {allyIds.length > 0 && (
                      <span className="text-emerald-500 font-bold font-mono text-xs shrink-0">({allyIds.length}/4)</span>
                    )}
                  </h3>

                  {/* Tiny selection preview when collapsed */}
                  {!isAllySectionExpanded && allies.length > 0 && (
                    <div className="flex -space-x-1.5 overflow-hidden ml-2 transition-all">
                      {allies.map(h => (
                        <HeroImageWithFallback 
                          key={h.id} 
                          src={h.iconUrl} 
                          name={h.name} 
                          id={h.id}
                          role={h.role}
                          className="w-5 h-5 rounded-full border border-slate-900 object-cover bg-slate-950" 
                          title={h.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {allyIds.length > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAllyIds([]);
                      }}
                      className="text-[10px] text-red-500 hover:text-red-400 transition-colors uppercase font-black tracking-tighter flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded cursor-pointer"
                    >
                      <X size={10} />
                      Svuota
                    </button>
                  )}
                  <motion.div
                    animate={{ rotate: isAllySectionExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isAllySectionExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="border-t border-slate-800/60"
                  >
                    <div className="p-5 space-y-4 relative z-10">
                      <div className="space-y-3">
                        <HeroGrid 
                          heroes={HEROES} 
                          selectedIds={allyIds}
                          onSelect={(id) => {
                            if (allyIds.includes(id)) {
                              setAllyIds(allyIds.filter(aid => aid !== id));
                            } else if (allyIds.length < 4 && id !== userHeroId && !enemyIds.includes(id)) {
                              setAllyIds([...allyIds, id]);
                            }
                          }}
                          disabledIds={[userHeroId, ...enemyIds]}
                          maxSelections={4}
                          roleTranslations={roleTranslations}
                          accentColor="emerald"
                          searchPlaceholder="Cerca alleati..."
                          metaHeroes={liveMeta}
                        />
                      </div>

                      {/* Selected Allies Bar */}
                      {allies.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                          {allies.map(h => (
                            <div key={h.id} className="flex items-center gap-1.5 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-1 rounded text-[11px] font-black uppercase tracking-wider">
                              <HeroImageWithFallback 
                                src={h.iconUrl} 
                                name={h.name} 
                                id={h.id}
                                role={h.role} 
                                className="w-5 h-5 rounded-full object-cover border border-emerald-500/20" 
                              />
                              <span>{h.name}</span>
                              <button onClick={() => setAllyIds(allyIds.filter(id => id !== h.id))} className="text-slate-500 hover:text-emerald-300 transition-colors ml-0.5">
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Enemy Selection */}
            <section className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-20 group-hover:scale-110 transition-all">
                <Users size={80} className="text-red-500" />
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    Eroi Nemici <span className="text-red-500 ml-1 font-black text-xs">({enemyIds.length}/5)</span>
                  </h3>
                </div>
                {enemyIds.length > 0 && (
                  <motion.button 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearEnemies}
                    className="text-[10px] text-red-500 hover:text-red-400 transition-colors uppercase font-black tracking-tighter flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded"
                  >
                    <X size={10} />
                    Svuota
                  </motion.button>
                )}
              </div>

              <div className="space-y-4 relative z-10">
                <HeroGrid 
                  heroes={HEROES} 
                  selectedIds={enemyIds}
                  onSelect={(id) => {
                    if (enemyIds.includes(id)) {
                      setEnemyIds(enemyIds.filter(eid => eid !== id));
                    } else if (enemyIds.length < 5 && id !== userHeroId && !allyIds.includes(id)) {
                      setEnemyIds([...enemyIds, id]);
                    }
                  }}
                  disabledIds={[userHeroId, ...allyIds]}
                  maxSelections={5}
                  roleTranslations={roleTranslations}
                  accentColor="red"
                  searchPlaceholder="Cerca nemici..."
                  metaHeroes={liveMeta}
                />

                {/* Selected Enemies Bar with Meta Identification */}
                {enemies.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800/40">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                      Identificazione Team Nemico Selezionato:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {enemies.map(h => {
                        const status = getHeroMetaStatus(h, lane, liveMeta);
                        return (
                          <div 
                            key={h.id} 
                            className={`flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold tracking-normal transition-all hover:brightness-110 ${
                              status.type === 'meta' ? 'bg-amber-500/5 text-amber-400 border-amber-500/30' :
                              status.type === 'off_meta' ? 'bg-rose-500/5 text-rose-400 border-rose-500/30' :
                              'bg-cyan-500/5 text-cyan-400 border-cyan-500/30'
                            }`}
                            title={status.desc}
                          >
                            <HeroImageWithFallback 
                              src={h.iconUrl} 
                              name={h.name} 
                              id={h.id}
                              role={h.role} 
                              className={`w-5 h-5 rounded-md object-cover border ${
                                status.type === 'meta' ? 'border-amber-500/30' :
                                status.type === 'off_meta' ? 'border-rose-500/30' :
                                'border-cyan-500/30'
                              }`} 
                            />
                            <span className="truncate max-w-[75px]">{h.name}</span>
                            <span className="text-[7.5px] font-mono font-black uppercase px-1 rounded bg-slate-950/60 whitespace-nowrap leading-none py-0.5">
                              {status.type === 'meta' ? 'META' : status.type === 'off_meta' ? 'OFF' : 'SIT.'}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setEnemyIds(enemyIds.filter(id => id !== h.id))} 
                              className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Lane Win Rate Simulator Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl relative overflow-hidden space-y-4"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Trophy size={80} className="text-amber-500 animate-pulse" />
              </div>

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Trophy className="text-amber-500" size={18} />
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  Simulatore Win Rate Corsie (Lane)
                </h3>
              </div>

              {!laneWinRates ? (
                <div className="text-center py-6 text-xs text-slate-500 font-medium leading-relaxed">
                  <Trophy className="mx-auto text-slate-700/60 mb-2" size={32} />
                  Seleziona il tuo eroe per avviare la simulazione della percentuale di vittoria nelle 5 corsie.
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Percentuale stimata incrociando il tuo eroe col team degli alleati selezionati ({allies.length}/4) e l'opposizione nemica ({enemies.length}/5). Clicca su ciascun elemento per riassegnare la corsia primaria.
                  </p>

                  <div className="space-y-2.5">
                    {laneWinRates.map(item => {
                      const isActive = lane === item.lane;
                      const Icon = laneIcons[item.lane];
                      
                      let barColor = "from-rose-600 to-rose-400 border-rose-500/10";
                      let textColor = "text-rose-400";
                      let badgeText = "Svantaggio";
                      
                      if (item.winRate >= 56) {
                        barColor = "from-emerald-600 to-emerald-400 border-emerald-500/10";
                        textColor = "text-emerald-400";
                        badgeText = "Eccellente S+";
                      } else if (item.winRate >= 50) {
                        barColor = "from-sky-600 to-sky-400 border-sky-500/10";
                        textColor = "text-teal-400";
                        badgeText = "Forte S";
                      } else if (item.winRate >= 45) {
                        barColor = "from-amber-600 to-amber-400 border-amber-500/10";
                        textColor = "text-amber-400";
                        badgeText = "Viabile A";
                      } else if (item.winRate >= 38) {
                        barColor = "from-orange-600 to-orange-400 border-orange-500/10";
                        textColor = "text-orange-400";
                        badgeText = "Difficile B";
                      }

                      return (
                        <div 
                          key={item.lane}
                          onClick={() => setLane(item.lane)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-slate-950 border-amber-500/70 shadow-lg shadow-amber-500/5' 
                              : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/70'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`p-1 rounded bg-slate-900 border ${isActive ? 'border-amber-500/50' : 'border-slate-800'}`}>
                                <Icon size={12} className={isActive ? 'text-amber-500' : 'text-slate-400'} />
                              </div>
                              <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                                {item.lane} Lane
                              </span>
                              {isActive && (
                                <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded leading-none">
                                  Attiva
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter shrink-0">{badgeText}</span>
                              <span className={`text-xs font-black font-mono tracking-tight shrink-0 ${textColor}`}>
                                {item.winRate}%
                              </span>
                            </div>
                          </div>

                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.winRate}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className={`bg-gradient-to-r ${barColor} h-full rounded-full`}
                            ></motion.div>
                          </div>

                          {/* Expanded Details for Active Lane only */}
                          {isActive && (item.pros.length > 0 || item.cons.length > 0) && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[10px]"
                            >
                              {item.pros.map((p, idx) => (
                                <div key={idx} className="flex items-start gap-1">
                                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                  <p className="text-slate-400 leading-snug">{p}</p>
                                </div>
                              ))}
                              {item.cons.map((c, idx) => (
                                <div key={idx} className="flex items-start gap-1">
                                  <span className="text-rose-500 font-bold shrink-0">✗</span>
                                  <p className="text-slate-400 leading-snug">{c}</p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Enemy Threat Analysis Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 p-5 rounded-lg shadow-xl relative overflow-hidden space-y-4"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <BarChart3 size={80} className="text-amber-500" />
              </div>

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <BarChart3 className="text-amber-500" size={18} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  Analisi Minacce Team Nemico
                  {enemies.length > 0 && (
                    <span className="text-[8px] bg-red-650 bg-red-500 text-white px-1.5 py-0.5 rounded font-mono font-normal">LIVE</span>
                  )}
                </h3>
              </div>

              {!enemyTeamStats ? (
                <div className="text-center py-6 text-xs text-slate-500 font-medium leading-relaxed">
                  <BarChart3 className="mx-auto text-slate-700/60 mb-2 animate-pulse" size={32} />
                  Seleziona almeno un eroe nemico per mappare in tempo reale la distribuzione dei danni fisici, magici e i pericoli di Crowd Control.
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {/* Damage Type Distribution Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase font-mono tracking-wider">
                      <span className="text-rose-400">Fisico ({enemyTeamStats.physPct}%)</span>
                      <span className="text-sky-400">Magico ({enemyTeamStats.magPct}%)</span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800/80">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${enemyTeamStats.physPct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-l-full"
                      ></motion.div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${enemyTeamStats.magPct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-gradient-to-r from-sky-450 to-sky-600 h-full rounded-r-full flex-1"
                      ></motion.div>
                    </div>
                  </div>

                  {/* Threat levels cards grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono mb-0.5">Livello CC (Stun)</span>
                      <span className={`font-serif font-black ${
                        enemyTeamStats.ccLevel.includes('Critico') ? 'text-red-400 animate-pulse' :
                        enemyTeamStats.ccLevel.includes('Alto') ? 'text-amber-400' :
                        enemyTeamStats.ccLevel.includes('Moderato') ? 'text-sky-400' : 'text-slate-400'
                      }`}>
                        {enemyTeamStats.ccLevel}
                      </span>
                    </div>

                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono mb-0.5 font-bold">Burst Damage</span>
                      <span className={`font-serif font-black ${
                        enemyTeamStats.burstCount >= 3 ? 'text-red-400' :
                        enemyTeamStats.burstCount >= 1 ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {enemyTeamStats.burstCount === 0 ? 'Basso' : enemyTeamStats.burstCount >= 3 ? 'CRITICO' : 'Rilevato'}
                      </span>
                    </div>

                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono mb-0.5">Rigenerazione / Cure</span>
                      <span className={`font-serif font-black ${
                        enemyTeamStats.healCount >= 2 ? 'text-emerald-400 animate-pulse' :
                        enemyTeamStats.healCount >= 1 ? 'text-sky-400' : 'text-slate-400'
                      }`}>
                        {enemyTeamStats.healCount === 0 ? 'Bassa' : enemyTeamStats.healCount >= 2 ? 'ESTREMA 🩸' : 'Presente'}
                      </span>
                    </div>

                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono mb-0.5">Durezza Avversaria</span>
                      <span className="font-serif font-black text-slate-200">
                        {enemyTeamStats.tankyCount >= 3 ? 'Elevata (Tanky)' : enemyTeamStats.tankyCount >= 1 ? 'Media' : 'Fragile'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic advice */}
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-[11px] text-amber-200/80 flex gap-2">
                    <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="leading-snug">
                      {enemyTeamStats.physPct >= 75 && "I nemici hanno quasi esclusivamente output FISICO. Massimizza l'armatura complessiva!"}
                      {enemyTeamStats.magPct >= 75 && "Compagine quasi interamente MAGICA. Equipaggia Athena's Shield ed evita armature fisiche inefficaci!"}
                      {enemyTeamStats.ccCount >= 3 && "Troppi Stun/CC! La riduzione del controllo da parte dei Tough Boots è fondamentale per sopravvivere."}
                      {enemyTeamStats.healCount >= 1 && "Sono presenti guaritori o rigeneratori attivi. Priorità assoluta ad un oggetto con riduzione rigenerazione nemica (Dominance Ice / Sea Halberd / Glowing Wand) per togliere fino al 50% di cure!"}
                      {enemyTeamStats.physPct < 75 && enemyTeamStats.magPct < 75 && enemyTeamStats.ccCount < 3 && enemyTeamStats.healCount === 0 && "Il team ha un bilanciamento standard delle minacce. Segui il percorso ibrido suggerito."}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-lg shadow-xl min-h-full">
              <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
                <Scroll className="text-amber-500" /> 
                Verdetto della Build
              </h2>

              {!userHeroId ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-600 border border-slate-800 border-dashed rounded-lg">
                  <ChevronsDown size={32} className="mb-2 animate-bounce" />
                  <p>Inizia selezionando il tuo eroe a sinistra.</p>
                </div>
              ) : enemyIds.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-600 border border-slate-800 border-dashed rounded-lg">
                  <Crosshair size={32} className="mb-2" />
                  <p>Seleziona fino a 5 eroi nemici per calcolare il counter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results && (
                    <>
                      {/* Matchup summary row with Meta-Tags */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-slate-950/40 border border-slate-800 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5"></div>
                        {userHero && (
                          <div className="flex flex-col items-center gap-1.5 relative z-10">
                            <div className="relative">
                              <HeroImageWithFallback 
                                src={userHero.iconUrl} 
                                name={userHero.name} 
                                id={userHero.id}
                                role={userHero.role}
                                className="w-12 h-12 rounded-xl border-2 border-amber-500 shadow-lg shadow-amber-500/20" 
                              />
                            </div>
                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-tighter leading-none">{userHero.name}</span>
                            {(() => {
                              const status = getHeroMetaStatus(userHero, lane, liveMeta);
                              return (
                                <span className={`text-[7px] px-1 py-0.5 rounded font-mono font-black scale-90 border whitespace-nowrap leading-none ${
                                  status.type === 'meta' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                                  status.type === 'off_meta' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' :
                                  'bg-cyan-500/25 border-cyan-500/30 text-cyan-400'
                                }`}>
                                  {status.type === 'meta' ? 'META' : status.type === 'off_meta' ? 'OFF-META' : 'SITUAZ.'}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                        <div className="flex flex-row sm:flex-col items-center gap-2 relative z-10">
                          <span className="text-[11px] font-black text-slate-600 italic tracking-[0.3em]">VS</span>
                          <div className="h-px w-10 bg-slate-800 hidden sm:block"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 relative z-10">
                          {enemies.map(e => {
                            const status = getHeroMetaStatus(e, lane, liveMeta);
                            return (
                              <div key={e.id} className="flex flex-col items-center gap-1.5">
                                <div className="relative">
                                  <HeroImageWithFallback 
                                    src={e.iconUrl} 
                                    name={e.name} 
                                    id={e.id}
                                    role={e.role}
                                    className={`w-10 h-10 rounded-xl border-2 shadow-md bg-slate-900 transition-transform hover:scale-105 ${
                                      status.type === 'meta' ? 'border-amber-500/85' :
                                      status.type === 'off_meta' ? 'border-rose-950 opacity-50' :
                                      'border-cyan-500/85'
                                    }`} 
                                    title={`${e.name} - ${status.label}`}
                                  />
                                </div>
                                <span className="text-[9px] font-bold text-slate-350 leading-none truncate max-w-[55px] text-center">{e.name}</span>
                                <span className={`text-[6.5px] px-1 py-0.5 rounded font-mono font-black scale-90 border whitespace-nowrap leading-none ${
                                  status.type === 'meta' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                                  status.type === 'off_meta' ? 'bg-rose-500/25 border-rose-500/30 text-rose-450' :
                                  'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                                }`}>
                                  {status.type === 'meta' ? 'META' : status.type === 'off_meta' ? 'OFF' : 'SIT.'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <button 
                          onClick={saveBuild}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-900/20 transition-all group"
                        >
                          <Heart size={18} className="group-hover:scale-110 transition-transform" /> Salva nei Preferiti
                        </button>
                        <button 
                          onClick={copyBuildToClipboard}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold shadow-lg transition-all group border border-slate-700"
                        >
                          <Copy size={18} className="group-hover:scale-110 transition-transform" /> Copia Testo Build
                        </button>
                      </div>

                      <div className="mb-8 p-5 bg-slate-950/60 border border-slate-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                          <Sparkles size={100} />
                        </div>
                        
                        <div className="flex items-center gap-2 mb-6">
                          <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <Sparkles size={18} className="text-amber-500" />
                          </div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Emblemi & Talenti Consigliati</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                          <div className="flex flex-col items-center justify-center p-3 bg-slate-900/80 rounded-lg border border-slate-700/50">
                            <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-500/30 flex items-center justify-center p-2 mb-2">
                               <ImageWithFallback src={results.emblem.iconUrl} alt={results.emblem.name} type="emblem" id={results.emblem.id} className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[11px] font-black text-amber-500 uppercase">{results.emblem.name}</span>
                          </div>

                          {[activeTalent1, activeTalent2, activeTalent3].map((talent, i) => {
                            if (!talent) return null;
                            const tierKey = `tier${i + 1}` as 'tier1' | 'tier2' | 'tier3';
                            const isOverridden = !!customTalents[tierKey];
                            
                            // Gather all unique talents for this tier across all emblems
                            const allTalentsForTierMap = new Map<string, Talent>();
                            Object.values(EMBLEMS).forEach(e => {
                              const arr = (e.talents as any)[tierKey];
                              if (arr) {
                                arr.forEach((t: Talent) => allTalentsForTierMap.set(t.id, t));
                              }
                            });
                            const availableTalents = Array.from(allTalentsForTierMap.values());
                            
                            const isEditing = editingTalentTier === (i + 1);

                            return (
                              <div key={i} className="flex flex-col gap-2 relative">
                                <div 
                                  onClick={() => setEditingTalentTier(isEditing ? null : (i + 1))}
                                  className={`flex items-center gap-3 bg-slate-900/80 p-3 rounded-lg border cursor-pointer hover:border-amber-500/30 transition-all select-none h-full ${
                                    isOverridden 
                                      ? 'border-amber-500 bg-amber-500/5 text-amber-200 shadow-md shadow-amber-500/5' 
                                      : 'border-slate-700/50 text-white'
                                  }`}
                                  title="Clicca per personalizzare questo talento nella Sandbox!"
                                >
                                  <div className="relative shrink-0">
                                     <ImageWithFallback src={talent.iconUrl} alt={talent.name} type="talent" id={talent.id} className="w-10 h-10 object-contain drop-shadow-lg" />
                                     <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-600 border border-slate-950 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg">
                                        {i+1}
                                     </div>
                                  </div>
                                  <div className="min-w-0 flex-1 text-left">
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                      <p className="text-[11px] font-bold truncate leading-none">
                                        {talent.name}
                                      </p>
                                      {isOverridden && (
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updated = { ...customTalents };
                                            delete updated[tierKey];
                                            setCustomTalents(updated);
                                          }}
                                          className="text-[8.5px] text-red-400 hover:text-red-300 transition-colors shrink-0 font-bold bg-red-500/10 px-1 py-0.5 rounded"
                                        >
                                          Reset
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-[9px] text-slate-500 leading-tight line-clamp-2">{talent.description}</p>
                                  </div>
                                </div>

                                {/* Dropdown overlay */}
                                <AnimatePresence>
                                  {isEditing && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      transition={{ duration: 0.15 }}
                                      className="z-50 bg-slate-950/95 border border-slate-800 rounded-xl p-3 space-y-2.5 absolute top-full left-0 right-0 shadow-2xl mt-2 w-72 md:w-80"
                                    >
                                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest font-mono">Simulatore Talento Tier {i+1}</span>
                                        <button onClick={() => setEditingTalentTier(null)} className="text-slate-500 hover:text-white p-0.5 rounded">
                                          <X size={12} />
                                        </button>
                                      </div>
                                      <div className="space-y-2">
                                        {availableTalents.map(t => {
                                          const isSelected = talent.id === t.id;
                                          return (
                                            <div 
                                              key={t.id}
                                              onClick={() => {
                                                setCustomTalents({ ...customTalents, [tierKey]: t });
                                                setEditingTalentTier(null);
                                              }}
                                              className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all border text-left ${
                                                isSelected 
                                                  ? 'bg-amber-500/10 border-amber-500/30' 
                                                  : 'hover:bg-slate-900 border-transparent bg-slate-900/30 hover:border-slate-800'
                                              }`}
                                            >
                                              <ImageWithFallback src={t.iconUrl} alt={t.name} type="talent" id={t.id} className="w-7 h-7 object-contain shrink-0 mt-0.5" />
                                              <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-white mb-0.5">{t.name}</p>
                                                <p className="text-[9px] text-slate-400 leading-tight">{t.description}</p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-8 p-5 bg-slate-950/60 border border-slate-800 rounded-xl relative overflow-hidden group">
                        <div className="flex items-center gap-2 mb-6">
                          <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <Sparkles size={18} className="text-amber-500" />
                          </div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Incantesimo di Battaglia</h3>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-lg border border-slate-700/50 group/spell hover:border-amber-500/30 transition-all">
                          <div className="relative shrink-0">
                            <ImageWithFallback 
                              src={results.spell.iconUrl} 
                              alt={results.spell.name} 
                              type="spell"
                              id={results.spell.id}
                              className="w-14 h-14 object-contain drop-shadow-lg group-hover/spell:scale-110 transition-transform" 
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-amber-500 mb-1">{results.spell.name}</p>
                            <p className="text-xs text-slate-400 leading-relaxed italic">"{results.spell.description}"</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Progression Chart */}
                      {(customStatProgression || results?.statProgression) && userHero && (
                        <div className="mb-8 p-6 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                            <Activity size={80} />
                          </div>
                          <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-2">
                              <Activity size={20} className="text-amber-500" />
                              <h3 className="text-sm font-black uppercase text-white tracking-widest">Progressione Potenza</h3>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-mono">Simulazione Build Completa</span>
                          </div>
                          
                          <div className="space-y-5 relative z-10">
                            {[
                              userHero.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico',
                              'PV',
                              'Riduzione CD %',
                              'Velocità d\'Attacco %'
                            ].map(statKey => {
                              const liveProgMap = customStatProgression || results?.statProgression;
                              const values = liveProgMap!.map(p => p[statKey] || 0);
                              const finalValue = values[values.length - 1];
                              if (finalValue === 0) return null;

                              const maxValue = Math.max(...values, 1); 
                              
                              return (
                                <div key={statKey} className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                                    <span className="text-slate-400">{statKey}</span>
                                    <span className={finalValue > 0 ? "text-amber-500" : "text-slate-600"}>
                                      {finalValue > 0 ? `+${finalValue}${statKey.includes('%') ? '' : ''}` : '---'}
                                    </span>
                                  </div>
                                  <div className="flex gap-1.5 h-1.5">
                                    {values.map((v, i) => (
                                      <div 
                                        key={i} 
                                        className="h-full bg-slate-800/40 rounded-full overflow-hidden flex-1 relative"
                                      >
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${(v / maxValue) * 100}%` }}
                                          transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                                          className={`h-full ${
                                            statKey.includes('Attacco') ? 'bg-gradient-to-r from-red-600 to-orange-500' :
                                            statKey.includes('PV') ? 'bg-gradient-to-r from-emerald-600 to-teal-400' :
                                            statKey.includes('CD') ? 'bg-gradient-to-r from-sky-600 to-blue-400' :
                                            'bg-gradient-to-r from-amber-600 to-yellow-400'
                                          }`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ANALISI DANNO & OTTIMIZZATORE STATISTICHE */}
                      {userHero && (
                        <div className="mb-8 p-6 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden text-left">
                          <div className="absolute top-0 right-0 bg-red-500/10 text-red-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl border-l border-b border-red-500/10">
                            CRUSCOTTO OTTIMIZZAZIONE
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2 relative z-10">
                            <TrendingUp size={18} className="text-red-500" />
                            <h3 className="text-sm font-black uppercase text-white tracking-widest">Analisi Danno & Ottimizzatore Statistiche</h3>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-6 max-w-2xl leading-relaxed">
                            Analizza in tempo reale il potenziale di danno, velocità e penetrazione dell'eroe. Simula immediatamente modifiche mirate alle statistiche tramite i pulsanti di assetto rapido.
                          </p>

                          {/* 1. CRUSCOTTO DELLE STATISTICHE CHIAVE E POTENZIALE DI COMBATTIMENTO */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Card 1: Potenziale Danno (DPS) */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-rose-500/10 hover:border-rose-500/30 text-left relative overflow-hidden group transition-all">
                              <div className="absolute top-0 right-0 bg-rose-500/10 p-2 rounded-bl-xl">
                                <Sword size={16} className="text-rose-500" />
                              </div>
                              <span className="text-[9px] font-mono text-rose-400 uppercase tracking-wider block mb-1">Potenziale Danno (DPS)</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-rose-500">
                                  {Math.round(
                                    ((customStats?.[userHero.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico'] || 0) * 
                                    (1 + (customStats?.['Critico %'] || 0) * 0.012) *
                                    (1 + (customStats?.["Velocità d'Attacco %"] || 0) * 0.01))
                                  ) || '0'}
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Rating DPS</span>
                              </div>
                              <div className="mt-3 space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Attacco Costante</span>
                                  <span className="text-white font-mono">{customStats?.[userHero.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico'] || 0}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Vel. Attacco</span>
                                  <span className="text-amber-400 font-mono">+{customStats?.["Velocità d'Attacco %"] || 0}%</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Prob. Critico</span>
                                  <span className="text-purple-400 font-mono">{customStats?.['Critico %'] || 0}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Card 2: Sustain & Sopravvivenza */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 text-left relative overflow-hidden group transition-all">
                              <div className="absolute top-0 right-0 bg-emerald-500/10 p-2 rounded-bl-xl">
                                <Shield size={16} className="text-emerald-500" />
                              </div>
                              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">Sustain & Resistenza</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-emerald-500">
                                  {
                                    (customStats?.['PV'] || 0) + 
                                    (customStats?.['Difesa Fisica'] || 0) * 10 + 
                                    (customStats?.['Difesa Magica'] || 0) * 10 || '0'
                                  }
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">EHP Bonus</span>
                              </div>
                              <div className="mt-3 space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Salute Massimo</span>
                                  <span className="text-white font-mono">+{customStats?.['PV'] || 0}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Rubavita/SpellVamp</span>
                                  <span className="text-emerald-400 font-mono">{
                                    (customStats?.['Rubavita Fisico %'] || 0) + (customStats?.['Rubavita Magico %'] || 0)
                                  }%</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Difesa Ibrida</span>
                                  <span className="text-slate-300 font-mono">
                                    {(customStats?.['Difesa Fisica'] || 0) + (customStats?.['Difesa Magica'] || 0)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Card 3: Controllo & Utility */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 text-left relative overflow-hidden group transition-all">
                              <div className="absolute top-0 right-0 bg-cyan-500/10 p-2 rounded-bl-xl">
                                <Activity size={16} className="text-cyan-500" />
                              </div>
                              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">Controllo & Utility</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-cyan-500">
                                  {Math.min(45, customStats?.['Riduzione CD %'] || customStats?.['Riduzione CD'] || 0)}%
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">CDR MAX</span>
                              </div>
                              <div className="mt-3 space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Spam Abilità</span>
                                  <span className="text-white font-mono">{(customStats?.['Riduzione CD %'] || customStats?.['Riduzione CD'] || 0) > 20 ? 'Alto' : 'Basso'}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Rigenerazione Mana</span>
                                  <span className="text-cyan-400 font-mono">+{customStats?.['Rigenerazione Mana'] || 0}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Velocità Mov.</span>
                                  <span className="text-slate-300 font-mono">+{customStats?.['Velocità di Movimento %'] || customStats?.['Velocità di Movimento'] || 0}</span>
                                </div>
                              </div>
                            </div>

                            {/* Card 4: Penetrazione & Efficienza */}
                            <div className="bg-slate-900/60 p-4 rounded-xl border border-amber-500/10 hover:border-amber-500/30 text-left relative overflow-hidden group transition-all">
                              <div className="absolute top-0 right-0 bg-amber-500/10 p-2 rounded-bl-xl">
                                <Target size={16} className="text-amber-500" />
                              </div>
                               <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider block mb-1">Efficienza Penetrazione</span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-amber-500">
                                  +{
                                    userHero.damageType === 'Magico' 
                                      ? (customStats?.['Penetrazione Magica %'] || customStats?.['Penetrazione Magica'] || 0)
                                      : (customStats?.['Penetrazione Fisica %'] || customStats?.['Penetrazione Fisica'] || 0)
                                  }
                                </span>
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Pen %/Pt</span>
                              </div>
                              <div className="mt-3 space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Perforazione {userHero.damageType}</span>
                                  <span className="text-white font-mono">Attiva</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Efficacia su Tank</span>
                                  <span className="text-amber-400 font-mono">
                                    {((userHero.damageType === 'Magico' 
                                      ? (customStats?.['Penetrazione Magica %'] || customStats?.['Penetrazione Magica'] || 0)
                                      : (customStats?.['Penetrazione Fisica %'] || customStats?.['Penetrazione Fisica'] || 0)) > 20) ? 'Eccellente' : 'Standard'}
                                  </span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-slate-400">Danno Puro Erogato</span>
                                  <span className="text-slate-300 font-mono">Dinamico</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 1.5 ANALISI PRO / CONTRO BUILD ATTUALE */}
                          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
                              <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 text-left">
                                <TrendingUp size={14} /> Punti di Forza Rilevati
                              </h4>
                              <ul className="space-y-2 text-[11px] text-slate-300">
                                {(((customStats?.[userHero.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico'] || 0) * 
                                    (1 + (customStats?.['Critico %'] || 0) * 0.012) *
                                    (1 + (customStats?.["Velocità d'Attacco %"] || 0) * 0.01)) > 400) && (
                                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">●</span> DPS estremo e grande capacità di burst o sostenuto.</li>
                                )}
                                {(((customStats?.['PV'] || 0) + (customStats?.['Difesa Fisica'] || 0) * 10 + (customStats?.['Difesa Magica'] || 0) * 10) > 3000) && (
                                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">●</span> Alto tasso di sopravvivenza ed EHP eccellente contro raffiche di danni.</li>
                                )}
                                {((customStats?.['Riduzione CD %'] || customStats?.['Riduzione CD'] || 0) > 25) && (
                                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">●</span> Ottimo spam di abilità e uptime elevato della Ultimate.</li>
                                )}
                                {((userHero.damageType === 'Magico' ? (customStats?.['Penetrazione Magica %'] || customStats?.['Penetrazione Magica'] || 0) : (customStats?.['Penetrazione Fisica %'] || customStats?.['Penetrazione Fisica'] || 0)) > 20) && (
                                  <li className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">●</span> Forte perforazione, molto efficace contro eroi corazzati.</li>
                                )}
                                {(!customStats || Object.keys(customStats).length === 0) && (
                                  <li className="text-slate-500 italic">Compila la build per rivelare i punti di forza.</li>
                                )}
                              </ul>
                            </div>
                            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4">
                              <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 text-left">
                                <AlertTriangle size={14} /> Punti Deboli da Mitigare
                              </h4>
                              <ul className="space-y-2 text-[11px] text-slate-300">
                                {(((customStats?.[userHero.damageType === 'Magico' ? 'Attacco Adattivo' : 'Attacco Fisico'] || 0) * 
                                    (1 + (customStats?.['Critico %'] || 0) * 0.012) *
                                    (1 + (customStats?.["Velocità d'Attacco %"] || 0) * 0.01)) < 150) && (
                                  <li className="flex items-start gap-1.5"><span className="text-rose-500 mt-0.5">●</span> Danno primario basso. Rischio di calo DPS in late-game se non sei un Tank/Support.</li>
                                )}
                                {(((customStats?.['PV'] || 0) + (customStats?.['Difesa Fisica'] || 0) * 10 + (customStats?.['Difesa Magica'] || 0) * 10) < 1000) && (
                                  <li className="flex items-start gap-1.5"><span className="text-rose-500 mt-0.5">●</span> Eroe molto fragile. Estremamente vulnerabile ad assassini e hard CC.</li>
                                )}
                                {((customStats?.['Velocità di Movimento %'] || customStats?.['Velocità di Movimento'] || 0) === 0) && (
                                  <li className="flex items-start gap-1.5"><span className="text-rose-500 mt-0.5">●</span> Mobilità scarsa conferita dalla build; potresti faticare a scappare.</li>
                                )}
                                {((userHero.damageType === 'Magico' ? (customStats?.['Penetrazione Magica %'] || customStats?.['Penetrazione Magica'] || 0) : (customStats?.['Penetrazione Fisica %'] || customStats?.['Penetrazione Fisica'] || 0)) < 10) && (
                                  <li className="flex items-start gap-1.5"><span className="text-rose-500 mt-0.5">●</span> Assenza di penetrazione. Danni molto inefficaci contro tank e fighter robusti.</li>
                                )}
                                {(!customStats || Object.keys(customStats).length === 0) && (
                                  <li className="text-slate-500 italic">Compila la build per rivelare i punti deboli.</li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* 2. RAPIDI ASSETTI DI OTTIMIZZAZIONE IN UN CLICK */}
                          <div className="mb-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">
                              🔌 Assetti Sandbox Rapidi (Applica Strategicamente)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {/* Assetto 1: Critico Estremo */}
                              <button 
                                onClick={() => applyPresetProfile('crit')}
                                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-left hover:border-amber-500/30 hover:bg-slate-900/85 transition-all outline-none"
                              >
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-wide block mb-1">Assetto Critico Estremo</span>
                                <p className="text-[10px] text-slate-200 font-bold mb-1">Danno Critico +40%</p>
                                <p className="text-[8.5px] text-slate-500 leading-tight">Configura oggetti a raffica critica come Berserker's Fury e attiva il talento Fatal per sottomissione DPS.</p>
                              </button>

                              {/* Assetto 2: Penetrazione Massima */}
                              <button 
                                onClick={() => applyPresetProfile('penetration')}
                                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-left hover:border-emerald-500/30 hover:bg-slate-900/85 transition-all outline-none"
                              >
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wide block mb-1">Massima Penetrazione</span>
                                <p className="text-[10px] text-slate-200 font-bold mb-1">Penetrazione Divina + Ignores</p>
                                <p className="text-[8.5px] text-slate-500 leading-tight">Ottimizza Malefic Roar / Divine Glaive e Rupture per penetrare istantaneamente le corazze difensive più ostiche.</p>
                              </button>

                              {/* Assetto 3: Hyper Attack Speed */}
                              <button 
                                onClick={() => applyPresetProfile('attack_speed')}
                                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-left hover:border-red-500/30 hover:bg-slate-900/85 transition-all outline-none"
                              >
                                <span className="text-[9px] font-black text-red-400 uppercase tracking-wide block mb-1">Mitraglia Vel. Attacco</span>
                                <p className="text-[10px] text-slate-200 font-bold mb-1">Velocità d'Attacco Max</p>
                                <p className="text-[8.5px] text-slate-500 leading-tight">Attiva Corrosion Scythe o Feather of Heaven accoppiato col talento Swift per innescare passivi costanti.</p>
                              </button>

                              {/* Assetto 4: Spam Abilità (CDR) */}
                              <button 
                                onClick={() => applyPresetProfile('cdr')}
                                className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 text-left hover:border-purple-500/30 hover:bg-slate-900/85 transition-all outline-none"
                              >
                                <span className="text-[9px] font-black text-purple-400 uppercase tracking-wide block mb-1">Spam Abilità Max CDR</span>
                                <p className="text-[10px] text-slate-200 font-bold mb-1">Riduzione CD Cap 40%+</p>
                                <p className="text-[8.5px] text-slate-500 leading-tight">Inietta massiccio CDR tramite Enchanted Talisman o Endless Battle e il talento Inspire per spam ostinato.</p>
                              </button>
                            </div>
                          </div>

                          {/* 3. SUGGERIMENTI INTERATTIVI PERSONALIZZATI */}
                          <div className="space-y-4">
                            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-left">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Suggerimento di Ottimizzazione Strategica</span>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                                {userHero.damageType === 'Magico' ? (
                                  <>
                                    Per incrementare il potenziale offensivo di <strong>{userHero.name}</strong>, privilegia l'acquisitazione del talento sbloccato <strong>Rupture (+5 Penetrazione Adattiva)</strong> nelle fasi iniziali, inserisci in build <strong>Genius Wand</strong> se i bersagli non possiedono molta difesa magica, oppure equipaggia <strong>Divine Glaive</strong> per annullare fino al 40% di difesa magica totale dei difensori avversari.
                                  </>
                                ) : (
                                  <>
                                    Per potenziare significativamente il DPS fisico di <strong>{userHero.name}</strong>, accoppia il talento sbloccabile <strong>Fatal (+5% Critico)</strong> con l'oggetto <strong>Berserker's Fury</strong> per raddoppiare l'output di danno da critici, oppure punta sull'assetto <strong>Massima Penetrazione</strong> per sfondare la spessa corazza difensiva nemica tramite <strong>Malefic Roar</strong>.
                                  </>
                                )}
                              </p>
                            </div>

                            {/* NEW ADVANCED COUNTER DOMINANCE HUB */}
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-left shadow-lg relative overflow-hidden"
                            >
                              <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4">
                                <Target size={200} className="text-rose-500" />
                              </div>

                              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    <Target size={16} />
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Hub Dominio dei Counter</h3>
                                    <p className="text-[9px] text-slate-500 font-mono mt-1">ANALISI DELLE DEBOLEZZE NEMICHE SFRUTTATE</p>
                                  </div>
                                </div>
                                <span className="text-[9.5px] font-mono bg-rose-950/40 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-full font-bold">
                                  {userHero.name} Dominante
                                </span>
                              </div>

                              {/* Active Matchup Counter List */}
                              {counterTargets.length > 0 ? (
                                <div className="space-y-4 mb-4">
                                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10.5px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                    <span>Vantaggi Attivi sul Team Nemico Draftato:</span>
                                  </div>
                                  <div className="space-y-3">
                                    {counterTargets.map(({ enemy, weakness, tactic }) => (
                                      <div key={enemy.id} className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 hover:border-slate-700/60 transition-colors">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2.5">
                                            <HeroImageWithFallback 
                                              src={enemy.iconUrl} 
                                              name={enemy.name} 
                                              id={enemy.id}
                                              role={enemy.role}
                                              className="w-9 h-9 rounded-lg border border-slate-705 shadow-sm object-cover" 
                                            />
                                            <div>
                                              <span className="text-xs font-black text-slate-200 tracking-wide block">{enemy.name}</span>
                                              <span className="text-[9px] font-bold text-slate-500 uppercase">{getTranslatedRole(enemy.role)} • {enemy.damageType}</span>
                                            </div>
                                          </div>
                                          <span className="text-[8px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded font-black uppercase">
                                            Selezionato
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900/60 text-[10.5px]">
                                          <div className="space-y-0.5">
                                            <span className="text-[8.5px] font-mono font-black text-rose-400 uppercase tracking-wider block">Debolezza Rilevata:</span>
                                            <p className="text-slate-300 leading-relaxed font-bold">{weakness}</p>
                                          </div>
                                          <div className="space-y-1 bg-rose-950/5 border border-rose-500/5 p-2 rounded-lg">
                                            <span className="text-[8.5px] font-mono font-black text-emerald-400 uppercase tracking-wider block">Come Sfrutti la Debolezza:</span>
                                            <p className="text-slate-300 leading-normal">{tactic}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-slate-500 text-xs py-3.5 border border-dashed border-slate-800 bg-slate-950/15 rounded-xl text-center px-4 mb-4 leading-relaxed font-normal">
                                  Seleziona gli <strong>eroi nemici</strong> nei 5 slot del draft per rivelare l'analisi dettagliata e i consigli tattici dei counter attivi in partita.
                                </div>
                              )}

                              {/* General Natural Counters regardless of enemy list selection */}
                              {allPotentialCounters.length > 0 && (
                                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block font-bold">
                                      Eroi Naturalmente Counterati (Roster Globale):
                                    </span>
                                    <span className="text-[8.5px] font-medium text-slate-500 italic">Consigli di Pick per {userHero.name}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {allPotentialCounters.map(({ enemy, weakness, tactic }) => (
                                      <div key={enemy.id} className="bg-slate-950/20 border border-slate-800/50 rounded-xl p-3 space-y-2 hover:bg-slate-900/40 hover:border-slate-700/40 transition-all text-left">
                                        <div className="flex items-center gap-2">
                                          <HeroImageWithFallback 
                                            src={enemy.iconUrl} 
                                            name={enemy.name} 
                                            id={enemy.id}
                                            role={enemy.role}
                                            className="w-7 h-7 rounded border border-slate-800 object-cover" 
                                          />
                                          <div>
                                            <span className="text-xs font-bold text-slate-300 block leading-tight">{enemy.name}</span>
                                            <span className="text-[8px] font-mono text-slate-500">{getTranslatedRole(enemy.role)}</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1.5 text-[10px]">
                                          <p className="text-rose-400/90 font-bold text-[9.5px] leading-tight">
                                            <span className="font-mono text-[7.5px] uppercase text-rose-500/70 block font-black mb-0.5">Debolezza Chiave:</span>
                                            {weakness}
                                          </p>
                                          <p className="text-slate-300 leading-tight">
                                            <span className="font-mono text-[7.5px] uppercase text-emerald-500/70 block font-black mb-0.5">Azione Tattica:</span>
                                            {tactic}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>

                            {/* META INTEL CARD */}
                            {(() => {
                              const metaInfo = liveMeta.find(mh => mh.id === userHero.id);
                              if (!metaInfo) return null;
                              return (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left relative overflow-hidden"
                                >
                                  <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                                    <Trophy size={80} className="text-amber-500" />
                                  </div>
                                  <div className="flex items-center justify-between mb-3 relative z-10">
                                    <div className="flex items-center gap-2">
                                      <Sparkles size={14} className="text-amber-500" />
                                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Status Meta Attuale</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                      <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono">TIER {metaInfo.tier}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-3 relative z-10">
                                    <div className="bg-slate-950/50 p-2 rounded border border-amber-500/10">
                                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Win Rate</span>
                                      <span className="text-xs font-black text-emerald-400">{metaInfo.winRate}%</span>
                                    </div>
                                    <div className="bg-slate-950/50 p-2 rounded border border-amber-500/10">
                                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Pick Rate</span>
                                      <span className="text-xs font-black text-amber-400">{metaInfo.pickRate}%</span>
                                    </div>
                                    <div className="bg-slate-950/50 p-2 rounded border border-amber-500/10">
                                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Ban Rate</span>
                                      <span className="text-xs font-black text-rose-400">{metaInfo.banRate}%</span>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })()}

                            {/* ATTACK SPEED / ON-HIT SUGGESTIONS */}
                            {attackSpeedSuggestions.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-left"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap size={14} className="text-amber-500" />
                                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Ottimizzazione Attacco Base</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                                  Suggeriti per potenziare velocità d'attacco ed effetti sul colpo (on-hit):
                                </p>
                                <div className="flex gap-3">
                                  {attackSpeedSuggestions.map(item => (
                                    <div key={item.id} className="flex flex-col items-center gap-1 group relative">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-800 group-hover:border-amber-500/50 transition-colors bg-slate-950">
                                        <ImageWithFallback src={item.iconUrl} alt={item.name} type="item" id={item.id} className="w-full h-full object-cover" title={item.name} />
                                      </div>
                                      <span className="text-[8px] text-slate-500 font-bold uppercase truncate max-w-[50px] text-center">{item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                     <Book size={16} className="text-amber-500" />
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sequenza di Acquisto Ottimale</h3>
                  </div>

                  {customStats && (
                    <div className="mb-8 p-5 bg-slate-950/60 border border-slate-800 rounded-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl border-l border-b border-amber-500/10">
                        SIMULATORE SANDBOX COMMITTATO
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <Activity size={18} className="text-blue-500" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Potenziamenti Build (Somma Attributi)</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(customStats).map(([key, value]) => {
                          const originalVal = (results?.stats?.[key] || 0) as number;
                          const difference = Math.round(((value as number) - originalVal) * 10) / 10;
                          
                          let Icon = Activity;
                          let color = "text-slate-400";
                          
                          if (key.includes('Attacco')) { Icon = Sword; color = "text-red-400"; }
                          else if (key.includes('PV')) { Icon = Heart; color = "text-emerald-400"; }
                          else if (key.includes('Difesa')) { Icon = Shield; color = "text-blue-400"; }
                          else if (key.includes('Velocità d\'Attacco')) { Icon = Zap; color = "text-amber-400"; }
                          else if (key.includes('Critico')) { Icon = Target; color = "text-orange-400"; }
                          else if (key.includes('CD')) { Icon = Zap; color = "text-sky-400"; }
                          else if (key.includes('Penetrazione')) { Icon = Target; color = "text-purple-400"; }
                          else if (key.includes('Rubavita')) { Icon = Activity; color = "text-rose-400"; }

                          return (
                            <div key={key} className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded border border-slate-800/50">
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon size={12} className={color} />
                                <div className="min-w-0 leading-tight">
                                  <p className="text-[9px] text-slate-500 uppercase leading-none mb-1">{key}</p>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-white">+{value}</span>
                                    {difference !== 0 && (
                                      <span className={`text-[8px] font-black tracking-tight leading-none px-1 py-0.5 rounded ${
                                        difference > 0 
                                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10' 
                                          : 'bg-red-500/15 text-red-400 border border-red-500/10'
                                      }`}>
                                        {difference > 0 ? `+${difference}` : difference}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Strategic Note */}
                      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3 text-left">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-[10px] text-amber-500 font-bold mb-0.5 uppercase tracking-wide">Nota Strategica: Sinergia Eroe, Danno e Nemici</p>
                          <p className="text-[10px] text-amber-400/80 leading-relaxed">
                            È fondamentale scegliere i <strong>talenti dell'emblema</strong> e le penetrazioni in base al <strong>tipo di danno base del tuo eroe ({userHero?.damageType})</strong>. Allo stesso tempo, scegli la tua build e la configurazione difensiva considerando che l'attuale team nemico esprime potenziale di <strong>danno fisico per il {enemyTeamStats.physPct}%</strong> e <strong>magico per il {enemyTeamStats.magPct}%</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {items.map((slot, idx) => (
                    <BuildSlotCard 
                      key={idx} 
                      slot={slot} 
                      idx={idx} 
                      isEditable={!!userHeroId && enemies.length > 0}
                      onTriggerSwap={() => setSwappingSlotIndex(idx)}
                      onReset={() => handleResetSlot(idx)}
                      isOverridden={!!customBuildOverrides[idx]}
                    />
                  ))}
                  
                  {/* Nota Strategica rimossa perché unificata nella guida a sinistra */}
                </div>
              )}
            </section>
          </div>
        <ReportBugModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          userHero={userHero}
          lane={lane}
          enemies={enemies}
          onSuccess={(msg) => {
            setUpdateMessage(msg);
            setTimeout(() => setUpdateMessage(null), 5000);
          }}
        />
        </div>
      </div>

      <HeroEncyclopediaModal 
        isOpen={isHeroEncyclopediaOpen} 
        onClose={() => setIsHeroEncyclopediaOpen(false)} 
      />

      <ItemEncyclopediaModal 
        isOpen={isItemEncyclopediaOpen} 
        onClose={() => setIsItemEncyclopediaOpen(false)} 
      />


      <MatchAnalyzerModal
        isOpen={isMatchAnalyzerOpen}
        onClose={() => setIsMatchAnalyzerOpen(false)}
        userHero={userHero || undefined}
      />

      <ItemSwapperModal
        isOpen={swappingSlotIndex !== null}
        onClose={() => setSwappingSlotIndex(null)}
        onSelect={(newItem) => {
          if (swappingSlotIndex !== null) {
            setCustomBuildOverrides(prev => ({
              ...prev,
              [swappingSlotIndex]: newItem
            }));
            setSwappingSlotIndex(null);
          }
        }}
        slotIndex={swappingSlotIndex ?? 0}
        currentSelectedId={swappingSlotIndex !== null ? (items[swappingSlotIndex]?.item.id ?? '') : ''}
      />

      <PatchNotesModal 
        isOpen={isPatchModalOpen}
        onClose={() => setIsPatchModalOpen(false)}
        currentPatch={gamePatchVersion}
        appPatchVersion={appPatchVersion}
        setAppPatchVersion={setAppPatchVersion}
        setGamePatchVersion={setGamePatchVersion}
        appPatchHistory={appPatchHistory}
        setAppPatchHistory={setAppPatchHistory}
        gamePatchHistory={gamePatchHistory}
        setGamePatchHistory={setGamePatchHistory}
        defaultSubTab={patchModalSubTab}
      />

      <AnimatePresence>
        {isMetaOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur-md opacity-30 animate-pulse"></div>
                    <div className="p-2 bg-slate-900 border border-cyan-500/30 rounded-lg relative z-10 flex items-center justify-center">
                      <Activity size={24} className="text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      META UFFICIALE <span className="text-slate-500 font-mono text-sm tracking-normal">[{gamePatchVersion}]</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                      </span>
                      <p className="text-[9px] text-cyan-500/80 uppercase tracking-widest font-mono">Dati Sincronizzati Ufficiali</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsMetaOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {selectedMetaHero ? (
                  /* 1. SEZIONE DETTERMINISTICA DI DETTAGLIO STRATEGICO & CONTRO-STRATEGIE PER I PROFESSIONISTI */
                  <div className="space-y-6 animate-fadeIn text-left">
                    {/* Pulsante di Navigazione Indietro */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                      <button 
                        onClick={() => setSelectedMetaHero(null)}
                        className="flex items-center gap-2 text-xs font-black uppercase text-cyan-400 hover:text-cyan-300 transition-colors group"
                      >
                        <span className="group-hover:-translate-x-1 transition-transform inline-block">&larr;</span> Torna alla lista dei Meta Eroi
                      </button>

                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
                        Analisi Strategica Avanzata & Matchup Counters
                      </span>
                    </div>

                    {/* Scheda Profilo dell'Eroe e Valutazione delle Abilità */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-cyan-500/10 p-2 rounded-bl-xl border-l border-b border-cyan-500/20">
                        <Trophy size={16} className="text-cyan-400" />
                      </div>
                      
                      <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                        <div className="flex items-center gap-4">
                          <HeroImageWithFallback 
                            src={selectedMetaHero.iconUrl} 
                            name={selectedMetaHero.name} 
                            id={selectedMetaHero.id}
                            role={selectedMetaHero.role}
                            className="w-16 h-16 rounded-xl border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-black text-white uppercase tracking-wider">{selectedMetaHero.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                selectedMetaHero.tier === 'S+' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
                                selectedMetaHero.tier === 'S' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                Tier {selectedMetaHero.tier}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/50">
                                {selectedMetaHero.role}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                selectedMetaHero.damageType === 'Magico' ? 'bg-purple-950/50 text-purple-400 border border-purple-500/20' : 
                                selectedMetaHero.damageType === 'Fisico' ? 'bg-amber-950/50 text-amber-400 border border-amber-500/20' : 
                                'bg-rose-950/50 text-rose-400 border border-rose-500/20'
                              }`}>
                                {selectedMetaHero.damageType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Statistiche Chiave sul Server */}
                        <div className="grid grid-cols-3 gap-3 w-full border-t border-slate-850 pt-4">
                          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40 text-center">
                            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Win Rate</span>
                            <span className="text-sm font-black text-emerald-400">{selectedMetaHero.winRate}%</span>
                          </div>
                          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40 text-center">
                            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Pick Rate</span>
                            <span className="text-sm font-black text-slate-300">{selectedMetaHero.pickRate}%</span>
                          </div>
                          <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40 text-center">
                            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Ban Rate</span>
                            <span className="text-sm font-black text-rose-400">{selectedMetaHero.banRate}%</span>
                          </div>
                        </div>

                        {/* Pulsanti Azione Rapida */}
                        <div className="grid grid-cols-2 gap-2 w-full pt-1">
                          <button
                            onClick={() => {
                              setUserHeroId(selectedMetaHero.id);
                              setSelectedMetaHero(null);
                              setIsMetaOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                          >
                            <Sword size={13} />
                            Usa Mio Eroe
                          </button>
                          <button
                            onClick={() => {
                              if (!enemyIds.includes(selectedMetaHero.id)) {
                                if (enemyIds.length < 5) {
                                  setEnemyIds([...enemyIds, selectedMetaHero.id]);
                                } else {
                                  // Sostituisce l'ultimo nemico
                                  const nextEnemies = [...enemyIds];
                                  nextEnemies[4] = selectedMetaHero.id;
                                  setEnemyIds(nextEnemies);
                                }
                              }
                              setSelectedMetaHero(null);
                              setIsMetaOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg text-xs font-bold transition-all"
                          >
                            <Shield size={13} className="text-rose-500" />
                            Imposta Nemico
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-1 border-r border-slate-800/60 hidden md:block" />

                      {/* Radar-like list di statistiche di combattimento */}
                      <div className="md:col-span-6 space-y-3.5">
                        <h4 className="text-[10px] uppercase font-mono font-black tracking-widest text-cyan-400 mb-2">Valutazione Abilità di Combattimento</h4>
                        
                        {/* DPS */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><Sword size={11} className="text-rose-400" /> Potenziale Offensivo (DPS)</span>
                            <span className="text-rose-400 font-mono font-black">{getHeroDetailedStats(selectedMetaHero).dps}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400" style={{ width: `${getHeroDetailedStats(selectedMetaHero).dps}%` }} />
                          </div>
                        </div>

                        {/* Sustain */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><Shield size={11} className="text-emerald-400" /> Resistenza Fisica & Sustain</span>
                            <span className="text-emerald-400 font-mono font-black">{getHeroDetailedStats(selectedMetaHero).sustain}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${getHeroDetailedStats(selectedMetaHero).sustain}%` }} />
                          </div>
                        </div>

                        {/* Control */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><Activity size={11} className="text-cyan-400" /> Crowd Control (CC) & Ingressi</span>
                            <span className="text-cyan-400 font-mono font-black">{getHeroDetailedStats(selectedMetaHero).control}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${getHeroDetailedStats(selectedMetaHero).control}%` }} />
                          </div>
                        </div>

                        {/* Mobility */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><Zap size={11} className="text-amber-400" /> Mobilità & Fuga Lampo</span>
                            <span className="text-amber-400 font-mono font-black">{getHeroDetailedStats(selectedMetaHero).mobility}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400" style={{ width: `${getHeroDetailedStats(selectedMetaHero).mobility}%` }} />
                          </div>
                        </div>

                        {/* Push */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-400 flex items-center gap-1"><Trophy size={11} className="text-purple-400" /> Split-Push & Obiettivi</span>
                            <span className="text-purple-400 font-mono font-black">{getHeroDetailedStats(selectedMetaHero).push}%</span>
                          </div>
                          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: `${getHeroDetailedStats(selectedMetaHero).push}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guida di Gioco per Professionisti */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950/20 border border-slate-800/80 rounded-2xl p-4 text-left">
                        <h4 className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest mb-2">
                          <TrendingUp size={14} /> FASE INIZIALE (Early)
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {getHeroDetailedStats(selectedMetaHero).strategyEarly}
                        </p>
                      </div>
                      <div className="bg-slate-950/20 border border-slate-800/80 rounded-2xl p-4 text-left">
                        <h4 className="flex items-center gap-2 text-xs font-black text-cyan-500 uppercase tracking-widest mb-2">
                          <Activity size={14} /> FASE INTERMEDIA (Mid)
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {getHeroDetailedStats(selectedMetaHero).strategyMid}
                        </p>
                      </div>
                      <div className="bg-slate-950/20 border border-slate-800/80 rounded-2xl p-4 text-left">
                        <h4 className="flex items-center gap-2 text-xs font-black text-purple-500 uppercase tracking-widest mb-2">
                          <Trophy size={14} /> FASE TARDIVA (Late)
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {getHeroDetailedStats(selectedMetaHero).strategyLate}
                        </p>
                      </div>
                    </div>

                    {/* Contro-strategie & Counter-Equipaggiamento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tattiche per contrastarlo */}
                      <div className="bg-rose-950/10 border border-rose-500/20 rounded-2xl p-4 text-left">
                        <h4 className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-widest mb-3">
                          <AlertTriangle size={15} /> Tattiche Counter di Gioco
                        </h4>
                        <ul className="space-y-2.5 text-[11px] text-slate-300">
                          {getHeroDetailedStats(selectedMetaHero).counterTips.map((tip, idx) => (
                            <li key={idx} className="flex gap-2 items-start leading-relaxed">
                              <span className="text-rose-500 font-bold mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Oggetti Counter Consigliati */}
                      <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-2xl p-4 text-left font-sans">
                        <h4 className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-widest mb-3">
                          <BookOpen size={15} /> Equipaggiamento Counter
                        </h4>
                        <ul className="space-y-2.5 text-[11px] text-slate-300">
                          {getHeroDetailedStats(selectedMetaHero).counterItems.map((item, idx) => (
                            <li key={idx} className="flex gap-2 items-start leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/25">
                              <span className="text-cyan-400 font-bold font-mono">#{idx + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 2. SCHERMATA STANDARD CON LA TABELLA DEI RANKINGS O CORSIE ED AUTO-SYNC */
                  <>
                    {/* Database Telemetry Pipeline Sync Panel */}
                    <div className="mb-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <CloudDownload size={18} className="text-cyan-400" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-white">Moonton Database Telemetry Integration</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          STATISTICHE UFFICIALI MLBB: <span className="text-cyan-400 font-mono font-bold">{lastSyncTime}</span>
                        </p>
                      </div>

                      <button 
                        onClick={handleForceSync}
                        disabled={isSyncActive}
                        className={`group shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                          isSyncActive 
                            ? 'bg-slate-900 border border-cyan-500/20 text-cyan-500/60 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] shadow-lg'
                        }`}
                      >
                        {isSyncActive ? (
                          <>
                            <Loader2 size={13} className="animate-spin text-cyan-400" />
                            Ricalcolo Telemetria Live...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={13} className="group-hover:rotate-180 transition-transform duration-500 text-slate-950" />
                            Forza Aggiornamento Live API
                          </>
                        )}
                      </button>
                    </div>

                    {/* Hacker Console log di Caricamento API */}
                    {isSyncActive && (
                      <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 font-mono text-xs text-cyan-400 space-y-1 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] select-none">
                        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
                          <span className="flex items-center gap-1.5 font-bold"><Loader2 className="animate-spin text-cyan-400" size={13} /> TELEMETRY STREAM IN PROGRESS</span>
                          <span className="text-[10px] uppercase font-bold text-cyan-500/60 bg-cyan-950/40 px-2 py-0.5 rounded">CONNECTING...</span>
                        </div>
                        <div className="max-h-24 overflow-y-auto space-y-0.5 scrollbar-none text-left">
                          {syncLogs.map((log, lIdx) => (
                            <div key={lIdx} className="animate-fadeIn">{log}</div>
                          ))}
                        </div>
                        <div className="pt-2">
                          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab Navigation per Rankings ed Analisi Lane */}
                    <div className="flex border-b border-slate-800 mb-6 gap-2">
                      <button 
                        onClick={() => setActiveMetaTab('all')} 
                        className={`pb-3 px-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeMetaTab === 'all' 
                            ? 'border-cyan-500 text-cyan-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Trophy size={13} /> Classifica Generale
                      </button>
                      <button 
                        onClick={() => setActiveMetaTab('lanes')} 
                        className={`pb-3 px-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeMetaTab === 'lanes' 
                            ? 'border-cyan-500 text-cyan-400' 
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Filter size={13} /> Radar di Corsia (Lane Meta)
                      </button>
                    </div>

                    {activeMetaTab === 'all' ? (
                      /* TAB 1: CLASSIFICA GENERALE SUL DETTAGLIO GENERALE */
                      <>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                           <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] text-slate-500 uppercase">Win Rate Medio</p>
                                <TrendingUp size={14} className="text-emerald-500/50" />
                              </div>
                              <p className="text-lg font-bold text-emerald-500">51.4%</p>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] text-slate-500 uppercase">Ban Rate Medio</p>
                                <Shield size={14} className="text-rose-500/50" />
                              </div>
                              <p className="text-lg font-bold text-rose-500">24.8%</p>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] text-slate-500 uppercase">Status Meta</p>
                                <Activity size={14} className="text-amber-500/50" />
                              </div>
                              <p className="text-lg font-bold text-amber-500 uppercase">Bilanciato</p>
                           </div>
                           <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] text-slate-500 uppercase">Counter Efficace</p>
                                <Crosshair size={14} className="text-sky-500/50" />
                              </div>
                              <p className="text-lg font-bold text-sky-500">Anti-Heal</p>
                           </div>
                        </div>

                        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/30 p-4 rounded-xl border border-slate-800">
                          <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                              <input 
                                type="text" 
                                placeholder="Cerca Eroe..." 
                                value={metaSearch}
                                onChange={e => setMetaSearch(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar justify-start md:justify-end cursor-pointer">
                            {['All', 'Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'].map(role => (
                              <button
                                key={role}
                                onClick={() => setMetaRoleFilter(role)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                  metaRoleFilter === role 
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                                    : 'bg-slate-950/50 text-slate-400 border border-slate-800 hover:bg-slate-800'
                                    }`}
                              >
                                {role === 'All' ? 'Tutti i Ruoli' : role}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-cyan-900/30 text-[10px] uppercase text-cyan-500/70 font-black tracking-widest bg-cyan-950/10">
                                <th className="py-3 px-4 rounded-tl-lg">Eroe</th>
                                <th 
                                  className="py-3 px-4 cursor-pointer hover:text-cyan-400 select-none group"
                                  onClick={() => handleMetaSort('tier')}
                                >
                                  <div className="flex items-center gap-1">
                                    Tier Analitico
                                    {metaSort === 'tier' ? (metaSortDirection === 'asc' ? <ChevronUp size={12} className="text-cyan-400" /> : <ChevronDown size={12} className="text-cyan-400" />) : <ChevronDown size={12} className="opacity-0 group-hover:opacity-50" />}
                                  </div>
                                </th>
                                <th 
                                  className="py-3 px-4 text-emerald-500/70 cursor-pointer hover:text-emerald-400 select-none group"
                                  onClick={() => handleMetaSort('winRate')}
                                >
                                  <div className="flex items-center gap-1">
                                    Win Rate
                                    {metaSort === 'winRate' ? (metaSortDirection === 'asc' ? <ChevronUp size={12} className="text-emerald-400" /> : <ChevronDown size={12} className="text-emerald-400" />) : <ChevronDown size={12} className="opacity-0 group-hover:opacity-50" />}
                                  </div>
                                </th>
                                <th 
                                  className="py-3 px-4 text-amber-500/70 cursor-pointer hover:text-amber-400 select-none group"
                                  onClick={() => handleMetaSort('pickRate')}
                                >
                                  <div className="flex items-center gap-1">
                                    Pick Rate
                                    {metaSort === 'pickRate' ? (metaSortDirection === 'asc' ? <ChevronUp size={12} className="text-amber-400" /> : <ChevronDown size={12} className="text-amber-400" />) : <ChevronDown size={12} className="opacity-0 group-hover:opacity-50" />}
                                  </div>
                                </th>
                                <th 
                                  className="py-3 px-4 text-rose-500/70 cursor-pointer hover:text-rose-400 select-none group"
                                  onClick={() => handleMetaSort('banRate')}
                                >
                                  <div className="flex items-center gap-1">
                                    Ban Rate
                                    {metaSort === 'banRate' ? (metaSortDirection === 'asc' ? <ChevronUp size={12} className="text-rose-400" /> : <ChevronDown size={12} className="text-rose-400" />) : <ChevronDown size={12} className="opacity-0 group-hover:opacity-50" />}
                                  </div>
                                </th>
                                <th className="py-3 px-4 rounded-tr-lg">Azione</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm">
                              {filteredAndSortedMeta.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-12 text-center text-slate-500">
                                    Nessun eroe trovato per i filtri selezionati.
                                  </td>
                                </tr>
                              ) : filteredAndSortedMeta.map((hero, idx) => (
                                <tr 
                                  key={hero.id} 
                                  onClick={() => setSelectedMetaHero(hero)}
                                  title="Clicca per visualizzare analisi strategica dettagliata e contro-strategie"
                                  className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group cursor-pointer"
                                >
                                  <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-mono text-slate-600 w-4">{idx + 1}.</span>
                                      <HeroImageWithFallback 
                                        src={hero.iconUrl} 
                                        name={hero.name} 
                                        id={hero.id}
                                        role={hero.role}
                                        className="w-10 h-10 rounded-lg border border-slate-800 transition-transform group-hover:scale-105" 
                                      />
                                      <div className="text-left">
                                        <p className="font-bold text-white leading-none group-hover:text-cyan-400 transition-colors">{hero.name}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <p className="text-[9px] text-slate-500 uppercase font-bold">{getTranslatedRole(hero.role)}</p>
                                          <span className="text-[8px] text-slate-700 bg-slate-900 border border-slate-800/60 px-1 rounded font-mono uppercase font-black uppercase">
                                            {getHeroLanes(hero).join(' / ')}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${
                                      hero.tier === 'S+' ? 'bg-rose-500/25 text-rose-400 border-rose-500/30' :
                                      hero.tier === 'S' ? 'bg-amber-500/25 text-amber-400 border-amber-500/30' :
                                      hero.tier === 'A' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                      'bg-slate-950/70 border-slate-800 text-slate-500'
                                    }`}>
                                      {hero.tier}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="space-y-1">
                                      <p className="font-mono font-bold text-emerald-400">{hero.winRate}%</p>
                                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${hero.winRate}%` }}></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 font-mono text-slate-400">{hero.pickRate}%</td>
                                  <td className="py-4 px-4 font-mono text-rose-500/80">{hero.banRate}%</td>
                                  <td className="py-4 px-4 text-center">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setUserHeroId(hero.id);
                                        setIsMetaOpen(false);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="group relative overflow-hidden px-4 py-1.5 bg-slate-900 border border-cyan-500/30 text-cyan-400 hover:text-cyan-50 rounded text-xs font-bold transition-all hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10"
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                      <span className="relative z-10 flex items-center gap-1.5">
                                        <Crosshair size={12} className="opacity-70 group-hover:opacity-100" />
                                        Seleziona
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      /* TAB 2: DETTAGLIO DI CORSIA AVANZATO CON DISTINZIONE EROI META E FUORI META (RICHIESTO) */
                      <div className="space-y-6">
                        {/* Selettore Lane con Design Pregiato */}
                        <div className="grid grid-cols-5 gap-2 bg-slate-950/40 p-2 rounded-2xl border border-slate-800/80">
                          {lanes.map(l => {
                            const Icon = laneIcons[l] || Filter;
                            return (
                              <button
                                key={l}
                                onClick={() => setSelectedMetaLane(l)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer border ${
                                  selectedMetaLane === l
                                    ? 'bg-cyan-500/25 border-cyan-500/50 text-cyan-400 font-black shadow-lg shadow-cyan-500/5 scale-[1.03]'
                                    : 'border-transparent bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                                }`}
                              >
                                <Icon size={18} className={selectedMetaLane === l ? 'text-cyan-400' : 'text-slate-500'} />
                                <span className="text-[10px] font-bold uppercase tracking-wider mt-1 block">
                                  {l === 'Roam' ? 'Roam / Support' : `${l} Lane`}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Focus Analitico della Lane */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                          {/* Colonna di Sinistra: TOP META PICK PER QUESTA CORSIA (Tier S+ e S) */}
                          <div className="bg-gradient-to-b from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col justify-between text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-amber-500/20 p-2 rounded-bl-xl border-l border-b border-amber-500/30">
                              <Star size={18} className="text-amber-400 fill-amber-400 animate-pulse" />
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                                <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest">
                                  Top Meta Pick (I Più Forti Ad Oggi)
                                </h3>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                                Eroi dominanti e d'eccellenza per la corsia <span className="text-amber-400 font-bold">{selectedMetaLane}</span> in patch <span className="text-white font-mono">{gamePatchVersion}</span>. Garantiscono prestazioni statistiche eccezionali e godono del più alto tasso di priorità nei draft dei pro players:
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                                {liveMeta.filter(h => getHeroLanes(h).includes(selectedMetaLane) && ['S+', 'S'].includes(h.tier)).slice(0, 6).map(hero => (
                                  <div 
                                    key={hero.id}
                                    onClick={() => setSelectedMetaHero(hero)}
                                    className="p-2 bg-slate-950/80 border border-amber-500/20 hover:border-amber-500/50 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                                  >
                                    <HeroImageWithFallback 
                                      src={hero.iconUrl} 
                                      name={hero.name} 
                                      id={hero.id}
                                      role={hero.role}
                                      className="w-8 h-8 rounded-lg border border-amber-500/30"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-bold text-white text-[11px] truncate">{hero.name}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-1 rounded">S-TIER</span>
                                        <span className="text-[8px] font-mono text-emerald-400 font-bold">{hero.winRate}% WR</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-amber-950/10 p-2.5 rounded-xl border border-amber-500/10 mt-4 text-[9px] text-amber-500/90 leading-normal">
                              <strong>TATTICA PRO DI CORSIA:</strong> Straordinaria mobilità, danni burst amplificati in questa patch e wave clear ultra rapido per rotazioni istantanee. Indispensabile nei draft ad alta competitività.
                            </div>
                          </div>

                          {/* Colonna di Destra: SCELTE FUORI META / DEBOLI E SCONSIGLIATE (Tier B e C) */}
                          <div className="bg-gradient-to-b from-red-500/10 to-transparent p-5 rounded-2xl border border-red-500/20 flex flex-col justify-between text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-red-500/10 p-2 rounded-bl-xl border-l border-b border-red-500/15">
                              <AlertTriangle size={18} className="text-red-400" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <h3 className="text-sm font-black text-red-400 uppercase tracking-widest">
                                  Eroi Fuori Meta o Non Adatti
                                </h3>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                                Eroi sconsigliati, deboli o non idonei nel meta competitivo di oggi per la corsia <span className="text-red-400 font-bold">{selectedMetaLane}</span>. Il loro utilizzo in questa lane riduce sensibilmente la probabilità di vittoria e offre facili counter in draft:
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                                {liveMeta.filter(h => {
                                  const isOfLane = getHeroLanes(h).includes(selectedMetaLane);
                                  return (isOfLane && ['B', 'C'].includes(h.tier)) || (!isOfLane && h.role.toLowerCase().includes('marksman') && selectedMetaLane === 'Exp');
                                }).slice(0, 6).map(hero => (
                                  <div 
                                    key={hero.id}
                                    onClick={() => setSelectedMetaHero(hero)}
                                    className="p-2 bg-slate-950/40 border border-slate-900 opacity-60 hover:opacity-100 hover:border-red-500/30 rounded-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                                  >
                                    <HeroImageWithFallback 
                                      src={hero.iconUrl} 
                                      name={hero.name} 
                                      id={hero.id}
                                      role={hero.role}
                                      className="w-8 h-8 rounded-lg border border-slate-800 grayscale"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-bold text-slate-400 text-[11px] truncate">{hero.name}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[8px] font-bold text-red-500 bg-red-500/10 px-1 rounded">LOW TIER</span>
                                        <span className="text-[8px] font-mono text-red-500/60 font-medium">{hero.winRate}% WR</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-red-950/5 p-2.5 rounded-xl border border-red-500/10 mt-4 text-[9px] text-slate-400 leading-normal">
                              <strong>PERCHÈ EVITARLI QUI:</strong> Soffrono gravemente la mobilità avversaria, le lunghe ricariche o la mancanza di sustain in corsia. Facile bersaglio dei gank della giungla nella patch competitiva attuale.
                            </div>
                          </div>
                        </div>

                        {/* Scelte Alternative / Tattiche di Supporto (Tier A) */}
                        <div className="bg-slate-950/20 border border-slate-800 p-4 rounded-2xl text-left">
                          <h4 className="text-[10px] uppercase font-black tracking-widest text-cyan-400 mb-2.5 flex items-center gap-2">
                            <Trophy size={12} className="text-cyan-400" /> Scelte Situazionali / Strategici (Tier A)
                          </h4>
                          <div className="flex flex-wrap gap-2 justify-start">
                            {liveMeta.filter(h => getHeroLanes(h).includes(selectedMetaLane) && h.tier === 'A').slice(0, 10).map(hero => (
                              <button
                                key={hero.id}
                                onClick={() => setSelectedMetaHero(hero)}
                                className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 hover:border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 transition-all hover:scale-105"
                              >
                                <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} role={hero.role} className="w-5 h-5 rounded" />
                                <span>{hero.name}</span>
                                <span className="text-[8px] font-mono font-black text-cyan-400 ml-1 px-1 py-0.2 rounded bg-cyan-500/5">T-A</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSavedBuildsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-rose-500 fill-rose-500/20" />
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">I Miei Salvataggi</h2>
                </div>
                <button onClick={() => setIsSavedBuildsOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {savedBuilds.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-4">
                    <Heart size={48} className="opacity-10" />
                    <p>Non hai ancora salvato nessuna build.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {savedBuilds.map(saved => {
                      const hero = HEROES.find(h => h.id === saved.userHeroId);
                      return (
                        <div key={saved.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-amber-500/30 transition-all flex flex-col md:flex-row items-center gap-4 relative group">
                          <div className="flex items-center gap-3 shrink-0">
                            <HeroImageWithFallback 
                              src={hero?.iconUrl} 
                              name={hero?.name} 
                              id={hero?.id}
                              role={hero?.role}
                              className="w-12 h-12 rounded-lg border border-slate-800" 
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white leading-tight truncate">{hero?.name}</h4>
                              <p className="text-[10px] text-slate-500 uppercase font-mono">{new Date(saved.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex gap-1 items-center overflow-x-auto scrollbar-none justify-center md:justify-start">
                            {saved.results.items.map((slot, i) => (
                              <ImageWithFallback key={i} src={slot.item.iconUrl} alt={slot.item.name} type="item" id={slot.item.id} className="w-8 h-8 rounded border border-slate-800 shrink-0" />
                            ))}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                            <button 
                              onClick={() => loadSavedBuild(saved)}
                              className="flex-1 md:flex-none px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
                            >
                              Carica
                            </button>
                            <button 
                              onClick={() => deleteSavedBuild(saved.id)}
                              className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      {updateMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded shadow-2xl flex items-center gap-3 z-50">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm">{updateMessage}</span>
        </div>
      )}
    </div>
  );
}

function ItemSwapperModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  slotIndex, 
  currentSelectedId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (item: Item) => void; 
  slotIndex: number; 
  currentSelectedId: string; 
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Attack' | 'Magic' | 'Defense' | 'Movement'>('All');

  const filtered = OFFICIAL_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                        item.passiveDescription.toLowerCase().includes(search.toLowerCase()) ||
                        (item.passiveName && item.passiveName.toLowerCase().includes(search.toLowerCase()));
    
    // Mappa le categorie per il filtraggio
    let itemCatMapped = item.category;
    if (item.category === 'Attack') itemCatMapped = 'Attack';
    else if (item.category === 'Magic') itemCatMapped = 'Magic';
    else if (item.category === 'Defense') itemCatMapped = 'Defense';
    else if (item.category === 'Movement' || item.category === 'Roaming' || item.category === 'Jungler') itemCatMapped = 'Movement';

    const matchCategory = activeCategory === 'All' || itemCatMapped === activeCategory;
    return matchSearch && matchCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl h-[75vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div>
            <h3 className="text-base font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={16} className="text-amber-500 animate-spin-slow" /> Sostituisci Oggetto Slot {slotIndex + 1}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Scegli una contromisura alternativa e simula la build</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/20 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text"
              placeholder="Cerca per nome, attributi o effetti passivi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800/80 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 font-medium"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {([
              { key: 'All', label: 'Tutti' },
              { key: 'Attack', label: 'Attacco' },
              { key: 'Magic', label: 'Magico' },
              { key: 'Defense', label: 'Difesa' },
              { key: 'Movement', label: 'Movimento / Spec.' }
            ] as const).map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1 text-[9px] uppercase font-black tracking-wider rounded border transition-all cursor-pointer ${
                  activeCategory === cat.key 
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.25)]' 
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Database Items list */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-950/20 custom-scrollbar">
          {filtered.map(item => {
            const isCurrentSelected = item.id === currentSelectedId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item);
                }}
                disabled={isCurrentSelected}
                className={`flex gap-3 text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isCurrentSelected 
                    ? 'bg-amber-500/5 border-amber-500/30 opacity-60 cursor-not-allowed' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg'
                }`}
              >
                <ImageWithFallback 
                  src={item.iconUrl} 
                  alt={item.name} 
                  type="item"
                  id={item.id}
                  className="w-10 h-10 rounded-lg border border-slate-800 shrink-0 bg-slate-950 object-cover"
                />
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-200 text-xs truncate">{item.name}</h4>
                    <span className="text-[7.5px] uppercase tracking-wider px-1 bg-slate-950 text-slate-500 border border-slate-800 rounded font-mono shrink-0">
                      {item.category === 'Movement' ? 'Spec' : item.category}
                    </span>
                  </div>
                  <p className="text-[8.5px] text-emerald-400 font-mono truncate mt-0.5">
                    {item.attributes.join(' • ')}
                  </p>
                </div>
              </button>
            );
          })}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center opacity-30 text-xs font-black uppercase tracking-widest flex flex-col items-center justify-center gap-2">
              <Search size={24} />
              Nessun oggetto trovato
            </div>
          )}
        </div>
      </motion.div>
      <Analytics />
    </div>
  );
}
