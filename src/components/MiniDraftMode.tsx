import React, { useState } from 'react';

import { X, Search, Shield, Zap, Target, Sword, Crosshair, ChevronDown } from 'lucide-react';
import { Hero, RecommendedBuild, Lane, MetaHero } from '../types';
import { HeroImageWithFallback } from './Common/HeroImageWithFallback';
import { ImageWithFallback } from './Common/ImageWithFallback';

interface MiniDraftModeProps {
  heroes: Hero[];
  enemies: Hero[];
  myHero: Hero | null;
  lane: Lane;
  onAddEnemy: (id: string) => void;
  onRemoveEnemy: (id: string) => void;
  onSetMyHero: (id: string) => void;
  setLane: (l: Lane) => void;
  calculatedBuild: RecommendedBuild | null;
  onClose: () => void;
}

export function MiniDraftMode({
  heroes,
  enemies,
  myHero,
  lane,
  onAddEnemy,
  onRemoveEnemy,
  onSetMyHero,
  setLane,
  calculatedBuild,
  onClose
}: MiniDraftModeProps) {
  const [activeTab, setActiveTab] = useState<'nemici' | 'mio'>('nemici');
  const [search, setSearch] = useState('');

  const filteredHeroes = heroes.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  const isEnemySelected = (id: string) => enemies.some(e => e.id === id);
  const handleHeroClick = (h: Hero) => {
    if (activeTab === 'nemici') {
      if (isEnemySelected(h.id)) onRemoveEnemy(h.id);
      else if (enemies.length < 5) onAddEnemy(h.id);
    } else {
      onSetMyHero(h.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col font-sans overflow-hidden">
      {/* HEADER COMPATTO */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <Crosshair size={14} className="text-amber-500" />
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">In-Game Draft</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-500 hover:text-white bg-slate-800 rounded">
          <X size={14} />
        </button>
      </div>

      {/* SELEZIONE RAPIDA: Nemici e Tuo Eroe */}
      <div className="flex bg-slate-950 border-b border-slate-900 shrink-0 p-1 gap-1">
        <button 
          onClick={() => setActiveTab('nemici')}
          className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded ${activeTab === 'nemici' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 bg-slate-900'}`}
        >
          Nemici ({enemies.length}/5)
        </button>
        <button 
          onClick={() => setActiveTab('mio')}
          className={`flex-1 py-1 text-[9px] font-black uppercase tracking-wider rounded flex items-center justify-center gap-1 ${activeTab === 'mio' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-500 bg-slate-900'}`}
        >
          Il Tuo Eroe {myHero && <span className="text-white">({myHero.name})</span>}
        </button>
      </div>

      {/* GRIGLIA EROI SCORREVOLE */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-1 gap-1">
        <div className="relative shrink-0">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Cerca rapida..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded py-1 pl-6 pr-2 text-[10px] text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-1 pr-1 custom-scrollbar">
          {filteredHeroes.map(h => {
            const isSelected = activeTab === 'nemici' ? isEnemySelected(h.id) : myHero?.id === h.id;
            return (
              <button 
                key={h.id}
                onClick={() => handleHeroClick(h)}
                className={`relative aspect-square rounded border ${isSelected ? 'border-amber-500 scale-95 opacity-50' : 'border-slate-800'}`}
              >
                <HeroImageWithFallback src={h.iconUrl} name={h.name} id={h.id} className="w-full h-full object-cover rounded-sm" />
                {isSelected && <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center rounded-sm"><CheckCircle size={14} className="text-white"/></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* RISULTATO: BUILD IN UN RIGO */}
      {calculatedBuild && enemies.length > 0 && myHero ? (
        <div className="shrink-0 bg-slate-900 border-t border-amber-500/30 p-1.5 flex flex-col gap-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Build Perfetta</span>
            
            <div className="flex items-center gap-1">
              {['Jungle', 'Roam', 'Gold', 'Mid', 'Exp'].map(l => (
                <button 
                  key={l} 
                  onClick={() => setLane(l as Lane)}
                  className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${lane === l ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}
                >
                  {l.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-1 justify-center items-center">
            {/* Emblema & Spell */}
            <div className="flex flex-col gap-0.5 border-r border-slate-800 pr-1 mr-0.5">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-500">
                 <ImageWithFallback src={calculatedBuild.emblem.iconUrl} alt="Emblem" type="emblem" id={calculatedBuild.emblem.id} className="w-full h-full object-cover" />
              </div>
              <div className="w-6 h-6 rounded border border-slate-700">
                 <ImageWithFallback src={calculatedBuild.spell.iconUrl} alt="Spell" type="spell" id={calculatedBuild.spell.id} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* I 6 Oggetti */}
            {calculatedBuild.items.map((slot, i) => (
              <div key={i} className="relative w-8 h-8 rounded border border-slate-700 bg-slate-950 shrink-0">
                {slot.item && <ImageWithFallback src={slot.item.iconUrl} alt={slot.item.name} type="item" id={slot.item.id} className="w-full h-full object-cover rounded-sm" />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="shrink-0 bg-slate-900 border-t border-slate-800 p-2 text-center text-[9px] font-bold text-slate-500 uppercase">
          Inserisci 1+ Nemico e Il Tuo Eroe per vedere la Build
        </div>
      )}
    </div>
  );
}

// Icona Check Circle (necessaria visto che l'import sopra ne ha bisogno ma non volevo rompere il file)
function CheckCircle(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
}
