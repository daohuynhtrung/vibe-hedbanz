'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Footballer } from '@/types/footballer';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  player: Footballer;
  questionCount: number;
  guessCount: number;
  onNextRound: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  player,
  questionCount,
  guessCount,
  onNextRound,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  let detectiveTitle = '👟 Gritty Finisher';
  let badgeColor = 'bg-zinc-700 text-zinc-200';

  if (questionCount <= 5) {
    detectiveTitle = "⚽ Ballon d'Or Detective (World Class)";
    badgeColor = 'bg-amber-400 text-zinc-950';
  } else if (questionCount <= 10) {
    detectiveTitle = '🏆 Premier Scout (Exceptional)';
    badgeColor = 'bg-yellow-500 text-zinc-950';
  } else if (questionCount <= 15) {
    detectiveTitle = '🎖️ Tactical Master (Great Job)';
    badgeColor = 'bg-blue-500 text-white';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-amber-500/50 rounded-3xl p-6 shadow-2xl relative text-zinc-100 flex flex-col items-center text-center">
        {/* Glow behind trophy */}
        <div className="absolute top-8 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/30 mb-3 animate-bounce">
          <Trophy className="w-9 h-9 stroke-[2.5]" />
        </div>

        <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-1 shadow ${badgeColor}`}>
          {detectiveTitle}
        </span>

        <h2 className="text-2xl font-black text-amber-300 mt-2">
          GOOOOAAAL! YOU WON!
        </h2>
        <p className="text-sm text-zinc-300 mt-1">
          You correctly identified <strong className="text-white font-bold">{player.name}</strong>!
        </p>

        {/* Stats card */}
        <div className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-2xl p-4 my-5 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-amber-400">{questionCount}</span>
            <span className="text-xs text-zinc-400 font-medium">Questions Asked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-amber-400">{guessCount}</span>
            <span className="text-xs text-zinc-400 font-medium">Guesses Made</span>
          </div>
        </div>

        {/* Player highlight */}
        <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-left mb-5">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Did You Know?
          </div>
          <p className="text-xs text-zinc-300 italic">
            &quot;{player.funFacts[0] || `${player.name} is one of the most celebrated footballers in history.`}&quot;
          </p>
        </div>

        <button
          onClick={onNextRound}
          type="button"
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black rounded-xl text-base transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
        >
          <span>Next Footballer</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
