import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EMBLEMS, GLOBAL_TALENTS } from '../../data/emblems';
import { SPELLS } from '../../data/spells';
import { ImageWithFallback } from '../Common/ImageWithFallback';
import { X, Shield, Zap, Sparkles, BookOpen, Layers } from 'lucide-react';

export function EmblemEncyclopediaModal({ isOpen, onClose, inline }: { isOpen: boolean; onClose: () => void; inline?: boolean }) {
  const [activeTab, setActiveTab] = useState<'emblems' | 'talents' | 'spells'>('emblems');
  const [selectedEmblemId, setSelectedEmblemId] = useState<string>('basic');

  if (!isOpen) return null;

  const content = (
    <div className={`bg-slate-900 border-slate-700 w-full flex flex-col ${inline ? 'h-full' : 'border rounded-xl max-w-4xl max-h-[90vh]'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/50">
        <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-widest">
          <BookOpen className="text-purple-500" />
          Arsenale <span className="text-slate-500 font-mono text-sm tracking-normal">Pre-Partita</span>
        </h2>
        {!inline && (
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap p-4 gap-2 border-b border-slate-800 bg-slate-900/50">
        <button 
          onClick={() => setActiveTab('emblems')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
            activeTab === 'emblems' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
          }`}
        >
          <Shield size={18} />
          Emblemi
        </button>
        <button 
          onClick={() => setActiveTab('talents')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
            activeTab === 'talents' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
          }`}
        >
          <Layers size={18} />
          Talenti Globali
        </button>
        <button 
          onClick={() => setActiveTab('spells')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${
            activeTab === 'spells' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
          }`}
        >
          <Zap size={18} />
          Spells
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'emblems' && (
            <motion.div 
              key="emblems"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6"
            >
              {/* Emblems List (Responsive Grid) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.values(EMBLEMS).map((emb) => (
                  <button
                    key={emb.id}
                    onClick={() => setSelectedEmblemId(emb.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all text-center ${
                      selectedEmblemId === emb.id
                        ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback src={emb.iconUrl} alt={emb.name} type="emblem" id={emb.id} className="w-12 h-12 object-cover drop-shadow-md" />
                    <div>
                      <div className="font-bold text-slate-200 text-xs uppercase tracking-wider">{emb.name}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Emblem Details */}
              <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 shadow-inner">
                {(() => {
                  const activeEmblem = Object.values(EMBLEMS).find(e => e.id === selectedEmblemId);
                  if (!activeEmblem) return null;
                  
                  return (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-800 text-center sm:text-left">
                        <ImageWithFallback src={activeEmblem.iconUrl} alt={activeEmblem.name} type="emblem" id={activeEmblem.id} className="w-20 h-20 object-cover drop-shadow-xl" />
                        <div>
                          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Emblema {activeEmblem.name}
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">Statistiche Bonus Base garantite dal set.</p>
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-5 border border-slate-800/50">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-center sm:justify-start gap-2">
                          <Shield size={14} className="text-indigo-400" />
                          Statistiche Attive
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {activeEmblem.stats.map((stat, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-indigo-200 font-bold font-mono text-sm shadow-sm hover:border-indigo-500/30 transition-colors">
                              <Sparkles size={16} className="text-indigo-500/50 shrink-0" />
                              {stat}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-5 italic text-center sm:text-left">
                          I talenti ora sono slegati dagli emblemi. Puoi equipaggiare qualsiasi talento su questo emblema dalla scheda "Talenti Globali".
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {activeTab === 'talents' && (
            <motion.div 
              key="talents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {Object.entries(GLOBAL_TALENTS).map(([tierKey, talentsList]) => (
                <div key={tierKey} className="bg-slate-900 rounded-lg p-5 border border-slate-800/50">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers size={16} className={tierKey === 'tier3' ? 'text-amber-500' : 'text-amber-700'} /> 
                    {tierKey === 'tier1' ? 'Tier 1 (Attributi Base Estesi)' : tierKey === 'tier2' ? 'Tier 2 (Abilità Ausiliarie)' : 'Tier 3 (Talento Core)'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {talentsList.map(talent => (
                      <div key={talent.id} className="flex items-start gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-all group">
                        <ImageWithFallback src={talent.iconUrl} alt={talent.name} type="talent" id={talent.id} className="w-10 h-10 rounded-full border border-slate-700 shadow-sm shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className={`font-bold text-sm ${tierKey === 'tier3' ? 'text-amber-400' : 'text-amber-200'}`}>{talent.name}</div>
                          <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{talent.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'spells' && (
            <motion.div 
              key="spells"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {Object.values(SPELLS).map(spell => (
                <div key={spell.id} className="bg-slate-950 rounded-xl border border-slate-800 p-4 hover:border-fuchsia-500/30 transition-all group">
                  <div className="flex items-center gap-4 mb-3">
                    <ImageWithFallback src={spell.iconUrl} alt={spell.name} type="spell" id={spell.id} className="w-12 h-12 rounded-lg border border-slate-700 shadow-md group-hover:scale-105 transition-transform" />
                    <div>
                      <h3 className="font-bold text-fuchsia-400 text-lg">{spell.name}</h3>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Battle Spell</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed min-h-[60px]">{spell.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {content}
    </div>
  );
}
