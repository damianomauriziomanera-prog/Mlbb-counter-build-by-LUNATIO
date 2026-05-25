import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HEROES } from '../../data/heroes';
import { HeroImageWithFallback } from '../Common/HeroImageWithFallback';
import { X, Search, BookOpen } from 'lucide-react';

export function HeroEncyclopediaModal({ isOpen, onClose, inline }: { isOpen: boolean; onClose: () => void; inline?: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen /> Enciclopedia Eroi</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {HEROES.map(hero => (
            <div key={hero.id} className="border border-slate-800 p-2 rounded-lg text-center bg-slate-950/50">
              <HeroImageWithFallback src={hero.iconUrl} name={hero.name} id={hero.id} role={hero.role} className="w-16 h-16 mx-auto rounded-full object-cover border border-slate-800" />
              <h3 className="text-sm font-bold text-white mt-2 truncate px-1">{hero.name}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{hero.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}