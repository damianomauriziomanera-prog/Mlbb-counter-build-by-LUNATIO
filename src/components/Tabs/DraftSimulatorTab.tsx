import React, { useState, useMemo } from 'react';
import { Hero } from '../../types';
import { HEROES } from '../../data/heroes';
import { analyzeDraft, DraftAnalysis } from '../../lib/draftLogic';
import { Search, Shield, X, Swords, AlertTriangle, Lightbulb, Info, Zap, ArrowRight, Target } from 'lucide-react';
import { HeroImageWithFallback } from '../Common/HeroImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

export default function DraftSimulatorTab() {
  const [alliedTeam, setAlliedTeam] = useState<Hero[]>([]);
  const [enemyTeam, setEnemyTeam] = useState<Hero[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetTeam, setTargetTeam] = useState<'allied' | 'enemy'>('allied');
  const [search, setSearch] = useState('');

  const analysis: DraftAnalysis = useMemo(() => {
    return analyzeDraft(alliedTeam, enemyTeam);
  }, [alliedTeam, enemyTeam]);

  const handleOpenModal = (team: 'allied' | 'enemy') => {
    const currentTeam = team === 'allied' ? alliedTeam : enemyTeam;
    if (currentTeam.length >= 5) return; // Team full
    setTargetTeam(team);
    setSearch('');
    setIsModalOpen(true);
  };

  const handleSelectHero = (hero: Hero) => {
    if (targetTeam === 'allied') {
      if (!alliedTeam.some(h => h.id === hero.id) && !enemyTeam.some(h => h.id === hero.id)) {
        setAlliedTeam([...alliedTeam, hero]);
      }
    } else {
      if (!alliedTeam.some(h => h.id === hero.id) && !enemyTeam.some(h => h.id === hero.id)) {
        setEnemyTeam([...enemyTeam, hero]);
      }
    }
    setIsModalOpen(false);
  };

  const handleRemoveHero = (heroId: string, team: 'allied' | 'enemy') => {
    if (team === 'allied') {
      setAlliedTeam(alliedTeam.filter(h => h.id !== heroId));
    } else {
      setEnemyTeam(enemyTeam.filter(h => h.id !== heroId));
    }
  };

  const filteredHeroes = HEROES.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) &&
    !alliedTeam.some(a => a.id === h.id) &&
    !enemyTeam.some(e => e.id === h.id)
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-rose-600/10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Swords size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 mb-2 flex items-center justify-center gap-3">
            <Swords className="text-white" /> Arena Strategica (Draft 5v5)
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Componi le squadre per simulare la fase di ban/pick. L'IA analizzerà le sinergie, i counter e calcolerà le probabilità di vittoria stimate!
          </p>
        </div>
      </div>

      {/* ARENA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        {/* TEAM ALLEATO */}
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2 border-b border-blue-900/50 pb-2">
            <Shield size={20} /> Team Alleato
          </h2>
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3, 4].map(index => {
              const hero = alliedTeam[index];
              return (
                <div key={index} className="relative h-16 bg-slate-950 border border-blue-900/30 rounded-lg flex items-center px-3 group overflow-hidden transition-all hover:border-blue-500/50">
                  {hero ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent"></div>
                      <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} className="w-12 h-12 rounded-full border border-blue-500/50 object-cover overflow-hidden relative z-10" />
                      <div className="ml-3 flex-1 relative z-10">
                        <div className="font-bold text-white leading-tight">{hero.name}</div>
                        <div className="text-[10px] text-blue-300 uppercase tracking-wider">{hero.role}</div>
                      </div>
                      <button 
                        onClick={() => handleRemoveHero(hero.id, 'allied')}
                        className="p-2 text-slate-500 hover:text-red-400 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleOpenModal('allied')}
                      className="w-full h-full flex items-center justify-center gap-2 text-blue-500/50 hover:text-blue-400 hover:bg-blue-950/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center font-bold text-sm">
                        +
                      </div>
                      <span className="font-medium text-sm">Seleziona</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TACHIMETRO / STATS CENTER */}
        <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
          <div className="text-center mb-6">
            <h3 className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Win Rate Stimato</h3>
            <div className="relative inline-flex items-center justify-center">
              {/* Cerchio Tachimetro semplice */}
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <circle 
                  cx="96" cy="96" r="80" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 80}`} 
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - analysis.winRate / 100)}`}
                  className={analysis.winRate >= 50 ? "text-blue-500 transition-all duration-1000 ease-out" : "text-rose-500 transition-all duration-1000 ease-out"} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${analysis.winRate >= 50 ? 'text-blue-400' : 'text-rose-400'}`}>
                  {analysis.winRate}%
                </span>
                <span className="text-xs text-slate-500 mt-1">Alleati</span>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center gap-2 mb-4">
            <div className="h-2 bg-blue-500 rounded-l-full transition-all duration-500" style={{ width: `${analysis.winRate}%` }}></div>
            <div className="h-2 bg-rose-500 rounded-r-full transition-all duration-500" style={{ width: `${100 - analysis.winRate}%` }}></div>
          </div>
          <div className="flex justify-between w-full text-xs font-bold px-1">
            <span className="text-blue-400">{analysis.winRate}% BLU</span>
            <span className="text-rose-400">{100 - analysis.winRate}% ROSSI</span>
          </div>

          <button 
            onClick={() => { setAlliedTeam([]); setEnemyTeam([]); }}
            className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <X size={14} /> Azzera Draft
          </button>
        </div>

        {/* TEAM NEMICO */}
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
          <h2 className="text-xl font-bold text-rose-400 mb-4 flex items-center justify-end gap-2 border-b border-rose-900/50 pb-2">
            Team Nemico <Target size={20} />
          </h2>
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3, 4].map(index => {
              const hero = enemyTeam[index];
              return (
                <div key={index} className="relative h-16 bg-slate-950 border border-rose-900/30 rounded-lg flex items-center px-3 group overflow-hidden transition-all hover:border-rose-500/50">
                  {hero ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-l from-rose-600/10 to-transparent"></div>
                      <button 
                        onClick={() => handleRemoveHero(hero.id, 'enemy')}
                        className="p-2 text-slate-500 hover:text-red-400 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <div className="mr-3 flex-1 text-right relative z-10">
                        <div className="font-bold text-white leading-tight">{hero.name}</div>
                        <div className="text-[10px] text-rose-300 uppercase tracking-wider">{hero.role}</div>
                      </div>
                      <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} className="w-12 h-12 rounded-full border border-rose-500/50 object-cover overflow-hidden relative z-10" />
                    </>
                  ) : (
                    <button 
                      onClick={() => handleOpenModal('enemy')}
                      className="w-full h-full flex items-center justify-center gap-2 text-rose-500/50 hover:text-rose-400 hover:bg-rose-950/30 transition-colors flex-row-reverse"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center font-bold text-sm">
                        +
                      </div>
                      <span className="font-medium text-sm">Seleziona</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ANALYSIS DETAILS */}
      {(alliedTeam.length > 0 || enemyTeam.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          
          {/* AVVISI E SINERGIA */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} /> Avvisi Sinergia
            </h3>
            {analysis.warnings.length > 0 ? (
              <ul className="space-y-3">
                {analysis.warnings.map((warn, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                    {warn}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-emerald-400 text-sm font-medium">
                <Shield size={20} /> Composizione ruoli e danni perfettamente bilanciata!
              </div>
            )}
          </div>

          {/* CONSIGLI BAN / PICK */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={20} /> Eroi Suggeriti
            </h3>
            {analysis.suggestions.length > 0 ? (
              <div>
                <p className="text-xs text-slate-400 mb-3">Basato sul meta attuale, sui ruoli mancanti e sui counter nemici:</p>
                <div className="grid grid-cols-3 gap-3">
                  {analysis.suggestions.map(hero => (
                    <button 
                      key={hero.id} 
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center cursor-pointer hover:border-amber-500/50 transition-colors w-full" 
                      onClick={() => {
                        if (alliedTeam.length < 5) {
                          setAlliedTeam([...alliedTeam, hero]);
                        }
                      }}
                      title="Clicca per aggiungere al Team Alleato"
                    >
                      <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} className="w-12 h-12 mx-auto rounded-full object-cover overflow-hidden border border-slate-700 mb-2" />
                      <div className="text-xs font-bold text-white truncate">{hero.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 text-center py-6">
                Inserisci alcuni nemici per ottenere suggerimenti di counter-pick.
              </div>
            )}
          </div>

          {/* DETTAGLIO COUNTER */}
          {analysis.detailedCounters.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-purple-400" size={20} /> Vantaggi Diretti (Counter)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.detailedCounters.map((c, i) => {
                  const ally = alliedTeam.find(h => h.id === c.allyId);
                  const enemy = enemyTeam.find(h => h.id === c.enemyId);
                  if (!ally || !enemy) return null;
                  return (
                    <div key={i} className="flex gap-3 bg-slate-950 border border-purple-500/20 p-3 rounded-lg items-center">
                       <HeroImageWithFallback src={ally.iconUrl} name={ally.name} id={ally.id} className="w-10 h-10 rounded overflow-hidden border border-blue-500/50" />
                       <ArrowRight size={16} className="text-purple-500" />
                       <HeroImageWithFallback src={enemy.iconUrl} name={enemy.name} id={enemy.id} className="w-10 h-10 rounded overflow-hidden border border-rose-500/50" />
                       <div className="flex-1 ml-2">
                          <div className="text-xs font-bold text-white"><span className="text-blue-400">{ally.name}</span> distrugge <span className="text-rose-400">{enemy.name}</span></div>
                          <p className="text-[10px] text-slate-400 line-clamp-2">{c.reason}</p>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* HERO SELECTION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-slate-900 border ${targetTeam === 'allied' ? 'border-blue-500/30' : 'border-rose-500/30'} rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Scegli l'Eroe</h2>
                  <p className={`text-sm ${targetTeam === 'allied' ? 'text-blue-400' : 'text-rose-400'}`}>
                    Per il Team {targetTeam === 'allied' ? 'Alleato' : 'Nemico'}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Cerca eroe per nome..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {filteredHeroes.map(hero => (
                    <button
                      key={hero.id}
                      onClick={() => handleSelectHero(hero)}
                      className="group flex flex-col items-center gap-2 p-2 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-500 hover:bg-slate-900 transition-all text-center"
                    >
                      <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 object-cover group-hover:border-amber-500 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-300 truncate w-full px-1">{hero.name}</span>
                    </button>
                  ))}
                  {filteredHeroes.length === 0 && (
                    <div className="col-span-full py-10 text-center text-slate-500">
                      Nessun eroe trovato o tutti gli eroi trovati sono già stati selezionati.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
