'use client';

import React from 'react';
import { Footballer } from '@/types/footballer';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface GiveUpModalProps {
  isOpen: boolean;
  isConfirming: boolean;
  player: Footballer;
  onCancel: () => void;
  onConfirmGiveUp: () => void;
  onNextRound: () => void;
}

export const GiveUpModal: React.FC<GiveUpModalProps> = ({
  isOpen,
  isConfirming,
  player,
  onCancel,
  onConfirmGiveUp,
  onNextRound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative text-zinc-100 flex flex-col items-center text-center">
        {isConfirming ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-3">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-red-400">GIVE UP THIS ROUND?</h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-xs">
              Are you sure? The card on your headband will be revealed and you won&apos;t earn points for this player!
            </p>

            <div className="w-full grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={onCancel}
                type="button"
                className="py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-sm transition border border-zinc-700"
              >
                Keep Trying
              </button>
              <button
                onClick={onConfirmGiveUp}
                type="button"
                className="py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-sm transition shadow-lg shadow-red-600/30"
              >
                Reveal Answer
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              The Secret Footballer Was
            </span>

            {/* Player Avatar Thumbnail */}
            <div className="flex items-center gap-3 bg-zinc-800/80 border border-zinc-700 rounded-2xl p-2.5 mt-2 w-full max-w-xs shadow">
              {player.avatarUrl && (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-700 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={player.avatarUrl}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-left">
                <h3 className="text-base font-black text-amber-300 leading-tight uppercase">
                  {player.name}
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  {player.currentClub} • {player.nationality}
                </p>
              </div>
            </div>

            {/* Fact card */}
            <div className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3.5 my-5 text-left">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Trivia
              </div>
              <p className="text-xs text-zinc-300">
                {player.funFacts[0] || `${player.name} is one of football's finest talents.`}
              </p>
            </div>

            <button
              onClick={onNextRound}
              type="button"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-base transition flex items-center justify-center gap-2 shadow-xl"
            >
              <span>Play Next Round</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
