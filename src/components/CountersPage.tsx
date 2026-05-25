import React, { useState, useMemo } from 'react';
import { Search, Sword, Target, Shield, Zap, ChevronRight, X, AlertTriangle, Crosshair } from 'lucide-react';
import { HEROES } from '../data/heroes';
import { getCountersForHero } from '../data/counters';
import { calculateBuild } from '../lib/buildLogic';
import { HeroImageWithFallback } from './Common/HeroImageWithFallback';
import { ImageWithFallback } from './Common/ImageWithFallback';
import { OFFICIAL_ITEMS } from '../data/items';
import { EMBLEMS } from '../data/emblems';

export default function CountersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);

  // Filtra e ordina eroi
  const filteredHeroes = useMemo(() => {
    return HEROES.filter(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery]);

  const selectedHero = useMemo(() => {
    return HEROES.find(h => h.id === selectedHeroId) || null;
  }, [selectedHeroId]);

  // Calcola Dinamicamente la Core Build senza nemici (Base Identity)
  const coreBuild = useMemo(() => {
    if (!selectedHero) return null;
    // Passiamo un array vuoto di nemici per ottenere la build "perfetta" isolata
    return calculateBuild(selectedHero, 'Roam', []); // Il ruolo/lane è un placeholder qui
  }, [selectedHero]);

  // Ottieni Counters
  const counters = useMemo(() => {
    if (!selectedHero) return [];
    return getCountersForHero(selectedHero.id);
  }, [selectedHero]);

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans">
      {/* Intestazione */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-serif font-black text-white flex items-center gap-3 tracking-wide">
          <Crosshair className="text-rose-500" size={32} />
          <span>Cheat Sheet & <span className="text-rose-500">Counter Ufficiali</span></span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
          Seleziona un eroe per scoprire la sua **Build Core** (calcolata dall'intelligenza del builder) e i suoi **peggiori incubi**, spiegati tatticamente secondo le meccaniche ufficiali del mondo competitivo. Nessuna informazione casuale.
        </p>
      </div>

      {/* 3 Pannelli Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* PANNELLO 1: Lista Eroi (132 Campioni) */}
        <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl w-full lg:w-1/4 h-[400px] lg:h-[700px] flex-shrink-0 shadow-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800 shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Cerca Eroe..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3 px-1">
              {HEROES.length} Campioni Disponibili
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {filteredHeroes.map(hero => {
              const isSelected = selectedHeroId === hero.id;
              return (
                <button
                  key={hero.id}
                  onClick={() => setSelectedHeroId(hero.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-rose-500/10 border border-rose-500/50" 
                      : "hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} className="w-10 h-10 rounded-lg shrink-0 object-cover border border-slate-700" />
                  <div className="text-left flex-1 min-w-0">
                    <div className={`font-bold truncate ${isSelected ? "text-rose-400" : "text-slate-200"}`}>{hero.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase truncate">{hero.role}</div>
                  </div>
                  {isSelected && <ChevronRight size={16} className="text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENUTO PRINCIPALE: Build & Counters */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-auto min-h-[500px] lg:h-[700px] overflow-hidden shadow-lg relative">
          
          {!selectedHero ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center opacity-70">
              <Crosshair size={64} className="mb-4 text-slate-700" />
              <h3 className="text-xl font-bold font-serif text-slate-400 mb-2">Nessun eroe selezionato</h3>
              <p className="text-sm max-w-sm">
                Scegli un campione dalla lista a sinistra per generare la sua Cheat Sheet istantanea: Core Build e Counters ufficiali.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              
              {/* Intestazione Eroe */}
              <div className="relative p-6 lg:p-8 shrink-0 overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/40 to-slate-900/90 z-0"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] shrink-0">
                    <HeroImageWithFallback src={selectedHero.iconUrl} name={selectedHero.name} id={selectedHero.id} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h2 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-wide">{selectedHero.name}</h2>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="px-3 py-1 rounded bg-slate-800/80 text-rose-400 text-xs font-bold uppercase tracking-widest border border-slate-700">
                        {selectedHero.role}
                      </span>
                      <span className="px-3 py-1 rounded bg-slate-800/80 text-sky-400 text-xs font-bold uppercase tracking-widest border border-slate-700">
                        {selectedHero.damageType} Dmg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GRIGLIA A 2 COLONNE: CORE BUILD E COUNTERS */}
              <div className="flex-1 flex flex-col lg:flex-row p-6 lg:p-8 gap-8">
                
                {/* COLONNA CENTRALE: Core Build */}
                <div className="flex-1 lg:w-1/2 flex flex-col gap-4 border-r-0 lg:border-r border-slate-800 lg:pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="text-amber-400" size={20} />
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">Core Pro Build</h3>
                  </div>
                  
                  {coreBuild ? (
                    <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/60 shadow-inner">
                      
                      {/* Emblema & Spell */}
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/50 bg-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0">
                            <ImageWithFallback src={coreBuild.emblem.iconUrl} alt="Emblem" type="emblem" id={coreBuild.emblem.id} className="w-full h-full object-cover p-1" />
                          </div>
                          <div>
                            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Emblema</div>
                            <div className="text-sm font-semibold text-white">{coreBuild.emblem.name}</div>
                          </div>
                        </div>
                        
                        <div className="h-8 w-px bg-slate-800 mx-1"></div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                            <ImageWithFallback src={coreBuild.spell.iconUrl} alt="Spell" type="spell" id={coreBuild.spell.id} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">Spell</div>
                            <div className="text-sm font-semibold text-white">{coreBuild.spell.name}</div>
                          </div>
                        </div>
                      </div>

                      {/* I 6 Oggetti Fondamentali */}
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">I 6 Oggetti Meta</div>
                        <div className="grid grid-cols-3 gap-3">
                          {coreBuild.items.map((slot, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group">
                              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-sm relative">
                                {slot.item && (
                                  <ImageWithFallback 
                                    src={slot.item.iconUrl} 
                                    alt={slot.item.name} 
                                    type="item" 
                                    id={slot.item.id} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                  />
                                )}
                              </div>
                              <div className="text-center w-full">
                                <span className="text-[10px] font-semibold text-slate-300 leading-tight block truncate" title={slot.item?.name}>
                                  {slot.item?.name || '---'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm italic">Generazione build in corso...</div>
                  )}
                </div>

                {/* COLONNA DESTRA: I Peggiori Incubi (Counters) */}
                <div className="flex-1 lg:w-1/2 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-rose-500" size={20} />
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">Peggiori Counter</h3>
                  </div>

                  <div className="space-y-3">
                    {counters.length > 0 ? (
                      counters.map((counter, idx) => {
                        // Cerca se è un eroe
                        const counterHero = HEROES.find(h => h.id === counter.counterId);
                        // Altrimenti potrebbe essere un Item Counter
                        const counterItem = OFFICIAL_ITEMS.find(i => i.id === counter.counterId);
                        
                        const isItem = !!counterItem;
                        const name = isItem ? counterItem!.name : counterHero?.name || counter.counterId;
                        const iconUrl = isItem ? counterItem!.iconUrl : counterHero?.iconUrl || '';
                        
                        return (
                          <div key={idx} className="bg-slate-950/60 border border-rose-900/30 rounded-xl p-4 flex gap-4 hover:border-rose-500/50 transition-colors shadow-sm">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-900 relative">
                               {isItem ? (
                                  <ImageWithFallback src={iconUrl} alt={name} type="item" id={counter.counterId} className="w-full h-full object-cover p-1" />
                               ) : (
                                  <HeroImageWithFallback src={iconUrl} name={name} id={counter.counterId} className="w-full h-full object-cover" />
                               )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <div className="font-bold text-base text-rose-300 mb-1 flex items-center gap-2">
                                {isItem && <AlertTriangle size={14} className="text-amber-500" />}
                                {name}
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed overflow-hidden text-ellipsis line-clamp-3">
                                {counter.reason}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="bg-slate-950/60 rounded-xl p-6 text-center text-slate-500 italic border border-slate-800">
                        Nessun counter estremo documentato. Utilizza la build consigliata e gioca di squadra.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
