import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Trophy, Crosshair, AlertCircle, RefreshCw } from 'lucide-react';
import { Hero } from '../types';
import { HeroImageWithFallback } from './Common/HeroImageWithFallback';
import { MatchData, generateSimulatedMatches, analyzeMatches } from '../lib/matchSimulator';

interface MatchAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userHero?: Hero;
}

export function MatchAnalyzerModal({ isOpen, onClose, userHero }: MatchAnalyzerModalProps) {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ averageKda: string, winRate: string, suggestion: string } | null>(null);

  const loadMatches = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const generatedMatches = generateSimulatedMatches(userHero, 5);
      setMatches(generatedMatches);
      setAnalysis(analyzeMatches(generatedMatches));
      setIsLoading(false);
    }, 1200);
  };

  useEffect(() => {
    if (isOpen) {
      loadMatches();
    }
  }, [isOpen, userHero]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700/50 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <h2 className="text-xl font-serif text-amber-500 flex items-center gap-2">
            <Activity size={24} /> 
            Analisi Performance {userHero ? `per ${userHero.name}` : 'Recenti'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
              <RefreshCw size={32} className="animate-spin text-amber-500" />
              <p>Sincronizzazione dati utente in corso...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistiche Globali */}
              {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-4 flex items-center gap-4">
                     <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
                        <Trophy size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Win Rate</p>
                        <p className="text-2xl font-bold text-white max-w-[150px] truncate">{analysis.winRate}</p>
                     </div>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-4 flex items-center gap-4">
                     <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                        <Crosshair size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">KDA Medio</p>
                        <p className="text-2xl font-bold text-white max-w-[150px] truncate">{analysis.averageKda}</p>
                     </div>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-4 flex items-center gap-4">
                     <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Activity size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Partite Analizzate</p>
                        <p className="text-2xl font-bold text-white">{matches.length}</p>
                     </div>
                  </div>
                </div>
              )}

              {/* Suggerimento */}
              {analysis && (
                 <div className="bg-slate-800/40 border border-indigo-500/30 rounded-lg p-4 flex gap-4">
                    <AlertCircle className="text-indigo-400 shrink-0 mt-1" />
                    <div>
                       <h4 className="text-sm font-bold text-indigo-300 mb-1 tracking-wide uppercase font-mono">Insight Contestuale</h4>
                       <p className="text-slate-300 text-sm leading-relaxed">{analysis.suggestion}</p>
                    </div>
                 </div>
              )}

              {/* Lista Partite */}
              <div className="space-y-3">
                 <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg shadow-sm font-serif text-white">Cronologia Partite</h3>
                    <button onClick={loadMatches} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors text-slate-300">
                       Ricarica Dati
                    </button>
                 </div>
                 
                 {matches.map((match) => (
                    <div key={match.id} className={`flex flex-col md:flex-row gap-4 p-4 border rounded-lg overflow-hidden relative ${match.result === 'Vittoria' ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-rose-950/20 border-rose-900/30'}`}>
                       <div className={`absolute top-0 left-0 w-1 h-full ${match.result === 'Vittoria' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                       
                       <div className="flex-1 flex flex-col justify-center pl-2">
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-black uppercase tracking-wider ${match.result === 'Vittoria' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                 {match.result}
                              </span>
                              {match.mvp && (
                                 <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    MVP
                                 </span>
                              )}
                              <span className="text-xs text-slate-500">{match.durationInMinutes} Minuti</span>
                           </div>
                           <div className="flex items-end gap-3 mt-2">
                              <div className="text-xl font-bold font-mono tracking-tight text-white">
                                 {match.kills} <span className="text-slate-500 text-sm">/</span> {match.deaths} <span className="text-slate-500 text-sm">/</span> {match.assists}
                              </div>
                              <div className="text-xs text-slate-400 pb-1">
                                  Score: <span className="text-slate-200">{match.score}</span>
                              </div>
                           </div>
                       </div>

                       <div className="flex-1 flex flex-col justify-center">
                          <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-mono">Build Adottata</p>
                          <div className="flex gap-1.5 flex-wrap">
                               {match.build.map((item, idx) => (
                                 <div key={idx} className="w-8 h-8 rounded border border-slate-700 bg-slate-900 overflow-hidden relative group">
                                     <img src={item.iconUrl} alt={item.name} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                                         <span className="text-[8px] text-white font-mono leading-none px-1 text-center truncate w-full">{item.name}</span>
                                     </div>
                                 </div>
                               ))}
                          </div>
                       </div>

                       <div className="flex-1 flex flex-col justify-center">
                           <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wider font-mono">Contro (Avversari)</p>
                           <div className="flex gap-1">
                                {match.enemyHeroes.map((enemy, idx) => (
                                    <div key={idx} className="w-8 h-8 rounded-full border border-slate-700 overflow-hidden" title={enemy.name}>
                                        <HeroImageWithFallback src={enemy.iconUrl} name={enemy.name} className="w-full h-full object-cover grayscale-[30%]" />
                                    </div>
                                ))}
                           </div>
                       </div>

                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
