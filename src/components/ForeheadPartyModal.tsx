'use client';

import React from 'react';
import { Footballer } from '@/types/footballer';
import { X, Smartphone, Sparkles } from 'lucide-react';

interface ForeheadPartyModalProps {
  isOpen: boolean;
  player: Footballer;
  onClose: () => void;
}

export const ForeheadPartyModal: React.FC<ForeheadPartyModalProps> = ({
  isOpen,
  player,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-zinc-950 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <Smartphone className="w-4 h-4" />
          <span>Forehead Party Mode</span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="p-2 bg-black/20 hover:bg-black/30 rounded-full transition"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Center Giant Display for Friends to See */}
      <div className="flex flex-col items-center justify-center text-center my-auto px-4 max-w-lg">
        <div className="text-sm font-black tracking-widest uppercase bg-zinc-950 text-amber-300 px-4 py-1.5 rounded-full shadow-lg mb-4">
          ⚽ HEDBANZ CARD ⚽
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none drop-shadow-md text-zinc-950">
          {player.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base font-bold bg-white/30 backdrop-blur px-4 py-2 rounded-2xl shadow">
          <span>{player.position}</span>
          <span>•</span>
          <span>{player.nationality}</span>
          <span>•</span>
          <span>{player.currentClub}</span>
        </div>

        <p className="mt-6 text-xs sm:text-sm font-semibold max-w-xs text-zinc-900 bg-amber-400/50 p-3 rounded-xl border border-zinc-900/10">
          Hold this screen against your forehead so your friends can see your card, then ask them Yes/No questions!
        </p>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-md">
        <button
          onClick={onClose}
          type="button"
          className="w-full py-4 bg-zinc-950 text-amber-300 hover:bg-zinc-900 font-black rounded-2xl text-base transition shadow-2xl flex items-center justify-center gap-2"
        >
          <span>Return to Chat Mode</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
