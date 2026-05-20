import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, CheckCircle, Target, Zap, Shield, Sword, Trophy, Star } from 'lucide-react';
import { Hero, DamageType, Lane, MetaHero } from '../types';
import { HeroImageWithFallback } from './Common/HeroImageWithFallback';

interface HeroGridProps {
  heroes: Hero[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  maxSelections?: number;
  disabledIds?: string[];
  accentColor?: string; // 'emerald' | 'red' | 'amber' etc.
  searchPlaceholder?: string;
  roleTranslations: Record<string, string>;
  currentLane?: Lane;
  metaHeroes?: MetaHero[];
}

export function HeroGrid({ 
  heroes, 
  selectedIds, 
  onSelect, 
  maxSelections = 1,
  disabledIds = [],
  accentColor = 'blue',
  searchPlaceholder = "Cerca eroe...",
  roleTranslations,
  currentLane,
  metaHeroes
}: HeroGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [damageFilter, setDamageFilter] = useState<'All' | DamageType>('All');

  // Helper per calcolare le lane consone agli eroi
  const getHeroLanes = (h: Hero): Lane[] => {
    const id = h.id.toLowerCase();
    const role = h.role.toLowerCase();
    const recommended: Lane[] = [];

    if (role.includes('assassin') || ['nolan', 'yin', 'fanny', 'hayabusa', 'helcurt', 'lancelot', 'ling', 'gusion', 'karina', 'roger', 'joy', 'alpha', 'martis', 'baxia', 'fredrinn', 'harley', 'granger', 'saber', 'aamon', 'alucard', 'julian'].includes(id)) {
      recommended.push('Jungle');
    }
    if (role.includes('marksman') || ['miya', 'layla', 'lesley', 'bruno', 'clint', 'karrie', 'moskov', 'claude', 'wanwan', 'hanabi', 'irithel', 'popol', 'brody', 'beatrix', 'melissa', 'natan', 'roger', 'harith', 'lunox'].includes(id)) {
      recommended.push('Gold');
    }
    if (role.includes('mage') || ['nana', 'vexana', 'pharsa', 'yve', 'novaria', 'odette', 'gord', 'lylia', 'luo yi', 'cecilion', 'change', 'aurora', 'valir', 'vale', 'kagura', 'kadita', 'xavier', 'lunox', 'zhask', 'faramis', 'harith'].includes(id)) {
      recommended.push('Mid');
    }
    if (role.includes('support') || (role.includes('tank') && !['uranus', 'edith', 'gloo'].includes(id)) || ['tigreal', 'minotaur', 'angela', 'floryn', 'estes', 'diggie', 'mathilda', 'kaja', 'franco', 'atlas', 'khufra', 'akai', 'carmilla', 'lolita', 'rafaela', 'johnson', 'chip', 'baxia', 'belerick', 'grock', 'hylos'].includes(id)) {
      recommended.push('Roam');
    }
    if (role.includes('fighter') || ['uranus', 'edith', 'gloo', 'esmeralda', 'barats', 'belerick', 'akai', 'alice', 'terizla', 'ruby', 'lapu-lapu', 'arlott'].includes(id)) {
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

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  const filteredHeroes = useMemo(() => {
    return heroes.filter(h => {
      const matchesRole = roleFilter === 'All' || h.role.includes(roleFilter);
      const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDamage = damageFilter === 'All' || h.damageType === damageFilter;
      return matchesRole && matchesSearch && matchesDamage;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [heroes, roleFilter, searchTerm, damageFilter]);

  const colorClassesMap = {
    emerald: {
      border: 'border-emerald-500',
      ring: 'ring-emerald-500/10',
      text: 'text-emerald-500',
      bgActive: 'bg-emerald-500',
      bgSoft: 'bg-emerald-500/10',
      focus: 'focus:border-emerald-500/50 focus:ring-emerald-500/20',
      icon: 'text-emerald-500'
    },
    red: {
      border: 'border-red-500',
      ring: 'ring-red-500/10',
      text: 'text-red-500',
      bgActive: 'bg-red-500',
      bgSoft: 'bg-red-500/10',
      focus: 'focus:border-red-500/50 focus:ring-red-500/20',
      icon: 'text-red-500'
    },
    amber: {
      border: 'border-amber-500',
      ring: 'ring-amber-500/10',
      text: 'text-amber-500',
      bgActive: 'bg-amber-500',
      bgSoft: 'bg-amber-500/10',
      focus: 'focus:border-amber-500/50 focus:ring-amber-500/20',
      icon: 'text-amber-500'
    },
    blue: {
      border: 'border-blue-500',
      ring: 'ring-blue-500/10',
      text: 'text-blue-500',
      bgActive: 'bg-blue-500',
      bgSoft: 'bg-blue-500/10',
      focus: 'focus:border-blue-500/50 focus:ring-blue-500/20',
      icon: 'text-blue-500'
    }
  };

  const colorClasses = colorClassesMap[accentColor as keyof typeof colorClassesMap] || colorClassesMap.blue;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative group/input">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:${colorClasses.icon} transition-colors`} size={16} />
          <input 
            type="text"
            placeholder={searchPlaceholder}
            className={`w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 pl-10 pr-10 text-xs text-slate-300 outline-none ${colorClasses.focus} transition-all font-medium`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(searchTerm || roleFilter !== 'All' || damageFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('All');
                setDamageFilter('All');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {roles.map(role => (
                <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer whitespace-nowrap ${
                    roleFilter === role 
                    ? `${colorClasses.bgActive} border-slate-800 text-slate-950 shadow-lg` 
                    : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                }`}
                >
                {roleTranslations[role] || role}
                </button>
            ))}
            </div>
            
            <div className="flex gap-1.5">
                {['All', 'Fisico', 'Magico', 'Puro'].map((d) => (
                    <button
                        key={d}
                        onClick={() => setDamageFilter(d as any)}
                        className={`flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded border transition-all ${
                            damageFilter === d
                                ? d === 'Fisico' ? 'bg-rose-500 border-rose-400 text-white' :
                                  d === 'Magico' ? 'bg-sky-500 border-sky-400 text-white' :
                                  d === 'Puro' ? 'bg-emerald-500 border-emerald-400 text-white' :
                                  'bg-slate-500 border-slate-400 text-white'
                                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                    >
                        {d === 'Fisico' && <Sword size={10} />}
                        {d === 'Magico' && <Zap size={10} />}
                        {d === 'Puro' && <Shield size={10} />}
                        {d}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar border border-slate-800 p-2 rounded bg-slate-950/30`}>
        {filteredHeroes.map(h => {
          const isSelected = selectedIds.includes(h.id);
          const isFull = selectedIds.length >= maxSelections && !isSelected;
          const isDisabled = isFull || disabledIds.includes(h.id);

          // Verifica se l'eroe è in meta o fuori meta per la lane corrente
          const metaHero = metaHeroes?.find(mh => mh.id === h.id);
          const isSuitableLane = currentLane ? getHeroLanes(h).includes(currentLane) : true;
          
          // Un eroe è "In Meta" se ha Tier S+/S ed è nella corsia corretta
          const isMeta = !!(metaHero && ['S+', 'S'].includes(metaHero.tier) && isSuitableLane);
          
          // Un eroe è "Fuori Meta" per questa corsia se non è adatto alla corsia o è Tier B/C
          const isOffMeta = !!(metaHeroes && (!isSuitableLane || (metaHero && ['B', 'C'].includes(metaHero.tier))));

          return (
            <motion.button
              key={h.id}
              disabled={isDisabled}
              onClick={() => onSelect(h.id)}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                isSelected 
                  ? `${colorClasses.border} ring-4 ${colorClasses.ring} shadow-lg` 
                  : isDisabled
                    ? 'border-slate-900 opacity-20 cursor-not-allowed grayscale'
                    : isMeta 
                      ? 'border-amber-500/80 shadow-md shadow-amber-500/10'
                      : isOffMeta
                        ? 'border-slate-800'
                        : 'border-slate-800 hover:border-slate-600'
              }`}
              title={`${h.name} (${h.role}) ${metaHero ? `- Tier: ${metaHero.tier}` : ''} ${isOffMeta ? '[Fuori Meta/Sconsigliato qui]' : ''}`}
            >
              <HeroImageWithFallback 
                src={h.iconUrl} 
                name={h.name} 
                id={h.id}
                role={h.role}
                className={`w-full h-full object-cover transition-all ${
                  isSelected 
                    ? 'opacity-100' 
                    : isDisabled 
                      ? 'opacity-50'
                      : 'opacity-100 hover:brightness-110'
                }`}
              />
              
              {/* Badge Meta-Tier S/S+ */}
              {isMeta && metaHero && (
                <div className="absolute top-0.5 left-0.5 bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-sans text-[7px] font-black px-1 py-0.2 rounded shadow-md flex items-center gap-0.5 uppercase tracking-tighter">
                  <Star size={6} className="fill-slate-950" />
                  {metaHero.tier}
                </div>
              )}

              {/* Badge Fuori Meta / Corsia Sconsigliata */}
              {isOffMeta && (
                <div className="absolute top-0.5 right-0.5 bg-red-950/90 text-red-400 border border-red-500/20 font-sans text-[6px] font-bold px-1 py-0.2 rounded uppercase tracking-widest scale-90">
                  OFF
                </div>
              )}

              {isSelected && (
                <div className={`absolute inset-0 ${colorClasses.bgSoft} flex items-center justify-center bg-slate-950/55`}>
                  {maxSelections === 1 ? <CheckCircle size={20} className={colorClasses.text} /> : <X size={20} className={colorClasses.text} />}
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 py-0.5 bg-gradient-to-t from-slate-950 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[7px] font-black text-white truncate px-1 block text-center">
                  {h.name}
                </span>
              </div>
            </motion.button>
          );
        })}
        {filteredHeroes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-600 text-[10px] text-center">
            <Search size={22} className="mb-1 opacity-25" />
            Nessun eroe trovato
          </div>
        )}
      </div>
    </div>
  );
}
