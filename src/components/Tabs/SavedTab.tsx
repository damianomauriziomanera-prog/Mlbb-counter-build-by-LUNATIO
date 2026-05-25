import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Trash2 } from 'lucide-react';
import { SavedBuild } from '../../types';
import { HEROES } from '../../data/heroes';
import { HeroImageWithFallback } from '../Common/HeroImageWithFallback';
import { ImageWithFallback } from '../Common/ImageWithFallback';

interface SavedTabProps {
  isInline?: boolean;
  savedBuilds: SavedBuild[];
  handleCloseTab: () => void;
  loadSavedBuild: (build: SavedBuild) => void;
  deleteSavedBuild: (id: string) => void;
}

export default function SavedTab({
  isInline = false,
  savedBuilds,
  handleCloseTab,
  loadSavedBuild,
  deleteSavedBuild
}: SavedTabProps) {
  return (
    <div className={isInline ? "w-full animate-fadeIn" : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={isInline ? "bg-slate-900 border border-slate-850 rounded-2xl w-full flex flex-col min-h-[50vh] relative" : "bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-500 fill-rose-500/20" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">I Miei Salvataggi</h2>
          </div>
          {!isInline && (
            <button onClick={handleCloseTab} className="p-2 hover:bg-slate-805 rounded-lg text-slate-400">
              <X size={20} />
            </button>
          )}
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
  );
}
