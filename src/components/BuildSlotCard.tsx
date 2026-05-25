import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BuildSlot } from '../types';
import { ImageWithFallback } from './Common/ImageWithFallback';
import { RefreshCw, X } from 'lucide-react';

export const BuildSlotCard: React.FC<{ 
  slot: BuildSlot; 
  idx: number; 
  isEditable?: boolean; 
  onTriggerSwap?: () => void; 
  onReset?: () => void; 
  isOverridden?: boolean;
}> = ({ slot, idx, isEditable, onTriggerSwap, onReset, isOverridden }) => {
  return (
    <div className="relative group border border-slate-800 rounded-lg p-2 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
      <div className="flex gap-3">
        <ImageWithFallback 
          src={slot.item.iconUrl} 
          alt={slot.item.name}
          id={slot.item.id}
          type="item"
          className="w-12 h-12 rounded object-cover border border-slate-700"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-white truncate">{slot.item.name}</h4>
            {isEditable && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isOverridden && onReset && (
                  <button onClick={onReset} className="text-slate-400 hover:text-amber-400 transition-colors" title="Ripristina originale">
                    <RefreshCw size={12} />
                  </button>
                )}
                {onTriggerSwap && (
                  <button onClick={onTriggerSwap} className="text-slate-400 hover:text-sky-400 transition-colors" title="Sostituisci">
                    <X size={12} className="rotate-45" />
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{slot.reason}</p>
        </div>
      </div>
    </div>
  );
};