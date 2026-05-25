import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hero, Lane } from '../../types';
import { X, AlertTriangle, Send, Loader2, Info } from 'lucide-react';

export function ReportBugModal({ 
  isOpen, 
  onClose,
  userHero,
  lane,
  enemies,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  userHero: Hero | null;
  lane: Lane;
  enemies: Hero[];
  onSuccess: (msg: string) => void;
}) {
  const [text, setText] = useState('');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertTriangle className="text-amber-500" /> Segnala un Problema</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18}/></button>
        </div>
        <p className="text-xs text-slate-400 mb-4">Descrivi il problema o il suggerimento per migliorare la build. Verrà esaminato dal team.</p>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white mb-4 outline-none focus:border-amber-500 transition-colors" 
          placeholder="Il problema è..." 
        />
        <button 
          onClick={() => { 
            if(text.trim()) {
              onSuccess('Segnalazione inviata con successo!'); 
              setText('');
              onClose(); 
            }
          }} 
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send size={16} /> Invia Segnalazione
        </button>
      </div>
    </div>
  );
}