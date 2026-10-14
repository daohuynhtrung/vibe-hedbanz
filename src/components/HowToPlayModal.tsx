'use client';

import React from 'react';
import { X, HelpCircle, MessageSquare, Target, Trophy } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative text-zinc-100">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-300">HOW TO PLAY HEDBANZ</h2>
            <p className="text-xs text-zinc-400">The classic forehead guessing game, football edition!</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-zinc-300">
          <div className="flex gap-3 items-start bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
              <span className="font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-bold text-zinc-100 text-sm">Secret Footballer Card</h4>
              <p className="mt-0.5 text-zinc-400">
                A famous footballer is placed on your headband! You cannot see who they are, but RefBot knows everything about them.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-100 text-sm">Ask Yes/No Questions</h4>
              <p className="mt-0.5 text-zinc-400">
                Chat with RefBot! Ask about nationality, position, clubs, trophies, footedness, or whether they are retired.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-100 text-sm">Guess His Identity</h4>
              <p className="mt-0.5 text-zinc-400">
                Type the player&apos;s name directly (e.g. &quot;Messi&quot; or &quot;Is it Haaland?&quot;) or click &quot;Make a Guess&quot; to test your hunch.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
            <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-100 text-sm">Win or Give Up</h4>
              <p className="mt-0.5 text-zinc-400">
                Solve it in as few questions as possible to boost your detective rating. If you get stuck, click Give Up to reveal the card.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
          >
            Got It, Let&apos;s Play! ⚽
          </button>
        </div>
      </div>
    </div>
  );
};
