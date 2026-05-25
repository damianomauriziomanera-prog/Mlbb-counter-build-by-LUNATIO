import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_ITEMS } from '../../data/items';
import { ImageWithFallback } from '../Common/ImageWithFallback';
import { X, Search, Scroll, CheckCircle, Info, RefreshCw } from 'lucide-react';

export function ItemEncyclopediaModal({ isOpen, onClose, inline }: { isOpen: boolean; onClose: () => void; inline?: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Scroll /> Enciclopedia Oggetti</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {OFFICIAL_ITEMS.map(item => (
            <div key={item.id} className="border border-slate-800 p-2 rounded-lg text-center bg-slate-950/50">
              <ImageWithFallback src={item.iconUrl} alt={item.name} type="item" id={item.id} className="w-12 h-12 mx-auto rounded object-cover border border-slate-800" />
              <h3 className="text-sm font-bold text-white mt-2 truncate px-1">{item.name}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}