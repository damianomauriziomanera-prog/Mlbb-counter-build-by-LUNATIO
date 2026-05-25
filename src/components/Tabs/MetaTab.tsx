
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, X, ArrowUpCircle, AlertCircle, RefreshCw, Star, Shield, Zap, Search, ArrowRight } from 'lucide-react';
import { HeroImageWithFallback } from '../Common/HeroImageWithFallback';
import { MetaHero } from '../../types';
import { HEROES } from '../../data/heroes';

export default function MetaTab({
  isInline = false,
  isMetaOpen,
  handleCloseTab,
  gamePatchVersion,
  isUpdating,
  handleUpdateMeta,
  metaSearch,
  setMetaSearch,
  metaRoleFilter,
  setMetaRoleFilter,
  metaSort,
  setMetaSort,
  metaSortDirection,
  setMetaSortDirection,
  filteredAndSortedMeta,
  selectedMetaHero,
  setSelectedMetaHero,
  calculateMetaScore
}: any) {
  // Rimosso controllo isMetaOpen e isInline iniziale per gestire il lazy loading meglio
  const renderMetaView = () => {
    
  
  return (
    <div className={isInline ? "w-full animate-fadeIn" : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"}>
      <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={isInline ? "bg-slate-900 border border-slate-850 rounded-2xl w-full flex flex-col min-h-[70vh] relative" : "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"}
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
                <button onClick={handleCloseTab} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
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
                              handleCloseTab();
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
                              handleCloseTab();
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
                                        handleCloseTab();
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
  );
};


  
  return renderMetaView();
}
